import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder.jsx'
import Scramble from './Scramble.jsx'

/* Row list. On fine pointers a preview image follows the cursor over each row. */
export default function WorkList({ projects }) {
  const previewRef = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return undefined
    const pos = { x: 0, y: 0, tx: 0, ty: 0 }
    let frame = 0
    const onMove = (event) => {
      pos.tx = event.clientX
      pos.ty = event.clientY
    }
    const tick = () => {
      const vx = pos.tx - pos.x
      pos.x += vx * 0.14
      pos.y += (pos.ty - pos.y) * 0.14
      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${Math.max(-12, Math.min(12, vx * 0.08))}deg)`
      frame = window.requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const current = projects.find((project) => project.slug === active)

  return (
    <div className="work-list" onPointerLeave={() => setActive(null)}>
      <ol>
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              className="work-row"
              data-cursor="VIEW"
              onFocus={() => setActive(project.slug)}
              onPointerEnter={() => setActive(project.slug)}
              to={`/work/${project.slug}`}
            >
              <span className="work-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-title"><Scramble onMount={false} text={project.title} /></span>
              <span className="work-tags">{project.tags.join(' / ')}</span>
              <span className="work-year">{project.year}</span>
              <span aria-hidden="true" className="work-arrow">→</span>
            </Link>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className={`work-preview${current ? ' is-on' : ''}`} ref={previewRef}>
        <div className="work-preview-inner">
          {projects.map((project) => (
            <Placeholder
              className={project.slug === active ? 'is-current' : ''}
              key={project.slug}
              label={`${project.title} cover`}
              ratio="4 / 3"
              src={project.cover?.src}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
