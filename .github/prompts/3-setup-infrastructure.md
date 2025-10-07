# Prompt 3: Setup Infrastructure ⚙️

> Create ALL infrastructure in one shot

**Input:** `project-config.md` (from `tests/docs/`)

**Output:** ALL infrastructure code

- `playwright.config.ts`
- `.github/workflows/playwright.yml` (or GitLab CI/CircleCI)
- `tests/fixtures.ts`
- `tests/test-data.ts`
- `tests/utils/db-helpers.ts`

---

## Prerequisites

> 💡 **MCP Tool:** Context7 MCP for Playwright config and patterns  
> See `reference/mcp-setup.md` for detailed usage  
> See `reference/fixture-patterns.md` for comprehensive fixture examples

**Verify Context7 MCP is available:**

```typescript
await mcp_context7_resolve_library_id({ libraryName: "playwright" });
```

**If fails:** Ask user to install Context7 MCP, then retry.

---

## Task 1: Playwright Config

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  // Parallel execution
  fullyParallel: true,
  
  // CI safeguards
  forbidOnly: !!process.env.CI,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Workers
  workers: process.env.CI ? 4 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['github'],
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Adapt to detected stack:**

- Vite: `url: 'http://localhost:5173'`
- Monorepo: `command: 'pnpm --filter web dev'`

---

## Task 2: CI/CD Pipeline

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**For monorepos:**

```yaml
- name: Run tests
  run: pnpm --filter web test:e2e
```

---

## Task 3: Fixtures

Create `tests/fixtures.ts`:

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TestDataFactory } from './test-data';

// Worker-scoped fixture (shared across all tests in worker)
type WorkerFixtures = {
  workerTestUser: { email: string; password: string };
};

// Test-scoped fixture (unique per test)
type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
  uniqueTestData: TestDataFactory;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker fixture: one test user per worker
  workerTestUser: [async ({ }, use, workerInfo) => {
    const email = `test-worker-${workerInfo.workerIndex}@example.com`;
    const password = 'TestPass123!';
    
    // Create user in DB
    await createTestUser({ email, password });
    
    await use({ email, password });
    
    // Cleanup
    await deleteTestUser(email);
  }, { scope: 'worker' }],

  // Test fixture: new LoginPage per test
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Test fixture: authenticated session
  authenticatedPage: async ({ page, workerTestUser }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(workerTestUser.email, workerTestUser.password);
    await use(page);
  },

  // Test fixture: unique data factory
  uniqueTestData: async ({ }, use, workerInfo, testInfo) => {
    const factory = new TestDataFactory(
      workerInfo.workerIndex,
      testInfo.testId
    );
    await use(factory);
  },
});

export { expect } from '@playwright/test';
```

---

## Task 4: Test Data Factory

Create `tests/test-data.ts`:

```typescript
import { faker } from '@faker-js/faker';

export class TestDataFactory {
  constructor(
    private workerIndex: number,
    private testId: string
  ) {}

  // Generate unique email
  uniqueEmail(): string {
    const timestamp = Date.now();
    return `test-w${this.workerIndex}-${timestamp}-${faker.string.nanoid(4)}@example.com`;
  }

  // Generate unique username
  uniqueUsername(): string {
    return `user_w${this.workerIndex}_${faker.string.nanoid(8)}`;
  }

  // Create user object
  createUser(overrides?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      email: this.uniqueEmail(),
      name: faker.person.fullName(),
      password: 'TestPass123!',
      ...overrides,
    };
  }

  // Create product object
  createProduct(overrides?: Partial<Product>): Product {
    return {
      id: faker.string.uuid(),
      name: `Product ${faker.commerce.productName()}`,
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 0, max: 100 }),
      ...overrides,
    };
  }

  // Create order object
  createOrder(overrides?: Partial<Order>): Order {
    return {
      id: faker.string.uuid(),
      userId: '',
      items: [],
      total: 0,
      status: 'pending',
      createdAt: new Date(),
      ...overrides,
    };
  }
}
```

---

## Task 5: DB Helpers

Create `tests/utils/db-helpers.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTestUser(data: {
  email: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: await hashPassword(data.password),
      name: 'Test User',
    },
  });
}

export async function deleteTestUser(email: string) {
  return prisma.user.delete({
    where: { email },
  });
}

export async function seedTestData(workerIndex: number) {
  // Create worker-specific test data
  await prisma.product.createMany({
    data: [
      { name: `Product A (W${workerIndex})`, price: 10 },
      { name: `Product B (W${workerIndex})`, price: 20 },
    ],
  });
}

export async function cleanupTestData(workerIndex: number) {
  // Delete worker-specific data
  await prisma.product.deleteMany({
    where: {
      name: { contains: `(W${workerIndex})` },
    },
  });
}
```

**Adapt to detected ORM:**

- Drizzle: Use `db.insert()`, `db.delete()`
- Mongoose: Use `Model.create()`, `Model.deleteOne()`
- TypeORM: Use `repository.save()`, `repository.remove()`

---

## Task 6: Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

---

## Verification

Run these commands:

```bash
# Install Playwright
npm install -D @playwright/test @faker-js/faker
npx playwright install

# Verify config
npx playwright test --list

# Test can run
npx playwright test --project=chromium
```

---

## Output Checklist

- [ ] `playwright.config.ts` created with parallel settings
- [ ] CI/CD pipeline created (GitHub Actions or equivalent)
- [ ] `fixtures.ts` created with worker + test fixtures
- [ ] `test-data.ts` created with Faker integration
- [ ] `db-helpers.ts` created for database operations
- [ ] Package scripts added
- [ ] Playwright installed (`npx playwright install`)
- [ ] Config validated (`npx playwright test --list`)

**Next:** Run Prompt 4 to generate Page Objects
