// Mounted by App.jsx on every route change; styles + keyframes in site.css under /* page warp */.
import { useEffect, useRef } from 'react'
import { getProjectBySlug } from '../data/projects.js'

// Page-to-page transition, from the same print shop as the intro: a black sheet
// with a bright scan-line edge sweeps over the old page, holds on the
// destination's name, then sweeps off onto the new one. Forwards through the
// nav it travels down, backwards it travels up.
// KNOB: warp timings (ms) — CLOSE = sweep on, HOLD = covered, showing the name, OPEN = sweep off.
// the keyframe % in site.css assume this 760 / 600 / 920 split; change them together
export const CLOSE = 760
export const HOLD = 600
export const OPEN = 920

// KNOB: nav order — sets the sweep direction (down when going forward) and the "02 / 05" number
const ORDER = ['/home', '/work', '/about', '/life', '/contact']

const destination = (pathname) => {
  const index = ORDER.indexOf(pathname)
  // KNOB: label text — "NN / 05" for main pages (update 05 if you add pages), 'work / case study', 'lost' / '404'
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
