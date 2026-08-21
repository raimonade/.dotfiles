# Optional tracedecay auto-init + auto-gc: when explicitly enabled, index each git
# repo the first time you enter it and run throttled worktree-aware branch cleanup.
# Disabled by default because automatic indexing can consume substantial disk/RAM.
#
# Fully traceable:
#   tdtrace                     -> indexed projects + disk + recent auto-inits
#   tracedecay projects list    -> built-in registry of every indexed repo
#   ~/.tracedecay/auto-init.log -> timestamped START/DONE/SKIP per repo
#   du -sh ~/.tracedecay/projects
#
# Enable:  set -Ux TRACEDECAY_AUTOINIT 1     Disable:  set -e TRACEDECAY_AUTOINIT

function __tracedecay_autoinit --on-variable PWD
    status is-interactive; or return
    test "$TRACEDECAY_AUTOINIT" = 1; or return
    type -q tracedecay; or return

    # only at a real git repo root; never index $HOME itself
    set -l root (command git rev-parse --show-toplevel 2>/dev/null)
    test -n "$root"; or return
    test "$root" = "$HOME"; and return

    # act at most once per repo per shell session
    contains -- "$root" $__tracedecay_seen; and return
    set -g __tracedecay_seen $__tracedecay_seen "$root"

    set -l log "$HOME/.tracedecay/auto-init.log"
    if tracedecay projects search "$root" 2>/dev/null | string match -qr 'No projects matching'
        # not indexed yet -> full init in the background (worker autoloaded by name)
        echo (date '+%FT%T')"  START  $root" >>"$log"
        fish -c "__tracedecay_worker '$root' '$log'" &
        disown
    else
        # already indexed -> throttled (<=1/day) worktree-aware branch gc
        fish -c "__tracedecay_autogc '$root' '$log'" &
        disown
    end
end
