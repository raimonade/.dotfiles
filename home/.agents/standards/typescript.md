# TypeScript standards

The language-specific deep dive referenced by `~/.agents/POLICY.md`. The policy
governs _whether and how much_ to build; this governs _how_ to build it in
TypeScript. **Local repo conventions win** — inspect existing code for error
handling, schemas, DI, testing, observability, and module layout before
introducing a new pattern. New code paths may adopt these standards without
forcing a whole-repo migration.

## Errors and failures

### Expected failures are values

Domain, parsing, authorization, integration, I/O, persistence, and workflow
failures are expected. They belong in the return type, not in `throw` / a
rejected promise (rejection ≡ throwing). Preference, by what the repo already
uses:

1. **Effect**, if the codebase uses Effect.
2. **`better-result`**, if available/appropriate.
3. A small local tagged union otherwise:

```ts
type Result<T, E extends Error> =
  | { readonly _tag: "ok"; readonly value: T }
  | { readonly _tag: "err"; readonly error: E };
```

Prefer `Promise<Result<User, UserLookupError>>` over `Promise<User>` that
rejects for ordinary lookup/storage failures.

### Unrecoverable defects may throw

Throwing is for panics: violated invariants, impossible branches, startup
misconfiguration, `notYetImplemented`, catastrophic runtime conditions. Use
shared `prelude.ts` helpers where they exist:

```ts
export function casesHandled(unexpectedCase: never): never;
export function shouldNeverHappen(msg?: string): never;
export function notYetImplemented(msg?: string): never;
```

Use `casesHandled` for exhaustive union handling (pairs with
`noFallthroughCasesInSwitch`). Don't invent one-off `assertNever`/`absurd` when
the project has these.

### Custom errors

Expected failures use tagged errors extending `Error` (or `TaggedError` from
`better-result`, or `Schema.TaggedErrorClass` in Effect codebases) with: a
stable `_tag`, useful message, structured contextual fields, safe telemetry
fields, optional `cause: unknown`.

```ts
export class UserStoreUnavailable extends Error {
  readonly _tag = "UserStoreUnavailable";
  constructor(
    readonly operation: "findActiveByEmail",
    readonly provider: "postgres",
    readonly cause: unknown,
  ) {
    super(`User store unavailable during ${operation}`);
  }
}
```

Keep unions precise at module boundaries
(`Result<User, UserNotFound | UserStoreUnavailable>`). Reserve broad
`AppError`-style types for entrypoints, orchestration, logging, and rendering.

## Parse, don't validate

Boundary code turns unknown/less-structured input into domain types as early as
practical. Prefer `unknown → HttpBodyDto → CreateUserInput → EmailAddress/UserId`
over threading `z.infer<typeof Schema>` through the app. Names preserve meaning:

- `parseX(input): Result<X, ParseXError>` — untrusted/less-structured input
- `makeX(...)` / `createX(...)` — smart constructors from already-typed pieces
- `isX(value): boolean` — true predicates
- `assertX(...)` — rarely, mostly at test/framework boundaries

Avoid `validateX` when the function returns a refined value — it _parsed_
something. Use schema libraries as **boundary parsers**, not ad-hoc validators
sprinkled through core logic. Preference: the repo's established schema lib →
Effect Schema in Effect codebases → **Standard Schema** compatibility for
generic helpers → otherwise **Zod 4** → hand-written smart constructors for
small domain types when clearer. Parsing produces refined/domain types and typed
errors.

## Branded types and correct construction

Brand meaningful primitives: IDs (`UserId`, `OrgId`), parsed strings
(`EmailAddress`, `NonEmptyString`, `Url`), constrained numbers (`PositiveInt`,
`Cents`, `Percentage`), units (`Milliseconds`, `Bytes`, `UsdCents`). Construct
only through parsers/smart constructors; don't pass raw strings/numbers where a
domain type exists.

Push optionality outward — avoid `null`/`undefined` in functions that require a
value; branch or parse before calling. Avoid `Partial<T>` as application/domain
input unless partiality is the real domain concept; prefer an explicit input
type per operation.

## State machines and boolean blindness

Model meaningful lifecycle states as tagged unions, not boolean/optional bags:

```ts
type Invoice =
  | { readonly _tag: "Draft"; readonly id: InvoiceId; readonly lines: NonEmptyArray<LineItem> }
  | { readonly _tag: "Sent"; readonly id: InvoiceId; readonly sentAt: Instant }
  | { readonly _tag: "Paid"; readonly id: InvoiceId; readonly paidAt: Instant };
```

Avoid behaviour-controlling boolean params (`createUser(input, true)`); prefer
named options or domain types (`createUser(input, { emailVerification: "skip" })`).
Booleans are fine as predicate _returns_ (`isExpired`, `hasPermission`).

## Modules and abstractions

### Deep modules

