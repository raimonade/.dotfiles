# Color

Color is hierarchy, meaning, and atmosphere. Preserve confirmed brand and semantic commitments; adding color is not a licence to replace a visual world.

**By mode.** Persuade and Experience may let color carry the voice and own whole regions. Operate and Read use color mainly to encode action, selection, status, wayfinding, and reading hierarchy — rarity is what gives an accent its force. On native, [platforms.md](platforms.md) rules: semantic system colors on iOS, Material color roles on Android, because raw hex breaks in dark mode and increased-contrast settings.

## Audit before choosing

Read `DESIGN.md`, tokens, assets, current themes, and representative states, and identify: which colors are confirmed brand commitments; the existing surface, text, action, and semantic roles; where grayscale is hiding hierarchy or state; contrast failures and color-only communication; light/dark and data-visualization requirements. Then confirm the ask is more color rather than a new identity — the latter is [new-work.md](new-work.md).

## Choose a strategy

Name the intended temperature, the dominant relationship, the contrast range, and the dosage before touching a value. Strategies run Restrained (neutrals plus one accent), Committed (one saturated color across 30–60% of the surface), Full palette (3–4 named roles), and Drenched (the surface *is* the color). Operate and Read default to Restrained; Persuade and Experience have permission for the rest when the brief allows.

Build roles, not a bag of swatches: canvas and elevated surfaces; primary and secondary text; action, focus, and selection; borders and separators; success, warning, error, information; data categories or scales.

Use the project's existing color space. For a new web palette, prefer OKLCH — lightness and chroma move predictably there. Take hue from product meaning and the chosen visual world, never from a default category association.

## Apply at system scale

- Let the strongest color own a deliberate region or role instead of scattering small accents.
- Keep the primary action easy to find; do not spend its color on decoration.
- Tint neutrals only when the brand hue genuinely creates cohesion. Neutral gray is a valid choice when it serves the world.
- On a colored surface, derive secondary text from the foreground or surface hue. Flat gray on color is the tell.
- Keep semantic meanings consistent, while respecting platform and domain conventions — red is not universally failure, and green is not universally good.
- In data, encode with lightness, chroma, shape, label, or pattern so hue is never the only code. Reserve saturated colors for the series that matter.
- Compose dark mode explicitly — surface elevation, contrast, and desaturated accents. A mechanical inversion of the light theme is not a dark theme.
- Where a token system exists, define primitives and semantic roles separately; a theme switch remaps roles rather than rewriting components.
- When building an OKLCH ramp, vary lightness and reduce chroma near white and black rather than holding chroma uniform for the math's sake.
- Prefer explicit colors to chains of translucent overlays, which make contrast context-dependent.

## Contrast

| Content | Minimum |
|---|---|
| Body and placeholder text | 4.5:1 |
| Large text (≥24px, or ≥19px bold) | 3:1 |
| Controls, icons, focus indicators | 3:1 |

Verify computed pairs rather than trusting your eyes, in every interactive state, in both themes, over images, and on disabled content. Simulate common color-vision deficiencies. Anything communicated by color also needs text, shape, icon, or position. These are correctness constraints — no brief overrides them.

## Verify

Every color has a stable role or a specific atmospheric purpose. Attention lands on the intended action, content, or state. The palette holds across quiet, dense, interactive, error, and empty states. Light and dark are each composed. Contrast and non-color cues pass everywhere. And the result is recognizably *this* product, not a generic colorful treatment.
