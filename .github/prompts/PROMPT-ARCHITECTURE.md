# Playwright Test Agent - Prompt Architecture v3.0

> **Last Updated:** October 7, 2025  
> **Status:** Active - Universal production-ready architecture

---

## Core Principles

1. **Discovery First** - Understand the app before testing
2. **Semantic Selectors First** - Add test IDs only when semantic HTML is insufficient
3. **Verify Before Building** - MCP checks elements before writing tests
4. **One Suite at a Time** - Small, focused, working increments
5. **No Skipping** - Fix real issues, never skip/delete tests
6. **Track Progress** - User always knows what's left
7. **Web-First Assertions** - Use `expect().toBeVisible()` not `isVisible()`
8. **Isolated Fixtures** - Worker-scoped for DB, test-scoped for UI state
9. **Trace on Retry** - Always collect traces for CI debugging
10. **No .only/.skip** - `forbidOnly: !!process.env.CI` prevents accidents
11. **Framework-Agnostic** - Detect and adapt to any tech stack
12. **Test Pyramid Aware** - API/Component/E2E tests when appropriate
13. **Accessibility Built-In** - WCAG compliance from day one
14. **Mobile-Ready** - Test responsive behavior for critical flows
15. **CI/CD Native** - Tests run automatically on every PR
16. **Observable Tests** - Track flakiness, duration, coverage over time

---

## Workflow

```text
1. Analyze App → tests/docs/{project-config, pages, selector-strategy}.md
   (Detect stack, browse all pages, decide selector strategy - ONE PASS)

2. Generate Test Plan → tests/docs/test-plan.md
   (Test suites + priorities + tracking)

3. Setup Infrastructure → playwright.config.ts + CI/CD + fixtures + test data
   (All infrastructure in one shot)

4. Generate Page Objects → POMs with verified selectors
   (Use strategy from step 1, verify with MCP)

5. Implement Test Suite → ONE suite at a time (REPEATABLE)
   (Run multiple times - picks next unchecked suite)

6. Review & Optimize → Parallel safety + performance
   (Final audit and improvements)

Optional Prompts (run as needed):
- Add API Testing → API helpers + contract tests
- Add Component Testing → Component test config
- Add Accessibility Tests → a11y suite
- Add Visual Regression → Screenshot tests
```

---

## Prompts

### Core Workflow Prompts

### **1. Analyze App** 🔍 ALL-IN-ONE

**File:** `1-analyze-app.md`  
**Output:** (in `tests/docs/` folder)
- `project-config.md` - Tech stack detected
- `pages.md` - All pages with DOM quality scores
- `selector-strategy.md` - Which pages need test IDs + CODE changes if needed

**Key:** Do everything in ONE pass - detect stack, browse app, analyze DOM, decide selectors, add test IDs

**What the prompt does:**
1. Detect framework (Next.js, React, Vue, etc.) from package.json
2. Start dev server and browse all pages with MCP
3. Score HTML semantic quality (0-100%) per page
4. Decide selector strategy (semantic vs test IDs)
5. Add test IDs to source code ONLY if needed (score <80%)
6. Document everything in 3 output files

**Agent instructions:**
- Use #context7 for framework-specific docs
- Use MCP `browser_navigate` + `browser_snapshot` to explore
- Be thorough - find all pages including protected routes
- Only add test IDs where HTML quality is poor
- Follow naming: `{page}-{element}-{type}`

---

### **2. Generate Test Plan** 📋

**File:** `2-generate-test-plan.md`  
**Output:** `tests/docs/test-plan.md` - Test suites with checkboxes

**Key:** Break testing into 5-10 focused suites with tracking

**What the prompt does:**
1. Read all 3 files from Prompt 1
2. Group tests by feature/page
3. List test cases per suite
4. Add checkboxes for progress tracking
5. Set priorities (P0/P1/P2)

**Agent instructions:**
- Keep suites small (8-15 tests each)
- P0 = auth + critical flows
- Each suite gets quality gates
- Format for Prompt 5 to consume

---

### **3. Setup Infrastructure** ⚙️ ALL-IN-ONE

