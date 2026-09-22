import { Link } from 'react-router-dom'
import OrbitHero from '../components/OrbitHero.jsx'

export default function HomePage() {
  return (
    <div className="home-page">
      <OrbitHero />
      <section className="home-intro page-frame">
        <p className="eyebrow">Template controls</p>
        <h2>Keep work orbiting around point of view.</h2>
        <p>Start with project names and summaries in one data file. Then replace this note with your own point of view.</p>
        <Link className="text-link" to="/about">Read orbit notes <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  )
}
