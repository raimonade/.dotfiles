# Review useEffect Usage

Review React code for unnecessary `useEffect` based on react.dev guidelines.

User guidance: $ARGUMENTS

## Scope Resolution

1. If `$ARGUMENTS` specifies a path or glob, search that scope
2. If `$ARGUMENTS` says "diff to main" or similar, use `git diff main...HEAD -- '*.tsx' '*.jsx'`
3. If `$ARGUMENTS` says "whole codebase", search all `.tsx`/`.jsx` files
4. Otherwise, default to `git diff HEAD -- '*.tsx' '*.jsx'` (staged + unstaged)
5. If no diff output, fall back to `git diff HEAD~1 -- '*.tsx' '*.jsx'` (last commit)

## Anti-Patterns (Flag These)

### High Confidence — always flag

**1. Derived state in effect** — calculate during render
```tsx
// Bad: effect sets state derived from other state/props
useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
// Fix: const fullName = first + ' ' + last;
```

**2. Expensive derived state in effect** — use `useMemo`
```tsx
// Bad: effect filters/transforms data into state
useEffect(() => { setFiltered(items.filter(pred)); }, [items]);
// Fix: const filtered = useMemo(() => items.filter(pred), [items]);
```

**3. Full state reset on prop change** — use `key`
```tsx
// Bad: effect resets all local state when prop changes
useEffect(() => { setComment(''); setRating(0); }, [userId]);
// Fix: <Profile userId={userId} key={userId} />
```

**4. Form submit / user action in effect** — handle in event handler
```tsx
// Bad: effect fires POST when flag state changes
useEffect(() => { if (submitted) post('/api/submit', data); }, [submitted]);
// Fix: function handleSubmit() { post('/api/submit', data); }
```

**5. Notifying parent on state change** — call callback in the event handler that caused the change

**6. Chains of effects** — one effect sets state that triggers another effect; collapse into single computation or event handler

### Medium Confidence — flag with context

**7. Partial state reset on prop change** — only when `key` won't work (need to preserve some state). Suggest the render-time adjustment pattern but note it's unusual:
```tsx
const [prevItems, setPrevItems] = useState(items);
if (items !== prevItems) { setPrevItems(items); setSelection(null); }
```

**8. App initialization in `useEffect(fn, [])`** — only flag in SSR/Next.js/TanStack Start contexts where it causes hydration issues. In pure client SPAs, a `let didInit` guard or module-level call are both acceptable alternatives.

### Do NOT Flag

- Effects that synchronize with external systems (DOM measurement, resize observers, intersection observers, event listeners with cleanup)
- Effects in custom hooks that wrap external system subscriptions
- Effects with cleanup functions managing subscriptions/listeners
- Data-fetching effects (but DO suggest React Query/TanStack Query migration if the project already uses it, and flag missing cleanup/abort/race-condition handling)
- Effects with `ref` dependencies for DOM measurement
- Effects that integrate third-party libraries (charts, maps, editors)

## Process

1. **Determine scope** per rules above
2. **Find all `useEffect` calls** — search with `grep -rn 'useEffect' --include='*.tsx' --include='*.jsx'` within scope
3. **Read surrounding code** for each hit — understand deps array, body, and broader component context. Read full files, not just the matching line.
4. **Classify each effect**: necessary (external sync) | unnecessary (anti-pattern) | uncertain
5. **Report findings** using the format below
6. **Ask before applying fixes**

## Output Format

For each finding:

```
### file:line — [HIGH|MEDIUM] anti-pattern-name

**Current:** brief description of what the effect does
**Why unnecessary:** explanation referencing the specific anti-pattern
**Suggested fix:**
\`\`\`tsx
// replacement code
\`\`\`
```

Group by severity. End with:

```
## Summary
X effects analyzed, Y flagged (Z high confidence, W medium confidence)
```

## Guidelines

- Read full component files, not just grep matches — context matters
- Be conservative: if unsure, explain the tradeoff rather than flagging
- Don't flag pre-existing code outside the diff scope (unless scope is "whole codebase")
- No style zealotry — focus on correctness and performance, not aesthetics
- For data-fetching effects: don't flag as unnecessary, but note missing abort controllers or race-condition guards
