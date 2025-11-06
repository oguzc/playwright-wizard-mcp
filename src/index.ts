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
    version: "0.2.1", // keep as-is while developing
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Match main-branch approach: try repo root relative to build, then CWD
async function readFromRepoOrCwd(relativePath: string) {
  try {
    const rootPath = join(__dirname, "..", relativePath);
    return await readFile(rootPath, "utf-8");
  } catch (error) {
    const projectPath = join(process.cwd(), relativePath);
    return await readFile(projectPath, "utf-8");
  }
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
    const targets = [
      ".github/chatmodes/playwright-analysis.chatmode.md",
      ".github/chatmodes/playwright-setup.chatmode.md",
      ".github/chatmodes/playwright-implementation.chatmode.md",
      ".github/chatmodes/playwright-debug.chatmode.md",
    ];

    const written: string[] = [];
    const errors: string[] = [];
    const sources: string[] = [];

    for (const rel of targets) {
      try {
        const content = await readFromRepoOrCwd(rel);
        const destPath = join(process.cwd(), rel);
        await mkdir(dirname(destPath), { recursive: true });
        await writeFile(destPath, content, "utf-8");
        written.push(rel);
        // Source is either __dirname/.. or CWD; we can't know which path succeeded without duplicating logic,
        // so try resolving root first and fall back to CWD for logging only.
        try {
          sources.push(`${rel} <- ${join(__dirname, "..", rel)}`);
        } catch {
          sources.push(`${rel} <- ${join(process.cwd(), rel)}`);
        }
      } catch (e) {
        errors.push(`${rel}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    let msg = "";
    if (written.length) {
      msg += `Installed ${written.length} chat modes to:\n- ${written.join("\n- ")}`;
      msg += `\n\nSource candidates used:\n- ${sources.join("\n- ")}`;
    } else {
      msg += "No chat modes were installed.";
    }
    if (errors.length) {
      msg += `\n\nErrors:\n- ${errors.join("\n- ")}`;
      msg += "\n\nEnsure the chat mode files exist at the repo root relative to build (..\\.github\\chatmodes) or in the current workspace.";
    }

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
