---
name: Engineering Slide System
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  content-padding: 40px
---

## Brand & Style

The design system is an evolution of a learning platform into a high-performance "Engineering Slide System." It prioritizes information density, technical clarity, and executive-level aesthetic. The brand personality is **Precise, Authoritative, and Utilitarian**, designed for developers and engineers who value efficiency over decoration.

The style is a synthesis of **Linear-inspired precision** (structured grids, subtle borders), **Vercel-style clarity** (exceptional typography, high contrast), and **Raycast-style utility** (focused, keyboard-centric feel). It rejects decorative trends like glassmorphism and gradients in favor of structural integrity and 1px "hairline" strokes that define spatial relationships.

The emotional response should be one of "Deep Work" focus—a high-contrast, distraction-free environment where technical content is the primary protagonist.

## Colors

The palette is anchored in a **Hyper-Dark** shell. Surfaces are built through tiered shades of black rather than shadows to denote depth.

- **The Shell (#050505):** Used for the outer application chrome and sidebar.
- **Content Canvas (#0F0F0F):** A slightly lifted dark grey for the primary slide area, providing a softer contrast for long-form reading than pure black.
- **Accent (#6366f1):** Reserved strictly for active indicators, focus states, and primary call-to-actions. It should be used sparingly to maintain the system's "engineering tool" feel.
- **Structural Borders:** 1px solid lines using #1F1F1F or #27272A are the primary method for separating modules and cards.
- **Semantic States:** Emerald (#10b981) for success/validation and Amber (#f59e0b) for warnings/cautionary notes.

## Typography

Typography is the core of this design system. It uses **Inter** for all UI and prose elements to ensure maximum legibility and a contemporary "editorial doc" feel. 

- **Headlines:** Use `tracking-tighter` (negative letter spacing) to create a tight, professional lockup.
- **Body:** Set to `medium` or `regular` weights with generous line-height (1.6) to prevent eye fatigue during technical reading.
- **Technical Meta:** **JetBrains Mono** is used for all data points, code snippets, metadata badges, and versioning. This creates a clear visual distinction between "narrative" and "technical data."
- **Mobile scaling:** For screens below 768px, `display-lg` should downscale to 32px and `headline-xl` to 24px.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for content slides to ensure consistency in technical diagrams and side-by-side comparisons.

- **The Slide Canvas:** Centered on the screen with a max-width of 1200px. It uses internal padding of 40px to create a "frame" for the content.
- **Comparison Grid:** A 2-column or 3-column split for technical "A/B" comparisons. Gutters are strictly 24px with 1px vertical dividers between cells.
- **Rhythm:** An 8px linear scale governs all padding and margins. Vertical rhythm should be generous between sections (32px+) but tight within component groups (8px).
- **Mobile Reflow:** On mobile devices, the fixed-grid collapses into a single-column stack. Page margins reduce to 16px to maximize horizontal space for code snippets.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Structural Outlines** rather than traditional drop shadows.

1.  **Level 0 (Base):** #050505 (Application Shell).
2.  **Level 1 (Canvas):** #0A0A0A (The slide background).
3.  **Level 2 (Technical Cards):** #0F0F0F or #121212 with a 1px border of #1F1F1F.

**Shadows:** When necessary for temporary overlays (dropdowns, command palettes), use a very tight, 0-opacity-tinted ambient shadow: `0 4px 12px rgba(0,0,0,0.5)`. Surfaces never use "glow" effects; they rely on their 1px border to separate from the background.

## Shapes

The shape language is **Soft yet Structured**. We use a conservative corner radius to maintain the "engineering" feel while avoiding the harshness of a purely sharp system.

- **Small elements (Buttons, Inputs, Badges):** 4px (0.25rem) radius.
- **Technical Cards:** 8px (0.5rem) radius.
- **Large Container/Slides:** 12px (0.75rem) radius.

Internal elements within a card should have a radius 2px smaller than the parent to maintain nested visual harmony.

## Components

- **Technical Cards:** No fill or a very subtle #0F0F0F fill. 1px border (#1F1F1F). Title in `headline-lg` with a Mono badge for metadata in the top-right.
- **Navigation (Ghost Style):** "Anterior" and "Siguiente" buttons use no background fill in their default state. On hover, they gain a subtle #1A1A1A background. Icons are simple 1.5px stroke arrows.
- **Progress Indicators:** Discrete dots or a 2px tall bar at the top of the content canvas. Use Case Purple (#6366f1) for the active segment.
- **Metadata Badges:** JetBrains Mono, 10px uppercase, high contrast (White text on #1A1A1A background). 2px radius.
- **Comparison Modules:** Side-by-side containers with a 1px divider. The "Old/Traditional" side uses a subtle greyed-out text, while the "New/AI" side uses primary text and a subtle Case Purple accent border.
- **Input Fields:** Dark background (#050505), 1px border, Mono font for input text. Active state changes border color to #6366f1 with no outer glow.
- **Checkboxes/Radios:** Square-ish (2px radius) for checkboxes. Use Case Purple for the checked state icon/fill.