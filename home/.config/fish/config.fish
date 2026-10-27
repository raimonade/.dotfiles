# CachyOS ships a base fish config (prompt helpers, aliases, completions).
# Layer the dotfiles on top of it when it is installed.
if test -r /usr/share/cachyos-fish-config/cachyos-config.fish
    source /usr/share/cachyos-fish-config/cachyos-config.fish
end

# Disable greeting
set fish_greeting

# Zed editor variables are configured in conf.d/zed.fish.
# Keep manpages terminal-native rather than opening a GUI editor.
set -gx MANPAGER 'less -R'

# Add dotfiles directory to PATH for 'dot' command
fish_add_path ~/.dotfiles

# opencode
test -d ~/.opencode/bin; and fish_add_path ~/.opencode/bin
