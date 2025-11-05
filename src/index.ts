#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function readBundledChatMode(relPath) {
  // Try relative to project root when running from TS
  const candidateA = join(process.cwd(), relPath);
  try { return await readFile(candidateA, "utf-8"); } catch {}
  // Try relative to built dist location (when installed as package)
  const candidateB = join(__dirname, "..", relPath);
  return await readFile(candidateB, "utf-8");
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "status",
        description: "Show Playwright Wizard status and guidance. This server installs VS Code chat modes via install-chatmodes.",
        inputSchema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "install-chatmodes",
        description: "Install Playwright Wizard chat modes into the current workspace at .github/chatmodes/",
        inputSchema: { type: "object", properties: {}, required: [] },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "status") {
    const msg = [
      "Playwright Wizard now uses VS Code custom chat modes.",
      "Use the tool 'install-chatmodes' to copy the mode files into your repo at .github/chatmodes/.",
      "Then open VS Code Chat and select a mode (Analysis, Setup, Implementation, Debug).",
    ].join("\n");
    return { content: [{ type: "text", text: msg }] };
  }

  if (name === "install-chatmodes") {
    const targetDir = join(process.cwd(), ".github", "chatmodes");
    await mkdir(targetDir, { recursive: true });

    const files = [
      ".github/chatmodes/playwright-analysis.chatmode.md",
      ".github/chatmodes/playwright-setup.chatmode.md",
      ".github/chatmodes/playwright-implementation.chatmode.md",
      ".github/chatmodes/playwright-debug.chatmode.md",
    ];

    const written = [];
    for (const rel of files) {
      const content = await readBundledChatMode(rel);
      const dest = join(process.cwd(), rel);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, content, "utf-8");
      written.push(rel);
    }

    const msg = `Installed chat modes to: \n- ${written.join("\n- ")}`;
    return { content: [{ type: "text", text: msg }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright Wizard MCP Server ready (status, install-chatmodes)");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
