---
name: codebase-design
description: Design or deepen a module interface. Use when deciding module boundaries, seam placement, caller contracts, test surfaces, or a structural refactor.
---

# Codebase design

Design deep modules: useful behavior behind a smaller interface, with complexity owned where it can be understood and changed once. Repository terminology and architecture take precedence over this vocabulary.

## Working vocabulary

- **Module:** code with an interface and implementation, at any scale.
- **Interface:** everything callers must know—operations, types, invariants, ordering, errors, configuration, and meaningful performance constraints.
- **Depth:** capability and hidden complexity relative to caller burden.
- **Seam:** a location where behavior can vary without editing its callers.
- **Adapter:** an implementation occupying a seam.
- **Leverage:** capability gained by each caller from one implementation.
- **Locality:** related knowledge, change, and verification concentrated together.

Use a repository's established terms when they communicate the same ideas. Consistency with local code is more valuable than vocabulary purity.

## Evaluate the current shape

Map the owning module, callers, dependencies, tests, side effects, and failure modes. Then ask:

- What complexity leaks into callers as repeated sequencing, validation, retries, mapping, or error handling?
- Which facts must callers learn that the module could own?
- Do several files change together because one concept is scattered?
- Is a wrapper forwarding calls without reducing caller burden?
- Does the interface expose implementation choices that should remain private?
- Can behavior be verified through the interface, or must tests reach into internals?

The deletion test is diagnostic: if deleting a module makes complexity disappear, it may be pass-through ceremony; if that complexity spreads back across callers, the module was earning its keep.

## Design the interface

1. State the caller jobs and constraints before proposing types.
2. Choose the seam where ownership and change naturally concentrate.
3. Pull sequencing, invariants, and recoverable failure handling behind the interface.
4. Keep required operations and parameters few, but do not hide essential control or observability.
5. For an important or hard-to-reverse interface, sketch two or three materially different designs. Compare caller burden, information hiding, locality, failure behavior, and migration cost; use subagents only when independent perspectives justify them.
6. Show representative caller code and the behavior tests would observe.

A module may legitimately persist data, send messages, or perform other effects. Make those effects explicit in its contract and keep their orchestration local. Prefer returning values for computation; do not contort an effectful module into pretending it is pure.

## Dependencies and tests

Introduce a seam when variation is real: multiple production implementations, a platform boundary, or a behaviorally honest test substitute. One implementation is a prompt to question the abstraction, not proof that it is wrong; two adapters are evidence of a useful seam, not a quota.

Prefer real in-process dependencies and lightweight local substitutes. For remote or third-party systems, keep transport and vendor details behind an owned capability when that reduces caller burden. Test observable behavior through the public interface; keep focused internal tests when they protect complex algorithms or diagnostics that the public surface cannot localize cheaply.

## Completion

The proposed shape is complete when callers become simpler, ownership is explicit, errors and effects are representable, representative usage is clear, and the test strategy exercises real behavior without exposing unnecessary internals. Record trade-offs and migration limits rather than designing speculative future flexibility.
