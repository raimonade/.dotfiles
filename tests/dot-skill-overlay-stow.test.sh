#!/usr/bin/env bash

set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
test_root=$(mktemp -d "${TMPDIR:-/tmp}/dot-skill-overlay-stow.XXXXXX")
trap 'rm -rf "$test_root"' EXIT

mkdir -p \
    "$test_root/repo/home/.agents/skills/plannotator/agents" \
    "$test_root/repo/home/.claude/skills" \
    "$test_root/repo/home/.cursor/skills" \
    "$test_root/home/.claude/skills/plannotator/agents" \
    "$test_root/home/.claude/skills/unrelated-plugin" \
    "$test_root/home/.cursor"

cp "$repo_root/dot" "$test_root/repo/dot"
printf 'canonical\n' > "$test_root/repo/home/.agents/skills/plannotator/SKILL.md"
printf 'agent\n' > "$test_root/repo/home/.agents/skills/plannotator/agents/openai.yaml"
ln -s ../../.agents/skills/plannotator "$test_root/repo/home/.claude/skills/plannotator"
ln -s ../../.agents/skills/plannotator "$test_root/repo/home/.cursor/skills/plannotator"

printf 'stale-copy\n' > "$test_root/home/.claude/skills/plannotator/SKILL.md"
printf 'stale-agent\n' > "$test_root/home/.claude/skills/plannotator/agents/openai.yaml"
printf 'plugin\n' > "$test_root/home/.claude/skills/unrelated-plugin/SKILL.md"
printf 'cursor-local\n' > "$test_root/home/.cursor/argv.json"

fail() {
    echo "dot skill overlay stow test failed: $*" >&2
    exit 1
}

export HOME="$test_root/home"
# shellcheck source=/dev/null
source "$test_root/repo/dot"

__stow_dotfiles || fail "stow aborted on an overlay-managed real skill directory"

[[ -L "$HOME/.claude/skills/plannotator" ]] || fail "plannotator should be the overlay symlink"
[[ "$(<"$HOME/.claude/skills/plannotator/SKILL.md")" == canonical ]] || fail "overlay should expose the canonical skill"
[[ -f "$HOME/.claude/skills/unrelated-plugin/SKILL.md" ]] || fail "host-only plugin skills must survive"
[[ -f "$HOME/.cursor/argv.json" ]] || fail "existing ~/.cursor files must survive"
[[ -L "$HOME/.cursor/skills" || -L "$HOME/.cursor/skills/plannotator" ]] || fail "cursor overlay was not stowed"

quarantined=$(find "$HOME/.claude/skills-conflicts-disabled" -mindepth 2 -maxdepth 2 -type d -name plannotator)
[[ -n "$quarantined" ]] || fail "colliding copy was not quarantined"
[[ "$(<"$quarantined/SKILL.md")" == stale-copy ]] || fail "quarantine should keep the colliding copy"

echo 'dot skill overlay stow tests passed'
