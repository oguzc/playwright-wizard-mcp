# Playwright Wizard MCP Server

> 🧙‍♂️ An intelligent Model Context Protocol (MCP) server that guides you through creating professional Playwright test suites with best practices built in.

[![npm version](https://img.shields.io/npm/v/playwright-wizard-mcp.svg)](https://www.npmjs.com/package/playwright-wizard-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-Available-blue)](https://registry.modelcontextprotocol.io/v0/servers?search=playwright-wizard-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Playwright Wizard MCP provides a structured, step-by-step approach to building comprehensive E2E test suites. Instead of starting from scratch or copying boilerplate, this MCP server guides you through industry best practices with intelligent prompts tailored to your application.

## Features

- 🧙‍♂️ **Step-by-step wizard workflow** for creating comprehensive test suites
- 📚 **Comprehensive prompts** covering analysis, planning, setup, and implementation
- 🎯 **Best practices** for selectors, fixtures, and parallel execution
- 🔧 **Optional enhancements** for accessibility and API testing
- 📖 **Reference documentation** for advanced patterns
- 🌐 **MCP Registry integration** for easy discovery and installation

## Prerequisites

- **Node.js** 18 or higher
- An **MCP-compatible client**:
  - [GitHub Copilot](https://github.com/features/copilot) in VS Code (with MCP support)
  - [Claude Desktop](https://claude.ai/download)
  - [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) (VS Code extension)
  - Any other MCP-compatible AI client

## Installation

### Quick Start (Recommended)

No installation required! Use `npx` to run the server on-demand:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp"]
    }
  }
}
```

This approach automatically uses the latest version without managing local installations.

### Global Installation

For faster startup and offline use:

```bash
npm install -g playwright-wizard-mcp
```

Then configure without `npx`:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "playwright-wizard-mcp"
    }
  }
}
```

### From MCP Registry

Also available in the official [MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=playwright-wizard-mcp) for easy discovery.

## Configuration

### GitHub Copilot (VS Code)

1. Open your MCP config file:
   - **macOS**: `~/Library/Application Support/Code/User/mcp.json`
   - **Windows**: `%APPDATA%\Code\User\mcp.json`

2. Add the server configuration:

```json
{
  "servers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp@latest"],
      "type": "stdio"
    }
  }
}
```

3. Restart VS Code or reload window (Cmd/Ctrl + Shift + P → "Developer: Reload Window")
4. Open GitHub Copilot Chat and verify tools are available

### Claude Desktop

1. Open your config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the server configuration:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp"]
    }
  }
}
```

3. **Restart Claude Desktop**
4. Verify installation by seeing the 🔨 tool icon when you open a new chat

### Cline (VS Code)

1. Open VS Code
2. Go to Cline settings (Cmd/Ctrl + Shift + P → "Cline: Open MCP Settings")
3. Add the server configuration:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp"]
    }
  }
}
```

4. Restart VS Code
5. Look for Playwright Wizard tools in Cline's available tools list

## Available Tools

Playwright Wizard exposes 15 tools organized into three categories: core workflow, optional enhancements, and reference documentation.

### Core Workflow (Complete in Order)

These 5 tools guide you through creating a complete, production-ready test suite:

| Tool | Purpose | What It Creates | When to Use |
|------|---------|-----------------|-------------|
| **analyze-app** | Analyzes your application structure and tech stack | `project-config.md`, `pages.md`, `selector-strategy.md` | **Start here** - First step for any new test suite |
| **generate-test-plan** | Creates comprehensive test scenarios and acceptance criteria | `test-plan.md` with suites, flows, and edge cases | After analyzing the app |
| **setup-infrastructure** | Sets up Playwright config, fixtures, and folder structure | `playwright.config.ts`, fixtures, test helpers | After test plan is ready |
| **generate-page-objects** | Generates type-safe page object models with optimal selectors | Page object files in `tests/pages/` | After infrastructure is set up |
| **implement-test-suite** | Writes actual tests with assertions and error handling | Complete test files in `tests/` | Final step - implement all planned tests |

### Optional Enhancements

Add these capabilities after completing the core workflow:

| Tool | Purpose | What It Adds | When to Use |
|------|---------|--------------|-------------|
| **setup-ci-cd** | Adds GitHub Actions for automated testing | `.github/workflows/playwright.yml` | When you need CI/CD integration |
| **add-accessibility** | Integrates axe-core for WCAG 2.1 AA compliance | Accessibility test helpers and examples | For accessibility requirements |
| **add-api-testing** | Adds REST/GraphQL/tRPC API testing | API test utilities and examples | When testing backend APIs |
| **advanced-optimization** | Deep performance optimization and auth state reuse | Advanced patterns and configs | For complex apps with performance needs |

### Reference Documentation

Access these anytime for additional context and patterns:

| Tool | Content | Use When |
|------|---------|----------|
| **reference-core-principles** | Core testing principles and quality standards | You need guidance on best practices |
| **reference-workflow-overview** | Complete workflow explanation and prompt relationships | You want to understand the big picture |
| **reference-mcp-setup** | MCP server setup and usage patterns | Having installation or configuration issues |
| **reference-selector-strategies** | Selector best practices and HTML quality scoring | Need help choosing the right selectors |
| **reference-fixture-patterns** | Playwright fixture patterns for parallel execution | Working with fixtures or state management |
| **reference-data-storage-patterns** | Test data storage patterns (ORM, JSON, MSW) | Need guidance on test data management |

### How to Use the Tools

Simply ask your AI assistant to use them:

```
"Use the analyze-app tool to help me understand my application"
"Run the generate-test-plan tool to create test scenarios"
"Use setup-infrastructure to configure Playwright"
```

The AI will call the appropriate tool, receive detailed instructions, and execute them automatically. You'll see the results (files created, analysis completed) without seeing the internal instructions.

