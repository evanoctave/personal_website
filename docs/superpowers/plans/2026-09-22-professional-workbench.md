# Professional Workbench Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace cosmic/game-coded portfolio presentation with a professional creative-studio portfolio and an accessible draggable/resizable image workbench.

**Architecture:** Keep React Router and the single local project-data module. Add a pure workbench state layer for seeded project tiles, local image tiles, keyboard operations, and versioned localStorage persistence. Render each tile through `react-moveable` for pointer/touch manipulation, with native controls and keyboard operations as a complete fallback. Replace cosmic CSS with a graphite/paper editorial system.

**Tech Stack:** Vite, React 19, React Router, Vitest, React Testing Library, `react-moveable` 0.56.0, CSS custom properties, browser File and URL APIs.

**Spec:** `docs/superpowers/specs/2026-09-22-professional-workbench-design.md`

## Global Constraints

- No Mario, Nintendo, space, planet, orbit, or game-level visual references.
- No server-side image upload or cloud media storage.
- No GitHub authentication, private-repository access, or live GitHub sync in this change.
- Keep `/`, `/projects`, `/projects/:slug`, `/about`, `/contact`, and wildcard recovery routes.
- `prefers-reduced-motion: reduce` disables transitions, auto-motion, and animated decorative effects; direct manipulation still works.
- Every interactive tile control and link retains a 44px minimum touch target.
- Invalid or stale workbench storage falls back to deterministic seed data.
- Optional project links and media hide cleanly when absent.
- No feature depends on hover or pointer-only gestures.

## Review Focus

- A malformed or version-mismatched localStorage payload must not crash the home route; it must restore seed layout. Test in Task 1.
- An omitted, invalid, or revoked local image URL must show fallback content and release object URLs without breaking other tiles. Test in Task 3.
- A mobile viewport must show ordered tiles without horizontal overflow while preserving keyboard and button controls. Test in Task 4.
- Reduced-motion users must get no decorative or hover movement while drag/resize remains available. Test in Task 4.
- A project with no `githubUrl`, `liveUrl`, or media must render no dead controls or empty media sections. Test in Task 5.

---

### Task 1: Project Data and Workbench State Contract

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `src/data/projects.js`
- Create: `src/data/workbench.js`
- Modify: `src/data/projects.test.js`
- Create: `src/data/workbench.test.js`

**Interfaces:**
- Consumes: existing `projects` array and project helpers.
- Produces: `WORKBENCH_STORAGE_KEY`, `WORKBENCH_STORAGE_VERSION`, `createSeedWorkbench()`, `readWorkbench(storage)`, `writeWorkbench(storage, items)`, and extended project fields.

- [ ] **Step 1: Install Moveable and write failing contract tests**

Run:

```bash
npm install react-moveable@0.56.0
```

Add tests with hand-derived expectations:

```js
it('seeds only featured projects as deterministic tiles', () => {
  expect(createSeedWorkbench()).toEqual([
    expect.objectContaining({ id: 'project-nebula-notes', type: 'project', projectSlug: 'nebula-notes' }),
    expect.objectContaining({ id: 'project-signal-garden', type: 'project', projectSlug: 'signal-garden' }),
  ])
})

it('rejects malformed and stale storage payloads', () => {
  expect(readWorkbench({ getItem: () => '{"version": 1, "items": []}' })).toEqual(createSeedWorkbench())
  expect(readWorkbench({ getItem: () => '{"version": 2, "items": [{"id":"x"}]}' })).toEqual(createSeedWorkbench())
})

```

Run: `npm run test:run -- src/data/workbench.test.js src/data/projects.test.js`

Expected: FAIL because new exports and fields do not exist.

- [ ] **Step 2: Implement data extensions and pure state helpers**

Add `githubUrl: null`, `media: []`, and explicit `featured` values to every project. Mark Nebula Notes and Signal Garden `featured: true`; mark Comet Care `featured: false` so seed workbench expectations remain deterministic. Keep existing `liveUrl`, `codeUrl`, `cover`, and `gallery` fields.

Implement storage helpers with exact contract:

