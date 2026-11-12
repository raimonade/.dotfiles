#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
coach="$repo_root/home/.local/bin/coach"
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/coach.XXXXXX")
trap 'rm -rf "$sandbox"' EXIT
mkdir -p "$sandbox/bin" "$sandbox/state"

# Stand-ins: plannotator answers with $REVIEW_DECISION; gh serves a pull request whose head is
# $PR_HEAD and whose patch is $PR_PATCH.
cat > "$sandbox/bin/plannotator" <<'STUB'
#!/bin/sh
printf '{"decision":"%s","message":""}\n' "${REVIEW_DECISION:-dismissed}"
STUB
cat > "$sandbox/bin/gh" <<'STUB'
#!/bin/sh
case "$1 $2" in
  "pr view") echo "${PR_HEAD:-0000}" ;;
  "pr diff") printf '%s\n' "${PR_PATCH:-}" ;;
esac
STUB
chmod +x "$sandbox/bin/plannotator" "$sandbox/bin/gh"

export PATH="$sandbox/bin:$PATH" XDG_STATE_HOME="$sandbox/state"
export GIT_CONFIG_GLOBAL=/dev/null GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
log="$sandbox/state/coach/log.jsonl"
fail() { echo "coach: FAIL: $*"; [ -f "$log" ] && cat "$log"; exit 1; }
gate() { "$coach" gate --cwd "$sandbox/repo" --command "$1" 2> "$sandbox/err"; }
blocked() { local status=0; gate "$1" || status=$?; [ "$status" -eq 2 ] || fail "$2 (exit $status)"; }
commit() { echo "$1" >> "$sandbox/repo/file" && git -C "$sandbox/repo" add file && git -C "$sandbox/repo" commit -qm "$1"; }

git init -q -b main "$sandbox/repo"
commit base
git -C "$sandbox/repo" checkout -q -b feature
commit change
cd "$sandbox/repo"

# Unrelated commands pass; a pull request without a review does not, in any spelling.
gate "git status" || fail "plain command blocked"
gate "gh pr view 12" || fail "read-only gh blocked"
blocked "gh pr create --fill" "create passed without review"
blocked "cd x && gh  pr ready" "chained ready passed without review"
blocked "gh pr merge --squash" "merge passed without review"
grep -q "coach review" "$sandbox/err" || fail "block message does not name the way forward"

# A dismissed or annotated review writes no receipt; an approval does.
REVIEW_DECISION=annotated "$coach" review 2> /dev/null && fail "annotated review wrote a receipt"
blocked "gh pr create --fill" "create passed after an unapproved review"
REVIEW_DECISION=approved "$coach" review > /dev/null || fail "approved review failed"
gate "gh pr create --fill" || fail "create blocked after approval"

# The receipt covers that diff only.
commit more
blocked "gh pr create --fill" "create passed on a diff changed after review"

# Agents cannot bypass: the command is refused at the gate and without a terminal.
blocked 'coach bypass "ship it now please"' "agent bypass passed the gate"
"$coach" bypass "ship it now please" < /dev/null 2> /dev/null && fail "bypass accepted without a terminal"
grep -q '"kind":"bypass"' "$log" && fail "bypass was logged without a terminal"

# A named pull request with another head is judged on its own patch.
export PR_HEAD=1111 PR_PATCH="diff --git a/x b/x"
blocked "gh pr merge 7 --squash" "merge of an unreviewed pull request passed"
REVIEW_DECISION=approved "$coach" review 7 > /dev/null || fail "pull request review failed"
gate "gh pr merge 7 --squash" || fail "merge blocked after its review"
PR_PATCH="diff --git a/y b/y" blocked "gh pr merge 7 --squash" "merge passed after the pull request changed"

# A session that committed must debrief once; one that did not is left alone.
hook() { printf '{"session_id":"%s","cwd":"%s","source":"startup"%s}' "$2" "$sandbox/repo" "${3:-}" | "$coach" hook "$1" 2> "$sandbox/err"; }
hook sessionstart s1 > /dev/null || fail "session start failed"
hook stop s1 || fail "stop blocked a session without commits"
commit session-work
status=0; hook stop s1 || status=$?
[ "$status" -eq 2 ] || fail "stop allowed a committed session without a debrief"
hook stop s1 ',"stop_hook_active":true' || fail "stop hook looped"
"$coach" debrief --session s1 --decision d --concept "merge base" --pointer file:1 2> /dev/null && fail "debrief accepted without a call"
"$coach" debrief --session s1 --decision d --call mine --right theirs --concept "merge base" --pointer file:1
hook stop s1 || fail "stop blocked after the debrief"

# Recall waits for the concept to age, and the scorecard counts what happened.
[ -z "$("$coach" question)" ] || fail "fresh concept offered for recall"
jq -c 'if .kind == "debrief" then .ts -= 3 * 86400 else . end' "$log" > "$log.aged" && mv "$log.aged" "$log"
[ "$("$coach" question)" = "$(printf 'merge base\tfile:1')" ] || fail "aged concept not offered for recall"
hook sessionstart s2 | grep -q 'recall question on "merge base"' || fail "session start did not ask the recall question"
"$coach" call --topic lock --mine global --agent per-row --verdict miss --why contention
"$coach" call --topic index --mine btree --agent btree --verdict match
card=$("$coach" scorecard --days 30)
for line in "Calls made first:   2  (match 1, partial 0, miss 1)" "Match rate:         50%" "Diffs reviewed:     2" \
    "Bypasses:           0" "  - lock: you said global; better was per-row (contention)"; do
    grep -qF -- "$line" <<< "$card" || fail "scorecard missing: $line"$'\n'"$card"
done
grep -q "reviewed 2, bypassed 0, blocked attempts [1-9]" <<< "$card" || fail "scorecard gate counts wrong"$'\n'"$card"

echo "coach: ok"
