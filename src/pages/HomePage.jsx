import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="home-page page-frame">
      <p className="eyebrow">Personal portfolio template</p>
      <h1>Portfolio at escape velocity</h1>
      <p className="page-intro">Replace this with who you are, what you make, and why people should explore your work.</p>
      <Link className="button-link" to="/projects">Explore all worlds</Link>
    </section>
  )
}
