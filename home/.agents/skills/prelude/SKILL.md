---
name: prelude
description: Create or rebuild a TypeScript prelude from demonstrated repository needs.
disable-model-invocation: true
---

# Bootstrap a TypeScript Prelude

A prelude is an explicitly imported module for **ambient** helpers and types: ubiquitous, domain-neutral building blocks that have no more precise owner. Build it from demonstrated repository needs; use bundled [`prelude.ts`](prelude.ts) only as a catalog of candidate implementations. Apply [`../coding-standards/SKILL.md`](../coding-standards/SKILL.md) throughout.

Ambient describes a helper's role, not a TypeScript global. Keep prelude exports behind ordinary imports; do not add global declarations or global augmentation.

## 1. Map the repository

Read repository instructions, package manifests, TypeScript configuration, source layout, and import conventions. Locate:

- an existing prelude or equivalent shared module;
- files named `utils`, `helpers`, `common`, `types`, `result`, `errors`, or similar;
- generic type aliases and tiny generic functions repeated across modules;
- established libraries for results, schemas, redaction, branding, collections, and exhaustive matching;
- every caller of plausible ambient helpers.

Search by both filenames and concepts within the requested packages and their callers. Expand the scope only when imports or duplication evidence cross that boundary; inspect definitions and callers rather than classifying from names alone.

**Completion criterion:** Every plausible ambient definition in the agreed scope is inventoried with its owner, callers, dependencies, and current behavior.

## 2. Classify every candidate

A symbol belongs in the prelude when all of these hold:

- it is domain-neutral and useful across unrelated modules;
- no domain, application service, adapter, protocol, or focused generic module is a more precise owner;
- centralizing it reduces duplication or gives a ubiquitous concept one canonical implementation;
- its dependencies are minimal, stable, and already justified by the project;
- its behavior is small enough to understand at the import site or hidden behind a precise type.

Keep a symbol with its focused owner when it encodes domain meaning, application policy, boundary translation, framework behavior, I/O, or a cohesive generic concept such as string casing or non-trivial collection operations. Prefer an established library over a local duplicate. A prelude is a curated foundation, not a barrel or miscellaneous dumping ground.

Record one decision for every candidate: use the established library, keep the current owner, move into the prelude, merge with a template symbol, or delete as an unused duplicate.

**Completion criterion:** Every inventoried candidate has one decision grounded in its semantics and callers; no candidate remains classified only by its filename or name.

## 3. Select from the template

Read the bundled [`prelude.ts`](prelude.ts) as a catalog. Create or merge the target file from approved candidates only; do not copy unused foundational helpers first.

Use the project's established expected-failure strategy. If it uses Effect or `better-result`, reuse that dependency. Otherwise retain an existing local result type only when demonstrated callers need it. Propose a new dependency only when the user explicitly asked to adopt one.

Preserve compatible behavior when merging equivalent helpers; surface semantic conflicts rather than silently choosing one implementation.

**Completion criterion:** Every target export has a demonstrated repository use or an explicitly requested foundational reason, with one expected-failure strategy.

## 4. Consolidate ambient helpers and types

Move or merge the approved repository candidates into the prelude. For each moved symbol:

- preserve behavior unless a behavior change was requested;
- preserve or deliberately migrate its public name and type contract;
- update every caller to import from the prelude directly;
- retain required JSDoc, safety comments, and targeted lint suppressions;
- remove superseded definitions and compatibility re-exports after their callers move.

Keep the resulting module side-effect free. It must not read configuration, acquire resources, register handlers, perform I/O, contain domain/application policy, or re-export unrelated modules.

**Completion criterion:** Every approved candidate has one canonical definition, every caller uses it, and no removed source remains as a second source of truth.

## 5. Verify the foundation

Run the repository's formatter, type checker, linter, and focused tests. Search again for the old symbols, duplicate definitions, stale import paths, and broad utility files that were part of the inventory. Review every prelude export for current usage or an explicit foundational reason.

Report:

- the chosen result strategy;
- template exports retained or removed;
- repository helpers moved, merged, left in place, or deleted;
- verification commands and outcomes.

**Completion criterion:** Repository checks pass, every inventory decision is reflected in code, duplicate ambient definitions are gone, and every prelude export is justified.
