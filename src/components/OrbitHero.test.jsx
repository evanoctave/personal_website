import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import OrbitHero from './OrbitHero'

describe('OrbitHero', () => {
  it('gives every template project a labeled detail-page link', () => {
    render(<MemoryRouter><OrbitHero /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Open Nebula Notes project' })).toHaveAttribute('href', '/projects/nebula-notes')
    expect(screen.getByRole('link', { name: 'Open Signal Garden project' })).toHaveAttribute('href', '/projects/signal-garden')
    expect(screen.getByRole('link', { name: 'Open Comet Care project' })).toHaveAttribute('href', '/projects/comet-care')
  })
})
