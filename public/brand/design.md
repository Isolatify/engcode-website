# EngCode Design System

> The single source of truth for EngCode's visual language. Everything on
> engcode.vercel.app — and every surface you build for EngCode — follows this
> document. Version: 1.0.0 · November 2026

## 1. Brand idea

EngCode reads like plain English, and the brand should too: warm, calm,
typography-led, one amber accent doing all the emphasis work. Nothing glows,
nothing pulses for attention, nothing is decoration for its own sake.

**One-line voice:** friendly and concrete. Say what it does, then show it.

## 2. Colour

### Brand amber — the only accent

| Token | Hex | Use |
|---|---|---|
| `brand-400` | `#EFAB3E` | Primary accent: buttons, links, highlights, logo mark |
| `brand-500` | `#E39A22` | Hover / pressed state of the accent |
| `brand-700` | `#9E620E` | Accent text on light backgrounds (AA contrast) |
| `brand-300` | `#F3C568` | Accent text on dark backgrounds (AA contrast) |
| `brand-50` | `#FDF6E9` | Soft accent surfaces |
| `brand-100` | `#FBEBCC` | Soft accent surfaces (warm paper) |

### Warm ink neutrals

| Token | Hex | Use |
|---|---|---|
| `ink-50` | `#FAF9F6` | Light page background (warm paper) |
| `ink-100` | `#F3F1EA` | Subtle section background |
| `ink-200` | `#E9E6DC` | — |
| `ink-400` | `#A9A294` | Subtle text on light |
| `ink-700` | `#55504A` | Muted text on light |
| `ink-900` | `#262321` | — |
| `ink-950` | `#141312` | Dark page background, primary text on light |

### Semantic

| Token | Light | Dark |
|---|---|---|
| Success | `#16A34A` on `#E7F5EC` | `#4ADE80` on 12% tint |
| Warning | `#D97706` on `#FCF3E4` | `#FBBF24` on 12% tint |
| Error | `#DC2626` on `#FDECEC` | `#F87171` on 14% tint |
| Info | `#2563EB` on `#EAF0FD` | `#60A5FA` on 14% tint |

**Rules**

- One accent, the whole page. Amber is never swapped for another hue mid-page.
- Never pure black (`#000`) or pure white (`#FFF`) — use `ink-950` / `ink-50`.
- Text contrast: AA minimum (4.5:1) everywhere, AAA (7:1) for body copy.
- Light and dark are designed together, not derived mechanically. Both ship.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Headings | **Plus Jakarta Sans** | Weights 600–800, tracking −0.02em to −0.035em |
| Body | **Inter** | Weights 400–600, line-height 1.55–1.65, max 65ch |
| Code | **JetBrains Mono** | Ligatures off; inline code gets a warm chip |

Scale (fluid, clamps):

| Step | Size |
|---|---|
| Display | `clamp(2.6rem, 6.2vw, 4.5rem)` / lh 1.03 |
| H1 | `clamp(2.1rem, 4.5vw, 3.25rem)` / lh 1.08 |
| H2 | `clamp(1.7rem, 3.2vw, 2.5rem)` / lh 1.15 |
| H3 | `clamp(1.35rem, 2.4vw, 1.85rem)` / lh 1.22 |
| H4 | `1.15rem` |
| Body L | `1.125rem` / lh 1.65 |
| Caption | `0.8125rem` |

Italic/bold emphasis uses the same family — never a different one for accent.

## 4. Layout

- Container: `max-width: 75rem`, `padding-inline: 1.25rem` (2rem ≥ 48rem).
- Section rhythm: `py-20 md:py-28` for landing sections, `py-12/16` for docs.
- Grid: CSS Grid with even gaps; asymmetry comes from content, not tricks.
- Radii: one scale — cards `0.875rem`, code blocks `0.75rem`, buttons full pill.
- Elevation: two shadows only — `--shadow-card` (rest) and `--shadow-lift`
  (hover), tinted to the background hue, never pure black.

## 5. Motion

- Ease: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo family). Never linear.
- Durations: 0.2s (state), 0.45–0.6s (entrance), 7s (ambient glow loop).
- Entrance: fade-up 24px, staggered ~60ms, once per element, whileInView.
- Hover lift: translateY(−2…3px) with the lift shadow. Buttons push down on
  `:active`.
- `prefers-reduced-motion: reduce` collapses every animation to its final state.
- One ambient loop per page, maximum. Nothing loops for decoration's sake.

## 6. Code presentation

- Code surfaces use `--code-bg` (light `#F3F1EA`, dark `#1C1A18`).
- Keyword amber: `#9E620E` light / `#F3C568` dark.
- Strings emerald: `#047857` light / `#4ADE80` dark.
- Numbers sky: `#0369A1` light / `#38BDF8` dark.
- Comments: `--text-subtle`, italic.
- Every code block has a caption bar (file name) and a copy button on hover.

## 7. Logo

Files live in `/brand/` (see the [press kit](https://engcode.vercel.app/brand)):

| File | Use |
|---|---|
| `logo.png` | Primary · light backgrounds |
| `logo-color.png` | Full-colour lockup · dark mode |
| `logo-white.png` | Dark or photographic backgrounds |
| `logo-black.png` | One-colour print |
| `logo-small.png` | Favicon / avatar mark (square, transparent) |

Aspect ratio 4692 × 1785 (≈ 2.63:1). Clear space = the height of the amber
mark on all sides. Never recolour, outline, or add shadows.

## 8. Voice

- Second person, present tense: "You write … EngCode runs …"
- Concrete over clever. If a sentence needs a metaphor to make sense, cut it.
- Error messages (in-product) follow the CLI style: line number, the problem
  in one sentence, then **Try this:** with a fix.

## 9. Implementation notes

The website is the reference implementation:

- Tokens: `website/src/app/globals.css` (Tailwind v4 `@theme` + semantic vars).
- Components: `website/src/components/` — start with `Reveal`, `Magnetic`,
  `KineticText`, `CopyButton`.
- Fonts: `next/font` (self-hosted, `display: swap`) — never a Google `<link>`.
