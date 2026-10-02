import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './FxProvider.jsx'

const MOVE_MS = 900
const FEED_MS = 2500
const PRINT_MS = MOVE_MS + 300 + FEED_MS + 300
const LEAVE_MS = 800

// Intro: the page's photos start out blank. A little printer parks over each photo's spot in turn
// ({ src, label, target } per print, target a selector) and prints the sticker right there, then the
// real image takes over underneath it. Click the printer or press a key to skip.
export default function Loader({ prints }) {
  // index of the print in progress, then 'leave', then 'done'
  const [step, setStep] = useState(() => (prefersReducedMotion() ? 'done' : 0))
  const [spots, setSpots] = useState([])

  useEffect(() => {
    if (step === 'done') {
      prints.forEach((print) => document.querySelector(print.target)?.style.removeProperty('opacity'))
      return undefined
    }
    document.body.classList.add('is-printing')
    const skip = () => setStep('done')
    let timer
    if (step === 'leave') {
      timer = window.setTimeout(skip, LEAVE_MS)
    } else {
      const target = document.querySelector(prints[step].target)
      const to = target?.getBoundingClientRect()
      // the spot is off screen (phones): forget the show
      if (!to || to.top > window.innerHeight) {
        skip()
      } else {
        setSpots((list) => Object.assign([...list], { [step]: { '--left': `${to.left}px`, '--top': `${to.top}px`, '--width': `${to.width}px` } }))
        timer = window.setTimeout(() => {
          target.style.opacity = 1
          setStep(step + 1 < prints.length ? step + 1 : 'leave')
        }, PRINT_MS)
      }
    }
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
      document.body.classList.remove('is-printing')
    }
  }, [prints, step])

  if (step === 'done') return null
  const leaving = step === 'leave'
  const index = leaving ? prints.length - 1 : step
  if (!spots[index]) return null
  const current = prints[index]

  const sticker = (print, className, style) => (
    <div className={className} key={print.src} style={style}>
      <img alt="" src={print.src} style={{ aspectRatio: print.ratio }} />
    </div>
  )

  return (
    <div aria-hidden="true" className={`loader${leaving ? ' is-leaving' : ''}`}>
      {/* finished stickers stay put and fade as the real image shows through */}
      {prints.slice(0, leaving ? prints.length : step).map((print, i) => sticker(print, 'sticker is-set', spots[i]))}
      <div className="loader-rig" onClick={() => setStep('done')} style={spots[index]}>
        <div className="printer" key={index}>
          <span className="printer-name">EO-PRINT 01</span>
          <span className="printer-screen">
            {current.label}
            <i className="printer-bar" />
          </span>
          <span className="printer-keys"><i /><i /></span>
          <span className="printer-led" />
        </div>
        <div className="printer-feed">
          {!leaving && sticker(current, 'sticker')}
        </div>
      </div>
    </div>
  )
}
