# Global agent conduct (Pi)

Personal defaults for every project. Local repo `AGENTS.md` always wins. (Pi workspace structure lives in `~/.pi/AGENTS.md`.)

<!-- BEGIN engineering-decision-policy (canonical: ~/.agents/POLICY.md) -->
## Engineering decision policy

Smallest *correct* solution, not smallest-looking diff. Minimality applies only after correctness, safety, and existing architecture are preserved — "write less" never means "validate less". Full policy: `~/.agents/POLICY.md`. Language deep-dives: `~/.agents/standards/<lang>.md` (e.g. `typescript.md`) — read before non-trivial work in that language.

1. **YAGNI first** — don't build what isn't needed; no speculative abstraction/dependency/config/file. Over-broad ask → ship the lazy version and name what you skipped.
2. **Never trade away** (these outrank minimality): correctness/edge cases, security + trust-boundary validation, data-loss-safe error handling, accessibility, team-relied observability, anything explicitly requested.
3. **Authority:** repo conventions/architecture > these defaults > personal habit. No whole-repo migration for an unrelated change. Don't preserve obviously broken local patterns just to shrink the diff.
4. **Build it right:** typed errors as values (not throws); parse input into domain/branded types at the edge; illegal states unrepresentable; deep cohesive modules over pass-through wrappers; behaviour tested through real seams.
5. **Reach order:** stdlib → native platform feature → installed dependency → one line → minimum custom code. Never a new dependency for what a few lines cover. Two correct same-size options → the edge-case-correct one.
6. **Leave one runnable check** for non-trivial logic (branch/loop/parser/money/security). Trivial one-liners don't need one.
7. **Mark deliberate shortcuts** with ceiling + upgrade path: `// shortcut: global lock; per-account locks if throughput matters`.
8. **Delete pass:** cut speculative abstractions/config/wrappers (deletion test — remove it; complexity vanishes = waste, complexity spreads to callers = earning its keep). Remove scratch files before finishing.

Minimality yields when the extra code buys correctness/debuggability, not ceremony. If a broader structural fix is needed, say so and propose a follow-up rather than silently expanding scope.
<!-- END engineering-decision-policy -->

## Verification & Completion

- Do not treat a successful edit/tool call as proof the task is complete
- Before reporting success, run the smallest relevant verification for the changed surface area and report the exact command and result
- If verification could not be run, say that explicitly and say why
- Prefer targeted verification during iteration; run broader checks before final handoff when the repo provides them

## File Read & Edit Discipline

- Re-read a file before editing when the task is long-running, the file may have changed, or prior context may be stale
- After editing, inspect the changed region or diff to confirm the edit applied as intended
- For files above ~500 LOC, read in chunks; do not assume one read captured the whole file
- If a search/tool result looks suspiciously small, assume truncation is possible and re-run with narrower scope

## Refactors & Large Changes

- Break multi-file changes into small coherent phases
- Prefer batches of ~3-5 files unless the work is clearly independent
- Use parallel/subagents only when the client supports them and the work is truly independent
- If dead code/noise is materially increasing confusion in a large file, do a cleanup-only pass first, then make the real change

## Rename / API Change Safety

- On renames or signature changes, search separately for:
  - direct calls/usages
  - type references
  - string literals
  - dynamic imports / require()
  - re-exports / barrel files
  - tests and mocks
