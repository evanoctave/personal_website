import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/styles/cosmic.css'), 'utf8')

describe('motion safeguards', () => {
  it('stops decorative orbit animation when reduced motion is requested', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.orbit-planet[\s\S]*animation:\s*none/,
    )
  })
})
