// Project case study (/work/<slug>): one page per entry in src/data/projects.js.
// reads cover, gallery, links, and the problem / built / went text from that entry. unknown slug -> 404.
import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import RichText from '../components/RichText.jsx'
import { getAdjacentProjects, getProjectBySlug } from '../data/projects.js'
import NotFoundPage from './NotFoundPage.jsx'


export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const { next } = getAdjacentProjects(slug)
  // a project without images just leaves them out (grey placeholder boxes read as unfinished)
  const gallery = project.gallery ?? []
  // phone apps lead with a row of screenshots instead of a cropped 16:9 cover
  const phone = project.layout === 'phone'
  // KNOB: link labels on a project page (App.test.jsx expects 'GitHub'). a new *Url field needs a line here
  const links = [
    project.liveUrl && ['Live site', project.liveUrl],
    project.codeUrl && ['Source', project.codeUrl],
    project.githubUrl && ['GitHub', project.githubUrl],
    project.devpostUrl && ['Devpost', project.devpostUrl],
  ].filter(Boolean)
  const shots = (
    <div className={`gallery${phone ? ' gallery--phones' : gallery.length === 2 ? ' gallery--two' : ''}`}>
      {/* KNOB: '16 / 10' = screenshot shape when a gallery item has no ratio */}
      {gallery.map((item, i) => (
        <Placeholder alt={item.alt} caption={item.caption} key={item.src ?? i} label={item.label ?? 'screenshot'} position={item.position} ratio={item.ratio ?? '16 / 10'} src={item.src} />
      ))}
    </div>
  )

  return (
    <article className="page project">
      {/* KNOB: back link text */}
      <p><Link to="/work">← back</Link></p>
      <h1>{project.title}</h1>
      {/* text fields can hold links written as [words](https://...) (see components/RichText.jsx) */}
      <p className="muted"><RichText text={project.eyebrow} />, {project.year}. <RichText text={project.role} />.</p>
      <p className="lede"><RichText text={project.summary} /></p>

      {/* KNOB: cover shape is fixed at 16 / 9 here; layout: 'phone' shows the screenshot row instead */}
      {phone ? shots : project.cover?.src && <Placeholder alt={project.cover.alt} label="cover" position={project.cover.position} ratio="16 / 9" src={project.cover.src} />}

      {/* KNOB: the facts labels ('Built with', 'Links') */}
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

      {/* KNOB: the three section headings on every project page */}
      <h2>The problem</h2>
      <p><RichText text={project.challenge} /></p>
      <h2>What I built</h2>
      <p><RichText text={project.solution} /></p>
      <h2>How it went</h2>
      <p><RichText text={project.outcome} /></p>

      {!phone && gallery.length > 0 && shots}

      {/* KNOB: 'Next:' link. follows the order of the projects list in projects.js and wraps around */}
      {next && next.slug !== project.slug && (
        <p className="next">Next: <Link to={`/work/${next.slug}`}>{next.title}</Link></p>
      )}
    </article>
  )
}
