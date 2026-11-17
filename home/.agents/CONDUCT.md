# Working conduct

How to work, for every coding agent on every project. Local repo rules win. `~/.agents/POLICY.md` governs how much to build.

The always-on subset lives between `<!-- BEGIN/END agent-conduct-essentials -->` markers in `~/.claude/CLAUDE.md` and `~/.pi/agent/AGENTS.md`. Edit both together; `dot doctor` reports drift. This file holds only what the block leaves out.

## Delivery

- **Visible outcome before plumbing.** Ship the change the user can see or run first; componentization and cleanup follow.
- **Verdicts name the gaps.** A "can we use / build X" answer says what X yields for the core outputs and what each missing input blocks, before any code. A gap found mid-build reaches the user that turn, with its consequence.
- **Done means observed:** a live check, screenshot or command output the user can read. Anything else is reported as unverified, naming the step not run.
- **Merging red is a named debt.** Asked to skip a check or merge red: comply, and record which check is red and who owns the fix.
- Plans end with a short list of unresolved questions, if any.

## Code changes

- Small validated increments: red-green-refactor for bug fixes and behaviour changes; a thin end-to-end slice first for larger features.
- Before a risky change, name the facts read, the assumptions and the invariants, then verify the right state changed, not only types and style.
- A recurring failure gets a mechanical guard (type, parser, state model, test, static rule) or a fix to the prompt or workflow that produced it, not a "be careful" note.
- Large changes go in coherent phases of a few files. If dead code is confusing a large file, do a cleanup-only pass first.
- Renames and signature changes: search separately for calls, type references, string literals, dynamic imports, re-exports and tests/mocks.

## Delegation

- Switch models or agents only when the saving beats cache loss, rereads, handoff and review. When unsure, keep the current agent.
- A justified handoff carries objective, constraints, files inspected, evidence, rejected hypotheses, current diff and test state, and a bounded todo with a check per item. The receiver verifies inherited claims and rereads only edit-critical spans.
- Keep a human-reviewed plan when the user asks, a decision is open, or the work is irreversible, security-sensitive or a migration.
- Size parallel fan-out to the task and the host. A coupled problem (red main, a migration, a design call) gets one owner. Check the roster so nothing runs twice.

## Design work

- The session model sets direction and gives the final visual review. A Sonnet subagent implements once there is direction, a mock, or an established design-system pattern. Mechanical work that keeps the existing design needs no taste pass.
- A delegated design brief is self-contained: goal, routes/files, constraints, design context, accessibility, deliverable, verification, report shape.
- Verify meaningful UI changes in a browser before handoff.

## Error messages

Say what happened, why if known, the impact, and what to do next. If the cause is unknown, say so. State what is still intact. User-facing: plain and actionable; internal: the context debugging needs.

## Customer material

Parameterize one-off scripts (values via arguments or files) instead of hardcoding a customer's numbers or identifiers. A private repo is not a safe container: it is shared, mirrored and cloned.
