import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

const FRIENDS = [
  { displayName: 'Anjelo Go', url: 'www.anjelogo.com' },
  { displayName: 'Evan Octave', url: 'www.evanoctave.dev' },
]

describe('site', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    // the footer webring fetches the shared friendsites list; keep tests off the network
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => FRIENDS }))
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('sends the bare domain to /home and keeps the old gate at /hello', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    cleanup()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-27T12:00:00'))
    renderAt('/hello')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('As of Sunday, September 27, 2026')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)
    expect(document.querySelector('a[href="/home"]')).toBeInTheDocument()
  })

  it('covers the construction page with the sticker printer, then gets out of the way', () => {
    vi.useFakeTimers()
    renderAt('/hello')
    const first = document.querySelector('.printer-screen').textContent
    act(() => { vi.advanceTimersByTime(4000) })
    expect(document.querySelector('.printer-screen').textContent).not.toBe(first)
    expect(document.querySelector('.construction-photo--wide img')).toHaveStyle({ opacity: 1 })
    act(() => { vi.advanceTimersByTime(4000) })
    expect(document.querySelector('.loader')).toHaveClass('is-leaving')
    act(() => { vi.advanceTimersByTime(800) })
    expect(document.querySelector('.loader')).not.toBeInTheDocument()
  })

  it('renders home with skip link, nav, and real photos', () => {
    renderAt('/home')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByLabelText(/sits down in front of the camera and waves/)).toHaveAttribute('src', '/clips/wave.mp4')
    expect(screen.queryByRole('img', { name: /Image placeholder/ })).not.toBeInTheDocument()
    expect(document.querySelector('.home-photos a[href="/life"]')).toBeInTheDocument()
    // the dice gate sits under Say hi
    expect(document.querySelector('.dice')).toBeInTheDocument()
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent('7')
  })

  it('links to the neighbouring friendsites in the footer', async () => {
    renderAt('/about')
    await screen.findByRole('navigation', { name: 'friendsites' })
    expect(screen.getByRole('link', { name: '← Anjelo Go' })).toHaveAttribute('href', 'https://www.anjelogo.com')
    expect(screen.getByRole('link', { name: 'Anjelo Go →' })).toHaveAttribute('href', 'https://www.anjelogo.com')
    expect(fetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/ilovetcp/friendsites/main/list.json')
  })

  it('shows the life page as a dated roll of photos and muted clips', async () => {
    const user = userEvent.setup()
    renderAt('/life')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '09 27 2026' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /mid-pitch on the mound/ })).toHaveAttribute('src', '/photos/pitch.jpg')
    expect(screen.getByRole('img', { name: /Dodger Stadium under the lights/ })).toHaveAttribute('src', '/photos/dodgers-night.jpg')
    expect(screen.queryByRole('img', { name: /Ghost cherry limeade/ })).not.toBeInTheDocument()
    const clip = document.querySelector('video[src="/clips/MOVI0002.mp4"]')
    expect(clip).toHaveAttribute('poster', '/clips/MOVI0002.jpg')
    expect(clip.muted).toBe(true)
    const sound = document.querySelector('.clip-sound')
    const label = sound.textContent
    await user.click(sound)
    expect(sound.textContent).not.toBe(label)
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

  it('turns [words](url) in project text into real links', () => {
    renderAt('/work/rumie')
    expect(screen.getByRole('link', { name: 'Anjelo Go' })).toHaveAttribute('href', 'https://github.com/anjelogo')
    expect(screen.queryByText(/\[Anjelo Go\]/)).not.toBeInTheDocument()
  })

  it('roasts anyone who tries /admin and records the egg', () => {
    renderAt('/admin')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(document.querySelector('main a[href="/home"]')).toBeInTheDocument()
    expect(document.title).toBe('Admin | Evan Octave')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('admin')
  })

  it('shows 404 page and records the lost easter egg', () => {
    renderAt('/drifted-away')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(document.title).toBe('Lost | Evan Octave')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('lost')
  })

  it('moves focus and updates the title after navigation', async () => {
    const user = userEvent.setup()
    renderAt('/home')
    const main = screen.getByRole('main')
    await user.click(document.querySelector('nav[aria-label="Primary"] a[href="/about"]'))
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
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
    expect(document.title).toBe('Life | Evan Octave')
    fireEvent.keyDown(window, { key: '5' })
    expect(document.title).toBe('Contact | Evan Octave')
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
    await user.type(input, 'sudo{Enter}')
    // sudo inverts the site and finds the egg
    expect(document.documentElement.dataset.fxInverted).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('sudo')
    await user.type(input, 'cd work{Enter}')
    expect(screen.queryByRole('dialog', { name: 'Terminal' })).not.toBeInTheDocument()
    expect(document.title).toBe('Work | Evan Octave')
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
    // a cent a key: three presses before printing
    expect(receipt).toHaveTextContent('$0.03')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('print')
  })

  it('pops the 67 clip when 7 follows 6 fast, and only then', () => {
    vi.useFakeTimers()
    renderAt('/home')
    fireEvent.keyDown(window, { key: '6' })
    act(() => { vi.advanceTimersByTime(1000) })
    fireEvent.keyDown(window, { key: '7' })
    // the player is always mounted (preloaded); aria-hidden says whether it's up
    expect(document.querySelector('.six7')).toHaveAttribute('aria-hidden', 'true')
    fireEvent.keyDown(window, { key: '6' })
    fireEvent.keyDown(window, { key: '7' })
    expect(document.querySelector('.six7')).toHaveAttribute('aria-hidden', 'false')
    expect(document.querySelector('.six7 video')).toHaveAttribute('src', '/clips/67.mp4')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('sixseven')
  })

  it('gives touch screens the site keyboard instead of the native one', () => {
    // pretend to be a phone: coarse pointer, everything else off
    vi.stubGlobal('matchMedia', (query) => ({ matches: query.includes('coarse'), addEventListener() {}, removeEventListener() {} }))
    window.sessionStorage.setItem('eo-printed', '1')
    renderAt('/home')
    fireEvent.keyDown(window, { key: '/' })
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('inputmode', 'none')
    fireEvent.focus(input)
    const press = (name) => fireEvent.pointerDown(screen.getByRole('button', { name }))
    ;['l', 's'].forEach(press)
    expect(input).toHaveValue('ls')
    press('Run')
    expect(screen.getByText(/home\/\s+work\//)).toBeInTheDocument()
    // keys still count as typing: a fast 6 then 7 pops the clip
    press('6')
    press('7')
    expect(document.querySelector('.six7')).toHaveAttribute('aria-hidden', 'false')
    // a blur (what every tap does on iPhone) must not close it; only ▾ or a tap elsewhere does
    fireEvent.blur(input)
    expect(screen.getByRole('group', { name: 'Keyboard' })).toBeInTheDocument()
    press('Hide keyboard')
    expect(screen.queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument()
  })

  it('triggers god mode with the konami code', () => {
    vi.useFakeTimers()
    renderAt('/home')
    ;['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      .forEach((key) => fireEvent.keyDown(window, { key }))
    act(() => { vi.advanceTimersByTime(10) })
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('konami')
  })

  it('hides the binary tree translator behind ls -a and cd', async () => {
    const user = userEvent.setup()
    renderAt('/home')
    fireEvent.keyDown(window, { key: '/' })
    const input = screen.getByRole('textbox')
    await user.type(input, 'ls{Enter}')
    expect(screen.getByText(/home\/\s+work\//)).not.toHaveTextContent('binarytree')
    await user.type(input, 'ls -a{Enter}')
    expect(screen.getByText(/\.binarytree\//)).toBeInTheDocument()
    await user.type(input, 'cd .binarytree{Enter}')
    expect(document.title).toBe('Binary Tree | Evan Octave')
    expect(JSON.parse(window.localStorage.getItem('eo-eggs'))).toContain('tree')
  })

  it('turns text into bits and back with a key from the url', async () => {
    const user = userEvent.setup()
    renderAt('/binarytree?key=abc12345')
    expect(screen.getByLabelText('key')).toHaveValue('abc12345')
    expect(document.querySelector('.bintree-figure svg')).toBeInTheDocument()
    await user.type(screen.getByLabelText('text'), 'Hi!')
    const bits = screen.getByLabelText('bits').value
    expect(bits).toMatch(/^[01]+$/)
    cleanup()
    renderAt('/binarytree?key=abc12345')
    await user.type(screen.getByLabelText('bits'), bits)
    expect(screen.getByLabelText('text')).toHaveValue('hi!')
    cleanup()
    renderAt('/binarytree?key=zzz12345')
    await user.type(screen.getByLabelText('bits'), bits)
    expect(screen.getByLabelText('text')).not.toHaveValue('hi!')
  })

  it('warps to the binary tree when "binarytree" is typed on home, without inverting on the way', () => {
    window.sessionStorage.setItem('eo-printed', '1')
    renderAt('/home')
    ;[...'binarytree'].forEach((key) => fireEvent.keyDown(window, { key }))
    expect(document.title).toBe('Binary Tree | Evan Octave')
    expect(document.documentElement.dataset.fxInverted).toBe('false')
  })
})
