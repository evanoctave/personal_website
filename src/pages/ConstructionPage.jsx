// Under-construction gate at "/", the first thing visitors land on. no nav, just a stamp + 3 photos.
// its link goes to /home (the real site). App.jsx routes "/" here; App.test.jsx checks its text.
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
  // KNOB: how the date reads ('full' = Sunday, September 27, 2026; App.test.jsx expects that format)
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date)
  const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  useEffect(() => {
<<<<<<< HEAD
    document.title = 'Under Construction'
=======
    // KNOB: tab title for this page
    document.title = 'Hello World | Evan Octave'
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
  }, [])

  return (
    <div className="construction">
      <Orbs atom />
      <Loader prints={PRINTS} />
      <a className="skip-link" href="#construction-content">Skip to content</a>
      <header className="construction-header">
<<<<<<< HEAD
        <span></span>
=======
        {/* KNOB: name in the top bar */}
        <span>Evan Octave</span>
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
        <time dateTime={dateValue}>As of {formattedDate}</time>
      </header>

      <main id="construction-content">
        <section className="construction-intro" aria-labelledby="construction-title">
<<<<<<< HEAD
          <h1 aria-label="UNDER CONSTRUCTION" id="construction-title">UNDER<br />CONSTRUCTION</h1>
          <p className="construction-lede">Portfolio currently contains 18% content, 62% loose wires, and 20% suspicious confidence.</p>
          <p className="construction-copy">Please return in about one week, when this place has projects, photos, and fewer exposed cables.</p>
          <Link className="construction-link" to="/home">Enter unfinished site anyway</Link>
        </section>

        <p className="construction-stamp">Status: making things</p>

        <section aria-label="Recent signs of life" className="construction-gallery">
=======
          {/* KNOB: the gate copy: stamp, big heading, lede, follow-up, link text. */}
          {/* App.test.jsx checks the heading, */}
          {/* the 'Enter unfinished site anyway' text, and that it links to /home */}
          <p className="construction-stamp">im a useless box</p>
          <h1 id="construction-title">HELLO_WORLD</h1>
          <p className="construction-lede">Portfolio currently contains about 18% content, 34% loose cables, and 48% super mario galaxy mentions. Go ahead, snoop around. No judging here.</p>
          <p className="construction-copy">welcome to my website!</p>
          <Link className="construction-link" to="/home">npx ts-node portfolio.ts</Link>
        </section>

        {/* KNOB: the three photos + captions (files in public/photos/). App.test.jsx expects 3 images. */}
        {/* the --wide / --tall / --close classes pick each spot in site.css */}
       {/*  <section aria-label="Recent signs of life" className="construction-gallery">
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
          <figure className="construction-photo construction-photo--wide">
            <img alt="Evan with arms out wide in an empty parking lot at night" src="/photos/PICT0025-smooth.jpg" />
          </figure>
          <figure className="construction-photo">
            <img alt="Mario flying through space past a yellow Luma and tiny planets" src="/assets/marioio.jpg" />
          </figure>
        </section> */}
      </main>

      {/* KNOB: footer line */}
      <footer className="construction-footer">Evan Octave - 2026 - All rights reserved.</footer>
    </div>
  )
}
