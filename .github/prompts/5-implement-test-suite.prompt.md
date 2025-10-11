# Prompt 5: Implement & Verify Test Suite 🔁

> **REPEATABLE** - Run multiple times, picks next unchecked suite
> **INCLUDES** - Quality checks, parallel safety, and optimization

**Input:** `test-plan.md` (from `.playwright-wizard-mcp/`)

**Output:**

- CODE - ONE `.spec.ts` file per run
- VERIFICATION - Tests pass in parallel & serial
- QUALITY - Optimized for performance and reliability
- UPDATE - Mark suite complete in `test-plan.md`

---

## Prerequisites

> 💡 **Required:** Playwright MCP for debugging  
> 💡 **Recommended:** Review built-in references

**Verify Playwright MCP is available:**

```typescript
// Playwright MCP for debugging failures
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If fails:** Ask user to install Playwright MCP (see reference-mcp-setup), then retry.

**Review built-in references:**

```typescript
// Get fixture patterns for test isolation
await mcp.callTool('reference-fixture-patterns');

// Get core testing principles
await mcp.callTool('reference-core-principles');
```

These provide:
- Web-first assertion patterns
- Test isolation best practices
- Fixture usage examples
- Parallel execution patterns

---

// See actual DOM structure
const snapshot = await mcp_playwright_browser_snapshot();

// Compare with POM selectors - adjust if needed
```

---

## Process

### Step 0: Verify Prerequisites

**CRITICAL: Ensure previous steps completed correctly**

```bash
# Check fixtures.ts exists and has page object fixtures
cat tests/fixtures.ts | grep -E "import.*Page|loginPage:|dashboardPage:"
```

**Must see:**

- ✅ Page object imports: `import { LoginPage } from './pages/LoginPage';`
- ✅ Fixture definitions: `loginPage: async ({ page }, use) =>`

**If missing:** Go back to Step 4 (Generate Page Objects) - fixture integration was skipped!

**Note on Fixtures:**
> Fixtures should already be ready from Step 4 (page objects + auth + data).  
> **If you discover a missing fixture pattern, add it to fixtures.ts and document it.**

---

### Step 1: Read Test Plan

```bash
cat .playwright-wizard-mcp/test-plan.md
```

Find first `[ ]` unchecked suite

### Step 1.5: Pre-Flight Verification ⚠️ MANDATORY

**BEFORE writing any test code, verify page objects still work:**

```typescript
// Start dev server if not running
// npm run dev (in background)

// Verify page objects for this test suite work
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/login' });
const snapshot = await mcp_playwright_browser_snapshot();

// Test each selector you'll use in tests
// Example: If writing auth tests, verify login page selectors
await mcp_playwright_browser_type({
  element: 'Email input',
  ref: 'X', // from snapshot
  text: 'test@example.com'
});
// ... test other critical selectors
```

**If ANY selector fails:**
1. 🚨 STOP - do not write tests
2. Try to identify correct selector from MCP snapshot
3. If still can't find it → **Use debug mode (last resort):**
   ```bash
   # Create minimal test and run in debug
   npx playwright test tests/debug.spec.ts --debug
   ```
   Ask user to use "Pick locator" tool to identify the element
4. Go back to Step 4 to fix page object with correct selector
5. Re-verify with MCP
6. Return here and continue

**Why this is critical:**
- Page objects may have been created with assumptions
- DOM may have changed since Step 4
- Prevents writing tests that will immediately fail

### Step 2: Write Tests ONE AT A TIME ⚠️ ITERATIVE PROCESS

**DO NOT write all tests at once! Follow this process for EACH test:**

1. Write ONE test
2. Run that test
3. Verify it passes
4. Fix if needed (using MCP for debugging)
5. Move to next test

**Process for each test:**

#### 2.1: Write First Test

Create test file if doesn't exist: `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ 
    loginPage,
    dashboardPage,
    uniqueTestData 
  }) => {
    await loginPage.login(uniqueTestData.email, uniqueTestData.password);
    await expect(dashboardPage.page).toHaveURL('/dashboard');
  });
});
```

#### 2.2: Check TypeScript Errors

```bash
npx tsc --noEmit tests/e2e/auth.spec.ts
```

**Must be clean.** Fix any errors before running.

#### 2.3: Run The Test

```bash
npx playwright test tests/e2e/auth.spec.ts --grep "should login successfully"
```

#### 2.4: If Test FAILS - Debug with MCP

**Use MCP to understand why:**

```typescript
// Navigate to the page where it fails
await mcp_playwright_browser_navigate({ 
  url: 'http://localhost:3000/login' 
});

