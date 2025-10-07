# Playwright Wizard MCP Server

> 🧙‍♂️ An intelligent Model Context Protocol (MCP) server that guides you through creating professional Playwright test suites with best practices built in.

[![npm version](https://img.shields.io/npm/v/playwright-wizard-mcp.svg)](https://www.npmjs.com/package/playwright-wizard-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Playwright Wizard MCP provides a structured, step-by-step approach to building comprehensive E2E test suites. Instead of starting from scratch or copying boilerplate, this MCP server guides you through industry best practices with intelligent prompts tailored to your application.

## Features

- 🧙‍♂️ **Step-by-step wizard workflow** for creating comprehensive test suites
- 📚 **Comprehensive prompts** covering analysis, planning, setup, and implementation
- 🎯 **Best practices** for selectors, fixtures, and parallel execution
- 🔧 **Optional enhancements** for accessibility and API testing
- 📖 **Reference documentation** for advanced patterns

## Installation

```bash
npm install -g playwright-wizard-mcp
```

Or install locally:

```bash
npm install playwright-wizard-mcp
```

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

### Core Wizard Flow

1. **analyze-app** - Analyze application structure and create test strategy
2. **generate-test-plan** - Generate comprehensive test plan with scenarios
3. **setup-infrastructure** - Setup Playwright infrastructure with fixtures and config
4. **generate-page-objects** - Generate page object models with optimal selectors
5. **implement-test-suite** - Implement complete test suite with best practices
6. **review-and-optimize** - Review and optimize test suite for quality and performance

### Optional Enhancements

- **add-accessibility** - Add accessibility testing to existing suite
- **add-api-testing** - Add API testing capabilities to test suite

### Reference Documentation

- **reference/mcp-setup** - MCP setup and usage patterns
- **reference/selector-strategies** - Selector strategies and HTML quality scoring
- **reference/fixture-patterns** - Playwright fixture patterns for parallel execution

## Example Workflow

Use the prompts in sequence to build a complete test suite:

```
1. Use "analyze-app" prompt to understand your application
2. Use "generate-test-plan" to create test scenarios
3. Use "setup-infrastructure" to configure Playwright
4. Use "generate-page-objects" to create page models
5. Use "implement-test-suite" to write tests
6. Use "review-and-optimize" to finalize
```

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

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
