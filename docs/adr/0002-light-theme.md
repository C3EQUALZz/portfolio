# Light theme: token-driven, data-theme attribute, manual toggle with system default

The landing ships dark-only. We add a light theme that keeps the Nocturne identity
(cold violet-tinted palette) instead of inverting it. All decisions below came out
of a design interview; this ADR is the contract for the implementation.

## Decisions

- **Theme selection: system default + manual toggle.** On first visit the theme
  follows `prefers-color-scheme`; a header toggle (sun/moon icon button, Phosphor
  icons already vendored) lets the user override. The explicit choice is persisted
  in `localStorage` and wins over the system preference. If the user has never
  toggled, a live `matchMedia` change updates the theme on the fly.
- **Switch mechanism: `data-theme` attribute on `<html>`.** An inline script in
  `src/index.html` `<head>` (~5 lines, must run synchronously before first paint)
  resolves stored choice → system preference and sets `data-theme="dark"|"light"`.
  CSS therefore contains exactly one override block, `:root[data-theme="light"]`;
  no duplicated media-query/attribute logic, no `light-dark()` hybrid.
- **Palette: hand-tuned semantic tokens, scales stay fixed.** The light theme
  redefines the semantic tokens (`--color-bg`, `--color-surface`, `--color-text`,
  `--color-divider`, `--color-accent`) using the existing neutral ramp: background
  `neutral-100` (#f3f5fe, cold off-white), surfaces pure white, text `neutral-900`.
  The accent is darkened for WCAG AA contrast on white. The 100–900 ramps are NOT
  flipped per theme — "900 = dark" stays true.
- **Shadows: soft real shadows with a faint accent tint.** Dark-theme ring shadows
  (`0 0 0 1px ...`) would render as harsh dark outlines on a light background.
  Light theme uses blurred drop shadows tinted with the dark end of the accent
  ramp (e.g. `rgb(43 39 65 / 8%)`); `shadow-sm` becomes a 1px light-gray border.
- **New semantic tokens for scale-step usages.** The audit found two recurring
  patterns that break: "accent text" (`accent-300` as text color — nearly invisible
  on white) and "accent tint surface" (`accent-900`/`accent-800` as badge/chip
  background and border — dark blobs on light). New tokens, defined in both theme
  blocks:
  - `--color-accent-text` — dark: `accent-300` → light: `accent-600/700`
  - `--color-accent-surface` — dark: `accent-900` → light: `accent-100/200`
  - `--color-accent-border` — dark: `accent-800` → light: `accent-300`
  - `--color-chip-bg`, `--color-chip-border` — for the hero tech-ring chips
    (fixes the raw `#fff` alpha overlay in `tech-chip.css`)
  - `--icon-invert` — `1` dark / `0` light, drives `filter: invert()` for the
    serde icon instead of a hardcoded `invert(1)`
- **Full component migration (~12 CSS files).** Every direct reference to
  `accent-300/800/900` in component styles moves to the new tokens. The dark-theme
  values equal the current ones, so the migration is a zero-regression mechanical
  rename; afterwards components are fully theme-blind and a third theme is one
  block in `styles.css`.
- **Placement: `src/app/layout/`.** `theme.service.ts` (signal, `toggle()`,
  persistence, system-change subscription) and the toggle button component live
  next to the header — the only consumer. No `features/theme/` with four layers:
  there is no domain logic here.
- **Transition: targeted, not global.** `background`/`color` transitions only on
  `body`, `.header`, and card surfaces; everything else switches instantly.
  Global `transition` on all elements is rejected (breaks hover and reveal
  animations). `color-scheme` is set per theme so browser chrome (scrollbars,
  form controls) matches.
- **Browser chrome:** two `<meta name="theme-color">` tags with
  `media="(prefers-color-scheme: ...)"` — `#161826` and `#f3f5fe`.
- **Testing: unit + e2e + automated contrast.** Unit tests for the theme service
  (toggle, persistence, stored-over-system priority). Playwright e2e: toggle
  changes `data-theme`, choice survives reload, plus axe-core contrast checks of
  both themes. No screenshot baselines — visual fine-tuning (exact light accent
  value, glow opacity) is done by eye in DevTools after implementation.

## Considered Options

- **System-only (`prefers-color-scheme`, no toggle)** — rejected: no user control.
- **Media query + attribute dual CSS logic** — rejected: light palette duplicated
  in two places, guaranteed to drift.
- **Mechanical ramp inversion** — rejected: looks like an inversion, not a light
  theme; accent drops to ~3:1 contrast on white, ring shadows turn to dirt.
- **Different accent hue for light theme** — rejected: breaks brand identity.
- **Flat light design, borders only, no shadows** — rejected: loses the depth the
  dark theme has (hero card, dialogs).
- **Three-way switcher (system/light/dark)** — rejected: UI complexity for no
  real need on a landing; "no stored choice" already means "follow system".
- **Full-blown `features/theme/` feature folder** — rejected: over-engineering for
  chrome-only logic with no domain.
- **Screenshot visual regression tests** — rejected: brittle baselines for a page
  the owner reviews by eye on every change anyway.

## Consequences

- `styles.css` remains the single source of truth for the look; the light theme is
  exactly one `:root[data-theme="light"]` block there.
- Components must never reference scale steps (`accent-N00`, `neutral-N00`) or raw
  hex directly after the migration — only semantic tokens. This extends the
  existing rule "sections use the tokens, never raw hex".
- Adding a third theme = one more attribute block in `styles.css`; components,
  the service, and the toggle need no changes (the toggle may need a cycle
  strategy, out of scope now).
- The inline bootstrap script in `index.html` must stay tiny and synchronous;
  any CSP introduced later must allow it.
