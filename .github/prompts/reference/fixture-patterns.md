# Fixture Patterns

> Comprehensive guide for Playwright fixtures in parallel test execution

## Core Concepts

### Fixture Scopes

**Worker-Scoped:**
- Runs once per worker process
- Shared across all tests in that worker
- Use for: Database connections, test users, expensive setup

**Test-Scoped:**
- Runs before each test
- Unique per test
- Use for: Page objects, test data, UI state

---

## Worker-Scoped Fixtures

### Pattern 1: Test User Per Worker

**Use case:** Each worker needs a unique user to avoid conflicts

```typescript
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  workerTestUser: { email: string; password: string };
};

export const test = base.extend<{}, WorkerFixtures>({
  workerTestUser: [async ({ }, use, workerInfo) => {
    // Setup: Create unique user for this worker
    const email = `test-worker-${workerInfo.workerIndex}@example.com`;
    const password = 'TestPass123!';
    
    await createUserInDatabase({ email, password });
    
    // Provide to tests
    await use({ email, password });
    
    // Teardown: Cleanup after all tests in worker
    await deleteUserFromDatabase(email);
  }, { scope: 'worker' }],
});
```

**Usage in tests:**
```typescript
test('should login', async ({ page, workerTestUser }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(workerTestUser.email);
  await page.getByLabel('Password').fill(workerTestUser.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
});
```

### Pattern 2: Database Connection Per Worker

**Use case:** Reuse DB connection across all tests in worker

```typescript
type WorkerFixtures = {
  db: PrismaClient;
};

export const test = base.extend<{}, WorkerFixtures>({
  db: [async ({ }, use) => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    await use(prisma);
    
    await prisma.$disconnect();
  }, { scope: 'worker' }],
});
```

### Pattern 3: Seed Data Per Worker

**Use case:** Each worker needs test data that doesn't conflict

```typescript
type WorkerFixtures = {
  workerProducts: Product[];
};

export const test = base.extend<{}, WorkerFixtures>({
  workerProducts: [async ({ }, use, workerInfo) => {
    // Create products with worker-specific IDs
    const products = await prisma.product.createMany({
      data: [
        { id: `W${workerInfo.workerIndex}-PROD-001`, name: 'Product A', price: 10 },
        { id: `W${workerInfo.workerIndex}-PROD-002`, name: 'Product B', price: 20 },
      ],
    });
    
    await use(products);
    
    // Cleanup
    await prisma.product.deleteMany({
      where: { id: { startsWith: `W${workerInfo.workerIndex}-` } },
    });
  }, { scope: 'worker' }],
});
```

---

## Test-Scoped Fixtures

### Pattern 1: Page Object Per Test

**Use case:** Fresh page object for each test

```typescript
import { LoginPage } from './pages/LoginPage';

type TestFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});
```

**Usage:**
```typescript
test('should show validation error', async ({ loginPage }) => {
  await loginPage.submitWithoutCredentials();
  await expect(loginPage.errorMessage).toBeVisible();
});
```

### Pattern 2: Authenticated Session Per Test

**Use case:** Each test needs to start authenticated

```typescript
type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  authenticatedPage: async ({ page, workerTestUser }, use) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(workerTestUser.email, workerTestUser.password);
    
    // Verify logged in
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Provide authenticated page to test
    await use(page);
    
    // Teardown: logout after test
    await page.getByTestId('user-menu').click();
    await page.getByRole('button', { name: 'Logout' }).click();
  },
});
```

**Usage:**
```typescript
test('should see dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Pattern 3: Unique Test Data Per Test

**Use case:** Each test needs unique data to avoid conflicts

```typescript
import { faker } from '@faker-js/faker';

type TestFixtures = {
  uniqueTestData: TestDataFactory;
};

class TestDataFactory {
  constructor(
    private workerIndex: number,
    private testId: string
  ) {}

  uniqueEmail(): string {
    const timestamp = Date.now();
    return `test-w${this.workerIndex}-${timestamp}-${faker.string.nanoid(4)}@example.com`;
  }

  createUser(): User {
    return {
      email: this.uniqueEmail(),
      name: faker.person.fullName(),
      password: 'TestPass123!',
    };
  }
}

export const test = base.extend<TestFixtures>({
  uniqueTestData: async ({ }, use, workerInfo, testInfo) => {
    const factory = new TestDataFactory(
      workerInfo.workerIndex,
      testInfo.testId
    );
    await use(factory);
  },
});
```

**Usage:**
```typescript
test('should register new user', async ({ page, uniqueTestData }) => {
  const user = uniqueTestData.createUser();
  
  await page.goto('/register');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign up' }).click();
  
  await expect(page).toHaveURL('/welcome');
});
```

---

## Combined Fixture Example

**Complete setup with both scopes:**

```typescript
import { test as base } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestDataFactory } from './test-data';

// Worker-scoped fixtures (shared across tests in worker)
type WorkerFixtures = {
  db: PrismaClient;
  workerTestUser: { id: string; email: string; password: string };
};

