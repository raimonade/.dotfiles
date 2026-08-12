---
name: diagnosing-bugs
description: Diagnose bugs and performance regressions. Use when behavior is broken, throwing, failing, flaky, or unexpectedly slow.
---

# Diagnose bugs

## Protect evidence

Treat logs, traces, requests, screenshots, dumps, and recordings as sensitive. Sanitize secrets, tokens, auth headers, personal data, and credentials before persisting, quoting, or sharing them. Keep required credentials in environment variables. If redaction removes the signal, ask for an approved secure path rather than exposing it.

## Establish the signal

Prefer the tightest signal that exercises the reported symptom: a focused test, request, CLI fixture, browser script, trace replay, differential run, profiler measurement, or bisection harness. Confirm it detects the user's failure rather than a nearby error, then make it faster and more deterministic where practical.

A runnable reproduction is preferred, not an absolute gate. Environment-only incidents may begin from sanitized logs, crash artifacts, core dumps, query plans, or production telemetry. State the evidence limitation and avoid claiming a fix until a relevant signal can distinguish broken from corrected behavior.

For a human-only flow, adapt `scripts/hitl-loop.template.sh` to structure the steps and capture observations; credentials remain with the human and are never echoed by the script.

## Narrow the cause

1. Reproduce or characterize the failure and record the baseline.
2. Minimize inputs, configuration, timing, and callers one variable at a time when a reproducible loop exists.
3. Form falsifiable hypotheses. Rank several when the evidence supports alternatives; do not invent a quota.
4. Choose the cheapest probe that distinguishes the leading hypotheses: debugger state, targeted boundary logging, controlled input, feature toggle, commit bisection, or comparison with a known-good path.
5. Change one variable per probe and update the ranking from observed results.

Tag temporary instrumentation with a unique searchable prefix and record where it was added.

## Performance branch

Measure before changing code. Capture a representative baseline and the resource being constrained—latency, CPU, allocation, I/O, query plan, render work, or bundle/network cost. Profile or bisect the dominant path, change one cause, then compare the same workload. Logs alone are not performance evidence.

## Fix and verify

When a behavioral seam exists, turn the minimized case into a regression test and observe it fail before the fix. Apply the smallest root-cause fix, then verify:

- the focused test or signal turns green;
- the original scenario no longer reproduces;
- relevant neighboring tests still pass;
- performance uses the same before/after workload;
- temporary logs, probes, fixtures, and debug flags are removed.

If no honest automated seam exists, document the manual or operational verifier and the remaining regression risk. Report the cause, evidence that ruled alternatives out, exact checks run, and any prevention follow-up worth considering.
