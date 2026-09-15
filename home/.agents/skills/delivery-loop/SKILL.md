---
name: delivery-loop
description: Drive a substantive feature, bug fix, refactor, or performance change from a precise outcome through focused implementation, independent review, and real-surface proof. Use when work needs a checkable delivery loop; skip for a question or trivial edit.
---

# Delivery Loop

Turn a request into evidence that the changed behavior works. Keep the flow compatible with the host: Codex can use its pstack plugin, while Claude Code and Pi use this portable loop.

## Establish the proof

State three things before editing:

- **Outcome** — the user-visible or externally observable result.
- **Constraints** — scope, compatibility, authority, and safety boundaries.
- **Done** — the exact proof: a test, command transcript, API response, or browser flow.

Read repository instructions and relevant skills. Prefer an existing test or verification harness over inventing another one.

## Deliver in small proof-bearing units

Ground the relevant code and behavior, then make the smallest correct change. Verify each cohesive unit before moving to the next. Keep independent writers isolated by file ownership or worktree; otherwise work serially.

## Prove the changed surface

Run the narrow static and behavioral checks. Then exercise the real surface the user touches: a CLI command, API boundary, browser flow, job, or integration. A typecheck or build supports the claim but does not replace this proof.

Record the exact command, result, and material limitation. If live proof is impossible, say why and leave the work explicitly unproven rather than substituting a mock for a real path.

## Review and hand off

Inspect the final diff and seek an independent skeptical review when the risk warrants it. The integrating agent owns the final result; a delegate's report is evidence, not completion.

Do not infer permission to commit, push, open a PR, merge, deploy, or change external state. Ask only for an authority or product decision that cannot be safely discovered or tested.

## Prompts

Pi:

```text
/skill:delivery-loop Fix <problem>. Done means <observable result>. Use the project verification path and show the proof. Do not commit or push.
```

Claude Code:

```text
$delivery-loop Implement <outcome>. Constraints: <constraints>. Done means <observable proof>. Do not commit or push.
```

Codex:

```text
$poteto-mode Implement <outcome>. Constraints: <constraints>. Done means <observable proof>. Use $verify-spotwise when applicable. Do not commit or push.
```
