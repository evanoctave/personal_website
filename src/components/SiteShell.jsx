import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects.js'
import Cursor from '../fx/Cursor.jsx'
import DotField from '../fx/DotField.jsx'
import { EGGS, useFx } from '../fx/FxProvider.jsx'
import Overlays from '../fx/Overlays.jsx'
import Clock from './Clock.jsx'
import Scramble from './Scramble.jsx'

const SITE = 'Evan Octave'

const getPageTitle = (pathname) => {
  if (pathname === '/') return SITE
  if (pathname === '/work') return 'Work'
  if (pathname === '/about') return 'About'
  if (pathname === '/contact') return 'Contact'
  if (pathname.startsWith('/work/')) return getProjectBySlug(pathname.slice('/work/'.length))?.title ?? 'Lost'
  return 'Lost'
}

const NAV = [
  ['/work', 'Work', '2'],
  ['/about', 'About', '3'],
  ['/contact', 'Contact', '4'],
]

export default function SiteShell() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isInitialRender = useRef(true)
  const clicks = useRef({ count: 0, timer: 0 })
  const { eggs, findEgg, pop, pulse, setPanelOpen } = useFx()

  useEffect(() => {
    const title = getPageTitle(pathname)
    document.title = title === SITE ? `${SITE} — developer & designer` : `${title} — ${SITE}`

    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    window.scrollTo({ behavior: 'auto', top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  useEffect(() => {
    console.log(
      '%c EO %c\n\nOh hey, a fellow view-sourcer.\nPress ? on the page for controls, or / for a terminal.\nThere are 7 easter eggs. Good luck.',
      'background:#f2f2ee;color:#0a0a0a;font:900 28px/1 sans-serif;padding:8px 10px',
      'font:12px monospace',
    )
  }, [])

  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) > 6) setHidden(y > last && y > 120)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onLogo = () => {
    const state = clicks.current
    state.count += 1
    window.clearTimeout(state.timer)
    state.timer = window.setTimeout(() => { state.count = 0 }, 1400)
    if (state.count === 7) {
      state.count = 0
      findEgg('logo')
      pop('OK OK OK', { x: 50, y: 40 })
      pulse('fx-spin', 1000)
    }
  }

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <DotField />
      <header className={`site-header${hidden ? ' is-hidden' : ''}`}>
        <NavLink aria-label="Evan Octave home" className="wordmark" data-cursor="HOME" onClick={onLogo} to="/">
          <span className="wordmark-mark" aria-hidden="true">EO</span>
          <span className="wordmark-name"><Scramble onMount={false} text="Evan Octave" /></span>
        </NavLink>
        <nav aria-label="Primary">
          {NAV.map(([to, label, key]) => (
            <NavLink key={to} to={to}>
              <Scramble onMount={false} text={label} />
              <kbd aria-hidden="true">{key}</kbd>
            </NavLink>
          ))}
        </nav>
        <button className="help-button" data-cursor="?" onClick={() => setPanelOpen(true)} type="button">
          <span className="sr-only">Show controls and easter eggs</span>
          <span aria-hidden="true">?</span>
        </button>
      </header>

      <main id="main-content" ref={mainRef} tabIndex="-1"><Outlet /></main>

      <footer className="site-footer">
        <p className="footer-giant" aria-hidden="true">EVAN OCTAVE</p>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} Evan Octave</p>
          <p>Fullerton, CA · <Clock /></p>
          <p>Eggs found {eggs.size}/{Object.keys(EGGS).length} · press <kbd>?</kbd></p>
          <a data-cursor="UP" href="#main-content" onClick={(event) => {
            event.preventDefault()
            window.scrollTo({ behavior: 'smooth', top: 0 })
          }}>Back to top ↑</a>
        </div>
      </footer>

      <Cursor />
      <Overlays />
    </div>
  )
}
