// Contact page (/contact): email with a copy button, a joke phone button, and social links.
// the little pop-up messages come from toast() in src/fx/FxProvider.jsx.
import { EMAIL, RESUME } from '../data/contact.js'
import { useFx } from '../fx/FxProvider.jsx'

export default function ContactPage() {
  const { toast } = useFx()

  // KNOB: the toast after copying (shows the address instead if the clipboard is blocked)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast('evan\'s email #copied, nice.')
    } catch {
      toast(EMAIL)
    }
  }

  return (
<<<<<<< HEAD
    <section className="page contact">
      <h1>Contact</h1>
      <div className="contact-main">
        <p className="lede">
          Email is best: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{' '}
          <button className="copy" onClick={copy} type="button">copy</button>
        </p>
        <p>
          Or, you can just take my number!{' '}
          <button className="copy" onClick={() => toast('you thought i\'d publicly display my personal number? wow.')} type="button">copy</button>
        </p>
        <p>I usually reply within a day or two. Work stuff, project ideas, or just saying hi are all fine.</p>
      </div>
      <div className="contact-elsewhere">
        <h2>Elsewhere</h2>
        <ul>
          <li><a href="https://github.com/evanoctave" rel="noreferrer" target="_blank">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/evanbarreau" rel="noreferrer" target="_blank">LinkedIn</a></li>
          <li><a href="https://www.instagram.com/" rel="noreferrer" target="_blank">Instagram</a></li>
        </ul>
      </div>
=======
    <section className="page">
      {/* KNOB: heading + the email line (App.test.jsx expects the h1 'Contact') */}
      <h1>Contact</h1>
      <p className="lede">
        Email is best: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{' '}
        <button className="copy" onClick={copy} type="button">copy</button>
      </p>
      {/* KNOB: the phone joke and its toast text */}
      <p>
        Or, you can just take my number!{' '}
        <button className="copy" onClick={() => toast('you thought i\'d publicly display my personal number? wow.')} type="button">copy</button>
      </p>
      {/* KNOB: reply-time note */}
      <p>I usually reply within a day or two. Work stuff, project ideas, or just saying hi are all fine. Open to connecting with anyone for projects, collaborations, or Apex Legends.</p>
      {/* KNOB: social links, text and url */}
      <h2>Elsewhere</h2>
      <ul>
        <li><a href={RESUME} rel="noreferrer" target="_blank">Résumé (PDF)</a></li>
        <li><a href="https://github.com/evanoctave" rel="noreferrer" target="_blank">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/evanbarreau" rel="noreferrer" target="_blank">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/swevan_tsx" rel="noreferrer" target="_blank">Instagram</a></li>
      </ul>
>>>>>>> e40714470f4fba5e211438db5dd8d45e6deddfa2
    </section>
  )
}
