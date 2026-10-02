import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../fx/Loader.jsx'
import Orbs from '../fx/Orbs.jsx'

// what the intro printer spits out, in order. target is where each sticker lands on this page
const PRINTS = [
  { src: '/photos/PICT0025-smooth.jpg', label: 'evo.jpg', ratio: '4 / 3', target: '.construction-photo--wide img' },
  { src: '/assets/marioio.jpg', label: 'mario.jpg', ratio: '16 / 10', target: '.construction-photo:not(.construction-photo--wide) img' },
]

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
      <Loader prints={PRINTS} />
      <a className="skip-link" href="#construction-content">Skip to content</a>
      <header className="construction-header">
        <span></span>
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
          </figure>
          <figure className="construction-photo">
            <img alt="Mario flying through space past a yellow Luma and tiny planets" src="/assets/marioio.jpg" />
          </figure>
        </section>
      </main>

      <footer className="construction-footer">Site in temporary hibernation. Check back soon.</footer>
    </div>
  )
}
