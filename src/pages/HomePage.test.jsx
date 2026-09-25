import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage.jsx'

describe('HomePage', () => {
  it('keeps a direct project archive link after the spatial workbench', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Browse all projects' })).toHaveAttribute('href', '/projects')
  })
})
