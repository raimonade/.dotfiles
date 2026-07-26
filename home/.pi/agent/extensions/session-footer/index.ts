import type { AssistantMessage } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { createFooterPalette, renderFooter, sanitizeFooterText, type FooterThinkingLevel } from "./render.ts";

interface UsageTotals {
  readonly input: number;
  readonly output: number;
  readonly cost: number;
}

/** Install the responsive, theme-aware session footer. */
export default function sessionFooter(pi: ExtensionAPI): void {
  let activeContext: ExtensionContext | undefined;
  let dirtyFiles: number | undefined;
  let requestRender: (() => void) | undefined;
  let dirtyRefresh: Promise<void> | undefined;

  const refreshDirtyFiles = (ctx: ExtensionContext): Promise<void> => {
    if (dirtyRefresh) return dirtyRefresh;

    dirtyRefresh = pi.exec("git", ["status", "--porcelain=v1", "--untracked-files=normal"], {
      cwd: ctx.cwd,
      timeout: 2_000,
    }).then((result) => {
      const next = result.code === 0 ? countStatusEntries(result.stdout) : undefined;
      if (next !== dirtyFiles) {
        dirtyFiles = next;
        requestRender?.();
      }
    }).catch(() => {
      if (dirtyFiles !== undefined) {
        dirtyFiles = undefined;
        requestRender?.();
      }
    }).finally(() => {
      dirtyRefresh = undefined;
    });

    return dirtyRefresh;
  };

  const rememberContext = (ctx: ExtensionContext): void => {
    activeContext = ctx;
    requestRender?.();
  };

  pi.on("session_start", async (_event, ctx) => {
    rememberContext(ctx);
    if (ctx.mode !== "tui") return;

    ctx.ui.setFooter((tui, theme, footerData) => {
      requestRender = () => tui.requestRender();
      const unsubscribe = footerData.onBranchChange(() => {
        const current = activeContext;
        if (current) void refreshDirtyFiles(current);
        tui.requestRender();
      });

      return {
        render(width: number): string[] {
          const current = activeContext ?? ctx;
          const usage = collectUsage(current);
          const contextUsage = current.getContextUsage();
          const statuses = [...footerData.getExtensionStatuses().entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([, text]) => sanitizeFooterText(text));

          return renderFooter({
            cwd: current.cwd,
            home: process.env.HOME ?? process.env.USERPROFILE,
            provider: current.model?.provider,
            model: current.model?.id,
            thinking: current.model?.reasoning ? normalizeThinkingLevel(pi.getThinkingLevel()) : undefined,
            contextPercent: contextUsage?.percent ?? undefined,
            contextWindow: contextUsage?.contextWindow ?? current.model?.contextWindow,
            inputTokens: usage.input,
            outputTokens: usage.output,
            cost: usage.cost,
            branch: footerData.getGitBranch() ?? undefined,
            dirtyFiles,
            statuses,
          }, width, createFooterPalette(theme));
        },
        invalidate(): void {},
        dispose(): void {
          unsubscribe();
          requestRender = undefined;
        },
      };
    });

    await refreshDirtyFiles(ctx);
  });

  pi.on("model_select", async (_event, ctx) => rememberContext(ctx));
  pi.on("thinking_level_select", async (_event, ctx) => rememberContext(ctx));
  pi.on("message_end", async (_event, ctx) => rememberContext(ctx));
  pi.on("agent_settled", async (_event, ctx) => {
    rememberContext(ctx);
    await refreshDirtyFiles(ctx);
  });
  pi.on("session_shutdown", async () => {
    activeContext = undefined;
    requestRender = undefined;
    dirtyFiles = undefined;
  });
}

function collectUsage(ctx: ExtensionContext): UsageTotals {
  let input = 0;
  let output = 0;
  let cost = 0;

  for (const entry of ctx.sessionManager.getEntries()) {
    if (entry.type !== "message" || entry.message.role !== "assistant") continue;
    const message: AssistantMessage = entry.message;
    input += message.usage.input;
    output += message.usage.output;
    cost += message.usage.cost.total;
  }

  return { input, output, cost };
}

function countStatusEntries(output: string): number {
  return output.split("\n").filter(Boolean).length;
}

function normalizeThinkingLevel(level: string): FooterThinkingLevel {
  switch (level) {
    case "off":
    case "minimal":
    case "low":
    case "medium":
    case "high":
    case "xhigh":
    case "max":
      return level;
    default:
      return "off";
  }
}
