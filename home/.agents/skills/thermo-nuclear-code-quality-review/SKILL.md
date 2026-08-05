---
name: thermo-nuclear-code-quality-review
description: Maximal-rigor maintainability review of a branch diff, judged on structural simplification.
disable-model-invocation: true
---

# Thermo-nuclear code quality review

The hardest maintainability review this codebase gets. Behavior correctness is someone else's job; this review judges the *shape* of the change — abstraction quality, spaghetti growth, file sprawl, boundary leaks.

The unit of value is a **code-judo** move: a restructuring that preserves behavior while deleting whole categories of complexity — branches, helpers, modes, layers — by using the existing architecture more effectively. A review that finds only local cleanups has failed, even when every note is correct. Land on the version that feels inevitable in hindsight.

## Process

1. **Fix the scope.** Diff the branch against its merge base. Done when every changed file is listed with its line delta and its post-change total size, and review stays inside that list.

2. **Run every dimension over every changed file.** The seven dimensions below are the full checklist; each one applies to each file. On a diff above roughly ten files, fan out to subagents — one per file group, each carrying the full dimension list — and merge their findings. Done when each changed file has been judged against all seven dimensions and every finding carries `file:line` plus the concrete restructuring it asks for.

3. **Hunt the code-judo move.** For each non-trivial change, spend real thought on a reframing that makes the diff smaller than the author's version. Done when every non-trivial change has either a named restructuring with the specific concepts it deletes, or one written sentence arguing the current shape is already the simplest available.

4. **Rule on the approval bar.** Done when every bar line below is answered pass or blocked, blockers cite `file:line`, and the verdict is stated outright.

## Dimensions

Each entry pairs what to hunt with what to ask for.

1. **Structural simplification.** Hunt: complexity rearranged rather than removed; refactors that leave the reader holding the same number of concepts. Ask for: deleting a layer of indirection, reframing the state model so conditionals disappear, moving the ownership boundary so the feature becomes a natural extension of something that already exists.

2. **File size.** Hunt: a file crossing 1000 lines because of this PR. Treat the crossing as a strong smell on its own and ask whether decomposition should land first. Ask for: extracted helpers, subcomponents, or focused modules. Waive only when the structural reason is compelling and the resulting file still scans cleanly.

3. **Spaghetti growth.** Hunt: new ad-hoc conditionals, scattered special cases, one-off branches, nullable modes, and "temporary" flags spliced into flows they do not belong to. This is a design problem, not a style nit — flag it even when the code works. Ask for: a dedicated abstraction, helper, state machine, or policy object; or a default flow with fewer exceptions.

4. **Earned abstraction.** Hunt: thin wrappers, identity abstractions, and pass-through helpers that buy indirection instead of clarity; generic "magic" mechanisms hiding a simple data shape. Prefer direct, boring code. Ask for: deleting the wrapper and keeping the direct flow, or deepening the module so the interface is genuinely simpler than the body. Vocabulary for that judgement lives in the `codebase-design` skill.

5. **Type and boundary cleanliness.** Hunt: unnecessary optionality, `unknown`, `any`, cast-heavy code, loosely-shaped ad-hoc objects, and silent fallbacks papering over an unclear invariant. Ask for: an explicit typed model or shared contract that makes the control flow simpler. For TypeScript specifics, load the `coding-standards` skill.

6. **Canonical home.** Hunt: feature logic leaking into shared paths, implementation details leaking through APIs, bespoke helpers duplicating a canonical utility, logic parked in the wrong package or layer. Ask for: reuse of the canonical helper and a move to the module that already owns the concept.

7. **Orchestration and atomicity.** Hunt: independent work serialized for no reason; related updates that can leave state half-applied. Skip micro-optimization; flag orchestration complexity that makes the implementation brittle. Ask for: parallel execution where it also simplifies the flow, and a more atomic structure where partial state would be hard to reason about.

## Approval bar

Approval requires all of:

- no structural regression
- no visible path to a dramatically simpler implementation left untaken
- no unjustified file-size explosion
- no spaghetti growth from special-case branching
- no hacky or magical abstraction that makes the code harder to reason about
- no wrapper, cast, or optionality churn obscuring the real design
- no architecture-boundary leak or canonical-helper duplication
- no missed decomposition that would materially improve maintainability

Each of the following is a presumptive blocker, cleared only by an explicit author justification:

- the PR preserves substantial incidental complexity while a plausible code-judo move would delete it
- the PR pushes a file from below 1000 lines to above 1000 lines
- the PR adds ad-hoc branching that tangles an existing flow
- the PR scatters feature checks across shared code to solve a local problem
- the PR adds an unnecessary abstraction, wrapper, or cast-heavy contract
- the PR duplicates an existing helper or puts logic in the wrong layer when a canonical home exists

Behavior being correct clears none of these. Blocked findings ship with the cleaner decomposition spelled out.

## Output

Order findings by: structural regressions, then missed code-judo moves, then spaghetti and branching growth, then boundary/abstraction/type-contract problems, then file size and decomposition, then modularity, then legibility. Report a handful of high-conviction comments and let the cosmetic notes go; naming nits belong at the bottom or nowhere when the real issue is structural.

Be direct, serious, and demanding. State plainly when a change makes the codebase messier or when a dramatic simplification was missed — this review's whole value is saying that out loud. Calibrate to:

- `this pushes the file past 1k lines. can we decompose this first?`
- `this adds another special-case branch into an already busy flow. can we move it behind its own abstraction?`
- `i think there's a code-judo move here. can we reframe this so these branches disappear?`
- `this refactor moves complexity around without deleting it. can we make the model itself simpler?`
- `why does this need a cast / optional here? can we make the boundary explicit instead?`
