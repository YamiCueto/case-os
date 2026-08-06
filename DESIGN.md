---
name: CASE Engineering Hub
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#0A0A0A'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b90a0'
  outline-variant: '#414755'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4b8eff'
  on-primary-container: '#00285c'
  inverse-primary: '#005bc1'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c1c6d7'
  on-tertiary: '#2a303e'
  tertiary-container: '#8b91a1'
  on-tertiary-container: '#242a37'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#dde2f4'
  tertiary-fixed-dim: '#c1c6d7'
  on-tertiary-fixed: '#151c28'
  on-tertiary-fixed-variant: '#414755'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-lowest: '#0E0E0E'
  border-muted: '#1F1F1F'
  text-on-surface: '#E5E2E1'
  text-muted: '#C1C6D7'
  lang-ts: '#3178C6'
  lang-go: '#00ADD8'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
spacing:
  margin: 16px
  gutter: 12px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
---

## Brand & Style

The CASE Engineering Hub identity is defined by a **Technical Minimalist** aesthetic, merging the utility of a developer IDE with the sophisticated polish of a modern SaaS workspace. It evokes a sense of "digital precision" and "high-performance engineering."

The design style utilizes a **Brutalist-Lite** approach: 
- **High-Contrast Dark Mode:** Deep blacks (`#050505`) and dark grays provide the foundation, ensuring long-form readability and focus.
- **Electric Accents:** A single, vibrant "Digital Blue" (`#007AFF`) is used sparingly for primary actions, indicators, and focus states.
- **Information Density:** High density without clutter, favoring thin borders and monospaced typography to signify technical rigor.
- **Glass & Depth:** Subtle use of backdrop blurs and semi-opaque backgrounds for top-level navigation, providing a sense of layering without excessive decoration.

## Colors

The palette is strictly functional, optimized for a dark-mode-first engineering environment.

- **Primary Blue:** Used exclusively for high-priority CTA buttons, active status indicators (the "glow" effect), and active navigational markers.
- **Neutral Scale:** The background hierarchy moves from absolute black (`#050505`) for the main canvas to a slightly lighter surface container (`#0A0A0A`).
- **Borders:** A consistent "low-energy" gray (`#1F1F1F`) is used for all structural separators, maintaining the grid without distracting the eye.
- **Language Palette:** Functional colors for specific technical contexts (e.g., TypeScript Blue, Go Cyan) are used within list items to aid rapid scanning.

## Typography

Typography establishes a clear hierarchy between "Human" content (Inter) and "Machine" data (JetBrains Mono).

- **Inter** is the workhorse for headlines and body copy, chosen for its clarity in high-density interfaces.
- **JetBrains Mono** is utilized for metadata, tags, keyboard shortcuts (e.g., "Ctrl+K"), and timeline markers to reinforce the technical nature of the hub.
- **Weight Strategy:** Use Medium (500) for interactive elements and Semibold (600) for structural titles. 
- **Scale:** Keep body sizes tight (13px-14px) to maximize information density while maintaining legibility.

## Layout & Spacing

The system uses a **Standardized Sidebar + Main Canvas** layout model.

- **Sidebar:** Fixed width of 256px (w-64), providing persistent navigation.
- **Top Bar:** Fixed height of 48px (h-12) with `backdrop-blur` for a semi-transparent, layered feel.
- **Grid:** A responsive 12-column logic for desktop, though primarily visualized as a 3-column dashboard grid with `1rem` (16px) gaps.
- **Breathing Room:** Large outer margins (`2rem` or 32px) on the main dashboard prevent the high-density cards from feeling claustrophobic.
- **Padding:** Internal card padding is standardized at `1rem` (md).

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Linear Dividers** rather than shadows.

- **Level 0 (Canvas):** `#050505` - The deepest layer.
- **Level 1 (Cards/Sidebar):** `#0A0A0A` or `#0E0E0E` - Slightly lifted surfaces.
- **Dividers:** 1px solid `#1F1F1F` borders act as the primary method of separation.
- **Active Glow:** Interactive "In Progress" states utilize a subtle box-shadow glow using the primary color (`0 0 8px #007AFF`) to draw focus without adding physical height.
- **Overlays:** Header uses a 80% opacity background with a 10px blur to indicate it sits above the scrolling content.

## Shapes

The shape language is strictly **Geometric and Sharp**. 

- **Base Radius:** All primary containers (Cards, Sections) use a `0px` or `2px` (DEFAULT) radius, emphasizing the "engineering tool" aesthetic.
- **Buttons/Inputs:** Use a tight `2px` radius. 
- **Indicators:** Circles are used only for status indicators (Active/Inactive) and user avatars to provide a soft contrast to the otherwise rigid grid.
- **Active State Markers:** Vertical 2px bars on the left of active navigation or list items.

## Components

- **Primary Button:** Solid `#007AFF` background, white text, 2px radius. Height is 32px for standard actions.
- **Ghost/Outline Button:** 1px border `#1F1F1F`, text `#EDEDED`. Hover state uses a subtle `#161616` background.
- **Input Fields:** `#050505` background, 1px `#1F1F1F` border. On focus, the border changes to `#007AFF`. Includes a monospaced "shortcut" label on the right.
- **Cards:** No shadow. 1px `#1F1F1F` border, `#0A0A0A` background. Headers within cards should have a thin bottom border.
- **Activity Lists:** Items use a `hover:bg-[#161616]` and a `hover:border-l-2 hover:border-[#007AFF]` to indicate interactivity.
- **Progress Bars:** Thin 4px tracks. Track background `#1F1F1F`, fill `#007AFF`.
- **Monospace Tags:** Tiny (10px) tags with a background of `#201F1F` and 1px border, used for ID strings (e.g., `0x8f2a1c`).