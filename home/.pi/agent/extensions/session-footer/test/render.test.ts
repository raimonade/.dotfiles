import assert from "node:assert/strict";
import test from "node:test";
import { visibleWidth } from "@earendil-works/pi-tui";
import {
  renderFooter,
  sanitizeFooterText,
  type FooterPalette,
  type FooterState,
} from "../render.ts";

const plainPalette: FooterPalette = {
  text: (value) => value,
  accent: (value) => value,
  muted: (value) => value,
  dim: (value) => value,
  warning: (value) => value,
  error: (value) => value,
  thinking: (_level, value) => value,
};

const state: FooterState = {
  cwd: "/Users/raimonds/Code/earendil/.dotfiles",
  home: "/Users/raimonds",
  provider: "openai-codex",
  model: "gpt-5.6-sol",
  thinking: "high",
  contextPercent: 42.4,
  contextWindow: 272_000,
  inputTokens: 12_345,
  outputTokens: 2_345,
  cost: 0.341,
  branch: "main",
  dirtyFiles: 3,
  statuses: ["fast", "subagents 2"],
};

test("roomy footer renders complete identity and telemetry in two bounded lines", () => {
  const lines = renderFooter(state, 120, plainPalette);

  assert.equal(lines.length, 2);
  assert.match(lines[0] ?? "", /~\/…\/earendil\/\.dotfiles/);
  assert.match(lines[0] ?? "", /openai-codex\/gpt-5\.6-sol · high/);
  assert.match(lines[1] ?? "", /ctx 42%\/272k · \$0\.341 · ↑12k · ↓2\.3k · fast · subagents 2/);
  assert.match(lines[1] ?? "", /main · dirty 3$/);
  assert.ok(lines.every((line) => visibleWidth(line) <= 120));
});

test("medium footer keeps high-value fields and drops low-priority telemetry", () => {
  const lines = renderFooter(state, 80, plainPalette);

  assert.equal(lines.length, 2);
  assert.match(lines[0] ?? "", /^\.dotfiles\s+gpt-5\.6-sol · high$/);
  assert.match(lines[1] ?? "", /^ctx 42% · \$0\.341\s+main · dirty 3$/);
  assert.doesNotMatch(lines.join("\n"), /openai-codex|↑|↓|subagents/);
  assert.ok(lines.every((line) => visibleWidth(line) <= 80));
});

test("narrow footer collapses to one essential line", () => {
  const lines = renderFooter(state, 50, plainPalette);

  assert.deepEqual(lines, [".dotfiles · gpt-5.6-sol · ctx 42% · main"]);
  assert.ok(visibleWidth(lines[0] ?? "") <= 50);
});

test("long right-side identifiers cannot evict higher-value telemetry", () => {
  const lines = renderFooter({
    ...state,
    model: `model-${"x".repeat(120)}`,
    branch: `feature/${"y".repeat(120)}`,
  }, 80, plainPalette);

  assert.match(lines[0] ?? "", /^\.dotfiles/);
  assert.match(lines[1] ?? "", /^ctx 42% · \$0\.341/);
  assert.ok(lines.every((line) => visibleWidth(line) <= 80));
});

test("plain palette produces a NO_COLOR-safe footer", () => {
  const lines = renderFooter({ ...state, contextPercent: 95 }, 120, plainPalette);

  assert.doesNotMatch(lines.join(""), /\u001b/);
  assert.match(lines[1] ?? "", /ctx 95%/);
});

test("sanitizer strips terminal escapes and line-breaking controls", () => {
  const unsafe = "feature/ok\u001b]8;;https://evil.example\u0007linked\u001b]8;;\u0007\nnext\tpart";

  assert.equal(sanitizeFooterText(unsafe), "feature/oklinked next part");
});
