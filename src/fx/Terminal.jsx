// The pretend shell that opens with / or `. Every command is a case in the big switch in run().
// Two ways to show it: the pop-up (rendered inside Overlays.jsx) and `inline`, a window that sits in the
// home page once the intro clip has gone (HomePage.jsx). Both share every command below.
// Rendered inside Overlays.jsx; toggles fx state from FxProvider.jsx; `print` calls Receipt.jsx.
// On touch screens it uses the site's own keyboard (TouchKeyboard.jsx) instead of the phone's.
// Styles in site.css under .fx-terminal.
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects.js'
import { EGGS, useFx } from './FxProvider.jsx'
import { printReceipt } from './Receipt.jsx'
import TouchKeyboard from './TouchKeyboard.jsx'

// KNOB: pages `ls` lists and `cd <page>` can jump to
const PAGES = { home: '/home', work: '/work', about: '/about', life: '/life', contact: '/contact', admin: '/admin' }
// KNOB: line(s) shown when the terminal first opens
const GREETING = [
  'eo-shell v2.6 — type `help` to see commands.',
]
// KNOB: what the inline (home page) terminal starts with
const INLINE_GREETING = [
  'eo-shell v2.6 — this one is real. click and type.',
  'try: ls · whoami · work · work 2 · print · coffee',
]

// phones and tablets: no mouse, finger only
const isTouch = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(pointer: coarse)').matches)

