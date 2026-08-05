---
name: change-brief
description: Summarize a just-completed change file-by-file — signatures touched, what each did and why, and a risk label. Use proactively after touching a high-risk surface (auth, billing, migrations, money, data loss, concurrency), before opening a PR on a substantial change, or when the user asks what was just changed.
---

# Change Brief

After a substantial change, don't hand back a diff — hand back a brief. A per-file summary of what changed and why, with a risk label per file, lets the reader (and you) catch the one weird turn without reading every line, then read code only where risk is high. Weird stuff sticks out immediately; a prompt or two later it's right.

## When

Fire on **risk × surprise**, not on size. Always do Step 2 (re-read as shipped) after any non-trivial change — that's cheap and silent. Emit the full brief when:

- the change touches a **high-risk surface** — auth, billing, migrations, money math, data loss, external calls, concurrency, security boundaries — even if it's a single file or one line; **or**
- the re-read turned up something that **diverged from intent** or surprised you; **or**
- you're about to **hand back or open a PR** on a substantial change; **or**
- the user asks what changed, to walk through the change, or what it does now.

Stay quiet on large-but-boring changes (a dozen files of copy, formatting, or mechanical renames) — a brief there is noise.

## Steps

1. **List the change set.** `git diff --stat` against the base branch (or the files you touched this session). Done when every modified file is named.

2. **Re-read the code as shipped — not your plan.** For each file, read the *current* state of what you changed and describe what the code **does now**, derived from the code, not what you intended it to do. This re-read is where surprises surface; skipping it turns the brief into a restatement of intent that hides bugs.

3. **Write one entry per file** — see the format below. Done when every file in the change set has an entry *and* a risk label.

4. **Add "What it does now."** One plain-language paragraph: the behavior end to end, as shipped. If it diverges from what was asked, say so in the first sentence.

5. **Flag surprises.** Anything that stuck out on re-read: wider blast radius than expected, an assumption you had to make, dead code, a left-behind TODO, a signature others depend on. "Nothing surprising" is a valid answer — say it explicitly.

6. **Point to where to read.** Name the `high`-risk entries as "read these"; state that the rest is skimmable.

## Per-file entry format

```
path/to/file.ts  · <risk>
  sig:  functions / types added|changed|removed — names + shapes, not bodies
  what: one line — what changed and why
```

## Risk labels

- **safe** — docs, tests, comments, copy, formatting.
- **medium** — UI, internal refactor, non-critical logic.
- **high** — auth, billing, migrations, data loss, money math, external calls, concurrency, security boundaries. These are the lines to actually read.

When unsure between two labels, pick the higher one.

## Optional: fresh-agent eval

For a high-stakes change, hand the brief + diff to a *separate* agent and ask it to evaluate one dimension you care about (correctness, security, perf) as shipped. A fresh reader catches what the author's context blinds them to.
