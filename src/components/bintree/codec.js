// The binary tree translator's brain (pure, no React). Used by pages/BinaryTreeTranslator.jsx and
// drawn by ./TreeFigure.jsx. Tests: ./codec.test.js
//
// Same idea as the C++ BinaryDecoderTree (the DANCE one: d=00 a=01 n=10 c=110 e=111): a binary tree
// whose leaves are letters, 0 = go left, 1 = go right, hit a leaf = that's the letter, back to the root.
// Two things are different here:
//   1. the tree isn't hand-built with insertPath(). it's generated, and it covers 42 symbols, not 5.
//   2. the tree comes from a KEY. that's the whole trick, and it works like this:
//
//   key ("k7x2p0qa")  --hash-->  one 32-bit number  --seeds-->  a PRNG (a fake dice roller that always
//   rolls the same sequence for the same seed)  --drives-->  the shuffle + merge below  ==>  the tree
//
//   every step is deterministic: no Math.random anywhere past randomKey(). so the same key always
//   produces the exact same tree, on anyone's computer, forever. that's why you can send someone just
//   8 characters instead of the tree itself: they rebuild it from the key and decode your bits.
//   a different key gives a different hash, a different dice sequence, a different tree, and your
//   bits decode into garbage. (garbage, not an error: every tree is "full", so every bit string walks
//   somewhere. see buildTree.)

// KNOB: the symbols a tree can spell. text outside this set is dropped when encoding. changing this
// changes every tree, so old keys stop matching old messages
export const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz0123456789 .,!?\'']

// KNOB: key length (base36 chars: 0-9 a-z). 8 chars = 36^8 ≈ 2.8 trillion keys. that's plenty of trees
// to make guessing boring, but it is NOT encryption: a computer can try them all in minutes
export const KEY_LENGTH = 8
const KEY_RE = new RegExp(`^[0-9a-z]{${KEY_LENGTH}}$`)

export const isKey = (key) => typeof key === 'string' && KEY_RE.test(key)

export const randomKey = () => {
  let key = ''
  while (key.length < KEY_LENGTH) key += Math.floor(Math.random() * 36).toString(36)
  return key
}

// step 1: key → seed. FNV-1a: start from a magic number, then for each character xor it in and multiply
// by a prime. the result is a 32-bit integer that scatters nicely (keys one character apart give totally
// different numbers). it's a hash, not random: hash('abc12345') is the same every time
const hash = (text) => {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
// step 2: seed → random-looking numbers. mulberry32: tiny PRNG, state is one 32-bit int. call next()
// and you get a number in [0, 1) that looks random, but the sequence is entirely decided by the seed.
// think of it as a deck of cards pre-shuffled by the key: everyone with the key draws the same cards
// in the same order. Math.random would break the sharing, so it's never used here
const prng = (seed) => {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// step 3: numbers → tree. a tree node is { symbol } (leaf, like Node(char) in the C++) or { left, right }
// (branch, like Node()). instead of insertPath("110", 'c') we:
//   a. make one leaf per symbol and shuffle them (Fisher-Yates, driven by the PRNG)
//   b. pick two random nodes from the pile, glue them under a new branch, put the branch back in the pile
//   c. repeat until one node is left. that's the root
// every branch gets exactly two children, so the tree is "full": no dead ends, every bit path leads
// somewhere (the C++ "dont even map to anything" case can't happen). which symbols end up deep or
// shallow is pure luck of the key, so codes range from ~3 to ~15 bits
export function buildTree(key) {
  const next = prng(hash(key))
  const nodes = ALPHABET.map((symbol) => ({ symbol }))
  for (let i = nodes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1))
    ;[nodes[i], nodes[j]] = [nodes[j], nodes[i]]
  }
  while (nodes.length > 1) {
    const [left] = nodes.splice(Math.floor(next() * nodes.length), 1)
    const [right] = nodes.splice(Math.floor(next() * nodes.length), 1)
    nodes.push({ left, right })
  }
  return nodes[0]
}

export const isLeaf = (node) => node.symbol !== undefined

// symbol → bits, walking the whole tree once (the "Letter Map" the C++ prints, but computed). because
// symbols only live on leaves, no code is the start of another code, which is what makes decoding
// unambiguous with no separators between letters (a prefix code, same property as Huffman codes)
export function codes(tree) {
  const map = new Map()
  const walk = (node, path) => {
    if (isLeaf(node)) map.set(node.symbol, path || '0')
    else {
      walk(node.left, `${path}0`)
      walk(node.right, `${path}1`)
    }
  }
  walk(tree, '')
  return map
}

// text → bits: look each symbol up in the map and glue the codes together. lowercased; symbols the
// alphabet lacks vanish (the receiver still gets the rest)
export function encode(tree, text) {
  const map = codes(tree)
  let bits = ''
  for (const ch of text.toLowerCase()) bits += map.get(ch) ?? ''
  return bits
}

// bits → { text, tail }. the C++ decode loop exactly: 0 left, 1 right, leaf = emit + back to root.
// differences: anything but 0/1 is skipped instead of failing (so pasted bits can have spaces and
// newlines), and instead of appending "(Warning: incomplete sequence)" the leftover bits that never
// reached a leaf come back as `tail` so the page can show them
export function decode(tree, bits) {
  let text = ''
  let node = tree
  let tail = ''
  for (const ch of bits) {
    if (ch !== '0' && ch !== '1') continue
    tail += ch
    node = ch === '0' ? node.left : node.right
    if (isLeaf(node)) {
      text += node.symbol
      node = tree
      tail = ''
    }
  }
  return { text, tail }
}
