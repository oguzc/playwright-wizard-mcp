# MCP Server Architecture

## Overview

This MCP server provides tools for generating Playwright tests. The architecture follows clean code principles with tool definitions embedded directly in TypeScript code.

## Structure

```
src/
├── index.ts                 # Main server entry point
├── models/
│   ├── types.ts            # TypeScript type definitions
│   └── tools/
│       ├── index.ts        # Export all tools
│       ├── analyzer.ts     # App analysis tools
│       ├── planner.ts      # Test planning tools
│       ├── generator.ts    # Code generation tools
│       └── reference.ts    # Reference documentation
```

## Key Features

### 1. Tool Models as Code
Each tool is defined as a TypeScript object containing:
- **name**: Tool identifier
- **title**: Human-readable name with emoji 🎨
- **description**: What the tool does
- **inputSchema**: JSON schema for inputs
- **annotations**: Behavior hints for AI clients
- **_meta**: Metadata including dependencies on other MCP tools
- **content**: Instructions embedded in code

### 2. No File Dependencies
- All tool content is embedded in code
- No runtime file I/O operations
- Faster startup and execution
- Easier deployment

### 3. Type Safety
- Full TypeScript support
- Defined interfaces for tools
- Better IDE support and autocomplete

### 4. Clean Separation
- Tool definitions in `models/tools/`
- Server logic in `index.ts`
- Types in `models/types.ts`

### 5. Rich Tool Metadata
All tools include annotations to help AI clients understand tool behavior:
- **readOnlyHint**: Tool only reads data, doesn't modify
- **destructiveHint**: Tool deletes or overwrites data
- **idempotentHint**: Same result if run multiple times
- **openWorldHint**: Depends on external state (network, time, etc.)

### 6. Tool Dependencies
All workflow tools declare their dependencies on external MCP servers:
- **_meta.dependencies.required**: MCP tools that must be available
- **_meta.dependencies.optional**: MCP tools that enhance functionality
- Both machine-readable (in `_meta`) and human-readable (in `content`)

## Available Tools

### Workflow Tools
1. **🔍 analyze-app**: Analyze application and create test strategy (read-only, idempotent)
   - Requires: Playwright MCP, Filesystem MCP
2. **📋 generate-test-plan**: Create comprehensive test plan (creates files)
   - Requires: Filesystem MCP
3. **🛠️ setup-infrastructure**: Set up test infrastructure (creates files)
   - Requires: Filesystem MCP
4. **📄 generate-page-objects**: Create page object models (creates files)
   - Requires: Filesystem MCP
   - Optional: Playwright MCP
5. **✅ implement-test-suite**: Implement complete test suite (creates files)
   - Requires: Filesystem MCP
   - Optional: Playwright MCP

### Reference Tools
1. **📖 reference-core-principles**: Core testing principles (read-only, idempotent)
2. **🎯 reference-selector-strategies**: Selector best practices (read-only, idempotent)

## Tool Annotations

### Read-Only Tools (Safe to run anytime)
- `analyze-app` ✅
- `reference-core-principles` ✅
- `reference-selector-strategies` ✅

### File-Creating Tools (Modify filesystem)
- `generate-test-plan` 📝
- `setup-infrastructure` 📝
- `generate-page-objects` 📝
- `implement-test-suite` 📝

### Idempotent Tools (Same result every time)
- `analyze-app` ✅
- `reference-core-principles` ✅
- `reference-selector-strategies` ✅

## Tool Dependencies

### Required MCP Servers

To use this server's workflow tools, ensure these MCP servers are configured:

1. **@playwright/mcp** - Playwright browser automation
   - Used by: `analyze-app`, optionally by `generate-page-objects` and `implement-test-suite`
   - Tools used: `playwright_navigate`, `playwright_screenshot`, `playwright_evaluate`, `playwright_selector`

2. **@modelcontextprotocol/server-filesystem** - File system operations
   - Used by: All workflow tools
   - Tools used: `read_file`, `write_file`, `list_directory`, `create_directory`

### Optional MCP Servers

3. **@modelcontextprotocol/server-brave-search** - Web search
   - Used by: `analyze-app` (for looking up framework documentation)
   - Tools used: `web_search`

### Dependency Declaration Pattern

Each tool declares its dependencies in two ways:

**1. Machine-Readable (in `_meta`):**
```typescript
_meta: {
  dependencies: {
    required: [
      {
        server: "@playwright/mcp",
        tools: ["playwright_navigate", "playwright_screenshot"]
      }
    ],
    optional: [
      {
        server: "@modelcontextprotocol/server-brave-search",
        tools: ["web_search"]
      }
    ]
  }
}
```

**2. Human-Readable (in `content`):**
```markdown
## 🔧 Required MCP Tools

### Playwright MCP (@playwright/mcp)
- **playwright_navigate(url)** - Navigate to pages
- **playwright_screenshot()** - Capture screenshots
```

This dual approach ensures both AI clients and human developers understand tool requirements.

## Benefits Over Previous Architecture

| Aspect | Old | New |
|--------|-----|-----|
| File I/O | Yes (.github folder) | No (embedded in code) |
| Deployment | Complex (need .github) | Simple (just src/) |
| Type Safety | Limited | Full TypeScript |
| Startup Speed | Slower (file reads) | Faster (no I/O) |
| Maintainability | Lower | Higher |
| Testing | Harder | Easier |
| Tool Metadata | None | Rich (titles, annotations, dependencies) |
| AI-Friendly | Basic | Enhanced |
| Dependency Tracking | None | Explicit and documented |

## Adding New Tools

1. Create tool definition in appropriate file:
```typescript
export const myNewTool: MCPTool = {
  name: "my-new-tool",
  title: "🎨 My New Tool",
  description: "What it does",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  annotations: {
    title: "My New Tool",
    readOnlyHint: true,      // true if only reads data
    destructiveHint: false,  // true if deletes/overwrites
    idempotentHint: true,    // true if same result every time
    openWorldHint: false,    // true if depends on external state
  },
  _meta: {
    dependencies: {
      required: [
        {
          server: "@some-mcp/server",
          tools: ["tool_name_1", "tool_name_2"]
        }
      ],
      optional: []
    }
  },
  content: `
## 🔧 Required MCP Tools

### Some MCP Server (@some-mcp/server)
- **tool_name_1()** - What it does
- **tool_name_2()** - What it does

## Your workflow instructions here...
`,
};
```

2. Export it from `src/models/tools/index.ts`
3. That's it! The server automatically picks it up.

## Version

Current version: **0.2.0**
