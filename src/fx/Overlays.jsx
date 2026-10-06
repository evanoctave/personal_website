// Everything that floats over the page: scroll bar, G grid, popups, toasts, matrix rain, the ? controls
// panel, the terminal, the idle screensaver and the "come back" tab title. Mounted once by SiteShell.jsx;
// state comes from FxProvider.jsx. Styles in site.css under /* ---- fx ---- */.
import { useEffect, useRef, useState } from 'react'
import { EGGS, prefersReducedMotion, useFx } from './FxProvider.jsx'
import Terminal from './Terminal.jsx'

// KNOB: rows in the ? controls panel, [key, description] — text only; the real keys live in FxProvider.jsx
const SHORTCUTS = [
  ['?', 'This panel'],
  ['/', 'Open terminal'],
  ['1 – 5', 'Home, work, about, life, contact'],
  ['I', 'Invert everything'],
  ['T', 'Cursor trail'],
  ['G', 'Blueprint grid'],
  ['X', 'Shockwave'],
  ['Click', 'Ripple the field'],
  ['Any key', 'See what happens'],
]

function Pops() {
  const { pops } = useFx()
  return (
    <div aria-hidden="true" className="fx-pops">
      {pops.map((item) => (
        <span
          className={`fx-pop${item.big ? ' fx-pop--big' : ''}`}
          key={item.id}
          style={{ '--x': `${item.x}%`, '--y': `${item.y}%`, '--r': `${item.rot}deg` }}
        >
          {item.text}
        </span>
      ))}
    </div>
  )
}

function Toasts() {
  const { toasts } = useFx()
  return (
    <div aria-live="polite" className="fx-toasts" role="status">
      {toasts.map((item) => <p className="fx-toast" key={item.id}>{item.message}</p>)}
    </div>
  )
}

