# Prompt 3: Setup Infrastructure ⚙️

> Create ONLY Playwright configuration files for parallel test execution

**Input:** `.playwright-wizard-mcp/project-config.md`

**Output:** Configuration files ONLY (absolute maximum 4 files)

---

## 🛑 MANDATORY FILE LIMIT: 4 FILES MAXIMUM

You will create EXACTLY these files and NO others:

1. ✅ `playwright.config.ts` - Test runner configuration
2. ✅ `tests/tsconfig.json` - TypeScript configuration for tests folder
3. ✅ `tests/fixtures.ts` - ONLY workerId fixture (bare minimum)
4. ✅ `tests/helpers/test-data.ts` - ONLY basic data generators

**STOP. That's it. 4 files. If you create a 5th file, you have failed.**

**Note:** Keep it simple. Page object fixtures and advanced patterns are added in Step 4.

**Note on `tests/helpers/`:**
- ✅ Generic utilities (test-data.ts for unique data generation) are OK
- ❌ Page-specific helpers (auth-helpers.ts, cart-helpers.ts, navigation-helpers.ts) are FORBIDDEN
- **We use Page Object Models (Step 4) for page interactions, NOT helper functions**

---

## What Each File Contains

### 1. `playwright.config.ts`

Read `.playwright-wizard-mcp/project-config.md` for:
- baseURL (dev server URL)
- webServer command and port

Create config with:
- baseURL from project-config
- webServer config from project-config
- workers: 4
- retries: 1
- reporters: ['html', 'json', 'junit']
- trace/screenshot on first retry
- timeout: 30000

**That's ALL. No globalSetup/globalTeardown references.**

