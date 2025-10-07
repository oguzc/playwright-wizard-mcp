# Prompt 5: Implement Test Suite 🔁

> **REPEATABLE** - Run multiple times, picks next unchecked suite

**Input:** `test-plan.md` (from `tests/docs/`)

**Output:**

- CODE - ONE `.spec.ts` file
- UPDATE - Mark suite complete in `test-plan.md`

---

## Prerequisites

> 💡 **MCP Tools:** Context7 MCP (docs) and Playwright MCP (debugging)  
> See `reference/mcp-setup.md` for detailed usage

**Verify MCPs are available:**

```typescript
// Context7 for assertion patterns
await mcp_context7_resolve_library_id({ libraryName: "playwright" });

// Playwright MCP for debugging failures
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If either fails:** Ask user to install the required MCP server, then retry.

---

// See actual DOM structure
const snapshot = await mcp_playwright_browser_snapshot();

// Compare with POM selectors - adjust if needed
```

---

## Process

### Step 1: Read Test Plan

```bash
cat tests/docs/test-plan.md
```

Find first `[ ]` unchecked suite

### Step 2: Write Test File

Create complete test file using:

- Fixtures from `tests/fixtures.ts`
- POMs from `tests/pages/`
- Test data from `tests/test-data.ts`

**Example: `tests/e2e/auth.spec.ts`**

```typescript
import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test('successful login with valid credentials', async ({ 
    page, 
    loginPage,
    workerTestUser 
  }) => {
    await loginPage.goto();
    await loginPage.login(workerTestUser.email, workerTestUser.password);
    
    // Web-first assertion
    await expect(page).toHaveURL('/dashboard');
    
    // Check user widget
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.userWidget).toBeVisible();
  });

  test('failed login - wrong password', async ({ 
    loginPage,
    workerTestUser 
  }) => {
    await loginPage.goto();
    await loginPage.login(workerTestUser.email, 'WrongPassword123!');
    
    // Should stay on login page
    await expect(loginPage.page).toHaveURL('/login');
    
    // Error message visible
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText('Invalid credentials');
  });

  test('failed login - nonexistent user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent@example.com', 'Password123!');
    
    await expect(loginPage.page).toHaveURL('/login');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test('logout redirects to homepage', async ({ 
    authenticatedPage 
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.goto();
    await dashboardPage.logout();
    
    await expect(authenticatedPage).toHaveURL('/');
  });

  test('protected route redirects to login', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('signup - new user success', async ({ 
    page,
    uniqueTestData 
  }) => {
    const signupPage = new SignupPage(page);
    const newUser = uniqueTestData.createUser();
    
    await signupPage.goto();
    await signupPage.signup(newUser.email, newUser.password, newUser.name);
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('signup - duplicate email error', async ({ 
    page,
    workerTestUser 
  }) => {
    const signupPage = new SignupPage(page);
    
    await signupPage.goto();
    await signupPage.signup(
      workerTestUser.email, // Already exists
      'NewPassword123!',
      'New User'
    );
    
    // Should stay on signup
    await expect(page).toHaveURL('/signup');
    
    // Error message
    await expect(signupPage.errorAlert).toBeVisible();
    await expect(signupPage.errorAlert).toContainText('already exists');
  });
});
```

### Step 3: Run Tests - Parallel

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=4
```

**Must pass.** If failures:

- Check selectors (verify with MCP)
- Fix test data (ensure unique per test)
- Fix waits (use web-first assertions)
- Fix isolation (no shared state)

**No skipping, no commenting out**

### Step 4: Run Tests - Serial

```bash
npx playwright test tests/e2e/auth.spec.ts --workers=1
```

**Must also pass.** If failures:

- Check for race conditions
- Check for order dependencies
- Fix cleanup (data not deleted)

### Step 5: Mark Complete

Update `test-plan.md`:

```markdown
- [x] **auth.spec.ts** - Authentication flows (P0) ✅
  - Tests: 8
  - Dependencies: Test user accounts in DB
```

Update progress:

```markdown
**Progress:** 1/5 (20%)
```

### Step 6: Report Progress

Tell user:

```
✅ auth.spec.ts complete [1/5 suites] (20%)

To continue, run Prompt 5 again to implement the next suite.
```

### Step 7: Repeat

If more `[ ]` unchecked suites remain, user runs this prompt again.

If all complete:

```
🎉 All test suites complete! [5/5] (100%)

Next: Run Prompt 6 to review & optimize.
```

---

## Quality Requirements

Every test MUST:

- ✅ Use web-first assertions: `expect().toBeVisible()` not `isVisible()`
- ✅ Use fixtures (no manual setup)
- ✅ Use POMs (no raw selectors in tests)
- ✅ Use unique test data (no hardcoded emails/IDs)
- ✅ Pass with `--workers=4` (parallel)
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

- [ ] One test file created
- [ ] All test cases from plan implemented
- [ ] Tests pass with `--workers=4`
- [ ] Tests pass with `--workers=1`
- [ ] Web-first assertions used
- [ ] No `.only` or `.skip`
- [ ] Suite marked `[x]` in `test-plan.md`
- [ ] Progress updated

**Next:** Run this prompt again for next suite, or Prompt 6 when all complete
