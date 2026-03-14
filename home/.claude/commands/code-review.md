# Code Review Command

Review code changes using THREE parallel @code-review subagents, then correlate results into a summary ranked by severity.

## Process

0. **Detect VCS**
   First, call `skill({ name: 'vcs-detect' })` to determine whether the repo uses git or jj, then use the appropriate VCS commands throughout.

1. **Detect changes to review**
   - jj: `jj status` and `jj diff` for uncommitted changes
   - git: `git status` and `git diff` for uncommitted changes
   - If no uncommitted changes, review the last commit (`jj show` or `git show`)
   - If user provides a PR number/link, use `gh pr diff <number>` to fetch it

2. **Spawn 3 parallel reviewer agents**
   ```
   Task({
     subagent_type: "reviewer",
     description: "Code review pass 1",
     prompt: "<diff content>\n\nFocus: bugs, logic errors, security"
   })
   Task({
     subagent_type: "reviewer",
     description: "Code review pass 2",
     prompt: "<diff content>\n\nFocus: architecture, patterns, structure"
   })
   Task({
     subagent_type: "reviewer",
     description: "Code review pass 3",
     prompt: "<diff content>\n\nFocus: edge cases, error handling, performance"
   })
   ```

3. **Correlate findings**
   - Deduplicate issues found by multiple reviewers
   - Rank by severity: critical > high > medium > low
   - Include file paths and line numbers

4. **Oracle deep review (NEVER SKIP)**
   Consult the oracle subagent with the correlated findings. It evaluates accuracy/correctness by examining surrounding code, subsystems, abstractions, and architecture.
   ```
   Task({
     subagent_type: "oracle",
     description: "Deep review of findings",
     prompt: "<correlated findings + file paths>\n\nEvaluate each finding for accuracy. Check surrounding code, system architecture, and abstractions. Flag false positives, confirm real issues, add any missed critical items."
   })
   ```
   Apply oracle recommendations: promote/demote severity, remove false positives, add missed issues.

5. **Output format**
   ```
   ## Critical
   - src/auth.ts:42 - SQL injection vulnerability (reviewers 1,3) [oracle: confirmed]

   ## High
   - src/api.ts:87 - missing error handling (reviewer 2) [oracle: confirmed]

   ## Medium
   - src/utils.ts:23 - potential null reference (reviewer 1) [oracle: false positive, guarded by L18]

   ## Summary
   X issues found across Y files (Z confirmed by oracle, W false positives removed)
   ```

## Guidelines

- Read full files, not just diffs - context matters
- Don't flag pre-existing code, only changes
- Be certain before flagging - investigate if unsure
- No style zealotry
- Matter-of-fact tone, no flattery

User guidance: $ARGUMENTS
