# `davis7dotsh/my-pi-setup` review

Reviewed current `main` at [`2657bae6`](https://github.com/davis7dotsh/my-pi-setup/commit/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd) on 2026-07-26. `git ls-remote` and a fresh checkout match that SHA.

## Verdict

Keep **`pi-subagents` 0.37.0 as the orchestration core**. It now covers nearly every workflow capability worth adopting: declarative saved chains, phase/label metadata, structured outputs, dynamic fanout, persistent FleetView and transcript inspection, durable async lifecycle, steering/recovery, worktrees, acceptance/review gates, public delegation APIs, preflight, and capability ceilings.

Davis remains stronger only in three narrow areas:

1. **Model-authored JavaScript workflows** with arbitrary conditions and loops.
2. **Native Claude Code and Codex harness adapters** alongside Pi children.
3. **Interactive transcript takeover** with input directly inside the inspector.

Those advantages do not justify replacing our foundation. Davis's repository still has **no license** (`license: null` in the GitHub API and no `LICENSE`, `COPYING`, or `NOTICE` file in the checkout), so do not copy implementation or theme files. Reproduce selected behavior clean-room from Pi and `pi-subagents` public interfaces only.

## Adoption status

Implemented independently:

- responsive Pi session footer and Catppuccin Macchiato activation;
- `research-plan` saved chain: external research and local scouting in parallel, then a grounded plan;
- `targeted-review` saved chain: structured target discovery, bounded dynamic reviewer fanout, and a read-only verdict;
- local researcher compatibility mapping to the installed `websearch` and `webfetch` tools;
- phase labels, progress metadata, structured outputs, bounded fanout, and artifacts through `pi-subagents` rather than a second workflow runtime.

Run the saved workflows with:

```text
/run-chain research-plan -- <task>
/run-chain targeted-review -- <review goal>
```

The existing `/review-loop`, `/parallel-review`, `/parallel-research`, and `/parallel-cleanup` prompt workflows remain the right parent-controlled tools for iterative work.

## Capability comparison

| Area | Davis current main | `pi-subagents` 0.37.0 | Assessment |
|---|---|---|---|
| Child runtimes | Pi SDK, Claude Agent SDK, Codex app-server | Pi child sessions with provider/model selection and fallbacks | Davis only when native harness semantics are required |
| Workflow definition | Inline model-authored JS with `phase()`, `agent()`, `parallel()`, and args | Declarative chains, saved chain files, prompt workflows, static groups, dynamic expand/collect | Davis more expressive; ours safer and inspectable |
| Conditional logic | Arbitrary branches and loops | Named outputs, fanout, `gateOn`, append-step, parent review loops | Add predicates only after a real chain cannot express a need |
| Parallelism | Semaphore capped at 4; 32 calls per run | Per-group and global concurrency, spawn limits, fanout caps | Ours is more configurable |
| Structured results | Optional JSON Schema per child | Schema-bound `outputSchema` across tools, chains, and delegation APIs | Equivalent capability |
| Phases and labels | Static metadata plus live phase updates | Chain phase/label grouping in progress and results | Already present |
| Background work | Session-scoped; aborts at shutdown; no resume | Detached durable runs, completion delivery, scheduling, status, steer, stop, resume | Ours substantially stronger |
| Context | Fresh isolated agents | Fresh or real parent-session fork | Ours stronger |
| Isolation | Shared cwd; no Git worktrees | Optional per-child worktrees, patches, aggregate handoff manifests | Ours stronger |
| Fleet/transcript UI | Picker and interactive takeover/input | Persistent FleetView and structured read-only transcript inspector | Davis has the remaining takeover UX advantage |
| Usage UI | Model, elapsed, tokens/context | Model, context, elapsed, tokens, cost, nested status | Ours already covers it |
| Artifacts | Script, args, workflow state, bounded transcripts/results | Versioned status/events/results/transcripts, session paths, process-terminal proof | Ours stronger operationally |
| Controls | Wait, list, cancel, send, takeover | Wait, status, stop, interrupt, acknowledged steer, resume, supervisor channel | Ours has stronger lifecycle guarantees |
| Acceptance | Child success plus optional schema | Evidence levels, criteria, verification, independent review, effects, watchdog | Ours stronger |
| Launch safety | Trust/model checks during execution | Side-effect-free preflight, definition/tool/skill digests, capability ceilings | Ours stronger |
| Permission defaults | Claude bypasses permissions; Codex uses danger-full-access | Strict tool visibility, optional permission policy, model scope, worktrees | Ours materially safer |
| Public extension seam | Internal workflow/subagent coupling | Delegation v1/v2, async RPC, background-work, preflight, capability ceiling | Ours is the deeper module |

## Why not adopt executable workflow scripts

Arbitrary workflow JavaScript adds a second orchestration runtime, script sandbox, IPC protocol, lifecycle model, persistence format, and failure surface. It also allows branches and loops that are harder to preview than a declarative chain.

Our common cases already fit saved chains and prompt workflows:

- sequential work;
- static parallel review;
- data-driven bounded fanout;
- structured handoffs;
- background execution;
- parent-controlled review/fix loops;
- follow-up steps appended after a result or decision.

If a repeated workflow eventually needs conditional branching, prefer a small declarative predicate over structured output. Do not add general JavaScript execution merely for expressiveness.

## Subagent implementation decision

Do not replace `pi-subagents`.

Davis's normalized Pi/Claude/Codex backend is useful only when a child must run inside a native external harness. Its defaults weaken the trust model: Claude runs with permission bypass and Codex with approvals disabled and full-access sandboxing. Any future native adapter must sit behind our existing preflight, strict tool/extension visibility, capability ceilings, worktree isolation, lifecycle artifacts, and acceptance contracts.

`pi-subagents` also provides capabilities Davis lacks:

- true parent-session forks;
- durable async recovery and scheduling;
- worktree isolation and patch handoffs;
- nested-run visibility and supervisor coordination;
- acceptance and independent-review gates;
- process-terminal proof;
- extension-owned delegation APIs;
- model scope and monotonic capability restrictions.

## Remaining clean-room candidate

**Interactive steer from FleetView detail** is the sole small, user-visible gap worth evaluating. Build it only if explicit text commands prove too slow in daily use. The safe design would use the public `pi-subagents` RPC, keep stop/destructive actions separately confirmed, and avoid importing Davis rendering or state-management code.

Native Claude/Codex adapters are a separate security-sensitive project and should wait for a concrete requirement. A background-terminal manager remains low priority because Herdr already owns process and pane visibility.

## Primary sources

### Davis

- [Repository metadata](https://api.github.com/repos/davis7dotsh/my-pi-setup)
- [Pinned tree](https://github.com/davis7dotsh/my-pi-setup/tree/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd)
- [README](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/README.md)
- [Workflow extension](https://github.com/davis7dotsh/my-pi-setup/tree/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/workflows)
- [Subagent extension](https://github.com/davis7dotsh/my-pi-setup/tree/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/subagents)
- [Claude backend](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/subagents/src/backends/claude.ts)
- [Codex backend](https://github.com/davis7dotsh/my-pi-setup/blob/2657bae6e054a2817e4483f6cdce8ab9c9eafcfd/extensions/subagents/src/backends/codex.ts)

### Ours

- Installed `pi-subagents` 0.37.0 `README.md`, `CHANGELOG.md`, and `package.json`
- Public `pi-subagents` delegation, preflight, background-work, and capability-ceiling interfaces
- Saved-chain parser and chain validation implementation
