import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder.jsx'

// the preview image follows the mouse around while you hover a row
export default function WorkList({ projects }) {
  const previewRef = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return undefined
    const pos = { x: 0, y: 0, tx: 0, ty: 0 }
    let frame = 0
    const onMove = (e) => {
      pos.tx = e.clientX
      pos.ty = e.clientY
    }
    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.15
      pos.y += (pos.ty - pos.y) * 0.15
      preview.style.transform = `translate(${pos.x + 24}px, ${pos.y - 80}px)`
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const current = projects.find((p) => p.slug === active)

  return (
    <div className="work-list" onPointerLeave={() => setActive(null)}>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              onFocus={() => setActive(project.slug)}
              onPointerEnter={() => setActive(project.slug)}
              to={`/work/${project.slug}`}
            >
              <span className="work-year">{project.year}</span>
              <span className="work-title">{project.title}</span>
              <span className="work-summary">{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className={`work-preview${current ? ' is-on' : ''}`} ref={previewRef}>
        {current && <Placeholder label={current.title} ratio="4 / 3" src={current.cover?.src} />}
      </div>
    </div>
  )
}