**File:** `3-setup-infrastructure.md`  
**Output:** ALL infrastructure code
- `playwright.config.ts`
- `.github/workflows/playwright.yml` (or GitLab CI)
- `tests/fixtures.ts` (worker + test scoped)
- `tests/test-data.ts` (factories with Faker)
- `tests/utils/db-helpers.ts` (seeding + cleanup)

**Key:** Create ALL infrastructure in one shot - no separate prompts for fixtures/data/CI

**What the prompt does:**
1. Generate Playwright config (parallel-safe, CI-ready)
2. Create CI/CD pipeline for detected platform
3. Generate worker-scoped fixtures (DB per worker)
4. Generate test-scoped fixtures (unique data per test)
5. Create test data factories with Faker.js
6. Add DB seeding/cleanup utilities

**Agent instructions:**
- Use #context7 for latest Playwright config APIs
- Adapt to detected stack (Next.js vs Vite vs monorepo)
- `fullyParallel: true` + `forbidOnly: !!process.env.CI`
- `trace: 'on-first-retry'` always
- Worker fixtures for expensive setup (DB, auth)
- Test fixtures for unique data (products, orders)

---

### **4. Generate Page Objects** 🏗️

**File:** `4-generate-page-objects.md`  
**Output:** CODE - `BasePage.ts` + one POM per page

**Key:** Use selectors from Prompt 1, verify with MCP

**What the prompt does:**
1. Read `selector-strategy.md` from Prompt 1
2. Create BasePage with common utilities
3. Generate one POM per page
4. Use semantic selectors OR test IDs as documented
5. Navigate + verify all selectors exist with MCP

**Agent instructions:**
- Follow selector priority: role → label → text → testId
- POMs are stateless (no instance vars except page/locators)
- Verify every selector with `browser_snapshot`
- Add JSDoc comments to all methods

---

### **5. Implement Test Suite** 🔁 REPEATABLE

**File:** `5-implement-test-suite.md`  
**Output:** CODE - ONE `.spec.ts` file + update `test-plan.md`

**Key:** Run this prompt multiple times - it picks the next unchecked suite

**What the prompt does:**
1. Read `test-plan.md`
2. Find first `[ ]` unchecked suite
3. Write complete test file
4. Run with `--workers=4` (must pass)
5. Run with `--workers=1` (must pass)
6. Fix any failures (real fixes, no skipping)
7. Mark `[x]` in test-plan.md
8. Report progress: "[X/Total complete]"
9. If more suites remain, tell user to run prompt again

**Agent instructions:**
- Use web-first assertions: `expect().toBeVisible()`
- No `.only` or `.skip` in code
- Fix isolation issues (unique test data per test)
- Both parallel and serial must pass before marking complete
- Update progress percentage

---

### **6. Review & Optimize** 🎯 FINAL AUDIT

**File:** `6-review-and-optimize.md`  
**Output:** Analysis + CODE fixes

**Key:** Final pass - parallel safety + performance

**What the prompt does:**
1. Audit all test files for parallel safety issues
2. Check for shared state, hardcoded data, race conditions
3. Run tests with 1, 2, 4, 8 workers
4. Find performance bottlenecks
5. Remove unnecessary waits
6. Add `storageState` for auth reuse
7. Document any remaining issues

**Agent instructions:**
- Look for hardcoded emails, IDs, usernames
- Verify fixtures are properly scoped
- Remove `waitForTimeout()` - use web-first assertions
- Consider sharding for large suites
- Tests must pass with any worker count

---

## Optional Prompts

### **Optional: Add API Testing** 🆕

**File:** `optional-setup-api-testing.md`  
**Output:** CODE - `api-helpers.ts`, `api.spec.ts` examples  
**Key:** Test backend contracts before E2E tests  
**Documentation:** Use #context7 for latest Playwright APIs

**When to use:**
- [ ] App has REST API, GraphQL, or tRPC backend
- [ ] Want to test API contracts independently
- [ ] Need faster feedback than E2E tests
- [ ] Backend is under active development

