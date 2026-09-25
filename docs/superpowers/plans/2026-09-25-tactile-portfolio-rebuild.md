# Tactile Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Evan Octave's portfolio into accessible monochrome spatial portfolio with real decorative art, personal-media placeholders, and keyboard-operable workbench.

**Architecture:** Keep React Router, project data, and local workbench persistence. Add tiny semantic media and hero units, serve approved artwork from `public/assets`, and use CSS tokenized styling for material depth and responsive layout. Decorative art never carries exclusive content.

**Tech Stack:** Vite, React 19, React Router 7, React Moveable, Vitest, React Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-09-25-tactile-portfolio-rebuild-design.md`

## Global Constraints

- Use Void `#101010`, Hard White `#f7f7f4`, graphite, silver, and mist; do not add accent color.
- Use soft inflated plastic, hard chrome, and powder-coated server material. Do not use purple, blue, neon, glassmorphism, generic SaaS cards, recruiter-bait copy, or decorative accent color.
- Preserve current routes, single-source `src/data/projects.js`, project filters, local workbench persistence, and optional-content handling.
- Hero and terrarium PNGs remain decorative. Native HTML carries all information and actions.
- Keep 44px targets, visible focus, keyboard equivalents, responsive document flow, and `prefers-reduced-motion` fallback.
- Portrait and server-rack images remain labeled replacement placeholders, never fake personal photographs.
- Do not add CMS, dynamic GitHub ingestion, contact backend, WebGL, mandatory drag interaction, or accent scale.

## Review Focus

- Missing generated PNG must leave hero copy and selected-work navigation usable; Task 2 adds source assertions and Task 3 tests semantic CTA remains present.
- Reduced-motion users must see stable, non-moving art and workbench layout; Task 4 pins reduced-motion CSS rules.
- At 480px, project tiles must become normal document-flow controls; Task 4 pins compact CSS and Task 3 retains buttons/links in DOM.
- Keyboard-only users must select, move, resize, and rotate project tiles without Moveable; Task 3 retains control-group tests and Task 4 never hides those controls.
- Missing portrait/server media must show replacement guidance rather than a broken image; Task 1 adds explicit placeholder tests.

---

## File Structure

- `public/assets/hero-orb-server-v1.png`: approved decorative black-stage hero art.
- `public/assets/server-room-terrarium-v1.png`: approved decorative bright workbench art.
- `src/components/PersonalMediaPanel.jsx`: static portrait and server-rack replacement slots with accessible, specific labels.
- `src/components/PersonalMediaPanel.test.jsx`: verifies both replacement paths exist and no `<img>` is rendered without user media.
- `src/components/OrbitHero.jsx`: hero semantic copy, CTA, decorative image, and direct case-study links.
- `src/components/OrbitHero.test.jsx`: verifies CTA, decorative art source, and project links.
- `src/components/ProjectWorkbench.jsx`: decorative terrarium backdrop plus existing selected-tile interaction.
- `src/components/ProjectWorkbench.test.jsx`: verifies workbench interaction and decorative-backdrop source.
- `src/pages/AboutPage.jsx`: profile, education, and `PersonalMediaPanel` composition.
- `src/pages/AboutPage.test.jsx`: verifies profile and education content paths.
- `src/styles/base.css`: monochrome tokens, global type, focus, and reduced-motion baseline.
- `src/styles/studio.css`: shared route, hero, card, detail, and personal-media styling.
- `src/styles/workbench.css`: workbench material styling, responsive fallback, and motion rules.
- `src/styles/cosmic.test.js`: stylesheet contract tests for tokens, compact layout, and motion safeguards.

### Task 1: Add Semantic Personal-Media Placeholders

**Files:**
- Create: `src/components/PersonalMediaPanel.jsx`
- Create: `src/components/PersonalMediaPanel.test.jsx`
- Modify: `src/pages/AboutPage.jsx`
- Create: `src/pages/AboutPage.test.jsx`

**Interfaces:**
- Produces: `<PersonalMediaPanel />`, a section with `aria-label="Personal media placeholders"`.
- Consumes: no props; replacement instructions are static until real media is supplied.

