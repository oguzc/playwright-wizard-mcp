import { MCPTool } from "../types.js";

export const analyzeAppTool: MCPTool = {
  name: "analyze-app",
  description: "Step 1: Analyze the application - detect tech stack from package.json, browse pages using Playwright MCP, evaluate DOM quality, and create test strategy files (project-config.md, pages.md, selector-strategy.md)",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  content: `# Step 1: Analyze the Application

Your task is to thoroughly analyze the application and create foundational test strategy documents.

## Actions to Take:

1. **Detect Technology Stack**
   - Read package.json to identify frameworks, libraries, and testing tools
   - Note framework version and dependencies

2. **Browse Application Pages**
   - Use Playwright MCP to navigate through the application
   - Document all routes and pages
   - Take screenshots of key pages

3. **Evaluate DOM Quality**
   - Check for semantic HTML usage
   - Identify accessibility attributes (ARIA, roles)
   - Note test IDs and data attributes
   - Score HTML quality (1-10)

4. **Create Strategy Files**
   - Create project-config.md with tech stack and architecture
   - Create pages.md with page inventory and descriptions
   - Create selector-strategy.md with recommended selector approaches

## Output:
Create the three strategy files in the project root.
`,
};
