# Optional: Add Accessibility Tests ♿

> WCAG compliance checks with axe-core

**When to use:** Ensure accessible UI for all users

**Output:** CODE - Accessibility test suite

---

## Task 1: Install Dependencies

```bash
npm install -D @axe-core/playwright
```

---

## Task 2: Create A11y Test Suite

Create `tests/e2e/accessibility.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage is accessible', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('dashboard is accessible', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    
    const results = await new AxeBuilder({ page: authenticatedPage }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('profile page is accessible', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/profile');
    
    const results = await new AxeBuilder({ page: authenticatedPage })
      .withTags(['wcag2a', 'wcag2aa']) // Test WCAG 2 Level A & AA
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('forms have proper labels', async ({ page }) => {
    await page.goto('/login');
    
    // Check specific rules
    const results = await new AxeBuilder({ page })
      .include('form') // Only check forms
      .withRules(['label', 'label-title-only']) // Label rules
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast']) // Check contrast only
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Password')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeFocused();
    
    // Submit with Enter
    await page.keyboard.press('Enter');
  });

  test('screen reader landmarks exist', async ({ page }) => {
    await page.goto('/');
    
    // Check for landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['image-alt']) // Alt text rule
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('headings have proper hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['heading-order']) // Heading hierarchy rule
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
```

---

## Task 3: Create A11y Helper

Create `tests/utils/a11y-helper.ts`:

```typescript
import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

export async function checkA11y(
  page: Page,
  options?: {
    include?: string[];
    exclude?: string[];
    tags?: string[];
  }
) {
  let builder = new AxeBuilder({ page });

  if (options?.include) {
    builder = builder.include(options.include);
  }

  if (options?.exclude) {
    builder = builder.exclude(options.exclude);
  }

  if (options?.tags) {
    builder = builder.withTags(options.tags);
  }

  const results = await builder.analyze();

  if (results.violations.length > 0) {
    console.error('Accessibility violations:', JSON.stringify(results.violations, null, 2));
  }

  return results.violations;
}
```

Usage in tests:

```typescript
import { checkA11y } from '../utils/a11y-helper';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  
  const violations = await checkA11y(page, {
    tags: ['wcag2aa'],
    exclude: ['.third-party-widget'], // Exclude third-party content
  });
  
  expect(violations).toEqual([]);
});
```

---

## Task 4: Run A11y Tests

```bash
# Run accessibility tests only
npx playwright test accessibility.spec.ts

# Include in all tests
npx playwright test
```

---

## What Gets Checked

- ✅ **Color contrast** - Text readable on background
- ✅ **Keyboard navigation** - All interactive elements reachable
- ✅ **Screen reader labels** - ARIA labels and roles
- ✅ **Form labels** - All inputs properly labeled
- ✅ **Heading hierarchy** - Proper H1-H6 structure
- ✅ **Alt text** - Images have descriptions
- ✅ **Focus indicators** - Visible focus states
- ✅ **Semantic HTML** - Proper landmarks

---

## Fixing Violations

When tests fail, axe-core provides:

```json
{
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Elements must have sufficient color contrast",
      "nodes": [
        {
          "html": "<button class=\"btn\">Submit</button>",
          "target": [".btn"],
          "failureSummary": "Fix any: Element has insufficient color contrast"
        }
      ]
    }
  ]
}
```

**Fix:** Adjust colors to meet WCAG standards

---

## Output Checklist

- [ ] `@axe-core/playwright` installed
- [ ] `accessibility.spec.ts` created
- [ ] A11y helper created
- [ ] Tests pass on all pages
- [ ] Violations fixed

**Benefits:**

- Accessible to all users
- Better SEO
- Legal compliance (WCAG, ADA, Section 508)
- Improved UX for everyone

**Next:** Continue with other optional prompts
