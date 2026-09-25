import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import Scramble from '../components/Scramble.jsx'

const FACTS = [
  ['Now', 'Building internal tools for CSUF IT and Building Engineering.'],
  ['Study', 'Add degree, school, and graduation details here.'],
  ['Stack', 'React, Node, Python, SQL, and whatever the problem needs.'],
  ['Off-hours', 'Racking servers, taking photos, breaking and fixing things.'],
]

export default function AboutPage() {
  return (
    <section className="page about">
      <p className="eyebrow">About</p>
      <h1 className="page-title"><Scramble text="Hi, I’m Evan." /></h1>

      <div className="about-grid">
        <Reveal className="about-portrait">
          <Placeholder label="Portrait of Evan" ratio="3 / 4" />
        </Reveal>
        <Reveal className="about-copy" delay={100}>
          <p className="about-lede">
            I build product systems, creative interfaces, and small technical worlds with enough character to remember.
          </p>
          <p>
            Write your longer bio here — where you come from, what you’re into, what you’re looking for next.
            Keep it short enough that people actually finish it.
          </p>
          <dl className="about-facts">
            {FACTS.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}
          </dl>
        </Reveal>
      </div>

      <section aria-labelledby="bench-title" className="about-strip">
        <Reveal className="section-head">
          <p className="eyebrow">Hardware</p>
          <h2 id="bench-title">The workbench</h2>
        </Reveal>
        <div className="strip">
          <Placeholder label="Server rack" ratio="2 / 3" />
          <Placeholder label="Desk setup" ratio="16 / 9" />
          <Placeholder label="Close-up" ratio="1" />
        </div>
      </section>
    </section>
  )
}
