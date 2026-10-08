// "67" easter egg: type a 6 then a 7 within 0.75s (anywhere, terminal included) and the 67 clip pops up
// in the middle of the screen, with sound. Slower than that and you just get the normal 6 and 7 key pops.
// Counts every 67 across visits (localStorage); the count shows on the clip and on the ⌘P receipt.
// Mounted by SiteShell.jsx; styles in site.css under /* 67 */.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFx } from './FxProvider.jsx'

// KNOB: the clip (public/clips/), and how fast the 7 has to follow the 6 (ms)
const SRC = '/clips/67.mp4'
const WINDOW_MS = 750
// KNOB: where the count is saved. renaming it resets everyone's count
const COUNT_KEY = 'eo-67'

export const readSixSevenCount = () => {
  try {
    return Number(window.localStorage.getItem(COUNT_KEY)) || 0
  } catch {
    return 0
  }
}

export default function SixSeven() {
  const { findEgg } = useFx()
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(readSixSevenCount)
  const [playing, setPlaying] = useState(false)
  const last = useRef({ key: '', at: 0 })
  const videoRef = useRef(null)

  const close = useCallback(() => {
    videoRef.current?.pause?.()
    setOpen(false)
    setPlaying(false)
  }, [])

  // the clip is preloaded and always mounted (just hidden), so a 67 only has to rewind and play it.
  // called right inside the key press, which is also what lets browsers allow the sound; if they refuse
  // anyway, play it muted rather than not at all
  const start = () => {
    const video = videoRef.current
    if (!video) return
    try {
      video.currentTime = 0
    } catch {
      // not loaded yet; play() starts from the top anyway
    }
    video.muted = false
    video.play?.()?.catch?.(() => {
      video.muted = true
      video.play?.()?.catch?.(() => {})
    })
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      const now = performance.now()
      const fast = event.key === '7' && last.current.key === '6' && now - last.current.at <= WINDOW_MS
      last.current = { key: event.key, at: now }
      if (event.key === 'Escape' && open) {
        close()
        return
      }
      if (!fast) return
      // tells FxProvider to skip its usual "7" pop, since the clip replaces it
      event.fxSixSeven = true
      const next = readSixSevenCount() + 1
      try {
        window.localStorage.setItem(COUNT_KEY, String(next))
      } catch {
        // private mode: the count just won't stick around
      }
      start()
      setCount(next)
      setOpen(true)
      findEgg('sixseven')
    }
    // capture phase, so the flag is set before FxProvider's own key handler runs
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [close, findEgg, open])

  // on screen only while open AND the first frame is actually playing, so there's never an empty box
  return (
    <div aria-hidden={!open} className={`six7${open && playing ? ' is-on' : ''}`} onClick={close}>
      <figure className="six7-card" onClick={(event) => event.stopPropagation()}>
        <video aria-label="The 67 kid" onEnded={close} onPlaying={() => setPlaying(true)} playsInline preload="auto" ref={videoRef} src={SRC} />
        {/* KNOB: the counter badge text */}
        <figcaption className="six7-count">67 × {count}</figcaption>
        <button aria-label="Close" className="six7-close" onClick={close} type="button">esc</button>
      </figure>
    </div>
  )
}
