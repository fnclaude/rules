import { describe, expect, it } from "vitest";
import {
  getAllTemplates,
  getTemplate,
  hasTemplate,
} from "../../core/src/templates";
import type { ToolId } from "../../core/src/types";
import { TOOLS } from "../../core/src/types";

const ALL_TOOL_IDS: ToolId[] = ["claude", "cursor", "copilot", "windsurf", "codex"];

describe("getTemplate", () => {
  it.each(ALL_TOOL_IDS)("returns a non-empty template for %s", (toolId) => {
    const template = getTemplate(toolId);
    expect(template).toBeDefined();
    expect(template.length).toBeGreaterThan(0);
  });

  it("returns a template with markdown headers for claude", () => {
    const template = getTemplate("claude");
    expect(template).toContain("# Project Instructions");
    expect(template).toContain("## Overview");
    expect(template).toContain("## Code Style");
    expect(template).toContain("## Testing");
    expect(template).toContain("## Dependencies");
  });

  it("returns a template with markdown headers for cursor", () => {
    const template = getTemplate("cursor");
    expect(template).toContain("# Cursor Rules");
    expect(template).toContain("## Project Context");
    expect(template).toContain("## Architecture");
  });

  it("returns a template with markdown headers for copilot", () => {
    const template = getTemplate("copilot");
    expect(template).toContain("# GitHub Copilot Instructions");
    expect(template).toContain("## Coding Standards");
  });

  it("returns a template with markdown headers for windsurf", () => {
    const template = getTemplate("windsurf");
    expect(template).toContain("# Windsurf Rules");
    expect(template).toContain("## Guidelines");
  });

  it("returns a template with markdown headers for codex", () => {
    const template = getTemplate("codex");
    expect(template).toContain("# Agents Instructions");
    expect(template).toContain("## Setup");
  });

  it("templates contain HTML comment placeholders", () => {
    for (const toolId of ALL_TOOL_IDS) {
      const template = getTemplate(toolId);
      expect(template).toContain("<!--");
      expect(template).toContain("-->");
    }
  });
});

describe("hasTemplate", () => {
  it.each(ALL_TOOL_IDS)("returns true for %s", (toolId) => {
    expect(hasTemplate(toolId)).toBe(true);
  });
});

describe("getAllTemplates", () => {
  it("returns templates for all tools", () => {
    const templates = getAllTemplates();
    for (const toolId of ALL_TOOL_IDS) {
      expect(templates[toolId]).toBeDefined();
      expect(templates[toolId].length).toBeGreaterThan(0);
    }
  });

  it("every tool definition has a matching template", () => {
    const templates = getAllTemplates();
    for (const tool of TOOLS) {
      expect(templates[tool.id]).toBeDefined();
    }
  });
});
