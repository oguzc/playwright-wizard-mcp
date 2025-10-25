#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import { readFile, readdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Minimal MCP server: only discovers .github/chat-modes/*.json (or bundled
// build/modes) and exposes each as a tool named `chat-mode-<id>`.

const server = new Server(
  { name: "playwright-wizard-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const CHAT_MODES_MAP: Map<string, { path: string; mode: any }> = new Map();

const CHAT_MODE_CANDIDATES = [
  join(process.cwd(), '.github', 'chat-modes'),
  join(process.cwd(), 'modes'),
  join(__dirname, 'modes'),
  join(__dirname, '..', 'modes'),
  join(__dirname, '..', '.github', 'chat-modes'),
];

async function refreshChatModes() {
  CHAT_MODES_MAP.clear();
  for (const candidate of CHAT_MODE_CANDIDATES) {
    try {
      const abs = require('path').resolve(candidate);
      console.error('Trying chat-modes candidate:', abs);
      const entries = await readdir(abs, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isFile() || !e.name.endsWith('.json')) continue;
        try {
          const fullPath = join(candidate, e.name);
          const raw = await readFile(fullPath, 'utf8');
          const mode = JSON.parse(raw);
          const id = mode?.meta?.id || e.name.replace(/\.json$/, '');
          const toolName = `chat-mode-${id}`;
          CHAT_MODES_MAP.set(toolName, { path: fullPath, mode });
        } catch (err) {
          console.error('Failed to load chat-mode', e.name, (err as any)?.message || String(err));
        }
      }
      if (entries && entries.length) break;
    } catch (err) {
      // try next candidate
      continue;
    }
  }

  if (CHAT_MODES_MAP.size) {
    console.error('Chat modes discovered:');
    for (const [k, v] of CHAT_MODES_MAP.entries()) {
      console.error(` - ${k}: ${v.path}`);
    }
  } else {
    console.error('No chat modes discovered in candidate locations.');
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  await refreshChatModes();
  const tools: Tool[] = [];
  for (const [toolName, info] of CHAT_MODES_MAP.entries()) {
    const meta = info.mode?.meta || {};
    tools.push({
      name: toolName,
      description: meta.title || meta.description || `Chat mode ${toolName}`,
      inputSchema: {
        type: 'object' as const,
        properties: {},
        required: [],
      },
    });
  }
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  if (!name || !name.startsWith('chat-mode-')) throw new Error(`Unknown tool: ${name}`);
  const entry = CHAT_MODES_MAP.get(name);
  if (!entry) throw new Error(`Unknown chat-mode tool: ${name}`);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(entry.mode, null, 2),
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  try { await refreshChatModes(); } catch (e) { /* ignore */ }
  await server.connect(transport);
  console.error('Playwright Wizard MCP Server running on stdio (chat-modes only)');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
