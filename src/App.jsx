import { useLayoutEffect, useRef, useState } from 'react'
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
  const previous = useRef(location)
  const [frozen, setFrozen] = useState(null)
  const [warp, setWarp] = useState(null)

  useLayoutEffect(() => {
    const from = previous.current
    previous.current = location
    if (from.pathname === location.pathname) return
    // mid-warp: still closing keeps the old page frozen until covered, which then shows the newest location
    if (warp) return
    if (!canWarp()) return
    // first visit to home: the printer intro is the transition
    if (location.pathname === '/home' && willPrint()) return
    setFrozen(from)
    setWarp({ id: location.key, from: from.pathname, to: location.pathname })
  }, [location, warp])

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
