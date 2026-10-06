// Clip: the looping muted video tiles on /life (LifePage.jsx, fed by src/data/life.js).
// video files live in public/clips/. looks: .clip / .clip-sound in src/styles/site.css.
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

// Short muted video that loops like a gif once it scrolls into view.
// Click the sound button to unmute. Reduced motion: no autoplay, normal controls.
// KNOB: ratio = clip shape when nobody passes one ('4 / 3')
export default function Clip({ alt, className = '', poster, ratio = '4 / 3', src }) {
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  const [still, setStill] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const node = ref.current
    if (!node || still || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.play?.()?.catch?.(() => setStill(true))
      else node.pause?.()
    // KNOB: how early a clip starts playing (100px before it scrolls on screen)
    }, { rootMargin: '100px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [still])

  return (
    <div className={`clip ${className}`}>
      <video
        aria-label={alt}
        className="photo"
        controls={still}
        loop
        muted={muted}
        playsInline
        poster={poster}
        preload="none"
        ref={ref}
        src={src}
        style={{ aspectRatio: ratio }}
      />
      {!still && (
        <button
          aria-pressed={!muted}
          className="clip-sound"
          onClick={() => setMuted((value) => !value)}
          type="button"
        >
          {/* KNOB: the sound button labels (App.test.jsx clicks 'sound' and expects 'mute' after) */}
          {muted ? 'sound' : 'mute'}
        </button>
      )}
    </div>
  )
}
