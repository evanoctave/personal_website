import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>,
)

describe('application routes', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders main navigation and skip link', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('renders about route', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'Built in public, kept personal.' })).toBeInTheDocument()
  })

  it('keeps contact route direct and non-placeholder', () => {
    renderAt('/contact')

    expect(screen.getByRole('heading', { name: 'Let’s make something with a pulse.' })).toBeInTheDocument()
    expect(screen.queryByText(/Replace this email/)).not.toBeInTheDocument()
  })

  it('renders original recovery page for unknown routes', () => {
    renderAt('/drifted-away')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
  })

  it('moves focus, scroll position, and document title after navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const main = screen.getByRole('main')
    window.scrollTo.mockClear()

    await user.click(screen.getByRole('link', { name: 'Projects' }))

    expect(screen.getByRole('heading', { name: 'Project worlds' })).toBeInTheDocument()
    expect(main).toHaveFocus()
    expect(document.title).toBe('Project worlds | Orbitfolio')
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', top: 0 })
  })
})
