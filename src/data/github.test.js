import { describe, expect, it } from 'vitest'
import { normalizeGithubRepo } from './github.js'

describe('github adapter', () => {
  it('normalizes missing GitHub metadata to null instead of throwing', () => {
    expect(normalizeGithubRepo({ name: 'untitled' })).toBeNull()
  })

  it('keeps only safe public repository fields', () => {
    expect(normalizeGithubRepo({ name: 'studio', html_url: 'https://github.com/evan/studio', description: null })).toEqual({
      name: 'studio', htmlUrl: 'https://github.com/evan/studio', description: '',
    })
  })
})
