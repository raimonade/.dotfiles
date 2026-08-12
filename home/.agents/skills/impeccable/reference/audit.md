# Technical audit

Measurable, verifiable implementation quality: accessibility, performance, responsive behavior, theming. A code-level pass, not a design critique — that is [critique.md](critique.md).

Audit reports. When the user asked for the fixes too, report first, then fix in priority order; the optimization section below carries the fixes for the performance dimension. On native, the platform conventions in [platforms.md](platforms.md) are the standard being audited against, and its numbers replace the web ones.

## Dimensions

Score each 0–4: 0 broken, 1 major gaps, 2 partial, 3 good with minor gaps, 4 excellent. Total out of 20 — 18+ excellent, 14–17 good, 10–13 acceptable, 6–9 poor, below that critical.

### Accessibility

- **Contrast** — body and placeholder text ≥4.5:1, large text ≥3:1, controls / icons / focus indicators ≥3:1. Check every state, both themes, text over images, and disabled content.
- **Semantics** — heading hierarchy, landmarks, lists as lists, `button` rather than a clickable `div`, form controls with real labels.
- **Keyboard** — visible focus everywhere, logical tab order, no traps, every mouse path reachable, focus managed on overlay open and close.
- **ARIA** — roles, names, and states on custom controls; live regions for async status. Native semantics before ARIA.
- **Motion** — `prefers-reduced-motion` needs an *intentional* alternative that preserves the state change. A blanket `animation: none !important` or `0.01ms` kill is a failure, not compliance. Flag anything flashing above threshold or motion that blocks reading or focus.
- **Alt text** — informative images describe their information; decorative images take empty `alt`.
- **Forms** — persistent labels, requirements stated before submission, errors announced and tied to their field.

### Performance

- Layout thrashing: reading and writing layout properties in the same loop.
- Expensive animation: layout-driving properties animated casually, unbounded blur / filter / shadow, effects that visibly drop frames.
- `will-change` applied broadly or left on at rest — it is a targeted hint, not a baseline.
- Images without dimensions, lazy loading, modern formats, or responsive sources.
- Bundle weight: unnecessary imports, unused dependencies, heavy libraries used for one function.
- Render waste: unnecessary re-renders, missing memoization on genuinely hot paths, work on the main thread that belongs in a worker.

### Responsive

- Fixed widths that overflow narrow viewports; horizontal scroll at any supported size.
- Touch targets below 44 CSS px (48 dp on Android), or adjacent targets without separation.
- Layouts that break at 200% zoom or with the user's larger text setting.
- Missing intermediate breakpoints — a design that works at 375 and 1440 and nowhere between.
- Safe-area insets ignored on notched and gesture-bar devices.

### Theming

- Hard-coded colors, spacing, radii, and shadows where the project has tokens.
- Dark mode missing, mechanically inverted, or failing contrast in its own right.
- Wrong token tier used: a primitive where a semantic role belongs.
- Values that do not update on theme change.

### Implementation integrity

Repeated shortcuts, design-system drift, decorative or misleading content, and structure interchangeable with an unrelated product. Score 0 for systemic drift through 4 for coherent and intentional. Keep this separate from the visual judgment in [critique.md](critique.md) and cite file-level evidence.

## Optimizing what the audit found

**Loading.** Serve modern image formats at the right dimensions with `width`/`height` set and `loading="lazy"` below the fold; preload the LCP asset and the fonts it needs, and never lazy-load the LCP image. Subset and self-host fonts with `font-display: swap` and metric-compatible fallbacks. Split routes, defer non-critical JS, and drop dependencies whose job is a few lines.

**Rendering.** Batch reads before writes. Use `content-visibility` for long offscreen sections and virtualize lists past a few hundred rows. Confine expensive filters to isolated, sized regions. Memoize only measured hot paths — reflexive memoization costs more than it saves.

**Animation.** Prefer compositor-friendly properties; reach past them only when the effect stays smooth on the target device, measured rather than assumed. Apply `will-change` for the duration of a known animation and remove it after. Pause offscreen loops.

**Core Web Vitals.** LCP under 2.5s — find the actual LCP element before optimizing anything. INP under 200ms — break long tasks, yield to the main thread, keep event handlers thin. CLS under 0.1 — reserve space for images, ads, embeds, and late-loading fonts; never insert content above what the user is reading.

Measure before and after on a real mid-range device or a throttled profile, and report both numbers. An optimization without a measurement is a guess.

## Report

1. **Score table** — the five dimensions, each with its most critical finding, and the total.
2. **Executive summary** — issue counts by severity, top three to five issues, recommended next steps.
3. **Findings by severity** — for each: **[P0–P3]** name, location (file and line), category, user impact, the standard it violates when applicable, and the fix.
4. **Systemic patterns** — recurring problems that indicate a gap rather than a mistake ("hard-coded colors in 15+ components", "touch targets under 44px throughout mobile").
5. **Positive findings** — what is working and should be replicated.

**P0** blocks task completion, fix immediately. **P1** is significant difficulty or a WCAG AA violation, fix before release. **P2** is an annoyance with a workaround. **P3** is polish. Too many P3s is noise; be thorough about what matters. Never report an issue without its user impact, and verify each finding in context rather than trusting a pattern match.
