// Reveal: fades its children in the first time they scroll into view (adds the is-in class).
// used around the home page's About blurb. the animation itself is .reveal in src/styles/site.css.
import { useEffect, useRef, useState } from 'react'

// KNOB: delay = ms to hold the fade back; as = wrapper tag (as="section" etc.)
export default function Reveal({ as: Tag = 'div', children, className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        observer.disconnect()
      }
    // KNOB: how far on screen it must get before showing (-8% = a bit above the bottom edge)
    }, { rootMargin: '0px 0px -8% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag className={`reveal ${shown ? 'is-in' : ''} ${className}`} ref={ref} style={{ '--delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
