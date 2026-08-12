---
name: writing-for-agents
description: Write or revise skills and agent instruction files. Use for SKILL.md, AGENTS.md, CLAUDE.md, or documents reached from those instructions.
---

# Writing for agents

Write for predictable action, not comprehensive exposition. Repository instructions and the target harness remain authoritative.

For a skill, read [SKILL-MECHANICS.md](SKILL-MECHANICS.md) before changing frontmatter or invocation behavior.

## Process

1. **Define the trigger and outcome.** State when the document applies, what action changes, and what proves completion.
2. **Choose one authority.** Keep each rule in one place. Link to policy, config, source, or `--help` rather than copying facts the environment already owns.
3. **Put the main path first.** Order required actions and give each a checkable completion condition.
4. **Disclose branches.** Keep reference needed by every run inline; move optional modes, long examples, and provider-specific transport behind a clearly conditioned link.
5. **Respect local conventions.** Avoid universal mandates when framework, repository, or task context decides the trade-off.
6. **Prune.** Remove repeated policy, motivational prose, stale command caches, identity statements, and instructions the agent follows by default.
7. **Validate.** Check frontmatter, links, referenced files, example commands, and conflicts with parent instructions.

## Pointers

A pointer—skill description or instruction-file link—must name both the material and the distinct cases that should load it. Keep it short because it is always present. Do not list synonyms that trigger the same branch.

## Wording

Prefer concrete actions, decision rules, and observable bounds. Reserve `must`, `always`, and `never` for correctness, safety, authority, or other real invariants. State the desired behavior directly; explicit prohibitions remain appropriate when they prevent a specific unsafe action.

## Completion

The document is complete when its trigger is narrow, the primary path is obvious, branches load only when needed, every rule has one owner, completion is checkable, examples match current tooling, and removing any remaining paragraph would change useful behavior.
