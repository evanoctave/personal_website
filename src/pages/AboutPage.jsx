import Placeholder from '../components/Placeholder.jsx'

export default function AboutPage() {
  return (
    <section className="page">
      <h1>Hi, I'm Evan.</h1>
      <Placeholder className="about-photo" label="me" ratio="4 / 5" />
      <p className="lede">
        I build software and occasionally the hardware it runs on.
      </p>
      <p>
        (write the real bio here. where you grew up, how you got into this, what you're
        looking for next. a paragraph or two is plenty.)
      </p>

      <h2>Right now</h2>
      <ul>
        <li>Building internal tools for CSUF IT and Building Engineering</li>
        <li>Learning more ML than I probably need to</li>
        <li>Keeping a home server rack running</li>
      </ul>

      <h2>School</h2>
      <p>(degree, school, graduation year)</p>

      <h2>Desk + rack</h2>
      <div className="gallery gallery--three">
        <Placeholder label="rack" ratio="2 / 3" />
        <Placeholder label="desk" ratio="2 / 3" />
        <Placeholder label="close-up" ratio="2 / 3" />
      </div>
    </section>
  )
}
