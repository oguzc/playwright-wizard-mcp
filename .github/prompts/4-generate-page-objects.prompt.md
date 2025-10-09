# Prompt 4: Generate Page Objects 🏗️

> Create POMs using selectors from Prompt 1, verify with MCP

**Input:** `selector-strategy.md`, `pages.md` (from `.playwright-wizard-mcp/`)

**Output:** CODE

- `tests/pages/BasePage.ts`
- `tests/pages/LoginPage.ts`
- `tests/pages/DashboardPage.ts`
- etc. (one POM per page)

---

## Prerequisites

> 💡 **MCP Tools:** Context7 MCP (docs) and Playwright MCP (verification)  
> See `reference/mcp-setup.md` for detailed usage  
> See `reference/selector-strategies.md` for comprehensive selector patterns

**Verify MCPs are available:**

```typescript
// Context7 for POM patterns
await mcp_context7_resolve_library_id({ libraryName: "playwright" });

// Playwright MCP for selector verification
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If either fails:** Ask user to install the required MCP server, then retry.

---

```typescript
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "page object model"
});
```

---

## Task 1: Create BasePage

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

## Task 2: Create Page Objects

**Read `selector-strategy.md`** - use documented selectors

### Example: LoginPage (Semantic Selectors)

If strategy says "semantic only", use role/label:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors from selector-strategy.md
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    
    // Use semantic selectors as documented
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorAlert = page.getByRole('alert');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/login');
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click submit button
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.errorAlert.textContent() || '';
  }

  /**
   * Check if error is visible
   */
  async hasError(): Promise<boolean> {
    return this.errorAlert.isVisible();
  }
}
```

### Example: DashboardPage (Test IDs)

If strategy says "needs test IDs", use getByTestId:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Use test IDs as documented in selector-strategy.md
  readonly userWidget: Locator;
  readonly logoutButton: Locator;
  readonly settingsLink: Locator;
  readonly dataTable: Locator;

  constructor(page: Page) {
    super(page);
    
    // Test IDs from selector-strategy.md
    this.userWidget = page.getByTestId('dashboard-user-widget');
    this.logoutButton = page.getByTestId('dashboard-logout-btn');
    this.settingsLink = page.getByTestId('dashboard-settings-link');
    this.dataTable = page.getByTestId('dashboard-data-table');
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await super.goto('/dashboard');
  }

  /**
   * Get username from widget
   */
  async getUsername(): Promise<string> {
    return this.userWidget.textContent() || '';
  }

  /**
   * Click logout
   */
  async logout() {
    await this.logoutButton.click();
  }

  /**
   * Navigate to settings
   */
  async goToSettings() {
    await this.settingsLink.click();
  }

  /**
   * Check if data table is visible
   */
  async hasData(): Promise<boolean> {
    return this.dataTable.isVisible();
  }
}
```

---

## Task 3: Verify Selectors with MCP

For EACH page, verify selectors work:

```typescript
// Navigate to page
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000/login' });

// Take snapshot
const snapshot = await mcp_playwright_browser_snapshot();

// Verify selectors in snapshot output
// - Check "Email" label exists
// - Check "Sign In" button exists
// - Check form structure matches
```

**If selectors not found:**

1. Check actual HTML in snapshot
2. Update selector in POM
3. Verify again

---

## Selector Priority

Follow this order (from `selector-strategy.md`):

1. ✅ `getByRole()` - Best for buttons, links, inputs with roles
2. ✅ `getByLabel()` - Best for form fields with labels
3. ✅ `getByText()` - Best for static content
4. ⚠️ `getByTestId()` - Only where documented in strategy
5. ❌ `locator('.class')` - Avoid unless no other option

---

## POM Rules

**DO:**

- ✅ Keep POMs stateless (no instance variables except `page` and locators)
- ✅ Add JSDoc comments to all public methods
- ✅ Return promises for async operations
- ✅ Use descriptive method names (`login()` not `doLogin()`)

**DON'T:**

- ❌ Store test state in POMs
- ❌ Add assertions in POMs (return data, assert in tests)
- ❌ Share POMs between tests (create new instance per test)
- ❌ Use hardcoded waits (`waitForTimeout`)

---

## Output Checklist

- [ ] `BasePage.ts` created
- [ ] One POM per page from `pages.md`
- [ ] Selectors match `selector-strategy.md`
- [ ] All selectors verified with MCP
- [ ] JSDoc comments on all methods
- [ ] POMs are stateless
- [ ] Methods return data (no assertions)
