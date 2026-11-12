# Coaching

The goal is to work like a principal engineer while using agents: make the calls yourself, read
every diff, and understand the systems you ship on. Agents make the lazy path (accept whatever
comes back) free, so the habits below are enforced by `coach` (`~/.local/bin/coach`) and its hooks
rather than left to willpower. The always-on agent rules are the `coaching` block in
`~/.claude/CLAUDE.md` and `~/.pi/agent/AGENTS.md`; this file is the full protocol and the plan.

## The three guards

| Guard | Enforced by | What it forces |
|---|---|---|
| Call it first | Agent rule | You state your call and one reason before the agent states its own. |
| Review receipt | `PreToolUse` hook, pi `coach-gate` extension | `gh pr create`, `gh pr ready` and `gh pr merge` fail unless you approved that exact diff in Plannotator. |
| Debrief | `Stop` hook | A session that committed cannot end without three logged lines. |

Add nothing else for the first two weeks. A guard you route around teaches nothing, and three is
already more friction than you are used to.

### Call it first

At a decision that changes the outcome (design, data model, API shape, a trade-off, a debugging
hypothesis) the agent asks "what's your call, and why?" and waits. There is no "you decide"
option. After you answer it gives its own call, says whether yours was a match, partial or miss
and why, and logs it:

```sh
coach call --topic "lock scope" --mine "global lock" --agent "per-account lock" --verdict miss --why "contention under fan-out"
```

Delegating is still allowed, after the call. "I'd do X because Y, but you decide" takes ten
seconds and is the whole exercise. Cap: about three calls per task. Trivia (naming, formatting,
which file) is not a call.

### Review receipt

`coach review` opens Plannotator on the branch's diff against its base (`coach review 123` for a
pull request). Clicking Approve writes a receipt keyed to that diff. A new commit that changes the
patch invalidates it; merging the base branch in does not.

What to do in the review, in order: read the call flow top down, check each changed boundary (what
comes in, what goes out, what fails), look for the thing the agent did to make a test pass rather
than to make the code right, and annotate instead of fixing in your head.

### Debrief

When a session has moved `HEAD`, the agent drafts three lines and asks you for the middle one:

1. The decision that mattered.
2. Your call, and what was right.
3. One concept worth knowing, with a file or doc to read.

```sh
coach debrief --decision "..." --call "..." --right "..." --concept "..." --pointer "path:line"
```

Unattended and delegated sessions have no one to ask; they record `--delegated` and the scorecard
counts them separately, so a week of pure delegation is visible.

### Bypass

Hotfixes exist. `coach bypass "<reason>"` (or `--pr 123`) skips review for one diff. It only runs
from your own terminal, the agent's attempts are refused, and every reason is printed in the weekly
scorecard. The price of the easy path is having to read your own excuses on Friday.

## Learning layers

**Passive** (costs you nothing, always on):

- Every non-obvious choice the agent makes comes with a two-line why.
- A term you may not know gets a one-line gloss the first time it appears.
- Each debrief names one concept and where to read it.

**Active** (costs effort, which is the point):

- Call it first (guarded).
- Explain it back: before a pull request, you explain the change in three sentences and the agent
  corrects what is wrong or missing.
- Recall: at session start the agent asks one question on a concept debriefed at least two days
  ago, least-recalled first, and logs `coach recall --concept ... --result pass|fail`.
- Find the bug: on request, the agent plants one defect in a diff you are about to review.
- One small change a week written by hand, no agent.

**On request:**

- `/teach <subsystem or concept>`: a walk through your own code, with questions.
- `/pair`: you drive, the agent only hints.
- `/quiz [topic]`: five questions from your own log and code.
- "Explain at my level" at any point: the agent restates without assuming the term it just used.

## Weekly rhythm

| When | What | Time |
|---|---|---|
| Session start | One recall question | 1 min |
| During work | Calls, why-lines, glosses | inline |
| Before a pull request | Explain it back, then `coach review` | 5–20 min |
| Session end | Debrief | 2 min |
| Friday | `coach scorecard`; reread the misses; pick next week's by-hand change | 20 min |
| Once a week | One `/teach` session on the month's topic | 45 min |

