#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new Server(
  {
    name: "playwright-wizard-mcp",
    version: "0.2.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Resolve the absolute path to a bundled file inside this package, regardless of CWD.
 * Strategy:
 * 1) Try to locate the package root via require.resolve of package.json (works when installed).
 * 2) Fallback to __dirname/.. for dev (running from source).
 */
async function resolveBundledPath(relFromRoot: string) {
  try {
    // When installed as a dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkgPath = require.resolve("playwright-wizard-mcp/package.json", { paths: [process.cwd()] });
    const pkgRoot = pathResolve(pkgPath, "..");
    return pathResolve(pkgRoot, relFromRoot);
  } catch {
    // Fallback when running from source (ts-node/esm)
    return pathResolve(__dirname, "..", relFromRoot);
  }
}

async function readBundledChatMode(relPath: string) {
  const abs = await resolveBundledPath(relPath);
  return await readFile(abs, "utf-8");
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
    const errors = [];

    for (const rel of files) {
      try {
        const content = await readBundledChatMode(rel);
        const dest = join(process.cwd(), rel);
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, content, "utf-8");
        written.push(rel);
      } catch (e) {
        errors.push(`${rel}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    let msg = "";
    if (written.length) {
      msg += `Installed chat modes to:\n- ${written.join("\n- ")}`;
    } else {
      msg += "No chat modes were installed.";
    }
    if (errors.length) {
      msg += `\n\nErrors:\n- ${errors.join("\n- ")}`;
      msg += "\n\nIf running from a linked package, ensure the chat mode files are included in the published package.";
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
