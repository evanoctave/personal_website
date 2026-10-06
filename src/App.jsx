// The router: picks which page shows for each URL, plus the page-warp transition between pages.
// main.jsx renders this. pages are in src/pages/, the shared header/nav/footer is components/SiteShell.jsx,
// the warp and printer intro are in src/fx/ (PageWarp.jsx, PrinterIntro.jsx).
import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import SiteShell from './components/SiteShell.jsx'
import { FxProvider, prefersReducedMotion } from './fx/FxProvider.jsx'
import PageWarp from './fx/PageWarp.jsx'
import { willPrint } from './fx/PrinterIntro.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ConstructionPage from './pages/ConstructionPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LifePage from './pages/LifePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import WorkPage from './pages/WorkPage.jsx'

function LegacyProjectRedirect() {
  const { slug } = useParams()
  return <Navigate replace to={`/work/${slug}`} />
}

// no matchMedia means a test runner or something ancient: just swap pages
// KNOB: page-warp switch. make this return false to turn the warp off and just swap pages instantly
const canWarp = () => typeof window.matchMedia === 'function' && !prefersReducedMotion()

// Holds the old page on screen while the warp closes over it, then lets the
// router's real location through once the screen is covered.
function WarpRoutes({ children }) {
  const location = useLocation()
  const [previous, setPrevious] = useState(location)
  const [frozen, setFrozen] = useState(null)
  const [warp, setWarp] = useState(null)

  // Decided during render, not in an effect: an effect would commit the new page for
  // one render before freezing the old one, so the new route would mount, run its
  // effects (title, scroll, focus), then get swapped back out.
  if (location !== previous) {
    setPrevious(location)
    const moved = previous.pathname !== location.pathname
    // mid-warp: the old page stays frozen until covered, which then shows the newest location.
    // first visit to home: the printer intro is the transition.
    // KNOB: when a warp plays. drop the `location.pathname === '/home' && willPrint()` part to warp into home
    // even on the first visit (the printer intro would then play under the warp)
    if (moved && !warp && canWarp() && !(location.pathname === '/home' && willPrint())) {
      setFrozen(previous)
      setWarp({ id: location.key, from: previous.pathname, to: location.pathname })
    }
  }

  return (
    <>
      <Routes location={frozen ?? location}>{children}</Routes>
      {warp && (
        <PageWarp
          from={warp.from}
          key={warp.id}
          onCovered={() => setFrozen(null)}
          onDone={() => setWarp(null)}
          to={warp.to}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <FxProvider>
      <WarpRoutes>
        {/* KNOB: "/" is the under-construction gate. point it at <HomePage /> to open the real site there */}
        {/* (App.test.jsx expects the gate at "/", so update that test too) */}
        <Route path="/" element={<ConstructionPage />} />
        {/* KNOB: the site URLs, path -> page. adding a page: add a Route here, its tab title */}
        {/* in SiteShell.jsx, and a nav link there. optionally a number key in src/fx/FxProvider.jsx ROUTES */}
        {/* and src/fx/PageWarp.jsx ORDER */}
        <Route element={<SiteShell />}>
          <Route path="home" element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
          {/* old /projects urls bounce to /work (App.test.jsx loads /projects/<slug> to check this) */}
          <Route path="projects" element={<Navigate replace to="/work" />} />
          <Route path="projects/:slug" element={<LegacyProjectRedirect />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="life" element={<LifePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </WarpRoutes>
    </FxProvider>
  )
}
