# Vite+ environment setup (https://viteplus.dev)
#
# Keep only environment behavior in startup configuration. Vite+'s generated
# Fish setup executes `vp` to install dynamic completion registration eagerly;
# completions/vp.fish and completions/vpr.fish register those completions lazily.
# Vite+ installs to ~/.vite-plus on macOS and under XDG data on Linux.
set -g __vp_bin "$HOME/.vite-plus/bin"
if not test -x "$__vp_bin/vp"; and test -x "$HOME/.local/share/vite-plus/bin/vp"
    set -g __vp_bin "$HOME/.local/share/vite-plus/bin"
end
fish_add_path --global --move --path "$__vp_bin"

# Vite+ global package directories contain `#`, which Jiti treats as a URL
# fragment while loading Pi extensions. Prefer the repo-owned npm install.
if test -x "$HOME/.pi/node_modules/.bin/pi"
    fish_add_path --global --move --path "$HOME/.pi/node_modules/.bin"
end

function vp --description "Run Vite+ and apply environment changes to this shell"
    if test (count $argv) -ge 2; and test "$argv[1]" = "env"; and test "$argv[2]" = "use"
        if contains -- -h $argv; or contains -- --help $argv
            command vp $argv
            return
        end
        set -lx VP_ENV_USE_EVAL_ENABLE 1
        set -l __vp_out (env FISH_VERSION=$FISH_VERSION "$__vp_bin/vp" $argv); or return $status
        eval (string join ';' $__vp_out)
    else
        command vp $argv
    end
end
