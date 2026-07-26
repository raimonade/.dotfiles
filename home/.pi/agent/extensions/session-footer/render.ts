import { basename, isAbsolute, relative, resolve, sep } from "node:path";
import { stripVTControlCharacters } from "node:util";
import type { Theme } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

/** Thinking levels displayed by the session footer. */
export type FooterThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";

/** Theme operations used by the pure footer renderer. */
export interface FooterPalette {
  /** Style primary values. */
  text(value: string): string;
  /** Style location and source-control anchors. */
  accent(value: string): string;
  /** Style secondary values. */
  muted(value: string): string;
  /** Style tertiary labels and separators. */
  dim(value: string): string;
  /** Style warning-state values. */
  warning(value: string): string;
  /** Style error-state values. */
  error(value: string): string;
  /** Style the current reasoning level. */
  thinking(level: FooterThinkingLevel, value: string): string;
}

/** Snapshot required to render the session footer. */
export interface FooterState {
  /** Current working directory. */
  readonly cwd: string;
  /** Home directory used to abbreviate the working directory. */
  readonly home?: string;
  /** Active model provider. */
  readonly provider?: string;
  /** Active model identifier. */
  readonly model?: string;
  /** Active reasoning level, when the model supports reasoning. */
  readonly thinking?: FooterThinkingLevel;
  /** Current context-window utilization percentage. */
  readonly contextPercent?: number;
  /** Active context-window size in tokens. */
  readonly contextWindow?: number;
  /** Cumulative input tokens. */
  readonly inputTokens: number;
  /** Cumulative output tokens. */
  readonly outputTokens: number;
  /** Cumulative session cost in US dollars. */
  readonly cost: number;
  /** Current Git branch. */
  readonly branch?: string;
  /** Number of changed files in the working tree. */
  readonly dirtyFiles?: number;
  /** Status text contributed by other extensions. */
  readonly statuses: readonly string[];
}

const identity = (value: string): string => value;

/** Create a footer palette backed by Pi's semantic theme roles. */
export function createFooterPalette(theme: Theme, noColor = "NO_COLOR" in process.env): FooterPalette {
  if (noColor) {
    return {
      text: identity,
      accent: identity,
      muted: identity,
      dim: identity,
      warning: identity,
      error: identity,
      thinking: (_level, value) => value,
    };
  }

  const thinkingRoles = {
    off: "thinkingOff",
    minimal: "thinkingMinimal",
    low: "thinkingLow",
    medium: "thinkingMedium",
    high: "thinkingHigh",
    xhigh: "thinkingXhigh",
    max: "thinkingMax",
  } as const;

  return {
    text: (value) => theme.fg("text", value),
    accent: (value) => theme.fg("accent", value),
    muted: (value) => theme.fg("muted", value),
    dim: (value) => theme.fg("dim", value),
    warning: (value) => theme.fg("warning", value),
    error: (value) => theme.fg("error", value),
    thinking: (level, value) => theme.fg(thinkingRoles[level], value),
  };
}

