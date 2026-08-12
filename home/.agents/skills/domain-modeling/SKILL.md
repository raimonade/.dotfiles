---
name: domain-modeling
description: Build a project glossary or record domain and architectural decisions.
disable-model-invocation: true
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## Documentation home

Inspect the repository's existing glossary, context map, architecture records, and documentation conventions first. Maintain those files and formats when they exist.

If the repository has no established home, propose the smallest convention only when there is a resolved term or decision worth preserving. Ask before introducing `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, or any equivalent repository-wide convention. Keep a glossary separate from implementation specifications and decision records.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing glossary, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update the glossary inline

When a term is resolved, update the repository's chosen glossary during the session rather than reconstructing decisions later. When the user approved `CONTEXT.md` as that home, use [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

Keep the glossary about domain language and relationships. Put implementation details in specifications and hard-to-reverse trade-offs in decision records.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).
