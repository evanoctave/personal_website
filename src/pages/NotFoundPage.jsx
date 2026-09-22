import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page-frame prose-page">
      <p className="eyebrow">Navigation anomaly</p>
      <h1>You found empty space</h1>
      <p>This route drifted beyond known coordinates.</p>
      <Link className="button-link" to="/">Return home</Link>
    </section>
  )
}
