// TouchKeyboard: the site's own black-and-white on-screen keyboard for the terminal on phones and tablets.
// Terminal.jsx turns the native keyboard off (inputMode="none") on touch screens and shows this instead.
// Every key is first sent through the input as a real keydown, so everything that listens for typing
// (the 67 clip, the receipt's key count, ↑/↓ history) still works, and FxProvider's single-key
// shortcuts ignore it like any typing in a text box. Styles: .tkb in site.css.
import { useEffect, useRef } from 'react'
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
  const rootRef = useRef(null)

  // lets the page scroll content up from behind the keyboard while it's open
  useEffect(() => {
    document.documentElement.classList.add('has-tkb')
    return () => document.documentElement.classList.remove('has-tkb')
  }, [])

  // iPhone: a tap on anything that isn't a text box takes focus away from the text box, and its delayed
  // "click" can land on whatever is underneath. cancelling the touch itself stops both. it has to be a
  // native listener: React's touch listeners are passive and can't cancel anything. keys still work,
  // because they act on pointerdown, which fires before this
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const cancel = (event) => event.preventDefault()
    root.addEventListener('touchstart', cancel, { passive: false })
    root.addEventListener('touchend', cancel, { passive: false })
    return () => {
      root.removeEventListener('touchstart', cancel)
      root.removeEventListener('touchend', cancel)
    }
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
    // put the caret back in the input in case the phone moved focus anyway (no native keyboard: inputMode none)
    if (target && document.activeElement !== target) target.focus({ preventScroll: true })
  }

  return createPortal(
    // the keyboard is portalled to <body>, but React still bubbles its events up to the terminal, whose
    // "click anywhere to focus" would undo ▾. stop them here
    <div aria-label="Keyboard" className="tkb" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => event.stopPropagation()} ref={rootRef} role="group">
      {ROWS.map((row) => (
        <div className="tkb-row" key={row.join('')}>
          {row.map((label) => (
            <button
              aria-label={NAMES[label] ?? label}
              className={`tkb-key${label === ' ' ? ' tkb-key--space' : ''}${label.length === 1 && !/[a-z0-9./]/.test(label) ? ' tkb-key--fn' : ''}`}
              key={label}
              // act on finger-down: instant, and before the phone does anything with the touch
              onPointerDown={(event) => {
                event.preventDefault()
                press(label)
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
