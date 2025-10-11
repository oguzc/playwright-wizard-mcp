# Prompt 2: Generate Test Plan 📋

> Break testing into focused suites with progress tracking

**Input:** `project-config.md`, `pages.md`, `selector-strategy.md` (from `.playwright-wizard-mcp/`)

**Output:** `.playwright-wizard-mcp/test-plan.md` with test suites + checkboxes

> **Critical:** Read from and write to `.playwright-wizard-mcp/` folder

---

## Prerequisites

> 💡 **Recommended:** Use built-in Playwright Wizard reference tools

**Before starting, review these built-in references:**

```typescript
// Get fixture patterns for parallel execution
await mcp.callTool('reference-fixture-patterns');

// Get core testing principles
await mcp.callTool('reference-core-principles');
```

These provide:
- Worker-scoped vs test-scoped fixtures
- Test isolation patterns
- Web-first assertion examples
- Parallel execution best practices

---

## Your Task

Create a comprehensive test plan by:

1. **Analyzing Step 1 outputs** (project-config.md, pages.md, selector-strategy.md)
2. **Deriving test scenarios** from pages and user flows
3. **Grouping into 5-10 test suites** by feature/journey
4. **Assigning priorities** (P0/P1/P2/P3)
5. **Documenting dependencies** (fixtures, data, setup)

---

## Step 1: Review Existing Test Infrastructure

Check `package.json` for:
- Existing test scripts (align with worker config)
- Test data patterns (TestDataFactory, worker isolation, etc.)
- API mocking setup (MSW, etc.)

**Align test plan with project's existing architecture.**

---

## Step 2: Identify User Journeys

Review `pages.md` and map complete user flows:

**Critical E2E Journeys (1-3 max):**
- Revenue-impacting paths (checkout, signup)
- Core user experience flows
- Cross-page state management

**Example for e-commerce:**
```
Journey 1: Guest Checkout
  Pages: Home → Products → Product Detail → Cart → Checkout → Confirmation
  Priority: P0
  Why: Revenue critical
```

**These become separate E2E test files.**

---

## Step 3: Derive Test Cases from Pages

For each page in `pages.md`:

### 3.1: Happy Path Tests
- Primary user actions (form submit, navigation, etc.)
- Expected outcomes (success messages, redirects)

### 3.2: Error States
- Form validation errors
- API failures (from project-config.md testing considerations)
- Network issues, timeouts

### 3.3: Edge Cases
- Empty states (no data, first-time users)
- Boundary values (max quantity, long text)
- State transitions (logged in/out, cart empty/full)

### 3.4: Interactive Elements
From `selector-strategy.md`, test:
- Form inputs (all fields, validation)
- Buttons (enabled/disabled states, loading)
- Navigation (links, routing)
- Dynamic content (modals, tooltips, dropdowns)

### Example Derivation:

**Login Page (score 94, hybrid selectors):**
- ✅ Happy: Valid credentials → Dashboard
- ✅ Error: Invalid email format → Show error
- ✅ Error: Wrong password → Show error  
- ✅ Error: Nonexistent user → Show error
- ✅ Feature: Remember me checkbox → Persists session
- ✅ Feature: Demo credentials button → Auto-fills
- ✅ Edge: Forgot password link → Reset flow
- ✅ Edge: Empty form submission → Validation errors

**Result:** 8 test cases for `auth.spec.ts`

---

## Step 4: Group into Test Suites

## Step 4: Group into Test Suites

### Grouping Strategy

**Prefer by Feature** (most projects):
- `auth.spec.ts` - Login, signup, logout, session management
- `product-browsing.spec.ts` - Listing, filtering, search
- `cart.spec.ts` - Add/remove items, quantity, calculations
- `checkout.spec.ts` - Shipping, payment, order completion

**By Page** (simple apps with independent pages):
- `homepage.spec.ts`
- `login.spec.ts`
- `dashboard.spec.ts`

**E2E Journeys** (separate files):
- `e2e/critical-path.spec.ts` - Main revenue flow
- `e2e/user-onboarding.spec.ts` - Signup to first action

### Suite Sizing Guidelines

- **Small suites:** 3-5 tests (simple pages/features)
- **Medium suites:** 6-12 tests (typical pages/features)
- **Large suites:** 13-20 tests (complex features)

**Split if:**
- Suite exceeds 20 tests
- Multiple unrelated features mixed
- Tests have different dependencies

---

## Step 5: Assign Priorities

## Step 5: Assign Priorities

