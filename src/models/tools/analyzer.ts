import { MCPTool } from "../types.js";

export const analyzeAppTool: MCPTool = {
  name: "analyze-app",
  title: "🔍 Analyze Application",
  description: "Step 1: Analyze the application - detect tech stack from package.json, browse pages using Playwright MCP, evaluate DOM quality, and create test strategy files (project-config.md, pages.md, selector-strategy.md)",
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
        {
          server: "@playwright/mcp",
          tools: [
            "playwright_navigate",
            "playwright_screenshot",
            "playwright_evaluate",
            "playwright_selector"
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
  content: `# Step 1: Analyze the Application

Your task is to thoroughly analyze the application and create foundational test strategy documents.

## 🔧 Required MCP Tools

Before running this tool, ensure these MCP servers are available:

### 1. Playwright MCP (@playwright/mcp)
- **playwright_navigate(url)** - Navigate to application pages
- **playwright_screenshot()** - Capture page screenshots
- **playwright_evaluate(script)** - Run JavaScript in page context to analyze DOM
- **playwright_selector(selector)** - Test and validate selectors

### 2. Filesystem MCP (@modelcontextprotocol/server-filesystem)
- **read_file(path)** - Read package.json and config files
- **list_directory(path)** - List project structure

### 3. Optional: Brave Search MCP
- **web_search(query)** - Look up framework documentation if needed

## 📋 Actions to Take:

1. **Detect Technology Stack**
   - Use **read_file** to read package.json
   - Identify frameworks, libraries, and testing tools
   - Note framework version and dependencies

2. **Browse Application Pages**
   - Use **playwright_navigate** to navigate through the application
   - Document all routes and pages
   - Use **playwright_screenshot** to capture key pages

3. **Evaluate DOM Quality**
   - Use **playwright_evaluate** to check for semantic HTML usage
   - Identify accessibility attributes (ARIA, roles)
   - Note test IDs and data attributes
   - Score HTML quality (1-10)

4. **Create Strategy Files**
   - Create project-config.md with tech stack and architecture
   - Create pages.md with page inventory and descriptions
   - Create selector-strategy.md with recommended selector approaches

## 📤 Output:
Create the three strategy files in the project root.
`,
};
