---
name: react-best-practices
description: React and TanStack Start performance guidance. Use for measured performance work, route loaders or data fetching, bundle analysis, or when effects and state synchronization are in scope.
---

# React performance

Start with the project's pinned React, Router, Start, and Query versions. Framework APIs change; verify version-specific syntax in installed source or current official documentation before applying a rule.

## Triage by evidence

1. Identify the user-visible problem or risk: waterfall, bundle weight, server latency, duplicate fetching, excessive renders, hydration, or effect misuse.
2. Inspect the owning component or route, its data flow, and available profiling/build evidence.
3. Load only the relevant files under `references/rules/`.
4. Prefer structural fixes with measured impact over memoization and JavaScript micro-optimizations.
5. Verify the changed path with the repository's tests plus the relevant profiler, bundle report, network trace, or runtime measurement.

## Priority

1. Remove sequential waits between independent operations.
2. Keep heavy or server-only code out of the client bundle.
3. Use the framework's loader, cache, streaming, and request-deduplication primitives correctly.
4. Reduce subscription breadth and unnecessary render work.
5. Optimize hot JavaScript only after profiling identifies it.

Do not add a dependency for scheduling, memoization, or convenience that the platform and installed stack already express clearly. Treat performance claims and impact labels as hypotheses until measured in the target application.

## Effects

Effects synchronize React with an external system. For derived values, event responses, state resets, or chained state updates, load `references/rules/react-effects-decision-tree.md` and prefer render logic, event handlers, component keys, or the framework's data layer.

## Rule groups

- `async-*`: waterfalls and promise scheduling
- `bundle-*`: client bundle boundaries and deferred loading
- `server-*`: server caching and serialization
- `client-*`: client data fetching
- `rerender-*`: subscriptions, state, and memoization
- `rendering-*`: DOM and hydration behavior
- `tanstack-*`: version-sensitive Router and Start patterns
- `js-*`, `advanced-*`: lower-priority patterns; require profiling evidence

Rules are references, not a checklist. Repository conventions and measured behavior win.
