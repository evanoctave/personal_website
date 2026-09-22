import { NavLink, Outlet } from 'react-router-dom'

export default function SiteShell() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="starfield" aria-hidden="true" />
      <header className="site-header">
        <NavLink className="wordmark" to="/" aria-label="Orbitfolio home">Orbitfolio</NavLink>
        <nav aria-label="Primary">
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer"><p>Built to be replaced with your next great thing.</p></footer>
    </div>
  )
}