```js
export const WORKBENCH_STORAGE_KEY = 'orbitfolio-workbench-v1'
export const WORKBENCH_STORAGE_VERSION = 1

export const createSeedWorkbench = () => projects
  .filter((project) => project.featured)
  .map((project, index) => ({
    id: `project-${project.slug}`,
    type: 'project',
    projectSlug: project.slug,
    x: index * 28,
    y: index * 20,
    width: 280,
    height: 220,
    rotation: index === 1 ? -3 : index === 2 ? 4 : 0,
  }))

export const readWorkbench = (storage) => {
  try {
    const parsed = JSON.parse(storage.getItem(WORKBENCH_STORAGE_KEY) || '')
    if (parsed.version !== WORKBENCH_STORAGE_VERSION || !Array.isArray(parsed.items)) return createSeedWorkbench()
    if (!parsed.items.every((item) => item && typeof item.id === 'string' && typeof item.x === 'number')) return createSeedWorkbench()
    return parsed.items
  } catch {
    return createSeedWorkbench()
  }
}

export const writeWorkbench = (storage, items) => {
  storage.setItem(WORKBENCH_STORAGE_KEY, JSON.stringify({ version: WORKBENCH_STORAGE_VERSION, items }))
}
```

- [ ] **Step 3: Run contract tests**

Run: `npm run test:run -- src/data/workbench.test.js src/data/projects.test.js`

