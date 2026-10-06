import { Link } from 'react-router-dom'

export default function WorkList({ projects }) {
  return (
    <div className="work-list">
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link to={`/work/${project.slug}`}>
              <span className="work-year">{project.year}</span>
              <span className="work-title">{project.title}</span>
              <span className="work-summary">{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