A deep module hides substantial behaviour behind a cohesive, low-burden
interface (low burden ≠ few functions — a domain module may expose many cohesive
combinators and still be deep). Avoid shallow abstractions that merely forward
calls, mirror tables, or expose implementation steps. **Deletion test:** if
deleting the module makes complexity disappear it was pass-through waste; if
deleting it spreads complexity across callers it earned its keep.

### Domain modules (house style)

Center a module on one primary type (or tight family) exposing parsers, smart
constructors, combinators, predicates, formatters, and arbitraries for that
concept. House style is the OCaml-style namespaced pair:

```ts
// email-address.ts
export type EmailAddress = Brand<string, "EmailAddress">;

export const EmailAddress = {
  /** Parse an email address from untrusted input. */
  parse(input: string): Result<EmailAddress, InvalidEmailAddress> { /* … */ },
  toString(email: EmailAddress): string { /* … */ },
  equals(a: EmailAddress, b: EmailAddress): boolean { /* … */ },
} as const;
```

Free functions + `import * as EmailAddress from "./email-address"` are an
equivalent expression of the same shape. For class-based domain values:
construct through `parse`/`make`; make invalid instances unconstructable; keep
fields readonly to callers; keep methods cohesive over the value; no hidden I/O;
no inheritance for domain behaviour.

### Application/service modules

Application modules own capabilities (`PasswordReset`, `Billing`, `Invitations`,
`SubscriptionLifecycle`) and coordinate domain modules, persistence, external
calls, authz, workflows, telemetry. Prefer classes with constructor injection
when there are dependencies/state/config/multiple cohesive operations. Avoid
`deps`-bag objects threaded into every function (in Effect codebases, use
services/tags/layers). No method limit — split when methods are unrelated,
change for different reasons, or form a grab bag. Avoid vague names (`Manager`,
`Processor`, `Helper`, generic `UserService`) unless the framework established
them.

## Dependency interfaces and adapters

Depend on the **smallest meaningful shape** a module uses; let concrete adapters
be wider (structural typing makes this free):

```ts
type UsersForPasswordReset = {
  findActiveByEmail(email: EmailAddress): Promise<Result<ActiveUser, UserLookupError>>;
};
export class PasswordReset {
  constructor(private readonly users: UsersForPasswordReset) {}
}
```

A wide `PostgresUsers` satisfies it — avoiding both mega-repositories and
one-method adapter sprawl.

