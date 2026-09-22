import { Link } from 'react-router-dom'
import TemplateNotice from './TemplateNotice.jsx'

export default function ProjectDetail({ project, previous, next }) {
  return (
    <article className="project-detail">
      <header className={`detail-cover detail-cover--${project.cover.tone}`}>
        <div className="detail-cover-planet" aria-hidden="true"><span /></div>
        <div>
          <p className="eyebrow">{project.eyebrow} · {project.year}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
      </header>

      <div className="detail-layout">
        <aside className="detail-facts" aria-label="Project facts">
          <p><span>Role</span>{project.role}</p>
          <div>
            <span>Stack</span>
            <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </aside>

        <div className="detail-story">
          <section aria-labelledby="challenge-title">
            <p className="eyebrow">01</p>
            <h2 id="challenge-title">Challenge</h2>
            <p>{project.challenge}</p>
          </section>
          <section aria-labelledby="solution-title">
            <p className="eyebrow">02</p>
            <h2 id="solution-title">Solution</h2>
            <p>{project.solution}</p>
          </section>
          <section aria-labelledby="outcome-title">
            <p className="eyebrow">03</p>
            <h2 id="outcome-title">Outcome</h2>
            <p>{project.outcome}</p>
          </section>

          {project.gallery.length > 0 && (
            <section aria-labelledby="gallery-title">
              <p className="eyebrow">04</p>
              <h2 id="gallery-title">Gallery</h2>
              <div className="gallery-grid">
                {project.gallery.map((item) => <img alt={item.alt} key={item.src} src={item.src} />)}
              </div>
            </section>
          )}

          {(project.liveUrl || project.codeUrl) && (
            <div className="detail-links">
              {project.liveUrl && <a href={project.liveUrl} rel="noreferrer" target="_blank">Visit live site</a>}
              {project.codeUrl && <a href={project.codeUrl} rel="noreferrer" target="_blank">View source code</a>}
            </div>
          )}

          <TemplateNotice />
        </div>
      </div>

      <nav className="project-pagination" aria-label="Project navigation">
        <Link to={`/projects/${previous.slug}`}>Previous: {previous.title}</Link>
        <Link to={`/projects/${next.slug}`}>Next: {next.title}</Link>
      </nav>
    </article>
  )
}
