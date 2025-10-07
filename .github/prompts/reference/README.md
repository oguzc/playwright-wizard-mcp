# Reference Documentation

> Detailed patterns and examples to supplement the core prompts

## Available References

### `mcp-setup.md`
**Purpose:** MCP installation verification and comprehensive usage patterns

**Contains:**
- Prerequisites check for Context7 MCP and Playwright MCP
- Installation verification code
- Complete Context7 MCP examples (Playwright, frameworks, testing libs)
- Complete Playwright MCP examples (navigation, snapshots, verification)
- Best practices for using MCPs in testing workflow
- Error handling patterns

**Used in:** All prompts 1-5

---

### `selector-strategies.md`
**Purpose:** Comprehensive guide for choosing and writing selectors

**Contains:**
- Selector priority order (semantic → test IDs)
- Complete examples for getByRole, getByLabel, getByText, getByPlaceholder
- Test ID naming conventions and when to use them
- HTML quality scoring rubric (detailed 0-100% breakdown)
- Score examples with real HTML and recommended strategies
- Decision matrix (80-100% = semantic, 50-79% = selective, 0-49% = full test IDs)
- Verification workflow with MCP
- Common pitfalls and anti-patterns
- Page Object integration examples

**Used in:** Prompts 1, 4

---

### `fixture-patterns.md`
**Purpose:** Comprehensive guide for Playwright fixtures in parallel execution

**Contains:**
- Worker-scoped vs test-scoped fixture explanation
- Pattern 1: Test user per worker (with DB setup/teardown)
- Pattern 2: Database connection per worker
- Pattern 3: Seed data per worker
- Pattern 4: Page object per test
- Pattern 5: Authenticated session per test
- Pattern 6: Unique test data per test
- Combined fixture example (worker + test fixtures together)
- Complete usage examples in test suites
- Best practices (do's and don'ts)
- Parallel safety checklist
- Common patterns summary table

**Used in:** Prompt 3

---

## When to Use References

**In Prompts:**
- Brief pointer: `> 💡 **Reference:** reference/[file].md for [details]`
- Agent reads reference file for comprehensive patterns when needed

**Benefits:**
- ✅ Avoids duplication across prompts
- ✅ Single source of truth for complex patterns
- ✅ Easy to maintain and update
- ✅ Keeps prompts concise and action-oriented

**Example Usage:**
```markdown
> 📚 **Reference:** reference/selector-strategies.md for detailed scoring rubric
```

---

## Adding New References

When creating a new reference file:

1. **Name clearly:** `[topic]-[patterns/setup/guide].md`
2. **Structure consistently:**
   - Brief intro explaining purpose
   - Comprehensive examples with code
   - Best practices section
   - Common pitfalls
   - Summary/cheat sheet
3. **Update this index:** Add to list above
4. **Link from prompts:** Add brief pointer where relevant

---

## Reference vs Prompt Content

**Put in references:**
- Detailed scoring rubrics
- Comprehensive pattern libraries
- Multiple complete examples
- Best practices deep-dives
- Common pitfalls and anti-patterns

**Keep in prompts:**
- Task-specific instructions
- Output requirements
- Verification steps
- Quick reference (1-2 line reminders)

---

## Context7 Integration

All reference files encourage using Context7 MCP to get the absolute latest docs:

```typescript
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "[relevant topic]"
});
```

References provide patterns, Context7 provides latest API details.
