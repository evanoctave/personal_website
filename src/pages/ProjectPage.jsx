import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import { getAdjacentProjects, getProjectBySlug } from '../data/projects.js'
import NotFoundPage from './NotFoundPage.jsx'

// until a project has its own gallery: [{ src, alt, ratio }]
const emptyGallery = [
  { label: 'screenshot', ratio: '16 / 10' },
  { label: 'screenshot', ratio: '16 / 10' },
]

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const { next } = getAdjacentProjects(slug)
  const gallery = project.gallery?.length ? project.gallery : emptyGallery
  // phone apps lead with a row of screenshots instead of a cropped 16:9 cover
  const phone = project.layout === 'phone'
  const links = [
    project.liveUrl && ['Live site', project.liveUrl],
    project.codeUrl && ['Source', project.codeUrl],
    project.githubUrl && ['GitHub', project.githubUrl],
    project.devpostUrl && ['Devpost', project.devpostUrl],
  ].filter(Boolean)
  const shots = (
    <div className={`gallery${phone ? ' gallery--phones' : gallery.length === 2 ? ' gallery--two' : ''}`}>
      {gallery.map((item, i) => (
        <Placeholder alt={item.alt} caption={item.caption} key={item.src ?? i} label={item.label ?? 'screenshot'} position={item.position} ratio={item.ratio ?? '16 / 10'} src={item.src} />
      ))}
    </div>
  )

  return (
    <article className="page project">
      <p><Link to="/work">← back</Link></p>
      <h1>{project.title}</h1>
      <p className="muted">{project.eyebrow}, {project.year}. {project.role}.</p>
      <p className="lede">{project.summary}</p>

      {phone ? shots : <Placeholder alt={project.cover?.alt} label="cover" position={project.cover?.position} ratio="16 / 9" src={project.cover?.src} />}

      <dl className="facts">
        <dt>Built with</dt>
        <dd>{project.stack.join(', ')}</dd>
        {links.length > 0 && (
          <>
            <dt>Links</dt>
            <dd>
              {links.map(([label, href], i) => (
                <span key={href}>{i > 0 && ', '}<a href={href} rel="noreferrer" target="_blank">{label}</a></span>
              ))}
            </dd>
          </>
        )}
      </dl>

      <h2>The problem</h2>
      <p>{project.challenge}</p>
      <h2>What I built</h2>
      <p>{project.solution}</p>
      <h2>How it went</h2>
      <p>{project.outcome}</p>

      {!phone && shots}

      {next && next.slug !== project.slug && (
        <p className="next">Next: <Link to={`/work/${next.slug}`}>{next.title}</Link></p>
      )}
    </article>
  )
}
