import type { FrontmatterDocument } from "../types.ts";

export interface FrontmatterCodec {
  parse(raw: string): FrontmatterDocument;
}

export class SimpleFrontmatterCodec implements FrontmatterCodec {
  parse(raw: string): FrontmatterDocument {
    const lineEnding: "\n" | "\r\n" = raw.includes("\r\n") ? "\r\n" : "\n";
    const opening = raw.match(/^---[ \t]*(\r?\n)/);
    if (!opening) {
      return {
        raw,
        hasFrontmatter: false,
        frontmatterStart: 0,
        frontmatterEnd: 0,
        contentStart: 0,
        frontmatterText: "",
        bodyText: raw,
        fields: {},
        lineEnding,
      };
    }

    const frontmatterStart = opening[0].length;
    const rest = raw.slice(frontmatterStart);
    const closing = /^---[ \t]*(?:\r?\n|$)/m.exec(rest);
    if (!closing || closing.index === undefined) {
      return {
        raw,
        hasFrontmatter: false,
        frontmatterStart: 0,
        frontmatterEnd: 0,
        contentStart: 0,
        frontmatterText: "",
        bodyText: raw,
        fields: {},
        lineEnding,
      };
    }

    const frontmatterEnd = frontmatterStart + closing.index;
    const contentStart = frontmatterEnd + closing[0].length;
    const frontmatterText = raw.slice(frontmatterStart, frontmatterEnd);

    return {
      raw,
      hasFrontmatter: true,
      frontmatterStart,
      frontmatterEnd,
      contentStart,
      frontmatterText,
      bodyText: raw.slice(contentStart),
      fields: parseYamlLikeFields(frontmatterText),
      lineEnding,
    };
  }
}

function parseYamlLikeFields(frontmatterText: string): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  const lines = frontmatterText.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(rawLine);
    if (!match?.[1]) continue;

    const blockStyle = /^([|>])[+-]?$/.exec((match[2] ?? "").trim())?.[1];
    if (blockStyle === "|" || blockStyle === ">") {
      const block = parseBlockScalar(lines, index + 1, blockStyle);
      fields[match[1]] = block.value;
      index = block.lastLineIndex;
      continue;
    }

    fields[match[1]] = parseScalar(match[2] ?? "");
  }
  return fields;
}

type ParsedBlockScalar = {
  readonly value: string;
  readonly lastLineIndex: number;
};

function parseBlockScalar(
  lines: readonly string[],
  firstLineIndex: number,
  style: "|" | ">",
): ParsedBlockScalar {
  const blockLines: string[] = [];
  let nextLineIndex = firstLineIndex;

  while (nextLineIndex < lines.length) {
    const line = lines[nextLineIndex] ?? "";
    if (line.length > 0 && !/^[ \t]/.test(line)) break;
    blockLines.push(line);
    nextLineIndex += 1;
  }

  const indentation = blockLines
    .filter((line) => line.trim().length > 0)
    .map((line) => /^[ \t]*/.exec(line)?.[0].length ?? 0);
  const commonIndentation = indentation.length > 0 ? Math.min(...indentation) : 0;
  const normalizedLines = blockLines.map((line) =>
    line.trim().length === 0 ? "" : line.slice(commonIndentation)
  );

  if (style === "|") {
    return { value: normalizedLines.join("\n"), lastLineIndex: nextLineIndex - 1 };
  }

  let value = "";
  for (let index = 0; index < normalizedLines.length; index += 1) {
    const line = normalizedLines[index] ?? "";
    const previousLine = normalizedLines[index - 1];
    if (index > 0) value += line.length === 0 || previousLine?.length === 0 ? "\n" : " ";
    value += line;
  }
  return { value, lastLineIndex: nextLineIndex - 1 };
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}
