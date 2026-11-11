/**
 * The TraceDecay installer registers its whole catalog (230 tools, ~120k
 * tokens of schema) as direct Pi tools. Declare only the ones AGENTS.md and
 * the tracedecay-cli skill route to; the rest stay registered and reachable
 * through `tracedecay tool <name>` or the `mcp` gateway.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const DECLARED_TRACEDECAY_TOOLS = new Set([
  "tracedecay_active_project",
  "tracedecay_affected",
  "tracedecay_callees",
  "tracedecay_callers",
  "tracedecay_context",
  "tracedecay_diagnose",
  "tracedecay_diagnostics",
  "tracedecay_diff_context",
  "tracedecay_files",
  "tracedecay_find_exact_symbol",
  "tracedecay_grep",
  "tracedecay_impact",
  "tracedecay_message_search",
  "tracedecay_retrieve",
  "tracedecay_search",
  "tracedecay_source_body",
  "tracedecay_source_outline",
  "tracedecay_status",
  "tracedecay_test_map",
]);

export default function tracedecayToolDiet(pi: ExtensionAPI) {
  pi.on("session_start", () => {
    const active = pi.getActiveTools();
    const kept = active.filter(
      (name) => !name.startsWith("tracedecay_") || DECLARED_TRACEDECAY_TOOLS.has(name),
    );
    if (kept.length !== active.length) pi.setActiveTools(kept);
  });
}
