---
name: Evan Octave Portfolio
description: Interactive black-and-white portfolio, built like a tactile orbital playroom.
colors:
  void: "#101010"
  hard-white: "#f7f7f4"
  graphite: "#363636"
  silver: "#b8b8b6"
  mist: "#dfdfdb"
typography:
  display:
    fontFamily: "Arial Narrow, Helvetica Neue, ui-sans-serif, sans-serif"
    fontSize: "clamp(3.6rem, 8vw, 7.8rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Arial, Helvetica, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  orb: "999px"
  control: "14px"
  panel: "28px"
spacing:
  control: "12px"
  panel: "24px"
  section: "clamp(4rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.void}"
    textColor: "{colors.hard-white}"
    rounded: "{rounded.orb}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.graphite}"
---

# Design System: Evan Octave Portfolio

## 1. Overview

**Creative North Star: "Moonbase Bedroom / Orbital Toybox / Server-room Terrarium"**

This portfolio feels like an explorable private room in orbit: part personal moonbase, part oversized toybox, part miniature server habitat. Visitors find hard black and hard white surfaces interrupted by soft inflated plastic, hard chrome, and shiny three-dimensional objects. Interaction gives bored fingers somewhere to go while project evidence stays easy to find.

Portfolio confidence comes from proof, not recruiter-bait. Motion and spatial play support reading; no visitor must drag, hover, or decode a scene to reach projects, education, contact, or images.

**Key Characteristics:**

- Physical, spherical, reflective forms.
- Strong monochrome contrast.
- One memorable spatial interaction per section.
- Playful and self-assured, never corporate.
- Keyboard and reduced-motion paths match mouse paths.

## 2. Colors

Hard black and hard white carry interface hierarchy. Grays create chrome and depth; future accents remain deliberately undefined for Evan to design.

### Primary

- **Void** (#101010): Primary dark field, type on light surfaces, and dense object cores.
- **Hard White** (#f7f7f4): Primary light field, type on dark surfaces, and high-contrast object faces.

### Neutral

- **Graphite** (#363636): Secondary type, recessed chrome, and hover states.
- **Silver** (#b8b8b6): Chrome gradients, object edges, and quiet borders.
- **Mist** (#dfdfdb): Soft plastic planes and low-emphasis surfaces.

### Named Rules

**Black-or-White First Rule.** Establish hierarchy with Void and Hard White before introducing accent color. Accent color must have a named semantic job, never decoration-only use.

## 3. Typography

**Display Font:** Arial Narrow, Helvetica Neue, ui-sans-serif, sans-serif
**Body Font:** Arial, Helvetica, ui-sans-serif, sans-serif

**Character:** Display type stays compact, blunt, and poster-like. Body copy stays practical, open, and within 65ch so visual play never damages reading.

### Hierarchy

- **Display** (900, `clamp(3.6rem, 8vw, 7.8rem)`, 0.88): Hero and route headlines.
- **Headline** (900, `clamp(2.5rem, 5vw, 5rem)`, 0.9): Section-level statements.
- **Title** (800, `1.65rem`, 1): Project and object names.
- **Body** (400, `1rem`, 1.6): Explanatory copy, max 65ch.
- **Label** (800, `0.72rem`, 0.12em): Short control labels only, uppercase permitted.

## 4. Elevation

Depth comes from light direction, chrome reflections, and scale, not frosted glass. Soft plastic uses broad diffuse shadows. Chrome uses tight highlights and dark contact shadows. Panels sit flat until interaction gives them lift.

### Shadow Vocabulary

- **Soft Float** (`0 20px 45px rgb(16 16 16 / 0.18)`): Inflated objects and image tiles.
- **Hard Contact** (`10px 10px 0 #101010`): Deliberate stamped-paper moments, used rarely.
- **Chrome Rim** (`inset 1px 1px 0 rgb(255 255 255 / 0.7), inset -2px -2px 5px rgb(16 16 16 / 0.25)`): Reflective controls and metal objects.

## 5. Components

### Buttons

- **Shape:** Pill for primary action (`999px`), rounded control for spatial tools (`14px`).
- **Primary:** Void fill, Hard White label, `12px 20px` padding.
- **Hover / Focus:** Small transform lift or inset depth shift; 3px high-contrast focus outline remains visible.
- **Secondary:** Hard White surface, Void border and text.

### Chips

- **Style:** Low-profile rounded controls with explicit pressed state.
- **State:** Selected chip inverts Void and Hard White; unselected chip remains outlined.

### Cards / Containers

- **Corner Style:** Panels use `28px`; spherical objects use `999px`.
- **Background:** Hard White or Void, never decorative translucency.
- **Shadow Strategy:** Use Soft Float for plastic, Chrome Rim for hardware.
- **Internal Padding:** `24px` minimum.

### Navigation

- **Style:** Compact wordmark plus clear text links. Active state uses contrast and underline, not color alone.
- **Mobile:** Wrap links without collapsing access behind hover-only controls.

### Spatial Workbench

Project cards, Evan photo placeholders, and server-rack placeholders sit as movable, keyboard-operable objects. Objects must retain a stable non-spatial mobile layout below 480px.

## 6. Do's and Don'ts

### Do:

- **Do** use Void (`#101010`) and Hard White (`#f7f7f4`) for first-pass hierarchy.
- **Do** make spherical, inflated-plastic, and chrome objects feel physically lit.
- **Do** give each interactive object a keyboard path, visible focus state, and 44px control targets.
- **Do** preserve still, readable layouts under `prefers-reduced-motion`.
- **Do** add photo placeholders for Evan and in-person server rack with useful alt-text prompts.

### Don't:

- **Don't** use generic recruiter-bait, sterile SaaS layouts, conventional professional headshots, flat card grids, or passive scrolling.
- **Don't** use frantic interaction that obscures reading or blocks project access.
- **Don't** use side-stripe borders, gradient text, or decorative glassmorphism.
- **Don't** use color as sole state indicator.
- **Don't** add unplanned accent colors until Evan supplies their meaning and scale.
