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

  it('keeps mobile orbit links in their static list layout with reduced motion', () => {
    expect(css).toMatch(
      /@media \(max-width: 480px\) and \(prefers-reduced-motion: reduce\)[\s\S]*\.orbit-planet\s*\{\s*transform:\s*none/,
    )
  })

  it('removes hover motion when reduced motion is requested', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition:\s*none !important[\s\S]*\.button-link:hover[\s\S]*transform:\s*none/,
    )
  })
})
