# Cosmic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original, accessible React portfolio template with cosmic-platformer motion and reusable project detail pages.

**Architecture:** A Vite React application uses React Router for page and project-slug routes. One local project-data module supplies cards, the home orbit, filtering, and detail pages. CSS owns cosmic artwork, responsive layouts, and reduced-motion behavior, so no licensed game assets are required.

**Tech Stack:** Vite, React, React Router, Vitest, React Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-09-21-cosmic-portfolio-design.md`

## Global Constraints

- Build original cosmic-platformer visual language. Never use Nintendo names, characters, logos, art, music, or copied level designs.
- Use Vite React and React Router.
- Keep template project content in `src/data/projects.js`.
- Use semantic landmarks, visible focus styles, 44px touch targets, and a skip link.
- Honor `prefers-reduced-motion: reduce` by disabling orbit, parallax, and entrance animation.
- Keep line length readable and layout responsive from narrow phones through desktop.
- Hide absent project links and galleries rather than rendering broken controls.

## Review Focus

- Unknown `:slug` must render recovery UI, not throw while dereferencing missing project data.
- Optional project links and galleries must not leave dead buttons or empty sections.
- Keyboard users must reach the skip link, navigation, filters, project cards, and detail-page links in a logical order.
- Motion-sensitive users must receive a still interface when their operating-system preference requests reduced motion.
- Project grid and orbit controls must remain usable below 480px width without relying on pointer hover.

---

## File Structure

- `package.json`: development, test, and production-build commands.
- `vite.config.js`: React plugin and Vitest browser-environment configuration.
- `src/main.jsx`: browser-router entry point.
- `src/App.jsx`: route table and site-shell composition.
- `src/data/projects.js`: template project objects and lookup/navigation helpers.
- `src/components/SiteShell.jsx`: skip link, navigation, page main landmark, footer, decorative starfield.
- `src/components/OrbitHero.jsx`: home-page hero and keyboard-accessible project orbit.
- `src/components/ProjectGrid.jsx`: tag filtering and project-card presentation.
- `src/components/ProjectDetail.jsx`: metadata, case-study template, optional gallery/links, adjacent navigation.
- `src/components/TemplateNotice.jsx`: reusable edit-content note.
- `src/pages/*.jsx`: route-level page composition.
- `src/styles/base.css`: tokens, reset, type, focus, shared controls, reduced-motion rule.
- `src/styles/cosmic.css`: starfield, planets, orbits, project grid, route layouts, responsive rules.
- `src/test/setup.js`: Testing Library matchers.
- `src/**/*.test.jsx`: route, data, and interaction tests.
- `README.md`: local run steps and template-content editing guide.

### Task 1: Scaffold Vite, Routing, and Test Runtime

**Files:**
- Create: `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/test/setup.js`
- Create: `vite.config.js`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run dev`, `npm run test:run`, and `npm run build` commands.
- Produces: React runtime with Vitest configured for `jsdom`.

- [ ] **Step 1: Create React Vite application**

Run:

```bash
npm create vite@latest . -- --template react
npm install
npm install react-router-dom
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Configure test runtime**

Replace `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
```

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
```

Add these scripts to `package.json`:

```json
{
  "dev": "vite",
  "build": "vite build",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Replace default entry point with browser-router entry**

Set `src/main.jsx` to:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/base.css'
import './styles/cosmic.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 4: Verify production build**

Run: `npm run build`

Expected: `dist/` generated without errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html vite.config.js src/main.jsx src/test/setup.js
git commit -m "chore: scaffold React portfolio"
```

### Task 2: Create Single-Source Project Template Data

**Files:**
- Create: `src/data/projects.js`
- Create: `src/data/projects.test.js`

**Interfaces:**
- Produces: `projects`, `getProjectBySlug(slug)`, `getProjectTags()`, and `getAdjacentProjects(slug)`.
- Consumes: none.

- [ ] **Step 1: Write failing data-module tests**

Create `src/data/projects.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectTags,
  projects,
} from './projects'

describe('project templates', () => {
  it('finds a project by its stable URL slug', () => {
    expect(getProjectBySlug('nebula-notes')).toMatchObject({
      title: 'Nebula Notes',
      slug: 'nebula-notes',
    })
  })

  it('returns undefined for a missing project slug', () => {
    expect(getProjectBySlug('not-a-world')).toBeUndefined()
  })

  it('returns unique filter tags', () => {
    expect(getProjectTags()).toEqual(['All', 'Brand', 'Product', 'Web'])
  })

  it('wraps adjacent project navigation', () => {
    expect(getAdjacentProjects('nebula-notes')).toMatchObject({
      previous: { slug: 'comet-care' },
      next: { slug: 'signal-garden' },
    })
  })

  it('gives every template project a unique slug', () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/data/projects.test.js`

