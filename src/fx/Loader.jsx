import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './FxProvider.jsx'

const PRINT_MS = 3000
const FLY_MS = 1000

// Intro cover: a little printer feeds out a sticker for each print ({ src, label, target }), one after
// the other. Then every sticker flies to where its photo sits on the page (`target` is a selector) while
// the cover fades. Click or press a key to skip.
export default function Loader({ prints }) {
  const stickerRefs = useRef([])
  // which sticker is printing, then 'fly', then 'done'
  const [step, setStep] = useState(() => (prefersReducedMotion() ? 'done' : 0))
  const [flights, setFlights] = useState([])

  useEffect(() => {
    if (step === 'done') return undefined

    const measure = (el, target) => {
      const from = el?.getBoundingClientRect()
      const to = document.querySelector(target)?.getBoundingClientRect()
      // nowhere on screen to land (phones, where the photos are below the fold): the css falls back to a zoom
      if (!from?.width || !to?.width || to.top > window.innerHeight) return null
      return {
        '--dx': `${to.left + to.width / 2 - from.left - from.width / 2}px`,
        '--dy': `${to.top + to.height / 2 - from.top - from.height / 2}px`,
        '--k': to.width / el.offsetWidth,
      }
    }

    const skip = () => setStep('done')
    const next = () => {
      if (step === 'fly') return skip()
      if (step + 1 < prints.length) return setStep(step + 1)
      setFlights(prints.map((print, i) => measure(stickerRefs.current[i], print.target)))
      setStep('fly')
    }
    const timer = window.setTimeout(next, step === 'fly' ? FLY_MS : PRINT_MS)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
    }
  }, [prints, step])

  if (step === 'done') return null
  const flying = step === 'fly'
  const current = flying ? prints[prints.length - 1] : prints[step]

  return (
    <div aria-hidden="true" className={`loader${flying ? ' is-flying' : ''}`} onClick={() => setStep('done')}>
      <div className="loader-rig">
        <p className="loader-status">printing {current.label}</p>
        <div className="printer">
          <span className="printer-name">EO-PRINT 01</span>
          <span className="printer-screen">
            {current.label}
            <i className="printer-bar" key={step} />
          </span>
          <span className="printer-keys"><i /><i /></span>
          <span className="printer-led" />
        </div>
        <div className="printer-feed">
          {prints.map((print, i) => (flying || i <= step) && (
            <div
              className={`sticker${i < step ? ' is-out' : ''}`}
              key={print.src}
              ref={(el) => { stickerRefs.current[i] = el }}
              style={{ '--i': i, ...flights[i] }}
            >
              <img alt="" src={print.src} style={{ aspectRatio: print.ratio }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
