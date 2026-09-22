import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectDetailPage from './ProjectDetailPage'
import NotFoundPage from './NotFoundPage'

const renderDetail = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </MemoryRouter>,
)

describe('ProjectDetailPage', () => {
  it('renders data-backed project fields and adjacent world navigation', () => {
    renderDetail('/projects/nebula-notes')
    expect(screen.getByRole('heading', { name: 'Nebula Notes' })).toBeInTheDocument()
    expect(screen.getByText('Product design + frontend')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next: Signal Garden' })).toHaveAttribute('href', '/projects/signal-garden')
  })

  it('renders not-found recovery for an unknown project slug', () => {
    renderDetail('/projects/not-a-world')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
  })

  it('does not render missing demo or source links', () => {
    renderDetail('/projects/nebula-notes')
    expect(screen.queryByRole('link', { name: 'Visit live site' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'View source code' })).not.toBeInTheDocument()
  })
})
