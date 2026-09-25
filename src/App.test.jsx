import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('site', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('renders home with skip link, nav, and image placeholders', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Evan Octave' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Image placeholder: big photo' })).toBeInTheDocument()
  })

  it('lists every project on the work page and filters by tag', async () => {
    const user = userEvent.setup()
    renderAt('/work')
    expect(screen.getByRole('link', { name: /Digital Package Tracker/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /AI Sentiment Analysis System/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Backend' }))
    expect(screen.queryByRole('link', { name: /AI Sentiment Analysis System/ })).not.toBeInTheDocument()
  })

  it('renders a project case study and redirects legacy project urls', () => {
    renderAt('/projects/ai-sentiment-analysis')
    expect(screen.getByRole('heading', { level: 1, name: 'AI Sentiment Analysis System' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/evanoctave/AI-project')
  })

  it('shows 404 page and records the lost easter egg', () => {
    renderAt('/drifted-away')
    expect(screen.getByRole('heading', { name: 'Nothing here.' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('lost')
  })

  it('moves focus and updates the title after navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const main = screen.getByRole('main')
    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { level: 1, name: "Hi, I'm Evan." })).toBeInTheDocument()
    expect(main).toHaveFocus()
    expect(document.title).toBe('About | Evan Octave')
  })

  it('opens the controls panel with ? and navigates with number keys', () => {
    renderAt('/')
    fireEvent.keyDown(window, { key: '?' })
    expect(screen.getByRole('dialog', { name: 'Controls' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Controls' })).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: '4' })
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument()
  })

  it('inverts the theme with I and respects the shortcut switch', async () => {
    const user = userEvent.setup()
    renderAt('/')
    fireEvent.keyDown(window, { key: 'i' })
    expect(document.documentElement.dataset.fxInverted).toBe('true')

    fireEvent.keyDown(window, { key: '?' })
    await user.click(screen.getByRole('checkbox'))
    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.keyDown(window, { key: 'i' })
    expect(document.documentElement.dataset.fxInverted).toBe('true')
  })

  it('runs terminal commands', async () => {
    const user = userEvent.setup()
    renderAt('/')
    fireEvent.keyDown(window, { key: '/' })
    const input = screen.getByRole('textbox')
    await user.type(input, 'sudo{Enter}')
    expect(screen.getByText(/access granted/)).toBeInTheDocument()
    await user.type(input, 'cd work{Enter}')
    expect(screen.queryByRole('dialog', { name: 'Terminal' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
  })

  it('triggers god mode with the konami code', () => {
    vi.useFakeTimers()
    renderAt('/')
    ;['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      .forEach((key) => fireEvent.keyDown(window, { key }))
    expect(screen.getByText('god mode')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(10) })
    expect(screen.getByRole('status')).toHaveTextContent('Entered the old code')
  })
})