- **P0 (Critical)** - Revenue impact, blocks other features (auth, checkout, core API)
- **P1 (High)** - Main features, important user actions (browsing, cart, profile)
- **P2 (Medium)** - Secondary features (filters, search, settings)
- **P3 (Low)** - Edge cases, error states, nice-to-have features

**P0 tests must pass before deploying.**

---

## Step 6: Document Dependencies

For each suite, identify:

### Test Data Needs
- User accounts (existing vs generated)
- Sample data (products, orders, etc.)
- API state (what needs to exist before test runs)

### Fixtures Required
- Authentication fixture (logged-in state)
- Data factories (unique per worker)
- API mocks (if using MSW)

### Setup Requirements
- Database seeding
- API server running
- Environment variables

**Match project's architecture from project-config.md.**

---

## Output Format

Create `.playwright-wizard-mcp/test-plan.md`:

```markdown
# Test Plan

**Project:** [Name from project-config.md]  
**Total Suites:** 5  
**Total Tests:** ~42  
**Progress:** 0/5 suites (0%)

> **Note:** This plan is based on analysis from Step 1 (Analyze App)

---

## Critical User Journeys (E2E)

### Journey 1: [Name] (P0)
**Pages:** Home → ... → Success  
**Why Critical:** [Revenue impact / Core feature]  
**File:** `tests/e2e/[name].spec.ts`  
**Tests:** 3-5

**Flow:**
1. Step 1 description
2. Step 2 description
3. Expected outcome

---

## Implementation Status

**How to use:** As you complete each suite in Step 5, mark it with `[x]`

- [ ] **auth.spec.ts** - Authentication flows (P0)
  - Tests: 8
  - Dependencies: Test user accounts, session fixture
  - Estimated time: 2-3 hours
  
- [ ] **product-browsing.spec.ts** - Product discovery (P1)
  - Tests: 10
  - Dependencies: Auth fixture, product catalog data
  - Estimated time: 3-4 hours
  
- [ ] **cart.spec.ts** - Shopping cart (P0)
  - Tests: 9
  - Dependencies: Auth fixture, cart reset between tests
  - Estimated time: 2-3 hours
  
- [ ] **checkout.spec.ts** - Order completion (P0)
  - Tests: 8
  - Dependencies: Auth fixture, payment mocks
  - Estimated time: 3-4 hours

- [ ] **e2e/critical-path.spec.ts** - End-to-end checkout (P0)
  - Tests: 3
  - Dependencies: Full integration, all services running
  - Estimated time: 2 hours

---

## Test Coverage Summary

| Feature Area   | Test Suite           | Tests | Priority | Status |
| -------------- | -------------------- | ----- | -------- | ------ |
| Authentication | auth.spec.ts         | 8     | P0       | ⏳ Todo |
| Products       | product-browsing.spec.ts | 10 | P1    | ⏳ Todo |
| Cart           | cart.spec.ts         | 9     | P0       | ⏳ Todo |
| Checkout       | checkout.spec.ts     | 8     | P0       | ⏳ Todo |
| E2E Flow       | critical-path.spec.ts | 3    | P0       | ⏳ Todo |
| **Total**      | **5 suites**         | **38**| **5 P0** | **0%** |

**Update this table as tests are implemented in Step 5**

---

## Suite: auth.spec.ts

**Priority:** P0 (Critical)  
**Why:** Required for all authenticated features  
**Estimated time:** 2-3 hours

**Test Cases:**

1. ✅ Successful login with valid credentials → Redirect to dashboard
2. ✅ Failed login - invalid email format → Show validation error
3. ✅ Failed login - wrong password → Show "Invalid credentials"
4. ✅ Failed login - nonexistent user → Show "User not found"
5. ✅ Remember me functionality → Session persists after browser close
6. ✅ Logout → Clear session and redirect to homepage
7. ✅ Protected route access → Redirect to login when not authenticated
8. ✅ Signup - new user success → Account created and logged in

**Dependencies:**
- Test user accounts in database/TestDataFactory
- Session management fixture
- Clean auth state between tests

**Suite-Specific Considerations:**
- Must test session isolation between workers
- Verify no auth state leaks between tests
- Test both cookie and token-based auth (if applicable)

---

## Suite: product-browsing.spec.ts

**Priority:** P1 (High)  
**Why:** Core product discovery experience  
**Estimated time:** 3-4 hours

**Test Cases:**

1. ✅ Products page loads with product grid
2. ✅ Product card displays image, title, price, stock
3. ✅ Click product card → Navigate to product detail
4. ✅ Product detail shows full information
5. ✅ Image gallery thumbnail navigation works
6. ✅ Back to products button → Return to listing
7. ✅ Search functionality filters products
8. ✅ Category filter works correctly
9. ✅ Empty search results → Show "No products found"
10. ✅ Out of stock products → Show stock indicator

**Dependencies:**
- Product catalog data (at least 10 products)
- Various product states (in stock, low stock, out of stock)
- Image assets available

**Suite-Specific Considerations:**
- Verify image loading and lazy loading
- Test responsive grid layout (if applicable)
- Check product data consistency

---

## Suite: cart.spec.ts

**Priority:** P0 (Critical)  
**Why:** Required for checkout flow  
**Estimated time:** 2-3 hours

**Test Cases:**

1. ✅ Add product to cart → Cart badge updates
2. ✅ Add multiple products → All appear in cart
3. ✅ Increase quantity → Price updates correctly
4. ✅ Decrease quantity → Price updates correctly
5. ✅ Remove item from cart → Item disappears
6. ✅ Clear cart → All items removed
7. ✅ Cart persists across page navigation
8. ✅ Cart empty state → Show "Your cart is empty"
9. ✅ Proceed to checkout button → Navigate to checkout

**Dependencies:**
- Auth fixture (logged-in user)
- Cart state reset between tests
- Product data for adding to cart

**Suite-Specific Considerations:**
- Reset cart state before each test
- Verify cart isolation between workers
- Test quantity limits (max quantity)

---

## Universal Quality Gates

**All test suites must meet these criteria:**

- ✅ Tests pass with `--workers=4` (parallel execution)
- ✅ Tests pass with `--workers=1` (serial execution)
- ✅ No `.only` or `.skip` in committed code
- ✅ Web-first assertions used (no `waitForTimeout`)
- ✅ Follow selector strategy from selector-strategy.md
- ✅ Each test is independent (no order dependency)
- ✅ Proper cleanup (reset state after test)
- ✅ Descriptive test names
- ✅ Comments for complex logic only

---

## Test Data Strategy

**Based on project architecture from project-config.md:**

### For Worker Isolation Pattern (TestDataFactory)

```typescript
// Each worker generates unique data
test('checkout flow', async ({ page }) => {
  const user = TestDataFactory.createUser(workerId);
  const product = TestDataFactory.createProduct();
  // Tests run in parallel without conflicts
});
```

### For Shared Test Accounts

```typescript
// Standard test users
{
  email: 'test-user@example.com',
  password: 'TestPass123!',
  role: 'user'
}

