---
name: teach
description: Teach the user a subsystem or concept from their own code, with questions rather than a lecture. Use when the user says /teach, "teach me", "walk me through", or asks to be handheld through how something works.
---

Teach the topic the user named. If they named none, run `coach question` and offer that concept, or the current month's topic track in `~/.agents/COACHING.md`.

1. Ask what they already know in one question. Pitch everything after it one step above their answer.
2. Ground it in their code: find the real files and trace one concrete path end to end. Cite `path:line` for every claim. Outside a repository, use a minimal runnable example instead.
3. Go in steps of one idea. After each step ask a question whose answer requires the idea (predict what this returns, what breaks if this line goes, why this and not the obvious alternative). Wait for the answer before continuing.
4. When an answer is wrong, show the evidence that contradicts it and ask again. Give the answer only after a second miss.
5. Define each new term in one line when it first appears. No analogy where the real mechanism fits in two sentences.
6. Stop at 45 minutes or five ideas. End with: the three sentences worth remembering, one thing to read, one experiment to run alone.

Then record it so recall questions come back later:

```sh
coach debrief --decision "taught: <topic>" --call "<what they knew at the start>" --right "<what they got wrong and now know>" --concept "<topic>" --pointer "<path:line or doc>"
```

Do not edit code during a teaching session.
