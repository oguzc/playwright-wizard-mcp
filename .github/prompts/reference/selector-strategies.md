# Selector Strategies

> Comprehensive guide for choosing the right selectors

## Priority Order

1. **Semantic Selectors** (preferred)
2. **Test IDs** (when semantic HTML is poor)
3. **Never use:** CSS selectors, XPath

---

## Semantic Selectors (80-100% HTML Quality)

### getByRole (Priority 1)

**When:** Element has proper ARIA role or semantic HTML

```typescript
// Buttons
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('button', { name: /sign in/i });

// Links
await page.getByRole('link', { name: 'Home' });

// Form controls
await page.getByRole('textbox', { name: 'Email' });
await page.getByRole('checkbox', { name: 'Remember me' });

// Headings
await page.getByRole('heading', { name: 'Dashboard', level: 1 });

// Lists
await page.getByRole('list');
await page.getByRole('listitem');
```

### getByLabel (Priority 2)

**When:** Form inputs have proper `<label>` tags

```typescript
// Input with <label for="email">
await page.getByLabel('Email address');

// Case insensitive
await page.getByLabel(/password/i);

// Partial match
await page.getByLabel('First', { exact: false }); // Matches "First Name"
```

### getByText (Priority 3)

**When:** Unique text content identifies element

```typescript
// Exact text
await page.getByText('Welcome back');

// Regex
await page.getByText(/welcome/i);

// Partial match
await page.getByText('Welcome', { exact: false });
```

### getByPlaceholder (Priority 4)

**When:** Input has descriptive placeholder

```typescript
await page.getByPlaceholder('Enter your email');
await page.getByPlaceholder(/search/i);
```

---

## Test ID Selectors (0-79% HTML Quality)

### When to Add Test IDs

**HTML Quality Score < 80%:**
- Non-semantic HTML (`<div>`, `<span>` everywhere)
- Missing ARIA roles
- No labels on inputs
- Generic text ("Click here", "Submit")
- Dynamic content

**Naming Convention:**
```
{page}-{element}-{type}
```

**Examples:**
```typescript
// Login page
data-testid="login-email-input"
data-testid="login-password-input"
data-testid="login-submit-btn"

// Dashboard
data-testid="dashboard-user-menu"
data-testid="dashboard-logout-btn"
data-testid="dashboard-settings-link"

// Product list
data-testid="products-search-input"
data-testid="products-filter-dropdown"
data-testid="product-card-123"  // Dynamic ID
```

### Using Test IDs in Tests

```typescript
// Simple selector
await page.getByTestId('login-submit-btn').click();

// Chaining
await page
  .getByTestId('product-card-123')
  .getByRole('button', { name: 'Add to Cart' })
  .click();

// Within locator
const card = page.getByTestId('product-card-123');
await card.getByText('$29.99').waitFor();
```

---

## HTML Quality Scoring

### Rubric (0-100%)

**Semantic HTML (40 points):**
- `<button>` vs `<div role="button">` (10)
- `<nav>`, `<header>`, `<main>`, `<footer>` (10)
- `<h1>`-`<h6>` proper hierarchy (10)
- `<form>`, `<label>`, `<input>` associations (10)

**Accessibility (30 points):**
- ARIA roles present (10)
- Labels on all inputs (10)
- Focus management (5)
- Keyboard navigation (5)

**Text Content (20 points):**
- Descriptive button text (10)
- Unique headings (5)
- Helpful placeholders (5)

**Structure (10 points):**
- Logical DOM hierarchy (5)
- Minimal nested divs (5)

### Score Examples

**95% - Excellent:**
```html
<form aria-label="Login form">
  <label for="email">Email address</label>
  <input id="email" type="email" required>
  
  <label for="password">Password</label>
  <input id="password" type="password" required>
  
  <button type="submit">Sign in</button>
</form>
```
**Strategy:** Semantic selectors only
```typescript
await page.getByLabel('Email address').fill('test@example.com');
await page.getByRole('button', { name: 'Sign in' }).click();
```

