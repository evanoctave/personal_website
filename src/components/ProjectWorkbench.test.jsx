import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import ProjectWorkbench from './ProjectWorkbench'

describe('ProjectWorkbench', () => {
  afterEach(cleanup)

  it('renders featured project tiles with accessible names', () => {
    render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)

    expect(screen.getByRole('region', { name: 'Project workbench' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Nebula Notes tile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Signal Garden tile' })).toBeInTheDocument()
  })

  it('selects a tile and exposes keyboard movement controls', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Select Nebula Notes tile' }))

    expect(screen.getByRole('group', { name: 'Nebula Notes tile controls' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move Nebula Notes left' })).toBeInTheDocument()
  })
})
