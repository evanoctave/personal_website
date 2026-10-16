import { afterEach, describe, expect, it, vi } from 'vitest'
import { href, loadRing, neighbors, others, RING_URL } from './friendsites'

const list = [
  { displayName: 'Anjelo Go', url: 'www.anjelogo.com' },
  { displayName: 'Evan Octave', url: 'www.evanoctave.dev' },
  { displayName: 'Third Friend', url: 'https://third.example/' },
]

describe('href', () => {
  it('adds https to bare hosts and leaves full urls alone', () => {
    expect(href('www.anjelogo.com')).toBe('https://www.anjelogo.com')
    expect(href('http://old.example')).toBe('http://old.example')
    expect(href('HTTPS://caps.example')).toBe('HTTPS://caps.example')
  })
})

describe('neighbors', () => {
  it('wraps around at both ends', () => {
    const first = neighbors(list, 'www.anjelogo.com')
    expect(first?.prev.displayName).toBe('Third Friend')
    expect(first?.next.displayName).toBe('Evan Octave')
    const last = neighbors(list, 'third.example')
    expect(last?.prev.displayName).toBe('Evan Octave')
    expect(last?.next.displayName).toBe('Anjelo Go')
  })

  it('finds this site by host, ignoring scheme, www, path, and case', () => {
    for (const self of ['evanoctave.dev', 'https://www.evanoctave.dev/', 'WWW.EVANOCTAVE.DEV/home']) {
      const ring = neighbors(list, self)
      expect(ring?.prev.displayName).toBe('Anjelo Go')
      expect(ring?.next.displayName).toBe('Third Friend')
    }
  })

  it('random never picks this site', () => {
    const ring = neighbors(list, 'evanoctave.dev')
    for (let i = 0; i < 50; i += 1) expect(ring?.random().url).not.toBe('www.evanoctave.dev')
  })

  it('is null when this site is missing or alone', () => {
    expect(neighbors(list, 'nobody.example')).toBeNull()
    expect(neighbors([list[1]], 'evanoctave.dev')).toBeNull()
    expect(neighbors([], 'evanoctave.dev')).toBeNull()
  })
})

describe('others', () => {
  it('drops this site and keeps the order', () => {
    expect(others(list, 'https://www.evanoctave.dev').map((f) => f.displayName)).toEqual(['Anjelo Go', 'Third Friend'])
    expect(others(list, 'nobody.example')).toHaveLength(3)
  })
})

describe('loadRing', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('fetches the shared list and drops malformed entries', async () => {
    const json = vi.fn().mockResolvedValue([...list, { displayName: 'no url' }, 'junk', { url: 'x', displayName: 7 }])
    const fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json })
    vi.stubGlobal('fetch', fetch)
    await expect(loadRing()).resolves.toEqual(list)
    expect(fetch).toHaveBeenCalledWith(RING_URL)
  })

  it('rejects on http errors and non-array bodies', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => [] }))
    await expect(loadRing('https://x.example/list.json')).rejects.toThrow(/404/)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) }))
    await expect(loadRing()).rejects.toThrow(/array/)
  })
})