Expected: PASS, including deterministic seed generation and malformed-storage fallback.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/data/projects.js src/data/projects.test.js src/data/workbench.js src/data/workbench.test.js
git commit -m "feat: add workbench data contracts"
```

### Task 2: Workbench Tiles and Moveable Manipulation

**Files:**
- Create: `src/components/WorkbenchTile.jsx`
- Create: `src/components/ProjectWorkbench.jsx`
- Create: `src/components/ProjectWorkbench.test.jsx`
- Create: `src/styles/workbench.css`

**Interfaces:**
- Consumes: workbench item shape and `projects` lookup from Task 1.
- Produces: `<ProjectWorkbench />`, which renders a labeled workbench region, selectable tile buttons, and Moveable-backed drag/resize/scale/rotate updates.

- [ ] **Step 1: Write failing component tests**

Test real rendered behavior, not Moveable internals:

```jsx
it('renders featured project tiles with accessible names', () => {
  render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)
  expect(screen.getByRole('region', { name: 'Project workbench' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Select Nebula Notes tile' })).toBeInTheDocument()
})

it('selects a tile and exposes keyboard movement controls', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><ProjectWorkbench /></MemoryRouter>)
  const select = screen.getByRole('button', { name: 'Select Nebula Notes tile' })
  await user.click(select)
  expect(screen.getByRole('group', { name: 'Nebula Notes tile controls' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Move Nebula Notes left' })).toBeInTheDocument()
})
```

Run: `npm run test:run -- src/components/ProjectWorkbench.test.jsx`

Expected: FAIL because workbench components do not exist.

- [ ] **Step 2: Implement tile and Moveable integration**

`WorkbenchTile` renders a `<article>` with project title, summary, a link to `/projects/:slug`, and a 44px select button. `ProjectWorkbench` keeps `items` and `selectedId` state, maps project tiles, and gives Moveable a `target` ref. Configure:

```jsx
<Moveable
  target={targetRef.current}
  container={workbenchRef.current}
  draggable
  resizable
  scalable
  rotatable
  keepRatio
  bounds={{ left: 0, top: 0, right: workbenchSize.width, bottom: workbenchSize.height, position: 'css' }}
  onDragEnd={({ lastEvent }) => updatePosition(lastEvent)}
  onResizeEnd={({ lastEvent }) => updateSize(lastEvent)}
  onRotateEnd={({ lastEvent }) => updateRotation(lastEvent)}
/>
```

Use a callback ref for the selected tile and rerender Moveable when `selectedId` changes, so `target` is never permanently null. Use CSS transforms for tile position/rotation and width/height for resize. Clamp the final state against measured workbench bounds as a second line of defense. Keep a selected tile visible in the DOM when Moveable is unavailable. Do not render game motifs or animated orbit effects.

- [ ] **Step 3: Run component tests and build**

Run:

```bash
npm run test:run -- src/components/ProjectWorkbench.test.jsx
npm run build
```

Expected: PASS and production build succeeds with `react-moveable` bundled.

- [ ] **Step 4: Commit**

```bash
git add src/components/WorkbenchTile.jsx src/components/ProjectWorkbench.jsx src/components/ProjectWorkbench.test.jsx src/styles/workbench.css
git commit -m "feat: add interactive project workbench"
```

### Task 3: Local Image Tiles, Keyboard Fallback, and Persistence

**Files:**
- Create: `src/hooks/useWorkbenchState.js`
- Create: `src/hooks/useWorkbenchState.test.js`
- Modify: `src/components/ProjectWorkbench.jsx`
- Modify: `src/components/WorkbenchTile.jsx`
- Modify: `src/components/ProjectWorkbench.test.jsx`

**Interfaces:**
- Consumes: Task 1 storage helpers and Task 2 tile callbacks.
- Produces: `useWorkbenchState()` with `{ items, selectedId, selectItem, moveItem, resizeItem, rotateItem, addImage, removeItem, status }`.

- [ ] **Step 1: Write failing hook/component tests**

Cover local image acceptance/rejection, object URL cleanup, persistence, keyboard controls, and storage fallback:

```js
it('adds accepted image files and rejects non-images', () => {
  const { result } = renderHook(() => useWorkbenchState({ storage: memoryStorage() }))
  act(() => result.current.addImage(new File(['x'], 'portrait.jpg', { type: 'image/jpeg' })))
  expect(result.current.items.at(-1)).toMatchObject({ type: 'image', alt: 'portrait.jpg' })
  act(() => result.current.addImage(new File(['x'], 'notes.txt', { type: 'text/plain' })))
  expect(result.current.status).toBe('Choose an image file.')
})

it('moves selected tile with keyboard increment and persists it', () => {
  const storage = memoryStorage()
  const { result } = renderHook(() => useWorkbenchState({ storage }))
  const before = result.current.items[0].x
  act(() => result.current.moveItem(result.current.items[0].id, 'right', false))
  expect(result.current.items[0].x).toBe(before + 8)
  expect(JSON.parse(storage.getItem(WORKBENCH_STORAGE_KEY)).items[0].x).toBe(before + 8)
})
```

Run: `npm run test:run -- src/hooks/useWorkbenchState.test.js src/components/ProjectWorkbench.test.jsx`

Expected: FAIL because hook behavior and image drop controls do not exist.

- [ ] **Step 2: Implement state hook and image flow**

Initialize from `readWorkbench(window.localStorage)` only in the browser. `addImage` accepts `file.type.startsWith('image/')`, calls `URL.createObjectURL(file)`, stores `src`, and reports rejection otherwise. Track generated URLs in a ref; revoke on item removal and hook cleanup. Debounce or effect-persist valid `items` with `writeWorkbench`.

Add a labeled drop zone and hidden file input. Support `onDragOver`, `onDrop`, and click-to-browse. Add visible status text with `role="status"` for rejection and success. Render image tiles with `object-fit: cover`, editable alt text, and a remove button.

Add keyboard operations. Tile `onKeyDown` maps Arrow keys to `moveItem`, `Shift+Arrow` to `resizeItem`, and `Alt+Arrow` to `rotateItem`; controls remain available for users who do not use key chords. Clamp dimensions to 160–720px and positions to the workbench bounds.

- [ ] **Step 3: Run hook/component tests**

Run: `npm run test:run -- src/hooks/useWorkbenchState.test.js src/components/ProjectWorkbench.test.jsx`

Expected: PASS with image acceptance, rejection, cleanup, persistence, fallback, and keyboard movement covered.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useWorkbenchState.js src/hooks/useWorkbenchState.test.js src/components/ProjectWorkbench.jsx src/components/WorkbenchTile.jsx src/components/ProjectWorkbench.test.jsx
git commit -m "feat: add local image editing and workbench persistence"
```

### Task 4: Professional Visual Redesign and Route Integration

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/ProjectsPage.jsx`, `src/pages/AboutPage.jsx`, `src/pages/ContactPage.jsx`, `src/pages/NotFoundPage.jsx`
- Modify: `src/components/SiteShell.jsx`
- Delete: `src/components/OrbitHero.jsx`, `src/components/OrbitHero.test.jsx`
- Delete: `src/styles/cosmic.css`, `src/styles/cosmic.test.js`
- Create: `src/styles/studio.css`, `src/styles/studio.test.js`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: Task 2 `ProjectWorkbench` and Task 1 project fields.
- Produces: professional studio visual system across every route; no cosmic/game copy or selectors.

- [ ] **Step 1: Write failing visual contract and route-copy tests**

Add tests that render the real routes and assert:

```jsx
it('renders professional workbench home language', () => {
  renderAt('/')
  expect(screen.getByRole('heading', { name: 'Designing useful things for curious people' })).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Project workbench' })).toBeInTheDocument()
  expect(screen.queryByText(/escape velocity|orbit|planet/i)).not.toBeInTheDocument()
})
```

Add `studio.test.js` source checks for required graphite/paper tokens, mobile stack media query, and reduced-motion transition removal.

Run: `npm run test:run -- src/App.test.jsx src/styles/studio.test.js`

Expected: FAIL because existing copy and cosmic selectors remain.

- [ ] **Step 2: Replace shell/page composition and copy**

Update `main.jsx` to import `studio.css`. Update `SiteShell` wordmark, navigation labels, footer, and status copy. Home renders a professional hero and `ProjectWorkbench`, with a secondary project index link. Pages use concise editable copy, no cosmic metaphors, and retain route landmarks and recovery behavior.

- [ ] **Step 3: Implement studio CSS**

Define OKLCH tokens such as `--ink`, `--ink-soft`, `--paper`, `--paper-deep`, `--lime`, `--cobalt`, `--line`, and `--muted`. Use full borders, ruled dividers, asymmetrical grid spacing, visible focus rings, and no gradients-as-text or glass panels. Style workbench tiles as varied paper/photo modules rather than identical cards. At 768px collapse the composition; at 480px turn workbench into normal-flow stack. Add:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Run route/style tests and full build**

Run:

```bash
npm run test:run
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A src/main.jsx src/pages src/components/SiteShell.jsx src/components/OrbitHero.jsx src/components/OrbitHero.test.jsx src/styles/cosmic.css src/styles/cosmic.test.js src/styles/studio.css src/styles/studio.test.js src/App.test.jsx
git commit -m "feat: redesign portfolio as professional studio site"
```

### Task 5: GitHub Seam, Optional Content, Documentation, and Handoff

**Files:**
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/data/projects.js`, `src/data/workbench.js`
- Modify: `src/pages/ProjectDetailPage.test.jsx`, `src/data/workbench.test.js`
- Modify: `README.md`
- Create: `src/data/github.js`, `src/data/github.test.js`

**Interfaces:**
- Consumes: Task 1 normalized project shape and Task 4 route composition.
- Produces: optional GitHub links/media handling and documented future public-repo workflow without network coupling.

- [ ] **Step 1: Write failing optional-content and GitHub tests**

Add tests:

```js
it('normalizes missing GitHub metadata to null instead of throwing', () => {
  expect(normalizeGithubRepo({ name: 'untitled' })).toBeNull()
})
```

Render a detail project with `githubUrl: null`, `liveUrl: null`, `media: []`, and omitted gallery. Assert no dead links, gallery heading, or empty media wrapper appears. Render one populated project and assert GitHub link has `target="_blank"` and `rel="noreferrer"`.

Run: `npm run test:run -- src/data/github.test.js src/pages/ProjectDetailPage.test.jsx`

Expected: FAIL because GitHub utility and optional media rendering do not exist.

- [ ] **Step 2: Implement pure GitHub adapter and detail rendering**

Move or re-export `normalizeGithubRepo` from `src/data/github.js`; keep it pure and network-free. Add `ProjectDetail` rendering for `githubUrl` with safe external-link attributes. Render `media` only when non-empty, with alt text and fallback labels for missing `src`. Keep absent fields hidden.

- [ ] **Step 3: Document public-repo workflow and local workbench controls**

README must document:

- `npm install`, `npm run dev`, `npm run test:run`, and `npm run build`.
- Edit `src/data/projects.js` for editorial project records.
- Change a GitHub repository to public before future ingestion; current build does not call GitHub APIs.
- Drop local images into workbench, edit alt text, drag/resize/rotate, remove, and reset storage by clearing `orbitfolio-workbench-v1`.
- `react-moveable` is used for direct manipulation; keyboard controls remain available.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run test:run
npm run build
git diff --check
```

Expected: all tests pass, build succeeds, and diff check is clean. Manually check 375px, 768px, and 1440px, keyboard-only tile controls, reduced motion, image add/remove, localStorage fallback, and no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add src README.md
git commit -m "docs: document workbench and GitHub integration seam"
```
