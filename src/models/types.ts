import { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface MCPTool extends Tool {
  content: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  tools: MCPTool[];
}
