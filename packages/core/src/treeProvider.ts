import * as vscode from "vscode";
import { detectFiles } from "./fileWatcher";
import type { DetectedFile, ToolId } from "./types";
import { TOOLS, getToolById } from "./types";

export class RulesTreeProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private filesByTool = new Map<ToolId, DetectedFile[]>();

  constructor(private readonly workspaceRoot: vscode.Uri) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      // Root level: return tool groups
      this.filesByTool = await detectFiles(this.workspaceRoot);
      return TOOLS.map((tool) => {
        const files = this.filesByTool.get(tool.id) ?? [];
        const hasFiles = files.length > 0;
        return new ToolGroupItem(
          tool.id,
          tool.label,
          hasFiles,
          hasFiles
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.Collapsed,
        );
      });
    }

    if (element instanceof ToolGroupItem) {
      const files = this.filesByTool.get(element.toolId) ?? [];
      if (files.length === 0) {
        return [new PlaceholderItem(element.toolId)];
      }
      return files.map((f) => new RuleFileItem(f));
    }

    return [];
  }

  getConfiguredCount(): { configured: number; total: number } {
    return {
      configured: this.filesByTool.size,
      total: TOOLS.length,
    };
  }

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}

type TreeItem = ToolGroupItem | RuleFileItem | PlaceholderItem;

class ToolGroupItem extends vscode.TreeItem {
  constructor(
    public readonly toolId: ToolId,
    label: string,
    hasFiles: boolean,
    collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    const displayLabel = hasFiles ? label : `${label} (not configured)`;
    super(displayLabel, collapsibleState);
    this.contextValue = hasFiles
      ? `configuredTool-${toolId}`
      : `unconfiguredTool-${toolId}`;
    this.iconPath = new vscode.ThemeIcon(hasFiles ? "folder" : "folder");
  }
}

class RuleFileItem extends vscode.TreeItem {
  constructor(file: DetectedFile) {
    super(file.relativePath, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: "vscode.open",
      title: "Open File",
      arguments: [vscode.Uri.file(file.absolutePath)],
    };
    this.contextValue = "ruleFile";
    this.iconPath = new vscode.ThemeIcon("file");
    this.tooltip = file.absolutePath;
    this.resourceUri = vscode.Uri.file(file.absolutePath);
  }
}

class PlaceholderItem extends vscode.TreeItem {
  constructor(toolId: ToolId) {
    const tool = getToolById(toolId);
    super("Click to create...", vscode.TreeItemCollapsibleState.None);
    this.contextValue = `placeholder-${toolId}`;
    this.iconPath = new vscode.ThemeIcon("add");
    this.tooltip = `Create ${tool.defaultFile}`;

    const commandMap: Record<ToolId, string> = {
      claude: "fnrules.createClaudeMd",
      cursor: "fnrules.createCursorrules",
      copilot: "fnrules.createCopilotInstructions",
      windsurf: "fnrules.createWindsurfrules",
      codex: "fnrules.createAgentsMd",
    };
    this.command = {
      command: commandMap[toolId],
      title: `Create ${tool.defaultFile}`,
    };
  }
}