function ShortcutPanel() {
  const { eggs, keysEnabled, panelOpen, setKeysEnabled, setPanelOpen } = useFx()
  const closeRef = useRef(null)

  useEffect(() => {
    if (panelOpen) closeRef.current?.focus()
  }, [panelOpen])

  if (!panelOpen) return null
  const total = Object.keys(EGGS).length

  return (
    <div className="fx-backdrop" onClick={() => setPanelOpen(false)}>
      <section
        aria-labelledby="shortcut-title"
        aria-modal="true"
        className="fx-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="fx-panel-head">
          {/* KNOB: panel title and close-button text */}
          <h2 id="shortcut-title">Controls</h2>
          <button onClick={() => setPanelOpen(false)} ref={closeRef} type="button">Close <kbd>Esc</kbd></button>
        </header>
        <dl className="fx-keys">
          {SHORTCUTS.map(([key, text]) => (
            <div key={key}><dt><kbd>{key}</kbd></dt><dd>{text}</dd></div>
          ))}
        </dl>
        <label className="fx-switch">
          <input checked={keysEnabled} onChange={(event) => setKeysEnabled(event.target.checked)} type="checkbox" />
          {/* KNOB: shortcut on/off switch label */}
          <span>Single-key shortcuts {keysEnabled ? 'on' : 'off'}</span>
        </label>
        {/* KNOB: easter egg heading */}
        <h3>Easter eggs <span>{eggs.size}/{total}</span></h3>
        <ul className="fx-eggs">
          {/* KNOB: '? ? ? ? ? ?' is what an unfound egg shows */}
          {Object.entries(EGGS).map(([id, text]) => (
            <li className={eggs.has(id) ? 'is-found' : ''} key={id}>{eggs.has(id) ? text : '? ? ? ? ? ?'}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Rain() {
  const canvasRef = useRef(null)
  const { rain } = useFx()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext?.('2d')
    if (!rain || !ctx) return undefined
    // KNOB: rain glyph size in px (also the column width)
    const size = 16
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const columns = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -40)
    // KNOB: characters the rain picks from
    const glyphs = '01EVANOCTAVE<>/{}[]#$%&*+=?アイウエオカキクケコ'
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim()
    const ground = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    let frame = 0
    const draw = () => {
      // KNOB: rain trail — .14 = how fast old glyphs fade (higher = shorter trails)
      ctx.globalAlpha = 0.14
      ctx.fillStyle = ground
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
      ctx.fillStyle = ink
      ctx.font = `${size}px "JetBrains Mono", monospace`
      columns.forEach((y, i) => {
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y * size)
        // KNOB: .97 — a column that hits the bottom restarts with 3% chance per frame (lower = restarts sooner)
        columns[i] = y * size > canvas.height && Math.random() > 0.97 ? 0 : y + 1
      })
      frame = window.requestAnimationFrame(draw)
    }
    draw()
    return () => window.cancelAnimationFrame(frame)
  }, [rain])

  if (!rain) return null
  return <canvas aria-hidden="true" className="fx-rain" ref={canvasRef} />
}

function Screensaver() {
  const { findEgg } = useFx()
  const [active, setActive] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    let timer = 0
    const reset = () => {
      setActive(false)
      window.clearTimeout(timer)
      // KNOB: idle time before the screensaver (ms); showing it also finds the 'idle' egg
      timer = window.setTimeout(() => setActive(true), 45000)
    }
    // KNOB: what counts as activity (any of these resets the idle timer)
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']
    events.forEach((name) => window.addEventListener(name, reset, { passive: true }))
    reset()
    return () => {
      window.clearTimeout(timer)
      events.forEach((name) => window.removeEventListener(name, reset))
    }
  }, [])

  useEffect(() => {
    if (!active) return undefined
    findEgg('idle')
    if (prefersReducedMotion()) return undefined
    // KNOB: screensaver start spot (px) and speed (vx/vy px per frame)
    const pos = { x: 40, y: 40, vx: 2.2, vy: 1.7 }
    let frame = 0
    const move = () => {
      const box = boxRef.current
      if (!box) return
      const maxX = window.innerWidth - box.offsetWidth
      const maxY = window.innerHeight - box.offsetHeight
      pos.x += pos.vx
      pos.y += pos.vy
      if (pos.x <= 0 || pos.x >= maxX) {
        pos.vx *= -1
        box.classList.toggle('is-flipped')
      }
      if (pos.y <= 0 || pos.y >= maxY) {
        pos.vy *= -1
        box.classList.toggle('is-flipped')
      }
      box.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      frame = window.requestAnimationFrame(move)
    }
    frame = window.requestAnimationFrame(move)
    return () => window.cancelAnimationFrame(frame)
  }, [active, findEgg])

  if (!active) return null
  return (
    <div aria-hidden="true" className="fx-saver">
      {/* KNOB: screensaver box text */}
      <div className="fx-saver-box" ref={boxRef}>EO<small>still there?</small></div>
    </div>
  )
}

function GridOverlay() {
  const { grid } = useFx()
  useEffect(() => {
    document.documentElement.dataset.fxGrid = grid ? 'true' : 'false'
  }, [grid])
  if (!grid) return null
  return (
    <div aria-hidden="true" className="fx-grid">
      {/* KNOB: 12 grid columns — keep in sync with repeat(12, 1fr) in .fx-grid in site.css */}
      {Array.from({ length: 12 }, (_, i) => <span key={i}><small>{String(i + 1).padStart(2, '0')}</small></span>)}
    </div>
  )
}

function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  // KNOB: the bar is hidden by .fx-progress { display: none } in site.css — change that to show it
  return <div aria-hidden="true" className="fx-progress" ref={barRef} />
}

function AwayTitle() {
  useEffect(() => {
    let saved = document.title
    const onChange = () => {
      if (document.hidden) {
        saved = document.title
        // KNOB: tab title while the visitor is on another tab
        document.title = 'come back ◐'
      } else {
        document.title = saved
      }
    }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return null
}

export default function Overlays() {
  return (
    <>
      <ScrollProgress />
      <GridOverlay />
      <Pops />
      <Toasts />
      <Rain />
      <ShortcutPanel />
      <Terminal />
      <Screensaver />
      <AwayTitle />
    </>
  )
}