- [ ] **Step 1: Write failing placeholder tests**

```jsx
it('shows exact replacement guidance for portrait and server rack without fake images', () => {
  render(<PersonalMediaPanel />)
  expect(screen.getByRole('region', { name: 'Personal media placeholders' })).toBeInTheDocument()
  expect(screen.getByText('Add portrait of Evan')).toBeInTheDocument()
  expect(screen.getByText('Add photo of in-person server rack')).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
```

```jsx
it('makes profile and education visible on the about route', () => {
  render(<AboutPage />)
  expect(screen.getByRole('heading', { name: 'Built in public, kept personal.' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- src/components/PersonalMediaPanel.test.jsx src/pages/AboutPage.test.jsx`

Expected: FAIL with module-not-found for `PersonalMediaPanel` and missing headings.

- [ ] **Step 3: Implement semantic media panel and About composition**

```jsx
export default function PersonalMediaPanel() {
  return (
    <section aria-label="Personal media placeholders" className="personal-media-panel">
      <article className="media-slot media-slot--portrait">
        <p className="eyebrow">Portrait slot</p>
        <h2>Add portrait of Evan</h2>
        <p>Replace with an in-person photo when ready.</p>
      </article>
      <article className="media-slot media-slot--rack">
        <p className="eyebrow">Hardware slot</p>
        <h2>Add photo of in-person server rack</h2>
        <p>Replace with real equipment photo and descriptive alt text.</p>
      </article>
    </section>
  )
}
```

Compose it below practical biography and an `Education` heading in `AboutPage`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm run test:run -- src/components/PersonalMediaPanel.test.jsx src/pages/AboutPage.test.jsx`

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/PersonalMediaPanel.jsx src/components/PersonalMediaPanel.test.jsx src/pages/AboutPage.jsx src/pages/AboutPage.test.jsx
git commit -m "feat: add personal media placeholders"
```

### Task 2: Add Approved Decorative Artwork

**Files:**
- Create: `public/assets/hero-orb-server-v1.png`
- Create: `public/assets/server-room-terrarium-v1.png`
- Modify: `src/components/OrbitHero.jsx`
- Modify: `src/components/OrbitHero.test.jsx`
- Modify: `src/components/ProjectWorkbench.jsx`
- Modify: `src/components/ProjectWorkbench.test.jsx`

**Interfaces:**
- Produces: decorative `<img aria-hidden="true" alt="" src="/assets/...">` nodes for hero and workbench.
- Consumes: both versioned images under `public/assets/`.

- [ ] **Step 1: Write failing artwork contract tests**

```jsx
expect(document.querySelector('.hero-art img')).toHaveAttribute('src', '/assets/hero-orb-server-v1.png')
expect(document.querySelector('.hero-art img')).toHaveAttribute('alt', '')
expect(document.querySelector('.workbench-backdrop img')).toHaveAttribute('src', '/assets/server-room-terrarium-v1.png')
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- src/components/OrbitHero.test.jsx src/components/ProjectWorkbench.test.jsx`

Expected: FAIL because `.hero-art img` and `.workbench-backdrop img` do not exist.

- [ ] **Step 3: Copy approved assets and render decorative image wrappers**

```jsx
<div aria-hidden="true" className="hero-art">
  <img alt="" src="/assets/hero-orb-server-v1.png" />
</div>
```

```jsx
<div aria-hidden="true" className="workbench-backdrop">
  <img alt="" src="/assets/server-room-terrarium-v1.png" />
</div>
```

