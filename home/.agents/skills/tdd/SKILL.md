---
name: tdd
description: Test-driven development. Use when the user asks for test-first work, red-green-refactor, a regression test, or integration tests.
---

# Test-driven development

Work in vertical red → green → refactor slices. Each cycle should teach something about the behavior or interface, not merely increase test count.

## Choose the seam

Infer the test surface from the repository's existing architecture, public contracts, and neighboring tests. Ask only when multiple plausible seams would produce materially different behavior or cost. If the interface itself needs redesign, use `codebase-design` before fixing the test shape.

Prefer behavior observable through a stable caller or user interface. Focused internal tests remain useful for complex algorithms, diagnostics, or failure localization when the public surface would make failures opaque or prohibitively expensive.

## Cycle

1. **Red:** add the smallest test that expresses one missing behavior or reproduces the bug. Run it and confirm it fails for the intended reason.
2. **Green:** implement only enough production behavior to pass this slice. Avoid speculative cases and abstractions.
3. **Refactor:** improve names, structure, duplication, and test clarity while the suite stays green.
4. Repeat with the next behavior revealed by the previous cycle.

Use worked examples, specifications, or known literals as expected values. An assertion that recomputes the implementation is tautological.

## Dependencies

Prefer real in-process dependencies and lightweight local systems. Substitute a boundary when the real dependency is remote, destructive, nondeterministic, unavailable, or too expensive for the intended test layer. A substitute must preserve the behavior this test relies on; avoid mocks of internal call sequences when outcomes can be observed directly.

## Guardrails

- Keep each cycle small, but allow one behavior to require several assertions.
- Test errors and edge cases that are part of the contract, not every imaginable input.
- Do not weaken, skip, or delete existing tests merely to reach green.
- For a bug, leave the reproducing test as regression coverage when it protects meaningful behavior.
- Run the focused test each cycle and the broader affected suite before completion.

Complete when the requested behavior is covered through an earned seam, the test was observed red and green, refactoring preserved green, and the affected suite passes.
