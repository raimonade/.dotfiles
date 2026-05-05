/**
 * Auto task titles for pi.
 *
 * - Gives unnamed sessions a short name based on the first user prompt
 * - Updates the terminal title so Ghostty tabs are easier to tell apart
 * - Keeps manual names intact; use built-in `/name ...` to override
 */

import path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

type SessionEntry = {
	type?: string;
	message?: {
		role?: string;
		content?: unknown;
	};
};

type ContentPart = {
	type?: string;
	text?: string;
};

const MAX_SESSION_NAME_LENGTH = 56;

function collapseWhitespace(text: string): string {
	return text.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

function shorten(text: string, maxLength = MAX_SESSION_NAME_LENGTH): string {
	if (text.length <= maxLength) {
		return text;
	}

	const truncated = text.slice(0, maxLength - 1).trimEnd().replace(/[.,;:!?-]+$/u, "").trimEnd();
	return `${truncated}…`;
}

function deriveSessionName(text: string | undefined): string | undefined {
	if (!text) {
		return undefined;
	}

	const firstUsefulLine = text
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.find((line) => line.length > 0 && !line.startsWith("```"));

	if (!firstUsefulLine) {
		return undefined;
	}

	const cleaned = collapseWhitespace(
		firstUsefulLine
			.replace(/^#+\s*/u, "")
			.replace(/^[-*+]\s+/u, "")
			.replace(/^\d+[.)]\s+/u, "")
			.replace(/^['"`]+|['"`]+$/gu, ""),
	);

	if (!cleaned) {
		return undefined;
	}

	return shorten(cleaned);
}

function extractText(content: unknown): string {
	if (typeof content === "string") {
		return content;
	}

	if (!Array.isArray(content)) {
		return "";
	}

	return content
		.flatMap((part) => {
			if (!part || typeof part !== "object") {
				return [];
			}

			const block = part as ContentPart;
			if (block.type === "text" && typeof block.text === "string") {
				return [block.text];
			}

			return [];
		})
		.join(" ");
}

function getExistingUserPromptName(ctx: { sessionManager: { getBranch(): unknown[] } }): string | undefined {
	for (const rawEntry of ctx.sessionManager.getBranch()) {
		const entry = rawEntry as SessionEntry;
		if (entry.type !== "message" || entry.message?.role !== "user") {
			continue;
		}

		const name = deriveSessionName(extractText(entry.message.content));
		if (name) {
			return name;
		}
	}

	return undefined;
}

function buildTerminalTitle(ctx: { cwd: string }, sessionName?: string): string {
	const cwdBasename = path.basename(ctx.cwd);
	return sessionName ? `π - ${sessionName} - ${cwdBasename}` : `π - ${cwdBasename}`;
}

export default function taskTitleExtension(pi: ExtensionAPI) {
	let pendingPromptNameSource: string | undefined;

	function syncTerminalTitle(ctx: { cwd: string; hasUI: boolean; ui: { setTitle(title: string): void } }) {
		if (!ctx.hasUI) {
			return;
		}

		ctx.ui.setTitle(buildTerminalTitle(ctx, pi.getSessionName()?.trim() || undefined));
	}

	function autoNameSession(text: string | undefined, ctx: { cwd: string; hasUI: boolean; ui: { setTitle(title: string): void } }) {
		if (pi.getSessionName()?.trim()) {
			syncTerminalTitle(ctx);
			return;
		}

		const name = deriveSessionName(text);
		if (!name) {
			syncTerminalTitle(ctx);
			return;
		}

		pi.setSessionName(name);
		syncTerminalTitle(ctx);
	}

	pi.on("input", async (event) => {
		if (event.source === "extension") {
			pendingPromptNameSource = undefined;
			return { action: "continue" };
		}

		const text = event.text.trim();
		if (!text || text.startsWith("/") || text.startsWith("!")) {
			pendingPromptNameSource = undefined;
			return { action: "continue" };
		}

		pendingPromptNameSource = text;
		return { action: "continue" };
	});

	pi.on("session_start", async (_event, ctx) => {
		pendingPromptNameSource = undefined;

		if (!pi.getSessionName()?.trim()) {
			const existingName = getExistingUserPromptName(ctx);
			if (existingName) {
				pi.setSessionName(existingName);
			}
		}

		syncTerminalTitle(ctx);
	});

	pi.on("before_agent_start", async (event, ctx) => {
		autoNameSession(pendingPromptNameSource ?? event.prompt, ctx);
		pendingPromptNameSource = undefined;
	});

	pi.on("session_shutdown", async () => {
		pendingPromptNameSource = undefined;
	});
}
