import { describe, expect, it } from 'vitest'
import {
  createSeedWorkbench,
  readWorkbench,
  WORKBENCH_STORAGE_KEY,
} from './workbench'

describe('workbench data contract', () => {
  it('seeds only featured projects as deterministic tiles', () => {
    expect(createSeedWorkbench()).toEqual([
      expect.objectContaining({ id: 'project-nebula-notes', type: 'project', projectSlug: 'nebula-notes' }),
      expect.objectContaining({ id: 'project-signal-garden', type: 'project', projectSlug: 'signal-garden' }),
    ])
  })

  it('rejects malformed and stale storage payloads', () => {
    const malformed = { getItem: () => '{"version": 1, "items": []}' }
    const stale = { getItem: () => '{"version": 2, "items": [{"id":"x"}]}' }

    expect(readWorkbench(malformed)).toEqual(createSeedWorkbench())
    expect(readWorkbench(stale)).toEqual(createSeedWorkbench())
  })

  it('accepts valid versioned storage payloads', () => {
    const items = [{ id: 'project-nebula-notes', type: 'project', x: 12, y: 4 }]
    const storage = { getItem: (key) => key === WORKBENCH_STORAGE_KEY
      ? JSON.stringify({ version: 1, items })
      : null }

    expect(readWorkbench(storage)).toEqual(items)
  })
})
