# Core Testing Principles

> Foundational principles that guide all test implementation

## Discovery & Strategy

1. **Discovery First** - Understand the app before testing
2. **Semantic Selectors First** - Add test IDs only when semantic HTML is insufficient
3. **Verify Before Building** - MCP checks elements before writing tests

## Implementation Quality

4. **One Suite at a Time** - Small, focused, working increments
5. **No Skipping** - Fix real issues, never skip/delete tests
6. **Track Progress** - User always knows what's left
7. **Web-First Assertions** - Use `expect().toBeVisible()` not `isVisible()`

## Parallel Execution

8. **Isolated Fixtures** - Worker-scoped for DB, test-scoped for UI state
9. **Trace on Retry** - Always collect traces for CI debugging
10. **No .only/.skip** - `forbidOnly: !!process.env.CI` prevents accidents

## Framework Philosophy

11. **Framework-Agnostic** - Detect and adapt to any tech stack
12. **Test Pyramid Aware** - API/Component/E2E tests when appropriate
13. **Accessibility Built-In** - WCAG compliance from day one
14. **Mobile-Ready** - Test responsive behavior for critical flows

## DevOps Integration

15. **CI/CD Native** - Tests run automatically on every PR
16. **Observable Tests** - Track flakiness, duration, coverage over time

---

## Application in Workflow

### Prompt 1: Analyze App
- Applies: #1 (Discovery First), #2 (Semantic Selectors First), #3 (Verify Before Building)
- Ensures semantic HTML is preferred, test IDs only when needed

### Prompt 2: Generate Test Plan
- Applies: #4 (One Suite at a Time), #6 (Track Progress)
- Creates focused suites with checkboxes for tracking

### Prompt 3: Setup Infrastructure
- Applies: #8 (Isolated Fixtures), #9 (Trace on Retry), #10 (No .only/.skip), #15 (CI/CD Native)
- Configures parallel-safe fixtures and CI pipeline

### Prompt 4: Generate Page Objects
- Applies: #2 (Semantic Selectors First), #3 (Verify Before Building)
- POMs use best selectors, verified with MCP

### Prompt 5: Implement Test Suite
- Applies: #4 (One Suite at a Time), #5 (No Skipping), #7 (Web-First Assertions)
- One suite per run, must pass parallel tests, no skips

### Prompt 6: Review & Optimize
- Applies: #8 (Isolated Fixtures), #16 (Observable Tests)
- Final parallel safety audit and performance optimization

---

## Quick Reference

**Selector Priority:**
```
1. getByRole / getByLabel (semantic)
2. getByText (content-based)
3. getByTestId (last resort)
```

**Assertion Style:**
```typescript
// ✅ GOOD - Web-first
await expect(page.getByRole('button')).toBeVisible();

// ❌ BAD - Not resilient
const isVisible = await page.getByRole('button').isVisible();
expect(isVisible).toBe(true);
```

**Fixture Scoping:**
```typescript
// Worker-scoped (expensive setup)
- Database per worker
- Auth state per worker

// Test-scoped (unique data)
- Test user per test
- Unique orders/products per test
```
