import type { ToolId } from "./types";

const TEMPLATES: Record<ToolId, string> = {
  claude: `# Project Instructions

## Overview
<!-- Describe your project here -->

## Code Style
<!-- Add code style preferences -->

## Testing
<!-- Add testing conventions -->

## Dependencies
<!-- Note important dependencies and how to use them -->
`,

  cursor: `# Cursor Rules

## Project Context
<!-- Describe the project and its purpose -->

## Code Conventions
<!-- Preferred patterns, naming, formatting -->

## Architecture
<!-- Key architectural decisions and patterns -->

## Important Notes
<!-- Anything the AI should always keep in mind -->
`,

  copilot: `# GitHub Copilot Instructions

## Project Overview
<!-- Describe the project for Copilot -->

## Coding Standards
<!-- Style guide and conventions -->

## Patterns to Follow
<!-- Preferred design patterns and approaches -->

## Patterns to Avoid
<!-- Anti-patterns and things to watch out for -->
`,

  windsurf: `# Windsurf Rules

## Project Context
<!-- Describe the project and its stack -->

## Code Style
<!-- Formatting, naming, and style preferences -->

## Guidelines
<!-- Key rules the AI should follow -->

## Common Tasks
<!-- Describe frequent development tasks -->
`,

  codex: `# Agents Instructions

## Project Overview
<!-- Describe the project for Codex agents -->

## Setup
<!-- How to set up the development environment -->

## Code Standards
<!-- Coding conventions and style guide -->

## Testing
<!-- How to run and write tests -->
`,
};

export function getTemplate(toolId: ToolId): string {
  return TEMPLATES[toolId];
}

export function hasTemplate(toolId: ToolId): boolean {
  return toolId in TEMPLATES;
}

export function getAllTemplates(): Record<ToolId, string> {
  return { ...TEMPLATES };
}
