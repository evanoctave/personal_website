import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

// x/y are % of the stage measured from its centre, z is px toward (+) or away from (-) the viewer
const ORBS = [
  { to: '/work', name: 'Work', note: 'things I built', x: -32, y: -8, z: -60, size: 9 },
  { to: '/about', name: 'About', note: 'who is this', x: -9, y: 16, z: 150, size: 6.5 },
  { to: '/life', name: 'Life', note: 'the photo roll', x: 13, y: -14, z: -340, size: 11 },
  { to: '/contact', name: 'Contact', note: 'say hi', x: 33, y: 12, z: 40, size: 5.5 },
]

const TRAVEL_MS = 1500
// how close the camera stops. just short of the 900px perspective in site.css, so the orb swallows the screen
const CAMERA = 868

// The orbs are plain links. Clicking one flies the camera into it first, then follows the link.
export default function OrbSpace() {
  const navigate = useNavigate()
  const stageRef = useRef(null)
  const [target, setTarget] = useState(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || prefersReducedMotion()) return undefined
    const onMove = (event) => {
      stage.style.setProperty('--mx', (event.clientX / window.innerWidth - 0.5).toFixed(3))
      stage.style.setProperty('--my', (event.clientY / window.innerHeight - 0.5).toFixed(3))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!target) return undefined
    document.body.classList.add('is-traveling')
    const timer = window.setTimeout(() => navigate(target.to), TRAVEL_MS)
    return () => {
      window.clearTimeout(timer)
      document.body.classList.remove('is-traveling')
    }
  }, [navigate, target])

  const onClick = (event, orb) => {
    // new-tab clicks and reduced motion get the ordinary link
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || prefersReducedMotion()) return
    event.preventDefault()
    setTarget(orb)
  }

  const camera = target && { '--tx': `${-target.x}%`, '--ty': `${-target.y}%`, '--tz': `${CAMERA - target.z}px` }

  return (
    <nav aria-label="Travel" className={`space${target ? ' is-traveling' : ''}`} ref={stageRef}>
      <p className="space-hint">{target ? `heading to ${target.name.toLowerCase()}…` : 'pick an orb. go there.'}</p>
      <div className="space-world" style={camera || undefined}>
        {ORBS.map((orb) => (
          <Link
            aria-label={`Travel to ${orb.name}`}
            className={`orb${target === orb ? ' is-target' : ''}`}
            key={orb.to}
            onClick={(event) => onClick(event, orb)}
            style={{ '--x': `${orb.x}%`, '--y': `${orb.y}%`, '--z': `${orb.z}px`, '--size': `${orb.size}rem` }}
            to={orb.to}
          >
            <span className="orb-ball" />
            <span className="orb-label">{orb.name}<small>{orb.note}</small></span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
