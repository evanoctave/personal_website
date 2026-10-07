// TouchKeyboard: the site's own black-and-white on-screen keyboard for the terminal on phones and tablets.
// Terminal.jsx turns the native keyboard off (inputMode="none") on touch screens and shows this instead.
// Every key is first sent through the input as a real keydown, so everything that listens for typing
// (the 67 clip, the receipt's key count, ↑/↓ history) still works, and FxProvider's single-key
// shortcuts ignore it like any typing in a text box. Styles: .tkb in site.css.
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

// KNOB: the layout. ⌫ deletes, ⏎ runs the command, ▾ hides the keyboard
const ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['▾', '/', '.', ' ', '⏎'],
]
const NAMES = { '⌫': 'Delete', '⏎': 'Run', '▾': 'Hide keyboard', ' ': 'Space', '/': 'Slash', '.': 'Period' }
const KEYS = { '⌫': 'Backspace', '⏎': 'Enter' }

// target: the terminal's <input>. onKey(key) does the actual typing in Terminal.jsx
export default function TouchKeyboard({ target, onKey, onHide }) {
  // lets the page scroll content up from behind the keyboard while it's open
  useEffect(() => {
    document.documentElement.classList.add('has-tkb')
    return () => document.documentElement.classList.remove('has-tkb')
  }, [])

  const press = (label) => {
    // ▾ only hides the keyboard; it isn't a key press (an Escape would also close the pop-up terminal)
    if (label === '▾') {
      onHide()
      return
    }
    const key = KEYS[label] ?? label
    target?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    onKey(key)
  }

  return createPortal(
    // the keyboard is portalled to <body>, but React still bubbles its clicks up to the terminal, whose
    // "click anywhere to focus" would undo ▾. stop them here
    <div aria-label="Keyboard" className="tkb" onClick={(event) => event.stopPropagation()} role="group">
      {ROWS.map((row) => (
        <div className="tkb-row" key={row.join('')}>
          {row.map((label) => (
            <button
              aria-label={NAMES[label] ?? label}
              className={`tkb-key${label === ' ' ? ' tkb-key--space' : ''}${label.length === 1 && !/[a-z0-9./]/.test(label) ? ' tkb-key--fn' : ''}`}
              key={label}
              // ▾ hides on the click itself; hiding on finger-down let the click fall through to the terminal
              // underneath, which focused it again and brought the keyboard straight back
              onClick={() => label === '▾' && press(label)}
              // keep focus (and the caret) in the terminal input while tapping keys
              onPointerDown={(event) => {
                event.preventDefault()
                if (label !== '▾') press(label)
              }}
              tabIndex={-1}
              type="button"
            >
              {label === ' ' ? 'space' : label}
            </button>
          ))}
        </div>
      ))}
    </div>,
    document.body,
  )
}
