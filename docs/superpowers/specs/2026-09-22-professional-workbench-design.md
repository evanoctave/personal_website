# Professional Workbench Portfolio

## Purpose

Replace playful cosmic/game-coded presentation with a polished creative-developer portfolio. Keep portfolio browsing fast and legible while making the home page memorable through an interactive, editable project workbench.

## Goals

- Present work with a credible studio/editorial visual system.
- Let visitors open projects quickly from home and projects routes.
- Let the owner arrange project tiles and add local photos without a CMS.
- Preserve keyboard access, reduced-motion behavior, and responsive usability.
- Prepare project records for future public GitHub repositories without coupling rendering to GitHub availability.

## Non-goals

- No Mario, Nintendo, space, planet, orbit, or game-level visual references.
- No server-side image upload or cloud media storage.
- No GitHub authentication, private-repository access, or live GitHub sync in this change.
- No CMS or user accounts.

## Visual direction

The register is brand/editorial creative studio. Use an ink/graphite base, warm paper surfaces, one acid-lime action accent, and restrained cobalt detail. Use a sharp grotesk/system sans with deliberate weight contrast. Replace decorative planets and starfields with ruled grids, index labels, material blocks, photo tiles, and a workbench that feels like a studio desk rather than a game scene.

Avoid gradients-as-text, glass cards, ornamental space copy, cartoon planets, identical card grids, and default SaaS dashboard styling. Motion should communicate manipulation, not decoration.

## Routes and content

Keep `/`, `/projects`, `/projects/:slug`, `/about`, `/contact`, and wildcard recovery routes. Home hero becomes a professional introduction plus `ProjectWorkbench`. Projects and detail routes keep data-driven navigation.

Extend each project record with optional fields:

```js
{
  githubUrl: null,
  liveUrl: null,
  featured: true,
  media: []
}
```

Existing `cover` and `gallery` fields remain readable during migration. Optional links and media hide cleanly when absent.

## Interactive workbench

Create `ProjectWorkbench` and `WorkbenchTile` components. Workbench state owns an ordered array of items:

```js
{
  id,
  type: 'project' | 'image' | 'note',
  projectSlug,
  src,
  alt,
  x,
  y,
  width,
  height,
  rotation
}
```

Seed workbench with featured project tiles. An image drop zone accepts local `image/*` files, creates an object URL, and adds an image tile. Revoke object URLs on removal/unmount. Store layout state in `localStorage` under a versioned key; invalid or stale state falls back to seed data.

Use `react-moveable` for draggable, resizable, scalable, and rotatable tile manipulation. Configure bounded movement, minimum dimensions, and ratio-preserving image resize. Apply Moveable transforms to tile elements and keep state synchronized on gesture end. Do not make Moveable the only interaction path.

Keyboard fallback: focused tiles expose Move, Resize, Rotate, and Remove controls. Arrow keys move selected tiles by a fixed increment; modifier keys increase increment. Controls announce selection and current dimensions through visible status text. Touch targets remain at least 44px.

## Responsive and motion behavior

- Desktop: two-column intro/workbench composition with freeform tile canvas.
- Tablet: reduced canvas area with bounded tiles and clear controls.
- Narrow mobile: ordered stack of tiles; editing controls remain available, but freeform coordinates do not create horizontal scrolling.
- `prefers-reduced-motion: reduce` disables transitions, auto-motion, and animated decorative effects. Drag/resize still works as direct manipulation.
- Focus indicators remain visible on all tile controls and links.

## Future GitHub integration seam

Keep a pure normalizer boundary, for example `normalizeGithubRepo(repo)`, in a separate data utility. It maps public API fields into project records but is not called by page rendering yet. Future work can fetch public repositories after the owner changes visibility, merge normalized records with local editorial overrides, and handle rate limits or deleted repositories without changing workbench rendering.

## Error handling

- Bad local image file type: reject with inline status text.
- Broken image URL: show fallback tile label and preserve layout.
- Invalid localStorage payload: ignore and restore seed layout.
- Unknown project slug: existing recovery page.
- Missing GitHub/live/media fields: omit controls and sections.

## Accessibility

- Semantic landmarks and skip link remain.
- Workbench has a labeled region and ordered fallback representation.
- Every tile has an accessible name and focus target.
- Image tiles require editable alt text; local file name is only a temporary fallback.
- No feature depends on hover or pointer-only gestures.

## Verification

- Unit/component tests cover seed layout, selection, keyboard movement, image acceptance/rejection, storage restore/fallback, optional links/media, and unknown routes.
- Production build passes.
- Manual checks cover 375px, 768px, and 1440px; keyboard-only workbench use; reduced motion; image add/remove; and no horizontal overflow on mobile.
