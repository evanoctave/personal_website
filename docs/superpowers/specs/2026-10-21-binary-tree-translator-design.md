# Binary tree translator — design

## What

A hidden page at `/binarytree`. A random full binary tree whose leaves are the alphabet turns text into
a string of 0s and 1s (left = 0, right = 1, root to leaf) and back. Every tree comes from a short key,
so two people who share a key share the tree, and bits without the key are noise.

## Codec (`src/components/bintree/codec.js`, pure, tested)

- **Alphabet** (KNOB): `a–z`, `0–9`, space, `. , ! ? '` — 42 symbols. Text is lowercased; anything not
  in the alphabet is dropped.
- **Key**: 8 chars of base36. `randomKey()` makes one. `buildTree(key)` seeds a small PRNG (mulberry32
  over a string hash) and builds the tree: shuffle the leaves, then merge two random nodes until one
  root remains. Full binary tree, varied shape. Same key → same tree, forever, unless the alphabet
  changes (noted next to the KNOB).
- **Codes**: `codes(tree)` → `Map<symbol, bits>`. `encode(tree, text)` concatenates codes, no separators
  (prefix code, so decoding is unambiguous). `decode(tree, bits)` walks the tree; returns
  `{ text, tail }` where `tail` is any leftover bits that did not reach a leaf (shown on the page as
  "incomplete tail", never dropped silently). Characters other than 0/1 in the bits box are ignored,
  so spaces and newlines are fine.

## Page (`src/pages/BinaryTreeTranslator.jsx`, `.page` styling)

- Key row: key input, **new tree** (random key), **copy key**, **copy link**. `?key=xxxx` in the URL
  loads that tree; the URL is kept in sync (replaceState) when the key changes.
- Two textareas: **text** and **bits**. Typing in one rewrites the other live. **copy** under each.
  Leftover bits message under the bits box when `tail` is non-empty.
- **Tree figure** (`src/components/bintree/TreeFigure.jsx`): inline SVG with a viewBox, scales to width,
  horizontal scroll on phones. Leaves labelled with their symbol (space shown as `␣`). Edge labels 0/1
  on the first three levels only (deeper is too dense). Colors from `--fg`, `--muted`, `--line`, `--bg`
  so invert mode flips it. The last typed character's root-to-leaf path is highlighted. Hovering a leaf
  shows its code via `<title>`.
- One muted line: this is a toy, not encryption (36^8 keys).
- Visiting finds egg `tree` ("Found the tree"), so the count goes 10 → 11.

## Getting there (it is hidden)

- No nav link. Tab title "Binary Tree" (SiteShell). Warp label "binary tree / 01" (PageWarp).
- Terminal: `ls -a` lists `.binarytree/` next to the usual pages; `cd binarytree` / `cd .binarytree`
  goes there. `ls` and `help` do not mention it.
- Home typed word: `binarytree` pops "01" and navigates to `/binarytree` through the normal PageWarp.
  Buffer is 12 chars, word is 10. While the buffer tail (2+ letters) is a prefix of any secret word,
  single-key shortcuts (`i`, `t`, `g`, `x`, digits) are skipped so typing the word does not invert the
  site or toggle the trail; the letter still pops.

## Tests

- `codec.test.js`: same key → same codes; different keys → different codes; every code is a prefix of
  no other; encode/decode roundtrip; decode reports a tail; non-alphabet input dropped.
- `App.test.jsx`: `/binarytree` renders the heading and the SVG; `ls -a` shows `.binarytree/`; typing
  `binarytree` on `/home` lands on the page without inverting.

## Not doing

Real encryption, a server, saving trees, custom alphabets per tree, sharing bits inside the URL.