Expected: FAIL with module-not-found error for `./projects`.

- [ ] **Step 3: Implement complete project data and helpers**

Create `src/data/projects.js` with three template projects. Each object must contain every field below and use empty arrays or `null` for missing optional content:

```js
export const projects = [
  {
    slug: 'nebula-notes',
    title: 'Nebula Notes',
    eyebrow: 'Productivity system',
    year: '2026',
    role: 'Product design + frontend',
    stack: ['React', 'Motion', 'Local-first'],
    tags: ['Product', 'Web'],
    summary: 'A quiet note tool for loud ideas.',
    challenge: 'Turn unstructured fragments into a calm daily ritual.',
    solution: 'Designed a spatial inbox and one-command capture flow.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'coral', size: 'large', angle: 12 },
    cover: { label: 'Coral planet with paper rings', tone: 'coral' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    eyebrow: 'Climate data experience',
    year: '2026',
    role: 'Creative developer',
    stack: ['React', 'Data viz', 'Accessibility'],
    tags: ['Product', 'Web'],
    summary: 'Public data made warm, legible, and alive.',
    challenge: 'Make seasonal climate signals useful to local residents.',
    solution: 'Built a color-guided forecast narrative with plain-language states.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'mint', size: 'medium', angle: 142 },
    cover: { label: 'Mint planet with leaf satellites', tone: 'mint' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
  },
  {
    slug: 'comet-care',
    title: 'Comet Care',
    eyebrow: 'Identity and service site',
    year: '2026',
    role: 'Brand direction + web',
    stack: ['Brand', 'UI', 'React'],
    tags: ['Brand', 'Web'],
    summary: 'Gentle care scheduling for moving lives.',
    challenge: 'Make appointment planning feel human during stressful weeks.',
    solution: 'Paired direct language with a calm service-path finder.',
    outcome: 'Replace with launch metric or project outcome.',
    orbit: { color: 'yellow', size: 'small', angle: 252 },
    cover: { label: 'Yellow comet crossing soft clouds', tone: 'yellow' },
    gallery: [],
    liveUrl: null,
    codeUrl: null,
  },
]

export const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug)

export const getProjectTags = () => [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
]

export const getAdjacentProjects = (slug) => {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index < 0) return { previous: undefined, next: undefined }
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  }
}
```

- [ ] **Step 4: Run data tests to verify pass**

Run: `npm run test:run -- src/data/projects.test.js`

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/data/projects.test.js
git commit -m "feat: add portfolio project templates"
```

### Task 3: Build Route Shell and Static Template Pages

**Files:**
- Create: `src/components/SiteShell.jsx`
- Create: `src/pages/HomePage.jsx`, `src/pages/AboutPage.jsx`, `src/pages/ContactPage.jsx`, `src/pages/NotFoundPage.jsx`
- Modify: `src/App.jsx`
- Create: `src/App.test.jsx`

**Interfaces:**
- Consumes: React Router `NavLink`, `Outlet`, `Route`, `Routes`.
- Produces: route shell at `/`, `/about`, `/contact`, and wildcard path.

- [ ] **Step 1: Write failing route tests**

Create `src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>,
)

describe('application routes', () => {
  it('renders main navigation and skip link', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('renders about template route', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'About this orbit' })).toBeInTheDocument()
  })

  it('renders original recovery page for unknown routes', () => {
    renderAt('/drifted-away')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/App.test.jsx`

Expected: FAIL because application route shell does not exist.

- [ ] **Step 3: Implement shell and routes**

Use a route-shell component with semantic landmarks:

```jsx
export default function SiteShell() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="starfield" aria-hidden="true" />
      <header className="site-header">
        <NavLink className="wordmark" to="/" aria-label="Orbitfolio home">Orbitfolio</NavLink>
        <nav aria-label="Primary">
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer><p>Built to be replaced with your next great thing.</p></footer>
    </div>
  )
}
```

`App.jsx` must nest `/`, `/about`, `/contact`, and `*` routes under `SiteShell`. `HomePage` uses an `h1` named `Portfolio at escape velocity`; `AboutPage` uses `h1` named `About this orbit`; `NotFoundPage` uses `h1` named `You found empty space`. `ContactPage` has a replacement email link using `mailto:hello@example.com`.

- [ ] **Step 4: Run route tests to verify pass**

Run: `npm run test:run -- src/App.test.jsx`

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/App.test.jsx src/components/SiteShell.jsx src/pages
git commit -m "feat: add portfolio route shell"
```

### Task 4: Build Home Orbit Hero and Original Cosmic Visual System

**Files:**
- Create: `src/components/OrbitHero.jsx`
- Create: `src/components/OrbitHero.test.jsx`
- Modify: `src/pages/HomePage.jsx`
- Create: `src/styles/base.css`, `src/styles/cosmic.css`

