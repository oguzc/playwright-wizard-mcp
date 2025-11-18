import { MCPTool } from "../types.js";

export const generateTestPlanTool: MCPTool = {
  name: "generate-test-plan",
  title: "📋 Generate Test Plan",
  description: "Step 2: Generate test plan - create detailed test scenarios with user flows, edge cases, acceptance criteria, and test data based on the analysis",
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
  content: `# Step 2: Generate Test Plan

Create a comprehensive test plan based on the analysis from Step 1.

## Actions to Take:

1. **Define User Flows**
   - Map out critical user journeys
   - Identify happy paths and alternative flows
   - Document expected outcomes

2. **Identify Edge Cases**
   - Invalid inputs and error states
   - Boundary conditions
   - Concurrent operations
   - Network failures

3. **Create Test Scenarios**
   - Write detailed test scenarios for each flow
   - Include preconditions and postconditions
   - Define acceptance criteria

4. **Define Test Data**
   - Create test data fixtures
   - Define data validation rules
   - Plan for data cleanup

## Output:
Create test-plan.md with all scenarios, flows, and test data requirements.
`,
};
