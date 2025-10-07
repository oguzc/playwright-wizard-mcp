# Prompt 6: Review & Optimize 🎯

> Final audit - parallel safety + performance

**Input:** All test files

**Output:** Analysis + CODE fixes

---

## Task 1: Audit Parallel Safety

Run tests with different worker counts:

```bash
npx playwright test --workers=1
npx playwright test --workers=2
npx playwright test --workers=4
npx playwright test --workers=8
```

**All must pass with same results**

### Check for Issues

**Hardcoded test data:**

```typescript
// ❌ BAD - Race condition
test('create user', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com'); // HARDCODED
});

// ✅ GOOD - Unique data
test('create user', async ({ page, uniqueTestData }) => {
  const user = uniqueTestData.createUser();
  await page.goto('/signup');
  await page.fill('[name="email"]', user.email); // UNIQUE
});
```

**Shared state in POMs:**

```typescript
// ❌ BAD - Instance variable
export class LoginPage {
  private lastEmail: string; // SHARED STATE
  
  async login(email: string) {
    this.lastEmail = email;
  }
}

// ✅ GOOD - Stateless
export class LoginPage {
  async login(email: string) {
    // No instance state
    await this.emailInput.fill(email);
  }
}
```

**Global variables:**

```typescript
// ❌ BAD
let testUserId = ''; // GLOBAL STATE

test('create user', async () => {
  testUserId = await createUser();
});

// ✅ GOOD
test('create user', async ({ uniqueTestData }) => {
  const userId = await createUser(uniqueTestData.createUser());
  // Use userId in this test only
});
```

**File operations without unique names:**

```typescript
// ❌ BAD
test('upload file', async ({ page }) => {
  await page.setInputFiles('input[type="file"]', 'test-file.txt');
});

// ✅ GOOD
test('upload file', async ({ page }, testInfo) => {
  const filename = `test-file-${testInfo.workerIndex}-${Date.now()}.txt`;
  await page.setInputFiles('input[type="file"]', filename);
});
```

### Fix All Issues

Update code to eliminate:

- Hardcoded emails, IDs, usernames
- Shared state in POMs
- Global variables
- Order dependencies between tests

---

## Task 2: Optimize Performance

### Remove Unnecessary Waits

```typescript
// ❌ BAD - Arbitrary wait
await page.waitForTimeout(3000);
await expect(page.locator('.message')).toBeVisible();

// ✅ GOOD - Auto-wait
await expect(page.locator('.message')).toBeVisible();
```

### Optimize Network Waits

```typescript
// ❌ BAD - Wait for everything
await page.waitForLoadState('networkidle');

// ✅ GOOD - Wait for DOM only
await page.waitForLoadState('domcontentloaded');
```

### Reuse Auth State

Create `tests/utils/auth.setup.ts`:

```typescript
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('TestPass123!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for auth
  await page.waitForURL('/dashboard');
  
  // Save state
  await page.context().storageState({ 
    path: 'playwright/.auth/user.json' 
  });
});
```

Update config:

```typescript
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

Update tests:

```typescript
// Tests now start authenticated
test('view dashboard', async ({ page }) => {
  await page.goto('/dashboard'); // Already logged in!
  await expect(page.locator('.user-widget')).toBeVisible();
});
```

### Enable Parallel Within Files

For independent tests:

```typescript
test.describe('Dashboard features', () => {
  test.describe.configure({ mode: 'parallel' });
  
  test('feature A', async ({ page }) => { /* ... */ });
  test('feature B', async ({ page }) => { /* ... */ });
  test('feature C', async ({ page }) => { /* ... */ });
});
```

---

## Task 3: Performance Report

Run and time:

```bash
time npx playwright test
```

Document:

```markdown
# Performance Report

**Total Duration:** 2m 30s
**Tests:** 45
**Workers:** 4

## Optimizations Applied

- ✅ Removed 12 `waitForTimeout()` calls
- ✅ Changed 8 `networkidle` to `domcontentloaded`
- ✅ Added auth state reuse (saves 30s)
- ✅ Enabled parallel within 3 describe blocks

## Before/After

- Before: 4m 15s
- After: 2m 30s
- **Improvement: 41% faster**
```

---

## Task 4: Final Checklist

Run complete test suite:

```bash
# All tests
npx playwright test

# Check HTML report
npx playwright show-report

# Verify no .only/.skip
grep -r "test.only\|test.skip" tests/
```

Verify:

- [ ] All tests pass with workers=1,2,4,8
- [ ] No hardcoded test data
- [ ] No shared state in POMs
- [ ] No `.only` or `.skip` in code
- [ ] No `waitForTimeout()`
- [ ] Auth state reused where possible
- [ ] Performance optimized

---

## Output

Create `TESTING.md` in project root:

```markdown
# E2E Testing Guide

## Running Tests

```bash
# All tests
npm run test:e2e

# With UI mode
npm run test:e2e:ui

# Single file
npx playwright test tests/e2e/auth.spec.ts

# Headed mode
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

## Test Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts          # Authentication tests
│   ├── dashboard.spec.ts     # Dashboard tests
│   └── profile.spec.ts       # Profile tests
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── fixtures.ts               # Custom fixtures
├── test-data.ts             # Test data factory
└── utils/
    ├── db-helpers.ts        # Database utilities
    └── auth.setup.ts        # Auth state setup

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests

View results in GitHub Actions

## Parallel Safety

All tests are parallel-safe:
- Unique test data per test
- No shared state
- No hardcoded values
- Tested with 1-8 workers

## Performance

- Total tests: 45
- Duration: ~2m 30s (4 workers)
- Auth state reused
- Optimized waits
```

---

## Done!

```
🎉 Test suite complete and optimized!

Summary:
- 45 tests passing
- Parallel-safe (tested with 1,2,4,8 workers)
- Performance optimized (41% faster)
- CI/CD pipeline active
- Documentation complete

Next steps:
- Run optional prompts if needed (API testing, accessibility, etc.)
- Add more test suites as features grow
- Monitor test health in CI
```
