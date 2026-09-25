# Evan Octave — creative development portfolio

Interactive monochrome portfolio for Evan Octave. Hero and workbench artwork live locally; personal photos stay replaceable placeholders until supplied.

## Run locally

```bash
npm install
npm run dev
```

## Run tests

```bash
npm run test:run
```

## Create production build

```bash
npm run build
```

## Editing work

- Edit `src/data/projects.js` for project records, case-study copy, links, and optional media.
- Change a GitHub repository to public before future ingestion. Current build does not authenticate or call GitHub APIs; add normalized public repo data to project records when ready.
- On home page, drop local images into workbench, edit alt text, drag, resize, rotate, or remove. Keyboard: arrows move, Shift + arrows resize, Alt + arrows rotate.
- Clear `orbitfolio-workbench-v1` from browser storage to reset workbench layout.
- `react-moveable` powers direct manipulation. Keyboard controls remain available.
- Replace `public/assets/hero-orb-server-v1.png` or `public/assets/server-room-terrarium-v1.png` only with new decorative, text-free landscape art.
- Replace portrait and server-rack placeholders in `src/components/PersonalMediaPanel.jsx` with real images and meaningful alt text when ready.

## Replace template content

Edit these files:

- `src/data/projects.js`: project names, case-study copy, tags, links, and optional gallery images.
- `src/pages/AboutPage.jsx`: biography copy.
- `src/pages/ContactPage.jsx`: email and social links.
- `src/components/SiteShell.jsx`: site name, navigation, and footer text.

Each project card, home-orbit world, filter, and project detail route uses `src/data/projects.js`. Add a project object there and its route appears automatically.
