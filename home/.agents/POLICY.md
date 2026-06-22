# Engineering decision policy

Applies to every coding agent (Claude, Codex, Pi, Cursor, Copilot, …) on every
project and language. **Local repo rules win** (`AGENTS.md` / `CLAUDE.md` /
`.cursor/rules`). This overrides personal habit. Language-specific deep
standards live in `~/.agents/standards/<language>.md` (e.g. `typescript.md`) —
read the matching one before non-trivial work in that language.

**Optimize for the smallest _correct_ solution, not the smallest-looking diff.**
Minimality is a review lens applied _after_ correctness, safety, and existing
architecture are preserved. "Write less" never means "validate less."

## Order of operations

1. **Scope first (YAGNI).** Don't build what isn't needed yet — no speculative
   abstraction, dependency, config, parameter, or file. Speculative need → skip
   it and say so in one line. Over-broad request → ship the lazy version and
   name what you skipped in the same response; don't stall on a question you can
   default.

2. **Never trade these away** (they outrank minimality, always):
   - correctness and edge-case behavior
   - security, and input validation at trust boundaries
   - error handling that prevents data loss
   - accessibility
   - the observability/debuggability the team relies on
   - anything explicitly requested — if the user wants the full version, build
     it, no re-arguing

   Real-world calibration is not a place to be minimal: a real clock drifts, a
   sensor reads off, hardware runs a few percent fast. Leave the tuning knob,
   not just less code.

3. **Authority order.** Existing repo conventions and architecture > these
   defaults > personal habit. Don't start a whole-repo migration for an
   unrelated change; new code paths may adopt these standards without forcing
   the rest to follow.

4. **When building, build it right** (deep dive: `~/.agents/standards/<language>.md`):
   - expected failures are typed return values, not `throw` / rejected promises
   - parse untrusted input into domain/branded types at the edge (parse, don't
     validate); keep internal state typed and explicit
   - make illegal states unrepresentable; model lifecycles as tagged unions, not
     boolean bags
   - deep, cohesive modules with low caller burden over shallow pass-through
     wrappers
   - test behavior through public interfaces and real seams, not internal mocks

5. **Reach order (how much to write).** Stop at the first rung that holds:
   **stdlib → native platform feature → already-installed dependency → one line
   → minimum custom code.** Never add a dependency for what a few lines cover.
   Native over custom (`<input type="date">` over a picker lib, CSS over JS, a
   DB constraint over app code). Two correct options the same size → the one
   that's correct on edge cases. Lazy means less code, not the flimsier
   algorithm.

6. **Leave one runnable check.** Non-trivial logic (a branch, loop, parser,
   money/security path) leaves behind the smallest thing that fails if the logic
   breaks — one small test, no new frameworks/fixtures. Trivial one-liners don't
   need one. Test depth beyond this floor: per-language standards.

7. **Mark deliberate shortcuts.** A simplification with a known ceiling names the
   ceiling and the upgrade path in one comment:
   `// shortcut: global lock; per-account locks if throughput matters`. Simple
   reads as intent, not ignorance.

8. **Delete pass before done.** Cut speculative abstractions, dead config, and
   pass-through wrappers. Deletion test: remove it — if complexity disappears it
   was waste; if complexity spreads to the callers, it was earning its keep.

## Override rule (when minimality yields)

Minimality yields whenever the extra code **buys correctness or debuggability**
rather than ceremony. The classifier: _does this line buy correctness/safety/
debuggability, or is it ceremony?_ Buy correctness; cut ceremony. Unsure whether
an abstraction earns its keep → run the deletion test.

## Intensity

Default: this policy, always on. For an explicit minimization sweep, the
`ponytail` skill (Claude/Codex) offers:

- **lite** — name the lazier alternative in one line, you pick. Use in
  domain-heavy / correctness-critical code where the typed machinery is load-bearing.
- **full** — this policy enforced. Greenfield UI, glue, scripts, prototypes —
  where over-build is the main risk.
- **ultra** — deletion-first review pass only. Never always-on; never on domain
  modeling, schemas, error taxonomies, or security paths.
