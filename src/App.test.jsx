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

  it('shows construction gate at root with date, photos, and unfinished-site link', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-27T12:00:00'))
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'UNDER CONSTRUCTION' })).toBeInTheDocument()
    expect(screen.getByText('As of Sunday, September 27, 2026')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'Enter unfinished site anyway' })).toHaveAttribute('href', '/home')
  })

  it('covers the construction page with the sticker printer, then gets out of the way', () => {
    vi.useFakeTimers()
    renderAt('/')
    expect(document.querySelector('.loader')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2600) })
    expect(document.querySelector('.loader')).toHaveClass('is-flying')
    act(() => { vi.advanceTimersByTime(1000) })
    expect(document.querySelector('.loader')).not.toBeInTheDocument()
  })

  it('renders home with skip link, nav, and real photos', () => {
    renderAt('/home')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: "What's up" })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Cal State Fullerton rooftops/ })).toHaveAttribute('src', '/photos/PICT0020.jpg')
    expect(screen.queryByRole('img', { name: /Image placeholder/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'the whole roll' })).toHaveAttribute('href', '/life')
  })

  it('shows the life page as a dated roll of photos and muted clips', async () => {
    const user = userEvent.setup()
    renderAt('/life')
    expect(screen.getByRole('heading', { level: 1, name: 'life' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '08 20 2026' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'spring 2025' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /mid-pitch on the mound/ })).toHaveAttribute('src', '/photos/pitch.jpg')
    expect(screen.getByRole('img', { name: /arms out wide/ })).toHaveAttribute('src', '/photos/PICT0025-smooth.jpg')
    const clip = document.querySelector('video[src="/clips/MOVI0007.mp4"]')
    expect(clip).toHaveAttribute('poster', '/clips/MOVI0007.jpg')
    expect(clip.muted).toBe(true)
    const [sound] = screen.getAllByRole('button', { name: 'sound' })
    await user.click(sound)
    expect(sound).toHaveTextContent('mute')
    expect(document.title).toBe('Life | Evan Octave')
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
    expect(screen.getByRole('heading', { name: 'Not sure how YOU got here...' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('lost')
  })

  it('moves focus and updates the title after navigation', async () => {
    const user = userEvent.setup()
    renderAt('/home')
    const main = screen.getByRole('main')
    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { level: 1, name: 'me' })).toBeInTheDocument()
    expect(main).toHaveFocus()
    expect(document.title).toBe('About | Evan Octave')
  })

  it('travels to a page through its orb', () => {
    vi.useFakeTimers()
    renderAt('/home')
    fireEvent.click(screen.getByRole('link', { name: 'Travel to Life' }))
    expect(screen.getByText('heading to life…')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByRole('heading', { level: 1, name: 'life' })).toBeInTheDocument()
    expect(document.body).not.toHaveClass('is-traveling')
  })

  it('opens the controls panel with ? and navigates with number keys', () => {
    renderAt('/home')
    fireEvent.keyDown(window, { key: '?' })
    expect(screen.getByRole('dialog', { name: 'Controls' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Controls' })).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: '4' })
    expect(screen.getByRole('heading', { level: 1, name: 'life' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: '5' })
    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument()
  })

  it('inverts the theme with I and respects the shortcut switch', async () => {
    const user = userEvent.setup()
    renderAt('/home')
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
    renderAt('/home')
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
    renderAt('/home')
    ;['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      .forEach((key) => fireEvent.keyDown(window, { key }))
    expect(screen.getByText('god mode')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(10) })
    expect(screen.getByRole('status')).toHaveTextContent('Entered the old code')
  })
})
