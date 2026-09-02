---
name: prompt-laboratory
description: "Prompt shaping for terse or underspecified coding requests. Use when the user asks to write or improve a coding-agent prompt, delegates coding to any agent, or gives a non-trivial coding request without a checkable outcome, scope, proof signal, or stopping condition. Convert it into a proportional execution brief with a stopwatch and laboratory, surface only material ambiguity, and continue when safe. Skip already-specific briefs, read-only questions, and trivial requests."
---

# Prompt Laboratory

Help the user develop better prompting habits without making them write a specification before useful work begins.

## Shape the request

Preserve the user's goal and authority. Fill retrievable repository facts through inspection. Add only the missing pieces that change execution:

- **Outcome:** observable behavior rather than an edit-shaped instruction.
- **Scope:** owned behavior, preserved invariants, and meaningful exclusions.
- **Stopwatch:** the evaluator that can distinguish success from a plausible-looking diff.
- **Laboratory:** the cheap loop the agent can run itself.
- **Stop conditions:** material ambiguity, unsafe authority, unavailable proof, or necessary scope expansion.

Match detail to risk. A bounded change with a fast test needs a few lines; a migration or open-ended optimization needs a fuller contract. Ask one concise question only when the answer cannot be discovered and would materially change the result.

## Teach by showing

When executing the request in the current task, share a compact `Prompt upgrade` in commentary containing the outcome, scope, proof signal, and loop, then proceed. Briefly name the important assumption or missing element you supplied so the user can learn from the contrast. Do not make the user resubmit the improved prompt.

When producing a prompt for another agent, read [the full runbook](references/runbook.md) and return a ready-to-send brief. Keep it universal: adapt task size and evidence depth, not the prompting philosophy, to the chosen agent.

Do not turn prompting into ceremony. Omit sections that add no decision-relevant information.
