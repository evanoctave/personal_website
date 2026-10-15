# Dice gate — design

Date: 2026-10-13

## What

A small box under "Say hi" on `/home`. Pick a friend's site (from the shared friendsites list, see
`2026-10-13-friendsites-ring-design.md`), pick a number 1–12, roll two dice. If the total is strictly
above the number, the site opens in a new tab. If it's below, or equal (tie goes to the house), you
roll again. The odds for the picked number show next to the roll button. Picking 12 is unwinnable on
purpose; picking 1 always wins.

## How

- `src/components/dice/odds.js`: pure rules. `judge(total, target)`, `winChance(target)`,
  `upFace(normalYs)` (which face of a settled die points up; flags a cocked die), `rollFlat()`.
- `src/components/dice/scene.js`: three.js + cannon-es. Two textured cube bodies thrown from the left
  across an invisible tray (floor, four walls, lid). Orthographic camera tilted 28°, shadow-only floor
  so the page background shows through. `roll()` resolves `[a, b]` once both bodies sleep; a die that
  lands cocked is flicked up to four times. Pip textures are drawn on canvases from the site's
  `--fg`/`--bg` so they follow the light/dark switch. Loaded with a dynamic `import()` so three.js is
  its own chunk, fetched only on `/home`.
- `src/components/dice/DiceTable.jsx`: the UI and state. Uses the 3D scene when WebGL exists and
  motion isn't reduced; otherwise falls back to flat glyph dice with an instant roll. Opens the site
  with `window.open(..., '_blank', 'noopener')`; if the browser blocks the tab, the result line shows
  the link to click instead.

## Tests

- Unit: rules and face reading in `odds.test.js`.
- Component: `DiceTable.test.jsx` mocks `scene.js` and `fetch`; covers friend list, odds, win opens
  the tab, lose and tie make you roll again, 3D path and dispose on unmount.
- Visual: checked in headless Chrome with software WebGL (framing, tumble, settle, read-out).
