---
name: evidence-first-codebase-navigation
description: "Mandatory for unfamiliar-repository investigation, architecture or SQL review, implementation planning, dependency questions, lint/config audits, cleanup verification, and code changes. Before `rg`, directory listings, guessed file reads, or edits, directly invoke the available repository-aware code-search/context tool for the exact symbol, contract, dependency, convention, or anti-pattern. Use scoped `rg` only when repository-aware search is unavailable or unsuitable, and state why."
managed-by: tracedecay-automation
skill-id: "evidence-first-codebase-navigation"
content-hash: sha256:e7ca658ac0b8cc942a234b6fd3d6533bdf8cbce70692b47c5edb0bd26216a508
skill-version: 1784909043
---

# Evidence-First Codebase Navigation

Use this skill when investigating an unfamiliar codebase, auditing implementation coverage, planning or implementing a change, resolving a type or dependency question, or verifying that a cleanup is complete.

## Activation checkpoint

Loading this skill is not the checkpoint. Before opening source files sequentially, editing, or running broad filesystem scans:

1. State the symbol, contract, dependency, convention, capability, or anti-pattern you need to locate.
2. Invoke the environment's repository-aware code-search tool directly when one is available.
3. Let the results determine which files to inspect.

Do not substitute a shell search merely because it is familiar. Use scoped `rg` or `rg --files` immediately only when repository-aware search is unavailable, cannot search the required artifact, or is unsuitable for an exact generated-text check. Briefly identify that condition so the fallback is deliberate and observable.

A prose statement that search is needed, followed by directly opening a guessed file, does not satisfy this checkpoint.

## Search before reading

Search for the smallest useful evidence set:

- the symbol, type, function, component, route, status, or CSS selector being investigated;
- its definition, exports, re-exports, imports, callers, tests, mocks, and string references;
- existing examples of the desired pattern;
- dependency declarations in both the owning package and workspace root;
- scoped instruction files and nearby package documentation;
- the exact anti-pattern targeted by a cleanup;
- generated or compiled output when the claim concerns build emission rather than source text.

For audits spanning several dimensions, run one focused query per dimension or contract. Build the report from returned definitions and usages rather than beginning with directory listings or guessed filenames.

Open only relevant hits and enough surrounding context to understand their contracts. When a first search returns incomplete evidence, refine the query for the exact construct instead of inferring absence. For example, searching a base CSS selector does not prove that its pseudo-element was emitted; search the pseudo-element explicitly in the compiled artifact.

When using `rg`, scope it to authoritative source roots and exclude dependencies, generated output unless intentionally inspected, and nested agent worktrees. Prefer `rg` over `find | grep`. Duplicate hits from sibling worktrees can obscure ownership and produce false conclusions about scope.

## Establish ownership and scope

Before editing or concluding an audit dimension, identify:

1. The package or module that owns the behavior.
2. The source type or contract rather than reconstructing it from usage.
3. Existing local conventions that solve the same class of problem.
4. All affected callers and tests.
5. The narrowest behavioral verifier.

In a monorepo, inspect package-local and workspace-level dependency declarations before concluding that a dependency is unavailable. Then confirm that package-manager and module-resolution rules permit the intended import. Root presence is evidence to investigate, not automatic proof of package ownership and not proof of unavailability.

## Handle transformed or anonymized source cautiously

If identifiers or literals appear redacted, generated, minified, or otherwise transformed:

- do not infer a missing capability from the transformed spelling alone;
- search stable structural anchors such as imports, route shapes, table names, neighboring contracts, and tests;
- corroborate conclusions through at least one independent source surface;
- state the evidence limitation in the final report when it materially affects confidence.

## Replace unsafe test fixtures deliberately

When removing broad assertions such as `as any` from tests:

- locate and import the real owned type;
- determine whether the fixture is complete or intentionally partial;
- search for the repository's established partial-fixture utility;
- inspect both package-local and workspace dependency configuration;
- avoid adding a dependency unless repository policy and task scope authorize it;
- preserve behavioral intent instead of filling irrelevant fields with meaningless values.

## Verify through independent signals

Use the smallest relevant checks, normally:

- the focused test file or owning package test command;
- the owning package's typecheck;
- a targeted search proving the removed pattern no longer exists in scope;
- inspection of generated output when behavior depends on compilation or bundling;
- for audits, a second source surface such as a route plus service, implementation plus test, or schema plus runtime caller.

A zero-result search is supplementary evidence, not a substitute for tests, typechecking, or runtime/build inspection. Report exact commands and outcomes. Confirm that tests actually executed.

## Pitfalls

- Do not infer a type's shape from a truncated snippet when its definition can be found.
- Do not treat directory listings as proof that a capability exists or is absent.
- Do not open guessed implementation files before performing the activation search.
- Do not let a long-running delegated search block a conclusion already supported by complete, independently verified direct evidence; record the incomplete delegation and its covered scope.