// Test-scoped fixtures (unique per test)
type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
  uniqueTestData: TestDataFactory;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker fixture: DB connection
  db: [async ({ }, use) => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    await use(prisma);
    await prisma.$disconnect();
  }, { scope: 'worker' }],

  // Worker fixture: Test user
  workerTestUser: [async ({ db }, use, workerInfo) => {
    const email = `test-worker-${workerInfo.workerIndex}@example.com`;
    const user = await db.user.create({
      data: {
        email,
        password: await hashPassword('TestPass123!'),
        name: `Test User ${workerInfo.workerIndex}`,
      },
    });
    
    await use({ id: user.id, email, password: 'TestPass123!' });
    
    await db.user.delete({ where: { id: user.id } });
  }, { scope: 'worker' }],

  // Test fixture: Login page
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Test fixture: Dashboard page
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Test fixture: Authenticated session
  authenticatedPage: async ({ page, loginPage, workerTestUser }, use) => {
    await loginPage.goto();
    await loginPage.login(workerTestUser.email, workerTestUser.password);
    await use(page);
  },

  // Test fixture: Test data factory
  uniqueTestData: async ({ }, use, workerInfo, testInfo) => {
    const factory = new TestDataFactory(workerInfo.workerIndex, testInfo.testId);
    await use(factory);
  },
});

export { expect } from '@playwright/test';
```

**Usage in test suite:**
```typescript
import { test, expect } from './fixtures';

test.describe('Dashboard', () => {
  test('should display user name', async ({ authenticatedPage, workerTestUser }) => {
    await authenticatedPage.goto('/dashboard');
    await expect(authenticatedPage.getByText(workerTestUser.email)).toBeVisible();
  });

  test('should create new item', async ({ authenticatedPage, uniqueTestData, db }) => {
    const item = uniqueTestData.createProduct();
    
    await authenticatedPage.goto('/dashboard/products/new');
    await authenticatedPage.getByLabel('Name').fill(item.name);
    await authenticatedPage.getByLabel('Price').fill(String(item.price));
    await authenticatedPage.getByRole('button', { name: 'Create' }).click();
    
    // Verify in DB
    const created = await db.product.findFirst({
      where: { name: item.name },
    });
    expect(created).toBeTruthy();
  });
});
```

---

## Best Practices

### ✅ Do

**1. Use worker fixtures for expensive setup:**
```typescript
// Good - DB connection reused
db: [async ({ }, use) => {
  const prisma = new PrismaClient();
  await use(prisma);
}, { scope: 'worker' }]
```

**2. Use test fixtures for isolation:**
```typescript
// Good - fresh page object per test
loginPage: async ({ page }, use) => {
  await use(new LoginPage(page));
}
```

**3. Make fixtures composable:**
```typescript
// authenticatedPage depends on workerTestUser
authenticatedPage: async ({ page, workerTestUser }, use) => {
  await login(page, workerTestUser);
  await use(page);
}
```

**4. Clean up in teardown:**
```typescript
workerTestUser: [async ({ db }, use, workerInfo) => {
  const user = await db.user.create({...});
  await use(user);
  await db.user.delete({ where: { id: user.id } }); // Cleanup
}, { scope: 'worker' }]
```

### ❌ Don't

**1. Don't share test state between tests:**
```typescript
// Bad - state leaks between tests
let sharedUser: User;

test('first test', async () => {
  sharedUser = await createUser();
});

test('second test', async () => {
  // Depends on first test - FRAGILE
  await loginAs(sharedUser);
});
```

**2. Don't use worker fixtures for test-specific state:**
```typescript
// Bad - worker fixture for UI state
loginPage: [async ({ page }, use) => {
  await use(new LoginPage(page));
}, { scope: 'worker' }]  // Wrong scope!
```

**3. Don't create duplicate data without isolation:**
```typescript
// Bad - all workers use same email
workerTestUser: [async ({ }, use) => {
  const email = 'test@example.com';  // Collision!
  await use({ email });
}, { scope: 'worker' }]

// Good - unique per worker
workerTestUser: [async ({ }, use, workerInfo) => {
  const email = `test-w${workerInfo.workerIndex}@example.com`;
  await use({ email });
}, { scope: 'worker' }]
```

---

## Parallel Safety Checklist

- [ ] Worker fixtures use `workerInfo.workerIndex` for uniqueness
- [ ] Test fixtures don't share state between tests
- [ ] Database operations use unique IDs/emails per worker
- [ ] Cleanup happens in teardown phase
- [ ] No hardcoded test data (use factories)
- [ ] Tests can run in any order
- [ ] Tests don't depend on each other

---

## Common Patterns Summary

| Pattern | Scope | Use Case | Example |
|---------|-------|----------|---------|
| Test user | Worker | Authenticated tests | `workerTestUser` |
| DB connection | Worker | Database operations | `db` |
| Seed data | Worker | Pre-populated data | `workerProducts` |
| Page object | Test | UI interactions | `loginPage` |
| Auth session | Test | Protected routes | `authenticatedPage` |
| Test data | Test | Unique per test | `uniqueTestData` |

---

## Get Latest Fixture Docs

Always check Context7 for latest Playwright fixture APIs:

```typescript
await mcp_context7_get_library_docs({ 
  context7CompatibleLibraryID: "/microsoft/playwright",
  topic: "fixtures test scoped worker scoped extend use teardown"
});
```

This ensures you're using the most current patterns and APIs.