**Skip if:**
- ❌ Static site with no backend
- ❌ Using only third-party APIs (can't control)
- ❌ Pure frontend app

**Coverage:**
- [ ] API response contracts (shape, required fields)
- [ ] Error handling (4xx, 5xx responses)
- [ ] Authentication/authorization
- [ ] Rate limiting behavior
- [ ] Database state verification helpers

**Why:** E2E tests shouldn't be first to catch API bugs

**Example:**
```typescript
test('POST /api/users returns 201 with user object', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { email: 'test@example.com', name: 'Test User' }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toMatchObject({
    id: expect.any(String),
    email: 'test@example.com',
    name: 'Test User',
    createdAt: expect.any(String),
  });
});
```

---

### **Optional: Add Component Testing** 🆕

**File:** `optional-setup-component-testing.md`  
**Output:** CODE - Component test config for React/Vue/Svelte  
**Key:** Test components in isolation before E2E  
**Documentation:** Use #context7 for latest Playwright APIs

**When to use:**
- [ ] Design system libraries
- [ ] Complex interactive components
- [ ] Form validation logic
- [ ] State management edge cases

**Framework-specific:**
- React: `@playwright/experimental-ct-react`
- Vue: `@playwright/experimental-ct-vue`
- Svelte: `@playwright/experimental-ct-svelte`

---

### **Optional: Add Accessibility Tests** 🆕

**File:** `optional-add-accessibility-tests.md`  
**Output:** CODE - a11y test suite with `@axe-core/playwright`  
**Key:** WCAG compliance checks for every page  
**Documentation:** Use #context7 for latest Playwright APIs

**Required checks:**
- [ ] Color contrast ratios
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] ARIA labels and roles
- [ ] Focus management

**Integration:**
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```



**File:** `optional-add-responsive-tests.md`  
**Output:** CODE - Mobile test variants for critical flows  
**Key:** Test on mobile viewports + touch interactions

---

### **Optional: Add Test Reporting** 🆕

**File:** `optional-setup-test-reporting.md`  
**Output:** CODE - Reporter config + dashboard integration  
**Key:** Visibility into test health over time  
**Documentation:** Use #context7 for latest Playwright APIs

**Reporters:**
- [ ] HTML reporter (built-in)
- [ ] JUnit XML (for CI integration)
- [ ] Allure reporter (advanced reporting)
- [ ] Custom Slack/Discord notifications
- [ ] Test analytics dashboard

**Metrics to track:**
- Test duration trends
- Flaky test detection
- Coverage by page/feature
- Parallel execution efficiency

**Example config:**
```typescript
reporter: [
  ['html'],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['allure-playwright'],
  ['./custom-slack-reporter.ts'],
]
```

---

## Progress Tracking Files### `project-config.md`

Created by Prompt 1, used by all other prompts

```markdown
## Project Stack Detected
- Framework: Next.js 14 (App Router)
- Database: PostgreSQL + Prisma
- Auth: Auth.js
```

### `pages.md`

Created by Prompt 2, used by Prompts 3, 4, 7

```markdown
## Pages Discovered
- Login: /login (Semantic Score: 92% ✅)
- Dashboard: /dashboard (Semantic Score: 45% ❌)
```

### `selector-strategy.md`

Created by Prompt 3, used by Prompt 8

```markdown
## Selector Strategy Analysis
- Login: ✅ Semantic only
- Dashboard: ❌ Test IDs added
```

### `test-plan.md`

Created by Prompt 4, **updated by Prompt 9** (marks suites complete)

```markdown
## Implementation Status
- [x] auth.spec.ts - Complete ✅
- [ ] dashboard.spec.ts - Not started
- [ ] profile.spec.ts - Not started
```

---

## Key Improvements Over v2.1

### ✅ Streamlined Workflow

- **6 core prompts instead of 11** - Less repetitive work
- **Prompt 1 does all discovery** - Stack + pages + selectors in ONE pass
- **Prompt 3 does all infrastructure** - Config + CI + fixtures + data in ONE shot
- **No redundant selector analysis** - Decided once, used everywhere
- **Cleaner progression** - Discover → Plan → Build → Test → Review

### ✅ Action-Oriented Prompts

- **Prompts are instructions, not documentation**
- **Concise and copy-paste ready**
- **Clear outputs and success criteria**
- **Reference docs for details** (not in prompts)

---

## Example User Workflow

```bash
# ONE-SHOT Discovery & Analysis
User: "Analyze my app at http://localhost:3000"
Agent: <Prompt 1> → Detects Next.js 14 + tRPC + Prisma
Agent: → Browses all pages with MCP
Agent: → Scores HTML quality per page
Agent: → Decides login needs semantic selectors (92%), dashboard needs test IDs (45%)
Agent: → Adds test IDs to dashboard components
Agent: → Creates: tests/docs/{project-config, pages, selector-strategy}.md

