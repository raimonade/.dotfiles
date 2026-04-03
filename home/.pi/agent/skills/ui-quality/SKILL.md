---
name: ui-quality
description: Enforces UI quality baseline — animation performance, typography, accessibility, layout anti-patterns, and design constraints in Tailwind CSS projects. Use when building UI components, reviewing CSS/animation, styling React views, or auditing motion performance.
---

# UI Quality

Enforces an opinionated UI baseline and animation performance rules to prevent interface slop and janky motion.

## How to use

- `/ui-quality`
  Apply these constraints to any UI work in this conversation.

- `/ui-quality <file>`
  Review the file against all constraints below and output:
  - violations (quote the exact line/snippet)
  - why it matters (1 short sentence)
  - a concrete fix (code-level suggestion)

Do not migrate animation libraries unless explicitly requested. Apply rules within the existing stack.

## Stack

- MUST use Tailwind CSS defaults unless custom values already exist or are explicitly requested
- MUST use `motion/react` (formerly `framer-motion`) when JavaScript animation is required
- SHOULD use `tw-animate-css` for entrance and micro-animations in Tailwind CSS
- MUST use `cn` utility (`clsx` + `tailwind-merge`) for class logic

## Components

- MUST use accessible component primitives for anything with keyboard or focus behavior (`Base UI`, `React Aria`, `Radix`)
- MUST use the project's existing component primitives first
- NEVER mix primitive systems within the same interaction surface
- SHOULD prefer [`Base UI`](https://base-ui.com/react/components) for new primitives if compatible with the stack
- MUST add an `aria-label` to icon-only buttons
- NEVER rebuild keyboard or focus behavior by hand unless explicitly requested

## Interaction

- MUST use an `AlertDialog` for destructive or irreversible actions
- SHOULD use structural skeletons for loading states
- NEVER use `h-screen`, use `h-dvh`
- MUST respect `safe-area-inset` for fixed elements
- MUST show errors next to where the action happens
- NEVER block paste in `input` or `textarea` elements

## Animation

- NEVER add animation unless it is explicitly requested
- MUST animate only compositor props (`transform`, `opacity`)
- NEVER animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- SHOULD avoid animating paint properties (`background`, `color`) except for small, local UI (text, icons)
- SHOULD use `ease-out` on entrance
- NEVER exceed `200ms` for interaction feedback
- MUST pause looping animations when off-screen
- SHOULD respect `prefers-reduced-motion`
- NEVER introduce custom easing curves unless explicitly requested
- SHOULD avoid animating large images or full-screen surfaces

## Animation Performance

### Rendering steps glossary

- composite: transform, opacity
- paint: color, borders, gradients, masks, images, filters
- layout: size, position, flow, grid, flex

### Rule categories by priority

| priority | category | impact |
|----------|----------|--------|
| 1 | never patterns | critical |
| 2 | choose the mechanism | critical |
| 3 | measurement | high |
| 4 | scroll | high |
| 5 | paint | medium-high |
| 6 | layers | medium |
| 7 | blur and filters | medium |
| 8 | view transitions | low |
| 9 | tool boundaries | critical |

### 1. Never patterns (critical)

- Do not interleave layout reads and writes in the same frame
- Do not animate layout continuously on large or meaningful surfaces
- Do not drive animation from scrollTop, scrollY, or scroll events
- No requestAnimationFrame loops without a stop condition
- Do not mix multiple animation systems that each measure or mutate layout

### 2. Choose the mechanism (critical)

- Default to transform and opacity for motion
- Use JS-driven animation only when interaction requires it
- Paint or layout animation is acceptable only on small, isolated surfaces
- One-shot effects are acceptable more often than continuous motion
- Prefer downgrading technique over removing motion entirely

### 3. Measurement (high)

- Measure once, then animate via transform or opacity
- Batch all DOM reads before writes
- Do not read layout repeatedly during an animation
- Prefer FLIP-style transitions for layout-like effects
- Prefer approaches that batch measurement and writes

### 4. Scroll (high)

- Prefer Scroll or View Timelines for scroll-linked motion when available
- Use IntersectionObserver for visibility and pausing
- Do not poll scroll position for animation
- Pause or stop animations when off-screen
- Scroll-linked motion must not trigger continuous layout or paint on large surfaces

### 5. Paint (medium-high)

- Paint-triggering animation is allowed only on small, isolated elements
- Do not animate paint-heavy properties on large containers
- Do not animate CSS variables for transform, opacity, or position
- Do not animate inherited CSS variables
- Scope animated CSS variables locally and avoid inheritance

### 6. Layers (medium)

- Compositor motion requires layer promotion, never assume it
- Use will-change temporarily and surgically
- Avoid many or large promoted layers
- Validate layer behavior with tooling when performance matters

### 7. Blur and filters (medium)

- Keep blur animation small (<=8px)
- Use blur only for short, one-time effects
- Never animate blur continuously
- Never animate blur on large surfaces
- Prefer opacity and translate before blur

### 8. View transitions (low)

- Use view transitions only for navigation-level changes
- Avoid view transitions for interaction-heavy UI
- Avoid view transitions when interruption or cancellation is required
- Treat size changes as potentially layout-triggering

### 9. Tool boundaries (critical)

- Do not migrate or rewrite animation libraries unless explicitly requested
- Apply these rules within the existing animation system
- Never partially migrate APIs or mix styles within the same component

### Common fixes

```css
/* layout thrashing: animate transform instead of width */
/* before */ .panel { transition: width 0.3s; }
/* after */  .panel { transition: transform 0.3s; }

/* scroll-linked: use scroll-timeline instead of JS */
/* before */ window.addEventListener('scroll', () => el.style.opacity = scrollY / 500)
/* after */  .reveal { animation: fade-in linear; animation-timeline: view(); }
```

```js
// measurement: batch reads before writes (FLIP)
// before — layout thrash
el.style.left = el.getBoundingClientRect().left + 10 + 'px';
// after — measure once, animate via transform
const first = el.getBoundingClientRect();
el.classList.add('moved');
const last = el.getBoundingClientRect();
el.style.transform = `translateX(${first.left - last.left}px)`;
requestAnimationFrame(() => { el.style.transition = 'transform 0.3s'; el.style.transform = ''; });
```

## Typography

- MUST use `text-balance` for headings and `text-pretty` for body/paragraphs
- MUST use `tabular-nums` for data
- SHOULD use `truncate` or `line-clamp` for dense UI
- NEVER modify `letter-spacing` (`tracking-*`) unless explicitly requested

## Layout

- MUST use a fixed `z-index` scale (no arbitrary `z-*`)
- SHOULD use `size-*` for square elements instead of `w-*` + `h-*`

## Performance

- NEVER animate large `blur()` or `backdrop-filter` surfaces
- NEVER apply `will-change` outside an active animation
- NEVER use `useEffect` for anything that can be expressed as render logic

## Design

- NEVER use gradients unless explicitly requested
- NEVER use purple or multicolor gradients
- NEVER use glow effects as primary affordances
- SHOULD use Tailwind CSS default shadow scale unless explicitly requested
- MUST give empty states one clear next action
- SHOULD limit accent color usage to one per view
- SHOULD use existing theme or Tailwind CSS color tokens before introducing new ones

## Review guidance

- Enforce critical rules first (never patterns, tool boundaries)
- Choose the least expensive rendering work that matches the intent
- For any non-default choice, state the constraint that justifies it (surface size, duration, or interaction requirement)
- When reviewing, prefer actionable notes and concrete alternatives over theory
