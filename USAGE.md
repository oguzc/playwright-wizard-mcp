# How to Use Playwright Wizard MCP

This guide explains how Playwright Wizard MCP works and how to interact with it through your AI assistant.

## Understanding MCP Servers

**MCP (Model Context Protocol)** is a way to extend your AI assistant with specialized capabilities. Think of it like installing plugins:

- **Without MCP**: Your AI only knows what it was trained on
- **With MCP**: Your AI can access specialized tools and up-to-date information

**Playwright Wizard MCP** gives your AI expert knowledge about creating Playwright tests with industry best practices.

## How It Works

### The Interaction Flow

1. **You** talk to your AI assistant (GitHub Copilot, Claude, Cline, etc.) in natural language
2. **AI assistant** recognizes you need Playwright testing help
3. **AI calls** the appropriate Playwright Wizard tool
4. **Tool returns** detailed expert instructions (invisible to you)
5. **AI follows** the instructions and shows you the results

### Example Conversation

```text
You: "I need to add Playwright tests to my React app"

AI: *Internally calls analyze-app tool*
    *Receives expert instructions*
    *Executes the instructions*

AI: "I'll help you set up Playwright testing! Let me start by analyzing your app..."
    *Detects React + TypeScript + Vite*
    *Browses your pages*
    *Evaluates HTML quality*
    *Creates analysis files*

AI: "✅ Analysis complete! Your app uses React with TypeScript..."
```

**You never see** the internal instructions - just the results!

## Using the Tools

You don't call tools directly. Instead, you tell your AI what you want to do:

### Starting Fresh

```text
❌ Don't say: "Call the analyze-app tool"
✅ Do say: "Help me set up Playwright tests for my app"
✅ Do say: "Analyze my application for testing"
✅ Do say: "I need to create E2E tests"
```

The AI will automatically use the right tool.

### Continuing the Workflow

```text
"Create a test plan based on the analysis"
"Set up the Playwright configuration"
"Generate page objects for my components"
"Write the actual test suite"
```

### Adding Optional Features

```text
"Add GitHub Actions for automated testing"
"Add accessibility testing with axe-core"
"Help me test my REST API"
"Show me advanced optimization patterns"
```

### Getting Reference Information

```text
"What are the best practices for Playwright selectors?"
"Explain the Playwright Wizard workflow"
"How should I structure my test fixtures?"
"What data storage patterns should I use?"
```

## The Complete Workflow

Here's a typical session from start to finish:

### Step 1: Initial Setup (5 minutes)

```text
You: "Help me add Playwright testing to my project"

AI: *Analyzes your app*
    Creates:
    - .playwright-wizard-mcp/project-config.md
    - .playwright-wizard-mcp/pages.md  
    - .playwright-wizard-mcp/selector-strategy.md
```

### Step 2: Planning (10 minutes)

```text
You: "Create a comprehensive test plan"

AI: *Generates test scenarios*
    Creates:
    - .playwright-wizard-mcp/test-plan.md (with all test cases)
```

### Step 3: Infrastructure (5 minutes)

```text
You: "Set up the Playwright infrastructure"

AI: *Configures Playwright*
    Creates:
    - playwright.config.ts
    - tests/fixtures/
    - tests/helpers/
```

### Step 4: Page Objects (10 minutes)

```text
You: "Generate page objects for my app"

AI: *Creates type-safe page models*
    Creates:
    - tests/pages/LoginPage.ts
    - tests/pages/DashboardPage.ts
    - tests/pages/ProfilePage.ts
    (etc.)
```

### Step 5: Implementation (30 minutes)

```text
You: "Implement the complete test suite"

AI: *Writes all tests*
    Creates:
    - tests/auth.spec.ts
    - tests/dashboard.spec.ts
    - tests/profile.spec.ts
    (etc.)
```

### Total Time: ~60 minutes for a complete test suite

## What You Get

After completing the workflow, your project will have:

### Documentation (`.playwright-wizard-mcp/`)

- `project-config.md` - Your tech stack and architecture
- `pages.md` - Inventory of pages and components
- `selector-strategy.md` - Selector approach per page
- `test-plan.md` - All test scenarios with acceptance criteria

> **Note**: This folder is for workflow tracking. Consider adding it to `.gitignore`.

### Test Infrastructure

- `playwright.config.ts` - Optimized Playwright configuration
- `tests/fixtures/` - Custom fixtures for test isolation
- `tests/helpers/` - Reusable test utilities
- `tests/pages/` - Type-safe page object models
- `tests/*.spec.ts` - Your actual test files

### Ready to Run

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test

# View report
npx playwright show-report
```

## Tips for Best Results

### Be Specific About Your App

```text
❌ "Add tests"
✅ "Add Playwright tests for my Next.js 14 app with TypeScript"
```

### Ask for Incremental Help

```text
✅ Follow the 5-step workflow in order
✅ Complete each step before moving to the next
✅ Ask questions if something is unclear
```

### Review Generated Files

```text
✅ Check the test-plan.md to ensure it covers your use cases
✅ Review page objects before implementing tests
✅ Run tests after implementation to verify they pass
```

### Request Changes

```text
"Add more error handling to the login tests"
"Update the DashboardPage to use data-testid selectors"
"Add a test for the edge case where the user has no data"
```

## Advanced Usage

### Custom Requirements

```text
"I need to test with authenticated users - show me auth patterns"
"My app uses Shadow DOM - how should I handle selectors?"
"I want to test across multiple browsers in parallel"
```

### Optimization

```text
"These tests are slow - help me optimize them"
"Show me how to reuse auth state across tests"
"I want to run critical tests first"
```

### Integration

```text
"Add visual regression testing with Percy"
"Integrate with my existing Jest tests"
"Set up Playwright with Docker"
```

## Need More Help?

- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for setup help
- **Troubleshooting**: Check the troubleshooting section in QUICKSTART.md
- **Examples**: Browse [examples/config.md](./examples/config.md) for advanced configs
- **Issues**: Open a [GitHub issue](https://github.com/oguzc/playwright-wizard-mcp/issues) with details

## Why This Approach?

Traditional test generation tools give you code templates that you need to modify. **Playwright Wizard is different**:

- **Guided workflow**: Step-by-step process, not overwhelming
- **Best practices built-in**: Expert patterns automatically applied
- **Contextual**: Analyzes YOUR app, not generic templates
- **Interactive**: Ask questions, request changes, iterate naturally
- **Educational**: Learn Playwright patterns while building tests

You're not just getting tests - you're getting a well-architected test suite with industry best practices.