/** Remove terminal control sequences and collapse a value to safe single-line text. */
export function sanitizeFooterText(value: string): string {
  return stripVTControlCharacters(value)
    .replace(/[\r\n\t]/g, " ")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Render a responsive session footer whose lines never exceed the supplied width. */
export function renderFooter(state: FooterState, width: number, palette: FooterPalette): string[] {
  if (width <= 0) return [""];
  if (width < 60) return [renderNarrow(state, width, palette)];
  return renderTwoLine(state, width, palette, width >= 100);
}

function renderTwoLine(state: FooterState, width: number, palette: FooterPalette, roomy: boolean): string[] {
  const separator = palette.dim(" · ");
  const cwd = palette.accent(formatCwd(state.cwd, state.home, roomy));
  const model = limitText(
    sanitizeFooterText(state.model ?? "no model"),
    Math.max(12, Math.floor(width * 0.28)),
  );
  const modelIdentity = roomy && state.provider
    ? `${palette.muted(limitText(sanitizeFooterText(state.provider), Math.max(10, Math.floor(width * 0.16))))}${palette.dim("/")}${palette.text(model)}`
    : palette.text(model);
  const thinking = state.thinking ? palette.thinking(state.thinking, state.thinking) : undefined;
  const identityRight = [modelIdentity, thinking].filter(isPresent).join(separator);

  const telemetry = [
    renderContext(state, palette, roomy),
    state.cost > 0 ? palette.muted(`$${state.cost.toFixed(3)}`) : undefined,
    roomy && state.inputTokens > 0 ? palette.dim(`↑${formatTokens(state.inputTokens)}`) : undefined,
    roomy && state.outputTokens > 0 ? palette.dim(`↓${formatTokens(state.outputTokens)}`) : undefined,
    ...renderStatuses(state.statuses, palette, roomy),
  ].filter(isPresent).join(separator);

  const sourceControl = [
    state.branch
      ? palette.accent(limitText(sanitizeFooterText(state.branch), Math.max(12, Math.floor(width * 0.3))))
      : undefined,
    state.dirtyFiles && state.dirtyFiles > 0 ? palette.warning(`dirty ${state.dirtyFiles}`) : undefined,
  ].filter(isPresent).join(separator);

  return [
    renderSides(cwd, identityRight, width),
    renderSides(telemetry, sourceControl, width),
  ];
}

function renderNarrow(state: FooterState, width: number, palette: FooterPalette): string {
  const separator = palette.dim(" · ");
  const cwd = palette.accent(limitText(formatCwd(state.cwd, state.home, false), Math.max(6, Math.floor(width * 0.22))));
  const model = palette.text(limitText(sanitizeFooterText(state.model ?? "no model"), Math.max(8, Math.floor(width * 0.3))));
  const context = renderContext(state, palette, false);
  const branch = state.branch
    ? palette.accent(limitText(sanitizeFooterText(state.branch), Math.max(6, Math.floor(width * 0.22))))
    : undefined;
  const fields = [cwd, model, context, branch].filter(isPresent);
  return truncateToWidth(fields.join(separator), width, palette.dim("…"));
}

function renderContext(state: FooterState, palette: FooterPalette, includeWindow: boolean): string {
  const percent = state.contextPercent;
  const percentLabel = percent === undefined ? "?" : `${Math.round(percent)}%`;
  const windowLabel = includeWindow && state.contextWindow
    ? `/${formatTokens(state.contextWindow)}`
    : "";
  const label = `ctx ${percentLabel}${windowLabel}`;
  if (percent !== undefined && percent >= 90) return palette.error(label);
  if (percent !== undefined && percent >= 75) return palette.warning(label);
  return palette.muted(label);
}

function renderStatuses(statuses: readonly string[], palette: FooterPalette, roomy: boolean): string[] {
  if (!roomy) return [];
  return statuses
    .map(sanitizeFooterText)
    .filter(Boolean)
    .slice(0, 3)
    .map(palette.muted);
}

function renderSides(left: string, right: string, width: number): string {
  if (!right) return truncateToWidth(left, width, "…");
  const rightWidth = visibleWidth(right);
  if (rightWidth >= width - 1) return truncateToWidth(right, width, "…");
  const leftWidth = Math.max(0, width - rightWidth - 2);
  const fittedLeft = truncateToWidth(left, leftWidth, "…");
  const padding = " ".repeat(Math.max(2, width - visibleWidth(fittedLeft) - rightWidth));
  return truncateToWidth(`${fittedLeft}${padding}${right}`, width, "…");
}

function formatCwd(cwd: string, home: string | undefined, roomy: boolean): string {
  const abbreviated = abbreviateHome(cwd, home);
  if (!roomy) return sanitizeFooterText(basename(abbreviated) || abbreviated || "?");

  const prefix = abbreviated.startsWith(`~${sep}`) ? `~${sep}` : abbreviated.startsWith("~/") ? "~/" : "";
  const body = prefix ? abbreviated.slice(prefix.length) : abbreviated;
  const parts = body.split(/[\\/]+/).filter(Boolean);
  const compact = parts.length <= 2 ? parts.join(sep) : `…${sep}${parts.slice(-2).join(sep)}`;
  return sanitizeFooterText(`${prefix}${compact}` || abbreviated || "?");
}

function abbreviateHome(cwd: string, home: string | undefined): string {
  if (!home) return cwd;
  const resolvedCwd = resolve(cwd);
  const resolvedHome = resolve(home);
  const fromHome = relative(resolvedHome, resolvedCwd);
  const insideHome = fromHome === "" || (fromHome !== ".." && !fromHome.startsWith(`..${sep}`) && !isAbsolute(fromHome));
  if (!insideHome) return cwd;
  return fromHome === "" ? "~" : `~${sep}${fromHome}`;
}

function formatTokens(count: number): string {
  if (count < 1_000) return `${count}`;
  if (count < 10_000) return `${(count / 1_000).toFixed(1)}k`;
  if (count < 1_000_000) return `${Math.round(count / 1_000)}k`;
  if (count < 10_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${Math.round(count / 1_000_000)}M`;
}

function limitText(value: string, width: number): string {
  return truncateToWidth(value, width, "…");
}

function isPresent(value: string | undefined): value is string {
  return Boolean(value);
}
