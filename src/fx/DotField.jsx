import { useEffect, useRef } from 'react'
import { prefersReducedMotion, useFx } from './FxProvider.jsx'

const GAP = 30
const REACH = 140

const readInk = () => getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#f2f2ee'

export default function DotField() {
  const canvasRef = useRef(null)
  const { trail, inverted } = useFx()
  const trailRef = useRef(trail)
  const inkRef = useRef('#f2f2ee')

  useEffect(() => {
    trailRef.current = trail
  }, [trail])

  useEffect(() => {
    inkRef.current = readInk()
  }, [inverted])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext?.('2d')
    if (!ctx) return undefined

    const still = prefersReducedMotion()
    const mouse = { x: -9999, y: -9999 }
    const points = []
    const ripples = []
    let dots = []
    let width = 0
    let height = 0
    let frame = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      dots = []
      for (let y = GAP / 2; y < height + GAP; y += GAP) {
        for (let x = GAP / 2; x < width + GAP; x += GAP) dots.push({ x, y, ox: 0, oy: 0 })
      }
    }

    const onMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      points.push({ x: mouse.x, y: mouse.y, life: 1 })
      if (points.length > 48) points.shift()
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const addRipple = (x, y, power = 1) => ripples.push({ x, y, r: 0, power, life: 1 })
    const onDown = (event) => addRipple(event.clientX, event.clientY)
    const onBlast = (event) => addRipple(event.detail.x, event.detail.y, event.detail.power)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = inkRef.current
      ctx.strokeStyle = inkRef.current

      for (const ripple of ripples) {
        ripple.r += 9 * ripple.power
        ripple.life -= 0.012 / ripple.power
      }
      while (ripples.length && ripples[0].life <= 0) ripples.shift()

      for (const dot of dots) {
        let tx = 0
        let ty = 0
        let glow = 0
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < REACH && dist > 0.1) {
          const force = (1 - dist / REACH) ** 2
          tx += (dx / dist) * force * 26
          ty += (dy / dist) * force * 26
          glow = Math.max(glow, force)
        }
        for (const ripple of ripples) {
          const rx = dot.x - ripple.x
          const ry = dot.y - ripple.y
          const rd = Math.hypot(rx, ry)
          const band = Math.abs(rd - ripple.r)
          if (band < 46 && rd > 0.1) {
            const force = (1 - band / 46) * ripple.life
            tx += (rx / rd) * force * 22 * ripple.power
            ty += (ry / rd) * force * 22 * ripple.power
            glow = Math.max(glow, force)
          }
        }
        dot.ox += (tx - dot.ox) * 0.16
        dot.oy += (ty - dot.oy) * 0.16
        ctx.globalAlpha = 0.16 + glow * 0.84
        const size = 1 + glow * 1.8
        ctx.fillRect(dot.x + dot.ox - size / 2, dot.y + dot.oy - size / 2, size, size)
      }

      ctx.globalAlpha = 1
      for (const ripple of ripples) {
        ctx.globalAlpha = ripple.life * 0.5
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2)
        ctx.stroke()
      }

      for (const point of points) point.life -= 0.035
      while (points.length && points[0].life <= 0) points.shift()
      if (trailRef.current && points.length > 1) {
        ctx.lineCap = 'round'
        for (let i = 1; i < points.length; i += 1) {
          const a = points[i - 1]
          const b = points[i]
          ctx.globalAlpha = b.life
          ctx.lineWidth = b.life * 10
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      if (!still) frame = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('fx:blast', onBlast)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('fx:blast', onBlast)
    }
  }, [])

  return <canvas aria-hidden="true" className="fx-field" ref={canvasRef} />
}
