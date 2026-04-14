import { type ToolId, TOOLS } from "./types";

/**
 * Checks whether a relative file path belongs to a specific tool.
 * Pure logic -- no VS Code APIs needed.
 */
export function matchFileToTool(relativePath: string): ToolId | undefined {
  const normalized = relativePath.replace(/\\/g, "/");
  for (const tool of TOOLS) {
    for (const pattern of tool.patterns) {
      if (matchGlobPattern(normalized, pattern)) {
        return tool.id;
      }
    }
  }
  return undefined;
}

/**
 * Categorize a list of relative paths by tool.
 * Pure function suitable for unit testing.
 */
export function categorizeFiles(
  relativePaths: readonly string[],
): Map<ToolId, string[]> {
  const result = new Map<ToolId, string[]>();
  for (const p of relativePaths) {
    const toolId = matchFileToTool(p);
    if (toolId) {
      const existing = result.get(toolId) ?? [];
      existing.push(p.replace(/\\/g, "/"));
      result.set(toolId, existing);
    }
  }
  return result;
}

/**
 * Simple glob matcher that handles `*` (any segment chars) and `**` patterns
 * well enough for the patterns we use.
 */
export function matchGlobPattern(filePath: string, pattern: string): boolean {
  if (filePath === pattern) return true;

  if (pattern.includes("*")) {
    const regex = globToRegex(pattern);
    return regex.test(filePath);
  }

  return false;
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<GLOBSTAR>>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<<GLOBSTAR>>>/g, ".*");
  return new RegExp(`^${escaped}$`);
}
