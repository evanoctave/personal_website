import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './FxProvider.jsx'

// First /home visit per session (or the replay button): a ~10s black-and-white
// print job, styled like a technical drawing.
//   0.0  calibrate: corner marks, rulers, crosshair, scan line
//   1.2  assemble: exploded printer parts fly in and lock, callouts label them
//   3.0  load: a sheet drops into the tray
//   3.6  print: stepped feed, raster band, line counter, progress bar
//   7.0  inspect: printer drops away, the page lifts to centre with crop marks
//   8.5  handoff: the title flies off the page onto the real <h1>
// Motion is CSS (see .pi in site.css); this file runs the readouts and the
// handoff. Purely decorative. Any click or key skips, reduced motion never sees it.
const SEEN_KEY = 'eo-printed'
const FPS = 24

const hasSeen = () => {
  try { return window.sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
const markSeen = () => {
  try { window.sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode, whatever */ }
}

export const willPrint = () => !hasSeen() && !prefersReducedMotion()

const pad = (n, size = 2) => String(n).padStart(size, '0')
const clamp = (n) => Math.min(1, Math.max(0, n))

// HH:MM:SS:FF, like a comp timecode
const timecode = (s) => {
  const frames = Math.floor(s * FPS)
  return `00:00:${pad(Math.floor(frames / FPS))}:${pad(frames % FPS)}`
}

const STATUS = [
  [0, 'calibrating'],
  [1.2, 'assembling'],
  [3, 'loading media'],
  [3.6, 'printing job 001 · whats-up.pdf'],
  [7, 'inspecting'],
  [8.5, 'handing off'],
]

const LINES = 1100

const readout = (t) => {
  if (t < 1.2) return `cal ${pad(Math.round(clamp(t / 1.1) * 100), 3)}%`
  if (t < 3) return `parts ${Math.min(7, Math.floor((t - 1.2) / .16) + 1)}/7 locked`
  if (t < 3.6) return 'media 216 × 279 mm · 80 gsm'
  if (t < 7) {
    const k = clamp((t - 3.6) / 3.4)
    return `line ${pad(Math.floor(k * LINES), 4)}/${LINES} · ${pad(Math.floor(k * 100), 3)}%`
  }
  return `${LINES}/${LINES} · ok`
}

const FLIGHT_MS = 1100

const centre = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

// [x, y] in printer viewBox units, which side the leader runs, number, label
const CALLOUTS = [
  [130, 12, 'left', '01', 'media tray'],
  [302, 58, 'right', '02', 'control'],
  [74, 128, 'left', '03', 'print head · 600 dpi'],
  [250, 138, 'right', '04', 'output slot'],
]

// onEnter: page content can start assembling. onLand: the title has landed on the real h1.
export default function PrinterIntro({ force = false, onEnter, onLand }) {
  const [phase, setPhase] = useState(() => (force || willPrint() ? 'play' : 'off'))
  const rootRef = useRef(null)
  const tcRef = useRef(null)
  const statusRef = useRef(null)
  const readRef = useRef(null)
  const cbRef = useRef({})
  cbRef.current = { onEnter, onLand }
  const fired = useRef({})

  const fire = (name) => {
    if (fired.current[name]) return
    fired.current[name] = true
    cbRef.current[name]?.()
  }

  const finish = () => {
    markSeen()
    fire('onEnter')
    fire('onLand')
    setPhase('off')
  }

  const skip = () => setPhase((now) => (now === 'play' ? 'skip' : now))

  // match cut: clone each word off the page and fly it onto the matching word of the real title
  const handoff = () => {
    const root = rootRef.current
    const sources = Array.from(root?.querySelectorAll('.pi-word') ?? [])
    const targets = Array.from(document.querySelectorAll('.home .name .scramble'))
    if (!sources.length || sources.length !== targets.length || !root.animate) {
      setPhase('skip')
      return
    }

    const flights = sources.map((source, i) => {
      const from = source.getBoundingClientRect()
      const to = targets[i].getBoundingClientRect()
      const fromStyle = window.getComputedStyle(source)
      const toStyle = window.getComputedStyle(targets[i])
      // the page is scaled up while inspected; bake that into the clone's font size
      const zoom = source.offsetHeight ? from.height / source.offsetHeight : 1
      const fontSize = parseFloat(fromStyle.fontSize) * zoom
      const scale = parseFloat(toStyle.fontSize) / fontSize
      const a = centre(from)
      const b = centre(to)
      const dx = b.x - a.x
      const dy = b.y - a.y

      const clone = document.createElement('span')
      clone.className = 'pi-flyer'
      clone.textContent = source.textContent
      Object.assign(clone.style, {
        left: `${from.left}px`,
        top: `${from.top}px`,
        fontFamily: fromStyle.fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: fromStyle.fontWeight,
        letterSpacing: `${parseFloat(fromStyle.letterSpacing) * zoom || 0}px`,
        color: fromStyle.color,
      })
      root.appendChild(clone)
      source.style.visibility = 'hidden'

      return clone.animate([
        { transform: 'translate(0px, 0px) scale(1)', color: fromStyle.color, easing: 'cubic-bezier(.7, 0, .3, 1)' },
        { offset: .55, transform: `translate(${dx * .5}px, ${dy * .5 - 28 - i * 14}px) scale(${1 + (scale - 1) * .55})`, color: toStyle.color, easing: 'cubic-bezier(.2, 0, .1, 1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, color: toStyle.color },
      ], { duration: FLIGHT_MS, delay: i * 70, fill: 'forwards' }).finished
    })

    setPhase('handoff')
    fire('onEnter')
    Promise.all(flights).then(() => {
      fire('onLand')
      window.setTimeout(finish, 300)
    }, finish)
  }

  useEffect(() => {
    if (phase === 'off') return undefined
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [phase === 'off'])

  useEffect(() => {
    if (phase === 'off') return undefined
    // safety net: if animation events never fire (backgrounded tab, odd browser), don't strand the overlay
    const fallback = window.setTimeout(finish, { play: 13000, handoff: 3000, skip: 800 }[phase])
    if (phase !== 'play') return () => window.clearTimeout(fallback)

    let start = null
    let raf = 0
    let lastStatus = ''
    let lastRead = ''
    const tick = (now) => {
      start ??= now
      const t = Math.max(0, now - start) / 1000
      if (tcRef.current) tcRef.current.textContent = timecode(t)
      const status = STATUS.filter(([at]) => at <= t).at(-1)[1]
      if (status !== lastStatus && statusRef.current) statusRef.current.textContent = lastStatus = status
      const read = readout(t)
      if (read !== lastRead && readRef.current) readRef.current.textContent = lastRead = read
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    window.addEventListener('keydown', skip)
    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
      window.removeEventListener('keydown', skip)
    }
  }, [phase])

  if (phase === 'off') return null

  const onStart = (event) => {
    if (event.target === event.currentTarget) fire('onEnter')
  }
  const onEnd = (event) => {
    if (event.animationName === 'pi-hold' && phase === 'play') handoff()
    else if (event.target === event.currentTarget && phase === 'skip') finish()
  }

  return (
    <div
      aria-hidden="true"
      className={`pi pi--${phase}`}
      onAnimationEnd={onEnd}
      onAnimationStart={onStart}
      onPointerDown={skip}
      ref={rootRef}
    >
      <div className="pi-frame">
        <span className="pi-corner pi-corner--tl" />
        <span className="pi-corner pi-corner--tr" />
        <span className="pi-corner pi-corner--bl" />
        <span className="pi-corner pi-corner--br" />
        <span className="pi-ruler pi-ruler--top" />
        <span className="pi-ruler pi-ruler--left" />
        <span className="pi-scan" />
        <span className="pi-cross"><span /></span>
      </div>

      <div className="pi-hud">
        <p className="pi-hud-tl"><span>eo-1 print system</span><span>rev 2026.10</span></p>
        <p className="pi-hud-tr" ref={tcRef}>00:00:00:00</p>
        <div className="pi-hud-bl">
          <p ref={statusRef}>calibrating</p>
          <p className="pi-read" ref={readRef}>cal 000%</p>
          <span className="pi-progress"><span /></span>
        </div>
        <p className="pi-hud-br">click or press any key to skip</p>
      </div>

      <div className="pi-camera">
        <div className="pi-stage">
          <div className="pi-machine">
            <svg className="pi-printer" viewBox="0 0 360 180">
              <g className="pi-part" style={{ '--at': '1.2s', '--from': 'translate(0px, -46px)' }}>
                <path className="pi-fill" d="M104 44 L116 8 H244 L256 44 Z" />
                <rect className="pi-sheetin" height="40" width="108" x="126" y="-34" />
                <path className="pi-draw" d="M104 44 L116 8 H244 L256 44 M122 16 H238" pathLength="1" />
              </g>
              <g className="pi-part" style={{ '--at': '1.32s', '--from': 'scale(.9)' }}>
                <rect className="pi-fill" height="124" rx="14" width="320" x="20" y="40" />
                <rect className="pi-draw" height="124" pathLength="1" rx="14" width="320" x="20" y="40" />
                <path className="pi-draw pi-draw--fine" d="M20 76 H340 M60 76 V71 M300 76 V71" pathLength="1" />
              </g>
              <g className="pi-part" style={{ '--at': '1.5s', '--from': 'translate(56px, -18px)' }}>
                <rect className="pi-draw" height="16" pathLength="1" rx="8" width="82" x="244" y="50" />
                <circle className="pi-btn" cx="288" cy="58" r="3" />
                <circle className="pi-btn" cx="302" cy="58" r="3" />
                <circle className="pi-btn" cx="316" cy="58" r="3" />
                <circle className="pi-led" cx="256" cy="58" r="3.2" />
              </g>
              <g className="pi-part" style={{ '--at': '1.62s', '--from': 'translate(-48px, 0px)' }}>
                <path className="pi-draw pi-draw--fine" d="M38 94 H82 M38 102 H82 M38 110 H82 M38 118 H82" pathLength="1" />
                <text className="pi-brand" x="36" y="62">EO-1</text>
                <text className="pi-brand pi-brand--sn" x="36" y="70">SN 0001-26</text>
              </g>
              <g className="pi-part" style={{ '--at': '1.74s', '--from': 'translate(0px, 34px)' }}>
                <rect className="pi-draw" height="28" pathLength="1" rx="6" width="252" x="54" y="118" />
                <path className="pi-draw pi-draw--fine pi-rail" d="M64 128 H296" pathLength="1" />
                <rect className="pi-slot" height="8" rx="4" width="240" x="60" y="134" />
                <path className="pi-draw pi-draw--fine" d="M52 152 H308 M90 152 V156 M130 152 V156 M170 152 V156 M210 152 V156 M250 152 V156 M290 152 V156" pathLength="1" />
                <rect className="pi-head" height="6" rx="1.5" width="20" x="64" y="125" />
              </g>
              <g className="pi-part" style={{ '--at': '1.86s', '--from': 'translate(0px, 26px)' }}>
                <path className="pi-draw" d="M46 164 V172 H70 V164 M290 164 V172 H314 V164" pathLength="1" />
              </g>
              <g className="pi-part" style={{ '--at': '1.98s', '--from': 'scale(0)' }}>
                <circle className="pi-screw" cx="32" cy="52" r="2.2" />
                <circle className="pi-screw" cx="328" cy="52" r="2.2" />
                <circle className="pi-screw" cx="32" cy="152" r="2.2" />
                <circle className="pi-screw" cx="328" cy="152" r="2.2" />
              </g>
            </svg>
            {CALLOUTS.map(([x, y, side, n, label], i) => (
              <span
                className={`pi-call pi-call--${side}`}
                key={n}
                style={{ left: `${(x / 360) * 100}%`, top: `${(y / 180) * 100}%`, '--i': i }}
              >
                <span className="pi-call-line" />
                <span className="pi-call-label"><b>{n}</b>{label}</span>
              </span>
            ))}
          </div>

          <div className="pi-sheet">
            <span className="pi-crop pi-crop--tl" />
            <span className="pi-crop pi-crop--tr" />
            <span className="pi-crop pi-crop--bl" />
            <span className="pi-crop pi-crop--br" />
            <div className="pi-feed">
              <div className="pi-paper">
                <p className="pi-paper-meta"><span>EVAN OCTAVE</span><span>JOB 001</span></p>
                <p className="pi-paper-title"><span className="pi-word">What's</span><br /><span className="pi-word">up</span></p>
                <div className="pi-paper-photo"><img alt="" src="/photos/PICT0020.jpg" /></div>
                <p className="pi-paper-line">SWE (larper) / IT Assistant</p>
                <p className="pi-paper-line">Cal State Fullerton</p>
                <p className="pi-paper-foot"><span className="pi-paper-code" /><span className="pi-paper-reg" /></p>
              </div>
              <span className="pi-band" />
            </div>
            <p className="pi-dims"><span>216</span> × <span>279</span> mm</p>
          </div>
        </div>
      </div>
    </div>
  )
}
