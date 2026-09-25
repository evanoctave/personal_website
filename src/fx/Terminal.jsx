import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects.js'
import { EGGS, useFx } from './FxProvider.jsx'

const PAGES = { home: '/', work: '/work', about: '/about', contact: '/contact' }
const GREETING = [
  'eo-shell v2.6 — type `help` to see commands.',
]

export default function Terminal() {
  const navigate = useNavigate()
  const { actions, eggs, findEgg, pop, pulse, setTerminalOpen, terminalOpen } = useFx()
  const [lines, setLines] = useState(GREETING)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus()
  }, [terminalOpen])

  useEffect(() => {
    logRef.current?.scrollTo?.({ top: logRef.current.scrollHeight })
  }, [lines])

  if (!terminalOpen) return null

  const close = () => setTerminalOpen(false)
  const go = (path) => {
    navigate(path)
    close()
  }

  const run = (raw) => {
    const [command = '', ...args] = raw.trim().split(/\s+/)
    const arg = args.join(' ')
    switch (command.toLowerCase()) {
      case '':
        return []
      case 'help':
        return [
          'help            this list',
          'ls              list pages',
          'cd <page>       go to a page',
          'work            list projects',
          'open <n>        open project n',
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
        return projects.map((project, i) => `[${i + 1}] ${project.title} — ${project.year}`)
      case 'open': {
        const project = projects[Number(arg) - 1]
        if (!project) return [`open: pick 1–${projects.length}`]
        go(`/work/${project.slug}`)
        return []
      }
      case 'whoami':
        return ['guest. but the site belongs to Evan Octave — developer, designer, tinkerer.']
      case 'date':
        return [new Date().toString()]
      case 'echo':
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
        return ['[sudo] password for guest: ********', 'access granted. please use your powers responsibly.']
      case 'rm':
        pulse('fx-wobble', 700)
        return ['nice try.']
      case 'konami':
        return ['↑ ↑ ↓ ↓ ← → ← → B A — but not in here.']
      case 'hello':
      case 'hi':
        return ['hi :)']
      case 'vim':
      case 'emacs':
        return ['let’s not start that here.']
      case 'coffee':
        return ['      ( (', '       ) )', '    ........', '    |      |]', '    \\      /', '     `----\'']
      case 'clear':
        setLines([])
        return null
      case 'exit':
      case 'quit':
        close()
        return []
      default:
        return [`command not found: ${command}. try \`help\``]
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const output = run(value)
    if (output !== null) setLines((current) => [...current, `> ${value}`, ...output])
    if (value.trim()) setHistory((current) => [value, ...current].slice(0, 30))
    setValue('')
    setCursor(-1)
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
          <span>guest@evanoctave: ~</span>
          <button onClick={close} type="button">Esc</button>
        </header>
        <div className="fx-terminal-log" ref={logRef}>
          {lines.map((line, i) => <pre key={`${i}-${line}`}>{line}</pre>)}
        </div>
        <form className="fx-terminal-input" onSubmit={onSubmit}>
          <label htmlFor="fx-terminal-field">&gt;</label>
          <input
            autoCapitalize="off"
            autoComplete="off"
            id="fx-terminal-field"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            spellCheck="false"
            value={value}
          />
        </form>
      </section>
    </div>
  )
}
