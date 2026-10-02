import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './FxProvider.jsx'

const PRINT_MS = 2600
const FLY_MS = 1000

// Intro cover: a little printer feeds out a sticker of `src`, then the sticker flies to where that
// photo sits on the page (`target`, a selector) while the cover fades. Click or press a key to skip.
export default function Loader({ src, target }) {
  const stickerRef = useRef(null)
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? 'done' : 'print'))
  const [flight, setFlight] = useState(null)

  useEffect(() => {
    if (phase === 'done') return undefined

    const measure = () => {
      const from = stickerRef.current?.getBoundingClientRect()
      const to = document.querySelector(target)?.getBoundingClientRect()
      // nowhere on screen to land (phones, where the photo is below the fold): the css falls back to a zoom
      if (!from?.width || !to?.width || to.top > window.innerHeight) return null
      return {
        '--dx': `${to.left + to.width / 2 - from.left - from.width / 2}px`,
        '--dy': `${to.top + to.height / 2 - from.top - from.height / 2}px`,
        '--k': to.width / from.width,
      }
    }

    const skip = () => setPhase('done')
    const timer = window.setTimeout(() => {
      if (phase === 'fly') return skip()
      setFlight(measure())
      setPhase('fly')
    }, phase === 'print' ? PRINT_MS : FLY_MS)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
    }
  }, [phase, target])

  if (phase === 'done') return null

  return (
    <div aria-hidden="true" className={`loader${phase === 'fly' ? ' is-flying' : ''}`} onClick={() => setPhase('done')}>
      <div className="loader-rig">
        <p className="loader-status">printing evan.jpg</p>
        <div className="printer">
          <span className="printer-name">EO-PRINT 01</span>
          <span className="printer-led" />
        </div>
        <div className="printer-feed">
          <div className="sticker" ref={stickerRef} style={flight || undefined}>
            <img alt="" src={src} />
          </div>
        </div>
      </div>
    </div>
  )
}
