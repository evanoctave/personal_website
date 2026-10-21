// Binary tree translator (/binarytree): a hidden page. a random tree of the alphabet turns text into bits
// (left = 0, right = 1) and bits back into text; the tree comes from an 8-char key, so whoever has the
// key can read the bits. codec in components/bintree/codec.js, drawing in components/bintree/TreeFigure.jsx.
// reached by typing "binarytree" on /home, or `ls -a` + `cd binarytree` in the terminal. no nav link.
// visiting finds the 'tree' egg (src/fx/FxProvider.jsx). styles: .bintree in site.css
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { buildTree, codes, decode, encode, isKey, randomKey } from '../components/bintree/codec.js'
import TreeFigure from '../components/bintree/TreeFigure.jsx'
import { useFx } from '../fx/FxProvider.jsx'

export default function BinaryTreeTranslator() {
  const { findEgg, toast } = useFx()
  const [params, setParams] = useSearchParams()
  // ?key=xxxxxxxx picks the tree; anything else gets a fresh one
  const [key, setKey] = useState(() => (isKey(params.get('key')) ? params.get('key') : randomKey()))
  const [draft, setDraft] = useState(key)
  const [text, setText] = useState('')
  const [bits, setBits] = useState('')
  const [tail, setTail] = useState('')

  const tree = useMemo(() => buildTree(key), [key])
  const table = useMemo(() => codes(tree), [tree])

  useEffect(() => { findEgg('tree') }, [findEgg])

  // the url always carries the current key, so the address bar is the share link
  useEffect(() => {
    if (params.get('key') !== key) setParams({ key }, { replace: true })
  }, [key, params, setParams])

  // a new tree re-spells whatever text is in the box
  const applyKey = (next) => {
    setKey(next)
    setDraft(next)
    setBits(encode(buildTree(next), text))
    setTail('')
  }
  const onKeyInput = (value) => {
    const clean = value.toLowerCase().replace(/[^0-9a-z]/g, '').slice(0, 8)
    setDraft(clean)
    if (isKey(clean) && clean !== key) applyKey(clean)
  }
  const onText = (value) => {
    setText(value)
    setBits(encode(tree, value))
    setTail('')
  }
  const onBits = (value) => {
    setBits(value)
    const out = decode(tree, value)
    setText(out.text)
    setTail(out.tail)
  }

  // KNOB: toasts after copying (the fallback shows when the clipboard is blocked)
  const copy = async (what, label) => {
    try {
      await navigator.clipboard.writeText(what)
      toast(`${label} copied`)
    } catch {
      toast('clipboard blocked. select it and copy the old way.')
    }
  }
  const link = () => `${window.location.origin}/binarytree?key=${key}`

  // the last typed symbol lights its path in the figure
  const last = text.toLowerCase().at(-1)
  const path = (last && table.get(last)) || ''

  return (
    <section className="page bintree">
      {/* KNOB: page title + blurb. App.test.jsx expects the heading */}
      <h1>Binary tree</h1>
      <p className="lede">
        Every tree below spells the alphabet differently. Left is 0, right is 1, a root-to-leaf sequence completes as a letter.
        Send someone the key and a pile of bits and they get your message back. don't get the key wrong or it'll look like scrambled eggs....scramble....something I wish Matthew Stafford knew how to do....
      </p>

      <div className="bintree-key">
        <label htmlFor="bintree-key">key</label>
        <input
          autoCapitalize="off"
          autoComplete="off"
          id="bintree-key"
          maxLength={8}
          onChange={(event) => onKeyInput(event.target.value)}
          spellCheck="false"
          value={draft}
        />
        <button className="copy" onClick={() => applyKey(randomKey())} type="button">new tree</button>
        <button className="copy" onClick={() => copy(key, 'key')} type="button">copy key</button>
        <button className="copy" onClick={() => copy(link(), 'link')} type="button">copy link</button>
      </div>

      <div className="bintree-boxes">
        <div className="bintree-box">
          <label htmlFor="bintree-text">text</label>
          <textarea
            id="bintree-text"
            onChange={(event) => onText(event.target.value)}
            placeholder="type here…"
            rows={6}
            spellCheck="false"
            value={text}
          />
          <div className="bintree-foot">
            <span>{text.length} chars</span>
            <button className="copy" onClick={() => copy(text, 'text')} type="button">copy</button>
          </div>
        </div>
        <div className="bintree-box">
          <label htmlFor="bintree-bits">bits</label>
          <textarea
            id="bintree-bits"
            onChange={(event) => onBits(event.target.value)}
            placeholder="…or paste bits here"
            rows={6}
            spellCheck="false"
            value={bits}
          />
          <div className="bintree-foot">
            <span>{bits.replace(/[^01]/g, '').length} bits{tail && ` · ${tail.length} left over: ${tail}`}</span>
            <button className="copy" onClick={() => copy(bits, 'bits')} type="button">copy</button>
          </div>
        </div>
      </div>

      <TreeFigure codes={table} path={path} tree={tree} />

      {/* KNOB: the small print */}
      <p className="muted bintree-note">
        36<sup>8</sup> possible trees, pretty cool.
        Please do not use this as a means of encryption in any way, shape, or form. I can decode your keys and steal your data. Don't try it.
        <Link to="/home">back home</Link>.
      </p>
    </section>
  )
}
