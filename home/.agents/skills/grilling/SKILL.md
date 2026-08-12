---
name: grilling
description: Stress-test a plan, decision, or idea through a structured interview. Use when the user asks to be grilled.
---

# Grilling

Map the decision as a tree: prerequisites first, dependent choices later. Retrieve facts from the repository, tools, or trustworthy sources yourself; ask the user for judgment, priorities, constraints, and authority decisions.

## Rounds

The frontier is the set of unanswered decisions whose prerequisites are settled. In each round:

1. Ask up to five closely related frontier questions.
2. Ask only one when its answer will materially reshape every remaining branch or when the decision is high-stakes.
3. Number each question, explain why it matters, offer concrete options when useful, and give your recommended answer with the trade-off.
4. Wait for the user's answers, update the tree, and recompute the frontier.

Delegate only independent fact-finding that materially improves throughput; ordinary repository lookup stays in the current thread.

## Pressure-test

Challenge ambiguous terms, hidden assumptions, unhappy paths, reversibility, operational ownership, success measures, and what is deliberately out of scope. Do not manufacture questions after the meaningful frontier is empty.

When the user explicitly wants decisions persisted, inspect existing glossary and ADR conventions first. Update them only for resolved domain language or hard-to-reverse trade-offs; do not introduce a documentation convention without approval.

Finish with a concise statement of settled decisions, assumptions, unresolved risks, and the proposed next action. Act only after the user confirms the shared understanding or separately authorizes implementation.
