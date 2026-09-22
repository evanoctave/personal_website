import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getProjectBySlug } from '../data/projects.js'

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Orbitfolio'
  if (pathname === '/projects') return 'Project worlds'
  if (pathname === '/about') return 'About this orbit'
  if (pathname === '/contact') return 'Make contact'
  if (pathname.startsWith('/projects/')) {
    return getProjectBySlug(pathname.slice('/projects/'.length))?.title ?? 'Not found'
  }
  return 'Not found'
}

export default function SiteShell() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isInitialRender = useRef(true)

  useEffect(() => {
    document.title = `${getPageTitle(pathname)} | Orbitfolio`

    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    window.scrollTo({ behavior: 'auto', top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="starfield" aria-hidden="true" />
      <header className="site-header">
      <NavLink className="wordmark" to="/" aria-label="Evan Octave home">EVAN OCTAVE / DEV + DESIGN</NavLink>
        <nav aria-label="Primary">
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main id="main-content" ref={mainRef} tabIndex="-1"><Outlet /></main>
      <footer className="site-footer"><p>Independent creative developer · Available for select collaborations.</p></footer>
    </div>
  )
}
