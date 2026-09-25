import { useEffect, useRef, useState } from 'react'

// Image slot. Give it a src to show a real image, otherwise it's a grey box
// that tells you what goes there and how big it currently renders.
export default function Placeholder({ alt = '', className = '', label = 'image', ratio = '4 / 3', src }) {
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

  if (src) {
    return <img alt={alt} className={`photo ${className}`} loading="lazy" src={src} style={{ aspectRatio: ratio }} />
  }

  return (
    <div aria-label={`Image placeholder: ${label}`} className={`ph ${className}`} ref={ref} role="img" style={{ aspectRatio: ratio }}>
      <span aria-hidden="true">{label}{size && ` · ${size}`}</span>
    </div>
  )
}
