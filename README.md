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
<Placeholder src="/images/me.jpg" alt="Evan at his desk" ratio="4 / 5" />
```

`ratio` is any CSS aspect-ratio. Change it to match your photo.

| Where | File |
| --- | --- |
| Hero, portrait, snapshots | `src/pages/HomePage.jsx` (`SNAPSHOTS` array) |
| About portrait + workbench strip | `src/pages/AboutPage.jsx` |
| Project covers | `cover: { src, alt }` in `src/data/projects.js` |
| Project galleries | `gallery: [{ src, alt, ratio }]` in `src/data/projects.js` |

## Content

- `src/data/projects.js`: projects (a new object gets a route at `/work/<slug>`).
- `src/pages/AboutPage.jsx`: bio + facts.
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
