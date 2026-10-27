# Queue memory-heavy pnpm/vp jobs machine-wide (see ~/.local/lib/heavy-slot/heavy-slot).
# Named zz- so it loads after vite-plus.fish, which moves ~/.vite-plus/bin to the front of PATH.
if test -x "$HOME/.local/lib/heavy-slot/heavy-slot"
    fish_add_path --global --move --path "$HOME/.local/lib/heavy-slot/bin"
end
