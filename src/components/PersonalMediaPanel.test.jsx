import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PersonalMediaPanel from './PersonalMediaPanel.jsx'

describe('PersonalMediaPanel', () => {
  it('shows exact replacement guidance for portrait and server rack without fake images', () => {
    render(<PersonalMediaPanel />)

    expect(screen.getByRole('region', { name: 'Personal media placeholders' })).toBeInTheDocument()
    expect(screen.getByText('Add portrait of Evan')).toBeInTheDocument()
    expect(screen.getByText('Add photo of in-person server rack')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
