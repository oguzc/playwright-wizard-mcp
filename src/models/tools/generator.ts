import { MCPTool } from "../types.js";

export const setupInfrastructureTool: MCPTool = {
  name: "setup-infrastructure",
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
  content: `# Step 3: Setup Test Infrastructure

Set up the foundational test infrastructure.

## 🔧 Required MCP Tools

### Filesystem MCP (@modelcontextprotocol/server-filesystem)
- **create_directory(path)** - Create .playwright-wizard-mcp if not exists
- **read_file(path)** - Read .playwright-wizard-mcp/project-config.md
- **write_file(path, content)** - Create config and helper files in .playwright-wizard-mcp/

## 📋 Actions:
1. Use **create_directory** to create .playwright-wizard-mcp directory
2. Use **read_file** to load .playwright-wizard-mcp/project-config.md
3. Write all config, fixtures, helpers, and output files to .playwright-wizard-mcp/ (e.g., .playwright-wizard-mcp/playwright.config.ts)
4. Maintain clear structure under .playwright-wizard-mcp/ (e.g., subfolders as needed)

## 📤 Output:
All new and modified files must be inside `.playwright-wizard-mcp/` in the project root.
`,
};

export const generatePageObjectsTool: MCPTool = {
  name: "generate-page-objects",
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
  content: `# Step 4: Generate Page Objects

Create page object models for each page identified in the analysis.

## 🔧 Required MCP Tools

### Filesystem MCP (@modelcontextprotocol/server-filesystem)
- **read_file(path)** - Read .playwright-wizard-mcp/pages.md, selector-strategy.md
- **write_file(path, content)** - Create each page object in .playwright-wizard-mcp/pages/

## 📋 Actions:
1. Use **read_file** to load .playwright-wizard-mcp/pages.md and selector-strategy.md
2. Create a class file per page in .playwright-wizard-mcp/pages/
3. Optionally use **playwright_selector** for selector validation

## 📤 Output:
All page object models must be written to `.playwright-wizard-mcp/pages/`.
`,
};

export const implementTestSuiteTool: MCPTool = {
  name: "implement-test-suite",
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
  content: `# Step 5: Implement Test Suite

Implement the complete test suite based on the test plan.

## 🔧 Required MCP Tools

### Filesystem MCP (@modelcontextprotocol/server-filesystem)
- **read_file(path)** - Read .playwright-wizard-mcp/test-plan.md and page objects
- **list_directory(path)** - List .playwright-wizard-mcp/pages/
- **write_file(path, content)** - Create test spec files in .playwright-wizard-mcp/tests/

### Optional: Playwright MCP
- **playwright_run_tests()** - Run tests for verification

## 📋 Actions:
1. Use **read_file** to load .playwright-wizard-mcp/test-plan.md
2. Use **list_directory** on .playwright-wizard-mcp/pages/
3. Write test specs to .playwright-wizard-mcp/tests/
4. Optionally use **playwright_run_tests** for verification

## 📤 Output:
All test specs and reports are to be created under `.playwright-wizard-mcp/tests/` and `.playwright-wizard-mcp/reports/`.
`,
};
