import assert from "node:assert/strict";
import test from "node:test";

import tracedecayToolDiet from "../tracedecay-tool-diet.ts";

const loadDiet = async (initiallyActive: string[] = []) => {
	const handlers = new Map<string, (() => void)[]>();
	const exposures = new Map<string, string>();
	const state = { active: initiallyActive };
	await tracedecayToolDiet({
		on: (name: string, handler: () => void) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
		registerTool: (tool: { name: string; exposure?: string }) => exposures.set(tool.name, tool.exposure ?? "direct"),
		registerCommand: () => {},
		getActiveTools: () => state.active,
		setActiveTools: (names: string[]) => {
			state.active = names;
		},
	} as never);
	return { exposures, state, emit: (name: string) => handlers.get(name)?.at(-1)?.() };
};

test("registers the routed tools as direct and the rest of the catalog as deferred", async () => {
	const { exposures } = await loadDiet();

	assert.equal(exposures.get("tracedecay_search"), "direct");
	assert.equal(exposures.get("tracedecay_work_create"), "deferred");
	assert.equal([...exposures.values()].filter((exposure) => exposure === "direct").length, 19);
	assert.ok(exposures.size > 200);
});

for (const event of ["session_start", "session_tree"]) {
	test(`${event} drops a catalog recorded as active by an older session`, async () => {
		const { state, emit } = await loadDiet(["read", "tracedecay_search", "tracedecay_work_create", "mcp"]);

		emit(event);

		assert.deepEqual(state.active, ["read", "tracedecay_search", "mcp"]);
	});
}

const makeCheckoutWithWorktree = async () => {
	const { execFileSync } = await import("node:child_process");
	const { mkdtempSync, realpathSync } = await import("node:fs");
	const { tmpdir } = await import("node:os");
	const { join } = await import("node:path");
	const root = realpathSync(mkdtempSync(join(tmpdir(), "td-route-")));
	const main = join(root, "main");
	const worktree = join(root, "wt");
	const git = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, stdio: "ignore" });
	execFileSync("git", ["init", "-q", main]);
	git(main, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "init");
	git(main, "worktree", "add", "-q", worktree);
	return { root, main, worktree };
};

test("a linked worktree routes to its main checkout; the main checkout and non-git dirs do not", async () => {
	const { resolveWorktreeIndexRoute } = await import("../tracedecay-tool-diet.ts");
	const { root, main, worktree } = await makeCheckoutWithWorktree();

	assert.deepEqual(await resolveWorktreeIndexRoute(worktree), { mainCheckoutRoot: main, worktreeRoot: worktree });
	assert.equal(await resolveWorktreeIndexRoute(main), undefined);
	assert.equal(await resolveWorktreeIndexRoute(root), undefined);
});

test("a routed tool runs from the main checkout and answers with worktree paths", async () => {
	const { routeToMainCheckoutIndex } = await import("../tracedecay-tool-diet.ts");
	const { main, worktree } = await makeCheckoutWithWorktree();
	const seenCwds: string[] = [];
	const tool = routeToMainCheckoutIndex({
		name: "tracedecay_search",
		execute: async (_id: string, _params: unknown, _signal: unknown, _onUpdate: unknown, ctx: { cwd: string }) => {
			seenCwds.push(ctx.cwd);
			return { content: [{ type: "text", text: `project_root: ${main}\n${main}/src/a.ts ${main}-other/b.ts` }] };
		},
	} as never);

	const routed = await tool.execute("1", {}, undefined, undefined, { cwd: worktree } as never);
	const unrouted = await tool.execute("2", {}, undefined, undefined, { cwd: main } as never);

	assert.deepEqual(seenCwds, [main, main]);
	const text = (routed.content[0] as { text: string }).text;
	assert.match(text, /^index: main checkout/);
	assert.ok(text.includes(`project_root: ${worktree}\n${worktree}/src/a.ts ${main}-other/b.ts`));
	assert.equal((unrouted.content[0] as { text: string }).text, `project_root: ${main}\n${main}/src/a.ts ${main}-other/b.ts`);
});
