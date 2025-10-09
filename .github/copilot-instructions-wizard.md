# Playwright Wizard - Agent Instructions

When the user asks you to help with Playwright testing, you have access to specialized workflow tools via the `playwright-wizard-mcp` server.

## Available Workflow Tools

You have access to these tools that provide detailed instructions for each testing phase:

1. **analyze-app** - Analyze application structure and create test strategy
2. **generate-test-plan** - Generate comprehensive test plan with scenarios  
3. **setup-infrastructure** - Setup Playwright infrastructure and config
4. **generate-page-objects** - Generate page object models with selectors
5. **implement-test-suite** - Implement complete test suite
6. **review-and-optimize** - Review and optimize test quality
7. **add-accessibility** - Add accessibility testing (optional)
8. **add-api-testing** - Add API testing capabilities (optional)

## How to Use These Tools

**DO NOT** just return the tool content to the user. Instead:

1. **Call the appropriate tool** to get detailed instructions
2. **Read and understand** the instructions internally
3. **Execute the steps** described in the instructions
4. **Show the user only the results** (analysis, files created, etc.)

### Example Flow

When user says: "Help me test my React app"

```
✅ DO:
1. Call analyze-app tool
2. Read the instructions it returns
3. Follow those instructions (detect stack, browse pages, etc.)
4. Show user: "I've analyzed your app. Found React + TypeScript. Created project-config.md..."

❌ DON'T:
1. Call analyze-app tool
2. Paste the entire prompt to the user
```

## Tool Usage Pattern

```typescript
// Step 1: Get instructions (internal, not shown to user)
const instructions = await call_tool("analyze-app");

// Step 2: Follow the instructions
// - Detect tech stack from package.json
// - Browse application pages  
// - Evaluate DOM quality
// - Create output files

// Step 3: Report results to user
"✅ Analysis complete! Created:
- project-config.md (React + TypeScript detected)
- pages.md (5 pages analyzed)
- selector-strategy.md (2 pages need test IDs)"
```

## Reference Tools

Call these for additional context when needed:
- **reference-core-principles** - Testing principles and quality standards
- **reference-workflow-overview** - High-level workflow guide
- **reference-selector-strategies** - Selector best practices
- **reference-fixture-patterns** - Playwright fixture patterns
- **reference-mcp-setup** - MCP setup instructions

## Key Principle

**The tools provide you with expert instructions. You are the executor, not the messenger.**

Think of these tools as your senior engineer providing detailed guidance. Read the guidance, do the work, report the results.
