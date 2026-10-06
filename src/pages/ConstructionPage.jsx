// Under-construction gate at "/", the first thing visitors land on. no nav, just a stamp + 3 photos.
// its link goes to /home (the real site). App.jsx routes "/" here; App.test.jsx checks its text.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ConstructionPage() {
  const date = new Date()
  // KNOB: how the date reads ('full' = Sunday, September 27, 2026; App.test.jsx expects that format)
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date)
  const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  useEffect(() => {
    // KNOB: tab title for this page
    document.title = 'Under Construction | Evan Octave'
  }, [])

  return (
    <div className="construction">
      <a className="skip-link" href="#construction-content">Skip to content</a>
      <header className="construction-header">
        {/* KNOB: name in the top bar */}
        <span>Evan Octave</span>
        <time dateTime={dateValue}>As of {formattedDate}</time>
      </header>

      <main id="construction-content">
        <section className="construction-intro" aria-labelledby="construction-title">
          {/* KNOB: the gate copy: stamp, big heading, lede, follow-up, link text. */}
          {/* App.test.jsx checks the heading, */}
          {/* the 'Enter unfinished site anyway' text, and that it links to /home */}
          <p className="construction-stamp">Status: making things</p>
          <h1 aria-label="UNDER CONSTRUCTION" id="construction-title">UNDER<br />CONSTRUCTION</h1>
          <p className="construction-lede">Portfolio currently contains 18% content, 62% loose wires, and 20% suspicious confidence.</p>
          <p className="construction-copy">Please return in about one week, when this place has projects, photos, and fewer exposed cables.</p>
          <Link className="construction-link" to="/home">Enter unfinished site anyway</Link>
        </section>

        {/* KNOB: the three photos + captions (files in public/photos/). App.test.jsx expects 3 images. */}
        {/* the --wide / --tall / --close classes pick each spot in site.css */}
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

      {/* KNOB: footer line */}
      <footer className="construction-footer">Site in temporary hibernation. Check back soon.</footer>
    </div>
  )
}
