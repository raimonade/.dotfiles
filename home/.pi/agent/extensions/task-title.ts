/**
 * Manual session titles for Pi.
 *
 * - Keeps the terminal title in sync with the current Pi session name
 * - Does not make automatic/hidden model calls
 * - Use `/retitle [hint]` to generate a short title from a hint or recent conversation
 * - Keeps manual names intact; use built-in `/name ...` to override directly
 */

import path from "node:path";
import { completeSimple, type Model, type UserMessage } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

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

type RequestAuth =
	| { ok: true; apiKey?: string; headers?: Record<string, string> }
	| { ok: false; error: string };

type TitleContext = {
	cwd: string;
	hasUI: boolean;
	ui: {
		setTitle(title: string): void;
		notify(message: string, level: "info" | "warning" | "error"): void;
	};
	model?: Model<any>;
	modelRegistry: {
		getApiKeyAndHeaders(model: Model<any>): Promise<RequestAuth>;
	};
	signal?: AbortSignal;
	sessionManager: { getBranch(): unknown[] };
};

const MAX_SESSION_NAME_LENGTH = 56;
const MAX_MODEL_TITLE_LENGTH = 42;
const MAX_TITLE_SOURCE_LENGTH = 4_000;
const MAX_CONVERSATION_MESSAGES = 8;
const MAX_MESSAGE_EXCERPT_LENGTH = 900;
const TITLE_TIMEOUT_MS = 8_000;

const TITLE_SYSTEM_PROMPT = `You name coding-agent sessions.

Return exactly one concise title.

Rules:
- 2 to 6 words.
- ${MAX_MODEL_TITLE_LENGTH} characters or fewer.
- No quotes, emojis, markdown, labels, or trailing punctuation.
- Prefer a noun phrase or short imperative.
- Capture the underlying task, not the user's wording.
- Include "Pi" only when the task is about pi itself.`;

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

function truncateSource(text: string, maxLength = MAX_TITLE_SOURCE_LENGTH): string {
	const collapsed = collapseWhitespace(text);
	if (collapsed.length <= maxLength) {
		return collapsed;
	}

	return `${collapsed.slice(0, maxLength - 1).trimEnd()}…`;
}

