import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import ProjectDetail from '../components/ProjectDetail'
import { projects } from '../data/projects'
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

afterEach(cleanup)

describe('ProjectDetailPage', () => {
  it('renders package tracker case study without template copy', () => {
    renderDetail('/projects/digital-package-tracker')
    expect(screen.getByRole('heading', { name: 'Digital Package Tracker' })).toBeInTheDocument()
    expect(screen.getByText('Full-stack developer')).toBeInTheDocument()
    expect(screen.getByText(/CSUF IT and Building Engineering/)).toBeInTheDocument()
    expect(screen.queryByText(/Template content/)).not.toBeInTheDocument()
  })

  it('shows one next-case link when only two case studies exist', () => {
    renderDetail('/projects/digital-package-tracker')
    expect(screen.getByRole('link', { name: 'Next: AI Sentiment Analysis System' })).toHaveAttribute('href', '/projects/ai-sentiment-analysis')
    expect(screen.queryByRole('link', { name: 'Previous: AI Sentiment Analysis System' })).not.toBeInTheDocument()
  })

  it('links the AI case study to its public GitHub repository', () => {
    renderDetail('/projects/ai-sentiment-analysis')
    expect(screen.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('href', 'https://github.com/evanoctave/AI-project')
  })

  it('renders not-found recovery for an unknown project slug', () => {
    renderDetail('/projects/not-a-world')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/')
  })

  it('does not render missing demo or source links', () => {
    renderDetail('/projects/digital-package-tracker')
    expect(screen.queryByRole('link', { name: 'Visit live site' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'View source code' })).not.toBeInTheDocument()
  })

  it('renders optional GitHub links only when supplied', () => {
    const previous = projects[2]
    const next = projects[1]
    render(<MemoryRouter><ProjectDetail project={{ ...projects[0], githubUrl: 'https://github.com/evan/studio' }} next={next} previous={previous} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('rel', 'noreferrer')
  })

  it('hides absent galleries and renders supplied gallery images', () => {
    const projectWithoutGallery = { ...projects[0] }
    delete projectWithoutGallery.gallery
    const previous = projects[2]
    const next = projects[1]
    const renderProject = (project) => (
      <MemoryRouter><ProjectDetail next={next} previous={previous} project={project} /></MemoryRouter>
    )
    const { rerender } = render(renderProject(projectWithoutGallery))

    expect(screen.queryByRole('heading', { name: 'Gallery' })).not.toBeInTheDocument()

    rerender(renderProject({ ...projects[0], gallery: null }))
    expect(screen.queryByRole('heading', { name: 'Gallery' })).not.toBeInTheDocument()

    rerender(renderProject({ ...projects[0], gallery: [] }))
    expect(screen.queryByRole('heading', { name: 'Gallery' })).not.toBeInTheDocument()

    rerender(renderProject({
      ...projects[0],
      gallery: [{ alt: 'Nebula Notes interface', src: '/nebula-notes.png' }],
    }))
    expect(screen.getByRole('img', { name: 'Nebula Notes interface' })).toHaveAttribute('src', '/nebula-notes.png')
  })
})
