#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { allTools } from "./models/tools/index.js";
import { promises as fs } from "fs";
import { join } from "path";

const OUTPUT_DIR = ".playwright-wizard-mcp";

const server = new Server(
  {
    name: "playwright-wizard-mcp",
    version: "0.1.6",
  },
  {
    capabilities: {
      tools: {},
      resources: {
        // List generated files in the main output directory & subfolders
        list: async () => {
          const walkFiles = async (dir) => {
            let files = [];
            for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
              if (entry.isDirectory()) {
                files = files.concat(
                  (await walkFiles(join(dir, entry.name))).map(f => join(entry.name, f))
                );
              } else {
                files.push(entry.name);
              }
            }
            return files;
          };
          let files = [];
          try {
            files = await walkFiles(OUTPUT_DIR);
          } catch {}
          return files.map(f => ({
            uri: `file://${join(OUTPUT_DIR, f)}`,
            name: f,
            description: f,
            mimeType: f.endsWith(".md") ? "text/markdown" : undefined
          }));
        },
        // Read content
        read: async (uri) => {
          const fsPath = uri.replace(/^file:\/\//, "");
          return {
            content: await fs.readFile(fsPath, "utf8")
          };
        }
      },
      logging: {
        level: "info"
      }
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  const tool = allTools.find((t) => t.name === name);

  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  // Log tool execution
  server.sendLoggingMessage({
    level: "info",
    logger: "playwright-wizard-mcp",
    data: { tool: name, timestamp: new Date().toISOString() }
  });

  return {
    content: [
      {
        type: "text",
        text: tool.content,
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright Wizard MCP Server v0.1.6 running with resources and logging on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
