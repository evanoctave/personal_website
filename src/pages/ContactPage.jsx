import { useFx } from '../fx/FxProvider.jsx'

const EMAIL = 'evanoctav3@gmail.com'

export default function ContactPage() {
  const { toast } = useFx()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast('evan\'s email #copied, nice.')
    } catch {
      toast(EMAIL)
    }
  }

  return (
    <section className="page">
      <h1>Contact</h1>
      <p className="lede">
        Email is best: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{' '}
        <button className="copy" onClick={copy} type="button">copy</button>
      </p>
      <p>
        Or, you can just take my number!{' '}
        <button className="copy" onClick={() => toast('you thought i\'d publicly display my personal number? wow.')} type="button">copy</button>
      </p>
      <p>I usually reply within a day or two. Work stuff, project ideas, or just saying hi are all fine.</p>
      <h2>Elsewhere</h2>
      <ul>
        <li><a href="https://github.com/evanoctave" rel="noreferrer" target="_blank">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/evanbarreau" rel="noreferrer" target="_blank">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/" rel="noreferrer" target="_blank">Instagram</a></li>
      </ul>
    </section>
  )
}
