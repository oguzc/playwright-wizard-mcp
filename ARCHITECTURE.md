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

## Available Tools

### Workflow Tools
1. **🔍 analyze-app**: Analyze application and create test strategy (read-only, idempotent)
2. **📋 generate-test-plan**: Create comprehensive test plan (creates files)
3. **🛠️ setup-infrastructure**: Set up test infrastructure (creates files)
4. **📄 generate-page-objects**: Create page object models (creates files)
5. **✅ implement-test-suite**: Implement complete test suite (creates files)

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

## Benefits Over Previous Architecture

| Aspect | Old | New |
|--------|-----|-----|
| File I/O | Yes (.github folder) | No (embedded in code) |
| Deployment | Complex (need .github) | Simple (just src/) |
| Type Safety | Limited | Full TypeScript |
| Startup Speed | Slower (file reads) | Faster (no I/O) |
| Maintainability | Lower | Higher |
| Testing | Harder | Easier |
| Tool Metadata | None | Rich (titles, annotations) |
| AI-Friendly | Basic | Enhanced |

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
  content: `Your instructions here`,
};
```

2. Export it from `src/models/tools/index.ts`
3. That's it! The server automatically picks it up.

## Version

Current version: **0.2.0**
