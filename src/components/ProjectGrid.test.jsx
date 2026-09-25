import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectGrid from './ProjectGrid'
import '../styles/base.css'
import '../styles/cosmic.css'
import '../styles/studio.css'

describe('ProjectGrid', () => {
  it('filters cards by selected tag and restores all cards', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProjectGrid /></MemoryRouter>)

    expect(screen.getAllByRole('article')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'AI' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'AI Sentiment Analysis System' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('gives each case-study link a 44px touch target', () => {
    render(<MemoryRouter><ProjectGrid /></MemoryRouter>)

    for (const link of screen.getAllByRole('link', { name: /Open case study/ })) {
      expect(getComputedStyle(link).display).toBe('inline-flex')
      expect(getComputedStyle(link).minHeight).toBe('44px')
    }
  })
})