Place hero art next to semantic hero copy. Place workbench backdrop under header/dropzone and behind selectable tiles. Do not add image controls or image alt copy.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm run test:run -- src/components/OrbitHero.test.jsx src/components/ProjectWorkbench.test.jsx`

Expected: PASS with existing project-link and keyboard-control assertions still green.

- [ ] **Step 5: Commit**

```bash
git add public/assets/hero-orb-server-v1.png public/assets/server-room-terrarium-v1.png src/components/OrbitHero.jsx src/components/OrbitHero.test.jsx src/components/ProjectWorkbench.jsx src/components/ProjectWorkbench.test.jsx
git commit -m "feat: add tactile portfolio artwork"
```

### Task 3: Rebuild Monochrome Design Tokens and Shared Surfaces

**Files:**
- Modify: `src/styles/base.css`
- Modify: `src/styles/studio.css`
- Modify: `src/styles/cosmic.css`
- Modify: `src/styles/cosmic.test.js`

**Interfaces:**
- Produces: shared Void/Hard White token system and material-style classes consumed by routes and components.
- Consumes: `.hero-art`, `.personal-media-panel`, `.workbench-backdrop`, existing route/component class names.

- [ ] **Step 1: Write failing CSS contract tests**

```js
const styles = [
  'src/styles/base.css',
  'src/styles/studio.css',
  'src/styles/workbench.css',
].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8')).join('\n')

