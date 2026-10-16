import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FriendRing from './FriendRing'

const list = [
  { displayName: 'Anjelo Go', url: 'www.anjelogo.com' },
  { displayName: 'Evan Octave', url: 'www.evanoctave.dev' },
]

describe('FriendRing', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('links the neighbours once the list loads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => list }))
    render(<FriendRing />)
    expect(screen.queryByRole('navigation', { name: 'friendsites' })).not.toBeInTheDocument()
    expect(await screen.findByRole('link', { name: '← Anjelo Go' })).toHaveAttribute('href', 'https://www.anjelogo.com')
    expect(screen.getByRole('link', { name: 'Anjelo Go →' })).toHaveAttribute('href', 'https://www.anjelogo.com')
    expect(screen.getByRole('button', { name: 'random' })).toBeInTheDocument()
  })

  it('renders nothing when the list is unreachable', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    render(<FriendRing />)
    await vi.waitFor(() => expect(warn).toHaveBeenCalled())
    expect(screen.queryByRole('navigation', { name: 'friendsites' })).not.toBeInTheDocument()
  })

  it('renders nothing when this site is not in the list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [list[0]] }))
    render(<FriendRing />)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    await new Promise((r) => setTimeout(r, 0))
    expect(screen.queryByRole('navigation', { name: 'friendsites' })).not.toBeInTheDocument()
  })
})
