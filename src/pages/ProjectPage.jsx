import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'
import { getAdjacentProjects, getProjectBySlug } from '../data/projects.js'
import NotFoundPage from './NotFoundPage.jsx'

// Default gallery slots until a project has `gallery: [{ src, alt, ratio }]`.
const EMPTY_GALLERY = [
  { label: 'Screenshot 01', ratio: '16 / 10' },
  { label: 'Screenshot 02', ratio: '4 / 5' },
  { label: 'Screenshot 03', ratio: '4 / 5' },
  { label: 'Screenshot 04', ratio: '21 / 9' },
]

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const { next } = getAdjacentProjects(slug)
  const gallery = project.gallery?.length ? project.gallery : EMPTY_GALLERY
  const links = [
    project.liveUrl && ['Live site', project.liveUrl],
    project.codeUrl && ['Source', project.codeUrl],
    project.githubUrl && ['GitHub', project.githubUrl],
  ].filter(Boolean)

  return (
    <article className="page project">
      <Link className="text-link back-link" data-cursor="BACK" to="/work">← All work</Link>
      <p className="eyebrow">{project.eyebrow} · {project.year}</p>
      <h1 className="page-title page-title--project"><Scramble text={project.title} /></h1>
      <p className="project-summary">{project.summary}</p>

      <Placeholder alt={project.cover?.alt} className="project-cover" label={`${project.title} cover`} ratio="16 / 9" src={project.cover?.src} />

      <div className="project-body">
        <aside className="project-facts" aria-label="Project facts">
          <dl>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Stack</dt><dd>{project.stack.join(', ')}</dd></div>
          </dl>
          {links.length > 0 && (
            <ul className="project-links">
              {links.map(([label, href]) => (
                <li key={href}><a data-cursor="OPEN" href={href} rel="noreferrer" target="_blank">{label} ↗</a></li>
              ))}
            </ul>
          )}
        </aside>
        <div className="project-story">
          {[['Challenge', project.challenge], ['Solution', project.solution], ['Outcome', project.outcome]].map(([title, body], i) => (
            <Reveal as="section" key={title}>
              <p className="eyebrow">0{i + 1}</p>
              <h2>{title}</h2>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <section aria-label="Gallery" className="project-gallery">
        {gallery.map((item, i) => (
          <Reveal delay={i * 60} key={item.src ?? item.label}>
            <Placeholder alt={item.alt} label={item.label ?? `Screenshot ${i + 1}`} ratio={item.ratio ?? '16 / 10'} src={item.src} />
          </Reveal>
        ))}
      </section>

      {next && next.slug !== project.slug && (
        <Link className="next-project" data-cursor="NEXT" to={`/work/${next.slug}`}>
          <span className="eyebrow">Next project</span>
          <span className="next-title">{next.title} →</span>
        </Link>
      )}
    </article>
  )
}
