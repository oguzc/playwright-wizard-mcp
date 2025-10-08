# Testing Guide for Playwright Wizard MCP

## Quick Tests (Command Line)

### 1. Test Server Starts
```bash
node build/index.js
```
✅ Should show: "Playwright Wizard MCP Server running on stdio"

### 2. Test with MCP Inspector

The official MCP Inspector is the best way to test your server locally:

```bash
# Install MCP Inspector globally
npm install -g @modelcontextprotocol/inspector

# Run your server with the inspector
npx @modelcontextprotocol/inspector node build/index.js
```

This opens a web UI where you can:
- See all available prompts
- Test prompt loading
- Execute tools
- Inspect request/response messages

### 3. Test Prompt Files Load

Create a simple test script:

**`test-server.js`**
```javascript
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js']);

// Send a request to list prompts
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'prompts/list',
  params: {}
};

server.stdin.write(JSON.stringify(request) + '\n');

server.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
  server.kill();
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});
```

Run with:
```bash
node test-server.js
```

## Full Client Tests

### Option 1: Claude Desktop (Recommended)

**Step 1:** Add to your Claude Desktop config

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright-wizard-local": {
      "command": "node",
      "args": ["c:\\projects\\playwright-wizard-mcp\\build\\index.js"]
    }
  }
}
```

**Step 2:** Restart Claude Desktop

**Step 3:** Test in Claude:
- Look for MCP indicator in the UI
- Try: "Show me available prompts from playwright-wizard"
- Try: "Use the analyze-app prompt to help me test my React app"
- Try: "Get the architecture documentation"

### Option 2: Cline (VS Code Extension)

**Step 1:** Install Cline extension in VS Code

**Step 2:** Add MCP server in Cline settings:
```json
{
  "playwright-wizard-local": {
    "command": "node",
    "args": ["c:\\projects\\playwright-wizard-mcp\\build\\index.js"]
  }
}
```

**Step 3:** Restart VS Code and test in Cline

### Option 3: Use MCP Client SDK

Create a test client:

**`test-client.js`**
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testServer() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['build/index.js'],
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  }, {
    capabilities: {}
  });

  await client.connect(transport);

  // Test listing prompts
  console.log('Testing prompts/list...');
  const prompts = await client.listPrompts();
  console.log('Available prompts:', prompts.prompts.map(p => p.name));

  // Test getting a specific prompt
  console.log('\nTesting prompts/get...');
  const prompt = await client.getPrompt({ name: 'analyze-app' });
  console.log('Prompt loaded:', prompt.messages[0].content.text.substring(0, 100) + '...');

  // Test listing tools
  console.log('\nTesting tools/list...');
  const tools = await client.listTools();
  // List available prompts
  console.log('Testing prompts/list...');
  const prompts = await client.listPrompts();
  console.log('Available prompts:', prompts.prompts.map(p => p.name));

  // Get a specific prompt
  console.log('\nTesting prompts/get...');
  const prompt = await client.getPrompt('analyze-app');
  console.log('Prompt content length:', prompt.messages[0].content.text.length);

  await client.close();
  console.log('\n✅ All tests passed!');
}

testServer().catch(console.error);
```

Install SDK and run:
```bash
npm install @modelcontextprotocol/sdk
node test-client.js
```

## Validation Checklist

Run through this checklist:

### Server Startup
- [ ] Server starts without errors
- [ ] Shows "Playwright Wizard MCP Server running on stdio"
- [ ] No TypeScript compilation errors

### Prompts
- [ ] Lists all 13 prompts (6 core + 2 optional + 5 reference)
- [ ] Can fetch `analyze-app` prompt
- [ ] Can fetch `reference/core-principles` prompt
- [ ] Can fetch `reference/workflow-overview` prompt
- [ ] Prompt content matches the markdown files

### Files
- [ ] All prompt files in `.github/prompts/` are accessible
- [ ] Reference files in `.github/prompts/reference/` are accessible
- [ ] No 404 or file not found errors

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm run build` first

### Issue: "ENOENT: no such file or directory"
**Solution:** Check that `.github/prompts/` files exist and paths are correct

### Issue: Prompts return empty content
**Solution:** Verify files are included in npm package (check `.npmignore`)

### Issue: Server doesn't respond
**Solution:** Check that stdio transport is working (not HTTP)

## Testing Before Publishing

Before publishing to npm, test the packaged version:

```bash
# Create package tarball
npm pack

# This creates playwright-wizard-mcp-0.1.0.tgz

# Install in another directory
cd /tmp
npm install /path/to/playwright-wizard-mcp-0.1.0.tgz

# Test the installed version
npx playwright-wizard-mcp
```

## Automated Testing (Optional)

For CI/CD, you can create automated tests:

**`tests/server.test.js`**
```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'child_process';

describe('MCP Server', () => {
  it('should start without errors', (done) => {
    const server = spawn('node', ['build/index.js']);
    
    server.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('running on stdio')) {
        server.kill();
        done();
      }
    });

    setTimeout(() => {
      server.kill();
      done(new Error('Server did not start in time'));
    }, 5000);
  });
});
```

Run with:
```bash
node --test tests/server.test.js
```

## Quick Verification Script

Here's a one-liner to verify everything works:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"prompts/list","params":{}}' | node build/index.js
```

Should output JSON with all available prompts.

## Next Steps

Once all tests pass:
1. ✅ Verify server starts
2. ✅ Test with MCP Inspector
3. ✅ Test in Claude Desktop or Cline
4. ✅ Run through validation checklist
5. 🚀 Ready to publish!

---

**Need Help?**
- Check the error logs in the terminal
- Verify file paths are correct
- Ensure all dependencies are installed
- Test with `npm run dev` for more detailed output
