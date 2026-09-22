import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjectTags, projects } from '../data/projects.js'

export default function ProjectGrid() {
  const [activeTag, setActiveTag] = useState('All')
  const visibleProjects = activeTag === 'All'
    ? projects
    : projects.filter((project) => project.tags.includes(activeTag))

  return (
    <div className="project-grid-wrap">
      <div className="project-filters" aria-label="Filter projects">
        {getProjectTags().map((tag) => (
          <button
            aria-pressed={activeTag === tag}
            className="filter-button"
            key={tag}
            onClick={() => setActiveTag(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.slug}>
            <div className={`project-card-planet project-card-planet--${project.cover.tone}`} aria-hidden="true"><span /></div>
            <div>
              <p className="project-meta">{project.eyebrow} · {project.year}</p>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <ul aria-label={`${project.title} tags`}>
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <Link to={`/projects/${project.slug}`}>Open case study <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
