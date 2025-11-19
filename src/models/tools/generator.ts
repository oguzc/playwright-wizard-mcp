import { MCPTool } from "../types.js";

export const setupInfrastructureTool: MCPTool = {
  name: "playwright-wizard:setup-infrastructure",
  title: "🛠️ Setup Infrastructure",
  description: "Step 3: Setup infrastructure using context7, Playwright MCP, and file/project state. All generated testing infra is placed in .playwright-wizard-mcp/.",
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
        { server: "context7", tools: ["fetch_context"] },
        { server: "@playwright/mcp", tools: ["playwright_navigate","playwright_evaluate","playwright_get_dom_state"] },
        { server: "@modelcontextprotocol/server-filesystem", tools: ["read_file", "write_file", "create_directory"] }
      ],
      optional: []
    }
  },
  content: `---\n**General Instructions:**\n- Write responses in a clear, concise, actionable style.\n- Use context7 for the most up-to-date information about current infra/project state.\n- Use Playwright MCP to verify config and helpers align with the actual running UI and DOM.\n- Output a markdown Next Steps list at the end of execution.\n---\n\n# Step 3: Setup Test Infrastructure\n\n## Prerequisites\n- Always fetch the latest project/infra context from context7 before creating or updating any config file.\n- Use Playwright MCP to confirm directories, helpers, or configs will work against the current running app (simulate/verify).\n- Use filesystem only as a persistence layer.\n\n## Actions:\n1. Use context7 to check known test infrastructure status and requirements.\n2. Use create_directory for .playwright-wizard-mcp.\n3. Validate all config/fixture layouts using Playwright MCP and context7 (are required helpers present? do configs match DOM reality?).\n4. Write all config, fixtures, helpers, and output files to the .playwright-wizard-mcp/ folder only.\n\n## 📤 Output:\nAll new and modified files must be inside `.playwright-wizard-mcp/` in the project root.\n\n## Next Steps:\n- [ ] playwright-wizard:generate-page-objects\n- [ ] playwright-wizard:implement-test-suite\n`,
};

export const generatePageObjectsTool: MCPTool = {
  name: "playwright-wizard:generate-page-objects",
  title: "📋 Generate Page Objects",
  description: "Step 4: Generate page objects using DOM, context7, and Playwright MCP. All output is under .playwright-wizard-mcp/pages/.",
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
        { server: "context7", tools: ["fetch_context"] },
        { server: "@playwright/mcp", tools: ["playwright_navigate","playwright_evaluate","playwright_selector","playwright_get_dom_state"] },
        { server: "@modelcontextprotocol/server-filesystem", tools: ["read_file", "write_file"] }
      ],
      optional: []
    }
  },
  content: `---\n**General Instructions:**\n- Be concise and actionable.\n- Use context7 to fetch the latest information about app pages and selectors.\n- Use Playwright MCP to discover, extract, and verify selectors from the live DOM.\n- End with a markdown Next Steps checklist.\n---\n\n# Step 4: Generate Page Objects\n\n## Prerequisites\n- Always fetch latest application/page state from context7 and Playwright MCP.\n\n## Actions:\n1. Use Playwright MCP to enumerate all pages and components visible in the running app, discovering selectors, roles, and ARIA/metadata.\n2. Cross-check with `.playwright-wizard-mcp/pages.md` and context7 context.\n3. Create a class file for each page in `.playwright-wizard-mcp/pages/`, using extracted selectors, ensuring every selector/class reflects both the live DOM and recent project context.\n4. Use Playwright MCP and context7 to validate selectors are live and unique.\n\n## 📤 Output:\nAll page object models must be written to `.playwright-wizard-mcp/pages/`.\n\n## Next Steps:\n- [ ] playwright-wizard:implement-test-suite\n`,
};

// (Leave implement-test-suite for next sequential update)