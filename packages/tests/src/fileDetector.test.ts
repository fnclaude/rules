import { describe, expect, it } from "vitest";
import {
  categorizeFiles,
  matchFileToTool,
  matchGlobPattern,
} from "../../core/src/fileDetector";

describe("matchGlobPattern", () => {
  it("matches exact file names", () => {
    expect(matchGlobPattern("CLAUDE.md", "CLAUDE.md")).toBe(true);
    expect(matchGlobPattern(".cursorrules", ".cursorrules")).toBe(true);
    expect(matchGlobPattern(".windsurfrules", ".windsurfrules")).toBe(true);
    expect(matchGlobPattern("AGENTS.md", "AGENTS.md")).toBe(true);
  });

  it("matches glob patterns with wildcard", () => {
    expect(matchGlobPattern(".claude/rules/testing.md", ".claude/rules/*.md")).toBe(true);
    expect(matchGlobPattern(".claude/rules/style.md", ".claude/rules/*.md")).toBe(true);
    expect(matchGlobPattern(".cursor/rules/main.mdc", ".cursor/rules/*.mdc")).toBe(true);
  });

  it("does not match incorrect paths", () => {
    expect(matchGlobPattern("README.md", "CLAUDE.md")).toBe(false);
    expect(matchGlobPattern(".claude/CLAUDE.md", "CLAUDE.md")).toBe(false);
    expect(matchGlobPattern(".claude/rules/nested/deep.md", ".claude/rules/*.md")).toBe(false);
  });

  it("matches nested exact paths", () => {
    expect(matchGlobPattern(".claude/CLAUDE.md", ".claude/CLAUDE.md")).toBe(true);
    expect(
      matchGlobPattern(
        ".github/copilot-instructions.md",
        ".github/copilot-instructions.md",
      ),
    ).toBe(true);
  });
});

describe("matchFileToTool", () => {
  it("identifies Claude Code files", () => {
    expect(matchFileToTool("CLAUDE.md")).toBe("claude");
    expect(matchFileToTool(".claude/CLAUDE.md")).toBe("claude");
    expect(matchFileToTool(".claude/rules/testing.md")).toBe("claude");
  });

  it("identifies Cursor files", () => {
    expect(matchFileToTool(".cursorrules")).toBe("cursor");
    expect(matchFileToTool(".cursor/rules/main.mdc")).toBe("cursor");
  });

  it("identifies GitHub Copilot files", () => {
    expect(matchFileToTool(".github/copilot-instructions.md")).toBe("copilot");
  });

  it("identifies Windsurf files", () => {
    expect(matchFileToTool(".windsurfrules")).toBe("windsurf");
  });

  it("identifies Codex files", () => {
    expect(matchFileToTool("AGENTS.md")).toBe("codex");
  });

  it("returns undefined for non-rule files", () => {
    expect(matchFileToTool("README.md")).toBeUndefined();
    expect(matchFileToTool("package.json")).toBeUndefined();
    expect(matchFileToTool("src/index.ts")).toBeUndefined();
  });

  it("normalizes backslashes", () => {
    expect(matchFileToTool(".claude\\CLAUDE.md")).toBe("claude");
    expect(matchFileToTool(".claude\\rules\\testing.md")).toBe("claude");
    expect(matchFileToTool(".cursor\\rules\\main.mdc")).toBe("cursor");
  });
});

describe("categorizeFiles", () => {
  it("groups files by tool", () => {
    const files = [
      "CLAUDE.md",
      ".claude/rules/testing.md",
      ".cursorrules",
      ".github/copilot-instructions.md",
      "AGENTS.md",
      "README.md",
    ];

    const result = categorizeFiles(files);

    expect(result.get("claude")).toEqual([
      "CLAUDE.md",
      ".claude/rules/testing.md",
    ]);
    expect(result.get("cursor")).toEqual([".cursorrules"]);
    expect(result.get("copilot")).toEqual([".github/copilot-instructions.md"]);
    expect(result.get("codex")).toEqual(["AGENTS.md"]);
    expect(result.has("windsurf")).toBe(false);
  });

  it("returns empty map for no rule files", () => {
    const result = categorizeFiles(["README.md", "package.json"]);
    expect(result.size).toBe(0);
  });

  it("handles empty input", () => {
    const result = categorizeFiles([]);
    expect(result.size).toBe(0);
  });

  it("normalizes backslashes in output", () => {
    const result = categorizeFiles([".claude\\rules\\style.md"]);
    expect(result.get("claude")).toEqual([".claude/rules/style.md"]);
  });
});
