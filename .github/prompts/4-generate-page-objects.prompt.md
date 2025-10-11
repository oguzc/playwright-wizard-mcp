# Prompt 4: Generate Page Objects 🏗️

> **REPEATABLE** - Run multiple times, picks next page to implement  
> Create POMs using selectors from Prompt 1, verify with MCP

**Input:** `selector-strategy.md`, `pages.md` (from `.playwright-wizard-mcp/`)

**Output:** CODE (per run)

- `tests/pages/BasePage.ts` (created on first run)
- ONE POM file per run (e.g., `LoginPage.ts`)
- Progress tracking in `pages.md`

---

## Prerequisites

> 💡 **Required:** Playwright MCP for selector verification  
> 💡 **Recommended:** Review built-in references

**Verify Playwright MCP is available:**

```typescript
// Playwright MCP for selector verification
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If fails:** Ask user to install Playwright MCP:
```bash
npx @playwright/test install
```
Then configure MCP in their editor settings (see reference-mcp-setup).

**Review built-in references (recommended):**

```typescript
// Get selector strategies and best practices
await mcp.callTool('reference-selector-strategies');

// Get core testing principles for POMs
await mcp.callTool('reference-core-principles');
```

These provide:
- Selector priority (semantic > test IDs > CSS)
- Page object model patterns
- Stateless POM design principles
- Method naming conventions

---

## Step 0: Check Progress

**Read `pages.md` and find the next page to implement:**

```bash
cat .playwright-wizard-mcp/pages.md
```

**Look for pages with checkboxes:**

```markdown
## Application Pages

- [ ] **Login Page** (/login) - Score: 94/100
- [ ] **Dashboard Page** (/dashboard) - Score: 78/100
- [x] **Home Page** (/) - Score: 88/100 ✅ POM created
```

**Find first `[ ]` unchecked page.** If all pages are `[x]` checked, prompt is complete.

**If this is the first run** (no POMs exist yet):
- Create `BasePage.ts` first (Task 1)
- Then create first page's POM

---

## Task 1: Create BasePage (First Run Only)

**Check if BasePage already exists:**

```bash
test -f tests/pages/BasePage.ts && echo "EXISTS" || echo "CREATE"
```

**If CREATE, create `tests/pages/BasePage.ts`:**

Create `tests/pages/BasePage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a relative URL
   */
  async goto(path: string) {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get URL of current page
   */
  url(): string {
    return this.page.url();
  }
}
```

---

## Task 2: Create Page Object for Selected Page

**For the page selected in Step 0 (first `[ ]` unchecked):**

### Step 2.1: Read Selector Strategy

```bash
# Get selector info for this specific page
cat .playwright-wizard-mcp/selector-strategy.md | grep -A 20 "PageName"
```

### Step 2.2: Create POM File

**Use selectors from `selector-strategy.md`**

### Selector Priority (semantic first, CSS last)

1. `getByRole()` - Semantic, accessible
2. `getByLabel()` - Form fields
3. `getByTestId()` - Stable test IDs
4. `getByText()` - Unique text
5. `.locator()` - CSS (last resort)

### Pattern: Semantic Selectors

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Pattern: Test IDs

```typescript
export class DashboardPage extends BasePage {
  readonly userWidget: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userWidget = page.getByTestId('user-widget');
    this.logoutButton = page.getByTestId('logout-btn');
  }

  async goto() {
    await super.goto('/dashboard');
  }

  async logout() {
    await this.logoutButton.click();
  }
}
```

**Key principles:**
- ✅ Use selectors from `selector-strategy.md`
- ✅ Follow priority: role > label > testId > text > CSS
- ✅ Stateless (no instance variables storing state)
- ✅ One action per method
- ✅ Methods return data, don't assert

---

## Task 3: Add Page Object to Fixtures

**After creating the POM, add it to fixtures:**

### Step 3.1: Add Import

```typescript
// In tests/fixtures.ts - add to existing imports
import { LoginPage } from './pages/LoginPage';  // ← Add this page
```

### Step 3.2: Add to TestFixtures Type

```typescript
type TestFixtures = {
  // ... existing fixtures
  loginPage: LoginPage;  // ← Add this page
};
```

### Step 3.3: Add Fixture Definition

```typescript
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // ... existing fixtures
  
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

