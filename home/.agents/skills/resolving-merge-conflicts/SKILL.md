---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

# Resolve merge conflicts

1. Inspect `git status`, the active operation, unmerged paths, and existing worktree changes. Preserve changes unrelated to the conflict.
2. Recover both intents from the base, ours, theirs, relevant commits, nearby code, and tests. Consult issues or PRs only when local evidence is insufficient.
3. Resolve each hunk without inventing unrelated behavior. Preserve both intents when compatible; when they conflict, follow the operation's stated goal or ask if the choice materially changes behavior.
4. Review each resolved diff, then stage only the resolved paths. Confirm `git diff --name-only --diff-filter=U` is empty and run the smallest relevant checks.
5. Report the resolution, checks, trade-offs, and remaining Git state. Continue, commit, skip, or abort only when the user explicitly requested it or that action is unambiguously part of the task.
