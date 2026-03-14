# Remove AI Slop

Check the diff against dev and remove AI-generated slop introduced in this branch.

## What to remove

- extra comments a human wouldn't add or inconsistent with the file
- decorative section divider comments (`// -----------`, `// -----`, `// ---` border lines and their `// Label — description` headers)
- extra defensive checks/try-catch abnormal for that codebase area (especially in trusted/validated codepaths)
- casts to `any` to work around type issues
- style inconsistent with the file
- unnecessary emoji usage

## Output

Report with only a 1-3 sentence summary of what changed.
