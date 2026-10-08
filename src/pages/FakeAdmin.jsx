// Fake admin page (/admin): there is no admin side, this just roasts whoever tried. Visiting it finds
// the 'admin' easter egg (src/fx/FxProvider.jsx). Linked from the footer, `cd admin` in the terminal,
// and hinted at by `sudo`. Styles: .nice-try in site.css.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFx } from '../fx/FxProvider.jsx'

export default function FakeAdmin() {
  const { findEgg } = useFx()
  useEffect(() => {
    findEgg('admin')
  }, [findEgg])

  // KNOB: the roast. App.test.jsx checks the heading
  return (
    <section className="page">
      <p className="nice-try">nice try.</p>
      <h1>Very, very clever.</h1>
      <p>I applaud your attempt at accessing the admin side of this website, however that doesn&apos;t exist.</p>
      <p>You are urged to let your critical thinking skills soar and keep trying</p>
      <p>...but I would just <Link to="/home">go back to the main page.</Link></p>
      <p>see ya!</p>
    </section>
  )
}
