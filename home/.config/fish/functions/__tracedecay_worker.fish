# Background worker for tracedecay auto-init. Autoloaded by name from `fish -c`.
# Indexes the repo at $root and appends the outcome (+ running store size) to $log.
function __tracedecay_worker --argument-names root log
    cd "$root"; or return
    if tracedecay init >/dev/null 2>&1
        set -l sz (du -sh "$HOME/.tracedecay/projects" 2>/dev/null | cut -f1)
        echo (date '+%FT%T')"  DONE   $root  [store: $sz]" >>"$log"
    else
        echo (date '+%FT%T')"  SKIP   $root  (already indexed / init declined)" >>"$log"
    end
end
