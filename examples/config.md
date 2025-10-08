# Example MCP Configuration

This file shows example configurations for using Playwright Wizard MCP with different clients.

## Claude Desktop

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**
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

## Cline (VS Code Extension)

Add to your MCP settings in VS Code:

```json
{
  "mcp.servers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["-y", "playwright-wizard-mcp"]
    }
  }
}
```

## Using Locally Installed Version

If you've installed globally with `npm install -g playwright-wizard-mcp`:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "playwright-wizard-mcp"
    }
  }
}
```

## Development Configuration

For testing local changes during development:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "node",
      "args": ["/absolute/path/to/playwright-wizard-mcp/build/index.js"]
    }
  }
}
```

Or with tsx for TypeScript:

```json
{
  "mcpServers": {
    "playwright-wizard": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/playwright-wizard-mcp/src/index.ts"]
    }
  }
}
```

## Verifying Installation

After adding the configuration:

1. Restart your MCP client (Claude Desktop, VS Code, etc.)
2. Check that the server appears in the MCP servers list
3. Try using a prompt:
   - Type `/prompt` or use the prompts interface
   - Look for prompts like `analyze-app`, `generate-test-plan`, etc.
4. Try a reference prompt:
   - Ask "Show me the core testing principles"
   - This should load the `reference/core-principles` prompt

## Troubleshooting

### Server not appearing
- Verify the JSON syntax is correct (no trailing commas, proper quotes)
- Check that Node.js is installed: `node --version`
- Try running manually: `npx -y playwright-wizard-mcp` (should start server)

### Prompts not loading
- Check the console/logs for error messages
- Verify the `.github/prompts/` folder exists in the installed package
- Try reinstalling: `npm install -g playwright-wizard-mcp --force`

### Permission errors
- On Unix systems, you may need to make the binary executable
- Run: `chmod +x $(npm root -g)/playwright-wizard-mcp/build/index.js`
