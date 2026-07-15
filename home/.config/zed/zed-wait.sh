#!/usr/bin/env sh

# Provide a blocking editor command for Git and terminal tools.
if command -v zed >/dev/null 2>&1; then
    exec zed --wait "$@"
fi

if command -v zed-preview >/dev/null 2>&1; then
    exec zed-preview --wait "$@"
fi

printf '%s\n' "Zed CLI was not found (tried zed and zed-preview)." >&2
exit 127
