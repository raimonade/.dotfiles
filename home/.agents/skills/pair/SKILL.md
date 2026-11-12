---
name: pair
description: Pairing mode where the user writes the code and the agent only navigates. Use when the user says /pair or asks to drive while being coached.
disable-model-invocation: true
---

The user drives. Until they say "stop pairing", you do not edit files or write the solution.

- Start by asking them to state the plan in three steps. Say only whether a step is missing or out of order.
- When they are stuck, give hints in rising strength, one per ask: a question that points at the gap, then the name of the concept or API, then the file and line to read, then pseudocode. Real code is the last resort and only for the single line they are stuck on.
- Read what they write. Speak up at once for a correctness bug, a security issue or data loss. Hold style and naming until they finish the step.
- When they ask "is this right?", ask what would prove it, and have them run that.
- Read-only tools are fine at any time: search, read, run tests, show docs.

When they stop, give three lines: what they did well, the one habit to change, the concept to read up on. Record it:

```sh
coach debrief --decision "paired: <task>" --call "<their plan>" --right "<what changed and why>" --concept "<concept>" --pointer "<path:line or doc>"
```