**Interfaces:**
- Consumes: `projects` from `src/data/projects.js`.
- Produces: project links for every home-orbit planet and reduced-motion-safe CSS.

- [ ] **Step 1: Write failing orbit interaction test**

Create `src/components/OrbitHero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import OrbitHero from './OrbitHero'

describe('OrbitHero', () => {
  it('gives every template project a labeled detail-page link', () => {
    render(<MemoryRouter><OrbitHero /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Open Nebula Notes project' })).toHaveAttribute('href', '/projects/nebula-notes')
    expect(screen.getByRole('link', { name: 'Open Signal Garden project' })).toHaveAttribute('href', '/projects/signal-garden')
    expect(screen.getByRole('link', { name: 'Open Comet Care project' })).toHaveAttribute('href', '/projects/comet-care')
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/components/OrbitHero.test.jsx`

Expected: FAIL with module-not-found error for `OrbitHero`.

- [ ] **Step 3: Implement hero, orbital controls, and CSS system**

`OrbitHero.jsx` maps `projects` into real `<Link>` elements. Each planet link must use `aria-label={`Open ${project.title} project`}` and a custom property for its angle:

```jsx
<Link
  className={`orbit-planet orbit-planet--${project.orbit.size}`}
  style={{ '--orbit-angle': `${project.orbit.angle}deg`, '--planet-tone': `var(--${project.orbit.color})` }}
  to={`/projects/${project.slug}`}
  aria-label={`Open ${project.title} project`}
>
  <span aria-hidden="true" />
  <b>{project.title}</b>
</Link>
```

`HomePage` renders `OrbitHero`, then a short template-introduction section and a text link to `/projects` named `Explore all worlds`.

In `base.css`, define OKLCH tokens for `--space`, `--ink`, `--lunar`, `--coral`, `--mint`, and `--yellow`; set focus treatment with `:focus-visible`; set `min-height: 44px` on links and buttons used as controls. In `cosmic.css`, render CSS stars using layered radial gradients, use only `transform` and `opacity` in animation keyframes, and include:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  .orbit-planet { transform: rotate(var(--orbit-angle)) translateX(clamp(7rem, 22vw, 14rem)) rotate(calc(-1 * var(--orbit-angle))); }
}
```

At `max-width: 480px`, turn orbit links into an ordinary vertical list while retaining all project links.

- [ ] **Step 4: Run orbit test and production build**

Run:

```bash
npm run test:run -- src/components/OrbitHero.test.jsx
npm run build
```

Expected: PASS, 1 test; production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/OrbitHero.jsx src/components/OrbitHero.test.jsx src/pages/HomePage.jsx src/styles
git commit -m "feat: add cosmic portfolio hero"
```

### Task 5: Build Filterable Project World Map

**Files:**
- Create: `src/components/ProjectGrid.jsx`
- Create: `src/components/ProjectGrid.test.jsx`
- Create: `src/pages/ProjectsPage.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `getProjectTags()` and `projects` from `src/data/projects.js`.
- Produces: `/projects` route with filter buttons and project detail links.

- [ ] **Step 1: Write failing filter test**

Create `src/components/ProjectGrid.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectGrid from './ProjectGrid'

