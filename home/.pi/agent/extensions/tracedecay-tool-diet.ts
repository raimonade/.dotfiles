/**
 * The TraceDecay installer registers its whole catalog (230 tools, ~120k
 * tokens of schema) as direct Pi tools, and Pi reactivates direct tools on
 * tree navigation. This loads the installer's extension itself (its own entry
 * is disabled in settings.json) and registers every tool outside the set
 * AGENTS.md and the tracedecay-cli skill route to as `deferred`: never
 * declared on its own, still reachable through codemode, `tool_search`,
 * `tracedecay tool <name>` or the `mcp` gateway.
 *
 * Linked worktrees are not indexed (one index per T3 worktree costs ~30 min and
 * several GB). A declared tool called from a linked worktree runs against the
 * main checkout's index instead, and main-checkout paths in its answer are
 * mapped back onto the worktree so edits land where the session works.
 */
import { execFile } from "node:child_process";
import { basename, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

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

/** A linked worktree and the main checkout whose index answers for it. */
export type WorktreeIndexRoute = {
  readonly mainCheckoutRoot: string;
  readonly worktreeRoot: string;
};

const runGit = promisify(execFile);
const routeByCwd = new Map<string, Promise<WorktreeIndexRoute | undefined>>();

/**
 * `undefined` means "query from cwd as-is": not a git checkout, the main
 * checkout itself, or a bare-repository worktree with no main checkout.
 */
export function resolveWorktreeIndexRoute(cwd: string): Promise<WorktreeIndexRoute | undefined> {
  let route = routeByCwd.get(cwd);
  if (route === undefined) {
    route = runGit(
      "git",
      ["rev-parse", "--path-format=absolute", "--git-dir", "--git-common-dir", "--show-toplevel"],
      { cwd, timeout: 5_000 },
    ).then(
      ({ stdout }) => {
        const [gitDir, commonDir, worktreeRoot] = stdout.trim().split("\n");
        if (!gitDir || !commonDir || !worktreeRoot) return undefined;
        if (gitDir === commonDir || basename(commonDir) !== ".git") return undefined;
        return { mainCheckoutRoot: dirname(commonDir), worktreeRoot };
      },
      () => undefined,
    );
    routeByCwd.set(cwd, route);
  }
  return route;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function mapMainCheckoutPaths(text: string, route: WorktreeIndexRoute): string {
  return text.replace(
    new RegExp(`${escapeRegExp(route.mainCheckoutRoot)}(?![\\w.-])`, "g"),
    route.worktreeRoot,
  );
}

type TracedecayTool = Parameters<ExtensionAPI["registerTool"]>[0];

function withCwd<Context extends { cwd: string }>(ctx: Context, cwd: string): Context {
  return new Proxy(ctx, {
    get(target, property) {
      if (property === "cwd") return cwd;
      const value: unknown = Reflect.get(target, property);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

/**
 * Every daemon call made from a linked worktree (lifecycle hooks, post-edit
 * sync, slash commands) opens a project server for that worktree, and the
 * daemon's code-index slots then run out before the main checkout mounts.
 */
async function inMainCheckout<Context extends { cwd: string }>(ctx: Context): Promise<Context> {
  const route = await resolveWorktreeIndexRoute(ctx.cwd);
  return route === undefined ? ctx : withCwd(ctx, route.mainCheckoutRoot);
}

export function routeToMainCheckoutIndex(tool: TracedecayTool): TracedecayTool {
  return {
    ...tool,
    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const route = await resolveWorktreeIndexRoute(ctx.cwd);
      if (route === undefined) return tool.execute(toolCallId, params, signal, onUpdate, ctx);
      const result = await tool.execute(
        toolCallId,
        params,
        signal,
        onUpdate,
        withCwd(ctx, route.mainCheckoutRoot),
      );
      const notice = `index: main checkout (this worktree is not indexed); confirm code your branch changed with read\n`;
      return {
        ...result,
        content: result.content.map((part, index) =>
          part.type === "text"
            ? { ...part, text: (index === 0 ? notice : "") + mapMainCheckoutPaths(part.text, route) }
            : part,
        ),
      };
    },
  };
}

/** The API the installer's extension sees: dieted tools, main-checkout routing. */
export function routeTracedecayApi(pi: ExtensionAPI): ExtensionAPI {
  const registerTool: ExtensionAPI["registerTool"] = (tool) =>
    pi.registerTool(
      DECLARED_TRACEDECAY_TOOLS.has(tool.name)
        ? routeToMainCheckoutIndex(tool)
        : { ...tool, exposure: "deferred" },
    );
  const on = ((event: string, handler: (payload: unknown, ctx: { cwd: string }) => unknown) =>
    pi.on(event as never, (async (payload: unknown, ctx: { cwd: string }) =>
      handler(payload, await inMainCheckout(ctx))) as never)) as ExtensionAPI["on"];
  const registerCommand: ExtensionAPI["registerCommand"] = (name, command) =>
    pi.registerCommand(name, {
      ...command,
      handler: async (args, ctx) => command.handler(args, await inMainCheckout(ctx)),
    });
  return new Proxy(pi, {
    get(target, property) {
      if (property === "registerTool") return registerTool;
      if (property === "on") return on;
      if (property === "registerCommand") return registerCommand;
      const value: unknown = Reflect.get(target, property);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

export default async function tracedecayToolDiet(pi: ExtensionAPI) {
  const tracedecayExtension = await loadTracedecayExtension();
  tracedecayExtension(routeTracedecayApi(pi));

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