**Check TypeScript:**

```bash
npx tsc --noEmit tests/fixtures.ts
```

**Must have zero errors.**

---

## Task 4: Verify Selectors with Playwright MCP ⚠️ MANDATORY

**CRITICAL: Test THIS page's selectors against the real application**

> 🚨 **DO NOT SKIP**: Every selector must be functionally verified with MCP  
> 🚨 **NOT OPTIONAL**: Visual inspection is NOT enough - must test interactions  
> 🚨 **MUST WORK**: If selector fails in MCP, fix POM immediately

### Step 4.1: Start Development Server (if not running)
  uniqueTestData: TestDataFactory;
  
  // Page object fixtures
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  signupPage: SignupPage;
  // ... add all page objects
};

type WorkerFixtures = {
  workerId: string;
};
```

### Step 3.3: Extend Test with ALL Fixtures

**Replace the entire `test` export with this:**

```typescript
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker fixture (already exists from Step 3)
  workerId: [
    async ({}, use, testInfo) => {
      await use(`w${testInfo.parallelIndex}`);
    },
    { scope: 'worker' },
  ],

  // Test data factory fixture
  uniqueTestData: async ({ workerId }, use) => {
    await use(new TestDataFactory(workerId));
  },

  // Page object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  // ... add all other page objects ...
});

export { expect } from '@playwright/test';
```

### Step 3.4: Add Advanced Fixtures (Based on test-plan.md)

**Read `.playwright-wizard-mcp/test-plan.md` "Dependencies" sections.**

**Create fixtures for commonly mentioned dependencies:**

| Test Plan Says | Create Fixture | Type |
|----------------|----------------|------|
| "Auth fixture, logged-in state" | `authenticatedPage` | `TestFixtures` |
| "Test user accounts" | `workerTestUser` | `WorkerFixtures` (scoped) |
| "Cart reset, session cleanup" | `cleanCart`, `cleanSession` | `TestFixtures` |

**Auth fixture example:**
```typescript
authenticatedPage: async ({ browser, uniqueTestData }, use) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.login(`auth-${uniqueTestData.workerId}@test.com`, 'Pass123!');
  await use(page);
  await context.close();
}
```

**Worker user example:**
```typescript
workerTestUser: [
  async ({ workerId }, use) => {
    const user = { email: `worker-${workerId}@test.com`, password: 'Pass123!' };
    // await api.users.create(user); // Setup
    await use(user);
    // await api.users.delete(user.email); // Cleanup
  },
  { scope: 'worker' }
]
```

**Guidelines:**
- ✅ Create if 3+ test suites need it
- ✅ Add TODO comments for future fixtures
- ❌ Don't create speculatively

---

**✅ Verification:**

- [ ] All page objects imported
- [ ] All added to `TestFixtures` type
- [ ] All have fixture definitions
- [ ] Each fixture creates new instance: `new PageName(page)`
- [ ] **Advanced fixtures added based on test-plan.md dependencies**
- [ ] **Auth fixtures if plan mentions "logged-in state"**
- [ ] **Worker fixtures if plan mentions "test accounts"**
- [ ] **TODOs added for future fixtures**

---

## Task 4: Verify Selectors with Playwright MCP ⚠️ MANDATORY

**CRITICAL: Test EVERY page object selector against the real application**

> 🚨 **DO NOT SKIP**: Every selector must be functionally verified with MCP  
> 🚨 **NOT OPTIONAL**: Visual inspection is NOT enough - must test interactions  
> 🚨 **MUST WORK**: If selector fails in MCP, fix POM immediately

### Step 4.1: Start Development Server (if not running)

Ask user for their dev server command if not obvious:

```bash
# Common examples:
npm run dev
# or
npm start
# or
yarn dev
```

Wait for server to be ready (check console output for "ready" message and port number).

### Step 4.2: Verify THIS Page's Selectors

**Navigate to the page you just created POM for:**

```typescript
// Navigate to the specific page
await mcp_playwright_browser_navigate({ 
  url: 'http://localhost:3000/page-path'  // Use actual URL for this page
});

