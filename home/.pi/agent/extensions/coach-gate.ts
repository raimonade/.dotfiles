/**
 * Coach gate
 *
 * Runs every `gh pr` command through `coach gate`, the same check Claude Code's PreToolUse hook
 * uses, so a pull request needs a human-approved review of its exact diff here too.
 * Protocol: ~/.agents/COACHING.md.
 */

import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";

const COACH_PATH = join(homedir(), ".local", "bin", "coach");

/** Commands worth the cost of spawning the gate; the gate itself decides. */
const GATED_COMMAND_RE = /\bgh\s+pr\b|\bcoach\s+bypass\b/;

const GATE_BLOCKED_EXIT = 2;

/**
 * Register the pull-request review gate on bash tool calls.
 *
 * @param pi - The pi extension API.
 */
export default function (pi: ExtensionAPI) {
	pi.on("tool_call", (event, ctx) => {
		if (!isToolCallEventType("bash", event)) return;
		if (!GATED_COMMAND_RE.test(event.input.command)) return;

		const gate = spawnSync(
			COACH_PATH,
			["gate", "--cwd", ctx.cwd, "--command", event.input.command],
			{ encoding: "utf8" },
		);
		if (gate.status === GATE_BLOCKED_EXIT) {
			return { block: true, reason: gate.stderr.trim() };
		}
	});
}