// New user (for signup tests)
{
  email: 'new-user@example.com',
  password: 'NewPass123!'
}
```

### Sample Data Requirements

- **Products:** At least 10 with varied stock levels
- **Orders:** 5+ for order history tests
- **Categories:** 3-5 for filtering tests

---

## Next Steps

**Before proceeding to Step 3:**

- [ ] Review this test plan
- [ ] Verify all pages from pages.md are covered
- [ ] Confirm P0 tests cover critical user flows
- [ ] Validate test data strategy matches project architecture
- [ ] Ensure estimated test count is realistic (typically 30-60 for medium app)

**Then run:** Prompt 3: Setup Infrastructure
```

---

## Quality Checklist

Before finalizing test-plan.md:

- [ ] All pages from pages.md have test coverage
- [ ] At least 1 E2E critical journey defined
- [ ] P0 tests cover revenue/blocking features
- [ ] Suites are reasonably sized (3-20 tests)
- [ ] Dependencies clearly documented per suite
- [ ] Test data strategy aligns with project architecture
- [ ] Suite-specific considerations documented
- [ ] Time estimates provided
- [ ] Total test count realistic (30-60 typical)

---

## Example Test Derivation Process

**Given:** Login page from pages.md (score 94, has test IDs on form inputs)

**Derive tests:**

1. **Check interactive elements table** → Email input, password input, submit button, demo button
2. **Check quality assessment** → Error messages, password toggle, demo credentials
3. **Check testing considerations** → Session management, form validation
4. **Derive test cases:**
   - Happy path: Valid login → Success
   - Error: Invalid email → Validation error
   - Error: Wrong password → Auth error
   - Feature: Demo button → Auto-fill
   - Feature: Password toggle → Show/hide
   - Edge: Empty form → Validation
   - Edge: Remember me → Session persist
   - Flow: Logout → Clear session

**Result:** 8 test cases with clear expected outcomes
