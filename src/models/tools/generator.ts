import { MCPTool } from "../types.js";

export const setupInfrastructureTool: MCPTool = {
  name: "setup-infrastructure",
  description: "Step 3: Setup infrastructure - create Playwright config, fixtures for parallel execution, test helpers, and proper folder structure",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  content: `# Step 3: Setup Test Infrastructure

Set up the foundational test infrastructure.

## Actions:
1. Create Playwright configuration with parallel execution settings
2. Set up test fixtures for state management
3. Create helper utilities and utilities folder
4. Set up proper folder structure (tests/, fixtures/, utils/)
5. Configure reporters and output directories

## Output:
Complete test infrastructure ready for test development.
`,
};

export const generatePageObjectsTool: MCPTool = {
  name: "generate-page-objects",
  description: "Step 4: Generate page objects - create type-safe page object models with optimal selectors (getByRole/Label preferred, test IDs when needed)",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  content: `# Step 4: Generate Page Objects

Create page object models for each page identified in the analysis.

## Actions:
1. Create page object class for each page
2. Use optimal selector strategy (prefer getByRole, getByLabel)
3. Add methods for common interactions
4. Ensure type safety with TypeScript
5. Add JSDoc comments for documentation

## Output:
Complete page object models in the pages/ directory.
`,
};

export const implementTestSuiteTool: MCPTool = {
  name: "implement-test-suite",
  description: "Step 5: Implement & verify tests - write complete test suite using page objects, with proper assertions, error handling, parallel execution verification, and performance optimization",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  content: `# Step 5: Implement Test Suite

Implement the complete test suite based on the test plan.

## Actions:
1. Write test specs using page objects
2. Implement proper assertions and error handling
3. Ensure tests can run in parallel
4. Add proper test hooks (beforeEach, afterEach)
5. Verify test execution and fix any issues
6. Optimize for performance

## Output:
Complete, working test suite with all scenarios covered.
`,
};
