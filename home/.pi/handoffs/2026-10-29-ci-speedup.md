# Handoff: make Spotwise CI/release faster (round 2)

Repo: SpotwiseAI/spotwise-ui. Round 1 = PR #5520, merged 2026-10-29 15:05Z as `04f766f17d7`.
Goal of the next session: find further ways to shorten releases (`pnpm release:cut` → finished) and
ready-PR CI, while staying relatively safe. User priority: speed "at all costs while keeping it
relatively safe"; layout/responsive and Firefox coverage were explicitly traded away.

## What round 1 changed (already on main)
- Playwright shards balance by the newest green `e2e-full.yml` run's `fileDurationsMs`
  (`scripts/ci/playwright-file-weights.ts` → `E2E_FILE_WEIGHTS` → `parsePlaywrightFileWeights` /
  `readPlaywrightShardFiles` in `scripts/lib/playwright-shards.ts`). Hand-kept
  `playwright-file-durations.json` deleted. Fetch failure → `{}` + warning → file-count split.
  Fetched once per run: `shard-weights` job in e2e-full.yml, `plan` step in ci.yml.
- Responsive sweep (`e2e/workflows/responsive-sweep.spec.ts`, ~37 of ~99 worker-min) excluded from
  every gating run; `E2E_RESPONSIVE=1 vp run test:e2e` runs it (playwright.config.ts).
- Cross-browser gate = WebKit only (Firefox removed). Safari crash still guarded by WebKit job +
  `e2e/workflows/treaty-browser-invocation.spec.ts`; browserslist + `compat/compat` lint hold API floor.
- Runner image Dockerfile installs `libatomic1` (Node 26 needs it; every runner-image publish since
  10-28 failed on it).
- Follow-up commit fixed the weights fetch: a failed-jobs re-run keeps evidence under the earlier
  attempt number, so it now picks the newest unexpired `e2e-evidence-<run>-*` artifact.

## Measured (method: `gh run view --json jobs` step/job timings, Playwright JSON reports)
- Before, e2e-full run 40859880522 (~22 min): shards 344–898 s (shard 1 overloaded by the sweep),
  WebKit+Firefox 879 s, Postgres/integration 771 s, unit shards ~460 s, images 205 s,
  setup-vp-workspace ~55 s per pool job (stale warm image → hosted fallback).
- After, branch run 40892660465 (weights fetch had fallen back to file count): WebKit 291 s,
  shards 299–768 s (shard 1 = dialog-open-sweep + workflow-parity together).
- Simulated split with correct weights on that run's real per-file times: 3.7–4.0 min/worker on
  4 shards, 5.1–5.2 on 3 PR shards.
- **Unconfirmed:** run 40896623667 (with the fetch fix) was still queued at handoff; WebKit 294 s,
  images 195 s, weights 36 s done. First check: its shard times. Also check the first main
  candidate run after merge.
- Release.yml (run 40658261593, ~32 min): verify-workspace ~1 min (one outlier 21 min: waits on
  main push CI), prepare-* ~2.5–3 min parallel, deploy-restate-worker ~4 min (193 s "Deploy to VM and
  register"), promote-app-tier ~7 min (3 sequential App Service swaps ~85 s each + 3-pass smoke),
  release-watch 15 min holding the `production-release` lock.

## Estimated totals now
Release end to end ~50 min (was ~57): E2E ~15 (floor = Postgres/integration 13 min) + archive/tag ~3
+ deploy ~17 + watch 15. Ready PR ~12–14 min (was ~20–23).

## Open items / leads to investigate (ranked by likely payoff)
1. **Postgres and integration job (771 s)** is now the E2E critical path. Profile it
   (`.github/actions/run-ci-suite`, suite `integration`, `VITEST_MAX_WORKERS=4` on d8): shard it,
   raise workers, or split slow suites.
2. **release-watch 15 min holds the release lock** (`scripts/ci/release-watch.sh`, release.yml
   `release-watch`). Options: shorter window, release the lock before watch, or let the next release
   queue behind it only if the watch breaches. Safety tradeoff — needs user call.
3. **Release waits serially on E2E then deploy.** Could `prepare-*` (slot staging, ~3 min) and the
   restate image build start during the E2E run, or could release.yml run on the archived candidate
   immediately? Check `scripts/cut-release.sh`, `require-e2e-success.sh`, `archive-candidate`.
4. **promote-app-tier**: worker + dashboard swaps after API verified could run in parallel (~1.5 min);
   touches rollback ordering in `scripts/ci/promote-app-tier.sh` — careful.
5. **Warm runner image rollout** (operator step, `infra/opentofu/ci-runners/runner-image/README.md`
   "Every rollout"): needs a green `Runner image` run (started at merge: run 40897948524 — check it),
   then drain pool (`CI_RUNS_ON_D8`), tofu plan/apply with owner authorization. Saves ~55 s per pool
   job. Not done: shared-infra change, needs explicit go-ahead. Consider adding Firefox removal is
   already fine (image only has chromium+webkit).
6. **Pool contention**: main-push unit shard queued ~6.5 min for a d8 runner. Consider GitHub merge
   queue (would make `test_main` and the candidate's unit/integration rerun largely redundant) —
   process change, user decision.
7. Perf specs (65 s, non-gating) run after shard 1 — move to the fastest-finishing shard or own job.
8. dialog-open-sweep.spec.ts (~770 worker-s, 137 tests) is the biggest remaining file; check whether
   it parallelizes well or could get the same treatment as the responsive sweep.
9. `E2E images` 195–205 s precedes every Playwright job; check cache hit rate
   (`.github/actions/publish-e2e-images`, BuildKit cache written only by main candidates).
10. Unit test shards (~8 min each incl. setup) — check per-suite times in `run-ci-suite`.

## Gotchas learned
- `pnpm check:affected` can wait 15+ min on the machine-wide heavy-job slot held by other worktrees;
  `HEAVY_SLOT=off` bypasses for scoped `vp lint`. Run long things detached.
- Local `ci-policy.test.mjs` "posts its changelog" test fails due to local `tag.gpgsign=true`; it
  fails identically on main — unrelated.
- OpenTofu fmt/validate once failed on a GitHub download of the helm provider (1 in 17 runs); rerun.
- Job logs: `gh api --allow-escape-sequences repos/SpotwiseAI/spotwise-ui/actions/jobs/<id>/logs`
  works while a run is in progress (`gh run view --log` doesn't).
- Merged Playwright report lacks shard index; recompute shard membership with
  `readPlaywrightShardFiles` + the weights that run fetched.
- Repo rules: PRs open as drafts; `pnpm check:ready` once before `gh pr ready`; Claude models only.

## Suggested first step
Confirm round-1 gains on run 40896623667 and the first main candidate, then profile the
Postgres/integration job (lead 1) and bring the user decisions for leads 2, 5, 6 together.
