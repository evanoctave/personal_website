import { Link } from 'react-router-dom'
import { projects } from '../data/projects.js'

export default function OrbitHero() {
  return (
    <section className="orbit-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Designing worlds, one strange idea at a time</p>
        <h1 id="hero-title">Portfolio at escape velocity</h1>
        <p className="hero-intro">Replace this with your sharpest one-line introduction. Each planet below leads to a reusable project page.</p>
        <Link className="button-link button-link--bright" to="/projects">Explore all worlds</Link>
      </div>

      <div className="orbit-stage" aria-label="Project orbit">
        <span className="orbit-track orbit-track--outer" aria-hidden="true" />
        <span className="orbit-track orbit-track--inner" aria-hidden="true" />
        <span className="hero-moon hero-moon--one" aria-hidden="true" />
        <span className="hero-moon hero-moon--two" aria-hidden="true" />
        <div className="hero-core" aria-hidden="true"><span /></div>
        {projects.map((project) => (
          <Link
            className={`orbit-planet orbit-planet--${project.orbit.size}`}
            key={project.slug}
            style={{ '--orbit-angle': `${project.orbit.angle}deg`, '--planet-tone': `var(--${project.orbit.color})` }}
            to={`/projects/${project.slug}`}
            aria-label={`Open ${project.title} project`}
          >
            <span aria-hidden="true" />
            <b>{project.title}</b>
            <small>{project.eyebrow}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}
