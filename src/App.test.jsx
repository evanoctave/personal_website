import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>,
)

describe('application routes', () => {
  it('renders main navigation and skip link', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('renders about template route', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'About this orbit' })).toBeInTheDocument()
  })

  it('renders original recovery page for unknown routes', () => {
    renderAt('/drifted-away')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
  })
})
