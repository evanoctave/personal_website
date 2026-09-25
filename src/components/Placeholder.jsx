import { useEffect, useRef, useState } from 'react'

/*
  Image slot. Pass `src` + `alt` to show a real image; leave `src` empty to
  show a labelled placeholder that reports its live rendered size.
  `ratio` is any CSS aspect-ratio ("4 / 5", "16 / 9", "1") — change freely.
*/
export default function Placeholder({ alt = '', className = '', label = 'Image', ratio = '4 / 3', src }) {
  const ref = useRef(null)
  const [size, setSize] = useState(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize(`${Math.round(width)} × ${Math.round(height)}`)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tx', `${((event.clientX - box.left) / box.width - 0.5) * 8}deg`)
    event.currentTarget.style.setProperty('--ty', `${((event.clientY - box.top) / box.height - 0.5) * -8}deg`)
  }
  const onLeave = (event) => {
    event.currentTarget.style.setProperty('--tx', '0deg')
    event.currentTarget.style.setProperty('--ty', '0deg')
  }

  if (src) {
    return (
      <figure className={`ph ph--image ${className}`} onPointerLeave={onLeave} onPointerMove={onMove} ref={ref} style={{ aspectRatio: ratio }}>
        <img alt={alt} loading="lazy" src={src} />
      </figure>
    )
  }

  return (
    <div
      aria-label={`Image placeholder: ${label}`}
      className={`ph ${className}`}
      data-cursor="IMG"
      onPointerLeave={onLeave}
      onPointerMove={onMove}
      ref={ref}
      role="img"
      style={{ aspectRatio: ratio }}
    >
      <span aria-hidden="true" className="ph-corner ph-corner--tl" />
      <span aria-hidden="true" className="ph-corner ph-corner--tr" />
      <span aria-hidden="true" className="ph-corner ph-corner--bl" />
      <span aria-hidden="true" className="ph-corner ph-corner--br" />
      <span aria-hidden="true" className="ph-label">+ {label}</span>
      <span aria-hidden="true" className="ph-meta">{String(ratio).replace(/\s/g, '')}{size ? ` · ${size}px` : ''}</span>
    </div>
  )
}
