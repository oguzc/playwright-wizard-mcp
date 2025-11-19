import { MCPTool } from "../types.js";

export const generateTestPlanTool: MCPTool = {
  name: "generate-test-plan",
  title: "📋 Generate Test Plan",
  description: "Step 2: Generate test plan - create detailed test scenarios with user flows, edge cases, acceptance criteria, and test data based on the analysis. Output file is always .playwright-wizard-mcp/test-plan.md.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Generate Test Plan",
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
      optional: []
    }
  },
  content: `# Step 2: Generate Test Plan\n\nCreate a comprehensive test plan based on the analysis from Step 1.\n\n## 🔧 Required MCP Tools\n\n### Filesystem MCP (@modelcontextprotocol/server-filesystem)\n- **read_file(path)** - Read analysis files from Step 1 (.playwright-wizard-mcp/project-config.md, pages.md, selector-strategy.md)\n- **write_file(path, content)** - Create .playwright-wizard-mcp/test-plan.md\n\n## 📋 Actions to Take:\n\n1. **Define User Flows**\n   - Use **read_file** to load .playwright-wizard-mcp/pages.md and .playwright-wizard-mcp/project-config.md\n   - Map out critical user journeys\n   - Identify happy paths and alternative flows\n   - Document expected outcomes\n\n2. **Identify Edge Cases**\n   - Invalid inputs and error states\n   - Boundary conditions\n   - Concurrent operations\n   - Network failures\n\n3. **Create Test Scenarios**\n   - Write detailed test scenarios for each flow\n   - Include preconditions and postconditions\n   - Define acceptance criteria\n\n4. **Define Test Data**\n   - Create test data fixtures\n   - Define data validation rules\n   - Plan for data cleanup\n\n## 📤 Output:\nWrite the complete test plan to `.playwright-wizard-mcp/test-plan.md` in the project root.\n`,
};
