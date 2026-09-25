import { Link } from 'react-router-dom'
import OrbitHero from '../components/OrbitHero.jsx'
import ProjectWorkbench from '../components/ProjectWorkbench.jsx'

export default function HomePage() {
  return (
    <div className="home-page">
      <OrbitHero />
      <ProjectWorkbench />
      <section className="home-intro page-frame">
        <p className="eyebrow">Working principles</p>
        <h2>Good work feels inevitable in hindsight.</h2>
        <p>Start with the sharpest question, make the system legible, then sweat the last ten percent. This portfolio is a living workbench: drag ideas around, add references, and keep making.</p>
        <Link className="text-link" to="/projects">Browse all projects <span aria-hidden="true">→</span></Link>
        <Link className="text-link" to="/about">More about how I work <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  )
}
