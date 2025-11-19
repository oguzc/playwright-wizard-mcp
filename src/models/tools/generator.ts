import { MCPTool } from "../types.js";

export const setupInfrastructureTool: MCPTool = {
  name: "setup-infrastructure",
  title: "🛠️ Setup Infrastructure",
  description: "Step 3: Setup infrastructure - create Playwright config, fixtures for parallel execution, test helpers, and proper folder structure",
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
- **read_file(path)** - Read project-config.md from Step 1
- **write_file(path, content)** - Create config and helper files
- **create_directory(path)** - Create folder structure

## 📋 Actions:
1. Use **read_file** to load project-config.md for framework details
2. Use **write_file** to create Playwright configuration with parallel execution settings
3. Use **create_directory** and **write_file** to set up test fixtures for state management
4. Use **write_file** to create helper utilities and utilities folder
5. Use **create_directory** to set up proper folder structure (tests/, fixtures/, utils/)
6. Configure reporters and output directories

## 📤 Output:
Complete test infrastructure ready for test development.
`,
};

export const generatePageObjectsTool: MCPTool = {
  name: "generate-page-objects",
  title: "📋 Generate Page Objects",
  description: "Step 4: Generate page objects - create type-safe page object models with optimal selectors (getByRole/Label preferred, test IDs when needed)",
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
- **read_file(path)** - Read pages.md and selector-strategy.md from Step 1
- **write_file(path, content)** - Create page object files

### Optional: Playwright MCP
- **playwright_selector(selector)** - Validate selectors work correctly

## 📋 Actions:
1. Use **read_file** to load pages.md and selector-strategy.md
2. Create page object class for each page
3. Use optimal selector strategy (prefer getByRole, getByLabel)
4. Optionally use **playwright_selector** to validate selectors
5. Add methods for common interactions
6. Ensure type safety with TypeScript
7. Add JSDoc comments for documentation
8. Use **write_file** to save page objects

## 📤 Output:
Complete page object models in the pages/ directory.
`,
};

export const implementTestSuiteTool: MCPTool = {
  name: "implement-test-suite",
  title: "✅ Implement Test Suite",
  description: "Step 5: Implement & verify tests - write complete test suite using page objects, with proper assertions, error handling, parallel execution verification, and performance optimization",
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
- **read_file(path)** - Read test-plan.md and page objects
- **list_directory(path)** - List available page objects
- **write_file(path, content)** - Create test spec files

### Optional: Playwright MCP
- **playwright_run_tests()** - Execute tests to verify they work

## 📋 Actions:
1. Use **read_file** to load test-plan.md
2. Use **list_directory** to find all page objects
3. Write test specs using page objects
4. Implement proper assertions and error handling
5. Ensure tests can run in parallel
6. Add proper test hooks (beforeEach, afterEach)
7. Use **write_file** to save test files
8. Optionally use **playwright_run_tests** to verify test execution and fix any issues
9. Optimize for performance

## 📤 Output:
Complete, working test suite with all scenarios covered.
`,
};
