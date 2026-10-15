#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
fish_bin=$(command -v fish)
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/fish-direnv-hook.XXXXXX")
trap 'rm -rf "$sandbox"' EXIT
mkdir -p "$sandbox/bin" "$sandbox/empty" "$sandbox/home"

cat > "$sandbox/bin/direnv" <<'STUB'
#!/bin/sh
[ "$1 $2" = "hook fish" ] || exit 1
printf 'set -gx DIRENV_TEST_HOOK loaded\n'
STUB
chmod +x "$sandbox/bin/direnv"

hook="$repo_root/home/.config/fish/conf.d/direnv.fish"
env -i HOME="$sandbox/home" PATH="$sandbox/bin" DIRENV_HOOK="$hook" \
    "$fish_bin" --no-config -c 'source "$DIRENV_HOOK"; test "$DIRENV_TEST_HOOK" = loaded'

env -i HOME="$sandbox/home" PATH="$sandbox/empty" DIRENV_HOOK="$hook" \
    "$fish_bin" --no-config -c 'source "$DIRENV_HOOK"; set -l hook_status $status; test $hook_status -eq 0; and not set -q DIRENV_TEST_HOOK'

# Prove normal startup loads the vendor hook, then shadows it by basename.
mkdir -p "$sandbox/vendor/fish/vendor_conf.d" "$sandbox/config/fish/conf.d"
printf 'set -gx DIRENV_VENDOR_HOOK loaded\n' > "$sandbox/vendor/fish/vendor_conf.d/direnv.fish"
env -i HOME="$sandbox/home" PATH="$sandbox/bin:/usr/bin:/bin" \
    XDG_CONFIG_HOME="$sandbox/config" XDG_DATA_DIRS="$sandbox/vendor" \
    "$fish_bin" -c 'test "$DIRENV_VENDOR_HOOK" = loaded'
cp "$hook" "$sandbox/config/fish/conf.d/direnv.fish"
env -i HOME="$sandbox/home" PATH="$sandbox/bin:/usr/bin:/bin" \
    XDG_CONFIG_HOME="$sandbox/config" XDG_DATA_DIRS="$sandbox/vendor" \
    "$fish_bin" -c 'test "$DIRENV_TEST_HOOK" = loaded; and not set -q DIRENV_VENDOR_HOOK'

echo 'Fish direnv hook: PASS (PATH lookup, missing executable, startup vendor shadowing)'
