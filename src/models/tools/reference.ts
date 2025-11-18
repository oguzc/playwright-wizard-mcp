import { MCPTool } from "../types.js";

export const corePrinciplesTool: MCPTool = {
  name: "reference-core-principles",
  title: "📖 Core Testing Principles",
  description: "Get core testing principles and quality standards that guide all Playwright test implementations",
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
  content: `# Core Testing Principles

## Quality Standards
1. **Reliable**: Tests should be deterministic and consistent
2. **Maintainable**: Easy to update when requirements change
3. **Fast**: Optimize for quick execution
4. **Isolated**: Each test should be independent
5. **Clear**: Easy to understand what is being tested

## Best Practices
- Use Page Object Model pattern
- Prefer semantic selectors (getByRole, getByLabel)
- Avoid hardcoded waits
- Use proper assertions
- Handle errors gracefully
- Keep tests DRY (Don't Repeat Yourself)
`,
};

export const selectorStrategiesTool: MCPTool = {
  name: "reference-selector-strategies",
  title: "🎯 Selector Strategies",
  description: "Get selector strategies, HTML quality scoring guidelines, and best practices for robust element selection",
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
  content: `# Selector Strategies

## Selector Priority (Best to Worst)
1. **getByRole**: Preferred for accessibility-friendly selection
2. **getByLabel**: Good for form elements
3. **getByPlaceholder**: Useful for inputs
4. **getByText**: For unique text content
5. **getByTestId**: When semantic selectors aren't available
6. **CSS/XPath**: Last resort

## HTML Quality Scoring
- **9-10**: Excellent semantic HTML with ARIA labels
- **7-8**: Good structure with some semantic elements
- **5-6**: Basic HTML, limited semantic markup
- **3-4**: Poor structure, mostly divs
- **1-2**: Very poor, requires test IDs everywhere
`,
};
