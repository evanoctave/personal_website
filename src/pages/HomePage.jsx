import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'
import WorkList from '../components/WorkList.jsx'
import { projects } from '../data/projects.js'

// photos go here eventually. src: '/images/whatever.jpg'
const snapshots = [
  { label: 'photo', ratio: '3 / 4' },
  { label: 'photo', ratio: '1' },
  { label: 'photo', ratio: '4 / 5' },
  { label: 'photo', ratio: '3 / 2' },
]

export default function HomePage() {
  return (
    <div className="home">
      <section className="intro">
        <h1 className="name">
          <Scramble duration={3} text="Evan" />{' '}
          <Scramble duration={3} text="Octave" />
        </h1>
        <p>
          I'm a developer. Right now I'm building internal tools for CSUF IT and Building
          Engineering, and on the side I mess around with machine learning and keep a small
          server rack alive.
        </p>
        <p className="muted">
          This site is mostly a place to put things I've made. Some of it is hidden. Try
          pressing <kbd>?</kbd>.
        </p>
      </section>

      <Placeholder className="intro-photo" label="big photo" ratio="3 / 2" />

      <section className="block" aria-labelledby="work-title">
        <div className="block-head">
          <h2 id="work-title">Work</h2>
          <Link to="/work">see all</Link>
        </div>
        <WorkList projects={projects} />
      </section>

      <section className="block about-bit" aria-labelledby="about-title">
        <Reveal>
          <h2 id="about-title">About</h2>
          <p>
            Most of what I do sits somewhere between writing software and physically plugging
            things in. I like tools that people actually use every day, and I like it when
            the boring parts are done right.
          </p>
          <p><Link to="/about">More about me</Link></p>
        </Reveal>
        <Placeholder label="me" ratio="4 / 5" />
      </section>

      <section className="block" aria-labelledby="photos-title">
        <h2 id="photos-title">Photos</h2>
        <div className="photos">
          {snapshots.map((snap, i) => (
            <Placeholder key={i} label={snap.label} ratio={snap.ratio} src={snap.src} />
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="contact-title">
        <h2 id="contact-title">Say hi</h2>
        <p>
          Best way to reach me is email: <a href="mailto:evanoctav3@gmail.com">evanoctav3@gmail.com</a>.
          Or go to the <Link to="/contact">contact page</Link>.
        </p>
      </section>
    </div>
  )
}
