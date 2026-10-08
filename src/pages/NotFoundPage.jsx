// 404 page: shows for any URL App.jsx does not know (the "*" route) and for unknown /work/<slug>.
// also unlocks the 'lost' easter egg via findEgg in src/fx/FxProvider.jsx (saved in localStorage 'eo-eggs').
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFx } from '../fx/FxProvider.jsx'

export default function NotFoundPage() {
  const { findEgg } = useFx()
  useEffect(() => {
    findEgg('lost')
  }, [findEgg])

  return (
    <section className="page">
      {/* KNOB: the 404 heading + line (App.test.jsx expects this exact heading) */}
      <p className="four-oh-four" aria-hidden="true">404</p>
      <h1>Not sure how YOU got here...</h1>
      <p>That page doesn't exist. <Link to="/home">Go home</Link>, or press <kbd>1</kbd>.</p>
    </section>
  )
}