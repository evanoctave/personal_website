import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ'

/* Decoding text effect. Screen readers always get the real text. */
export default function Scramble({ text, onHover = true, onMount = true, className = '', duration = 1 }) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)

  const run = useCallback(() => {
    if (prefersReducedMotion()) return
    window.cancelAnimationFrame(frame.current)
    let tick = 0
    const total = (text.length * 1.6 + 8) * duration
    const step = () => {
      tick += 1
      const settled = Math.floor((tick / total) * text.length)
      setDisplay(text.split('').map((char, i) => {
        if (char === ' ' || i < settled) return char
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }).join(''))
      if (tick < total) frame.current = window.requestAnimationFrame(step)
      else setDisplay(text)
    }
    frame.current = window.requestAnimationFrame(step)
  }, [duration, text])

  useEffect(() => {
    setDisplay(text)
    if (onMount) run()
    return () => window.cancelAnimationFrame(frame.current)
  }, [onMount, run, text])

  return (
    <span className={`scramble ${className}`} onPointerEnter={onHover ? run : undefined}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
