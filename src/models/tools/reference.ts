import { MCPTool } from "../types.js";

export const corePrinciplesTool: MCPTool = {
  name: "playwright-wizard:reference-core-principles",
  title: "📖 Core Testing Principles",
  description: "Get core testing principles and quality standards for Playwright. Always verify with current context7 and Playwright MCP.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Core Testing Principles",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        { server: "context7", tools: ["fetch_context"] },
        { server: "@playwright/mcp", tools: ["playwright_evaluate"] }
      ],
      optional: []
    }
  },
  content: `---\n**General Instructions:**\n- Always fact-check reference content with the current context (context7) and DOM state (Playwright MCP).\n- Outdated or non-actionable guidance should be flagged and replaced.\n- Output should end with Next Steps or further tool suggestions.\n---\n\n# Core Testing Principles\n\n## Quality Standards\n1. **Reliable**: Tests should be deterministic and consistent\n2. **Maintainable**: Easy to update when requirements change\n3. **Fast**: Optimize for quick execution\n4. **Isolated**: Each test should be independent\n5. **Clear**: Easy to understand what is being tested\n\n## Best Practices\n- Use Page Object Model pattern\n- Prefer semantic selectors (getByRole, getByLabel)\n- Avoid hardcoded waits\n- Use proper assertions\n- Handle errors gracefully\n- Keep tests DRY (Don't Repeat Yourself)\n\n## Next Steps:\n- [ ] playwright-wizard:reference-selector-strategies\n- [ ] playwright-wizard:analyze-app\n`,
};

export const selectorStrategiesTool: MCPTool = {
  name: "playwright-wizard:reference-selector-strategies",
  title: "🎯 Selector Strategies",
  description: "Get selector strategies, HTML quality guidelines, and verification with context7 and Playwright MCP.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "Selector Strategies",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    dependencies: {
      required: [
        { server: "context7", tools: ["fetch_context"] },
        { server: "@playwright/mcp", tools: ["playwright_evaluate"] }
      ],
      optional: []
    }
  },
  content: `---\n**General Instructions:**\n- Before recommending selectors or scoring HTML, verify recent state/data with context7 and Playwright MCP.\n- Review and report on the actual DOM, not just static guidance.\n- End output with Next Steps or related workflow suggestions.\n---\n\n# Selector Strategies\n\n## Selector Priority (Best to Worst)\n1. **getByRole**: Preferred for accessibility-friendly selection\n2. **getByLabel**: Good for form elements\n3. **getByPlaceholder**: Useful for inputs\n4. **getByText**: For unique text content\n5. **getByTestId**: When semantic selectors aren't available\n6. **CSS/XPath**: Last resort\n\n## HTML Quality Scoring\n- **9-10**: Excellent semantic HTML with ARIA labels\n- **7-8**: Good structure with some semantic elements\n- **5-6**: Basic HTML, limited semantic markup\n- **3-4**: Poor structure, mostly divs\n- **1-2**: Very poor, requires test IDs everywhere\n\n## Next Steps:\n- [ ] playwright-wizard:analyze-app\n- [ ] playwright-wizard:generate-page-objects\n`,
};
