import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import OrbitHero from './OrbitHero'

describe('OrbitHero', () => {
  it('gives every published case study a labeled detail-page link', () => {
    render(<MemoryRouter><OrbitHero /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Open Digital Package Tracker project' })).toHaveAttribute('href', '/projects/digital-package-tracker')
    expect(screen.getByRole('link', { name: 'Open AI Sentiment Analysis System project' })).toHaveAttribute('href', '/projects/ai-sentiment-analysis')
  })
})
