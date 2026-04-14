import * as vscode from "vscode";
import { createWatchers } from "./fileWatcher";
import { createStatusBarItem, updateStatusBar } from "./statusBar";
import { getTemplate } from "./templates";
import { RulesTreeProvider } from "./treeProvider";
import type { ToolId } from "./types";
import { getToolById } from "./types";

export function activate(context: vscode.ExtensionContext): void {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return;
  }

  const workspaceRoot = workspaceFolder.uri;
  const treeProvider = new RulesTreeProvider(workspaceRoot);

  const treeView = vscode.window.createTreeView("fnrulesExplorer", {
    treeDataProvider: treeProvider,
    showCollapseAll: true,
  });

  const statusBarItem = createStatusBarItem(treeProvider);

  // Refresh tree and status bar together
  const refreshAll = async () => {
    treeProvider.refresh();
    // Small delay to let the tree provider fetch files before updating counts
    setTimeout(() => updateStatusBar(statusBarItem, treeProvider), 200);
  };

  // File watchers
  const watchers = createWatchers(workspaceRoot, refreshAll);

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("fnrules.refresh", refreshAll),
  );

  // Register create commands
  const createCommands: Array<{ command: string; toolId: ToolId }> = [
    { command: "fnrules.createClaudeMd", toolId: "claude" },
    { command: "fnrules.createCursorrules", toolId: "cursor" },
    { command: "fnrules.createCopilotInstructions", toolId: "copilot" },
    { command: "fnrules.createWindsurfrules", toolId: "windsurf" },
    { command: "fnrules.createAgentsMd", toolId: "codex" },
  ];

  for (const { command, toolId } of createCommands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, () =>
        createRuleFile(workspaceRoot, toolId),
      ),
    );
  }

  // Listen for tree view visibility changes to update status bar
  treeView.onDidChangeVisibility(() => {
    updateStatusBar(statusBarItem, treeProvider);
  });

  context.subscriptions.push(treeView, statusBarItem, ...watchers);
}

async function createRuleFile(
  workspaceRoot: vscode.Uri,
  toolId: ToolId,
): Promise<void> {
  const tool = getToolById(toolId);
  const filePath = vscode.Uri.joinPath(workspaceRoot, tool.defaultFile);

  try {
    await vscode.workspace.fs.stat(filePath);
    const overwrite = await vscode.window.showWarningMessage(
      `${tool.defaultFile} already exists. Overwrite?`,
      "Overwrite",
      "Cancel",
    );
    if (overwrite !== "Overwrite") return;
  } catch {
    // File doesn't exist, proceed
  }

  // Ensure parent directory exists
  const parentDir = vscode.Uri.joinPath(filePath, "..");
  try {
    await vscode.workspace.fs.createDirectory(parentDir);
  } catch {
    // Directory already exists
  }

  const template = getTemplate(toolId);
  await vscode.workspace.fs.writeFile(filePath, Buffer.from(template, "utf8"));

  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);

  vscode.commands.executeCommand("fnrules.refresh");
}

export function deactivate(): void {
  // Cleanup handled by disposables
}
