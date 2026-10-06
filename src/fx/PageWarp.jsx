import { useEffect, useRef } from 'react'
import { getProjectBySlug } from '../data/projects.js'

// Page-to-page transition, from the same print shop as the intro: a black sheet
// with a bright scan-line edge sweeps over the old page, holds on the
// destination's name, then sweeps off onto the new one. Forwards through the
// nav it travels down, backwards it travels up.
export const CLOSE = 760
export const HOLD = 600
export const OPEN = 920

const ORDER = ['/home', '/work', '/about', '/life', '/contact']

const destination = (pathname) => {
  const index = ORDER.indexOf(pathname)
  if (index >= 0) return { name: pathname.slice(1), index, number: `${String(index + 1).padStart(2, '0')} / 05` }
  if (pathname.startsWith('/work/')) {
    const project = getProjectBySlug(pathname.slice('/work/'.length))
    if (project) return { name: project.title.toLowerCase(), index: 1.5, number: 'work / case study' }
  }
  return { name: 'lost', index: -1, number: '404' }
}

export default function PageWarp({ from, to, onCovered, onDone }) {
  const cbRef = useRef({})
  cbRef.current = { onCovered, onDone }
  const target = destination(to)
  const down = target.index >= destination(from).index

  useEffect(() => {
    const covered = window.setTimeout(() => cbRef.current.onCovered?.(), CLOSE)
    const done = window.setTimeout(() => cbRef.current.onDone?.(), CLOSE + HOLD + OPEN)
    return () => {
      window.clearTimeout(covered)
      window.clearTimeout(done)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`pw pw--${down ? 'down' : 'up'}`}
      style={{ '--pw-total': `${CLOSE + HOLD + OPEN}ms` }}
    >
      <div className="pw-sheet">
        <span className="pw-reg pw-reg--tl" />
        <span className="pw-reg pw-reg--tr" />
        <span className="pw-reg pw-reg--bl" />
        <span className="pw-reg pw-reg--br" />
        <p className="pw-label">
          <span className="pw-kicker">{target.number}</span>
          <span className="pw-name">{target.name}</span>
          <span className="pw-rule" />
        </p>
      </div>
      <span className="pw-edge" />
    </div>
  )
}
