import * as vscode from "vscode";
import type { DetectedFile, ToolId } from "./types";
import { TOOLS } from "./types";

/**
 * Scan the workspace for all known AI rule files.
 * Returns files grouped by tool ID.
 */
export async function detectFiles(
  workspaceRoot: vscode.Uri,
): Promise<Map<ToolId, DetectedFile[]>> {
  const result = new Map<ToolId, DetectedFile[]>();

  for (const tool of TOOLS) {
    const files: DetectedFile[] = [];
    for (const pattern of tool.patterns) {
      const relPattern = new vscode.RelativePattern(workspaceRoot, pattern);
      const uris = await vscode.workspace.findFiles(relPattern);
      for (const uri of uris) {
        const relativePath = vscode.workspace.asRelativePath(uri, false);
        files.push({
          toolId: tool.id,
          relativePath: relativePath.replace(/\\/g, "/"),
          absolutePath: uri.fsPath,
        });
      }
    }
    if (files.length > 0) {
      result.set(tool.id, files);
    }
  }

  return result;
}

/**
 * Create file system watchers for all known AI rule file patterns.
 */
export function createWatchers(
  workspaceRoot: vscode.Uri,
  onChange: () => void,
): vscode.Disposable[] {
  const watchers: vscode.Disposable[] = [];

  for (const tool of TOOLS) {
    for (const pattern of tool.patterns) {
      const relPattern = new vscode.RelativePattern(workspaceRoot, pattern);
      const watcher = vscode.workspace.createFileSystemWatcher(relPattern);
      watcher.onDidCreate(onChange);
      watcher.onDidDelete(onChange);
      watcher.onDidChange(onChange);
      watchers.push(watcher);
    }
  }

  return watchers;
}
