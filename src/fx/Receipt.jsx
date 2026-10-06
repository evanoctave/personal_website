// Mounted by SiteShell.jsx; styles in site.css under /* receipt easter egg */.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { EGGS, prefersReducedMotion, useFx } from './FxProvider.jsx'

// Easter egg: ⌘P / Ctrl+P (or `print` in the terminal) doesn't open the print
// dialog. The site's printer spits out a thermal receipt of your visit instead.
// Click it or press Esc to tear it off.
export const printReceipt = () => window.dispatchEvent(new CustomEvent('fx:receipt'))

const pad = (n) => String(n).padStart(2, '0')
const clock = (ms) => `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`
const stamp = (d) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`

// one receipt line: label on the left, value on the right, dotted leader between
function Row({ label, value }) {
  return <p className="rc-row"><span>{label}</span><span className="rc-dots" /><span>{value}</span></p>
}

export default function Receipt() {
  const { pathname } = useLocation()
  const { eggs, findEgg } = useFx()
  // KNOB: receipt number is a random 4-digit 1000–9999
  const visit = useRef({ start: Date.now(), pages: [], keys: 0, number: Math.floor(1000 + Math.random() * 9000) })
  const [receipt, setReceipt] = useState(null)
  const [tearing, setTearing] = useState(false)

  useEffect(() => {
    const { pages } = visit.current
    if (pages.at(-1) !== pathname) pages.push(pathname)
  }, [pathname])

  const print = useCallback(() => {
    const { start, pages, keys, number } = visit.current
    findEgg('print')
    setTearing(false)
    // snapshot now so the receipt doesn't change while it's on screen
    setReceipt({ id: Date.now(), at: new Date(), pages: [...new Set(pages)], hops: pages.length, keys, time: Date.now() - start, number })
  }, [findEgg])

  // no animation to wait for under reduced motion, so just take it away
  const tear = useCallback(() => (prefersReducedMotion() ? setReceipt(null) : setTearing(true)), [])

  useEffect(() => {
    const onKey = (event) => {
      // KNOB: the shortcut — ⌘P / Ctrl+P (swap 'p' for another key)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        print()
        return
      }
      if (event.key === 'Escape' && receipt) {
        tear()
        return
      }
      if (!event.repeat) visit.current.keys += 1
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('fx:receipt', print)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('fx:receipt', print)
    }
  }, [print, receipt, tear])

  if (!receipt) return null

  // eggs from the closure can lag one render behind findEgg('print'); count it either way
  const found = new Set([...eggs, 'print']).size

  return (
    <aside aria-label="Receipt of your visit" className={`rc${tearing ? ' rc--tear' : ''}`} key={receipt.id}>
      <span aria-hidden="true" className="rc-slot" />
      <div className="rc-feed">
        {/* KNOB: 'rc-tear' must match the @keyframes name in site.css; its .55s there is how long tearing takes */}
        <button
          className="rc-paper"
          onAnimationEnd={(event) => { if (event.animationName === 'rc-tear') setReceipt(null) }}
          onClick={tear}
          type="button"
        >
          <span className="sr-only">Tear off the receipt</span>
          <span aria-hidden="true" className="rc-body">
            {/* KNOB: every receipt line below is plain text — header, stat rows, joke prices, footer */}
            <p className="rc-title">EVAN OCTAVE</p>
            <p className="rc-center">EO-1 RECEIPT PRINTER</p>
            <p className="rc-center">{stamp(receipt.at)} · #{receipt.number}</p>
            <hr />
            <p className="rc-head">PAGES VISITED</p>
            {receipt.pages.map((page) => <p className="rc-page" key={page}>{page}</p>)}
            <hr />
            <Row label="PAGE HOPS" value={receipt.hops} />
            <Row label="TIME ON SITE" value={clock(receipt.time)} />
            <Row label="KEYS PRESSED" value={receipt.keys} />
            <Row label="SECRETS FOUND" value={`${found}/${Object.keys(EGGS).length}`} />
            <hr />
            <Row label="1 × PORTFOLIO VISIT" value="$0.00" />
            <Row label="COOKIES" value="NONE" />
            <Row label="TAX (VIBES)" value="$0.00" />
            <p className="rc-total"><span>TOTAL</span><span>$0.00</span></p>
            <hr />
            <p className="rc-center">THANK YOU, COME AGAIN</p>
            <span className="rc-code" />
            <p className="rc-center rc-small">CLICK TO TEAR OFF</p>
          </span>
        </button>
      </div>
    </aside>
  )
}
