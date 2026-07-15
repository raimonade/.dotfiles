# Disable greeting
set fish_greeting

# Zed editor variables are configured in conf.d/zed.fish.
# Keep manpages terminal-native rather than opening a GUI editor.
set -gx MANPAGER 'less -R'

# Add dotfiles directory to PATH for 'dot' command
fish_add_path ~/.dotfiles
