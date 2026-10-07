// SiteShell: the frame around every page except "/": header (name + nav), footer, and the fx layers
// (cursor, dot field, overlays, lightbox, print receipt from src/fx/). App.jsx nests the pages inside it.
// also sets the tab title and resets scroll + focus on every page change.
import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects.js'
import Cursor from '../fx/Cursor.jsx'
import DotField from '../fx/DotField.jsx'
import { EGGS, useFx } from '../fx/FxProvider.jsx'
import Lightbox from '../fx/Lightbox.jsx'
import Overlays from '../fx/Overlays.jsx'
import Receipt from '../fx/Receipt.jsx'

// KNOB: your name in every tab title ("Work | Evan Octave"). App.test.jsx expects "Life | Evan Octave" etc.
const SITE = 'Evan Octave'

// KNOB: tab title per URL. a new route in App.jsx needs a line here or its tab says 'Lost'.
// project pages use the title from src/data/projects.js.
const getPageTitle = (pathname) => {
  if (pathname === '/home') return SITE
  if (pathname === '/work') return 'Work'
  if (pathname === '/about') return 'About'
  if (pathname === '/life') return 'Life'
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
    // KNOB: the message people see if they open the dev console
    console.log(`hey. press ? on the page, or / for a terminal. there are ${Object.keys(EGGS).length} easter eggs.`)
  }, [])

  // click the name 7 times fast
  const onLogo = () => {
    const state = clicks.current
    state.count += 1
    clearTimeout(state.timer)
    // KNOB: 1400 = ms allowed between clicks, 7 = clicks needed, then the pop text and a 1000ms spin
    state.timer = setTimeout(() => { state.count = 0 }, 1400)
    if (state.count === 7) {
      state.count = 0
      findEgg('logo')
      pop('ok ok ok', { x: 50, y: 40 })
      pulse('fx-spin', 1000)
    }
  }

  return (
    <div className={`site${pathname === '/home' ? ' site--wide' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <DotField />
      <header className="site-header">
        {/* KNOB: the name in the top-left (links to /home) */}
        <NavLink aria-label="Evan Octave home" className="home-link" end onClick={onLogo} to="/home">Evan Octave</NavLink>
        <nav aria-label="Primary">
          {/* KNOB: nav links, text and order. keep in sync with App.jsx routes */}
          {/* and the number keys in src/fx/FxProvider.jsx */}
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/life">Life</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button className="help" onClick={() => setPanelOpen(true)} type="button">
            <span className="sr-only">Show controls and easter eggs</span>
            <span aria-hidden="true">?</span>
          </button>
        </nav>
      </header>

      <main id="main-content" ref={mainRef} tabIndex="-1"><Outlet /></main>

      <footer className="site-footer">
        {/* KNOB: footer text (the year updates itself) */}
        <p>Evan Octave: Made by hand (or by keyboard, if you will) {new Date().getFullYear()}.</p>
        <p>{eggs.size} of {Object.keys(EGGS).length} secrets found.</p>
      </footer>

      <Cursor />
      <Overlays />
      <Lightbox />
      <Receipt />
    </div>
  )
}
