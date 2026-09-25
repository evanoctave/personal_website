export default function Marquee({ items, reverse = false }) {
  const row = (copy) => items.map((item) => <span key={`${copy}-${item}`}>{item}<i>✳</i></span>)
  return (
    <div aria-label={items.join(', ')} className={`marquee${reverse ? ' marquee--reverse' : ''}`} role="marquee">
      <div aria-hidden="true" className="marquee-track">{row('a')}{row('b')}</div>
    </div>
  )
}
