---
name: coding-standards
description: Correct-by-construction TypeScript guidance. Use for non-trivial TypeScript implementation or review.
---

# TypeScript standards

Repository architecture and conventions come first unless they weaken correctness, safety, or an explicit task requirement. Improve the behavior in scope; translate incompatible legacy patterns at the nearest boundary rather than migrating unrelated code.

## Model the contract

- Parse external input once at an entrypoint or adapter into an owned application/domain type.
- Make realistic illegal states unrepresentable with discriminated unions, precise operation inputs, and branded/refined values where they prevent misuse.
- Push optionality outward. A function that requires a value should accept that value, not a nullable bag.
- Use `Partial<T>` only when arbitrary partiality is the real contract; otherwise define the allowed update shape.
- Replace behavior-changing boolean parameters with named options or domain variants.
- Keep protocol records, database rows, framework values, and SDK objects inside their boundary.

Do not use `Record<string, unknown>`, `Record<string, any>`, unknown-valued index signatures, or rename-only aliases as intermediate representations for external objects. Parse the complete owned shape, or write a purpose-specific parser for the value actually needed. Reserve `Record<K, V>` for a real mapping with a meaningful key and value contract.

Runtime `typeof` is appropriate for primitives and functions. `typeof value === "object"` is not object parsing: it admits `null`, arrays, and class instances.

## Failures

Represent expected failures in the return type when callers must classify, recover, retry, render, or translate them. Reuse the repository's established Effect/Result/tagged-union pattern; do not add a result dependency for one change.

Use precise error variants with stable tags and safe structured context. Preserve an external `cause: unknown` when useful, but keep secrets and personal data out of messages, logs, traces, and snapshots. Translate framework, vendor, persistence, and network failures inside the owning adapter.

Throw or reject for defects and framework-required control flow. Do not turn impossible invariants into routine result branches, and do not hide expected failures behind generic `AppError` or unclassified exceptions.

At entrypoints, translate outcomes into the protocol's valid result: HTTP response, CLI exit, retry/dead-letter decision, startup message, or rendered state.

## Modules and effects

Keep intrinsic calculations, invariants, and state transitions deterministic. Put authorization, operation policy, and effect sequencing in the application capability that owns them. Put protocol, runtime, persistence, and vendor translation at adapters or entrypoints. Apply these roles within the repository's existing structure; do not create layers to satisfy a taxonomy.

Dependencies should be explicit at composition. Avoid import-time I/O, scattered environment reads, mutable global state, and constructors that silently acquire resources. Parse configuration at startup into typed, redacted values and make cleanup ownership explicit.

Use `codebase-design` when module depth, seam placement, or interface shape is the decision.

## Type safety

Keep the repository's strictness; do not weaken compiler or lint settings to land a change. Prefer readonly values and exhaustive discriminated-union handling.

Avoid `any`, non-null assertions, and unchecked casts. At an interop or generic boundary where TypeScript cannot express a proven invariant, isolate the cast and add a short `SAFETY:` comment explaining the runtime proof. `as const` and type-position assertions derived from checked schemas are fine when they preserve—not invent—information.

Await every promise unless detached work is an explicit, observed lifecycle owned by the runtime. Handle rejection at the boundary that can classify it.

## Names and files

Use the repository's domain vocabulary. Names should reveal the owned behavior or value, especially where similar IDs, units, states, or operations coexist. Prefer stable, searchable error tags and event names.

Name boundary types by their actual role (`CreateUserRequest`, `UserRecord`, `StripeCustomerResponse`), not `DTO`. A function returning a refined value parses or constructs it; do not call it `validate` and discard the learned type.

Follow local file conventions. Split files when responsibilities or reasons to change diverge, not to satisfy a size rule. Avoid pass-through barrels and vague `utils` modules when a precise owner exists; do not fragment cohesive code merely to improve filenames.

Comments explain invariants, trade-offs, domain rules, and safety proofs. Document exported APIs to the level the repository expects; do not require ceremonial JSDoc for self-explanatory internal or framework-shaped exports.

## Tests and verification

Test behavior through stable interfaces and real dependencies where practical. Use behaviorally honest local substitutes for remote, destructive, nondeterministic, or expensive boundaries. Avoid module mocks and spy assertions when the outcome can be observed directly, but do not ban a substitute that protects a legitimate boundary.

Use `tdd` when the user requests test-first work. Otherwise leave one runnable check for non-trivial logic and run the smallest affected typecheck/tests plus any relevant build mode. Confirm the test or changed path actually executed.

## Completion

Before finishing TypeScript work, confirm:

- external values are parsed into owned types;
- states, units, IDs, optionality, and failures match the real contract;
- effects and resources have explicit owners;
- no compiler/lint weakening or unproved escape hatch was introduced;
- names and errors are searchable and use local vocabulary;
- focused behavioral verification ran and its result is reported.
