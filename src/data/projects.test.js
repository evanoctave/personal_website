import { describe, expect, it } from 'vitest'
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectTags,
  projects,
} from './projects'

describe('project templates', () => {
  it('finds a project by its stable URL slug', () => {
    expect(getProjectBySlug('nebula-notes')).toMatchObject({
      title: 'Nebula Notes',
      slug: 'nebula-notes',
    })
  })

  it('returns undefined for a missing project slug', () => {
    expect(getProjectBySlug('not-a-world')).toBeUndefined()
  })

  it('returns unique filter tags', () => {
    expect(getProjectTags()).toEqual(['All', 'Brand', 'Product', 'Web'])
  })

  it('wraps adjacent project navigation', () => {
    expect(getAdjacentProjects('nebula-notes')).toMatchObject({
      previous: { slug: 'comet-care' },
      next: { slug: 'signal-garden' },
    })
  })

  it('gives every template project a unique slug', () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length)
  })
})