### 2. `tests/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@playwright/test", "node"]
  },
  "include": ["**/*.ts"]
}
```

### 3. `tests/fixtures.ts`

```typescript
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  workerId: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  workerId: [
    async ({}, use, testInfo) => {
      await use(`w${testInfo.parallelIndex}`);
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
```

**THAT'S ALL. This is the foundation.**

**Step 4** will enhance this with:
- Page object fixtures
- Test data fixtures  
- Auth fixtures (based on test-plan.md requirements)
- Common data fixtures (based on test-plan.md requirements)

Start minimal. Step 4 adds what tests actually need.

### 4. `tests/helpers/test-data.ts`

```typescript
export class TestDataFactory {
  constructor(private workerId: string) {}
  
  generateEmail(): string {
    return `user-${this.workerId}-${Date.now()}@test.com`;
  }
  
  generateUsername(): string {
    return `user-${this.workerId}-${Date.now()}`;
  }
  
  generatePassword(): string {
    return `Pass${this.workerId}${Date.now()}!`;
  }
}
```

**Simple generators only. More methods can be added in Step 4 if needed.**

---

## FORBIDDEN - Do NOT Create Application-Specific Files

**Infrastructure = Generic configuration that works for ANY Playwright project**

You will NOT create files that are specific to the application being tested:

### ❌ No Application-Specific Fixtures
- No `auth.fixtures.ts`, `login.fixtures.ts`, `user.fixtures.ts`
- No `cart.fixtures.ts`, `checkout.fixtures.ts`, `product.fixtures.ts`
- No fixtures that interact with pages or APIs
- **Rule: If the fixture name relates to a feature of THIS app, don't create it**

### ❌ No Helper Files

**Generic helpers are in the 4 required files. Do NOT create additional helper files.**

- No `auth-helpers.ts`, `login-helpers.ts`, `user-helpers.ts`
- No `cart-helpers.ts`, `checkout-helpers.ts`, `product-helpers.ts`
- No `assertions.ts`, `navigation.ts`, `api-helpers.ts`
- No page interaction utilities
- No custom assertion functions
- **Rule: Page interactions go in Page Objects (Step 4), not helper functions**

### ❌ No Test Files
- No `*.spec.ts` files
- No example tests or test templates
- **Rule: Tests are not infrastructure**

### ❌ No Documentation
- No `README.md`, `SETUP.md`, `GUIDE.md`
- No markdown files explaining how to use the setup
- **Rule: Code should be self-documenting**

### ❌ No CI/CD or Extra Tooling
- No `.github/workflows/` files
- No Docker files
- No additional scripts
- **Rule: User's project may already have these**

**Bottom line: If it's not one of the 4 required files, don't create it.**

---

## Implementation Steps

1. Read `.playwright-wizard-mcp/project-config.md`
2. Create `playwright.config.ts` with correct baseURL and webServer
3. Create `tests/tsconfig.json` (copy exact content above)
4. Create `tests/fixtures.ts` (copy exact content above)
5. Create `tests/helpers/test-data.ts` (copy exact content above)
6. Verify with `npx tsc --noEmit`
7. **Count files created: Must be exactly 4**

---

## Verification

Before responding, count your files:
1. playwright.config.ts
2. tests/tsconfig.json
3. tests/fixtures.ts
4. tests/helpers/test-data.ts

**Is that exactly 4 files? If NO, delete files until it is.**

### Step 1: Generate Code Compatible with Project

Read `package.json` to check the module system:
- If `"type": "module"` exists → Use ESM syntax (direct paths, no `require`)
- If no `"type"` or `"type": "commonjs"` → CommonJS syntax is fine

**Generate `playwright.config.ts` that matches the project's module system.**

### Step 2: TypeScript Compilation Check

Run:
```bash
npx tsc --noEmit  # Must pass with 0 errors
```

If errors, fix them before proceeding.

### Step 3: Create Demo Test (Temporary Verification Only)

Create `tests/demo-verify.spec.ts`:

```typescript
import { test, expect } from './fixtures';

test.describe('Infrastructure Verification', () => {
  test('should have workerId fixture', async ({ workerId }) => {
    console.log('Running with workerId:', workerId);
    expect(workerId).toMatch(/^w\d+$/);
  });

  test('should load page', async ({ page }) => {
    await page.goto('/');
    // Just verify page loads, don't care about content
    expect(page.url()).toContain('://');
  });
});
```

**Simple tests just to verify fixtures and Playwright work.**

### Step 4: Run Demo Test to Verify Infrastructure

**🛑 MANDATORY - DO NOT SKIP THIS STEP**

Run the demo test to verify everything works:

```bash
npx playwright test tests/demo-verify.spec.ts --workers=2 --project=chromium --timeout=60000
```

**Expected outcomes:**
- ✅ Playwright loads the config successfully (no syntax errors)
- ✅ Tests compile and run (TypeScript is configured correctly)
- ✅ Fixture provides workerId (fixture system works)
- ✅ Page can navigate (webServer config is correct)

**If the test run FAILS:**
1. Read the error message carefully
2. Common issues:
   - **"require is not defined"** → Fix: Change `require.resolve()` to direct paths
   - **"Cannot find module"** → Fix: Check import paths and TypeScript config
   - **"Port already in use"** → Fix: Check webServer port or use `reuseExistingServer: true`
   - **TypeScript errors** → Fix: Check tsconfig paths and types
3. Fix the issue in the generated files
4. Run the test again
5. Repeat until tests pass

**DO NOT mark setup as complete if tests don't run.**

### Step 5: Clean Up Demo Test

After verification passes, DELETE the demo test:

```bash
rm tests/demo-verify.spec.ts
```

We only needed it to verify the infrastructure works.

### Step 6: Final File Count

Count files again:
1. playwright.config.ts
2. tests/tsconfig.json
3. tests/fixtures.ts
4. tests/helpers/test-data.ts

**Total: 4 files (demo-verify.spec.ts should be deleted)**

---

## Response Format

Only respond with success after ALL verification steps pass:

```
✅ Infrastructure Setup Complete

Files Created:
1. playwright.config.ts (ESM-compatible)
2. tests/tsconfig.json
3. tests/fixtures.ts
4. tests/helpers/test-data.ts

Total: 4 files

Verification:
✅ TypeScript compilation: 0 errors
✅ Demo test execution: Passed
✅ Fixture system: Working
✅ WebServer config: Working
✅ Module system: Compatible

Next Step: User will create Page Objects (Step 4).
```

**If verification fails, report the error and the fix applied.**

That's it. Done. Do not create anything else.