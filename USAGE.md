# How to Use Playwright Wizard MCP

This MCP server provides workflow guidance for creating Playwright tests.

## Setup

1. **Install the MCP server** (already done via mcp.json)

2. **Add to your project's Copilot instructions**

Create/update `.github/copilot-instructions.md` in YOUR APP (not this repo):

```markdown
# Playwright Testing Workflow

When I ask for help with Playwright testing, follow these steps:

## Phase 1: Analyze App
Call the `analyze-app` tool, read its instructions, and execute them:
- Detect tech stack from package.json
- Browse key application pages using Playwright MCP
- Evaluate DOM quality and selector viability
- Create analysis files in `.playwright-wizard-mcp/` folder

## Phase 2: Generate Test Plan  
Call the `generate-test-plan` tool and follow its instructions to create comprehensive test scenarios.

## Phase 3: Setup Infrastructure
Call the `setup-infrastructure` tool and follow its instructions to set up Playwright configuration and fixtures.

## Phase 4: Generate Page Objects
Call the `generate-page-objects` tool and follow its instructions to create page object models.

## Phase 5: Implement Tests
Call the `implement-test-suite` tool and follow its instructions to write the actual tests.

## Phase 6: Review & Optimize
Call the `review-and-optimize` tool and follow its instructions for quality improvements.

**Important**: Don't just show me the tool output. Read it, execute the steps, and show me the results.
```

## Alternative: Manual Usage

If you prefer to see the prompts yourself:

1. Open MCP Inspector: `npx @modelcontextprotocol/inspector node build/index.js`
2. Click on any tool to see its instructions
3. Copy the instructions and paste them into Copilot chat
4. Copilot will then follow them

## Tools Available

- `analyze-app` - Analyze application and create test strategy
- `generate-test-plan` - Generate test plan with scenarios
- `setup-infrastructure` - Setup Playwright config and fixtures
- `generate-page-objects` - Generate page object models
- `implement-test-suite` - Implement complete test suite
- `review-and-optimize` - Review and optimize tests
- `add-accessibility` - Add accessibility testing (optional)
- `add-api-testing` - Add API testing (optional)
- `reference-*` - Additional reference documentation

## Why This Design?

MCP tools return content that Copilot can read. These tools return detailed instructions that guide Copilot through complex workflows. Think of them as "expert SOPs" that Copilot consults when helping you build tests.
