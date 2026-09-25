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
      <p className="four-oh-four" aria-hidden="true">404</p>
      <h1>Nothing here.</h1>
      <p>That page doesn't exist. <Link to="/">Go home</Link>, or press <kbd>1</kbd>.</p>
    </section>
  )
}
