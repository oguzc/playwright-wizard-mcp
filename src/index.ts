#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Prompt file mappings
const PROMPTS = {
  "analyze-app": {
    path: ".github/prompts/1-analyze-app.md",
    description: "Analyze application structure and create test strategy",
  },
  "generate-test-plan": {
    path: ".github/prompts/2-generate-test-plan.md",
    description: "Generate comprehensive test plan with scenarios",
  },
  "setup-infrastructure": {
    path: ".github/prompts/3-setup-infrastructure.md",
    description: "Setup Playwright infrastructure with fixtures and config",
  },
  "generate-page-objects": {
    path: ".github/prompts/4-generate-page-objects.md",
    description: "Generate page object models with optimal selectors",
  },
  "implement-test-suite": {
    path: ".github/prompts/5-implement-test-suite.md",
    description: "Implement complete test suite with best practices",
  },
  "review-and-optimize": {
    path: ".github/prompts/6-review-and-optimize.md",
    description: "Review and optimize test suite for quality and performance",
  },
  "add-accessibility": {
    path: ".github/prompts/optional-add-accessibility.md",
    description: "Add accessibility testing to existing suite",
  },
  "add-api-testing": {
    path: ".github/prompts/optional-add-api-testing.md",
    description: "Add API testing capabilities to test suite",
  },
};

const REFERENCES = {
  "core-principles": {
    path: ".github/prompts/reference/core-principles.md",
    description: "Core testing principles that guide all implementations",
  },
  "workflow-overview": {
    path: ".github/prompts/reference/workflow-overview.md",
    description: "High-level workflow guide and prompt relationships",
  },
  "mcp-setup": {
    path: ".github/prompts/reference/mcp-setup.md",
    description: "MCP setup and usage patterns",
  },
  "selector-strategies": {
    path: ".github/prompts/reference/selector-strategies.md",
    description: "Selector strategies and HTML quality scoring",
  },
  "fixture-patterns": {
    path: ".github/prompts/reference/fixture-patterns.md",
    description: "Playwright fixture patterns for parallel execution",
  },
};

const server = new Server(
  {
    name: "playwright-wizard-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  }
);

// Helper to read prompt files
async function readPromptFile(relativePath: string): Promise<string> {
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

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const prompts = [
    ...Object.entries(PROMPTS).map(([name, info]) => ({
      name,
      description: info.description,
    })),
    ...Object.entries(REFERENCES).map(([name, info]) => ({
      name: `reference/${name}`,
      description: info.description,
    })),
  ];

  return { prompts };
});

// Get specific prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const promptName = request.params.name;
  
  // Handle reference prompts
  if (promptName.startsWith("reference/")) {
    const refName = promptName.replace("reference/", "");
    const ref = REFERENCES[refName as keyof typeof REFERENCES];
    
    if (!ref) {
      throw new Error(`Unknown reference: ${refName}`);
    }

    const content = await readPromptFile(ref.path);
    
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: content,
          },
        },
      ],
    };
  }

  // Handle main prompts
  const prompt = PROMPTS[promptName as keyof typeof PROMPTS];
  
  if (!prompt) {
    throw new Error(`Unknown prompt: ${promptName}`);
  }

  const content = await readPromptFile(prompt.path);
  
  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: content,
        },
      },
    ],
  };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [] };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright Wizard MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
