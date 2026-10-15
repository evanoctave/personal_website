import { describe, expect, it } from 'vitest'
import { FACES, judge, upFace, winChance } from './odds.js'

describe('judge', () => {
  it('wins only when the total is strictly above the target', () => {
    expect(judge(8, 7)).toBe('win')
    expect(judge(7, 7)).toBe('lose')
    expect(judge(6, 7)).toBe('lose')
    expect(judge(2, 1)).toBe('win')
    expect(judge(12, 12)).toBe('lose')
  })
})

describe('winChance', () => {
  it('matches the two-dice distribution', () => {
    expect(winChance(1)).toBe(1)
    expect(winChance(12)).toBe(0)
    expect(winChance(7)).toBeCloseTo(15 / 36)
    expect(winChance(2)).toBeCloseTo(35 / 36)
  })
})

describe('upFace', () => {
  it('reads the face whose normal points most upward', () => {
    expect(FACES).toEqual([2, 5, 1, 6, 3, 4])
    expect(upFace([0, 0, 1, -1, 0, 0])).toEqual({ value: 1, flat: true })
    expect(upFace([-0.1, 0.1, 0, 0, -0.99, 0.99])).toEqual({ value: 4, flat: true })
  })

  it('flags a cocked die', () => {
    expect(upFace([0.7, -0.7, 0.71, -0.71, 0, 0]).flat).toBe(false)
  })
})
