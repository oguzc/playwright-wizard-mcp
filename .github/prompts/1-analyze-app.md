# Prompt 1: Analyze App 🔍

> **All-in-one:** Detect stack + browse pages + decide selectors + add test IDs

**Output Files:**

- `project-config.md` - Tech stack detected
- `pages.md` - Pages with DOM quality scores  
- `selector-strategy.md` - Which pages need test IDs
- CODE - Test IDs added to source (if needed)

> **Note:** Create all `.md` files in `tests/docs/` folder

---

## Prerequisites

> 💡 **MCP Tools Required:** Context7 MCP and Playwright MCP  
> See `reference/mcp-setup.md` for installation and detailed usage

**Before starting, verify MCPs are available:**

```typescript
// Check Context7 MCP
await mcp_context7_resolve_library_id({ libraryName: "playwright" });

// Check Playwright MCP  
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If either fails:** Ask user to install the required MCP server, then retry.

---
textbox "Email" (type=email)
textbox "Password" (type=password)
alert "Invalid credentials"
```

Use this to evaluate HTML quality and selector viability.

---

## Step 1: Detect Stack

Check `package.json` dependencies:

```bash
cat package.json
```

**Identify:**

- Framework (React, Vue, Next.js, Angular, Svelte)
- Meta-framework (Next.js App/Pages Router, Nuxt, SvelteKit, Remix)
- State management (Redux, Zustand, Pinia, Context API)
- API layer (REST, GraphQL, tRPC, Server Actions)
- Auth (JWT, OAuth, Auth.js, Supabase)
- Database + ORM (PostgreSQL/Prisma, MongoDB/Mongoose, etc.)
- Build tool (Vite, Webpack, Turbopack)
- Monorepo (Turborepo, Nx, pnpm workspaces)
- Styling (Tailwind, CSS Modules, styled-components)

**Create `tests/docs/project-config.md`:**

```markdown
# Project Stack

**Framework:** Next.js 14 (App Router)  
**State:** Zustand + TanStack Query  
**API:** tRPC  
**Auth:** Auth.js (next-auth)  
**Database:** PostgreSQL + Prisma  
**Build:** Turbopack  
**Monorepo:** Turborepo  
**Styling:** Tailwind CSS + shadcn/ui

## Testing Implications

- Next.js RSC: Wait for hydration before interactions
- tRPC: Use `createCaller()` for API testing
- Auth.js: Mock session in tests
- Prisma: Use test database per worker
```

---

## Step 2: Browse & Analyze Pages

Use Playwright MCP to explore:

```typescript
// Navigate and snapshot each page
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000' });
await mcp_playwright_browser_snapshot();
```

For EACH page found:

1. Navigate to page
2. Take snapshot (`browser_snapshot`)
3. Score HTML semantic quality (0-100%)
4. Document interactive elements
5. Note selector viability

> 📚 **Reference:** `reference/selector-strategies.md` for detailed scoring rubric

**Scoring rubric (quick reference):**

- ✅ **+20:** Proper form elements (`<input type>`, `<button type>`)
- ✅ **+15:** ARIA labels on inputs (`aria-label`, `<label for>`)
- ✅ **+15:** Semantic landmarks (`<nav>`, `<main>`, `<header>`)
- ✅ **+15:** Proper heading hierarchy
- ✅ **+10:** Role attributes (`role="alert"`, `role="dialog"`)
- ❌ **-20:** Clickable divs/spans instead of buttons
- ❌ **-15:** Inputs without labels
- ❌ **-15:** Generic divs for everything

**Create `tests/docs/pages.md`:**

```markdown
# Application Pages

## Login (/login) - Score: 92/100 ✅

**Interactive Elements:**

| Element | HTML | Works with getByRole/Label? |
|---------|------|----------------------------|
| Email input | `<input type="email" aria-label="Email">` | ✅ `getByLabel('Email')` |
| Password | `<input type="password" aria-label="Password">` | ✅ `getByLabel('Password')` |
| Submit button | `<button type="submit">Sign In</button>` | ✅ `getByRole('button', {name: 'Sign In'})` |
| Error message | `<div role="alert">...</div>` | ✅ `getByRole('alert')` |

**Quality:** Excellent semantic HTML

---

## Dashboard (/dashboard) - Score: 42/100 ❌

**Interactive Elements:**

| Element | HTML | Works with getByRole/Label? |
|---------|------|----------------------------|
| User widget | `<div class="user-widget">John</div>` | ❌ No semantic meaning |
| Logout button | `<div onclick="logout()">Logout</div>` | ❌ Not a proper button |
| Settings link | `<span onclick="nav()">Settings</span>` | ❌ Not a proper link |

**Quality:** Poor - needs test IDs
```

---

## Step 3: Decide Selector Strategy

Apply decision matrix:

| Score | Action |
|-------|--------|
| 80-100% | ✅ Semantic selectors only - NO test IDs |
| 50-79% | ⚠️ Selective test IDs - Only problematic elements |
| 0-49% | ❌ Full test IDs - Add to all interactive elements |

**Create `tests/docs/selector-strategy.md`:**

```markdown
# Selector Strategy

## Login (92%) - ✅ Semantic Only

**Selectors:**

- Email: `page.getByLabel('Email')`
- Password: `page.getByLabel('Password')`  
- Submit: `page.getByRole('button', {name: 'Sign In'})`

**Action:** No code changes needed

---

## Dashboard (42%) - ❌ Needs Test IDs

**Elements needing test IDs:**

- User widget → `data-testid="dashboard-user-widget"`
- Logout button → `data-testid="dashboard-logout-btn"`
- Settings link → `data-testid="dashboard-settings-link"`

**Action:** Modify source code

**Files to change:**

- `app/dashboard/page.tsx`
- `components/UserWidget.tsx`
```

---

## Step 4: Add Test IDs (If Needed)

**Only if pages scored <80%**

Modify source files:

```tsx
// Before
<div className="logout-btn" onClick={handleLogout}>
  Logout
</div>

// After
<div 
  className="logout-btn" 
  onClick={handleLogout}
  data-testid="dashboard-logout-btn"
>
  Logout
</div>
```

**Naming convention:** `{page}-{element}-{type}`

Examples: `dashboard-logout-btn`, `profile-avatar-upload`, `modal-close-btn`

---

## Step 5: Verify

Navigate + check all selectors exist:

```typescript
await page.goto('/dashboard');
await expect(page.getByTestId('dashboard-logout-btn')).toBeVisible();
```

---

## Output Checklist

- [ ] `tests/docs/project-config.md` created with stack detection
- [ ] `tests/docs/pages.md` created with all pages + scores
- [ ] `tests/docs/selector-strategy.md` created with per-page strategy
- [ ] Test IDs added to source (if any pages scored <80%)
- [ ] All selectors verified with MCP

**Next:** Run Prompt 2 to generate test plan
