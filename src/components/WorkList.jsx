// WorkList: the project rows (year, title, summary), each linking to /work/<slug>.
// used on /home (featured only) and /work (filtered). data comes from src/data/projects.js.
import { Link } from 'react-router-dom'

export default function WorkList({ projects }) {
  return (
    <div className="work-list">
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link to={`/work/${project.slug}`}>
              {/* KNOB: what each row shows. drop or reorder these spans (styles: .work-* in site.css) */}
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