The scorecard is prompted at the first session on or after Friday. It reports calls made and match
rate, diffs reviewed, gates passed, bypassed and blocked, debriefs with and without your call,
recall results, every bypass reason, the misses, and the week's concepts.

## What the numbers should do

- **Calls per week** is the first number to move: from zero to ten or more. Match rate does not
  matter yet.
- **Match rate** should sit around 50–70%. Above 85% means the calls are too easy; ask for harder
  ones. Below 40% for three weeks means the topic track is wrong; change it to where the misses
  cluster.
- **Bypasses** should trend to at most one a week, each with a reason you would say aloud.
- **Delegated debriefs** should stay below half of all debriefs.
- **Recall pass rate** below 60% means the concepts are logged but not read. Follow the pointers.

## Twelve-week plan

**Weeks 1–2: install the habits.** Only the three guards. Success is that nothing was routed
around: ten calls, every pull request reviewed, every committing session debriefed.

**Weeks 3–4: read diffs like a reviewer.** Add explain-it-back and find-the-bug. Aim to leave at
least one substantive annotation per review: a missed failure path, a wrong boundary, a test that
asserts the mock.

**Weeks 5–8: design before building.** Before any task larger than an afternoon, you write the
design in five lines (data in, data out, failure modes, what it must not do, how it is verified)
before the agent proposes anything, then compare. This is "how would you design that?" turned on
yourself. First topic track runs alongside.

**Weeks 9–12: own a system.** Pick one subsystem and become the person who can answer any question
about it without looking. `/teach` sessions go deep on it, `/pair` sessions have you driving, and
the by-hand change each week lands in it. Second topic track.

Review at week 12: keep the guards that changed behaviour, delete the ones that became ritual.

## Topic tracks

One topic a month. Each week: one `/teach` session, one thing read from the pointers, one
prediction made and checked.

**Track 1: Postgres query planning.**

1. Reading `EXPLAIN (ANALYZE, BUFFERS)`: node types, estimated vs actual rows, where time goes.
2. Statistics and selectivity: why the planner misestimates, `ANALYZE`, extended statistics.
3. Index choice: btree vs GIN vs BRIN, composite column order, partial and covering indexes.
4. Joins and CTEs: nested loop vs hash vs merge, when a CTE is a fence, lateral joins.

Each week, predict the plan for one real query from your codebase before running it.

**Track 2: durable execution.**

1. What a durable workflow engine guarantees and what it does not: journaling, replay, determinism.
2. Idempotency: keys, natural constraints, why "probably safe to retry" is not a strategy.
3. Sagas and compensation; timers and human waits.
4. Failure drills: kill a worker mid-step and predict what replays.

**Later candidates:** type-driven design (parse don't validate, illegal states), observability
(tracing a request end to end), concurrency and locking, HTTP caching, distributed-systems basics.

## What separates the levels

What to practise, in the order it tends to be missing:

1. **Deciding.** A mid-level engineer asks what to do; a principal says what they would do and
   why, then invites correction. Call it first trains exactly this.
2. **Verification before construction.** Ask "what tool would prove this works?" and build that
   first. Then the build can run unattended.
3. **Reading over writing.** With agents, review is the job. Speed comes from reading diffs fast
   and accurately, not from typing.
4. **Knowing what not to care about.** Delegate the decisions that do not matter, loudly, and
   spend attention on the two that do. "Good enough" is a decision, not a lapse.
5. **Cheap rollback.** When a direction is wrong, revert within minutes rather than repair.
6. **Standards as checks.** A correction made twice becomes a written rule; a written rule becomes
   a check that runs on every diff.
7. **Bounded hours.** One main thread, two or three side lanes, a hard stop.

## Standards and traits

`coding-standards` (`~/.agents/skills/coding-standards/SKILL.md`) is the document agents read
before writing code. A long document read up front drifts; the fix is to turn each rule into a
small check that runs over the diff. Two sources feed those checks:

- the standards document, one rule per check;
- the coaching log: a miss or a review annotation that repeats is a rule waiting to be written.

Until a diff checker is wired in, the Friday review is the manual version: for each repeated miss,
either add a sentence to `coding-standards` or decide it was a one-off.

## State

Everything is in `${XDG_STATE_HOME:-~/.local/state}/coach/log.jsonl`, one JSON event per line. It
is per machine and never committed.