// Take snapshot to see actual DOM
const snapshot = await mcp_playwright_browser_snapshot();
```

**Analyze snapshot output** - The snapshot returns elements with `ref` numbers (e.g., `0`, `1`, `2`). Verify ALL selectors in the POM exist in snapshot.

**If element NOT found in snapshot:**

```typescript
// ❌ ERROR: POM uses this selector
this.emailInput = page.getByLabel('Email');

// But snapshot shows:
// <input type="email" placeholder="Email" />
// ✅ FIX: Update selector in POM file
this.emailInput = page.getByPlaceholder('Email');
```

### Step 4.3: Test Interactive Elements

**Functionally test key interactions on THIS page:**

```typescript
// Test each interactive element with MCP
await mcp_playwright_browser_type({ element: 'Email input', ref: '0', text: 'test@example.com' });
await mcp_playwright_browser_type({ element: 'Password input', ref: '1', text: 'password123' });
await mcp_playwright_browser_click({ element: 'Submit button', ref: '2' });
await mcp_playwright_browser_wait_for({ time: 2 });
const result = await mcp_playwright_browser_snapshot();
// Verify expected behavior occurred
```

### Step 4.4: Fix and Re-test

**Iterate until ALL selectors on THIS page work:**

1. ✅ Navigate to page with MCP
2. ✅ Take snapshot
3. ✅ **FUNCTIONALLY TEST each selector** (click, fill, type)
4. ✅ Verify element responds correctly
5. ❌ If error → update POM selector
6. ✅ Re-test until ALL selectors work
7. ✅ Document any needed test IDs

**NOT ENOUGH:** Just seeing element in snapshot  
**REQUIRED:** Actually interact with element using MCP tools

**Common issues and fixes:**

**Issue: Label doesn't exist**
```typescript
// ❌ Doesn't work
this.emailInput = page.getByLabel('Email');

// Snapshot shows: <input placeholder="Email" />

// ✅ Fix
this.emailInput = page.getByPlaceholder('Email');
```

**Issue: Button text different**
```typescript
// ❌ Doesn't work
this.submitButton = page.getByRole('button', { name: 'Sign In' });

// Snapshot shows: <button>Login</button>

// ✅ Fix
this.submitButton = page.getByRole('button', { name: 'Login' });
```

**Issue: Test ID not present**
```typescript
// ❌ Doesn't work
this.userWidget = page.getByTestId('user-widget');

// Snapshot shows: <div class="user-info">

// ✅ Option 1: Use semantic selector if possible
this.userWidget = page.getByRole('region', { name: 'User' });

// ✅ Option 2: Document needed test ID for dev team
// Create a file: .playwright-wizard-mcp/needed-test-ids.md
// List: data-testid="user-widget" needed on .user-info div

// ✅ Option 3: Temporary CSS selector (refactor later)
this.userWidget = page.locator('.user-info');
```

**Issue: Element in shadow DOM or iframe**
```typescript
// ❌ Doesn't work
this.content = page.getByText('Welcome');

// Snapshot shows: <iframe> with content inside

// ✅ Fix: Target iframe first
this.content = page.frameLocator('iframe').getByText('Welcome');
```

**Issue: Cannot locate element at all** 🆘 LAST RESORT

If MCP snapshot doesn't reveal the element or correct selector:

1. **Create a minimal test file:**
```typescript
// tests/debug-selector.spec.ts
import { test } from '@playwright/test';

test('find selector', async ({ page }) => {
  await page.goto('/the-page');
  await page.pause(); // Opens Playwright Inspector
});
```

2. **Run in debug mode:**
```bash
npx playwright test tests/debug-selector.spec.ts --debug
```

3. **Ask user for help:**
```
⚠️ Cannot locate selector for [element name] on [page name].

I've opened debug mode. Please:
1. Use Playwright Inspector's "Pick locator" tool (target icon)
2. Click on the [element name] 
3. Copy the suggested selector from the inspector
4. Share it with me

