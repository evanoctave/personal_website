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
        <Route path="/" element={<ConstructionPage />} />
        <Route element={<SiteShell />}>
          <Route path="home" element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
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