describe('ProjectGrid', () => {
  it('filters cards by selected tag and restores all cards', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProjectGrid /></MemoryRouter>)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Brand' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Comet Care' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/components/ProjectGrid.test.jsx`

Expected: FAIL with module-not-found error for `ProjectGrid`.

- [ ] **Step 3: Implement map, filters, and cards**

`ProjectGrid` owns `activeTag` state initialized to `'All'`, maps `getProjectTags()` to `button` controls, and filters with:

```js
const visibleProjects = activeTag === 'All'
  ? projects
  : projects.filter((project) => project.tags.includes(activeTag))
```

Each visible item is an `<article>` containing `h2`, summary, tags, and a `<Link to={`/projects/${project.slug}`}>Open case study</Link>`. Mark selected filter with `aria-pressed={activeTag === tag}`. `ProjectsPage` provides `h1` named `Project worlds` and concise template copy. Add `/projects` to `App.jsx`.

- [ ] **Step 4: Run filter test to verify pass**

Run: `npm run test:run -- src/components/ProjectGrid.test.jsx`

Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectGrid.jsx src/components/ProjectGrid.test.jsx src/pages/ProjectsPage.jsx src/App.jsx src/styles/cosmic.css
git commit -m "feat: add filterable project map"
```

### Task 6: Build Project Detail Template and Recovery Behavior

**Files:**
- Create: `src/components/ProjectDetail.jsx`, `src/components/TemplateNotice.jsx`
- Create: `src/pages/ProjectDetailPage.jsx`
- Create: `src/pages/ProjectDetailPage.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `getProjectBySlug(slug)` and `getAdjacentProjects(slug)`.
- Produces: `/projects/:slug` detail template and NotFound fallback.

- [ ] **Step 1: Write failing detail-route tests**

Create `src/pages/ProjectDetailPage.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectDetailPage from './ProjectDetailPage'
import NotFoundPage from './NotFoundPage'

const renderDetail = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </MemoryRouter>,
)

describe('ProjectDetailPage', () => {
  it('renders data-backed project fields and adjacent world navigation', () => {
    renderDetail('/projects/nebula-notes')
    expect(screen.getByRole('heading', { name: 'Nebula Notes' })).toBeInTheDocument()
    expect(screen.getByText('Product design + frontend')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next: Signal Garden' })).toHaveAttribute('href', '/projects/signal-garden')
  })

  it('renders not-found recovery for an unknown project slug', () => {
    renderDetail('/projects/not-a-world')
    expect(screen.getByRole('heading', { name: 'You found empty space' })).toBeInTheDocument()
  })

  it('does not render missing demo or source links', () => {
    renderDetail('/projects/nebula-notes')
    expect(screen.queryByRole('link', { name: 'Visit live site' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'View source code' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/pages/ProjectDetailPage.test.jsx`

Expected: FAIL with module-not-found error for `ProjectDetailPage`.

- [ ] **Step 3: Implement reusable detail template**

`ProjectDetailPage` reads `slug` from `useParams()`, calls `getProjectBySlug(slug)`, and returns `<NotFoundPage />` if no project exists. Otherwise it passes project and adjacent links into `ProjectDetail`.

`ProjectDetail` must render semantic sections named `Challenge`, `Solution`, and `Outcome`; map `stack` to a list; render gallery section only when `gallery.length > 0`; and conditionally render external links:

```jsx
{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Visit live site</a>}
{project.codeUrl && <a href={project.codeUrl} target="_blank" rel="noreferrer">View source code</a>}
```

Render project navigation with link names `Previous: ${previous.title}` and `Next: ${next.title}`. `TemplateNotice` says `Template content. Replace every field in src/data/projects.js.` and appears after case-study content. Add `projects/:slug` route to `App.jsx`.

- [ ] **Step 4: Run detail-route tests to verify pass**

Run: `npm run test:run -- src/pages/ProjectDetailPage.test.jsx`

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectDetail.jsx src/components/TemplateNotice.jsx src/pages/ProjectDetailPage.jsx src/pages/ProjectDetailPage.test.jsx src/App.jsx src/styles/cosmic.css
git commit -m "feat: add project detail templates"
```

### Task 7: Finish Accessible Responsive Template and Handoff Documentation

**Files:**
- Create: `src/styles/cosmic.test.js`
- Modify: `src/App.test.jsx`, `src/styles/base.css`, `src/styles/cosmic.css`, `README.md`

**Interfaces:**
- Consumes: completed routes and components.
- Produces: documented local workflow and verified accessibility/responsive rules.

- [ ] **Step 1: Write failing reduced-motion check**

Create `src/styles/cosmic.test.js`:

```js
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./cosmic.css', import.meta.url), 'utf8')

describe('motion safeguards', () => {
  it('stops decorative orbit animation when reduced motion is requested', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.orbit-planet[\s\S]*animation:\s*none/,
    )
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- src/styles/cosmic.test.js`

Expected: FAIL because reduced-motion styles have not yet set `animation: none` for `.orbit-planet`.

- [ ] **Step 3: Complete quality rules and README**

Ensure `.skip-link` becomes visible on `:focus-visible` and never suppresses the browser focus outline. Inside `@media (prefers-reduced-motion: reduce)`, add `.orbit-planet { animation: none; }`. Add responsive CSS rules at 480px and 768px that collapse nav safely, turn orbit into normal flow, and use one-column project cards. Ensure all interactive selectors have 44px minimum targets.

Replace `README.md` with exact sections: `Run locally` (`npm install`, `npm run dev`), `Run tests` (`npm run test:run`), `Create production build` (`npm run build`), and `Replace template content` (edit `src/data/projects.js`, `src/pages/AboutPage.jsx`, `src/pages/ContactPage.jsx`, and `src/components/SiteShell.jsx`). State that CSS planets are original and no game assets ship with template.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run test:run
npm run build
```

Expected: all tests pass; `dist/` generated without errors.

Manually verify at 375px, 768px, and 1440px:

- Each primary route is reachable through visible navigation.
- Orbit page remains a vertical link list at 375px.
- Tab sequence reaches skip link before navigation and body content.
- System reduced-motion preference removes star, planet, and entrance motion.
- No Nintendo name, character, logo, art, music, or level-design reference remains.

- [ ] **Step 5: Commit**

```bash
git add README.md src/styles/cosmic.test.js src/styles/base.css src/styles/cosmic.css
git commit -m "docs: finish portfolio template handoff"
```