Which selector should I use?
```

4. **Update POM with user-provided selector**
5. **Re-verify with MCP to ensure it works**

---

### Step 4.5: Stop Server

```bash
# Stop dev server
Ctrl+C
```

---

## Task 5: Check for Errors

**CRITICAL: After all files created, verify no TypeScript errors**

### Step 5.1: Check All Created Files

```bash
# Check for TypeScript errors
npx tsc --noEmit
```

**Must return NO errors.** If errors exist:

1. Read error output carefully
2. Fix import paths
3. Fix type definitions
4. Fix syntax errors
5. Re-run until clean

### Step 5.2: Common Issues to Fix

**Missing imports:**

```typescript
// ❌ Error: Cannot find name 'Page'
export class LoginPage {
  constructor(page: Page) {} // ERROR
}

// ✅ Fix: Add import
import { Page, Locator } from '@playwright/test';
```

**Wrong file paths:**

```typescript
// ❌ Error: Cannot find module './BasePage'
import { BasePage } from './BasePage'; // ERROR

// ✅ Fix: Correct path
import { BasePage } from './pages/BasePage';
```

**Type mismatches:**

```typescript
// ❌ Error: Type 'string | null' not assignable to 'string'
async getUsername(): Promise<string> {
  return this.userWidget.textContent(); // ERROR
}

// ✅ Fix: Handle null
async getUsername(): Promise<string> {
  return this.userWidget.textContent() || '';
}
```

### Step 5.3: Verify Each File Individually

For each created file, check errors:

```bash
# Check specific file
npx tsc --noEmit tests/pages/LoginPage.ts
npx tsc --noEmit tests/pages/DashboardPage.ts
npx tsc --noEmit tests/fixtures.ts
```

**All must be clean before proceeding to mark complete.**

---

## Task 6: Mark Page Complete

**Update `pages.md` to mark this page done:**

```bash
# Find the page and mark it complete
# Change: - [ ] **Login Page** (/login) - Score: 94/100
# To:     - [x] **Login Page** (/login) - Score: 94/100 ✅ POM verified
```

Add verification note showing all selectors tested with MCP.

---

## Task 7: Report Progress

Tell user:

```
✅ LoginPage POM complete

Summary:
- ✅ POM created: tests/pages/LoginPage.ts
- ✅ Added to fixtures.ts
- ✅ All selectors verified with MCP
- ✅ All interactions tested functionally
- ✅ TypeScript clean (no errors)

Pages remaining: X/Y

To continue, run this prompt again for the next page.
```

---

## Task 8: Repeat or Complete

**If more `[ ]` unchecked pages in `pages.md`:**
User runs this prompt again for next page.

**If all pages `[x]` complete:**
```
🎉 All page objects complete!

Summary:
- ✅ BasePage.ts created
- ✅ X page objects created
- ✅ All integrated in fixtures.ts
- ✅ All selectors verified with MCP
- ✅ TypeScript clean

Ready for Step 5: Implement Test Suite
```

---

## Output Checklist (Per Run)

**Step 0:**
- [ ] Read `pages.md` 
- [ ] Selected next `[ ]` unchecked page

**Task 1 (first run only):**
- [ ] `BasePage.ts` created (if doesn't exist)

**Task 2:**
- [ ] ONE POM file created for selected page
- [ ] Selectors from `selector-strategy.md` used
- [ ] JSDoc comments added
- [ ] Stateless design
- [ ] Methods return data (no assertions)

**Task 3:**
- [ ] Import added to `fixtures.ts`
- [ ] Added to `TestFixtures` type
- [ ] Fixture definition created
- [ ] TypeScript clean: `npx tsc --noEmit tests/fixtures.ts`

**Task 4 (⚠️ MANDATORY):**
- [ ] Dev server running
- [ ] **Page navigated with MCP**
- [ ] **Snapshot taken with MCP**
- [ ] **ALL selectors functionally tested with MCP**
- [ ] **Every input tested with mcp_playwright_browser_type**
- [ ] **Every button tested with mcp_playwright_browser_click**
- [ ] **All mismatches fixed and re-verified**

**Task 5:**
- [ ] POM file: `npx tsc --noEmit tests/pages/PageName.ts` ✅
- [ ] Fixtures: `npx tsc --noEmit tests/fixtures.ts` ✅

**Task 6:**
- [ ] Page marked `[x]` in `pages.md` with ✅ verification note

**Task 7:**
- [ ] Progress reported to user
