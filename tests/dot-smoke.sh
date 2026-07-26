#!/usr/bin/env bash

set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/dot-smoke.XXXXXX")
sandbox=$(cd "$sandbox" && pwd -P)
trap 'rm -rf "$sandbox"' EXIT

mkdir -p "$sandbox/bin" "$sandbox/home" "$sandbox/repo/packages"
cp "$repo_root/dot" "$sandbox/repo/dot"
printf 'brew "alpha"\n' > "$sandbox/repo/packages/bundle"
printf 'brew "work-alpha"\n' > "$sandbox/repo/packages/bundle.work"
log="$sandbox/commands.log"

cat > "$sandbox/bin/git" <<'STUB'
#!/usr/bin/env bash
printf 'git %s\n' "$*" >> "$DOT_SMOKE_LOG"
case "${1:-}" in
    rev-parse)
        echo true
        ;;
    log)
        echo '0123456789abcdef|Test Author|2026-07-26|Test commit'
        ;;
    show)
        echo 'M test.txt'
        ;;
esac
STUB

cat > "$sandbox/bin/brew" <<'STUB'
#!/usr/bin/env bash
printf 'brew %s\n' "$*" >> "$DOT_SMOKE_LOG"
if [[ "${1:-}" == update && "${FAIL_BREW_UPDATE:-0}" == 1 ]]; then
    exit 1
fi
if [[ "${1:-}" == outdated ]]; then
    echo example-package
fi
STUB

cat > "$sandbox/bin/stow" <<'STUB'
#!/usr/bin/env bash
printf 'stow %s\n' "$*" >> "$DOT_SMOKE_LOG"
STUB

cat > "$sandbox/bin/pi" <<'STUB'
#!/usr/bin/env bash
printf 'pi %s\n' "$*" >> "$DOT_SMOKE_LOG"
if [[ "${1:-}" == update ]]; then
    exit 0
fi
echo 'Stub commit summary.'
STUB

cat > "$sandbox/bin/pgrep" <<'STUB'
#!/usr/bin/env bash
exit 1
STUB

chmod +x "$sandbox/bin/"*
export DOT_SMOKE_LOG="$log"
export HOME="$sandbox/home"
export PATH="$sandbox/bin:$PATH"

fail() {
    echo "dot smoke test failed: $*" >&2
    exit 1
}

: > "$log"
"$sandbox/repo/dot" update >/dev/null
expected_update=$(cat <<EOF
git -C $sandbox/repo pull
brew update
brew outdated
brew upgrade --yes
stow -R -v -d $sandbox/repo -t $sandbox/home home
pi update
EOF
)
[[ "$(cat "$log")" == "$expected_update" ]] || fail "unexpected update command order"

: > "$log"
if "$sandbox/repo/dot" update extra >/dev/null 2>&1; then
    fail "update accepted an unexpected argument"
fi
[[ ! -s "$log" ]] || fail "argument validation ran update side effects"

: > "$log"
if FAIL_BREW_UPDATE=1 "$sandbox/repo/dot" update >/dev/null 2>&1; then
    fail "update ignored a Homebrew failure"
fi
if grep -Eq '^(stow|pi) ' "$log"; then
    fail "update continued after a Homebrew failure"
fi

"$sandbox/repo/dot" package add beta brew base >/dev/null
[[ "$(cat "$sandbox/repo/packages/bundle")" == $'brew "alpha"\nbrew "beta"' ]] || fail "package add did not preserve sorted bundle entries"
printf 'n\n' | "$sandbox/repo/dot" package remove beta base >/dev/null
[[ "$(cat "$sandbox/repo/packages/bundle")" == 'brew "alpha"' ]] || fail "package remove did not update the bundle"

summary_output=$(cd "$sandbox/repo" && ./dot summary -n 1 -d)
grep -q 'Stub commit summary.' <<< "$summary_output" || fail "summary did not return Pi output"
grep -q '^pi --no-session --no-tools -p @' "$log" || fail "summary did not invoke Pi headlessly"

bash -n "$sandbox/repo/dot"
echo "dot smoke test: PASS"
