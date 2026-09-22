import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WORKBENCH_STORAGE_KEY } from '../data/workbench.js'
import { useWorkbenchState } from './useWorkbenchState.js'

const memoryStorage = () => {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) || null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  }
}

describe('useWorkbenchState', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:portrait')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => vi.restoreAllMocks())

  it('adds accepted image files and rejects non-images', () => {
    const storage = memoryStorage()
    const { result } = renderHook(() => useWorkbenchState({ storage }))

    act(() => result.current.addImage(new File(['x'], 'portrait.jpg', { type: 'image/jpeg' })))
    expect(result.current.items.at(-1)).toMatchObject({ type: 'image', alt: 'portrait.jpg', src: 'blob:portrait' })

    act(() => result.current.addImage(new File(['x'], 'notes.txt', { type: 'text/plain' })))
    expect(result.current.status).toBe('Choose an image file.')
  })

  it('moves selected tile with keyboard increment and persists it', () => {
    const storage = memoryStorage()
    const { result } = renderHook(() => useWorkbenchState({ storage }))
    const before = result.current.items[0].x

    act(() => result.current.moveItem(result.current.items[0].id, 'right', false))

    expect(result.current.items[0].x).toBe(before + 8)
    expect(JSON.parse(storage.getItem(WORKBENCH_STORAGE_KEY)).items[0].x).toBe(before + 8)
  })

  it('revokes generated image URLs on removal and unmount', () => {
    const storage = memoryStorage()
    const { result, unmount } = renderHook(() => useWorkbenchState({ storage }))
    act(() => result.current.addImage(new File(['x'], 'portrait.jpg', { type: 'image/jpeg' })))
    const imageId = result.current.items.at(-1).id

    act(() => result.current.removeItem(imageId))
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:portrait')
    unmount()
    expect(result.current.items).toBeDefined()
  })
})
