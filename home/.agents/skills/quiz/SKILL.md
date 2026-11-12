---
name: quiz
description: Quiz the user on concepts from their coaching log and their own code. Use when the user says /quiz or asks to be tested on what they have learned.
disable-model-invocation: true
---

Ask five questions, one at a time, waiting for each answer.

Sources, in order: the topic the user named; else concepts from `${XDG_STATE_HOME:-$HOME/.local/state}/coach/log.jsonl` (`debrief` events, and `call` events whose verdict was not `match`), preferring ones with no passing `recall`; else the current topic track in `~/.agents/COACHING.md`.

Question shapes, mixed: predict the behaviour of a real snippet from their code (cite `path:line`), find the defect in a short diff, choose between two designs and say why, explain a term in two sentences. No trivia and no multiple choice.

After each answer say right, partly or wrong, give the correct answer in three lines at most, and record it:

```sh
coach recall --concept "<concept>" --result pass|fail
```

Partly right counts as fail. Finish with the score and the one concept to reread, with its pointer.
