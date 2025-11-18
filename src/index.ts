#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Agent definitions - standalone agents that can be called directly
const AGENTS = {
  "test-wizard-agent": {
    path: ".github/agents/test-wizard-agent.md",
    description: "Complete test automation agent that guides users through the entire testing workflow - from analyzing the application to setting up CI/CD pipelines. Orchestrates all testing steps intelligently.",
  },
};

const server = new Server(
  {
    name: "playwright-wizard-mcp",
    version: "0.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper to read agent files
async function readAgentFile(relativePath: string): Promise<string> {
  try {
    // Try reading from root (when running from build)
    const rootPath = join(__dirname, "..", relativePath);
    return await readFile(rootPath, "utf-8");
  } catch (error) {
    // Try reading from project root (when running with tsx)
    const projectPath = join(process.cwd(), relativePath);
    return await readFile(projectPath, "utf-8");
  }
}

// List available tools (agents only)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    ...Object.entries(AGENTS).map(([name, info]) => ({
      name: name,
      description: info.description,
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    })),
  ];
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  // Handle agents
  const agent = AGENTS[name as keyof typeof AGENTS];

  if (!agent) {
    throw new Error(`Unknown agent: ${name}`);
  }

  const content = await readAgentFile(agent.path);

  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright Wizard MCP Server (Agents Only) running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
