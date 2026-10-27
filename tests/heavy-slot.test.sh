#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
shim_bin="$repo_root/home/.local/lib/heavy-slot/bin"
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/heavy-slot.XXXXXX")
trap 'rm -rf "$sandbox"' EXIT
mkdir -p "$sandbox/real" "$sandbox/state"

# Stand-in for the real pnpm: `pnpm <subcommand> <name> [seconds] [exit]` logs its start and end.
cat > "$sandbox/real/pnpm" <<'STUB'
#!/bin/sh
echo "start $2${HEAVY_SLOT_HELD:+ held}" >> "$LOG"
[ "$2" = long ] && exec sleep 30
case "${3:-}" in ""|*[!0-9.]*) sleep 0 ;; *) sleep "$3" ;; esac
echo "end $2" >> "$LOG"
exit "${4:-0}"
STUB
chmod +x "$sandbox/real/pnpm"

export PATH="$shim_bin:$sandbox/real:/usr/bin:/bin" XDG_STATE_HOME="$sandbox/state" LOG="$sandbox/log" HEAVY_SLOTS=1
unset HEAVY_SLOT HEAVY_SLOT_HELD HEAVY_SLOT_MIN_FREE_GB
fail() { echo "heavy-slot: FAIL: $*"; cat "$LOG"; exit 1; }
expect_log() { [ "$(cat "$LOG")" = "$1" ] || fail "$2"; : > "$LOG"; }
: > "$LOG"

# Heavy jobs queue; light, long-running and nested ones never wait behind a held slot.
pnpm test first 1.5 & first=$!
sleep 0.4
pnpm test second 0 2>/dev/null & second=$!
sleep 0.2
pnpm install light
pnpm test devserver --watch
HEAVY_SLOT_HELD=1 pnpm test nested
wait "$first" "$second"
expect_log "$(printf '%s\n' 'start first held' 'start light' 'end light' 'start devserver' 'end devserver' \
  'start nested held' 'end nested' 'end first' 'start second held' 'end second')" "queueing order"

pnpm test failing 0 7 && fail "exit status not propagated" || [ $? -eq 7 ] || fail "wrong exit status"
: > "$LOG"

# TERM to the shim reaches the job and frees the slot.
pnpm test long & long=$!
sleep 0.5
kill -TERM "$long"
wait "$long" && fail "terminated job reported success" || [ $? -eq 143 ] || fail "TERM not forwarded"
heavy-slot status | grep -qx 'slot 1: free' || fail "slot still held after TERM"
: > "$LOG"

# Below the free-memory floor a second job waits even with a slot open; a lone job still runs.
HEAVY_SLOTS=2 HEAVY_SLOT_MIN_FREE_GB=100000 pnpm test lone 1 & lone=$!
sleep 0.4
HEAVY_SLOTS=2 HEAVY_SLOT_MIN_FREE_GB=100000 pnpm test gated 0 2>/dev/null
wait "$lone"
expect_log "$(printf '%s\n' 'start lone held' 'end lone' 'start gated held' 'end gated')" "memory gate"

echo 'heavy-slot: PASS (queueing, pass-through, nesting, exit status, TERM, memory gate)'
