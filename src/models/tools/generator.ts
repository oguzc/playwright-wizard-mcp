import { MCPTool } from "../types.js";

export const setupInfrastructureTool: MCPTool = {
  name: "playwright-wizard:setup-infrastructure",
  title: "🛠️ Setup Infrastructure",
  description: "Step 3: Setup infrastructure - create Playwright config, fixtures for parallel execution, test helpers, and proper folder structure. All created files (configs, helpers, fixtures) go to .playwright-wizard-mcp/...",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Setup Test Infrastructure",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        {
          server: "@modelcontextprotocol/server-filesystem",
          tools: ["read_file", "write_file", "create_directory"]
        }
      ],
      optional: []
    }
  },
  content: `# Step 3: Setup Test Infrastructure\n\nSet up the foundational test infrastructure.\n\n## 🔧 Required MCP Tools\n\n### Filesystem MCP (@modelcontextprotocol/server-filesystem)\n- **create_directory(path)** - Create .playwright-wizard-mcp if not exists\n- **read_file(path)** - Read .playwright-wizard-mcp/project-config.md\n- **write_file(path, content)** - Create config and helper files in .playwright-wizard-mcp/\n\n## 📋 Actions:\n1. Use **create_directory** to create .playwright-wizard-mcp directory\n2. Use **read_file** to load .playwright-wizard-mcp/project-config.md\n3. Write all config, fixtures, helpers, and output files to .playwright-wizard-mcp/ (e.g., .playwright-wizard-mcp/playwright.config.ts)\n4. Maintain clear structure under .playwright-wizard-mcp/ (e.g., subfolders as needed)\n\n## 📤 Output:\nAll new and modified files must be inside `.playwright-wizard-mcp/` in the project root.\n`,
};

export const generatePageObjectsTool: MCPTool = {
  name: "playwright-wizard:generate-page-objects",
  title: "📋 Generate Page Objects",
  description: "Step 4: Generate page objects - create type-safe page object models; all output goes into .playwright-wizard-mcp/pages/",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Generate Page Objects",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        {
          server: "@modelcontextprotocol/server-filesystem",
          tools: ["read_file", "write_file"]
        }
      ],
      optional: [
        {
          server: "@playwright/mcp",
          tools: ["playwright_selector"]
        }
      ]
    }
  },
  content: `# Step 4: Generate Page Objects\n\nCreate page object models for each page identified in the analysis.\n\n## 🔧 Required MCP Tools\n\n### Filesystem MCP (@modelcontextprotocol/server-filesystem)\n- **read_file(path)** - Read .playwright-wizard-mcp/pages.md, selector-strategy.md\n- **write_file(path, content)** - Create each page object in .playwright-wizard-mcp/pages/\n\n## 📋 Actions:\n1. Use **read_file** to load .playwright-wizard-mcp/pages.md and selector-strategy.md\n2. Create a class file per page in .playwright-wizard-mcp/pages/\n3. Optionally use **playwright_selector** for selector validation\n\n## 📤 Output:\nAll page object models must be written to `.playwright-wizard-mcp/pages/`.\n`,
};

export const implementTestSuiteTool: MCPTool = {
  name: "playwright-wizard:implement-test-suite",
  title: "✅ Implement Test Suite",
  description: "Step 5: Implement & verify tests - write complete test suite using page objects. All tests and artifacts go to .playwright-wizard-mcp/tests/ and .playwright-wizard-mcp/reports/.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Implement Test Suite",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        {
          server: "@modelcontextprotocol/server-filesystem",
          tools: ["read_file", "write_file", "list_directory"]
        }
      ],
      optional: [
        {
          server: "@playwright/mcp",
          tools: ["playwright_run_tests"]
        }
      ]
    }
  },
  content: `# Step 5: Implement Test Suite\n\nImplement the complete test suite based on the test plan.\n\n## 🔧 Required MCP Tools\n\n### Filesystem MCP (@modelcontextprotocol/server-filesystem)\n- **read_file(path)** - Read .playwright-wizard-mcp/test-plan.md and page objects\n- **list_directory(path)** - List .playwright-wizard-mcp/pages/\n- **write_file(path, content)** - Create test spec files in .playwright-wizard-mcp/tests/\n\n### Optional: Playwright MCP\n- **playwright_run_tests()** - Run tests for verification\n\n## 📋 Actions:\n1. Use **read_file** to load .playwright-wizard-mcp/test-plan.md\n2. Use **list_directory** on .playwright-wizard-mcp/pages/\n3. Write test specs to .playwright-wizard-mcp/tests/\n4. Optionally use **playwright_run_tests** for verification\n\n## 📤 Output:\nAll test specs and reports are to be created under `.playwright-wizard-mcp/tests/` and `.playwright-wizard-mcp/reports/`.\n`,
};
