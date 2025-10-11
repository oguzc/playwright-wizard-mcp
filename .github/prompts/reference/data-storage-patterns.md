# Data Storage Patterns for Test Infrastructure

> Comprehensive patterns for different data storage architectures

---

## Pattern A: Database with ORM

### Prisma

```typescript
// tests/utils/db-helpers.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTestUser(data: {
  email: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
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
  await prisma.product.createMany({
    data: [
      { name: `Product A (W${workerIndex})`, price: 10 },
      { name: `Product B (W${workerIndex})`, price: 20 },
    ],
  });
}

export async function cleanupTestData(workerIndex: number) {
  await prisma.product.deleteMany({
    where: {
      name: { contains: `(W${workerIndex})` },
    },
  });
}
```

### Drizzle

```typescript
// tests/utils/db-helpers.ts
import { db } from '../db';
import { users, products } from '../db/schema';
import { eq, like } from 'drizzle-orm';

export async function createTestUser(data: {
  email: string;
  password: string;
}) {
  return db.insert(users).values({
    email: data.email,
    password: data.password,
    name: 'Test User',
  }).returning();
}

export async function deleteTestUser(email: string) {
  return db.delete(users).where(eq(users.email, email));
}
```

### TypeORM

```typescript
// tests/utils/db-helpers.ts
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export async function createTestUser(data: {
  email: string;
  password: string;
}) {
  const userRepo = getRepository(User);
  const user = userRepo.create({
    email: data.email,
    password: data.password,
    name: 'Test User',
  });
  return userRepo.save(user);
}

export async function deleteTestUser(email: string) {
  const userRepo = getRepository(User);
  return userRepo.delete({ email });
}
```

### Mongoose

```typescript
// tests/utils/db-helpers.ts
import { User } from '../models/User';

export async function createTestUser(data: {
  email: string;
  password: string;
}) {
  return User.create({
    email: data.email,
    password: data.password,
    name: 'Test User',
  });
}

export async function deleteTestUser(email: string) {
  return User.deleteOne({ email });
}
```

---

## Pattern B: JSON File Storage

```typescript
// tests/utils/data-helpers.ts
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'database');

export function loadTestData(filename = 'shared-db.json') {
  const path = join(DB_PATH, filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function saveTestData(data: any, filename = 'shared-db.json') {
  const path = join(DB_PATH, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function resetTestData() {
  copyFileSync(
    join(DB_PATH, 'initial-db.json'),
    join(DB_PATH, 'shared-db.json')
  );
}

export function createWorkerDataFile(workerIndex: number) {
  const initialData = loadTestData('initial-db.json');
  saveTestData(initialData, `test-db-w${workerIndex}.json`);
}
```

**Fixture usage:**
```typescript
workerTestUser: [async ({ }, use, workerInfo) => {
  const email = `test-worker-${workerInfo.workerIndex}@example.com`;
  const password = 'TestPass123!';
  
  // Users are pre-seeded in JSON file - no setup needed
  await use({ email, password });
}, { scope: 'worker' }],
```

---

## Pattern C: In-Memory / MSW

```typescript
// tests/utils/mock-data-store.ts
export class MockDataStore {
  private users = new Map();
  private products = new Map();
  
  constructor(private workerIndex: number) {
    this.seedInitialData();
  }
  
  private seedInitialData() {
    this.users.set(
      `test-worker-${this.workerIndex}@example.com`,
      { 
        email: `test-worker-${this.workerIndex}@example.com`,
        password: 'TestPass123!',
        name: 'Test User'
      }
    );
  }
  
  reset() {
    this.users.clear();
    this.products.clear();
    this.seedInitialData();
  }
  
  getUser(email: string) {
    return this.users.get(email);
  }
  
  addUser(user: any) {
    this.users.set(user.email, user);
  }
  
  addProduct(product: any) {
    this.products.set(product.id, product);
  }
  
  getProducts() {
    return Array.from(this.products.values());
  }
}
```

**Fixture usage:**
```typescript
mockDataStore: [async ({ }, use, workerInfo) => {
  const store = new MockDataStore(workerInfo.workerIndex);
  await use(store);
  store.reset();
}, { scope: 'worker' }],
```

---

## Pattern D: No Database / External API

**When to use:**
- Application uses external API
- All API calls are mocked with MSW
- No data persistence needed

**Fixture approach:**
```typescript
// No data helpers needed
// Just provide test credentials

workerTestUser: [async ({ }, use, workerInfo) => {
  const email = `test-worker-${workerInfo.workerIndex}@example.com`;
  const password = 'TestPass123!';
  
  // MSW handlers will mock authentication
  await use({ email, password });
}, { scope: 'worker' }],
```

---

## Selection Guide

| Data Storage | Pattern | File to Create |
|--------------|---------|----------------|
| Prisma | A (Prisma) | `db-helpers.ts` |
| Drizzle | A (Drizzle) | `db-helpers.ts` |
| TypeORM | A (TypeORM) | `db-helpers.ts` |
| Mongoose | A (Mongoose) | `db-helpers.ts` |
| JSON files | B | `data-helpers.ts` |
| In-memory | C | `mock-data-store.ts` |
| MSW only | C or D | `mock-data-store.ts` or skip |
| External API | D | Skip data helpers |
