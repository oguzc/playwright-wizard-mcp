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

## Installation

### From NPM

```bash
npm install -g playwright-wizard-mcp
```

Or install locally:

```bash
npm install playwright-wizard-mcp
```

### From MCP Registry

This server is also available in the official [MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=playwright-wizard-mcp), making it easily discoverable by MCP-compatible clients.

## Usage

### Claude Desktop Configuration

Add to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### VS Code / Cline Configuration

Add to your MCP settings:

```json
{
  "playwright-wizard": {
    "command": "npx",
    "args": ["-y", "playwright-wizard-mcp"]
  }
}
```

## Available Prompts

The server exposes workflow tools that guide Copilot through each phase of test creation. When you call these tools, Copilot receives detailed instructions and executes them automatically - you see the results, not the instructions.

### Core Wizard Flow

Use these tools in sequence to build a complete test suite:

1. **analyze-app** - Start here: Analyze app structure, detect tech stack, browse pages, evaluate DOM quality
2. **generate-test-plan** - Create detailed test plan with scenarios and acceptance criteria
3. **setup-infrastructure** - Setup Playwright config, fixtures, and folder structure
4. **generate-page-objects** - Generate type-safe page object models with optimal selectors
5. **implement-test-suite** - Implement & verify complete test suite with quality checks and performance optimization

### Optional Enhancements

- **setup-ci-cd** - Add GitHub Actions for automated testing
- **add-accessibility** - Add axe-core accessibility testing
- **add-api-testing** - Add API testing capabilities
- **advanced-optimization** - Deep dive into auth state reuse, performance tuning, and advanced patterns

### Reference Documentation

- **reference-core-principles** - Core testing principles
- **reference-workflow-overview** - Workflow guide
- **reference-mcp-setup** - MCP setup instructions
- **reference-selector-strategies** - Selector strategies and HTML quality scoring
- **reference-fixture-patterns** - Playwright fixture patterns

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
- MCP-compatible client (Claude Desktop, Cline, etc.)

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
