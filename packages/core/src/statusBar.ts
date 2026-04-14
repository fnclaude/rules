import * as vscode from "vscode";
import type { RulesTreeProvider } from "./treeProvider";

export function createStatusBarItem(
  treeProvider: RulesTreeProvider,
): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  item.command = "fnrulesExplorer.focus";
  updateStatusBar(item, treeProvider);
  item.show();
  return item;
}

export function updateStatusBar(
  item: vscode.StatusBarItem,
  treeProvider: RulesTreeProvider,
): void {
  const { configured, total } = treeProvider.getConfiguredCount();
  item.text = `$(file-code) AI Rules: ${configured}/${total}`;
  item.tooltip = `${configured} of ${total} AI tools configured. Click to open AI Rules panel.`;
}
