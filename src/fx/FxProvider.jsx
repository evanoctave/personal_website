// The shared "fx" brain: one React context holding every toggle (invert, trail, grid, rain), popups,
// toasts, easter-egg progress and all the single-key shortcuts. Wraps the app in App.jsx; any component
// reads it with useFx(). Overlays.jsx draws what this state describes.
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// KNOB: easter eggs — id: text shown once found. add an entry here to add a secret; the footer counter,
// ? panel, terminal `eggs` and the receipt pick it up. something still has to call findEgg('id')
export const EGGS = {
  konami: 'Entered the old code',
  evan: 'Said my name',
  logo: 'Poked the logo too many times',
  idle: 'Walked away long enough',
  sudo: 'Asked for root',
  shake: 'Shook the mouse',
  lost: 'Got lost on purpose',
  admin: 'Tried the admin page',
  print: 'Tried to print the page',
  sixseven: 'Typed 67',
}

// KNOB: localStorage key for found eggs — renaming it resets everyone's progress
const EGG_KEY = 'eo-eggs'
// KNOB: the konami sequence (lowercased key names) that triggers god mode
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
// KNOB: number keys → pages for the 1–5 shortcuts (the ? panel text lives in Overlays.jsx SHORTCUTS)
export const ROUTES = { 1: '/home', 2: '/work', 3: '/about', 4: '/life', 5: '/contact' }

const FxContext = createContext(null)

