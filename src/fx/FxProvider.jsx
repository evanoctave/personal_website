import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const EGGS = {
  konami: 'Entered the old code',
  evan: 'Said my name',
  logo: 'Poked the logo too many times',
  idle: 'Walked away long enough',
  sudo: 'Asked for root',
  shake: 'Shook the mouse',
  lost: 'Got lost on purpose',
}

const EGG_KEY = 'eo-eggs'
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
export const ROUTES = { 1: '/', 2: '/work', 3: '/about', 4: '/contact' }

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
    setToasts((list) => [...list.slice(-3), { id, message }])
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3400)
  }, [])

  const pop = useCallback((text, options = {}) => {
    const id = ++uid
    const item = {
      id,
      text,
      big: text.length <= 2,
      x: options.x ?? 12 + Math.random() * 76,
      y: options.y ?? 16 + Math.random() * 64,
      rot: (Math.random() - 0.5) * 30,
    }
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

  const pulse = useCallback((className, ms = 1200) => {
    document.body.classList.add(className)
    window.setTimeout(() => document.body.classList.remove(className), ms)
  }, [])

  const godMode = useCallback(() => {
    findEgg('konami')
    pop('god mode', { x: 50, y: 50 })
    if (!prefersReducedMotion()) pulse('fx-barrel-roll', 1400)
    for (let i = 0; i < 6; i += 1) {
      window.setTimeout(() => blast(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 1.6), i * 140)
    }
  }, [findEgg, pop, pulse])

  const startRain = useCallback(() => {
    setRain(true)
    window.setTimeout(() => setRain(false), 7000)
  }, [])

  const actions = useMemo(() => ({
    invert: () => setInverted((value) => !value),
    trail: () => setTrail((value) => !value),
    grid: () => setGrid((value) => !value),
    rain: startRain,
    blast: () => blast(undefined, undefined, 2.2),
    godMode,
  }), [godMode, startRain])

  useEffect(() => {
    document.documentElement.dataset.fxInverted = inverted ? 'true' : 'false'
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

      if (event.key === '?') {
        event.preventDefault()
        setPanelOpen((value) => !value)
        return
      }
      if (!keysEnabled || event.repeat) return

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

      if (event.key.length === 1 && event.key !== ' ') pop(event.key.toUpperCase())
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