it('uses monochrome design tokens without legacy accent token declarations', () => {
  expect(styles).toMatch(/--void:\s*#101010/)
  expect(styles).toMatch(/--hard-white:\s*#f7f7f4/)
  expect(styles).not.toMatch(/--lime:|--cobalt:|--orange:/)
})

it('keeps workbench tiles in normal flow on compact screens', () => {
  expect(styles).toMatch(/@media \(max-width: 480px\)[\s\S]*\.workbench-tile\s*\{[\s\S]*position:\s*relative/)
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- src/styles/cosmic.test.js`

Expected: FAIL because legacy accent variables remain and Void tokens do not exist.

- [ ] **Step 3: Implement monochrome CSS system**

In `base.css`, replace root tokens with:

```css
:root {
  color-scheme: light;
  --void: #101010;
  --hard-white: #f7f7f4;
  --graphite: #363636;
  --silver: #b8b8b6;
  --mist: #dfdfdb;
  --line: color-mix(in srgb, var(--void), transparent 82%);
  --ease-object: cubic-bezier(.22, 1, .36, 1);
}
```

Update `studio.css` and `workbench.css` to use these tokens, rounded panels, chrome rim shadows, `object-fit: cover` artwork, high-contrast focus, and no text gradients. Keep selector names already used by components. Remove contradictory legacy cosmic rules or reduce `cosmic.css` to motion contracts still needed by tests.

- [ ] **Step 4: Run CSS tests to verify GREEN**

Run: `npm run test:run -- src/styles/cosmic.test.js`

Expected: PASS, including reduced-motion and compact-flow assertions.

- [ ] **Step 5: Commit**

```bash
git add src/styles/base.css src/styles/studio.css src/styles/workbench.css src/styles/cosmic.css src/styles/cosmic.test.js
git commit -m "feat: establish tactile monochrome visual system"
```

### Task 4: Compose Home and Workbench for Direct Exploration

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/components/ProjectWorkbench.jsx`
- Modify: `src/components/ProjectWorkbench.test.jsx`
- Modify: `src/components/WorkbenchTile.jsx`
- Modify: `src/components/ProjectGrid.jsx`
- Modify: `src/components/ProjectGrid.test.jsx`

**Interfaces:**
- Consumes: hero art, backdrop art, existing workbench hook methods, project records, and monochrome classes.
- Produces: direct home-page reading order: hero CTA, workbench, project archive link, and tactile project cards.

- [ ] **Step 1: Write failing interaction tests**

```jsx
it('keeps a direct project archive link after the spatial workbench', () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>)
  expect(screen.getByRole('link', { name: 'Browse all projects' })).toHaveAttribute('href', '/projects')
})

it('keeps project filter state visible through aria-pressed', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><ProjectGrid /></MemoryRouter>)
  const ai = screen.getByRole('button', { name: 'AI' })
  await user.click(ai)
  expect(ai).toHaveAttribute('aria-pressed', 'true')
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- src/components/ProjectWorkbench.test.jsx src/components/ProjectGrid.test.jsx src/pages/HomePage.test.jsx`

Expected: FAIL with module-not-found for `HomePage.test.jsx` and absent `Browse all projects` link.

- [ ] **Step 3: Implement direct exploration composition**

Create `src/pages/HomePage.test.jsx` with the home CTA assertion. Add this link after the workbench:

```jsx
<Link className="text-link" to="/projects">Browse all projects <span aria-hidden="true">→</span></Link>
```

Keep `ProjectWorkbench` control text explicit: `Select a tile to move, resize, or rotate it. Keyboard: arrows move, Shift + arrows resize, Alt + arrows rotate.` Keep the existing buttons as pointer-independent alternative to Moveable. Give project grid cards material image surfaces via existing CSS classes; do not replace card links with click-only card wrappers.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm run test:run -- src/components/ProjectWorkbench.test.jsx src/components/ProjectGrid.test.jsx src/pages/HomePage.test.jsx`

Expected: PASS with project filters, keyboard move, control group, and archive CTA verified.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/HomePage.test.jsx src/components/ProjectWorkbench.jsx src/components/ProjectWorkbench.test.jsx src/components/WorkbenchTile.jsx src/components/ProjectGrid.jsx src/components/ProjectGrid.test.jsx
git commit -m "feat: refine spatial project exploration"
```

### Task 5: Redesign Route Content and Verify Whole Portfolio

**Files:**
- Modify: `src/components/SiteShell.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/pages/ProjectsPage.jsx`
- Modify: `src/pages/ContactPage.jsx`
- Modify: `src/pages/NotFoundPage.jsx`
- Modify: `src/App.test.jsx`
- Modify: `src/pages/ProjectDetailPage.test.jsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: monochrome visual classes, current `projects` helper functions, optional gallery/link data, and route focus behavior.
- Produces: consistent route copy and metadata without breaking unknown-slug recovery or optional-link behavior.

- [ ] **Step 1: Write failing route tests**

```jsx
it('keeps contact route direct and non-placeholder', () => {
  renderAt('/contact')
  expect(screen.getByRole('heading', { name: 'Let’s make something with a pulse.' })).toBeInTheDocument()
  expect(screen.queryByText(/Replace this email/)).not.toBeInTheDocument()
})

it('keeps unknown project recovery interactive', () => {
  renderDetail('/projects/not-a-world')
  expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/')
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- src/App.test.jsx src/pages/ProjectDetailPage.test.jsx`

Expected: FAIL because contact heading remains `Make contact`.

- [ ] **Step 3: Implement copy and structural route pass**

Keep `SiteShell` skip link, primary nav, document title behavior, and footer landmark. Update route intros to concise, personal language. Give project details an explicit text-led case-study hierarchy around decorative cover shape. Keep absent external links/galleries hidden. Update README with exact asset replacement locations and workbench keyboard controls.

- [ ] **Step 4: Run focused route tests to verify GREEN**

Run: `npm run test:run -- src/App.test.jsx src/pages/ProjectDetailPage.test.jsx`

Expected: PASS with route focus/title, 404 recovery, valid detail, unknown slug, and optional-link tests.

- [ ] **Step 5: Run complete verification**

Run: `npm run test:run && npm run build`

Expected: all Vitest files pass and Vite writes `dist/` without errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/SiteShell.jsx src/components/ProjectDetail.jsx src/pages/ProjectsPage.jsx src/pages/ContactPage.jsx src/pages/NotFoundPage.jsx src/App.test.jsx src/pages/ProjectDetailPage.test.jsx README.md
git commit -m "feat: finish tactile portfolio routes"
```

## Plan Self-Review

- **Spec coverage:** Task 1 covers real-photo placeholders and education. Task 2 covers generated art. Task 3 covers monochrome materials, motion, responsive rules. Task 4 covers primary exploration and keyboard workbench. Task 5 covers every remaining route, optional content, full verification, and documentation.
- **Placeholder scan:** No implementation placeholders remain. User-facing photo replacement slots are required product behavior, not deferred implementation.
- **Type consistency:** No new data contracts. `PersonalMediaPanel` has no props. Existing workbench hook method names remain unchanged.
- **Review focus:** All five focus conditions map to explicit tests in Tasks 1 through 4.
