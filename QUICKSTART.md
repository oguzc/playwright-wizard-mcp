# Quick Start Guide

Get started with Playwright Wizard MCP in minutes!

## Installation

### Option 1: Use with npx (Recommended)

No installation needed! Just add to your MCP client config:

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

### Option 2: Global Installation

```bash
npm install -g playwright-wizard-mcp
```

Then configure:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "playwright-wizard-mcp"
    }
  }
}
```

## Configuration Locations

### Claude Desktop

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Cline (VS Code)

Add to your MCP settings in VS Code.

## First Steps

After configuration:

1. **Restart your MCP client**
2. **Start the wizard** - Use the `analyze-app` prompt to begin
3. **Follow the prompts** - Each step guides you through the process
4. **Build your test suite** - Complete all 6 steps for a full test suite

## The Wizard Workflow

```
1. analyze-app           → Understand your application
2. generate-test-plan    → Create test scenarios
3. setup-infrastructure  → Configure Playwright
4. generate-page-objects → Build page models
5. implement-test-suite  → Write the tests
6. review-and-optimize   → Finalize and improve
```

## Example Usage

**In Claude Desktop or Cline:**

```
"Use the analyze-app prompt to help me set up Playwright tests for my React app"
```

The assistant will load the prompt and guide you through analyzing your application structure.

## Need Help?

- Check the [README](../README.md) for full documentation
- See [examples/config.md](../examples/config.md) for advanced configuration
- Open an issue on [GitHub](https://github.com/oguzc/playwright-wizard-mcp/issues)

## What's Next?

- Try the **optional prompts** for accessibility or API testing
- Check the **reference documentation** for advanced patterns:
  - `reference/core-principles` - Core testing principles
  - `reference/workflow-overview` - Complete workflow guide
  - `reference/mcp-setup` - MCP usage patterns
  - `reference/selector-strategies` - Selector best practices
  - `reference/fixture-patterns` - Parallel execution patterns

Happy testing! 🎭✨
