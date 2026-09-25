import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import SiteShell from './components/SiteShell.jsx'
import { FxProvider } from './fx/FxProvider.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import WorkPage from './pages/WorkPage.jsx'

function LegacyProjectRedirect() {
  const { slug } = useParams()
  return <Navigate replace to={`/work/${slug}`} />
}

export default function App() {
  return (
    <FxProvider>
      <Routes>
        <Route element={<SiteShell />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
          <Route path="projects" element={<Navigate replace to="/work" />} />
          <Route path="projects/:slug" element={<LegacyProjectRedirect />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </FxProvider>
  )
}
