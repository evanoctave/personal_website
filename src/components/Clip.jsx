import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

// Short muted video that loops like a gif once it scrolls into view.
// Click the sound button to unmute. Reduced motion: no autoplay, normal controls.
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
          {muted ? 'sound' : 'mute'}
        </button>
      )}
    </div>
  )
}
