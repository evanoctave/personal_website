import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DiceTable from './DiceTable.jsx'

const FRIENDS = [
  { displayName: 'Anjelo Go', url: 'www.anjelogo.com' },
  { displayName: 'Evan Octave', url: 'www.evanoctave.dev' },
  { displayName: 'Third Friend', url: 'third.example' },
]

const fakeScene = { roll: vi.fn(), dispose: vi.fn(), resize: vi.fn() }
vi.mock('./scene.js', () => ({ createDiceScene: vi.fn(() => fakeScene) }))

describe('DiceTable', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => FRIENDS }))
    vi.stubGlobal('open', vi.fn(() => ({})))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('lists everyone but me, defaults to beating 7, and shows the odds', async () => {
    render(<DiceTable />)
    const select = await screen.findByRole('combobox', { name: "friend's site" })
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Anjelo Go', 'Third Friend'])
    expect(select).toHaveValue('www.anjelogo.com')
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent('7')
    expect(screen.getByText(/42%/)).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: /\b12\b/ }))
    expect(screen.getByText(/\b0%/)).toBeInTheDocument()
  })

  it('opens the picked site in a new tab when the total beats the number (flat dice)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // 6 + 6
    const user = userEvent.setup()
    render(<DiceTable />)
    await user.selectOptions(await screen.findByRole('combobox'), 'third.example')
    await user.click(screen.getByRole('button', { name: /\b11\b/ }))
    await user.click(document.querySelector('.dice-roll'))
    expect(await screen.findByText(/6 \+ 6 = 12/)).toBeInTheDocument()
    expect(window.open).toHaveBeenCalledWith('https://third.example', '_blank', 'noopener')
    expect(screen.getByRole('link', { name: /third\.example/ })).toHaveAttribute('href', 'https://third.example')
  })

  it('makes you roll again when the total is below, or ties, the number', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // 1 + 1
    const user = userEvent.setup()
    render(<DiceTable />)
    await screen.findByRole('combobox')
    await user.click(document.querySelector('.dice-roll'))
    expect(await screen.findByText(/1 \+ 1 = 2/)).toBeInTheDocument()
    expect(window.open).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /\b2\b/ }))
    await user.click(document.querySelector('.dice-roll'))
    expect(window.open).not.toHaveBeenCalled()
  })

  it('uses the 3D scene when WebGL is around, and tears it down on unmount', async () => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = () => ({})
    fakeScene.roll.mockResolvedValue([4, 5])
    try {
      const user = userEvent.setup()
      const { unmount } = render(<DiceTable />)
      await screen.findByRole('combobox')
      await vi.waitFor(() => expect(document.querySelector('.dice[data-mode="3d"]')).not.toBeNull())
      await user.click(screen.getByRole('button', { name: /\b8\b/ }))
      await user.click(document.querySelector('.dice-roll'))
      expect(await screen.findByText(/4 \+ 5 = 9/)).toBeInTheDocument()
      expect(fakeScene.roll).toHaveBeenCalledTimes(1)
      expect(window.open).toHaveBeenCalledWith('https://www.anjelogo.com', '_blank', 'noopener')
      unmount()
      expect(fakeScene.dispose).toHaveBeenCalled()
    } finally {
      HTMLCanvasElement.prototype.getContext = getContext
    }
  })
})