export default function Terminal({ inline = false }) {
  const navigate = useNavigate()
  const { actions, eggs, findEgg, pop, pulse, setTerminalOpen, terminalOpen } = useFx()
  const [lines, setLines] = useState(inline ? INLINE_GREETING : GREETING)
  const fieldId = useId()
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const logRef = useRef(null)
  const [touch] = useState(isTouch)
  const [keyboard, setKeyboard] = useState(false)
  // delayed follow-up lines (like the `work` hint); cleared if the terminal goes away first
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  const later = (ms, extra) => {
    timers.current.push(window.setTimeout(() => setLines((current) => [...current, ...extra]), ms))
  }

  useEffect(() => {
    // the pop-up grabs focus when it opens; the inline one waits to be clicked
    if (terminalOpen && !inline) inputRef.current?.focus()
  }, [terminalOpen, inline])

  useEffect(() => {
    logRef.current?.scrollTo?.({ top: logRef.current.scrollHeight })
  }, [lines])

  // with the keyboard up, make sure the input sits just above it rather than behind it
  useEffect(() => {
    if (!keyboard) return undefined
    const frame = window.requestAnimationFrame(() => {
      const input = inputRef.current
      const kb = document.querySelector('.tkb')
      if (!input || !kb) return
      // measure where the keyboard ends up, not where it is mid slide-in (offsetHeight ignores the slide)
      const gap = input.getBoundingClientRect().bottom - (window.innerHeight - kb.offsetHeight) + 16
      if (gap > 0) window.scrollBy({ top: gap, behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [keyboard])

  if (!inline && !terminalOpen) return null

  // the inline one can't close, so Esc / exit just leave the input
  const close = () => (inline ? inputRef.current?.blur() : setTerminalOpen(false))
  const go = (path) => {
    navigate(path)
    close()
  }

  const run = (raw) => {
    const [command = '', ...args] = raw.trim().split(/\s+/)
    const arg = args.join(' ')
    // KNOB: every command and its reply — each case returns an array of output lines; add a case to add a command
    switch (command.toLowerCase()) {
      case '':
        return []
      case 'help':
        // KNOB: the help list — update it when you add or rename commands
        return [
          'help            this list',
          'ls              list pages',
          'cd <page>       go to a page',
          'work            list projects',
          'work <n>        open project n',
          'whoami          who is this',
          'date            local time',
          'invert | trail | grid | rain | blast',
          'eggs            easter egg progress',
          'echo <text>     say something',
          'clear | exit',
          '…and a few commands I won’t list.',
        ]
      case 'ls':
        return [Object.keys(PAGES).map((page) => `${page}/`).join('   ')]
      case 'cd': {
        const page = arg.replace(/[/~.]/g, '') || 'home'
        if (!PAGES[page]) return [`cd: no such page: ${arg}`]
        go(PAGES[page])
        return []
      }
      case 'work':
      case 'projects':
      case 'open': {
        // `work 2` / `open 2` opens project 2; plain `work` lists them
        if (arg) {
          const project = projects[Number(arg) - 1]
          if (!project) return [`${command.toLowerCase()}: pick 1–${projects.length}`]
          go(`/work/${project.slug}`)
          return []
        }
        if (command.toLowerCase() === 'open') return [`open: pick 1–${projects.length}`]
        // KNOB: the follow-up hint and how long it waits after the list (ms)
        later(750, ["try 'work' then a number (like 'work 2') to open that project"])
        return projects.map((project, i) => `[${i + 1}] ${project.title} — ${project.year}`)
      }
      case 'whoami':
        // KNOB: whoami reply
        return ['idk, who r u?']
      case 'date':
        return [new Date().toString()]
      case 'echo':
        // KNOB: echo popup — first 14 chars, uppercased
        if (arg) pop(arg.slice(0, 14).toUpperCase(), { x: 50, y: 50 })
        return [arg]
      case 'invert':
      case 'trail':
      case 'grid':
      case 'rain':
      case 'blast':
        actions[command.toLowerCase()]()
        return [`${command}: toggled`]
      case 'eggs':
        return [`${eggs.size}/${Object.keys(EGGS).length} found. keep poking around.`]
      case 'sudo':
        findEgg('sudo')
        actions.invert()
        return ['[sudo] password for guest: ********', 'access granted. please use your powers responsibly.', '(the admin panel is at /admin, obviously)']
      case 'rm':
        pulse('fx-wobble', 100)
        return ['lol nice try bud, not today.']
      case 'konami':
        return ['up, up, down, down, left, right, left, right, B, A...but not in here.']
      case 'hello':
      case 'what\'s up':
      case 'whats up':
      case 'sup':
        return ['yo.']
      case 'hi':
        return ['hi :)']
      case 'vim':
      case 'emacs':
        return ['let’s DEFINITELY not start that here.']
      case 'print':
      case 'receipt':
        printReceipt()
        return ['sending job to E. OCTAVE-1…']
      case 'coffee':
        return ['      ( (', '       ) )', '    ........', '    |      |]', '    \\      /', '     `----\'']
      case 'clear':
        setLines([])
        return ['clear as day.']
      case 'exit':
      case 'quit':
        close()
        return []
      default:
        // KNOB: reply for unknown commands
        return [`command not found: ${command}. try \`help\``]
    }
  }

  const submit = () => {
    const output = run(value)
    if (output !== null) setLines((current) => [...current, `> ${value}`, ...output])
    // KNOB: how many past commands ↑/↓ remembers (30)
    if (value.trim()) setHistory((current) => [value, ...current].slice(0, 30))
    setValue('')
    setCursor(-1)
  }
  const onSubmit = (event) => {
    event.preventDefault()
    submit()
  }

  // what the on-screen keyboard's keys do (it has already sent the keydown through the input)
  const onTouchKey = (key) => {
    if (key === 'Enter') submit()
    else if (key === 'Backspace') setValue((current) => current.slice(0, -1))
    else setValue((current) => current + key)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') close()
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setValue(history[next])
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = cursor - 1
      setCursor(Math.max(next, -1))
      setValue(next < 0 ? '' : history[next])
    }
  }

  const screen = (
    <>
      <div className="fx-terminal-log" ref={logRef}>
        {lines.map((line, i) => <pre key={`${i}-${line}`}>{line}</pre>)}
      </div>
      <form className="fx-terminal-input" onSubmit={onSubmit}>
        {/* KNOB: input prompt symbol */}
        <label htmlFor={fieldId}>&gt;</label>
        <input
          autoCapitalize="off"
          autoComplete="off"
          id={fieldId}
          // touch screens get the site's keyboard instead of the phone's
          inputMode={touch ? 'none' : undefined}
          onBlur={() => setKeyboard(false)}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => touch && setKeyboard(true)}
          onKeyDown={onKeyDown}
          ref={inputRef}
          spellCheck="false"
          value={value}
        />
      </form>
      {keyboard && <TouchKeyboard onHide={() => inputRef.current?.blur()} onKey={onTouchKey} target={inputRef.current} />}
    </>
  )

  if (inline) {
    return (
      <section aria-label="Terminal" className="fx-terminal fx-terminal--inline" onClick={() => inputRef.current?.focus()}>
        <header className="fx-terminal-bar">
          <span>guest@evanoctave: ~</span>
          {/* KNOB: hint on the right of the inline terminal's title bar */}
          <span className="fx-terminal-hint">help</span>
        </header>
        {screen}
      </section>
    )
  }

  return (
    <div className="fx-backdrop" onClick={close}>
      <section
        aria-label="Terminal"
        aria-modal="true"
        className="fx-terminal"
        onClick={(event) => {
          event.stopPropagation()
          inputRef.current?.focus()
        }}
        role="dialog"
      >
        <header className="fx-terminal-bar">
          {/* KNOB: title bar prompt text */}
          <span>guest@evanoctave: ~</span>
          <button onClick={close} type="button">Esc</button>
        </header>
        {screen}
      </section>
    </div>
  )
}
