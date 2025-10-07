# Prompt 2: Generate Test Plan 📋

> Break testing into focused suites with progress tracking

**Input:** `project-config.md`, `pages.md`, `selector-strategy.md` (from `tests/docs/`)

**Output:** `test-plan.md` with test suites + checkboxes

> **Note:** Read from and write to `tests/docs/` folder

---

## Prerequisites

> 💡 **MCP Tool:** Context7 MCP for testing best practices  
> See `reference/mcp-setup.md` for installation

**Verify Context7 MCP is available:**

```typescript
await mcp_context7_resolve_library_id({ libraryName: "playwright" });
```

**If fails:** Ask user to install Context7 MCP, then retry.

---

## Your Task

Create a test plan with:

1. **5-10 test suites** (grouped by feature/page)
2. **Test cases per suite** (8-15 tests each)
3. **Progress tracking** (checkboxes)
4. **Priorities** (P0/P1/P2)
5. **Dependencies** (fixtures, data needed)

---

## Grouping Strategy

**By Feature** (recommended):

- `auth.spec.ts` - Login, signup, logout, password reset
- `dashboard.spec.ts` - Dashboard functionality
- `profile.spec.ts` - Profile management
- `settings.spec.ts` - App settings

**By Page** (for simple apps):

- `homepage.spec.ts`
- `login.spec.ts`
- `dashboard.spec.ts`

---

## Priority Levels

- **P0 (Critical)** - Auth, core flows that block everything else
- **P1 (High)** - Main features, checkout, important user actions
- **P2 (Medium)** - Secondary features, filters, search
- **P3 (Low)** - Edge cases, error states, responsive

---

## Output Format

---

Create `tests/docs/test-plan.md`:

```markdown
# Test Plan

**Total Suites:** 5  
**Progress:** 0/5 (0%)

---

## Implementation Status

- [ ] **auth.spec.ts** - Authentication flows (P0)
  - Tests: 8
  - Dependencies: Test user accounts in DB
  
- [ ] **dashboard.spec.ts** - Dashboard features (P0)
  - Tests: 12
  - Dependencies: Auth fixture, sample data
  
- [ ] **profile.spec.ts** - Profile management (P1)
  - Tests: 6
  - Dependencies: Auth fixture, file upload
  
- [ ] **settings.spec.ts** - App settings (P2)
  - Tests: 5
  - Dependencies: Auth fixture

- [ ] **error-handling.spec.ts** - Error states (P2)
  - Tests: 7
  - Dependencies: API mocks

---

## Suite: auth.spec.ts

**Priority:** P0 (Critical)  
**Why:** Required for all other tests

**Test Cases:**

1. ✅ Successful login with valid credentials
2. ✅ Failed login - wrong password
3. ✅ Failed login - nonexistent user
4. ✅ Remember me functionality
5. ✅ Logout redirects to homepage
6. ✅ Protected route redirects to login
7. ✅ Signup - new user success
8. ✅ Signup - duplicate email error

**Quality Gates:**

- Tests pass with `--workers=4` ✅
- Tests pass with `--workers=1` ✅
- No `.only` or `.skip` ✅
- Web-first assertions ✅
- Follows selector strategy ✅

---

## Suite: dashboard.spec.ts

**Priority:** P0 (Critical)  
**Why:** Primary user interface

**Test Cases:**

1. ✅ Dashboard loads with user data
2. ✅ Stats cards display correctly
3. ✅ Data table shows orders
4. ✅ Navigation to settings
5. ✅ Navigation to profile
6. ✅ Refresh data button works
7. ✅ Empty state for new users
8. ✅ Loading states
9. ✅ Error handling
10. ✅ Data table pagination (if applicable)
11. ✅ Data table sorting (if applicable)
12. ✅ Data table filtering (if applicable)

**Quality Gates:** Same as above

---

## Test Data Requirements

### User Accounts

```typescript
// Standard user
{
  email: 'test-user@example.com',
  password: 'TestPass123!',
  role: 'user'
}

// New user (no data)
{
  email: 'new-user@example.com',
  password: 'NewPass123!',
  orders: []
}

// Power user (lots of data for pagination)
{
  email: 'power-user@example.com',
  password: 'PowerPass123!',
  orders: 50+
}
```

### Sample Data

- Orders: At least 5 for dashboard tests
- Products: Catalog for browsing/search
- Settings: Default values that can be modified

---

## Next Steps

1. Review this plan
2. Run **Prompt 3: Setup Infrastructure**
```

---

## Quality Checklist

- [ ] All critical features covered (P0)
- [ ] Suites are focused (8-15 tests each)
- [ ] Priorities assigned
- [ ] Dependencies documented
- [ ] Test data requirements clear
- [ ] Quality gates defined for each suite

**Next:** Run Prompt 3 to setup infrastructure
