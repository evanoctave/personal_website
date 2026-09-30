import { useEffect, useRef, useState } from 'react'
import { openPhoto } from '../fx/Lightbox.jsx'

// Image slot. Give it a src to show a real image, otherwise it's a grey box
// that tells you what goes there and how big it currently renders.
export default function Placeholder({ alt = '', caption, className = '', interactive = true, label = 'image', position, ratio = '4 / 3', src }) {
  const ref = useRef(null)
  const [size, setSize] = useState('')

  useEffect(() => {
    if (src || !ref.current || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize(`${Math.round(width)}×${Math.round(height)}`)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [src])

  if (src && !interactive) {
    return <img alt={alt} className={`photo ${className}`} loading="lazy" src={src} style={{ aspectRatio: ratio, objectPosition: position }} />
  }

  if (src) {
    const onClick = (event) => openPhoto({ src, x: event.clientX, y: event.clientY, origin: event.currentTarget })
    return (
      <button className={`photo-btn ${className}`} onClick={onClick} style={{ aspectRatio: ratio }} type="button">
        <img alt={alt} className="photo" data-caption={caption} data-photo="" loading="lazy" src={src} style={{ aspectRatio: ratio, objectPosition: position }} />
        <span className="sr-only">Open photo</span>
      </button>
    )
  }

  return (
    <div aria-label={`Image placeholder: ${label}`} className={`ph ${className}`} ref={ref} role="img" style={{ aspectRatio: ratio }}>
      <span aria-hidden="true">{label}{size && ` · ${size}`}</span>
    </div>
  )
}
