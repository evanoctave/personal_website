import { useRef } from 'react'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

/* Wraps a link/button so it leans toward the pointer. */
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)

  const onMove = (event) => {
    if (prefersReducedMotion()) return
    const box = ref.current.getBoundingClientRect()
    const x = (event.clientX - box.left - box.width / 2) * strength
    const y = (event.clientY - box.top - box.height / 2) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    ref.current.style.transform = ''
  }

  return (
    <span className="magnetic" onPointerLeave={onLeave} onPointerMove={onMove} ref={ref}>
      {children}
    </span>
  )
}
