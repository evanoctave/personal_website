import { describe, expect, it } from 'vitest'
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectTags,
  projects,
} from './projects'

describe('project templates', () => {
  it('finds the flagship package tracker by its stable URL slug', () => {
    expect(getProjectBySlug('digital-package-tracker')).toMatchObject({
      title: 'Digital Package Tracker',
      slug: 'digital-package-tracker',
      role: 'Full-stack developer',
      stack: ['Node.js', 'Express', 'SQLite', 'PWA'],
    })
  })

  it('returns undefined for a missing project slug', () => {
    expect(getProjectBySlug('not-a-world')).toBeUndefined()
  })

  it('returns unique filter tags', () => {
    expect(getProjectTags()).toEqual(['All', 'AI', 'Backend', 'Data', 'Product', 'Web'])
  })

  it('wraps adjacent project navigation', () => {
    expect(getAdjacentProjects('digital-package-tracker')).toMatchObject({
      previous: { slug: 'ai-sentiment-analysis' },
      next: { slug: 'ai-sentiment-analysis' },
    })
  })

  it('gives every template project a unique slug', () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length)
  })
})
