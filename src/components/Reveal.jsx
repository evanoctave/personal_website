import { useEffect, useRef, useState } from 'react'

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
