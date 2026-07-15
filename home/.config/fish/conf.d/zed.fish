# Substitute Zed for upstream's Neovim editor while preserving blocking EDITOR semantics.
set -gx EDITOR "$HOME/.config/zed/zed-wait.sh"

if type -q zed
  set -gx VISUAL zed
else if type -q zed-preview
  set -gx VISUAL zed-preview
else
  set -gx VISUAL "$EDITOR"
end