## Getting Started

### First-Time Setup (5 minutes)

1. **Install and configure** the MCP server (see [Configuration](#configuration) above)
2. **Restart your AI client** (Claude Desktop or VS Code)
3. **Verify installation**: Open a new chat and look for the 🔨 tool icon

### Creating Your First Test Suite (30-60 minutes)

Here's what a typical workflow looks like:

**Step 1: Analyze Your Application**

```text
You: "Help me analyze my React app for Playwright testing"

AI: *Calls analyze-app tool*
    - Detects React, TypeScript, Vite from package.json
    - Browses key pages (/, /login, /dashboard)
    - Evaluates DOM quality and accessibility
    - Creates .playwright-wizard-mcp/ folder with analysis files

AI: "✅ Analysis complete! Your app uses React + TypeScript with Vite.
     I found 5 key pages. HTML quality is good (score: 8/10).
     Created project-config.md, pages.md, and selector-strategy.md."
```

**Step 2: Generate Test Plan**

```text
You: "Create a test plan based on the analysis"

AI: *Calls generate-test-plan tool*
    - Creates comprehensive test scenarios
    - Defines user flows and edge cases
    - Specifies acceptance criteria
    - Adds test data requirements

AI: "✅ Test plan created! I've defined 4 test suites:
     - Authentication (5 scenarios)
     - Dashboard (7 scenarios)
     - User Profile (4 scenarios)
     - Settings (3 scenarios)
     See test-plan.md for details."
```

**Step 3: Set Up Infrastructure**

```text
You: "Set up the Playwright infrastructure"

AI: *Calls setup-infrastructure tool*
    - Creates playwright.config.ts with optimal settings
    - Sets up fixtures for parallel execution
    - Creates folder structure (tests/, pages/, fixtures/)
    - Adds test helpers and utilities

AI: "✅ Infrastructure ready!
     - Created playwright.config.ts (3 browsers, parallel mode)
     - Set up custom fixtures for test isolation
     - Organized folder structure
     Ready for page objects!"
```

**Step 4: Generate Page Objects**

```text
You: "Generate page object models"

AI: *Calls generate-page-objects tool*
    - Creates type-safe page objects
    - Uses optimal selectors (getByRole, getByLabel)
    - Adds TypeScript types
    - Implements reusable methods

AI: "✅ Page objects created!
     - tests/pages/LoginPage.ts
     - tests/pages/DashboardPage.ts
     - tests/pages/ProfilePage.ts
     All use accessible selectors and TypeScript."
```

**Step 5: Implement Tests**

```text
You: "Implement the test suite"

AI: *Calls implement-test-suite tool*
    - Writes complete test files
    - Adds proper assertions and error handling
    - Verifies parallel execution
    - Optimizes performance

AI: "✅ Test suite complete!
     - Created 19 tests across 4 suites
     - All tests pass ✓
     - Average execution: 12s (parallel)
     - 100% of tests use page objects
     Run: npx playwright test"
```

### What Gets Created

The wizard creates a complete test infrastructure in your project:

```
your-app/
├── .playwright-wizard-mcp/     # Workflow documentation
│   ├── project-config.md       # Tech stack analysis
│   ├── pages.md                # Page inventory
│   ├── selector-strategy.md    # Selector approach
│   └── test-plan.md            # Test scenarios
├── tests/
│   ├── pages/                  # Page object models
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── ProfilePage.ts
│   ├── fixtures/               # Custom fixtures
│   │   └── authFixture.ts
│   ├── helpers/                # Test utilities
│   │   └── testHelpers.ts
│   ├── auth.spec.ts           # Test files
│   ├── dashboard.spec.ts
│   └── profile.spec.ts
└── playwright.config.ts        # Playwright configuration
```

### Next Steps

After completing the core workflow, consider:

- **Add CI/CD**: `"Set up GitHub Actions for automated testing"`
- **Add accessibility testing**: `"Add axe-core accessibility testing"`
- **Add API testing**: `"Help me test my REST API alongside UI tests"`
- **Optimize performance**: `"Show me advanced optimization patterns"`

## How It Works

When you ask Copilot to help with Playwright testing:

1. **You**: "Help me analyze my app for testing"
2. **Copilot**: Calls the `analyze-app` tool
3. **Tool**: Returns detailed instructions to Copilot
4. **Copilot**: Executes the instructions (detects stack, browses pages, creates files)
5. **You see**: "✅ Analysis complete! Created project-config.md, pages.md..."

**You see results, not prompts.** The tools provide Copilot with expert-level instructions that it follows automatically.

## Example Workflow

```bash
# In your app project, ask Copilot:
"Help me set up Playwright testing for this app"

# Copilot will:
# 1. Call analyze-app → detect stack, browse pages
# 2. Call generate-test-plan → create test scenarios
# 3. Call setup-infrastructure → create config and fixtures
# 4. Call generate-page-objects → create page models
# 5. Call implement-test-suite → write actual tests
```

All workflow documentation files are created in `.playwright-wizard-mcp/` folder in your project root:

- `project-config.md` - Detected tech stack
- `pages.md` - Page analysis with DOM quality scores
- `selector-strategy.md` - Selector approach per page
- `test-plan.md` - Test suites with progress tracking

> **Note:** The `.playwright-wizard-mcp/` folder is for workflow tracking only. You may want to add it to `.gitignore`.

## Tools

- **get-architecture** - Get the prompt architecture documentation

## Requirements

- Node.js >= 18
- MCP-compatible client (GitHub Copilot, Claude Desktop, Cline, etc.)

## Development

```bash
# Clone the repository
git clone https://github.com/oguzc/playwright-wizard-mcp.git
cd playwright-wizard-mcp

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT
