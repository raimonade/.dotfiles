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
