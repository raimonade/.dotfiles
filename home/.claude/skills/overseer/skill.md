---
name: overseer
description: Manage tasks via Overseer MCP. Use for multi-session work, task breakdown, persistent context for handoffs. Requires overseer MCP server.
---

# Agent Coordination with Overseer

## Core Principle: Tickets, Not Todos

Overseer tasks are **tickets** - structured artifacts with comprehensive context:

- **Description**: One-line summary (issue title)
- **Context**: Full background, requirements, approach (issue body)
- **Result**: Implementation details, decisions, outcomes (PR description)

Think: "Would someone understand what, why, and how from this task alone?"

## When to Use Overseer

**Use Overseer when:**
- Breaking down complexity into subtasks
- Work spans multiple sessions
- Context needs to persist for handoffs
- Recording decisions for future reference

**Skip Overseer when:**
- Work is a single atomic action
- Everything fits in one message exchange
- TodoWrite is sufficient

## Task Hierarchies

Three levels: **Milestone** (depth 0) -> **Task** (depth 1) -> **Subtask** (depth 2)

| Level | Purpose | Example |
|-------|---------|---------|
| Milestone | Large initiative | "Add user authentication" |
| Task | Significant work item | "Implement JWT middleware" |
| Subtask | Atomic step | "Add token verification" |

## Basic Workflow

```javascript
// 1. Get next ready task
const task = await tasks.nextReady();
if (!task) return "No ready tasks";

// 2. Review context
console.log(task.context.own);       // This task's context
console.log(task.context.parent);    // Parent's context

// 3. Start work (creates bookmark, records start commit)
await tasks.start(task.id);

// 4. Implement...

// 5. Complete with learnings
await tasks.complete(task.id, {
  result: "Implemented login endpoint with JWT tokens",
  learnings: ["bcrypt rounds should be 12 for production"]
});
```

## API Summary

| Method | Returns | Notes |
|--------|---------|-------|
| `tasks.get(id)` | TaskWithContext | Full context chain |
| `tasks.nextReady()` | TaskWithContext | Deepest ready leaf |
| `tasks.list()` | Task[] | Basic fields only |
| `tasks.create()` | Task | New task |
| `tasks.start(id)` | Task | Begin work |
| `tasks.complete(id, opts)` | Task | Finish with result |

## Blockers

```javascript
// taskA waits for taskB
await tasks.block(taskA.id, taskB.id);

// Remove blocker
await tasks.unblock(taskA.id, taskB.id);
```

## Best Practices

1. **Right-size tasks**: Completable in one focused session
2. **Clear completion criteria**: Context should define "done"
3. **Don't over-decompose**: 3-7 children per parent
4. **Action-oriented descriptions**: Start with verbs
5. **Verify before completing**: Tests passing, manual testing done
