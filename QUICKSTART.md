# Quick Start Guide

Get started with Playwright Wizard MCP in minutes!

## Installation

### Option 1: Use with npx (Recommended)

No installation needed! Just add to your MCP client config.

**For GitHub Copilot (VS Code)** - `mcp.json`:
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

**For Claude Desktop/Cline** - config file:
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

### GitHub Copilot (VS Code)

- **macOS**: `~/Library/Application Support/Code/User/mcp.json`
- **Windows**: `%APPDATA%\Code\User\mcp.json`

### Claude Desktop

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Cline (VS Code)

Add to your MCP settings in VS Code (accessed via Command Palette).

## First Steps

After configuration:

1. **Restart your MCP client** (required for changes to take effect)
2. **Verify installation**:
   - **GitHub Copilot**: Open Copilot Chat, type `@workspace` and look for available tools
   - **Claude Desktop**: Look for the 🔨 tool icon in a new chat
   - **Cline**: Check the available tools list in the Cline panel
3. **Start the wizard** - Ask: `"Help me analyze my app for Playwright testing"`
4. **Follow the workflow** - The AI will guide you through each step automatically

## Verification

### Quick Test

Open your AI client and type:

```text
"Show me the available Playwright Wizard tools"
```

You should see 15 tools listed:
- 5 core workflow tools (analyze-app, generate-test-plan, etc.)
- 4 optional enhancements (setup-ci-cd, add-accessibility, etc.)
- 6 reference documentation tools (reference-core-principles, etc.)

### Full Verification

Try the first step:

```text
"Use the analyze-app tool to help me understand my application"
```

If successful, the AI will:
- Detect your tech stack from `package.json`
- Create a `.playwright-wizard-mcp/` folder
- Generate analysis files (`project-config.md`, `pages.md`, `selector-strategy.md`)

## Troubleshooting

### Tools Not Appearing

**Problem**: The AI doesn't recognize Playwright Wizard tools

**Solutions**:
1. Verify config file location is correct for your OS
2. Check JSON syntax (use a JSON validator)
3. Restart your AI client completely (quit and reopen)
4. Check the console/logs for MCP server errors:
   - **Claude Desktop**: View → Developer → Developer Tools → Console
   - **Cline**: Check the Output panel in VS Code

### Command Not Found

**Problem**: `playwright-wizard-mcp: command not found`

**Solutions**:
1. Use `npx` instead of direct command (recommended):
   ```json
   {
     "command": "npx",
     "args": ["-y", "playwright-wizard-mcp"]
   }
   ```
2. If using global install, verify it's in your PATH:
   ```bash
   npm list -g playwright-wizard-mcp
   which playwright-wizard-mcp  # macOS/Linux
   where playwright-wizard-mcp  # Windows
   ```
3. Try installing globally again:
   ```bash
   npm install -g playwright-wizard-mcp
   ```

### Server Starts but Tools Don't Work

**Problem**: Server connects but tools fail to execute

**Solutions**:
1. Check Node.js version: `node --version` (need >= 18)
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm uninstall -g playwright-wizard-mcp && npm install -g playwright-wizard-mcp`
4. Try the `npx` approach instead of global install

### Files Not Being Created

**Problem**: AI acknowledges the tool but doesn't create files

**Solutions**:
1. Verify you're in your project directory (not the MCP server directory)
2. Check write permissions in your project folder
3. Ask the AI explicitly: `"Create the .playwright-wizard-mcp folder and analysis files"`
4. Check if files are being created elsewhere (search for `.playwright-wizard-mcp`)

### Configuration File Issues

**Problem**: Config file not being recognized

**Common mistakes**:
```json
❌ Wrong:
{
  "playwright-wizard": {  // Missing "mcpServers" wrapper
    "command": "npx"
  }
}

✅ Correct:
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp"]
    }
  }
}
```

### Getting Help

If you're still stuck:

1. **Check the logs**:
   - Claude Desktop: Developer Tools → Console
   - VS Code/Cline: Output panel → MCP logs

2. **Test with MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector npx -y playwright-wizard-mcp
   ```
   This opens a web UI to test the MCP server directly

3. **Open an issue**: [GitHub Issues](https://github.com/oguzc/playwright-wizard-mcp/issues)
   Include:
   - Your OS and Node.js version
   - Your config file (sanitized)
   - Error messages from logs
   - Steps you've already tried

## The Wizard Workflow

**Core Steps (Complete Test Suite):**
```
1. analyze-app           → Understand your application
2. generate-test-plan    → Create test scenarios
3. setup-infrastructure  → Configure Playwright
4. generate-page-objects → Build page models
5. implement-test-suite  → Write, verify & optimize tests
```

**Optional Enhancements:**
```
- setup-ci-cd           → Add GitHub Actions
- add-accessibility     → Add axe-core testing  
- add-api-testing       → Add API test coverage
- advanced-optimization → Auth state, perf tuning
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
