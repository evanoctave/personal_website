import { Link } from 'react-router-dom'
import Clock from '../components/Clock.jsx'
import Magnetic from '../components/Magnetic.jsx'
import Marquee from '../components/Marquee.jsx'
import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'
import WorkList from '../components/WorkList.jsx'
import { projects } from '../data/projects.js'

const STACK = ['React', 'Node.js', 'Python', 'Express', 'SQLite', 'scikit-learn', 'Figma', 'Hardware', 'PWAs', 'Linux']

// Swap `src` in for real photos. Ratios are free to change.
const SNAPSHOTS = [
  { label: 'Snapshot 01', ratio: '3 / 4' },
  { label: 'Snapshot 02', ratio: '1' },
  { label: 'Snapshot 03', ratio: '4 / 5' },
  { label: 'Snapshot 04', ratio: '16 / 10' },
  { label: 'Snapshot 05', ratio: '3 / 4' },
  { label: 'Snapshot 06', ratio: '1' },
]

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-meta">
          <span>Portfolio ’26</span>
          <span>Developer / Designer</span>
          <span><Clock /></span>
          <span className="hero-hint">Press <kbd>?</kbd></span>
        </div>
        <h1 className="hero-title">
          <span className="hero-line"><Scramble text="Evan" /></span>{' '}
          <span className="hero-line hero-line--offset"><Scramble text="Octave" /></span>
        </h1>
        <div className="hero-foot">
          <p className="hero-lede">
            I build product systems, creative interfaces, and small technical worlds —
            <em> things that work hard and still feel good to touch.</em>
          </p>
          <Placeholder className="hero-image" label="Hero image" ratio="16 / 9" />
        </div>
        <p aria-hidden="true" className="hero-scroll">Scroll ↓</p>
      </section>

      <Marquee items={STACK} />

      <section className="section" aria-labelledby="work-title">
        <Reveal className="section-head">
          <p className="eyebrow">(01) Selected work</p>
          <h2 id="work-title">Things I made</h2>
          <Link className="text-link" data-cursor="ALL" to="/work">All work →</Link>
        </Reveal>
        <WorkList projects={projects} />
      </section>

      <section className="section split" aria-labelledby="about-teaser">
        <Reveal className="split-text">
          <p className="eyebrow">(02) About</p>
          <h2 id="about-teaser">Hands on keyboard. Hands on hardware.</h2>
          <p>
            Most of my work lives between the screen and the rack — building tools people use every day,
            then wiring up the machines they run on. I care about clear systems and the last ten percent.
          </p>
          <Link className="text-link" data-cursor="READ" to="/about">More about me →</Link>
        </Reveal>
        <Reveal className="split-media" delay={120}>
          <Placeholder label="Portrait" ratio="4 / 5" />
        </Reveal>
      </section>

      <section className="section" aria-labelledby="snaps-title">
        <Reveal className="section-head">
          <p className="eyebrow">(03) Off-screen</p>
          <h2 id="snaps-title">Snapshots</h2>
        </Reveal>
        <div className="snaps">
          {SNAPSHOTS.map((snap, i) => (
            <Reveal delay={i * 70} key={snap.label}>
              <Placeholder label={snap.label} ratio={snap.ratio} src={snap.src} />
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={['Available for work', 'Say hello', 'Let’s build something']} reverse />

      <section className="cta" aria-labelledby="cta-title">
        <p className="eyebrow">(04) Contact</p>
        <h2 id="cta-title">Got an idea?</h2>
        <Magnetic>
          <Link className="big-button" data-cursor="GO" to="/contact">Let’s talk</Link>
        </Magnetic>
      </section>
    </>
  )
}
