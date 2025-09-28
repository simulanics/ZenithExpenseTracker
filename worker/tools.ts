import type { ErrorResult } from './types';
export type ToolResult = { content: string } | ErrorResult;
// All custom tools and MCP manager integration have been removed.
// This file is kept for structure but can be removed if no tools are ever needed.
export async function getToolDefinitions() {
  // No tools are defined for the financial assistant.
  return [];
}
export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  // Since no tools are defined, this function will report an error if called.
  console.error(`Attempted to execute unknown tool: ${name}`);
  return { error: `Tool "${name}" not found.` };
}