import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects.js'
import Cursor from '../fx/Cursor.jsx'
import DotField from '../fx/DotField.jsx'
import { EGGS, useFx } from '../fx/FxProvider.jsx'
import Overlays from '../fx/Overlays.jsx'

const SITE = 'Evan Octave'

const getPageTitle = (pathname) => {
  if (pathname === '/') return SITE
  if (pathname === '/work') return 'Work'
  if (pathname === '/about') return 'About'
  if (pathname === '/contact') return 'Contact'
  if (pathname.startsWith('/work/')) return getProjectBySlug(pathname.slice('/work/'.length))?.title ?? 'Lost'
  return 'Lost'
}

export default function SiteShell() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isInitialRender = useRef(true)
  const clicks = useRef({ count: 0, timer: 0 })
  const { eggs, findEgg, pop, pulse, setPanelOpen } = useFx()

  useEffect(() => {
    const title = getPageTitle(pathname)
    document.title = title === SITE ? SITE : `${title} | ${SITE}`

    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    window.scrollTo({ behavior: 'auto', top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  useEffect(() => {
    console.log('hey. press ? on the page, or / for a terminal. there are 7 easter eggs.')
  }, [])

  // click the name 7 times fast
  const onLogo = () => {
    const state = clicks.current
    state.count += 1
    clearTimeout(state.timer)
    state.timer = setTimeout(() => { state.count = 0 }, 1400)
    if (state.count === 7) {
      state.count = 0
      findEgg('logo')
      pop('ok ok ok', { x: 50, y: 40 })
      pulse('fx-spin', 1000)
    }
  }

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <DotField />
      <header className="site-header">
        <NavLink aria-label="Evan Octave home" className="home-link" end onClick={onLogo} to="/">Evan Octave</NavLink>
        <nav aria-label="Primary">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button className="help" onClick={() => setPanelOpen(true)} type="button">
            <span className="sr-only">Show controls and easter eggs</span>
            <span aria-hidden="true">?</span>
          </button>
        </nav>
      </header>

      <main id="main-content" ref={mainRef} tabIndex="-1"><Outlet /></main>

      <footer className="site-footer">
        <p>Made by hand by Evan Octave, {new Date().getFullYear()}.</p>
        <p>{eggs.size} of {Object.keys(EGGS).length} secrets found.</p>
      </footer>

      <Cursor />
      <Overlays />
    </div>
  )
}
