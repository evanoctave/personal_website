import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = [
  'src/styles/base.css',
  'src/styles/studio.css',
  'src/styles/workbench.css',
].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8')).join('\n')

describe('tactile visual contracts', () => {
  it('uses monochrome design tokens without legacy accent token declarations', () => {
    expect(styles).toMatch(/--void:\s*#101010/)
    expect(styles).toMatch(/--hard-white:\s*#f7f7f4/)
    expect(styles).not.toMatch(/--lime:|--cobalt:|--orange:/)
  })

  it('keeps workbench tiles in normal flow on compact screens', () => {
    expect(styles).toMatch(/@media \(max-width: 480px\)[\s\S]*\.workbench-tile\s*\{[\s\S]*position:\s*relative/)
  })

  it('removes object motion when reduced motion is requested', () => {
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hero-art img[\s\S]*animation:\s*none/)
  })
})
