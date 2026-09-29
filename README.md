# Evan Octave — portfolio

Black-and-white interactive portfolio. React + Vite + React Router.

```bash
npm install
npm run dev        # local dev
npm run test:run   # tests
npm run build      # production build
```

## Adding images

Every image slot is a `<Placeholder>` (`src/components/Placeholder.jsx`). It shows its label, aspect ratio, and live pixel size. To use a real photo, drop the file in `public/images/` and pass `src`:

```jsx
<Placeholder src="/photos/me.jpg" alt="Evan at his desk" ratio="4 / 5" position="30% 50%" />
```

`ratio` is any CSS aspect-ratio. `position` is an optional `object-position` for when the crop needs nudging.

Photos are in `public/photos/`. Digicam shots keep their camera names (`PICT####.jpg`) so the burned-in
date stamp matches the file; phone shots are named by slug (`pitch.jpg`), 1200px max, JPEG q72. Short clips are in `public/clips/` as mp4 + jpg poster, trimmed to under 10s and
encoded at 720×540.

| Where | File |
| --- | --- |
| Hero, portrait, snapshots | `src/pages/HomePage.jsx` (`snapshots` array) |
| Life page (dated roll of photos + clips) | `src/data/life.js` |
| About portrait + desk strip | `src/pages/AboutPage.jsx` |
| Project covers | `cover: { src, alt }` in `src/data/projects.js` |
| Project galleries | `gallery: [{ src, alt, ratio }]` in `src/data/projects.js` |

## Content

- `src/data/projects.js`: projects (a new object gets a route at `/work/<slug>`).
- `src/pages/AboutPage.jsx`: bio + facts.
- `src/data/life.js`: the life page. `days` is the digicam roll (one object per camera date), `chapters` is the phone roll (newest first). Items are `kind: 'photo' | 'clip'`; `wide: true` makes a landscape photo span two columns.
- `src/components/Clip.jsx`: muted looping video with a sound toggle; falls back to controls under reduced motion.
- `src/pages/ContactPage.jsx`: email + social links.
- `src/components/SiteShell.jsx`: header, footer, location.

## Effects

All under `src/fx/`. Press `?` on the site for controls.

- `DotField.jsx`: reactive dot grid, click ripples, cursor trail.
- `Cursor.jsx`: custom blend-mode cursor with hover labels (`data-cursor="LABEL"` on any element).
- `FxProvider.jsx`: keyboard shortcuts, typed words, konami code, easter egg tracking.
- `Terminal.jsx`: `/` opens a fake shell.
- `Overlays.jsx`: key pops, toasts, controls panel, grid, rain, idle screensaver.

Easter eggs (spoilers): konami code, typing `evan`, clicking the logo 7×, idling 45s, `sudo` in the terminal, shaking the mouse, visiting a 404. Typing `neo` or `hello` also does things.