# Test Planning
User: <Runs Prompt 2>
Agent: → Creates tests/docs/test-plan.md with 3 suites (auth, dashboard, profile)

# Infrastructure Setup (ALL AT ONCE)
User: <Runs Prompt 3>
Agent: → Creates playwright.config.ts
Agent: → Creates GitHub Actions workflow
Agent: → Creates worker fixtures (DB per worker)
Agent: → Creates test fixtures (unique data)
Agent: → Creates test data factories with Faker
Agent: → Creates DB seeding utilities

# Page Objects
User: <Runs Prompt 4>
Agent: → Creates BasePage.ts
Agent: → Creates LoginPage (semantic selectors)
Agent: → Creates DashboardPage (test IDs as documented)
Agent: → Creates ProfilePage (mixed)
Agent: → Verifies all selectors with MCP

# Incremental Implementation
User: <Runs Prompt 5>
Agent: ✅ auth.spec.ts [1/3] - Passed parallel + serial

User: <Runs Prompt 5 again>
Agent: ✅ dashboard.spec.ts [2/3] - Passed parallel + serial

User: <Runs Prompt 5 again>
Agent: ✅ profile.spec.ts [3/3] 🎉 All suites complete

# Final Review
User: <Runs Prompt 6>
Agent: → Audits parallel safety
Agent: → Optimizes performance
Agent: → Removes unnecessary waits
Agent: → Adds storageState for auth
Agent: ✅ All tests pass with 1, 2, 4, 8 workers

# Optional Enhancements
User: <Runs Optional: API Testing>
Agent: ✅ API contract tests added

User: <Runs Optional: Accessibility>
Agent: ✅ a11y tests added with axe-core
```

---

## Reference Documents

The `reference/` folder contains detailed technical patterns and examples for complex scenarios. These are optional deep-dives when agents need more context than what's in the prompts.

**Core patterns:**
- `playwright-mcp-tools.md` - Complete MCP tool reference
- `selector-best-practices.md` - Selector strategy examples
- `parallel-execution-guide.md` - Parallel safety patterns
- `test-data-patterns.md` - Test data strategies

---

## Open Questions

1. Add Lighthouse performance testing to workflow?
2. Include API mocking (MSW) as default infrastructure?
3. Auto-detect flaky tests and suggest fixes?
4. Integration with test management tools (TestRail, Zephyr)?
5. Support for Playwright Trace Viewer dashboard?
6. Cross-browser visual regression (Percy, Chromatic)?
7. Load testing integration (k6, Artillery)?
8. Mutation testing for test quality validation?

---

## Version History

### v3.0 (October 8, 2025) - Streamlined & Action-Oriented

**Major Changes:**

- ✅ **Reduced from 11 to 6 core prompts** - Less repetitive work
- ✅ **Prompt 1: All-in-one analysis** - Stack detection + page browsing + selector strategy
- ✅ **Prompt 3: All-in-one infrastructure** - Config + CI + fixtures + test data
- ✅ **Prompts are instructions, not docs** - Concise, actionable, copy-paste ready
- ✅ **No redundant selector analysis** - Decided once in Prompt 1, used everywhere
- ✅ **Cleaner workflow** - Discover → Plan → Build → Test → Review
- ✅ **All features from v2.1 retained** - Just reorganized for efficiency

**Philosophy:**

- Prompts = concise agent instructions
- Architecture doc = comprehensive overview
- Reference docs = detailed technical patterns
- Each prompt has single, clear output

### v2.1 (October 7, 2025)

- ✅ Added 5 new core principles (web-first, semantic selectors, etc.)
- ✅ Separated fixtures into dedicated prompt (now 9 prompts total)
- ✅ Enhanced Prompt 7 with parallel execution validation
- ✅ Added quality gates and checklists throughout
- ✅ Integrated #context7 documentation references

### v2.0 (Original)

- Initial incremental architecture
- 8-prompt workflow
- MCP verification
- Progress tracking

---

**Status:** ✅ Ready for implementation
