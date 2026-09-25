import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutPage from './AboutPage.jsx'

describe('AboutPage', () => {
  it('makes profile and education visible on the about route', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { name: 'Built in public, kept personal.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
  })
})
