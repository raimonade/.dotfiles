---
name: clean
description: "Polish the current task's diff without changing behavior: remove dead code and debug residue, reduce unnecessary complexity and duplication, and match local style. Use when the user says clean, tidy, or simplify; also before a requested commit or PR handoff."
---

# Clean

Polish the current task's diff. Preserve behavior, scope, and repository invariants. Prefer clear, direct code over compressed or clever code.

Cleanup and verification are distinct: cleaning is a diff-reading pass, but the result still needs the smallest relevant check before handoff.

## Process

1. **Fix scope.** Inspect the current diff and identify changes made for this task. Leave unrelated dirty files and user changes untouched.
2. **Load local standards.** Follow the nearest repository instructions and neighboring code. Repository conventions override generic preferences.
3. **Run the deletion pass.** For every task-owned change:
   - remove dead code, temporary instrumentation, stale comments, and speculative paths;
   - cut duplication when an existing helper or one clear shared implementation already owns the concept;
   - simplify control flow, names, imports, and file structure where clarity improves;
   - remove pass-through wrappers and abstractions that do not reduce caller complexity;
   - preserve validation, error handling, accessibility, observability, types, and behavioral tests.
4. **Re-read the resulting diff.** Confirm it remains task-scoped, readable, and behavior-preserving. No improvement is a valid outcome.
5. **Verify.** Run the smallest relevant check for the cleaned surface and report the exact command and result. If no runnable check is warranted, say why.

## Guardrails

- No unrelated refactors or whole-file formatting churn.
- No new abstraction for a speculative future or merely to reduce line count.
- No dense one-liners, surprising shorthand, or cleverness that raises reader burden.
- Never overwrite or revert changes not made for the current task.
- Clean does not imply commit, push, PR creation, or PR update. Those require an explicit request.
