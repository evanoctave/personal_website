import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectGrid from './ProjectGrid'

describe('ProjectGrid', () => {
  it('filters cards by selected tag and restores all cards', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProjectGrid /></MemoryRouter>)

    expect(screen.getAllByRole('article')).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Brand' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Comet Care' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
})
