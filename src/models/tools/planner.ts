import { MCPTool } from "../types.js";

export const generateTestPlanTool: MCPTool = {
  name: "playwright-wizard:generate-test-plan",
  title: "📋 Generate Test Plan",
  description: "Step 2: Generate test plan using context7, Playwright MCP, and file analysis. Output always .playwright-wizard-mcp/test-plan.md.",
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
        { server: "context7", tools: ["fetch_context"] },
        { server: "@playwright/mcp", tools: ["playwright_navigate","playwright_evaluate","playwright_query_all"] },
        { server: "@modelcontextprotocol/server-filesystem", tools: ["read_file", "write_file"] }
      ],
      optional: []
    }
  },
  content: `---\n**General Instructions:**\n- Write responses in a clear, concise, actionable style.\n- Use context7 to fetch the latest workflow state and transition info as the first step.\n- Use Playwright MCP to live-read the DOM, key screens, routes and state—complementing (not replacing) file reads.\n- Output a markdown Next Steps list at the end of execution.\n---\n\n# Step 2: Generate Test Plan\n\n## Prerequisites\n- Always start by fetching latest context with context7.\n- Use Playwright MCP as primary for all UI, DOM, and page-flow analysis.\n- Verify and supplement with `.playwright-wizard-mcp/` files.\n\n## 📋 Actions to Take:\n1. **Define User Flows**\n   - Combine insights from context7 (flows, usage history), Playwright MCP (UI/DOM discovery), and static files.\n2. **Identify Edge Cases & Acceptance Criteria**\n   - Use context and live DOM analysis to surface relevant failure modes.\n3. **Create Test Scenarios**\n   - Compose scenarios by blending context, UI state, and documentation.\n4. **Define Test Data**\n   - Add based on context, files, and observed UI requirements.\n\n## 📤 Output:\nWrite the complete test plan to `.playwright-wizard-mcp/test-plan.md` in the project root.\n\n## Next Steps:\n- [ ] playwright-wizard:setup-infrastructure\n- [ ] playwright-wizard:generate-page-objects\n`,
};
