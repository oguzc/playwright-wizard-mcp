import { MCPTool } from "../types.js";

export const analyzeAppTool: MCPTool = {
  name: "playwright-wizard:analyze-app",
  title: "🔍 Analyze Application",
  description: "Step 1: Comprehensive application analysis, using both local files and live DOM/context via Playwright MCP and context7.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Analyze Application",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        { server: "context7", tools: ["fetch_context"] },
        {
          server: "@playwright/mcp",
          tools: [
            "playwright_navigate",
            "playwright_screenshot",
            "playwright_evaluate",
            "playwright_selector",
            "playwright_highlight",
            "playwright_get_dom_state",
            "playwright_query_all"
          ]
        },
        {
          server: "@modelcontextprotocol/server-filesystem",
          tools: ["read_file", "list_directory"]
        }
      ],
      optional: [
        {
          server: "@modelcontextprotocol/server-brave-search",
          tools: ["web_search"]
        }
      ]
    }
  },
  content: `---
**General Instructions:**
- Write responses in a clear, concise, and actionable style.
- Always use context7 to fetch the latest project/workspace context and status at the start, and reference it to enrich every analysis step.
- Always use Playwright MCP for all DOM/HTML/element/attribute checks and screenshots, not just files.
- At the end of execution, provide a markdown list of the next recommended workflow tool(s) as next steps.
---

# Step 1: Analyze the Application

## Prerequisites:
- Fetch the freshest context with context7 (`fetch_context`).
- For every important fact, check BOTH local files (package.json, etc) AND live DOM state with Playwright MCP.

## 🔧 Required MCP Tools

- context7 `fetch_context`: get recent status, project meta, event history, or context.
- Playwright MCP: `playwright_navigate`, `playwright_screenshot`, `playwright_evaluate`, `playwright_selector`, `playwright_highlight`, `playwright_get_dom_state`, `playwright_query_all` (for DOM traversal and checks).
- Filesystem MCP: `read_file`, `list_directory` (only as reference, not as ground truth).

## 📋 Actions to Take:

1. **Detect Technology Stack**
   - Use `fetch_context` to capture existing frameworks, last edits, goals, issues.
   - Use `playwright_navigate`/`playwright_evaluate` to probe DOM; validate presence of frameworks/libraries from the running app (even if missing in package.json).
   - Only supplement with local file reads.

2. **Browse Application Pages**
   - Use Playwright MCP to autotraverse/navigate all app routes/pages.
   - Log structure and DOM metadata into context.
   - Use `playwright_screenshot` for every main page.

3. **Evaluate DOM Quality**
   - Use Playwright MCP to enumerate ARIA, roles, test-ids, and all key HTML/DOM markers.
   - Use `fetch_context` and compare with last known state to check for missing/changed markup.
   - Assign a semantic HTML/quality score (cross-check DOM and metadata).

4. **Create Strategy Files**
   - Write all outputs to `.playwright-wizard-mcp/`.
   - Output should reflect DOM-verified reality, not just static code.

## 📤 Output:
All files must be inside `.playwright-wizard-mcp`. Always add a final "Next Steps" markdown task list (e.g.,
- playwright-wizard:generate-test-plan
- playwright-wizard:setup-infrastructure
).
`,
};