**65% - Needs Test IDs:**
```html
<div class="form">
  <input placeholder="Email">
  <input placeholder="Password" type="password">
  <div class="btn" onclick="submit()">Submit</div>
</div>
```
**Strategy:** Add selective test IDs
```typescript
// Add to source:
<input placeholder="Email" data-testid="login-email-input">
<div class="btn" data-testid="login-submit-btn">Submit</div>

// In tests:
await page.getByTestId('login-email-input').fill('test@example.com');
await page.getByTestId('login-submit-btn').click();
```

**35% - Full Test IDs:**
```html
<div>
  <div>
    <div><input></div>
    <div><input type="password"></div>
    <div><span>Go</span></div>
  </div>
</div>
```
**Strategy:** Test ID on every interactive element
```typescript
// Add comprehensive test IDs
data-testid="login-email-input"
data-testid="login-password-input"
data-testid="login-submit-btn"
```

---

## Decision Matrix

| HTML Quality | Strategy | Example |
|-------------|----------|---------|
| 80-100% | Semantic only | `getByRole('button')` |
| 50-79% | Semantic + selective test IDs | `getByRole` where possible, test IDs for problematic elements |
| 0-49% | Full test IDs | `data-testid` on all interactive elements |

---

## Verification Workflow

### 1. Browse Page with MCP
```typescript
await mcp_playwright_browser_navigate({ url: pageUrl });
const snapshot = await mcp_playwright_browser_snapshot();
```

### 2. Analyze Snapshot Output
```
heading "Sign In" [level=1]           ← Semantic ✓
textbox "Email" [required]             ← Has label ✓
textbox "Password" [required]          ← Has label ✓
button "Log In" [enabled]              ← Semantic ✓
generic "Or continue with Google"      ← Non-semantic ⚠️
```

### 3. Score HTML Quality
- 3 semantic elements = good
- 1 generic div = slight deduction
- Overall: ~85% → Use semantic selectors

### 4. Write Selectors
```typescript
await page.getByRole('heading', { name: 'Sign In' });
await page.getByLabel('Email').fill('test@example.com');
await page.getByRole('button', { name: 'Log In' }).click();

// Generic div needs test ID
await page.getByTestId('login-google-btn').click();
```

---

## Common Pitfalls

### ❌ Don't Use CSS Selectors
```typescript
// Fragile - breaks on style changes
await page.locator('.btn-primary.mt-4').click();
await page.locator('#submit-button').click();
```

### ❌ Don't Use XPath
```typescript
// Hard to read, hard to maintain
await page.locator('//div[@class="form"]/button[1]').click();
```

### ❌ Don't Over-Specify
```typescript
// Too specific - unnecessary chaining
await page
  .locator('form')
  .locator('div')
  .getByRole('button', { name: 'Submit' })
  .click();

// Better - direct selector
await page.getByRole('button', { name: 'Submit' }).click();
```

### ✅ Do Use Flexible Patterns
```typescript
// Case insensitive
await page.getByRole('button', { name: /submit/i });

// Partial match
await page.getByText('Welcome', { exact: false });

// Chaining when needed
const dialog = page.getByRole('dialog');
await dialog.getByRole('button', { name: 'Confirm' }).click();
```

---

## Page Object Integration

### Semantic Selector Example
```typescript
export class LoginPage {
  constructor(private page: Page) {}

  // Semantic getters
  get emailInput() {
    return this.page.getByLabel('Email address');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Test ID Example
```typescript
export class DashboardPage {
  constructor(private page: Page) {}

  // Test ID getters (poor HTML quality)
  get userMenu() {
    return this.page.getByTestId('dashboard-user-menu');
  }

  get logoutButton() {
    return this.page.getByTestId('dashboard-logout-btn');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
```

---

## Summary

1. **Always prefer semantic selectors** when HTML quality is good
2. **Add test IDs strategically** when semantic HTML is missing
3. **Verify with MCP** before writing tests
4. **Use Context7** for latest Playwright locator docs
5. **Never use** CSS selectors or XPath

**Goal:** Selectors that are resilient to UI changes but still accurately target elements.
