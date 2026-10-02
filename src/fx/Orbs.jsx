import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './FxProvider.jsx'

// chrome orbs floating behind the page (or orbiting it, with atom). they lean away from the pointer, sway with scroll,
// and a soft light follows the cursor. all the looks live in site.css
export default function Orbs({ atom = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion()) return undefined
    const onMove = (event) => {
      node.style.setProperty('--mx', (event.clientX / window.innerWidth - 0.5).toFixed(3))
      node.style.setProperty('--my', (event.clientY / window.innerHeight - 0.5).toFixed(3))
      node.style.setProperty('--px', `${event.clientX}px`)
      node.style.setProperty('--py', `${event.clientY}px`)
    }
    // sine keeps the sway bounded no matter how long the page is
    const onScroll = () => node.style.setProperty('--sy', Math.sin(window.scrollY / 700).toFixed(3))
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className={atom ? 'fx-orbs fx-orbs--atom' : 'fx-orbs'} ref={ref}>
      <i /><i /><i /><i /><i /><i />
    </div>
  )
}
