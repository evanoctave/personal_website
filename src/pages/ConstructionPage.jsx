import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../fx/Loader.jsx'
import Orbs from '../fx/Orbs.jsx'

export default function ConstructionPage() {
  const date = new Date()
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date)
  const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  useEffect(() => {
    document.title = 'Under Construction'
  }, [])

  return (
    <div className="construction">
      <Orbs atom />
      <Loader src="/photos/PICT0025-smooth.jpg" target=".construction-photo--wide img" />
      <a className="skip-link" href="#construction-content">Skip to content</a>
      <header className="construction-header">
        <span>Evan Octave</span>
        <time dateTime={dateValue}>As of {formattedDate}</time>
      </header>

      <main id="construction-content">
        <section className="construction-intro" aria-labelledby="construction-title">
          <h1 aria-label="UNDER CONSTRUCTION" id="construction-title">UNDER<br />CONSTRUCTION</h1>
          <p className="construction-lede">Portfolio currently contains 18% content, 62% loose wires, and 20% suspicious confidence.</p>
          <p className="construction-copy">Please return in about one week, when this place has projects, photos, and fewer exposed cables.</p>
          <Link className="construction-link" to="/home">Enter unfinished site anyway</Link>
        </section>

        <p className="construction-stamp">Status: making things</p>

        <section aria-label="Recent signs of life" className="construction-gallery">
          <figure className="construction-photo construction-photo--wide">
            <img alt="Evan with arms out wide in an empty parking lot at night" src="/photos/PICT0025-smooth.jpg" />
            <figcaption>Evidence of activity, maybe.</figcaption>
          </figure>
          <figure className="construction-photo">
            <img alt="Mario flying through space past a yellow Luma and tiny planets" src="/assets/marioio.jpg" />
            <figcaption>Gravity optional.</figcaption>
          </figure>
        </section>
      </main>

      <footer className="construction-footer">Site in temporary hibernation. Check back soon.</footer>
    </div>
  )
}
