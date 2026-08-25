---
name: meaningful-contribution
description: "Proof gate for non-trivial code changes. Use before declaring an implementation, bug fix, refactor, migration, or PR-ready change complete, and before commit or PR handoff. Requires observed behavior, durable automated proof, counterfactual failure when practical, edge-case accounting, honest types and names, and an evidence report. Skip read-only work and trivial docs or config edits."
---

# Meaningful Contribution

A code change is complete when evidence supports its behavioral claim and its abstractions tell the truth. Generated volume, a plausible diff, and green static checks are not completion evidence.

Apply this gate proportionately to task-owned changes. Repository instructions define the required checks and override this generic floor.

## Proof gate

1. **State the claim.** Name the behavior changed, its expected inputs and outputs, and what happens outside the happy path.
2. **Observe it working.** Exercise the real boundary when the surface permits it: browser, CLI, API, worker, migration, or other runtime seam. Record the path and result. If runtime observation is unavailable, state why and preserve that as residual risk.
3. **Leave durable proof.** Add or update the smallest automated test that fails when the behavior breaks. Confirm the relevant test actually executes. A typecheck, lint, or build complements this proof; it does not replace it.
4. **Establish the counterfactual.** Show that the proof fails without the fix. Prefer an already-recorded red test. Otherwise, when safe, temporarily remove only the task-owned behavior change, run the targeted test, then restore it. If that would risk unrelated work or require disproportionate setup, explain why the counterfactual was not run.
5. **Test edges.** Cover the invalid, empty, boundary, failure, and worst-path cases relevant to the claim. Make each outcome explicit rather than relying on an accidental default.
6. **Audit the model.** Verify names, types, and interfaces describe what they actually contain and accept. Check that the local abstraction agrees with the wider domain model. Rename or remodel contradictions instead of explaining them away with comments.
7. **Report evidence.** Before handoff, list exact automated commands and results, manual/runtime checks, the counterfactual result or reason omitted, and remaining risk.

## Guardrails

- Preserve unrelated dirty files and user changes. Never revert them to manufacture a counterfactual.
- Keep tests semantically strict. Fix code rather than weakening, deleting, or skipping a valid test.
- Match proof cost to change risk. Trivial docs, formatting, or declarative config changes need an appropriate validation, not a synthetic unit test.
- If the behavior cannot be proven within the available environment, report the blocker plainly; do not relabel confidence as evidence.
