# Layout and adaptation

Layout turns product priority into reading order, grouping, rhythm, and usable space — across every size the surface ships to. Diagnose the structural problem before moving boxes.

**By mode.** Persuade and Experience may compose asymmetrically, fluidly, or disruptively when the chosen world earns it. Operate and Read treat predictable structure, stable density, and navigable linearity as affordances. Preserve the established world: a layout pass changes structure inside it. Native navigation, insets, and size classes are [platforms.md](platforms.md)'s territory.

## Assess

Inspect representative states and viewports, and answer with rendered or source evidence:

- **Reading order** — the squint test. With detail blurred, can you still identify the primary element, the secondary element, and the major groups, in order?
- **Grouping** — are related items close and distinct groups separated, or are containers compensating for weak proximity?
- **Rhythm** — do tight and generous intervals create a deliberate cadence, or is one spacing value repeated until everything weighs the same?
- **Structure** — does the topology match the content and task? Are repeated cards, columns, or sections genuinely equivalent, or a framework default?
- **Density** — does information per region fit use frequency, decision complexity, and mode?
- **Adaptation** — at narrow, intermediate, wide, zoomed, and localized states, what reorders, collapses, wraps, scrolls, or stays fixed? Do DOM and focus order still agree with the visual order?
- **Extremes** — long content, empty states, overlays, sticky elements, safe areas, and small targets.

## Set the spatial thesis

Before editing, name the primary reading or task path; what belongs together and what must separate; which element leads and which supports; the intended density and spacing rhythm; and how the structure changes across containers, viewports, input modes, and content extremes. Then choose the simplest structural model that expresses those relationships.

## Apply

- Group by meaning: proximity before containers, containers before decoration.
- Create rhythm through deliberate contrast between tight and generous intervals. More space above a heading than below it.
- Use a documented spacing scale rather than one-off values. A 4-unit base gives the useful middle steps an 8-only scale misses.
- Let hierarchy follow product priority, not framework defaults. Use cards when they express a real unit or action; nested cards need a clear parent/child relationship rather than decoration.
- Keep distinct content visually distinct without turning every group into an isolated component.
- Prefer container-aware components when the same component appears in different contexts.
- Use `gap` for sibling rhythm where it expresses the relationship more directly than child margins.
- Use depth only when it clarifies state or hierarchy, and declare elevation once — border *or* shadow, not a 1px border under a wide soft shadow.
- Overlays escape their container: an absolutely positioned dropdown inside an `overflow: hidden` or `auto` ancestor gets clipped. Reach for `<dialog>`, the popover API, `position: fixed`, or a portal.
- Make optical corrections only after looking at the rendered result.

Variation is not a goal. Repetition supports recognition; break it when content or priority changes, not for interest.

## Adapt across sizes

**Responsive behavior is structural** — reorder, collapse, reflow, or reveal based on what stays important. Fluid typography is not a responsive strategy.

- **Mobile-first**, with breakpoints driven by where the content actually breaks rather than by device names. Test the sizes between the two you designed.
- **Desktop → mobile** restructures: multi-column becomes a single flow, sidebars move inline or behind a control, tables become cards or scroll with a pinned key column, hover-only affordances become visible ones.
- **Mobile → desktop** uses the width for real: side-by-side panes, persistent navigation, more visible context — not a phone column centered in a sea of empty space.
- **Detect input, not just width.** `@media (hover: hover) and (pointer: fine)` gates hover-dependent behavior; a large touchscreen exists and a small mouse-driven window exists.
- **Touch targets** stay ≥44 CSS px with real separation, however small their visible marks. Keep the thumb zone in mind for primary actions on phones.
- **Safe areas** — use the `env(safe-area-inset-*)` values with `viewport-fit=cover`; keep controls out from under notches, gesture bars, and rounded corners.
- **Responsive images** — `srcset` and `sizes` for resolution, `<picture>` with art direction when the crop itself must change, intrinsic dimensions always so nothing shifts.
- **Print**, when it matters: linearize, drop chrome and navigation, expand collapsed content, expose link URLs, avoid breaking inside a block.
- **Test on real devices**, not only in devtools. Device emulation misses real touch behavior, scroll physics, keyboard overlays, and performance.

## Verify

The squint test still reveals primary, secondary, and groups in order. The reading and task path is clear at every supported size. Related content groups naturally; unrelated content does not blur together. Spacing reads as intentional rhythm. Density matches use. Long text, empty states, localization, and zoom do not break the structure. No horizontal overflow anywhere. Keyboard, touch, and assistive-technology order agree with the visual order. Answer each with rendered evidence.
