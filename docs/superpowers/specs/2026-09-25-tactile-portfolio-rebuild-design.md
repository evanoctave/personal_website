# Tactile Portfolio Rebuild Design

## Purpose

Rebuild Evan Octave's portfolio as a black-and-white, 3D spatial site for Instagram visitors and recruiters. It should quickly prove project work and technical range while inviting lightweight keyboard and mouse exploration.

## Success Criteria

- Projects, education, contact, Evan photo placeholder, and server-rack photo placeholder remain easy to find.
- Home page combines a Void-black hero with bright terrarium workbench section.
- Soft inflated plastic, chrome, and powder-coated server material establish a distinct physical language.
- All core links work without motion, pointer hover, or dragging.
- Spatial controls retain keyboard equivalents and reduced-motion fallback.

## Scope

- Redesign shared shell, home, projects, project detail, about, and contact surfaces.
- Replace coral, mint, yellow palette with Void, Hard White, graphite, silver, and mist.
- Add generated hero and terrarium art, served from project assets.
- Add clear photo placeholders and content paths for Evan portrait and in-person server rack.
- Preserve existing project data, routes, filters, local workbench persistence, accessibility semantics, and test coverage.

Out of scope: CMS, uploaded portfolio media, dynamic GitHub ingestion, a contact submission backend, WebGL, mandatory drag interactions, and an accent color system.

## Visual Direction

North star: **Moonbase Bedroom / Orbital Toybox / Server-room Terrarium**.

Top fold uses near-black field, compact high-contrast type, one inflated white orb, one chrome orb, and a black server rack. Second fold flips to a bright workbench/terrarium field with object-like project tiles. The generated mock provides composition and material reference only. Semantic text, buttons, navigation, links, filters, and state feedback stay native HTML and CSS.

No purple, blue, neon, glassmorphism, generic SaaS cards, recruiter-bait copy, or decorative accent color.

## Architecture

- `src/styles/base.css` becomes canonical monochrome token source.
- `src/styles/studio.css` becomes shared dimensional shell, hero, page, and project styling.
- `src/styles/workbench.css` owns drag workspace and compact layout fallback.
- `src/components/OrbitHero.jsx` gains semantic hero artwork and direct project path.
- `src/components/ProjectWorkbench.jsx` remains interactive but gains real, optional image placeholders and native control affordances.
- `src/pages/AboutPage.jsx` carries profile and education placeholder content.
- Generated raster art lives in `public/assets/`; CSS and semantic markup provide accessible composition around it.

## Interaction and Accessibility

- Decorative rasters and physical shapes use `aria-hidden`.
- Project navigation, filters, controls, and photo-placeholder actions remain keyboard reachable and visibly focused.
- Arrow-key, modifier-key, and button controls continue to move, resize, and rotate workbench items.
- Under `prefers-reduced-motion`, object movement, hover lift, and entry animation stop; content layout remains unchanged.
- Mobile uses a stable document flow for workbench tiles below 480px.

## Content Rules

- Evan portrait and server-rack media initially use labeled placeholders, never fake personal photos.
- Project records remain `src/data/projects.js` single source of truth.
- Absence of a project link, gallery, or optional image hides its related control or section.
- Generated hero art remains decorative and cannot be only carrier of portfolio information.

## Error Handling

- Unknown project route still renders recovery page.
- Missing or failed decorative raster leaves readable text and working CTA intact.
- Missing user-provided portrait or server-rack image renders specific replacement prompt, not broken image.

## Verification

- Add tests for photo placeholder labels, revised copy, and current keyboard workbench behavior.
- Run complete Vitest suite and production build.
- Inspect desktop, tablet, and mobile screenshots.
- Test keyboard navigation and reduced-motion rendering.
