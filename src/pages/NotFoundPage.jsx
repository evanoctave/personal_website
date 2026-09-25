import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFx } from '../fx/FxProvider.jsx'

export default function NotFoundPage() {
  const { findEgg } = useFx()
  useEffect(() => findEgg('lost'), [findEgg])

  return (
    <section className="page lost">
      <p className="lost-code" data-text="404" aria-hidden="true">404</p>
      <h1 className="page-title">Nothing here.</h1>
      <p>This page doesn’t exist. Could be a typo, could be fate. Press <kbd>1</kbd> or take the link.</p>
      <Link className="text-link" data-cursor="HOME" to="/">← Home</Link>
    </section>
  )
}
