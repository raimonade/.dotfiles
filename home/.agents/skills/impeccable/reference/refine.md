# Refine

Improving something that already shipped: a ship-ready polish pass, or a directional move — bolder, quieter, simpler. All of them are refinement, which means the incumbent visual world, content, behavior, and everything outside the named scope survive. Concept wrong rather than execution wrong? Say so and recommend a redesign; do not smuggle one in.

**Scope is literal.** "Everything else stays" means exactly that. Do not restyle neighbors, migrate the page to a new idea, or introduce a color, font, radius, shadow, or primitive the surface does not already own. If the system genuinely cannot express the direction, stop and name the exact addition and the job it would do.

## Establish the system first

Read `DESIGN.md` when present, plus representative tokens, shared components, patterns, and neighboring flows. Without a formal system, the project's coherent conventions are the system.

Classify each drift before fixing it, and fix the cause at the narrowest correct level:

- **Missing token** — the system needs a reusable value.
- **One-off implementation** — a shared component or pattern should replace it.
- **Conceptual mismatch** — the flow, IA, or hierarchy differs from comparable areas of the product.
- **Local defect** — the implementation is simply incomplete.

## Polish: the ship-ready pass

Use the feature yourself at its representative sizes, on the real interaction path, with mouse, keyboard, and touch where applicable. Then triage — functional defects before cosmetic ones, in this order:

1. Broken or blocked tasks, data loss, misleading state, inaccessible paths.
2. Missing loading, empty, error, success, disabled, and permission states.
3. Flow, hierarchy, responsive, and design-system drift.
4. Visual and motion inconsistency.
5. Code and asset cleanup.

Do not perfect one corner while the rest sits below the same bar.

**Flow and hierarchy.** Match neighboring mental models, terminology, disclosure, routing, and save behavior. Make the primary task and the current state obvious without flattening everything to equal weight. Arrival, transition, empty, and recovery paths should connect rather than behave as isolated screens.

**Layout and type.** Align to the project's grid and spacing scale, and fix optical as well as mathematical alignment. Group related content tightly, separate distinct groups generously. Keep same-role typography identical across screens; test measure, wrapping, localization expansion, zoom, and font loading. Verify every supported viewport, not only the one on screen.

**Color, imagery, icons.** Semantic tokens with stable meanings across themes. Verify text, control, and focus contrast in every state. Keep icon family, stroke weight, sizing, and optical alignment coherent. Prevent image layout shift with correct aspect ratios and responsive sources.

**Interaction and state.** Every control carries default, hover, focus, active, disabled, loading, error, and success behavior. Preserve visible keyboard focus, logical tab order, real labels, and platform-appropriate touch targets. Keep motion coherent, interruptible, and performant — never add animation to make the polish visible.

**Content and code.** Keep terminology, capitalization, and factual copy consistent; ask before changing a claim. Remove debug output, dead code, unused imports, obsolete styles, and duplication the pass itself created. Replace custom implementations where the system owns the pattern, and promote genuinely reusable values to tokens — not a system abstraction for one local exception.

Finish with a diff review: no accidental churn, no orphaned code, no temporary artifacts.

## Bolder

Amplification, almost always scoped to one part of a page whose system already exists. The reflex answer — more effects — is the opposite of bold; reject it first.

A section reads flat because it quietly opted out of moves the rest of the page already makes: the display type at full strength, the structural devices that carry meaning, the signature motif, the density and pacing. The most reliable bolder pass brings the target up to the expressive level its neighbors already reach, in the system's own vocabulary.

- **Amplify what the system owns.** The bolder version should look *more* like the same brand, not less.
- **Commit, then clarify.** Make one decisive move completely, then quiet everything around it so the move is legible. If every element got louder, the section got flatter.
- **Give it its own rhythm.** The target should read as a peak in the scroll — a shift in density or pace — not simply more of the same.
- **Keep content true.** Existing claims are in scope: preserve them unless the user supplies replacements.

**The skeleton test.** Strip the copy out and study the bare structure. Does it still say what this section is and why it matters, through hierarchy and the system's devices alone? If it only works once the words return, the boldness is in the font size.

## Quieter

Quiet is harder than loud: subtlety needs precision, and quiet without intent collapses into generic. Think restraint, not absence — the point of view survives the cuts.

For Persuade and Experience, quieter means a more restrained palette, more whitespace, more typographic air; the drama is reduced, not eliminated. For Operate and Read, it means less visual noise — fewer background accents, flatter containers, less color, less motion — so the tool disappears further into the task.

- **Color** — reduce saturation and variety before removing color. Let neutrals carry more, with color as accent. Tinted warm or cool grays add depth without loudness; on a colored surface, derive secondary text from that hue when it improves coherence and contrast.
- **Weight** — step font weights down, and build hierarchy from size, weight, and space rather than color and boldness. Thin or drop borders; increase breathing room.
- **Effects** — remove gradients, glows, stacked shadows, and patterns that serve no purpose. Reduce layering. Soften radius extremes.
- **Motion** — shorter distances, gentler easing, functional feedback only. Remove flourishes rather than slowing them down.
- **Composition** — smaller scale jumps, rogue elements back on the grid, consistent spacing rhythm.

Not everything the same size and weight; not grayscale; not personality-free; not so light that nothing anchors the page.

## Distill

Remove obstacles between the user and their goal — not features. Every element justifies its existence.

Find the essence first: what is the *one* primary goal, what is genuinely necessary, what can be removed, hidden, or combined. Then cut across dimensions:

- **Information architecture** — one primary action, few secondary, everything else tertiary or disclosed. Merge similar controls, delete redundant information, say it once.
- **Visual** — fewer colors, a coherent type family and scale, decoration that serves hierarchy or goes. Flatten nesting and remove containers doing a job that proximity and alignment already do; nested cards stay only when they express a real parent/child relationship.
- **Layout** — prefer linear flow over an elaborate grid, use available space generously, pick one alignment and hold it.
- **Interaction** — fewer choices, smart defaults, inline over modal, one fewer step, one obvious next action.
- **Content** — cut every sentence in half and then do it again. Active voice, plain language, no header restating the intro.
- **Code** — dead CSS, unused components, orphaned files, twelve variants where three cover 90% of use.

Simplicity is not feature removal, mystery, or flattened hierarchy, and it never trades away accessibility. Match the complexity of the interface to the real complexity of the task; oversimplifying a complex domain makes it harder, not easier.

## Verify

Walk the whole path again at every supported size, in both themes, with mouse, keyboard, and touch. Check loading, empty, error, success, disabled, long-content, and missing-content states; zoom, contrast, focus, semantics, and screen-reader names; console errors, layout shift, and interaction latency. Confirm the result still agrees with `DESIGN.md`, neighboring features, and the user's scope — and that after a bolder pass the surface is unmistakably the same brand, only more sure of itself.
