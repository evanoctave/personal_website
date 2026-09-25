import { useEffect, useRef, useState } from 'react'
import { useFx } from './FxProvider.jsx'

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, label'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const coordsRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { findEgg, pulse, pop } = useFx()

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)')
    const update = () => setEnabled(Boolean(fine?.matches))
    update()
    fine?.addEventListener?.('change', update)
    return () => fine?.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('has-fx-cursor', enabled)
    if (!enabled) return undefined

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...target }
    const shake = { lastX: 0, dir: 0, flips: [] }
    let frame = 0

    const onMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      const hit = event.target.closest?.(INTERACTIVE)
      setHovering(Boolean(hit))
      setLabel(hit?.dataset?.cursor ?? '')

      const dx = event.clientX - shake.lastX
      shake.lastX = event.clientX
      if (Math.abs(dx) > 26) {
        const dir = Math.sign(dx)
        if (dir !== shake.dir) {
          const now = performance.now()
          shake.flips = [...shake.flips.filter((time) => now - time < 700), now]
          shake.dir = dir
          if (shake.flips.length >= 7) {
            shake.flips = []
            findEgg('shake')
            pop('WHOA')
            pulse('fx-wobble', 700)
          }
        }
      }
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      if (coordsRef.current) {
        coordsRef.current.style.transform = `translate3d(${target.x + 18}px, ${target.y + 18}px, 0)`
        coordsRef.current.textContent = `x ${Math.round(target.x)} / y ${Math.round(target.y)}`
      }
      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.classList.remove('has-fx-cursor')
    }
  }, [enabled, findEgg, pop, pulse])

  if (!enabled) return null

  const ringClass = [
    'fx-cursor-ring',
    hovering && 'is-hovering',
    label && 'has-label',
    pressed && 'is-pressed',
  ].filter(Boolean).join(' ')

  return (
    <div aria-hidden="true" className="fx-cursor">
      <div className={ringClass} ref={ringRef}><span>{label}</span></div>
      <div className="fx-cursor-dot" ref={dotRef} />
      <div className="fx-cursor-coords" ref={coordsRef} />
    </div>
  )
}
