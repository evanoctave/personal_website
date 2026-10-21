import { describe, expect, it } from 'vitest'
import { ALPHABET, buildTree, codes, decode, encode, isKey, randomKey } from './codec.js'

describe('bintree codec', () => {
  it('makes 8-char base36 keys', () => {
    const key = randomKey()
    expect(key).toMatch(/^[0-9a-z]{8}$/)
    expect(isKey(key)).toBe(true)
    expect(isKey('short')).toBe(false)
    expect(isKey('UPPERCASE')).toBe(false)
  })

  it('builds the same tree for the same key and a different one for another', () => {
    const a = codes(buildTree('abc12345'))
    const b = codes(buildTree('abc12345'))
    const c = codes(buildTree('zzz12345'))
    expect([...a]).toEqual([...b])
    expect([...a]).not.toEqual([...c])
  })

  it('gives every symbol a code and no code is a prefix of another', () => {
    const map = codes(buildTree('prefixes'))
    expect(map.size).toBe(ALPHABET.length)
    const all = [...map.values()]
    for (const x of all) {
      expect(x).toMatch(/^[01]+$/)
      for (const y of all) if (x !== y) expect(y.startsWith(x)).toBe(false)
    }
  })

  it('round-trips text, lowercasing and dropping what the alphabet lacks', () => {
    const tree = buildTree('roundtrp')
    const bits = encode(tree, "Hello, World! 67 ~ it's #fine")
    expect(bits).toMatch(/^[01]+$/)
    expect(decode(tree, bits)).toEqual({ text: "hello, world! 67  it's fine", tail: '' })
  })

  it('ignores non-bit characters when decoding and reports an incomplete tail', () => {
    const tree = buildTree('tailtest')
    const bits = encode(tree, 'hi')
    const spaced = bits.split('').join(' ') + '\n'
    expect(decode(tree, spaced).text).toBe('hi')
    const [, aCode] = [...codes(tree)].find(([symbol]) => symbol === 'a')
    const cut = aCode.slice(0, -1)
    expect(decode(tree, encode(tree, 'b') + cut)).toEqual({ text: 'b', tail: cut })
  })

  it('encodes nothing to nothing and decodes nothing to nothing', () => {
    const tree = buildTree('emptyemp')
    expect(encode(tree, '')).toBe('')
    expect(decode(tree, '')).toEqual({ text: '', tail: '' })
  })
})
