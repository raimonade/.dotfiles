---
name: handoff
description: Write a temporary continuation handoff for another agent.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write the handoff in the operating system's temporary directory, not the repository. Tailor it to the user's stated next-session focus.

Capture:

- goal, user constraints, and decisions;
- inspected files, symbols, and relevant source anchors;
- changed files and current Git state;
- commands/tests run with outcomes;
- rejected hypotheses or approaches worth avoiding;
- external processes, tickets, browser state, or artifacts still active;
- bounded remaining work, open decisions, risks, and the next executable step;
- only the skills materially relevant to that next step.

Reference existing specs, plans, ADRs, issues, commits, diffs, and reports by path or URL instead of duplicating them. Redact secrets, credentials, personal data, and sensitive captured output.
