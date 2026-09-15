#!/usr/bin/env bash

set -euo pipefail

test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT

mkdir -p "$test_root/repo/home/.config/herdr" "$test_root/bin"
cp dot "$test_root/repo/dot"
printf '%s\n' '# managed plugins' 'plannotator/herdr-annotate' > "$test_root/repo/home/.config/herdr/plugins.txt"

cat > "$test_root/bin/herdr" <<'EOF'
#!/usr/bin/env bash
printf 'herdr %s\n' "$*" >> "$TOOL_CALLS"
[[ "$1 $2" != "status server" ]]
EOF

cat > "$test_root/bin/cua-driver" <<'EOF'
#!/usr/bin/env bash
printf 'cua-driver %s\n' "$*" >> "$TOOL_CALLS"
EOF

chmod +x "$test_root/bin/herdr" "$test_root/bin/cua-driver"
export PATH="$test_root/bin:$PATH"
export TOOL_CALLS="$test_root/tool-calls.log"

# shellcheck source=/dev/null
source "$test_root/repo/dot"

__sync_herdr_plugins
__install_cua_driver

grep -Fqx 'herdr plugin install plannotator/herdr-annotate --yes' "$TOOL_CALLS"
grep -Fqx 'herdr status server' "$TOOL_CALLS"
grep -Fqx 'cua-driver telemetry disable' "$TOOL_CALLS"

echo 'dot tool installer tests passed'
