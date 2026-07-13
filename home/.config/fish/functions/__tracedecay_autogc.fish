# Opportunistic, throttled garbage-collect for an already-indexed repo.
# Runs at most once per 24h per repo (stamp file), delegates the actual pruning
# to `tdgc` (worktree-aware: only removes branch DBs whose git ref is truly gone).
# Backgrounded by the PWD hook; only writes to the log when it reclaims something.
function __tracedecay_autogc --argument-names root log
    set -l key (echo -n "$root" | shasum | string sub -l 12)
    set -l stamp "$HOME/.tracedecay/gc-$key.stamp"
    if test -f "$stamp"
        set -l mtime (stat -f %m "$stamp" 2>/dev/null); or set mtime 0
        test (math (date +%s) - $mtime) -lt 86400; and return
    end
    touch "$stamp"

    cd "$root"; or return
    # tdgc prints "tdgc: pruned N ..." — log only when N>0 to keep the log signal-only
    set -l summary (tdgc 2>/dev/null | string match -r 'pruned [1-9]\d* .*')
    test -n "$summary"; and echo (date '+%FT%T')"  GC     $root  $summary" >>"$log"
end
