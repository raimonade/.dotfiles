# Critique

A design review: what works, what fails, and what to do about it. Critique reports; it does not edit. If the user wants the fixes applied, finish the report first, then route to [refine.md](refine.md).

Inspect the real thing — the rendered surface at its real sizes, on the actual interaction path, with real content — not only the source. Judge against the product's own goals and the visitor mode, never against a generic ideal.

## 1. Specificity verdict

Lead with this, because it is the finding most reviews miss.

Does the result feel authored for this product, or is it category-interchangeable? Name the evidence: structural sameness, choices that could belong to any competitor, an identity that evaporates when the logo is removed, missed opportunities for product character. Then say which parts *are* specific and why they work.

A surface can score well on every heuristic and still fail here. Both verdicts ship.

## 2. Heuristic scoring

Score each of Nielsen's ten heuristics 0–4. Be honest: 4 means genuinely excellent, and most real interfaces land 20–32 of 40.

| # | Heuristic | What a low score looks like |
|---|---|---|
| 1 | Visibility of system status | The user cannot tell what happened, what is loading, or where they are |
| 2 | Match with the real world | Internal jargon, invented metaphors, ordering that follows the database |
| 3 | User control and freedom | No undo, no exit, destructive actions without recovery |
| 4 | Consistency and standards | The same action looks or behaves differently in two places |
| 5 | Error prevention | Easy to make an irreversible mistake; constraints not expressed in the UI |
| 6 | Recognition over recall | The user must remember values or state from a previous screen |
| 7 | Flexibility and efficiency | No shortcuts, no defaults, no path for the practiced user |
| 8 | Aesthetic and minimalist design | Everything at equal weight; nothing recedes |
| 9 | Error recovery | Messages name a code, not the problem or the way out |
| 10 | Help and documentation | Help absent where it is needed, or only available as a wall of text |

Present as a table with a one-line key issue per row and a total. Heuristics 7 and 10 — or any other that genuinely cannot apply to the surface — may be scored `n/a` with a one-line reason on a Persuade or Experience surface; renormalize the maximum (`24/32`, not `24/40`) and read the band as a percentage.

**Bands:** 90%+ excellent, minor polish only · 70%+ good, address weak areas · 50%+ acceptable, significant work needed · 30%+ poor, major overhaul · below that, redesign.

## 3. Cognitive load

Extraneous load — effort caused by the design rather than the task — is pure waste; eliminate it. Intrinsic load (the task's own complexity) gets structured, not removed. Germane load (learning the system) is the good kind; support it with consistency and progressive disclosure.

Check eight items, and count failures: 0–1 is low load, 2–3 moderate, 4+ critical.

- **Single focus** — the primary task completes without competing elements.
- **Chunking** — information arrives in groups of roughly four or fewer.
- **Grouping** — related items are visually together, by proximity before decoration.
- **Hierarchy** — what matters most is immediately obvious.
- **One thing at a time** — a single decision resolves before the next appears.
- **Minimal choices** — roughly four visible options at any decision point.
- **Working memory** — nothing must be carried from a previous screen to act here.
- **Progressive disclosure** — complexity appears only when needed.

Working memory is limited. At each decision point, count the options a user must compare and look for evidence of hesitation, misclicks, or abandonment. Prefer one clear primary action and a small set of meaningful alternatives; group or disclose the rest when the task does not require simultaneous comparison. Treat numeric thresholds as heuristics to test, not universal limits.

The recurring violations worth naming by name: the wall of options; the memory bridge (step 1's data needed at step 3); hidden navigation with no sense of place; the jargon barrier; the visual noise floor where every element weighs the same; the inconsistent pattern; the multi-task demand; the context switch that scatters one decision across screens.

## 4. Personas

Pick the smallest set that exposes this surface's real failure modes, walk the primary action as each, and report what specifically broke—named elements and interactions, never a generic profile.

- **Alex, the impatient power user.** Uses it daily, keyboard-first, skims. Breaks on: no shortcuts, no bulk actions, unskippable onboarding, a primary action buried in clicks, confirmations for reversible things.
- **Jordan, the confused first-timer.** No product vocabulary, no patience for a manual. Breaks on: icon-only navigation, jargon, unlabeled state, error text naming a code, no visible way to get help.
- **Sam, the accessibility-dependent user.** Screen reader, keyboard, high zoom, or all three. Breaks on: missing labels and landmarks, invisible focus, illogical tab order, color as the only signal, contrast failures, motion without a reduced path.
- **Riley, the deliberate stress tester.** Long strings, empty data, double submits, back button mid-flow, offline. Breaks on: layouts that only fit ideal content, states that were never designed, silent failures, lost work.
- **Casey, the distracted mobile user.** One thumb, bad light, interrupted mid-task. Breaks on: small targets, hover-dependent affordances, horizontal overflow, state lost on return, forms that fight the keyboard.

By surface: landing pages want Jordan, Riley, Casey; dashboards and analytics want Alex and Sam; checkout wants Casey, Riley, Jordan; onboarding wants Jordan and Casey; forms want Jordan, Sam, Casey. When `PRODUCT.md` describes a real audience, derive one more persona from it rather than inventing details.

## 5. Report

Structure the report as a design director would, in the chat response itself:

1. **Specificity verdict** — the lead.
2. **Design health score** — the heuristics table and band.
3. **Overall impression** — what works, what does not, the single biggest opportunity.
4. **What's working** — the strongest evidence-backed successes, with why they work.
5. **Priority issues** — the three to five most impactful problems, each tagged P0–P3, with *what*, *why it matters to users*, and a concrete *fix*.
6. **Persona red flags** — specific breakages per selected persona.
7. **Minor observations** and **questions to consider** — smaller notes, and the provocative questions that might unlock a better solution.

**Severity:** **P0** blocking — prevents task completion, fix now. **P1** major — significant difficulty or a WCAG AA violation, fix before release. **P2** minor — annoyance with a workaround. **P3** polish — no real user impact. If unsure between two, ask whether a user would contact support; if yes, at least P1.

Be direct and specific: "the submit button", not "some elements". Say what is wrong *and* why it matters. Give concrete fixes and cut "consider exploring". Prioritize ruthlessly — if everything is important, nothing is. Do not soften criticism, and do not skip the positive findings.