function cleanGeneratedTitle(text: string): string | undefined {
	const firstUsefulLine = text
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.find((line) => line.length > 0 && !line.startsWith("```"));

	if (!firstUsefulLine) {
		return undefined;
	}

	const cleaned = collapseWhitespace(
		firstUsefulLine
			.replace(/^[-*+]\s+/u, "")
			.replace(/^\d+[.)]\s+/u, "")
			.replace(/^['"`“”‘’*_]+|['"`“”‘’*_]+$/gu, "")
			.replace(/^(user|assistant|session\s+)?title\s*:\s*/iu, "")
			.replace(/^(user|assistant)\s*:\s*/iu, "")
			.replace(/^['"`“”‘’*_]+|['"`“”‘’*_]+$/gu, "")
			.replace(/[.!?。！？]+$/u, "")
			.trim(),
	);

	if (!cleaned || cleaned.length < 3 || /^(untitled|none|n\/a)$/iu.test(cleaned)) {
		return undefined;
	}

	return shorten(cleaned, MAX_MODEL_TITLE_LENGTH);
}

function titleableInput(text: string | undefined): string | undefined {
	const collapsed = collapseWhitespace(text ?? "");
	if (!collapsed || collapsed.startsWith("/") || collapsed.startsWith("!")) {
		return undefined;
	}

	return collapsed;
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

function buildRecentConversationSource(ctx: TitleContext): string | undefined {
	const excerpts: string[] = [];

	for (const rawEntry of ctx.sessionManager.getBranch()) {
		const entry = rawEntry as SessionEntry;
		if (entry.type !== "message") {
			continue;
		}

		const role = entry.message?.role;
		if (role !== "user" && role !== "assistant") {
			continue;
		}

		const text = titleableInput(extractText(entry.message?.content));
		if (!text) {
			continue;
		}

		excerpts.push(`${role === "user" ? "User" : "Assistant"}: ${shorten(text, MAX_MESSAGE_EXCERPT_LENGTH)}`);
	}

	return excerpts.slice(-MAX_CONVERSATION_MESSAGES).join("\n") || undefined;
}

function buildTitlePrompt(source: string, ctx: TitleContext): string {
	return `Working directory: ${path.basename(ctx.cwd)}

Conversation or request excerpt:
<excerpt>
${truncateSource(source)}
</excerpt>

Return only the session title.`;
}

function buildTerminalTitle(ctx: { cwd: string }, sessionName?: string): string {
	const cwdBasename = path.basename(ctx.cwd);
	return sessionName ? `π - ${sessionName} - ${cwdBasename}` : `π - ${cwdBasename}`;
}

function syncTerminalTitle(pi: ExtensionAPI, ctx: { cwd: string; hasUI: boolean; ui: { setTitle(title: string): void } }) {
	if (!ctx.hasUI) {
		return;
	}

	ctx.ui.setTitle(buildTerminalTitle(ctx, pi.getSessionName()?.trim() || undefined));
}

function titleTemperature(model: Model<any>): number | undefined {
	const modelId = model.id.toLowerCase();
	const provider = model.provider.toLowerCase();

	if ((provider === "google" || provider === "google-vertex") && modelId.includes("gemini-3")) {
		return 1;
	}

	return model.reasoning ? undefined : 0.2;
}

function createTitleAbortSignal(parentSignal?: AbortSignal): { signal: AbortSignal; cleanup(): void } {
	const controller = new AbortController();
	const abort = () => controller.abort();
	const timeout = setTimeout(abort, TITLE_TIMEOUT_MS);

	if (parentSignal?.aborted) {
		abort();
	} else {
		parentSignal?.addEventListener("abort", abort, { once: true });
	}

	return {
		signal: controller.signal,
		cleanup() {
			clearTimeout(timeout);
			parentSignal?.removeEventListener("abort", abort);
		},
	};
}

async function generateTitle(source: string, ctx: TitleContext): Promise<string | undefined> {
	const model = ctx.model;
	if (!model || !model.input.includes("text")) {
		return undefined;
	}

	const auth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
	if (!auth.ok) {
		return undefined;
	}

	const titleSignal = createTitleAbortSignal(ctx.signal);
	try {
		const userMessage: UserMessage = {
			role: "user",
			content: [{ type: "text", text: buildTitlePrompt(source, ctx) }],
			timestamp: Date.now(),
		};
		const temperature = titleTemperature(model);
		const response = await completeSimple(
			model,
			{ systemPrompt: TITLE_SYSTEM_PROMPT, messages: [userMessage] },
			{
				apiKey: auth.apiKey,
				headers: auth.headers,
				signal: titleSignal.signal,
				maxTokens: 64,
				timeoutMs: TITLE_TIMEOUT_MS,
				maxRetries: 0,
				...(model.reasoning ? { reasoning: "minimal" as const } : {}),
				...(temperature === undefined ? {} : { temperature }),
			},
		);

		if (response.stopReason !== "stop" && response.stopReason !== "length") {
			return undefined;
		}

		const rawTitle = response.content
			.filter((content): content is { type: "text"; text: string } => content.type === "text")
			.map((content) => content.text)
			.join("\n");

		return cleanGeneratedTitle(rawTitle);
	} catch {
		return undefined;
	} finally {
		titleSignal.cleanup();
	}
}

function fallbackTitle(source: string): string | undefined {
	const firstUserLine = source
		.split(/\r?\n/u)
		.find((line) => /^user\s*:/iu.test(line));

	return cleanGeneratedTitle(firstUserLine ?? source);
}

async function retitleSession(pi: ExtensionAPI, source: string | undefined, ctx: TitleContext): Promise<boolean> {
	if (!source) {
		ctx.ui.notify("No conversation text available to title.", "warning");
		syncTerminalTitle(pi, ctx);
		return false;
	}

	const title = (await generateTitle(source, ctx)) ?? fallbackTitle(source);
	if (!title) {
		ctx.ui.notify("Could not generate a title from the current conversation.", "warning");
		syncTerminalTitle(pi, ctx);
		return false;
	}

	pi.setSessionName(title);
	syncTerminalTitle(pi, ctx);
	ctx.ui.notify(`Session named: ${title}`, "info");
	return true;
}

export default function taskTitleExtension(pi: ExtensionAPI) {
	pi.registerCommand("retitle", {
		description: "Regenerate the session title from a hint or recent conversation",
		handler: async (args, ctx) => {
			const source = titleableInput(args) ?? buildRecentConversationSource(ctx);
			await retitleSession(pi, source, ctx);
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		syncTerminalTitle(pi, ctx);
	});

	pi.on("before_agent_start", async (_event, ctx) => {
		syncTerminalTitle(pi, ctx);
	});

	pi.on("agent_end", async (_event, ctx) => {
		syncTerminalTitle(pi, ctx);
	});
}
