# TypeScript standards

Compatibility pointer for agents still instructed to read
`~/.agents/standards/typescript.md`.

The canonical source is now Dillon Mulroy's installed skills package:

- `~/.agents/skills/coding-standards/SKILL.md`
- `~/.agents/skills/coding-standards/PRINCIPLES.md`
- `~/.agents/skills/coding-standards/TYPESCRIPT.md`
- `~/.agents/skills/coding-standards/MODULES.md` and `VOCABULARY.md` when module design, seams, adapters, or domain language matter
- `~/.agents/skills/coding-standards/REVIEW-LENS.md` for reviews
- `~/.agents/skills/coding-standards/CLOUDFLARE.md` / `EFFECT.md` when those platforms apply

Before non-trivial TypeScript work, read `PRINCIPLES.md` and `TYPESCRIPT.md` from
that package, plus the relevant topic files above. Local repository conventions
still win; do not start broad migrations unless explicitly requested.

## Local overlay

These local choices intentionally override the upstream skill text:

- **JSDoc:** upstream says every directly exported symbol needs JSDoc. Local rule
  is narrower: add JSDoc to package/module public APIs, domain-module primary
  types and parsers/constructors/combinators, and exports with non-obvious
  contracts (units, ownership, failure modes, side effects). One tight sentence;
  expand tags only when the signature cannot carry the detail. Do not document
  Expected Failures with `@throws`.
- **JSX:** never inline an IIFE (`{(() => { ... })()}`). Compute a `const` before
  `return`, or extract a helper component.
- **Precedence:** repo `AGENTS.md` / `CLAUDE.md` / local standards override this
  pointer and the installed skill package.
