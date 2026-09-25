import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProjectWorkbench from './ProjectWorkbench'

describe('ProjectWorkbench', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:portrait')
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders featured project tiles with accessible names', () => {
    const { container } = render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)

    expect(screen.getByRole('region', { name: 'Project workbench' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Digital Package Tracker tile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select AI Sentiment Analysis System tile' })).toBeInTheDocument()
    expect(container.querySelector('.workbench-backdrop img')).toHaveAttribute('src', '/assets/server-room-terrarium-v1.png')
  })

  it('selects a tile and exposes keyboard movement controls', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Select Digital Package Tracker tile' }))

    expect(screen.getByRole('group', { name: 'Digital Package Tracker tile controls' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move Digital Package Tracker left' })).toBeInTheDocument()
  })

  it('adds dropped images and exposes editable fallback content', () => {
    render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)
    const file = new File(['x'], 'portrait.jpg', { type: 'image/jpeg' })

    fireEvent.drop(screen.getByRole('button', { name: /Drop photo/ }), {
      dataTransfer: { files: [file] },
    })

    expect(screen.getByRole('img', { name: 'portrait.jpg' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove image' })).toBeInTheDocument()
  })

  it('moves focused tile with arrow keys', () => {
    render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)
    const tile = screen.getByRole('article', { name: 'Digital Package Tracker workbench tile' })

    tile.focus()
    fireEvent.keyDown(tile, { key: 'ArrowRight' })

    expect(tile).toHaveStyle({ left: '32px' })
  })
})