const readEggs = () => {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(EGG_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const blast = (x = window.innerWidth / 2, y = window.innerHeight / 2, power = 1) =>
  window.dispatchEvent(new CustomEvent('fx:blast', { detail: { x, y, power } }))

const isTyping = (target) => target?.closest?.('input, textarea, select, [contenteditable="true"]')

let uid = 0

export function FxProvider({ children }) {
  const navigate = useNavigate()
  const [inverted, setInverted] = useState(false)
  const [trail, setTrail] = useState(false)
  const [grid, setGrid] = useState(false)
  const [rain, setRain] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [keysEnabled, setKeysEnabled] = useState(true)
  const [eggs, setEggs] = useState(readEggs)
  const [pops, setPops] = useState([])
  const [toasts, setToasts] = useState([])
  const buffer = useRef('')
  const konami = useRef(0)

  const toast = useCallback((message) => {
    const id = ++uid
    // KNOB: toasts — at most 4 on screen; each removed after 3400ms (CSS .fx-toast fades 3s + .3s, keep in sync)
    setToasts((list) => [...list.slice(-3), { id, message }])
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3400)
  }, [])

  const pop = useCallback((text, options = {}) => {
    const id = ++uid
    const item = {
      id,
      text,
      // KNOB: popups — text of 2 chars or less shows huge; random spot x 12–88%, y 16–80%, tilt ±15°
      big: text.length <= 2,
      x: options.x ?? 12 + Math.random() * 76,
      y: options.y ?? 16 + Math.random() * 64,
      rot: (Math.random() - 0.5) * 30,
    }
    // KNOB: at most 9 popups at once; each removed after 1100ms (CSS pop animation is .9s, keep this longer)
    setPops((list) => [...list.slice(-8), item])
    window.setTimeout(() => setPops((list) => list.filter((entry) => entry.id !== id)), 1100)
  }, [])

  const eggsRef = useRef(eggs)

  const findEgg = useCallback((id) => {
    if (eggsRef.current.has(id)) return
    const next = new Set(eggsRef.current).add(id)
    eggsRef.current = next
    setEggs(next)
    try {
      window.localStorage.setItem(EGG_KEY, JSON.stringify([...next]))
    } catch {
      // storage unavailable; eggs stay in memory for this visit
    }
    toast(`Easter egg ${next.size}/${Object.keys(EGGS).length} — ${EGGS[id]}`)
  }, [toast])

  // KNOB: default ms a pulse class stays on <body>
  const pulse = useCallback((className, ms = 1200) => {
    document.body.classList.add(className)
    window.setTimeout(() => document.body.classList.remove(className), ms)
  }, [])

  const godMode = useCallback(() => {
    // KNOB: god mode — popup text, barrel roll ms (CSS .fx-barrel-roll is 1.2s), 6 blasts 140ms apart, power 1.6
    findEgg('konami')
    pop('god mode', { x: 50, y: 50 })
    if (!prefersReducedMotion()) pulse('fx-barrel-roll', 1400)
    for (let i = 0; i < 6; i += 1) {
      window.setTimeout(() => blast(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 1.6), i * 140)
    }
  }, [findEgg, pop, pulse])

  const startRain = useCallback(() => {
    setRain(true)
    // KNOB: how long the matrix rain runs (ms)
    window.setTimeout(() => setRain(false), 7000)
  }, [])

  const actions = useMemo(() => ({
    invert: () => setInverted((value) => !value),
    trail: () => setTrail((value) => !value),
    grid: () => setGrid((value) => !value),
    rain: startRain,
    // KNOB: X-key shockwave strength (2.2; a normal click ripple is 1)
    blast: () => blast(undefined, undefined, 2.2),
    godMode,
  }), [godMode, startRain])

  // layout effect so children (DotField) read the new --fg in their effects
  useLayoutEffect(() => {
    document.documentElement.dataset.fxInverted = inverted ? 'true' : 'false'
    // KNOB: browser toolbar color, inverted vs normal — the dark one should match theme-color in index.html
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', inverted ? '#f4f3ef' : '#0d0d0d')
  }, [inverted])

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      if (terminalOpen) return
      const key = event.key.toLowerCase()

      if (key === 'escape') {
        setPanelOpen(false)
        return
      }

      konami.current = key === KONAMI[konami.current] ? konami.current + 1 : key === KONAMI[0] ? 1 : 0
      if (konami.current === KONAMI.length) {
        konami.current = 0
        godMode()
        return
      }

      // KNOB: key that opens the controls panel (also listed in SHORTCUTS in Overlays.jsx)
      if (event.key === '?') {
        event.preventDefault()
        setPanelOpen((value) => !value)
        return
      }
      if (!keysEnabled || event.repeat) return

      // KNOB: typed words — 'evan', 'neo', 'hello' and their popups. buffer keeps the last 12 letters,
      // so a new secret word must be 12 letters or shorter
      if (key.length === 1 && /[a-z]/.test(key)) {
        buffer.current = (buffer.current + key).slice(-12)
        if (buffer.current.endsWith('evan')) {
          findEgg('evan')
          pop('that’s me', { x: 50, y: 45 })
          return
        }
        if (buffer.current.endsWith('neo')) {
          pop('wake up', { x: 50, y: 45 })
          startRain()
          return
        }
        if (buffer.current.endsWith('hello')) {
          pop('hi', { x: 50, y: 45 })
          return
        }
      }

      // KNOB: single-key shortcuts and their popup text — keep SHORTCUTS in Overlays.jsx in sync
      switch (key) {
        case '/':
        case '`':
          event.preventDefault()
          setPanelOpen(false)
          setTerminalOpen(true)
          return
        case 'i':
          actions.invert()
          pop('invert')
          return
        case 't':
          setTrail(!trail)
          pop(trail ? 'trail off' : 'trail on')
          return
        case 'g':
          setGrid(!grid)
          pop(grid ? 'grid off' : 'grid on')
          return
        case 'x':
          actions.blast()
          pop('boom', { x: 50, y: 50 })
          return
        default:
          break
      }

      if (ROUTES[key]) {
        navigate(ROUTES[key])
        pop(key)
        return
      }

      // KNOB: any other key pops itself on screen, uppercased
      // a fast 67 shows the clip (SixSeven.jsx) instead of the 7 pop
      if (event.key.length === 1 && event.key !== ' ' && !event.fxSixSeven) pop(event.key.toUpperCase())
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions, findEgg, godMode, grid, keysEnabled, navigate, pop, startRain, terminalOpen, toast, trail])

  const value = useMemo(() => ({
    actions,
    eggs,
    findEgg,
    grid,
    inverted,
    keysEnabled,
    panelOpen,
    pop,
    pops,
    pulse,
    rain,
    setKeysEnabled,
    setPanelOpen,
    setTerminalOpen,
    terminalOpen,
    toast,
    toasts,
    trail,
  }), [actions, eggs, findEgg, grid, inverted, keysEnabled, panelOpen, pop, pops, pulse, rain, terminalOpen, toast, toasts, trail])

  return <FxContext.Provider value={value}>{children}</FxContext.Provider>
}

export const useFx = () => useContext(FxContext)
