import PersonalMediaPanel from '../components/PersonalMediaPanel.jsx'

export default function AboutPage() {
  return (
    <section className="page-frame prose-page">
      <p className="eyebrow">About Evan</p>
      <h1>Built in public, kept personal.</h1>
      <p>I build product systems, creative interfaces, and small technical worlds with enough character to remember.</p>
      <section className="about-education" aria-labelledby="education-title">
        <p className="eyebrow">Study</p>
        <h2 id="education-title">Education</h2>
        <p>Add degree, school, and graduation details here.</p>
      </section>
      <PersonalMediaPanel />
    </section>
  )
}
