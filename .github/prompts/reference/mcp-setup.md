# MCP Setup & Usage

> **Required MCPs for this workflow**

## Prerequisites Check

Before starting, verify these MCPs are installed and available:

### 1. Context7 MCP
**Purpose:** Fetch latest documentation for any library/framework

**Check if installed:**
```typescript
// Try calling the resolve function
await mcp_context7_resolve_library_id({ libraryName: "playwright" });
```

**If not available:** Ask user to install Context7 MCP server

### 2. Playwright MCP
**Purpose:** Browse applications, take snapshots, verify selectors

**Check if installed:**
```typescript
// Try calling snapshot function
await mcp_playwright_browser_snapshot();
```

**If not available:** Ask user to install Playwright MCP server

---

## Context7 MCP Usage

### Always Get Latest Docs

**CRITICAL:** Never use cached/memorized documentation. Always fetch latest from Context7.

### Basic Pattern

```typescript
// 1. Resolve library ID first (unless user provides exact ID)
const result = await mcp_context7_resolve_library_id({ 
  libraryName: "next.js" 
});

// 2. Use the resolved ID to get docs
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "routing app router",
  tokens: 5000  // Adjust based on need
});
```

### Common Queries

**Playwright:**
```typescript
// Config & setup
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "configuration parallel execution workers baseURL"
});

// Fixtures
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "fixtures test scoped worker scoped setup teardown"
});

// Selectors & assertions
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "locators getByRole getByLabel assertions expect"
});

// CI/CD
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "ci continuous integration github actions"
});
```

**Framework Detection:**
```typescript
// Next.js
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "app router pages middleware"
});

// React
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/facebook/react",
  topic: "hooks useState useEffect"
});

// Vue
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/vuejs/vue",
  topic: "composition api setup ref"
});

// Prisma
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/prisma/prisma",
  topic: "client crud operations"
});
```

**Testing Libraries:**
```typescript
// Faker.js for test data
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/faker-js/faker",
  topic: "person commerce string uuid"
});
```

---

## Playwright MCP Usage

### Browser Navigation & Inspection

**Start/Navigate:**
```typescript
await mcp_playwright_browser_navigate({ 
  url: "http://localhost:3000/login" 
});
```

**Take Accessibility Snapshot:**
```typescript
const snapshot = await mcp_playwright_browser_snapshot();
```

**Snapshot Output Example:**
```
heading "Sign In" [level=1]
textbox "Email" [required]
textbox "Password" [required] [type=password]
button "Log In" [enabled]
link "Forgot password?"
```

**Multiple Pages:**
```typescript
// Home page
await mcp_playwright_browser_navigate({ url: "http://localhost:3000" });
const homeSnapshot = await mcp_playwright_browser_snapshot();

// Dashboard
await mcp_playwright_browser_navigate({ url: "http://localhost:3000/dashboard" });
const dashSnapshot = await mcp_playwright_browser_snapshot();
```

### Selector Verification

**Before Writing Tests:**
```typescript
// Navigate to page
await mcp_playwright_browser_navigate({ url: "http://localhost:3000/login" });

// Get snapshot
const snapshot = await mcp_playwright_browser_snapshot();

// Extract ref from snapshot output
// Example: `textbox "Email" [ref=abc123]`

// Verify selector works
await mcp_playwright_browser_click({ 
  element: "Email textbox",
  ref: "abc123"  // From snapshot
});
```

**This ensures:**
- Selectors exist in actual DOM
- Elements are interactive
- No flaky selectors in tests

---

## Best Practices

### 1. Always Check Docs First
```typescript
// ❌ Don't assume API from memory
await page.getByTestId('submit').click();

// ✅ Check latest Playwright docs
const docs = await mcp_context7_get_library_docs({...});
// Then use correct pattern from docs
```

### 2. Verify Before Building
```typescript
// ❌ Don't write POMs blindly
class LoginPage {
  async login() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}

// ✅ Browse first, verify selectors exist
await mcp_playwright_browser_navigate({...});
const snapshot = await mcp_playwright_browser_snapshot();
// Check snapshot shows: button "Sign In"
// Then write POM
```

### 3. Use Topic-Specific Queries
```typescript
// ❌ Too broad
topic: "playwright"

// ✅ Specific to task
topic: "fixtures worker scoped test scoped scope"
topic: "locators getByRole getByText priority"
topic: "configuration parallel workers timeout"
```

### 4. Check After Errors
```typescript
// Test fails with "selector not found"
// ❌ Don't guess fixes

// ✅ Browse with MCP, verify selector exists
await mcp_playwright_browser_navigate({ url: failedPageUrl });
await mcp_playwright_browser_snapshot();
// See actual DOM, fix selector
```

---

## Workflow Integration

### Prompt 1 (Analyze App)
- ✅ Resolve framework IDs
- ✅ Get framework routing docs
- ✅ Browse all pages with MCP
- ✅ Take snapshots for HTML quality scoring

### Prompt 2 (Test Plan)
- ✅ Get testing best practices docs
- ✅ Framework-specific test patterns

### Prompt 3 (Infrastructure)
- ✅ Get Playwright config docs
- ✅ Get fixtures documentation
- ✅ Get CI/CD patterns

### Prompt 4 (Page Objects)
- ✅ Get locator strategy docs
- ✅ Verify selectors with MCP browser
- ✅ Check POM best practices

### Prompt 5 (Implement Tests)
- ✅ Get assertion docs
- ✅ Get test isolation patterns
- ✅ Debug failures with MCP browser

### Prompt 6 (Review)
- No MCP needed (code review phase)

---

## Error Handling

### MCP Not Available
```typescript
try {
  await mcp_context7_get_library_docs({...});
} catch (error) {
  // Inform user: "Context7 MCP not installed. Please install it first."
  // Provide installation instructions
}
```

### Browser MCP Issues
```typescript
try {
  await mcp_playwright_browser_navigate({...});
} catch (error) {
  // Check if dev server is running
  // Ask user to start app: npm run dev
}
```

---

## Summary

**Context7 MCP = Documentation (always latest)**
**Playwright MCP = Browser interaction (verify before building)**

Always use both for accurate, up-to-date, verified test implementations.
