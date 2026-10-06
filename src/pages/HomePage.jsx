// Home page (/home): printer intro, the heading + intro lines, featured work, about blurb, photos, say hi.
// uses PrinterIntro (src/fx/PrinterIntro.jsx), Scramble / Reveal / Placeholder / WorkList from components/,
// and src/data/projects.js (only projects with featured: true show here).
import { useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'
import WorkList from '../components/WorkList.jsx'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'
import PrinterIntro, { willPrint } from '../fx/PrinterIntro.jsx'
import { projects } from '../data/projects.js'

// a few from the digicam. the full roll is on /life
// KNOB: the photos in the home page grid: order, src (public/photos/), alt, crop (position), shape (ratio).
// className 'photos-tall' / 'photos-fill' are special grid slots in src/styles/site.css
const snapshots = [
  { src: '/photos/mb-pier.jpg', alt: 'Sun setting beside the Manhattan Beach pier', ratio: '3 / 4', position: '70% 50%' },
  { src: '/photos/tuffy.jpg', alt: 'Evan walking with Tuffy the elephant, the Cal State Fullerton mascot', ratio: '3 / 4', position: '50% 40%' },
  { src: '/photos/lava-cove.jpg', alt: 'Waves crashing on black lava rock in a green cove', ratio: '4 / 5', position: '40% 50%', className: 'photos-tall' },
  { src: '/photos/campus-night.jpg', alt: 'Palm trees and lamp posts on campus at night', ratio: '3 / 2' },
  // fills whatever height is left beside the tall lava photo, so both columns end flush
  { src: '/photos/dodgers-night.jpg', alt: 'Dodger Stadium under the lights at night', ratio: 'auto', position: '50% 55%', className: 'photos-fill' },
]

export default function HomePage() {
  // printer intro choreography: 'waiting' (page hidden) -> 'enter' (page assembles,
  // title still in flight) -> 'landed'. On <html> so the header and footer join in.
  const [entry, setEntry] = useState(() => (willPrint() ? 'waiting' : 'static'))
  const [run, setRun] = useState(0)

  useLayoutEffect(() => {
    const root = document.documentElement
    if (entry === 'static') delete root.dataset.pi
    else root.dataset.pi = entry
    return () => { delete root.dataset.pi }
  }, [entry])

  const replay = () => {
    window.scrollTo({ behavior: 'auto', top: 0 })
    setEntry('waiting')
    setRun((count) => count + 1)
  }

  return (
    <div className="home">
      <PrinterIntro
        force={run > 0}
        key={run}
        onEnter={() => setEntry('enter')}
        onLand={() => setEntry('landed')}
      />
      <section className="intro">
        {/* KNOB: the big heading: text and scramble speed (duration 3 = 3x slower). */}
        {/* App.test.jsx expects "What's up" */}
        <h1 className="name">
          <Scramble duration={3} text="What's" />{' '}
          <Scramble duration={3} text="up" />
        </h1>
        {/* KNOB: the line under the heading (your title) */}
        <p>
          SWE (larper) / IT Assistant at California State University, Fullerton
        </p>
        {/* KNOB: the small note under that */}
        <p className="muted">
          This site is used to keep track of my work and projects.
          Press <kbd>?</kbd> for...idk figure it out.
        </p>
        {/* KNOB: replay button text (hidden when reduced motion is on) */}
        {!prefersReducedMotion() && (
          <button className="replay" onClick={replay} type="button">
            <span aria-hidden="true">↺</span> replay intro
          </button>
        )}
      </section>

      {/* KNOB: the wide photo under the intro. App.test.jsx checks its alt */}
      {/* and that src is /photos/csuf-rooftops.jpg */}
      <Placeholder alt="View over Cal State Fullerton rooftops under a wide, streaky sky" className="intro-photo" position="50% 60%" ratio="3 / 2" src="/photos/csuf-rooftops.jpg" />

      {/* KNOB: featured work. a project shows here when it has featured: true in src/data/projects.js */}
      <section className="block" aria-labelledby="work-title">
        <div className="block-head">
          <h2 id="work-title">Work</h2>
          <Link to="/work">see all</Link>
        </div>
        <WorkList projects={projects.filter((project) => project.featured)} />
      </section>

      <section className="block about-bit" aria-labelledby="about-title">
        <Reveal>
          {/* KNOB: the about blurb + its link text */}
          <h2 id="about-title">About</h2>
          <p>
            Most of what I do professionally includes going ham on a keyboard, glazing Linus Torvalds, and plugging in cables.
            Ask me about Typescript. Or gcc vs. clang. or bit-packing. Or my sister's art!</p>
            
            <p>Don't ask me about LeBron leaving the Lakers. I'm heartbroken, too.
          </p>
          <p><Link to="/about">More about me</Link></p>
        </Reveal>
        {/* KNOB: the photo beside the about blurb */}
        <Placeholder alt="Evan with arms out wide in an empty parking lot at night" ratio="4 / 5" src="/photos/PICT0025.jpg" />
      </section>

      <section className="block" aria-labelledby="photos-title">
        {/* KNOB: section heading + link text (App.test.jsx expects 'the whole roll' linking to /life) */}
        <div className="block-head">
          <h2 id="photos-title">Photos</h2>
          <Link to="/life">the whole roll</Link>
        </div>
        <div className="photos">
          {snapshots.map((snap) => (
            <Placeholder alt={snap.alt} className={snap.className} key={snap.src} position={snap.position} ratio={snap.ratio} src={snap.src} />
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="contact-title">
        {/* KNOB: say-hi text. this email is typed out separately from ContactPage.jsx's EMAIL */}
        <h2 id="contact-title">Say hi</h2>
        <p>
          Best way to reach me is email: <a href="mailto:evanoctav3@gmail.com">evanoctav3@gmail.com</a>.
          Or go to the <Link to="/contact">contact page</Link>.
        </p>
      </section>
    </div>
  )
}