**Reuse audit before creating an adapter/service:** (1) reuse an existing one via
a narrow dependency type; (2) extend one if the method fits its cohesive
capability and changes for the same reason; (3) create new only when reuse/extend
would force bad coupling or an accidental interface. When a genuinely new
cohesive capability is created, leave a short ADR (what was checked, why
reuse/extend didn't fit). No ADR for tiny test fakes, in-memory substitutes, or
trivial framework glue.

**Persistence:** avoid repository-per-table by default. Repository-like adapters
are fine when they represent a cohesive domain persistence capability and return
parsed domain types / typed errors, not raw rows/ORM errors. Treat rows/ORM
models as infrastructure DTOs; parse them before core logic; keep SQL/ORM detail
inside the adapter.

## Functional core, imperative shell, entrypoints

Keep domain/application behaviour reusable across REST, CLI, GraphQL, workers.
The **functional core** holds domain logic, parsers, transitions, combinators,
decision functions — no I/O, hidden deps, ambient time/randomness, thrown
expected failures, or framework concerns. The **imperative shell** parses
untrusted input, sequences effects, calls the core with refined values,
classifies external failures into typed errors, and owns I/O/persistence/HTTP/
queues/telemetry/time/randomness.

Entrypoint adapters are thin protocol translation: parse protocol input, invoke
shared modules, render protocol output. Don't duplicate business rules in
controllers/resolvers/CLI handlers. Authorization is shared application/domain
policy, not duplicated in controllers; pass a parsed authorization input
(`AdminUser`, `Session`, `Principal`) into shared modules.

## Workflows, transactions, idempotency

Ordinary calls or a DB transaction for simple single-boundary work. A
saga/durable workflow when you need retries, compensation, idempotency,
resumability, timers, human approval, cross-service coordination, or multiple
transaction boundaries. Don't hold a DB transaction open across network calls.
Any retriable command/job/step needs an explicit idempotency strategy
(idempotency key, natural unique constraint, dedup record, state-transition
guard, transactional outbox/inbox) — never rely on "probably safe" side effects.

## Testing

Aligns with the `tdd` skill: verify **behaviour through public interfaces**, not
implementation. Confidence order: e2e for critical flows → integration through
real seams → focused/property tests for pure domain modules → unit tests for
meaningful behaviour. Use `vitest`.

**Never `vi.mock`/`jest.mock` for internal collaborators.** Use real seams:
constructor-injected interfaces, Effect layers, local SQLite, in-memory adapters
for simple behaviour, fake external adapters when needed. Assert observable
output — returned value/error, persisted state, emitted event, rendered
response, a record in a fake adapter — not spy calls
(`expect(sendEmail).toHaveBeenCalledWith` only when the interaction _is_ the
behaviour). For persistence with real SQL/schema/transaction behaviour, prefer
SQLite/local DB over hand-rolled fakes.

**Property tests (`fast-check`)** where properties beat examples: parsers/smart
constructors, branded/refined types, state machines, serialization roundtrips,
normalization/idempotence, lawful combinators. Export arbitraries near the
module they support and don't bypass parsers/invariants in tests:

```txt
src/billing/
  invoice-number.ts
  invoice-number.test.ts
  invoice-number.arbitrary.ts
```

## TypeScript style and safety

Strict settings where practical: `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
Prefer immutable values (`readonly`, `ReadonlyArray`); mutation is fine in
localized shell code, perf-sensitive internals, builders, or adapters behind a
precise interface.

**No `any`, no non-null `!`, no `as Type` casts** (`as const` is fine). Branch,
parse, or refine instead of `!`. Rare exceptions (highly generic helpers,
branding internals, interop) require a Rust-style safety comment:

```ts
// SAFETY: TS cannot express the brand. parse() checked the normalized string
// before branding; EmailAddress is unconstructable except through this parser.
return normalized as EmailAddress;
```

Rare `any` also takes a targeted lint-ignore with justification.

## Imports, exports, files

Direct imports from the owning file; **avoid barrel/`index.ts` re-export
layers** by default. Namespace imports suit domain modules
(`import * as EmailAddress from "./email-address"`); named imports for classes
and prelude helpers. Use `import type` / `export type`. Export only what callers
need — don't export internals just for tests. Avoid `namespace` without an
interop reason.

Precise filenames (`email-address.ts`, `billing-period.ts`, `array.ts`,
`prelude.ts`) over `utils.ts`/`helpers.ts`/`common.ts`/`misc.ts`. `prelude.ts`
holds only tiny ubiquitous generics (`casesHandled`, `shouldNeverHappen`,
`Redacted`, `Result` helpers) — no domain/application policy. No arbitrary
file-size limits; split when a file has multiple unrelated reasons to change.

## Comments and JSDoc

Self-documenting code first — names carry the _what_; don't narrate obvious code,
don't reference the current task/PR/caller, no decorative dividers. Comments earn
their place by explaining a _why_ that isn't obvious: an invariant, a trade-off,
a non-obvious domain rule, a safety justification.

JSDoc is **not required on every export.** Add it to: exported **public API of a
package/module**, **domain modules** (the primary type and its parsers/
constructors/combinators), and any export whose **contract is non-obvious**
(units, ownership, failure modes, side effects). One tight sentence; expand
`@param`/`@returns`/`@template` only when they add information a reader can't get
from the signature. Skip JSDoc on trivial internal exports that the name and
types already explain. Use `@throws` only for unrecoverable defects, framework-
required behaviour, or `notYetImplemented` — never to document expected typed
errors.

```ts
/** Parse an email address from untrusted input; `InvalidEmailAddress` when malformed. */
export const parse = (input: string): Result<EmailAddress, InvalidEmailAddress> => { /* … */ };
```

## Configuration and resources

Parse env/config at startup (or the earliest boundary) into typed config with
branded/redacted values; don't read `process.env` throughout the app. Missing/
invalid config is a startup failure with useful context. Wrap secrets (tokens,
keys, passwords) in `Redacted<T>` (Effect's `Redacted.Redacted` or a local one
in `prelude.ts`); unwrap only where the raw value is used, usually inside an
adapter. Never put secrets in errors/traces/logs/snapshots.

No top-level side effects outside true entrypoint/bootstrap files — modules don't
start servers, open connections, read env, or register handlers at import time.
Own resource creation/cleanup in bootstrap/shell code or Effect layers. Avoid
mutable singletons/global state (constants and pure lookup tables are fine);
isolate framework-required singletons at the boundary. Inject `Clock`/`Random`
into dependency-bearing modules; pure functions take explicit `now`/random values.

## Quick checklist

- Read existing conventions (errors, schemas, tests, adapters, telemetry, layout) first.
- Look for an existing domain module/type and an existing adapter before creating one.
- Parse inputs at the edge; use domain/branded types internally; no raw DTOs/IDs/nullable bags/`Partial<T>` in core.
- Typed errors as values for new expected failures; precise unions at boundaries.
- Preserve existing observability/error mechanics; wrap secrets in `Redacted`.
- Test behaviour through public interfaces and real seams; `fast-check` for parsers/branded types/state machines.
- No `any`/`!`/`as` (safety comment for rare exceptions); strict tsconfig flags.
- JSDoc on public/domain/non-obvious exports; ADR for a genuinely new adapter/service.
