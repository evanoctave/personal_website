// DiceTable: the dice gate under "Say hi" on /home. pick a friend's site and a number 1–12, roll two
// dice; beat the number and the site opens in a new tab, miss and you roll again.
// the sites come from the shared friendsites list (components/friendsites.ts). the 3D dice live in
// ./scene.js (three.js + cannon-es), loaded only when there's WebGL and motion is allowed; otherwise
// the roll is instant with flat glyph dice. the rules are in ./odds.js.
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../fx/FxProvider.jsx'
import { href, loadRing, others } from '../friendsites'
import { judge, rollFlat, winChance } from './odds.js'

const NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1)
const GLYPHS = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
// KNOB: the number picked when the page loads
const DEFAULT_TARGET = 7
// KNOB: how long the flat (no-WebGL) roll pretends to think, in ms
const FLAT_ROLL_MS = 350
const host = (url) => href(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')

const canWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function DiceTable() {
  const [friends, setFriends] = useState([])
  const [site, setSite] = useState('')
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [dice, setDice] = useState(null)
  const [status, setStatus] = useState('idle') // idle | rolling | win | lose
  const [blocked, setBlocked] = useState(false)
  const [mode, setMode] = useState('loading') // loading | 3d | flat
  const trayRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    let live = true
    loadRing()
      .then((list) => {
        if (!live) return
        const rest = others(list)
        setFriends(rest)
        setSite((s) => s || rest[0]?.url || '')
      })
      .catch(() => {})
    return () => { live = false }
  }, [])

  useEffect(() => {
    if (!canWebGL() || prefersReducedMotion()) {
      setMode('flat')
      return undefined
    }
    let live = true
    import('./scene.js')
      .then(({ createDiceScene }) => {
        if (!live) return
        sceneRef.current = createDiceScene(trayRef.current)
        setMode('3d')
      })
      .catch(() => { if (live) setMode('flat') })
    return () => {
      live = false
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  const roll = async () => {
    if (status === 'rolling' || !site) return
    setStatus('rolling')
    setBlocked(false)
    let pair
    if (sceneRef.current) {
      pair = await sceneRef.current.roll()
    } else {
      await new Promise((r) => setTimeout(r, FLAT_ROLL_MS))
      pair = [rollFlat(), rollFlat()]
    }
    setDice(pair)
    const verdict = judge(pair[0] + pair[1], target)
    setStatus(verdict)
    if (verdict === 'win') {
      const tab = window.open(href(site), '_blank', 'noopener')
      if (!tab) setBlocked(true)
    }
  }

  const total = dice ? dice[0] + dice[1] : null
  const chance = Math.round(winChance(target) * 100)
  const picked = friends.find((f) => f.url === site)

  return (
    <div className="dice" data-mode={mode}>
      {/* KNOB: the gate's one-line pitch */}
      <p className="dice-pitch">Or roll for it. Wanna visit my friends' sites? Try your luck.</p>

      <div className="dice-controls">
        <label className="dice-site">
          <span className="sr-only">friend&apos;s site</span>
          <select disabled={!friends.length || status === 'rolling'} onChange={(e) => setSite(e.target.value)} value={site}>
            {!friends.length && <option value="">I got no friends :(</option>}
            {friends.map((f) => <option key={f.url} value={f.url}>{f.displayName}</option>)}
          </select>
        </label>
        <div aria-label="number to beat" className="dice-nums" role="group">
          {NUMBERS.map((n) => (
            <button
              aria-label={`beat ${n}`}
              aria-pressed={n === target}
              disabled={status === 'rolling'}
              key={n}
              onClick={() => setTarget(n)}
              type="button"
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="dice-tray" ref={trayRef}>
        {mode !== '3d' && (
          <p aria-hidden="true" className="dice-flat">
            {dice ? `${GLYPHS[dice[0]]} ${GLYPHS[dice[1]]}` : `${GLYPHS[3]} ${GLYPHS[4]}`}
          </p>
        )}
      </div>

      <p aria-live="polite" className="dice-result">
        <button className="dice-roll" disabled={!site || status === 'rolling'} onClick={roll} type="button">
          {status === 'rolling' ? 'rolling…' : status === 'lose' ? 'roll again' : 'roll'}
        </button>
        {' '}
        {status === 'idle' && <span>you need more than {target}. {chance}% chance.</span>}
        {status === 'rolling' && <span>…</span>}
        {status === 'lose' && total !== null && (
          <span>{dice[0]} + {dice[1]} = {total}. {total === target ? 'tie goes to ME, not you.' : `not above ${target}.`} try again.</span>
        )}
        {status === 'win' && total !== null && picked && (
          <span>
            {dice[0]} + {dice[1]} = {total}. through!{' '}
            {blocked ? 'I think it\'s a sign...' : 'opening '}
            <a href={href(site)} rel="noreferrer" target="_blank">{host(site)} ↗</a>
          </span>
        )}
      </p>
    </div>
  )
}
