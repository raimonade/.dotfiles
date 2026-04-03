import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

type MessagePart = {
	type?: string;
	text?: string;
};

type SessionEntry = {
	type: string;
	message?: {
		role?: string;
		content?: unknown;
	};
};

const BUSY_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const MAX_SESSION_NAME_LENGTH = 72;

function cleanPrompt(text: string): string | null {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (!normalized) return null;
	if (normalized.startsWith("/") || normalized.startsWith("!")) return null;

	if (normalized.length <= MAX_SESSION_NAME_LENGTH) return normalized;
	return `${normalized.slice(0, MAX_SESSION_NAME_LENGTH - 1).trimEnd()}…`;
}

function extractText(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";

	return content
		.map((part) => {
			if (!part || typeof part !== "object") return "";
			const messagePart = part as MessagePart;
			return messagePart.type === "text" && typeof messagePart.text === "string"
				? messagePart.text
				: "";
		})
		.filter(Boolean)
		.join(" ");
}

function getExistingSessionCandidate(entries: SessionEntry[]): string | null {
	for (const entry of entries) {
		if (entry.type !== "message") continue;
		if (entry.message?.role !== "user") continue;

		const candidate = cleanPrompt(extractText(entry.message.content));
		if (candidate) return candidate;
	}

	return null;
}

function ensureSessionName(pi: ExtensionAPI, ctx: ExtensionContext, entries?: SessionEntry[]) {
	if (pi.getSessionName()) return;
	const candidate = entries ? getExistingSessionCandidate(entries) : null;
	if (!candidate) return;
	pi.setSessionName(candidate);
}

function buildTitle(pi: ExtensionAPI, cwd: string, prefix?: string): string {
	const project = path.basename(cwd);
	const sessionName = pi.getSessionName()?.trim();
	const base = sessionName ? `${sessionName} · ${project}` : project;
	return prefix ? `${prefix} π · ${base}` : `π · ${base}`;
}

export default function (pi: ExtensionAPI) {
	let timer: ReturnType<typeof setInterval> | null = null;
	let frameIndex = 0;
	let lastCwd = process.cwd();

	const updateTitle = (ctx: ExtensionContext, prefix?: string) => {
		lastCwd = ctx.cwd;
		ctx.ui.setTitle(buildTitle(pi, ctx.cwd, prefix));
	};

	const stopBusyTitle = (ctx: ExtensionContext) => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		frameIndex = 0;
		updateTitle(ctx);
	};

	const startBusyTitle = (ctx: ExtensionContext) => {
		stopBusyTitle(ctx);
		timer = setInterval(() => {
			const frame = BUSY_FRAMES[frameIndex % BUSY_FRAMES.length];
			ctx.ui.setTitle(buildTitle(pi, lastCwd, frame));
			frameIndex++;
		}, 90);
	};

	const maybeAutoName = (text: string, ctx: ExtensionContext) => {
		if (pi.getSessionName()) return;
		const candidate = cleanPrompt(text);
		if (!candidate) return;
		pi.setSessionName(candidate);
		updateTitle(ctx);
	};

	pi.on("session_start", async (_event, ctx) => {
		ensureSessionName(pi, ctx, ctx.sessionManager.getBranch() as SessionEntry[]);
		updateTitle(ctx);
	});

	pi.on("session_switch", async (_event, ctx) => {
		ensureSessionName(pi, ctx, ctx.sessionManager.getBranch() as SessionEntry[]);
		stopBusyTitle(ctx);
	});

	pi.on("input", async (event, ctx) => {
		const trimmed = event.text.trim();

		if (trimmed.startsWith("/name ")) {
			const manualName = trimmed.slice(6).trim();
			if (manualName) {
				pi.setSessionName(manualName);
				updateTitle(ctx);
			}
			return { action: "continue" };
		}

		maybeAutoName(trimmed, ctx);
		return { action: "continue" };
	});

	pi.on("agent_start", async (_event, ctx) => {
		startBusyTitle(ctx);
	});

	pi.on("agent_end", async (_event, ctx) => {
		stopBusyTitle(ctx);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		stopBusyTitle(ctx);
	});
}
