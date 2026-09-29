import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ConstructionPage() {
  const date = new Date()
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date)
  const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  useEffect(() => {
    document.title = 'Under Construction | Evan Octave'
  }, [])

  return (
    <div className="construction">
      <a className="skip-link" href="#construction-content">Skip to content</a>
      <header className="construction-header">
        <span>Evan Octave</span>
        <time dateTime={dateValue}>As of {formattedDate}</time>
      </header>

      <main id="construction-content">
        <section className="construction-intro" aria-labelledby="construction-title">
          <p className="construction-stamp">Status: making things</p>
          <h1 aria-label="UNDER CONSTRUCTION" id="construction-title">UNDER<br />CONSTRUCTION</h1>
          <p className="construction-lede">Portfolio currently contains 18% content, 62% loose wires, and 20% suspicious confidence.</p>
          <p className="construction-copy">Please return in about one week, when this place has projects, photos, and fewer exposed cables.</p>
          <Link className="construction-link" to="/home">Enter unfinished site anyway</Link>
        </section>

        <section aria-label="Recent signs of life" className="construction-gallery">
          <figure className="construction-photo construction-photo--wide">
            <img alt="Evan with arms out wide in an empty parking lot at night" src="/photos/PICT0025.jpg" />
            <figcaption>Evidence of activity, maybe.</figcaption>
          </figure>
          <figure className="construction-photo construction-photo--tall">
            <img alt="Whiteboard with thin film interference equations" src="/photos/PICT0016.jpg" />
            <figcaption>Habitat under repair.</figcaption>
          </figure>
          <figure className="construction-photo construction-photo--close">
            <img alt="Hand splayed over packs of stew meat" src="/photos/PICT0010.jpg" />
            <figcaption>Do not feed after midnight.</figcaption>
          </figure>
        </section>
      </main>

      <footer className="construction-footer">Site in temporary hibernation. Check back soon.</footer>
    </div>
  )
}
