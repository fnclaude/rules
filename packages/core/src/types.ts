export type ToolId = "claude" | "cursor" | "copilot" | "windsurf" | "codex";

export interface ToolDefinition {
  readonly id: ToolId;
  readonly label: string;
  readonly patterns: readonly string[];
  readonly defaultFile: string;
}

export interface DetectedFile {
  readonly toolId: ToolId;
  readonly relativePath: string;
  readonly absolutePath: string;
}

export const TOOLS: readonly ToolDefinition[] = [
  {
    id: "claude",
    label: "Claude Code",
    patterns: ["CLAUDE.md", ".claude/CLAUDE.md", ".claude/rules/*.md"],
    defaultFile: "CLAUDE.md",
  },
  {
    id: "cursor",
    label: "Cursor",
    patterns: [".cursorrules", ".cursor/rules/*.mdc"],
    defaultFile: ".cursorrules",
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    patterns: [".github/copilot-instructions.md"],
    defaultFile: ".github/copilot-instructions.md",
  },
  {
    id: "windsurf",
    label: "Windsurf",
    patterns: [".windsurfrules"],
    defaultFile: ".windsurfrules",
  },
  {
    id: "codex",
    label: "Codex",
    patterns: ["AGENTS.md"],
    defaultFile: "AGENTS.md",
  },
] as const;

export function getToolById(id: ToolId): ToolDefinition {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
