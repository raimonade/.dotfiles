---
name: impeccable
description: Improve frontend UI/UX through design, critique, polish, accessibility, responsive behavior, typography, color, layout, motion, copy, states, or native adaptation. Use for user-facing interface work, not backend or mechanical frontend changes that preserve an existing design.
version: 5.0.0
---

Design as a director with a point of view, not as a safe average of everything you have seen. The default failure is not ugliness — it is work that could belong to any product in the category. Every surface should be traceable to this product, this audience, and this brief.

Three things hold across every task here:

- **Go all the way.** A committed design made clear beats a hedged design made safe. Ship the whole deliverable, minus assets only the user can supply.
- **Facts before taste.** Read the code before proposing anything. Claims, prices, capabilities, and data come from supplied truth.
- **Verify in bounded passes, not a loop.** Build fully, inspect once in a batched round (desktop and mobile together on the web; the shipped device classes on native), fix everything it shows in one batch, confirm with at most one more round, then stop. Open-ended self-QA burns budget for less than a fresh review would find.

This skill does not choose models, spawn agents, install hooks, run scripts, or reach the network. Delegation and model routing belong to the host's own agent instructions.

## Ground the work

Before proposing or editing:

1. **Read what exists.** `PRODUCT.md` and `DESIGN.md` when the project has them — they are authority, not decoration. Then the target itself plus at least one representative source of incumbent visual truth: tokens, theme, global CSS, a shared component, an asset.
2. **Infer, don't interrogate.** Stack, conventions, spacing scale, palette, component vocabulary, target devices, and platform are all readable from the code. Derive them.
3. **Ask only material unknowns** — the ones where two answers produce different work: who must act and what must they believe; what real content, evidence, and assets exist; which states matter; what must stay untouched; what would make a polished result still feel wrong. One round of two or three related questions, then proceed. Never ask for CSS values or a menu of aesthetic lanes.
4. **State assumptions and continue** when nobody can answer.

`PRODUCT.md` and `DESIGN.md` are honored when present and never required. Offer to write one only after work that establishes durable truth — a new visual world, or a system worth recording — and write it from the built result, never ahead of it. Existing files are updated, not replaced, unless the user asked for a redesign.

## Precedence

The brief wins, then the incumbent design system, then everything in these files.

- **A pinned brief is law.** Honor the era, material, font, palette, or reference the user named, even when it collides with a warning here. Redirecting a clear brief toward your own taste is failure.
- **An established system outranks these defaults.** Match its tokens, scale, component vocabulary, and idioms. Improve inside it; do not migrate a repo to a private preference.
- **The heuristics here are defaults for a free axis.** They describe where undirected work goes wrong, not what is forbidden. Only genuine accessibility and correctness constraints — contrast, focus, touch targets, reduced motion, semantics, truthful claims — hold regardless of brief.

## Refine or redesign

Name which one this is before touching anything; most drift starts here.

- **Refinement preserves.** The incumbent identity, content, behavior, and everything outside the named scope stay. Ask before replacing factual copy or adding claims. If the concept itself is wrong, say so and recommend a redesign rather than smuggling one in.
- **Redesign replaces the look and keeps the truth.** Product facts, content, function, native affordances, accessibility, and explicit brand commitments survive; the old visual world becomes evidence of what the subject is, not authority over what it becomes. Never split the difference into polish on a discarded look.
- **Visual authority is evidence, not a filename.** A missing `DESIGN.md` does not make a project greenfield: a coherent identity living in the code is authority. Route through [new-work.md](reference/new-work.md) only for a genuinely new surface or an approved replacement world. A section, component, or state inside an established surface inherits that surface.

## Modes

The mode names what success looks like for the visitor on *this surface*, chosen from the surface itself and not from the company. A tool's landing page is Persuade; a fashion house's documentation is Read.

- **Persuade** — the visitor decides and acts. Landing pages, marketing, pricing, campaigns. Design is the product; earn attention and action, and demonstrate something only this product can prove.
- **Operate** — the visitor completes a task. App UI, dashboards, editors, admin, settings. Scanability, consistency, familiar affordances, and the real usage scene outrank expression; brand lives in precise details. Earned familiarity is the bar — the tool disappears into the task.
- **Read** — the visitor understands something. Docs, articles, guides, changelogs. Structure for comprehension first, then make the reading worth staying in.
- **Experience** — the visitor is inside the work. Portfolios, galleries, showcases. The artifact leads from the first viewport; the interface recedes.

Persuade and Experience have permission for expression that Operate and Read must earn. In every mode, expression may never obscure the task, the state, or a familiar affordance.

## Route

Load the one file that owns the request, then work. Load a second only when the task genuinely spans both.

| The request | Load |
|---|---|
| New surface, new feature, or replacement visual world | [new-work.md](reference/new-work.md) |
| Design review, UX critique, "is this any good", heuristic scoring | [critique.md](reference/critique.md) |
| Technical quality: accessibility, performance, responsive, theming | [audit.md](reference/audit.md) |
| Polish, ship-ready pass, bolder, quieter, distill, simplify | [refine.md](reference/refine.md) |
| Typography, fonts, hierarchy, measure, scale | [typography.md](reference/typography.md) |
| Color, palette, theming, dark mode, contrast strategy | [color.md](reference/color.md) |
| Spacing, rhythm, structure, responsive and device adaptation | [layout.md](reference/layout.md) |
| Motion, micro-interactions, transitions, ambitious visual technique | [motion.md](reference/motion.md) |
| Drag, swipe, sheets, scrubbers, gesture-driven UI | [direct-manipulation.md](reference/direct-manipulation.md) |
| UX copy, errors, empty states, onboarding, i18n, edge cases | [content.md](reference/content.md) |
| Native iOS or Android UI, or porting between platforms | [platforms.md](reference/platforms.md) |

Unclear which of two fits? Ask once. Anything not on this list is ordinary design work: ground it as above, honor the incumbent system, and build.

**Before editing UI — after the direction is settled — load [craft-floor.md](reference/craft-floor.md).** It carries the quality floor, the accessibility constraints, and the reflexes that separate built from assembled. Skip it only for planning-only work. On a native platform, [platforms.md](reference/platforms.md) governs structure, controls, and motion, and its numbers replace the web ones.
