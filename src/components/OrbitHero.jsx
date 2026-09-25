import { Link } from 'react-router-dom'
import { projects } from '../data/projects.js'

export default function OrbitHero() {
  return (
    <section className="orbit-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Independent creative developer · Los Angeles / Remote</p>
        <h1 id="hero-title">Interfaces with a point of view.</h1>
        <p className="hero-intro">I design and build clear, expressive digital products for teams doing meaningful work.</p>
        <Link className="button-link button-link--bright" to="/projects">View selected work ↗</Link>
      </div>

      <div className="orbit-stage" aria-label="Project orbit">
        <div className="hero-card"><span className="hero-card__number">{String(projects.length).padStart(2, '0')}</span><h2>Selected projects. Built for use.</h2><p>Product systems and machine-learning prototypes.</p></div>
        <div className="sr-only">{projects.map((project) => <Link key={project.slug} to={`/projects/${project.slug}`}>Open {project.title} project</Link>)}</div>
        <p className="hero-stamp">Design / Build / Refine</p>
      </div>
    </section>
  )
}
