# Craft floor

Load this after the direction is settled, and build without announcing the checklist. A pinned brief or the committed visual world overrides anything here; your own habit does not. The exceptions that no brief overrides are the accessibility constraints — contrast, focus, touch targets, reduced motion, semantics — and truthful content.

## Verify

Each of these is a check on the built result, not an intention. Run them together in the batched inspection rounds, not as separate screenshot trips; the checks share one render.

- **Contrast:** body and placeholder text ≥4.5:1, large text ≥3:1. On colored surfaces, derive secondary text from the surface hue or foreground when that improves coherence while preserving contrast.
- **Depth:** shadows carry an offset and a soft blur. A zero-offset colored halo is decoration.
- **Spacing:** tight groups, generous separation, more space above a heading than below it. Read the computed values.
- **Type:** start body measure near 65–75ch and keep tracking legible; adapt display scale to the surface, content, and viewport. Run the real copy at every breakpoint and fix what overflows.
- **Motion:** when motion carries identity, concentrate it in one earned moment rather than scattering identical entrances across sections. Static work is valid. Prefer natural deceleration from an already-visible default. Prefer interruptible transitions for interactive state; use `@starting-style` when it removes enter-animation scaffolding. Reach past transform and opacity when blur, backdrop-filter, clip-path, mask, or shadow stays smooth. Under `prefers-reduced-motion`, remove travel and preserve the state change through an immediate or low-motion equivalent.
- **Input:** gate hover motion with `@media (hover: hover) and (pointer: fine)`. Keyboard-triggered actions respond immediately. Anchored popovers transform from their trigger; centered modals remain centered. Interactive targets meet the platform minimum—44 CSS px on the web, or the native platform's larger requirement. Gesture-driven UI answers to [direct-manipulation.md](direct-manipulation.md).
- **States:** hover, disabled, loading, error, empty. Plus real content, working controls, responsive composition, keyboard focus.
- **Browser surfaces:** the parts you did not draw still carry the design. Text selection, the caret, custom scrollbars, focus rings, underline offset, and the numerals in tabular data all ship with browser defaults that belong to no design system. Theme them from the palette. This is the cheapest signal that a page was built rather than assembled, and the one models skip most reliably.
- **Copy:** the product's own language. Controls name their action; errors name the problem and the recovery.
- **Coverage:** every brief requirement present and findable within seconds.

## Challenge the defaults

These patterns commonly signal an undirected design. The brief, incumbent system, content, or platform can still earn them; require a concrete reason rather than applying a universal ban.

Page scaffolds:

- Same-size cards of icon plus heading plus text used as the whole page structure. Prefer grouping and hierarchy first; nested cards require a real parent/child relationship.
- The hero-metric template—big number, small label, supporting stats, accent—when the metric is not genuinely the page's primary decision.
- A kicker or eyebrow that repeats what the heading already communicates. Keep it only when it supplies distinct context, taxonomy, or wayfinding.
- Section numbers (01 / 02 / 03) unless the sequence itself carries information the reader needs.
- A modal for a task that needs neither interruption nor protected focus.

Surface habits:

- Gradient text. Emphasis comes from weight or size.
- Glass and blur as decoration rather than as a specific effect.
- A colored `border-left` or `border-right` above 1px on cards, list items, callouts, or alerts.
- Hard offset shadows (`box-shadow: 4px 4px 0`) outside a world that is actually neobrutalist. The zero-blur block shadow is a costume, not a depth system; a world that did not choose it never earns it as a default.
- Sparklines, progress rings, and soft-shadowed rounded rectangles standing in for content.
- Monospace as a costume for "technical" rather than for code, data, or measurement.
- A system display face used without intention on an expressive own-world page. A platform face remains appropriate for native familiarity, utility surfaces, constrained delivery, or an established system.
- Unicode glyphs or emoji standing in for an icon system. Icons are drawn, from a real library or authored SVG, in one consistent stroke and weight.
- Light or dark picked by category. Pick it from the use scene: who, where, under what ambient light.

- Extreme negative tracking must remain legible in the actual face and size; -0.02 to -0.03em is a useful starting range, not a universal limit.
- Declare elevation coherently. Avoid stacking a border and wide shadow by habit; radius and pill use follow the chosen component language and control semantics.
- Illustration must match the chosen world's craft level. Do not add sketch texture, doodle vocabulary, or synthetic grain merely to signal creativity; crisp vectors, diagrams, animated linework, and shader-driven effects remain first-class media.
- Backgrounds are surfaces, textured only from the subject's world. `repeating-linear-gradient` stripes and two-axis grid overlays need an actual canvas, map, blueprint, or measuring tool under them.
- Claims and configuration come from supplied truth; label illustrative values honestly. Naming a concept and then ironizing it is not a claim.

The floor holds the mechanics; it never picks the direction. With every check green, spend the page on the committed world, and when torn between refined and committed, commit.
