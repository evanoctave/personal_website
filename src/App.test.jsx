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

  it('shows construction gate at root with date and the link into the site', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-27T12:00:00'))
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'UNDER CONSTRUCTION' })).toBeInTheDocument()
    expect(screen.getByText('As of Sunday, September 27, 2026')).toBeInTheDocument()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(screen.getByRole('link', { name: 'npx ts-node portfolio.ts' })).toHaveAttribute('href', '/home')
  })

  it('renders home with skip link, nav, and real photos', () => {
    renderAt('/home')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: "What's up" })).toBeInTheDocument()
    expect(screen.getByLabelText(/sits down in front of the camera and waves/)).toHaveAttribute('src', '/clips/wave.mp4')
    expect(screen.queryByRole('img', { name: /Image placeholder/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'the whole roll' })).toHaveAttribute('href', '/life')
  })

  it('shows the life page as a dated roll of photos and muted clips', async () => {
    const user = userEvent.setup()
    renderAt('/life')
    expect(screen.getByRole('heading', { level: 1, name: 'life' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '08 20 2026' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'before the digicam' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /mid-pitch on the mound/ })).toHaveAttribute('src', '/photos/pitch.jpg')
    expect(screen.getByRole('img', { name: /Dodger Stadium under the lights/ })).toHaveAttribute('src', '/photos/dodgers-night.jpg')
    expect(screen.queryByRole('img', { name: /Ghost cherry limeade/ })).not.toBeInTheDocument()
    const clip = document.querySelector('video[src="/clips/MOVI0002.mp4"]')
    expect(clip).toHaveAttribute('poster', '/clips/MOVI0002.jpg')
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

  it('opens a photo in the lightbox and walks the roll with the keyboard', async () => {
    const user = userEvent.setup()
    renderAt('/life')
    await user.click(screen.getByRole('button', { name: /Dodger Stadium under the lights/ }))
    const dialog = screen.getByRole('dialog', { name: 'Photo viewer' })
    expect(dialog).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    const count = document.querySelector('.lightbox-count').textContent
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(document.querySelector('.lightbox-count').textContent).not.toBe(count)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Photo viewer' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('roasts anyone who tries /admin and records the egg', () => {
    renderAt('/admin')
    expect(screen.getByRole('heading', { level: 1, name: 'Very, very clever.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'go back to the main page.' })).toHaveAttribute('href', '/home')
    expect(document.title).toBe('Admin | Evan Octave')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('admin')
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
    await user.type(input, 'work{Enter}')
    expect(screen.getByText(/\[1\] Digital Package Tracker/)).toBeInTheDocument()
    expect(await screen.findByText("try 'work' then a number (like 'work 2') to open that project", {}, { timeout: 2000 })).toBeInTheDocument()
    await user.type(input, 'sudo{Enter}')
    expect(screen.getByText(/access granted/)).toBeInTheDocument()
    await user.type(input, 'cd work{Enter}')
    expect(screen.queryByRole('dialog', { name: 'Terminal' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
  })

  it('prints a receipt instead of the print dialog and counts it as an egg', async () => {
    // intro already seen, so key presses count from the start
    window.sessionStorage.setItem('eo-printed', '1')
    renderAt('/home')
    ;['q', 'w', 'e'].forEach((key) => fireEvent.keyDown(window, { key }))
    const event = new KeyboardEvent('keydown', { key: 'p', metaKey: true, cancelable: true, bubbles: true })
    act(() => { window.dispatchEvent(event) })
    expect(event.defaultPrevented).toBe(true)
    const receipt = screen.getByRole('complementary', { name: 'Receipt of your visit' })
    expect(receipt).toHaveTextContent('/home')
    expect(receipt).toHaveTextContent('SECRETS FOUND')
    // a cent a key: three presses before printing
    expect(receipt).toHaveTextContent('3 × KEY PRESS @ $0.01')
    expect(receipt).toHaveTextContent(/TOTAL\s*\$0\.03/)
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('print')
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
