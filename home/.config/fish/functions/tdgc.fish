# Safe, worktree-aware garbage-collect for tracedecay branch DBs.
#
# WHY NOT `tracedecay branch gc`: its native gc mis-detects branches that are
# checked out in linked git worktrees (Conductor workspaces) as "deleted" and
# removes LIVE branch DBs. This instead trusts `git show-ref`, which sees the
# shared refs/heads store across all worktrees, so it only prunes branches whose
# ref is genuinely gone.
#
# Usage:  tdgc            prune stale branch DBs in the current project
#         tdgc --dry-run  show what would be pruned, remove nothing
function tdgc --description 'tracedecay: safely prune branch DBs whose git ref is truly gone'
    type -q tracedecay; or return
    command git rev-parse --git-dir >/dev/null 2>&1; or begin
        echo "tdgc: not inside a git repo"
        return 1
    end
    set -l dry
    test "$argv[1]" = --dry-run; and set dry 1

    # candidates = tracked branches that are not current / default / serving.
    # TraceDecay's MCP JSON can include leading warning text and can wrap large
    # branch lists in a local retrieve handle, so unwrap the first JSON text that
    # actually contains branches instead of assuming content[0] is the payload.
    set -l candidates (tracedecay tool branch_list --json 2>/dev/null | python3 -c '
import json
import subprocess
import sys


def parse_json(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def text_items(payload):
    if not isinstance(payload, dict):
        return
    for item in payload.get("content", []):
        if isinstance(item, dict) and isinstance(item.get("text"), str):
            yield item["text"]


def unwrap(payload):
    if isinstance(payload, dict) and isinstance(payload.get("branches"), list):
        return payload

    if isinstance(payload, dict) and isinstance(payload.get("content"), str):
        nested = parse_json(payload["content"])
        if nested is not None:
            found = unwrap(nested)
            if found is not None:
                return found

    if isinstance(payload, dict) and payload.get("truncated") and payload.get("handle"):
        retrieved = subprocess.run(
            ["tracedecay", "tool", "retrieve", "--handle", payload["handle"], "--json"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        ).stdout
        found = parse_json(retrieved)
        if found is not None:
            return unwrap(found)

    for text in text_items(payload):
        nested = parse_json(text)
        if nested is None:
            continue
        found = unwrap(nested)
        if found is not None:
            return found

    return None


outer = parse_json(sys.stdin.read())
branches_payload = unwrap(outer) if outer is not None else None
if branches_payload is None:
    raise SystemExit("tdgc: could not find branches in tracedecay branch_list output")

for branch in branches_payload["branches"]:
    if not (branch.get("is_current") or branch.get("is_default") or branch.get("is_serving")):
        name = branch.get("name")
        if name:
            print(name)
')
    if test $status -ne 0
        echo "tdgc: could not read tracedecay branch list"
        return 1
    end
    set -l pruned 0
    for b in $candidates
        # keep if the ref still exists in git (worktrees share refs/heads)
        git show-ref --verify --quiet "refs/heads/$b"; and continue
        if set -q dry[1]
            echo "would prune  $b"
        else
            echo "prune  $b"
            tracedecay branch remove "$b" >/dev/null 2>&1; and set pruned (math $pruned + 1)
        end
    end
    if set -q dry[1]
        echo "tdgc: dry-run only, nothing removed"
    else
        echo "tdgc: pruned $pruned stale branch(es)  ["(du -sh "$HOME/.tracedecay/projects" 2>/dev/null | cut -f1)" store]"
    end
end
