import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SimpleFrontmatterCodec } from "./parser.ts";
import { deriveSkillMetadata, getDuplicateFrontmatterKeys, hasDuplicateDisableModelInvocation } from "./validation.ts";

const codec = new SimpleFrontmatterCodec();

describe("frontmatter validation", () => {
  it("parses literal and folded block scalar descriptions", () => {
    const literal = codec.parse([
      "---",
      "name: discoverable-code",
      "description: |",
      "  Rules for writing code that agents can find.",
      "  Apply when naming exported symbols.",
      "---",
    ].join("\n"));
    const folded = codec.parse([
      "---",
      "name: discoverable-code",
      "description: >-",
      "  Rules for writing code that agents can find.",
      "  Apply when naming exported symbols.",
      "---",
    ].join("\n"));

    assert.equal(
      deriveSkillMetadata("/skills/discoverable-code/SKILL.md", literal).description,
      "Rules for writing code that agents can find.\nApply when naming exported symbols.",
    );
    assert.equal(
      deriveSkillMetadata("/skills/discoverable-code/SKILL.md", folded).description,
      "Rules for writing code that agents can find. Apply when naming exported symbols.",
    );
  });

  it("reports duplicate top-level frontmatter keys", () => {
    const doc = codec.parse([
      "---",
      "name: handoff",
      "description: Compact the conversation.",
      "disable-model-invocation: true",
      "argument-hint: What next?",
      "disable-model-invocation: true",
      "---",
      "",
    ].join("\n"));

    assert.deepEqual(getDuplicateFrontmatterKeys(doc), ["disable-model-invocation"]);
    assert.equal(hasDuplicateDisableModelInvocation(doc), true);
    assert.deepEqual(deriveSkillMetadata("/skills/handoff/SKILL.md", doc).diagnostics, [
      { severity: "warning", message: "Duplicate frontmatter key: disable-model-invocation" },
    ]);
  });
});
