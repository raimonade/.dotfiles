# Typography

Type carries information, hierarchy, and voice. Improve it inside the established world; replacing the identity is [new-work.md](new-work.md)'s job, not a typography pass.

**By mode.** Persuade and Experience may let display type carry the voice, with decisive contrast and responsive scale. Operate and Read want stability, scanability, and measure — one well-tuned family on a fixed role scale is often exactly right. On native, [platforms.md](platforms.md) governs: system text styles, Dynamic Type, and the Material type scale replace hand-picked sizes.

## Assess

Answer each with a file, selector, or computed value — not an impression:

- **Authority and fit** — which faces, weights, and roles are established? Do they suit the product and its world, or are they unexamined defaults? Is every family earning its load?
- **Hierarchy** — can heading, body, label, metadata, and data roles be told apart at a glance? Are adjacent sizes or weights too close to do different jobs?
- **Scale** — a deliberate role scale, or a pile of arbitrary values? Do repeated roles stay identical across screens and states?
- **Reading** — does prose sit in a comfortable measure? Are line height, paragraph rhythm, contrast, and tracking tuned to *this* face, width, and language?
- **Stress** — what happens with long headings, localization expansion, 200% zoom, narrow containers, a missing weight, and the fallback face?
- **Delivery** — are only used assets loaded? Do fallback metrics and loading strategy avoid invisible text and disruptive reflow?

## Set the system

Before editing, state the roles the interface needs, the intended contrast between them, the reading measure and density, which faces are authoritative, and any performance, localization, or accessibility constraint. Use the fewest roles and families that make the hierarchy unmistakable, and name tokens for purpose rather than value.

## Apply

- Body copy stays readable and zoomable: 16px / 1rem is the ordinary web floor, departed from only for a dense role or a platform convention.
- Prose measure 45–75ch — 65–75 for long reading. Tune line height inversely with measure; wider lines need more leading.
- Combine size, weight, space, and tone deliberately. Size alone doing all the work is why hierarchies read flat.
- Display type: max around 6rem, tracking floor -0.04em (and -0.02 to -0.03em usually reads better), balanced headings, obvious scale *and* weight steps.
- Light text on dark surfaces needs compensating on all three axes: slightly more line height, a touch more tracking, one more weight step when the face wants it.
- Keep repeated roles identical across screens and states.
- Use the face's real features where the content benefits: tabular numerals in data, small caps, true italics, proper fractions, code ligatures where they help.
- Paragraph spacing *or* first-line indent as the rhythm — both together double-mark the boundary.
- Load only the assets and weights in use, with metric-compatible fallbacks and no blocking text.
- Let marketing display type respond to available space; keep dense product and reading surfaces spatially predictable, on a fixed rem scale rather than fluid clamps.
- Preserve browser zoom, user font settings, and platform text scaling. Never suppress them.

A second family needs a role only it can perform. Type that becomes decorative at the cost of comprehension has failed, whatever the brief.

## Verify

Primary, secondary, body, and metadata roles are recognizable without reading the copy. Long text stays comfortable across widths and languages. The typography belongs to *this* product. Loading creates no reflow or invisible text. Zoom, text scaling, focus, and contrast paths remain usable. Run the real copy at every breakpoint and fix what overflows — with rendered evidence, not a "yes".