// Take snapshot
const snapshot = await mcp_playwright_browser_snapshot();

// Try the interaction manually
await mcp_playwright_browser_type({ element: 'Email input', ref: 'X', text: 'test@example.com' });
await mcp_playwright_browser_type({ element: 'Password input', ref: 'Y', text: 'password' });
await mcp_playwright_browser_click({ element: 'Submit button', ref: 'Z' });
await mcp_playwright_browser_wait_for({ time: 2 });
const afterSubmit = await mcp_playwright_browser_snapshot();

// Analyze: Did it redirect? Error message? What went wrong?
```

**Common issues:**

- ❌ Selector doesn't work → Fix POM, re-verify with MCP
- ❌ Wrong test data → Update test data
- ❌ Timing issue → Add proper wait in POM
- ❌ Wrong expectation → Update assertion

#### 2.5: Fix and Re-run Until PASSES

**Keep iterating until test passes:**

```bash
# After fixing
npx playwright test tests/e2e/auth.spec.ts --grep "successful login"
```

**✅ Test must pass before moving to next test**

#### 2.6: Add Next Test

**Only after first test passes, add second test:**

```typescript
test.describe('Authentication', () => {
  test('successful login with valid credentials', async ({ 
    loginPage,
    dashboardPage,
    workerTestUser 
  }) => {
    // ... (already passing)
  });

  test('failed login - wrong password', async ({ loginPage, uniqueTestData }) => {
    await loginPage.login(uniqueTestData.email, 'WrongPassword');
    await expect(loginPage.errorAlert).toBeVisible();
  });
});
```

#### 2.7: Run and Fix Second Test

```bash
npx playwright test tests/e2e/auth.spec.ts --grep "failed login - wrong password"
```

**If fails → Use MCP to debug → Fix → Re-run → Must pass**

#### 2.8: Repeat for Each Test

**Continue this pattern:**
- Add one test
- Run it
- Debug with MCP if fails
- Fix until passes
- Move to next

**Example final file (all tests verified):**

**Example final file (all tests verified):**

```typescript
import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  // ✅ Test 1 - VERIFIED PASSING
  test('successful login with valid credentials', async ({ 
    loginPage,
    dashboardPage,
    uniqueTestData 
  }) => {
    await loginPage.login(uniqueTestData.email, uniqueTestData.password);
    await expect(dashboardPage.page).toHaveURL('/dashboard');
  });

  // ✅ Test 2 - VERIFIED PASSING
  test('failed login - wrong password', async ({ loginPage, uniqueTestData }) => {
    await loginPage.login(uniqueTestData.email, 'WrongPassword');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  // ✅ Test 3 - VERIFIED PASSING
  test('failed login - nonexistent user', async ({ loginPage }) => {
    await loginPage.login('nonexistent@example.com', 'password');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  // ... add more tests one by one, verifying each passes
});
```

**Key principles:**
- ✅ Use fixtures from `tests/fixtures.ts`
- ✅ ONLY write one test at a time
- ✅ Run each test immediately after writing
- ✅ Use MCP to debug failures
- ✅ Fix until test passes
- ✅ Then move to next test

**If you discover missing fixture:**
1. 🛑 Stop writing tests
2. Add fixture to `tests/fixtures.ts`
3. Verify: `npx tsc --noEmit tests/fixtures.ts`
4. Continue with new fixture

---

## Step 3: Final Verification - All Tests Together

**After all tests pass individually, run them together:**

### Step 3.1: Run Serial

### Step 3.1: Run Serial

**First verify all tests pass in sequence:**

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=1
```

**If ANY tests fail:**

### Step 3.1a: Identify Failing Tests

```bash
# Get list of failing tests
npx playwright test tests/e2e/auth.spec.ts --workers=1 --reporter=list
```

**Note which tests failed** (e.g., "failed login - wrong password")

### Step 3.1b: Fix ONE Failing Test at a Time

**For EACH failing test:**

1. **Run ONLY that test:**
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "failed login - wrong password"
```

2. **Debug with MCP:**
```typescript
// Navigate to page where it fails
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/login' });
const snapshot = await mcp_playwright_browser_snapshot();

// Test the flow manually
await mcp_playwright_browser_type({ element: 'Email', ref: '0', text: 'user@test.com' });
await mcp_playwright_browser_type({ element: 'Password', ref: '1', text: 'WrongPass' });
await mcp_playwright_browser_click({ element: 'Submit', ref: '2' });
await mcp_playwright_browser_wait_for({ time: 2 });
const result = await mcp_playwright_browser_snapshot();

// Analyze: What's different from test expectation?
```

3. **Fix the issue:**
   - Wrong selector → Update POM
   - Wrong data → Update test data
   - Wrong assertion → Update test expectation
   - Timing issue → Add proper wait

4. **Re-run this specific test:**
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "failed login - wrong password"
```

5. **Verify it passes** before moving to next failing test

### Step 3.1c: Re-run All Tests

**After fixing all failing tests individually, run full suite:**

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=1
```

**Must pass.** If new failures appear, repeat Step 3.1a-c.

---

### Step 3.2: Run Parallel

**After serial passes, test parallel execution:**

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=50%
```

**⚠️ Recommendation:** Use **50-70%** of CPU cores for optimal balance.

**If ANY tests fail in parallel (but passed in serial):**

### Step 3.2a: Identify Failing Tests

Note which tests failed.

### Step 3.2b: Fix ONE Failing Test at a Time

**For EACH test that fails only in parallel:**

1. **Run ONLY that test multiple times:**
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "test name" --workers=50% --repeat-each=5
```

2. **Analyze the issue:**
   - Shared state? → Verify fixture isolation
   - Test data collision? → Use `uniqueTestData` fixture
   - Race condition? → Add proper waits

3. **Debug with MCP if needed** (same as Step 3.1b)

4. **Fix and re-run until passes consistently**

### Step 3.2c: Re-run All Tests in Parallel

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=50%
```

**Must pass.** If failures persist, repeat Step 3.2a-c focusing on remaining failures only.

---

## Step 4: Common Debugging Patterns

**Use MCP to debug failures:**

### Selector Not Found

```typescript
// Navigate and check DOM
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/page' });
const snapshot = await mcp_playwright_browser_snapshot();
// Find element and update POM selector
```

### Unexpected Behavior

```typescript
// Test flow manually
await mcp_playwright_browser_type({ element: 'Email', ref: '0', text: 'test@example.com' });
await mcp_playwright_browser_click({ element: 'Submit', ref: '2' });
await mcp_playwright_browser_wait_for({ time: 2 });
const result = await mcp_playwright_browser_snapshot();
```

### Last Resort: Debug Mode

```bash
npx playwright test tests/e2e/auth.spec.ts --grep "test name" --debug
```

Ask user to use Playwright Inspector's "Pick locator" tool.

---

### If Tests Fail

1. ✅ Read error message carefully
2. ✅ Use Playwright MCP to reproduce issue
3. ✅ Take snapshots to understand state
4. ✅ Fix selector/wait/data issue
5. ✅ Re-run until all pass
6. ❌ **DO NOT skip or comment out tests**

**No skipping, no commenting out**

---

## Step 5: Run Tests - Serial

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=1
```

**Must also pass.** If failures:

- Check for race conditions
- Check for order dependencies
- Fix cleanup (data not deleted)

---

## Step 6: Verify Test Quality

**CRITICAL: Ensure tests are robust**

### Check 1: Tests are deterministic

```bash
# Run 3 times - should pass all 3 times
npx playwright test tests/e2e/auth.spec.ts --workers=50% --repeat-each=3
```

**If flaky:** Tests pass sometimes, fail sometimes
- Use MCP to debug timing issues
- Add proper waits (web-first assertions)
- Check for animations/transitions

### Check 2: Tests clean up properly

```bash
# Run twice in a row
npx playwright test tests/e2e/auth.spec.ts
npx playwright test tests/e2e/auth.spec.ts
```

**If second run fails:** Cleanup issue
- Check test data is unique
- Check database cleanup
- Check no leftover sessions

**Pattern 1: Selector Not Found**
```
Error: locator.fill: Target closed
  - selector: getByLabel('Email')
```

**Step 1: Debug with MCP**
```typescript
// Navigate to page
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/login' });
const snapshot = await mcp_playwright_browser_snapshot();

// Check if selector exists in snapshot
// Look for the element and try to identify correct selector
```

**Step 2: If still can't find selector → Use Debug Mode (Last Resort)**

Run the test in debug mode and ask user to help locate selector:

```bash
# Run test in debug mode
npx playwright test tests/e2e/auth.spec.ts --grep "test name" --debug
```

**Then ask user:**
```
⚠️ Cannot locate selector for [element name] on [page name].

I've opened the test in debug mode. Please:

1. Pause at the failing line
2. Open Playwright Inspector
3. Use the "Pick locator" tool (target icon) to click the element
4. Copy the suggested selector
5. Share it with me

Which selector should I use for [element name]?
```

**Step 3: Update POM with user-provided selector**

```typescript
// Update in tests/pages/PageName.ts
this.elementName = page.locator('user-provided-selector');
```

**Step 4: Re-verify with MCP**

```typescript
// Test the new selector works
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/page' });
const snapshot = await mcp_playwright_browser_snapshot();
// Verify element appears in snapshot
```

---

**Pattern 2: Unexpected Navigation**
```
Error: expect(page).toHaveURL('/dashboard')
  Expected: /dashboard
  Received: /login
```

```typescript
// Manually test the flow
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/login' });
await mcp_playwright_browser_type({ element: 'Email', ref: '0', text: 'test@example.com' });
await mcp_playwright_browser_type({ element: 'Password', ref: '1', text: 'password' });
await mcp_playwright_browser_click({ element: 'Submit', ref: '2' });
await mcp_playwright_browser_wait_for({ time: 2 });
const result = await mcp_playwright_browser_snapshot();
// Analyze: Error message? Validation issue? Wrong credentials?
```

**Pattern 3: Element Not Visible**
```
Error: expect(locator).toBeVisible()
  Received: hidden
```

```typescript
const snapshot = await mcp_playwright_browser_snapshot();
// Is element present but hidden? Wrong selector? Timing issue?
```

**Pattern 4: Test Data Conflicts**
```
Error: User already exists
```

```typescript
// Fix: Use uniqueTestData fixture
test('signup', async ({ signupPage, uniqueTestData }) => {
  const user = uniqueTestData.createUser(); // Unique per test
  await signupPage.signup(user.email, user.password);
});
```

**General debugging process:**
1. 🔍 Read error message carefully
2. 🌐 Navigate to page with MCP
3. 📸 Take snapshot with MCP
4. 🔧 Test interaction manually with MCP
5. 🎯 Try to identify root cause
6. 🆘 **If can't find selector → Run in debug mode, ask user to locate it**
7. ✅ Fix (POM/test data/assertion)
8. ♻️ Re-run test
9. ✅ Verify passes

**Last Resort for Selector Issues:**
When MCP snapshot doesn't reveal the correct selector, use Playwright debug mode:

```bash
npx playwright test tests/e2e/auth.spec.ts --grep "test name" --debug
```

Ask user to use Playwright Inspector's "Pick locator" tool to identify the correct selector.

---

## Step 5: Verify Test Quality

**After all tests pass, verify quality:**

### 5.1: Check TypeScript

```bash
npx tsc --noEmit tests/e2e/auth.spec.ts
```

**Must have zero errors.**

### 5.2: Check Tests are Deterministic

Run 3 times in parallel:

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=50%
npx playwright test tests/e2e/auth.spec.ts --workers=50%
npx playwright test tests/e2e/auth.spec.ts --workers=50%
```

**If ANY test fails in any run:**

1. **Identify flaky test(s)** - note which tests failed
2. **Run ONLY flaky test multiple times:**
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "flaky test name" --repeat-each=10
```

3. **Debug with MCP** - reproduce the failure
4. **Fix the race condition:**
   - Add proper waits
   - Fix timing assumptions
   - Ensure proper cleanup

5. **Re-run the specific test** until passes consistently:
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "fixed test name" --repeat-each=10
```

6. **Then re-run full suite 3x** to confirm all stable

### 5.3: Check Tests are Isolated

Run with different worker counts:

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=1
npx playwright test tests/e2e/auth.spec.ts --workers=50%
```

**If tests fail with different worker counts:**

1. **Identify which tests fail** with specific worker count
2. **Run ONLY those tests** with problematic worker count:
```bash
npx playwright test tests/e2e/auth.spec.ts --grep "problem test" --workers=50%
```

3. **Debug the isolation issue:**
   - Shared state between tests?
   - Data not properly isolated?
   - Cleanup not working?

4. **Fix and verify:**
```bash
# Test with both worker counts
npx playwright test tests/e2e/auth.spec.ts --grep "fixed test" --workers=1
npx playwright test tests/e2e/auth.spec.ts --grep "fixed test" --workers=50%
```

5. **Re-run full suite** with both worker counts to confirm

**Note:** Adjust worker percentage (30%, 50%, 70%) based on machine performance.

---

## Step 6: Optimize Performance

**Only after tests pass reliably:**

```typescript
// ❌ Remove arbitrary waits
await page.waitForTimeout(3000);

// ✅ Use web-first assertions
await expect(element).toBeVisible();
```

---

## Step 7: Mark Complete

Update `test-plan.md`:

```markdown
- [x] **auth.spec.ts** - Authentication flows (P0) ✅
  - Tests: 8 (all passing ✅)
  - Serial: ✅ | Parallel: ✅ | Deterministic: ✅
```

Update progress:

```markdown
**Progress:** 1/5 (20%)
```

---

## Step 8: Report Progress

Tell user:

```
✅ auth.spec.ts complete [1/5 suites] (20%)

Summary:
- ✅ 8 tests written and verified one-by-one
- ✅ All tests pass individually
- ✅ Tests pass in serial (workers=1)
- ✅ Tests pass in parallel (workers=4)
- ✅ Tests are deterministic (3x repeat passes)
- ✅ TypeScript compiles (no errors)

To continue, run this prompt again to implement the next suite.
```

---

## Step 9: Repeat or Complete

If more `[ ]` unchecked suites remain, user runs this prompt again.

If all complete:

```
🎉 All test suites complete! [5/5] (100%)

Tests are production-ready! 🚀

Optional Next Steps:
- setup-ci-cd - Add GitHub Actions
- add-accessibility - Add axe-core testing
- add-api-testing - Add API coverage
```

---

## Quality Requirements

Every test MUST:

- ✅ Use web-first assertions: `expect().toBeVisible()` not `isVisible()`
- ✅ Use fixtures (no manual setup)
- ✅ Use POMs (no raw selectors in tests)
- ✅ Use unique test data (no hardcoded emails/IDs)
- ✅ Pass with `--workers=50%` (parallel)
- ✅ Pass with `--workers=1` (serial)
- ✅ No `.only` or `.skip` in committed code
- ✅ No `waitForTimeout()` (use auto-wait)

---

## Fixing Rules

When tests fail:

**DO:**

- ✅ Fix selectors
- ✅ Add proper waits (web-first)
- ✅ Fix test data uniqueness
- ✅ Fix cleanup
- ✅ Fix isolation issues

**DON'T:**

- ❌ Skip tests
- ❌ Delete tests
- ❌ Comment out tests
- ❌ Add `.only` (unless debugging locally)

---

## Common Issues

**Issue:** Tests fail in parallel but pass in serial

**Fix:** Test data not unique - use `uniqueTestData` fixture

---

**Issue:** Selector not found

**Fix:** Verify with MCP, check `selector-strategy.md`

---

**Issue:** Intermittent failures

**Fix:** Replace `waitForTimeout()` with `expect().toBeVisible()`

---

## Output Checklist

**Step 1:**
- [ ] Test plan read
- [ ] **Selectors pre-verified with MCP (Step 1.5)** ⚠️ MANDATORY
- [ ] Dev server running

**Step 2 (Iterative):**
- [ ] **Tests written ONE AT A TIME** ⚠️ MANDATORY
- [ ] **Each test run immediately after writing** ⚠️ MANDATORY
- [ ] **Each test debugged with MCP if failed** ⚠️ MANDATORY
- [ ] **Each test fixed until passing** ⚠️ MANDATORY
- [ ] All page objects used via fixtures (no `new PageName(page)`)
- [ ] TypeScript compiles with zero errors

**Step 3 (Final Verification):**
- [ ] **All tests pass together in serial (workers=1)**
- [ ] **All tests pass together in parallel (workers=4)**

**Step 5 (Quality):**
- [ ] Tests deterministic (3x repeat passes)
- [ ] Tests isolated (different worker counts pass)
- [ ] TypeScript clean: `npx tsc --noEmit`

**Step 7-8:**
- [ ] Suite marked `[x]` in `test-plan.md` with quality summary
- [ ] Progress updated
- [ ] User notified

**General:**
- [ ] Web-first assertions used
- [ ] No `.only` or `.skip`
- [ ] **MCP debugging used for all failures**
