// Full-screen photo viewer. Mounted by SiteShell.jsx; Placeholder.jsx opens it via openPhoto().
// Styles under /* lightbox */ in site.css.
import { useCallback, useEffect, useRef, useState } from 'react'
import { blast, prefersReducedMotion } from './FxProvider.jsx'

// Click any <Placeholder src> and it lands here. The photo "develops":
// blurred + grey for a beat, then sharp. Arrows walk every photo on the page.
export const openPhoto = (detail) => window.dispatchEvent(new CustomEvent('fx:photo', { detail }))

// KNOB: which images join the viewer — any <img data-photo>; data-caption sets the caption text
const collect = () => Array.from(document.querySelectorAll('img[data-photo]')).map((img) => ({
  src: img.currentSrc || img.src,
  alt: img.alt,
  caption: img.dataset.caption || '',
}))

export default function Lightbox() {
  const [photos, setPhotos] = useState([])
  const [index, setIndex] = useState(-1)
  const [developing, setDeveloping] = useState(false)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)
  const open = index >= 0 && photos[index]

  const show = useCallback((next) => {
    setIndex(next)
    if (!prefersReducedMotion()) {
      setDeveloping(true)
      // KNOB: 40ms in the blurred "developing" state; the blur look is .lightbox-frame.is-developing in site.css
      window.setTimeout(() => setDeveloping(false), 40)
    }
  }, [])

  const close = useCallback(() => {
    setIndex(-1)
    setPhotos([])
    restoreRef.current?.focus?.({ preventScroll: true })
  }, [])

  const step = useCallback((delta) => {
    if (!photos.length) return
    show((index + delta + photos.length) % photos.length)
  }, [index, photos.length, show])

  useEffect(() => {
    const onOpen = (event) => {
      const { src, x, y, origin } = event.detail
      const list = collect()
      const at = Math.max(0, list.findIndex((photo) => photo.src === src || photo.src.endsWith(src)))
      restoreRef.current = origin ?? document.activeElement
      setPhotos(list)
      show(at)
      // KNOB: shockwave strength when a photo opens (1.4)
      if (x != null) blast(x, y, 1.4)
    }
    window.addEventListener('fx:photo', onOpen)
    return () => window.removeEventListener('fx:photo', onOpen)
  }, [show])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      // KNOB: viewer keys — Esc closes, → or space = next, ← = previous
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight' || event.key === ' ') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
      else return
      event.preventDefault()
      event.stopPropagation()
    }
    // capture phase so the site-wide shortcut handler never sees these
    window.addEventListener('keydown', onKey, true)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = overflow
    }
  }, [open, close, step])

  if (!open) return null
  const photo = photos[index]

  return (
    <div className="lightbox" onClick={close}>
      <figure className={`lightbox-frame${developing ? ' is-developing' : ''}`} onClick={(event) => event.stopPropagation()}>
        <img alt={photo.alt} onClick={() => step(1)} src={photo.src} />
        <figcaption>
          {/* KNOB: counter format (01 / 12) and caption (data-caption, else the alt text) */}
          <span className="lightbox-count">{String(index + 1).padStart(2, '0')} / {photos.length}</span>
          <span className="lightbox-alt">{photo.caption || photo.alt}</span>
        </figcaption>
      </figure>
      <div aria-label="Photo viewer" aria-modal="true" className="lightbox-ui" role="dialog" onClick={(event) => event.stopPropagation()}>
        {/* KNOB: button text (← → esc) and their screen-reader labels */}
        <button aria-label="Previous photo" className="lightbox-btn lightbox-prev" onClick={() => step(-1)} type="button">←</button>
        <button aria-label="Next photo" className="lightbox-btn lightbox-next" onClick={() => step(1)} type="button">→</button>
        <button aria-label="Close photo" className="lightbox-btn lightbox-close" onClick={close} ref={closeRef} type="button">esc</button>
      </div>
    </div>
  )
}
