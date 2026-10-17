#!/usr/bin/env bash
# Linux behaviour of `dot`: pacman/AUR installs, user-space installers, and the
# commands that must not touch Homebrew.

set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/dot-linux.XXXXXX")
sandbox=$(cd "$sandbox" && pwd -P)
trap 'rm -rf "$sandbox"' EXIT

mkdir -p "$sandbox/bin" "$sandbox/home" "$sandbox/repo/packages" "$sandbox/repo/home/.config/herdr"
cp "$repo_root/dot" "$sandbox/repo/dot"
printf '%s\n' 'plannotator/herdr-annotate' > "$sandbox/repo/home/.config/herdr/plugins.txt"
printf '%s\n' '# comment' 'present-pkg' 'missing-one  # trailing' '' 'missing-two' > "$sandbox/repo/packages/bundle.pacman"
printf '%s\n' 'aur-missing' > "$sandbox/repo/packages/bundle.aur"
log="$sandbox/commands.log"
: > "$log"

cat > "$sandbox/bin/pacman" <<'STUB'
#!/usr/bin/env bash
# `pacman -T` echoes the requested names that are not installed.
if [[ "${1:-}" == "-T" ]]; then
    shift
    for name in "$@"; do
        [[ "$name" == present-pkg ]] || echo "$name"
    done
    exit 0
fi
printf 'pacman %s\n' "$*" >> "$DOT_LINUX_LOG"
STUB

cat > "$sandbox/bin/sudo" <<'STUB'
#!/usr/bin/env bash
if [[ "${1:-}" == "-n" ]]; then
    [[ "${SUDO_OK:-1}" == 1 ]]
    exit
fi
printf 'sudo %s\n' "$*" >> "$DOT_LINUX_LOG"
exec "$@"
STUB

cat > "$sandbox/bin/yay" <<'STUB'
#!/usr/bin/env bash
printf 'yay %s\n' "$*" >> "$DOT_LINUX_LOG"
STUB

for tool in brew git stow pi; do
    cat > "$sandbox/bin/$tool" <<STUB
#!/usr/bin/env bash
printf '$tool %s\n' "\$*" >> "\$DOT_LINUX_LOG"
STUB
done

cat > "$sandbox/bin/herdr" <<'STUB'
#!/usr/bin/env bash
printf 'herdr %s\n' "$*" >> "$DOT_LINUX_LOG"
[[ "${1:-} ${2:-}" != "status server" ]]
STUB

chmod +x "$sandbox/bin/"*
export DOT_LINUX_LOG="$log"
export HOME="$sandbox/home"
export PATH="$sandbox/bin:/usr/bin:/bin"
export DOT_OS=Linux

fail() {
    echo "dot linux test failed: $*" >&2
    exit 1
}

# ── pacman + AUR ─────────────────────────────────────────────────────────────
# shellcheck source=/dev/null
source "$sandbox/repo/dot"

[[ "$(__read_package_manifest "$sandbox/repo/packages/bundle.pacman" | paste -sd' ')" == "present-pkg missing-one missing-two" ]] \
    || fail "manifest parser kept comments or blanks"

SUDO_OK=1 __install_system_packages >/dev/null
grep -Fqx 'sudo pacman -S --needed missing-one missing-two' "$log" || fail "pacman did not install only the missing packages"
grep -Fqx 'yay -S --needed aur-missing' "$log" || fail "AUR helper was not used for AUR packages"

: > "$log"
output=$(SUDO_OK=0 __install_system_packages </dev/null 2>&1)
[[ ! -s "$log" ]] || fail "installed packages without sudo"
grep -Fq 'sudo pacman -S --needed missing-one missing-two' <<< "$output" || fail "did not print the pacman command to run"

# ── update/doctor never reach Homebrew ───────────────────────────────────────
: > "$log"
"$sandbox/repo/dot" update >/dev/null
grep -q '^brew ' "$log" && fail "update called brew on Linux"
grep -Fqx 'pi update --extensions' "$log" || fail "update did not refresh pi packages"

for command in "package list" "check-packages" "retry-failed"; do
    # shellcheck disable=SC2086
    if "$sandbox/repo/dot" $command >/dev/null 2>&1; then
        fail "'dot $command' should be macOS-only"
    fi
done

# ── herdr + plannotator-tui ──────────────────────────────────────────────────
: > "$log"
__install_herdr >/dev/null
[[ ! -s "$log" ]] || fail "reinstalled herdr although it exists"

# Simulated release assets served by a curl stub.
asset="plannotator-tui-x86_64-unknown-linux-gnu"
printf 'binary-bytes' > "$sandbox/asset"
good_sum=$(sha256sum "$sandbox/asset" | awk '{ print $1 }')
cat > "$sandbox/bin/uname" <<'STUB'
#!/usr/bin/env bash
[[ "${1:-}" == "-m" ]] && echo x86_64 || echo Linux
STUB
cat > "$sandbox/bin/curl" <<'STUB'
#!/usr/bin/env bash
out="" url=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        -o) out="$2"; shift 2 ;;
        -*) shift ;;
        *) url="$1"; shift ;;
    esac
done
case "$url" in
    */SHA256SUMS) printf '%s  %s\n' "$SERVED_SUM" "plannotator-tui-x86_64-unknown-linux-gnu" > "$out" ;;
    *) cp "$ASSET_FILE" "$out" ;;
esac
STUB
chmod +x "$sandbox/bin/uname" "$sandbox/bin/curl"
export ASSET_FILE="$sandbox/asset"

SERVED_SUM="deadbeef" __install_plannotator_tui >/dev/null 2>&1 && fail "accepted a bad checksum"
[[ ! -e "$HOME/.local/bin/plannotator-tui" ]] || fail "installed binary despite checksum mismatch"

SERVED_SUM="$good_sum" __install_plannotator_tui >/dev/null
[[ -x "$HOME/.local/bin/plannotator-tui" ]] || fail "plannotator-tui was not installed"
[[ "$(cat "$HOME/.local/bin/plannotator-tui")" == "binary-bytes" ]] || fail "installed the wrong bytes"
: "$asset"

# ── ~/.pi/node_modules link ──────────────────────────────────────────────────
mkdir -p "$HOME/.pi" "$sandbox/repo/home/.pi/node_modules"
__link_pi_node_modules >/dev/null
[[ -L "$HOME/.pi/node_modules" ]] || fail "node_modules link missing"
[[ "$(readlink "$HOME/.pi/node_modules")" == "$sandbox/repo/home/.pi/node_modules" ]] || fail "node_modules link points elsewhere"
__link_pi_node_modules >/dev/null || fail "node_modules link is not idempotent"

echo "dot linux tests: PASS"
