# Trace what tracedecay has auto-indexed: registry, disk use, and recent auto-inits.
function tdtrace --description 'tracedecay: indexed projects, disk use, recent auto-inits'
    tracedecay projects list
    printf '\nstore: %s  (~/.tracedecay/projects)\n' (du -sh "$HOME/.tracedecay/projects" 2>/dev/null | cut -f1)
    if test -f "$HOME/.tracedecay/auto-init.log"
        printf '\nrecent auto-inits:\n'
        tail -n 12 "$HOME/.tracedecay/auto-init.log"
    end
end
