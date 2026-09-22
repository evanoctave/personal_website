# Cosmic Portfolio Design

## Purpose

Build an original React portfolio template with playful, cosmic-platformer energy. It showcases placeholder projects through an explorable orbit system and reusable project detail pages. It must not use Nintendo characters, names, logos, art, music, or copied level designs.

## Goals

- Let visitors find project work quickly.
- Make each project feel like a small world without blocking legibility or navigation.
- Keep all content editable in one local data module.
- Work well on desktop, touch devices, keyboards, and reduced-motion settings.

## Scope

Single-page route shell plus these routes:

- `/` home page with hero, project orbit, and quick introduction.
- `/projects` project world map with filter controls.
- `/projects/:slug` reusable detail-page template.
- `/about` biography-template page.
- `/contact` contact-template page.
- `*` original lost-in-space 404 page.

Out of scope: CMS, authenticated areas, live contact-form submission, GitHub integration, real project copy, and licensed game assets.

## Architecture

- Vite builds React application.
- React Router provides page routes and slug-based project detail pages.
- `src/data/projects.js` exports every template project.
- Project list and detail pages consume same project objects, preventing duplicate content.
- Global CSS defines palette, spacing, type scale, motion, and responsive behavior. Page components add local layout styles.

## Visual System

Mood: optimistic deep-space observatory built from soft toy-like materials.

- Drenched indigo-violet background with coral, mint, butter-yellow, and lunar-white accents.
- Original CSS-made planets, rings, particles, and orbital paths. No imported game imagery.
- High-contrast warm light text, shaped display type, practical readable body type.
- Page-load reveals and orbit movement use transform/opacity only.
- `prefers-reduced-motion: reduce` removes orbit, parallax, and entrance animation.

## Components

- `SiteShell`: shared navigation, footer, skip link, starfield.
- `OrbitHero`: introduction and primary links with decorative project orbit.
- `ProjectOrbit`: responsive interactive project selection.
- `ProjectGrid`: project cards and tag filters.
- `ProjectDetail`: cover, metadata, challenge, solution, outcome, gallery placeholders, and project navigation.
- `TemplateNotice`: visible reminder to replace demo content and links.
- `NotFound`: missing-route recovery page.

## Content Model

Each project includes:

```js
{
  slug,
  title,
  eyebrow,
  year,
  role,
  stack,
  tags,
  summary,
  challenge,
  solution,
  outcome,
  orbit,
  cover,
  gallery,
  liveUrl,
  codeUrl
}
```

Initial data contains clear, fictional placeholder projects. `orbit` and `cover` define artwork treatment without needing image files. Optional links and gallery assets remain omitted until user replaces them.

## Error Handling

- Unknown project slug renders `NotFound`.
- Missing `liveUrl`, `codeUrl`, or gallery data hides corresponding controls and shows template guidance where relevant.
- External links open safely with `rel="noreferrer"`.
- Route UI remains usable if animation or decorative CSS does not load.

## Accessibility and Responsive Behavior

- Semantic landmarks, visible focus state, and skip link.
- Keyboard-accessible navigation, project controls, and filters.
- Decorative cosmic elements use `aria-hidden`.
- Cards and controls retain 44px minimum touch target.
- Orbit switches to stacked project controls on narrow screens.
- Content width caps at readable line length.

## Verification

- Automated route tests cover home, projects list, valid project slug, and unknown slug.
- Manual responsive checks cover phone, tablet, and desktop widths.
- Manual keyboard and reduced-motion checks cover nav, project controls, and route transitions.
- Production build must pass before handoff.
