/**
 * The TraceDecay installer registers its whole catalog (230 tools, ~120k
 * tokens of schema) as direct Pi tools, and Pi reactivates direct tools on
 * tree navigation. This loads the installer's extension itself (its own entry
 * is disabled in settings.json) and registers every tool outside the set
 * AGENTS.md and the tracedecay-cli skill route to as `deferred`: never
 * declared on its own, still reachable through codemode, `tool_search`,
 * `tracedecay tool <name>` or the `mcp` gateway.
 */
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { type ExtensionAPI, getAgentDir } from "@earendil-works/pi-coding-agent";

/**
 * The installer generates its extension per machine under Pi's agent
 * directory. Stow can link this file there from the dotfiles repo, so a
 * relative import would resolve beside the repo file instead.
 */
const loadTracedecayExtension = async (): Promise<(pi: ExtensionAPI) => void> => {
  const installed = join(getAgentDir(), "extensions", "tracedecay", "index.ts");
  const module: { default: (pi: ExtensionAPI) => void } = await import(pathToFileURL(installed).href);
  return module.default;
};

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

export default async function tracedecayToolDiet(pi: ExtensionAPI) {
  const tracedecayExtension = await loadTracedecayExtension();
  const registerTool: ExtensionAPI["registerTool"] = (tool) =>
    pi.registerTool(
      DECLARED_TRACEDECAY_TOOLS.has(tool.name) ? tool : { ...tool, exposure: "deferred" },
    );
  tracedecayExtension(
    new Proxy(pi, {
      get(target, property) {
        if (property === "registerTool") return registerTool;
        const value: unknown = Reflect.get(target, property);
        return typeof value === "function" ? value.bind(target) : value;
      },
    }),
  );

  // Sessions recorded before the catalog was deferred still list it as active.
  const dropRecordedCatalog = () => {
    const active = pi.getActiveTools();
    const kept = active.filter(
      (name) => !name.startsWith("tracedecay_") || DECLARED_TRACEDECAY_TOOLS.has(name),
    );
    if (kept.length !== active.length) pi.setActiveTools(kept);
  };
  pi.on("session_start", dropRecordedCatalog);
  pi.on("session_tree", dropRecordedCatalog);
}
