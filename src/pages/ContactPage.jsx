import Magnetic from '../components/Magnetic.jsx'
import Scramble from '../components/Scramble.jsx'
import { blast, useFx } from '../fx/FxProvider.jsx'

const EMAIL = 'evanoctav3@gmail.com'
const SOCIALS = [
  ['GitHub', 'https://github.com/evanoctave'],
  ['LinkedIn', 'https://www.linkedin.com/'],
  ['Instagram', 'https://www.instagram.com/'],
]

export default function ContactPage() {
  const { toast } = useFx()

  const copy = async (event) => {
    blast(event.clientX, event.clientY, 1.4)
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast('Email copied. Talk soon.')
    } catch {
      toast(EMAIL)
    }
  }

  return (
    <section className="page contact">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title"><Scramble text="Say hello." /></h1>
      <p className="contact-lede">Product work, creative development, or a useful rabbit hole. I read my own inbox.</p>

      <Magnetic strength={0.12}>
        <button className="contact-email" data-cursor="COPY" onClick={copy} type="button">
          {EMAIL}
        </button>
      </Magnetic>
      <p className="contact-hint">Click to copy · or <a href={`mailto:${EMAIL}`}>open mail app</a></p>

      <ul className="contact-socials">
        {SOCIALS.map(([label, href]) => (
          <li key={label}><a data-cursor="OPEN" href={href} rel="noreferrer" target="_blank">{label} ↗</a></li>
        ))}
      </ul>
    </section>
  )
}
