# Optional: Add API Testing 🔌

> Test backend contracts before E2E

**When to use:** App has REST/GraphQL/tRPC backend

**Output:** CODE - API test helpers + test suite

---

## Task 1: Create API Test Helper

Create `tests/api/api-client.ts`:

```typescript
import { APIRequestContext } from '@playwright/test';

export class APIClient {
  constructor(private request: APIRequestContext) {}

  async createUser(data: { email: string; password: string; name: string }) {
    const response = await this.request.post('/api/users', { data });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async getUser(id: string) {
    const response = await this.request.get(`/api/users/${id}`);
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async deleteUser(id: string) {
    const response = await this.request.delete(`/api/users/${id}`);
    return response.status();
  }

  async login(email: string, password: string) {
    const response = await this.request.post('/api/auth/login', {
      data: { email, password },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }
}
```

---

## Task 2: Create API Test Suite

Create `tests/api/users.api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { APIClient } from './api-client';

test.describe('User API', () => {
  let apiClient: APIClient;

  test.beforeEach(({ request }) => {
    apiClient = new APIClient(request);
  });

  test('POST /api/users creates new user', async ({ request }) => {
    const result = await apiClient.createUser({
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test User',
    });

    expect(result.status).toBe(201);
    expect(result.body).toMatchObject({
      id: expect.any(String),
      email: expect.stringContaining('@example.com'),
      name: 'Test User',
      createdAt: expect.any(String),
    });
    expect(result.body).not.toHaveProperty('password'); // Password not returned
  });

  test('GET /api/users/:id returns user', async () => {
    // Create user first
    const created = await apiClient.createUser({
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test User',
    });

    // Get user
    const result = await apiClient.getUser(created.body.id);

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      id: created.body.id,
      email: created.body.email,
      name: 'Test User',
    });
  });

  test('GET /api/users/:id returns 404 for nonexistent', async () => {
    const result = await apiClient.getUser('nonexistent-id');
    expect(result.status).toBe(404);
  });

  test('POST /api/users validates email format', async () => {
    const result = await apiClient.createUser({
      email: 'invalid-email',
      password: 'TestPass123!',
      name: 'Test User',
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toContain('Invalid email');
  });

  test('POST /api/users rejects duplicate email', async () => {
    const email = `test-${Date.now()}@example.com`;

    // Create first user
    await apiClient.createUser({
      email,
      password: 'TestPass123!',
      name: 'User 1',
    });

    // Try to create duplicate
    const result = await apiClient.createUser({
      email, // Same email
      password: 'TestPass123!',
      name: 'User 2',
    });

    expect(result.status).toBe(409);
    expect(result.body.error).toContain('already exists');
  });

  test('DELETE /api/users/:id removes user', async () => {
    // Create user
    const created = await apiClient.createUser({
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test User',
    });

    // Delete user
    const deleteStatus = await apiClient.deleteUser(created.body.id);
    expect(deleteStatus).toBe(204);

    // Verify deleted
    const getResult = await apiClient.getUser(created.body.id);
    expect(getResult.status).toBe(404);
  });
});
```

---

## Task 3: Update Config

Add API tests to config:

```typescript
export default defineConfig({
  projects: [
    // E2E tests
    {
      name: 'e2e-chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // API tests
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
  ],
});
```

---

## Task 4: Run API Tests

```bash
# Run only API tests
npx playwright test --project=api

# Run all tests
npx playwright test
```

---

## Benefits

- ✅ Faster than E2E (no browser)
- ✅ Test contracts independently
- ✅ Catch backend bugs early
- ✅ Easier to debug

---

## When to Use

**Use API tests for:**

- User CRUD operations
- Authentication endpoints
- Data validation rules
- Error handling
- Rate limiting

**Use E2E tests for:**

- Complete user journeys
- UI interactions
- Multi-step workflows

---

## Output Checklist

- [ ] `api-client.ts` created
- [ ] API test suite created
- [ ] Config updated for API tests
- [ ] Tests pass: `npx playwright test --project=api`
