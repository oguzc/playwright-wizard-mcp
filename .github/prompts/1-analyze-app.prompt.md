# Prompt 1: Analyze App 🔍

> **CRITICAL:** This prompt REQUIRES live browser testing with Playwright MCP  
> **All analysis MUST be based on actual rendered DOM, not code inference**

**Output Files:**

- `project-config.md` - Tech stack detected
- `pages.md` - Pages with DOM quality scores (from live testing)
- `selector-strategy.md` - Which pages need test IDs (verified in browser)
- `VERIFICATION.md` - Evidence of live testing performed
- CODE - Test IDs added to source (if needed)

> **Note:** Create all `.md` files in `.playwright-wizard-mcp/` folder

---

## ⚠️ MANDATORY REQUIREMENTS

**This analysis is INVALID unless:**

1. ✅ Application is launched and accessible via browser
2. ✅ Playwright MCP browser is used to visit EVERY page
3. ✅ Accessibility snapshots are taken for EVERY page
4. ✅ All test selectors are VERIFIED in actual rendered DOM
5. ✅ Interactive flows are TESTED (login, add to cart, etc.)
6. ✅ Evidence is documented in VERIFICATION.md

**If you cannot access the running application:**
- Ask user to start the application first
- Do NOT proceed with code-only analysis
- Do NOT infer or estimate what the DOM contains

---

## Prerequisites

> 💡 **Required:** Playwright MCP for live browser testing  
> 💡 **Recommended:** Review built-in references

**Before starting, verify Playwright MCP is available:**

```typescript
// Check Playwright MCP  
await mcp_playwright_browser_navigate({ url: "about:blank" });
```

**If fails:** Ask user to install Playwright MCP (see reference-mcp-setup), then retry.

**Review built-in references (optional but recommended):**

```typescript
// Get selector strategies for HTML quality scoring
await mcp.callTool('reference-selector-strategies');

// Get core testing principles
await mcp.callTool('reference-core-principles');
```

**Verify application is running:**

```typescript
// Try to access the application
await mcp_playwright_browser_navigate({ url: 'http://localhost:3000' });
// or http://localhost:5173, http://localhost:5174, etc.
```

**If navigation fails:** Ask user to start the dev server, then retry.

---

## Step 0: Pre-Analysis Verification ✅

**MUST complete this checklist before proceeding:**

### Application Health Check

```typescript
// 1. Navigate to the application
await mcp_playwright_browser_navigate({ 
  url: 'http://localhost:3000' // adjust port as needed
});

// 2. Take initial snapshot to confirm page loaded
const homeSnapshot = await mcp_playwright_browser_snapshot();

// 3. Document in VERIFICATION.md
```

**Create `.playwright-wizard-mcp/VERIFICATION.md`:**

```markdown
# Live Testing Verification

**Analysis Date:** [Current date]  
**Application URL:** http://localhost:3000  
**Browser:** Chromium (Playwright MCP)

## ✅ Verification Checklist

- [x] Application launched and accessible
- [x] Playwright MCP browser connected
- [x] Home page snapshot taken
- [ ] All pages visited (to be checked off as completed)
- [ ] Authentication flow tested (if app has auth)
- [ ] Interactive elements tested
- [ ] All test selectors verified in DOM

## Pages Visited

| Page | URL | Snapshot Taken | Selectors Verified |
|------|-----|----------------|-------------------|
| Home | / | ✅ Yes | ✅ Yes |
| About | /about | ⏳ Pending | ⏳ Pending |
...

## Evidence Log

### Home Page Analysis
- **Snapshot taken:** Yes
- **Test IDs found in DOM:** 
  - `data-testid="home-page"` ✅ VERIFIED
  - `data-testid="features-section"` ✅ VERIFIED
- **Interactive elements tested:** None (static page)
- **Quality score rationale:** Based on actual accessibility tree

### Example: Page with Form
- **Snapshot taken:** Yes
- **Test IDs found in DOM:**
  - `data-testid="email-input"` ❌ NOT FOUND (needs adding)
  - `data-testid="login-button"` ✅ VERIFIED
- **Interactive elements tested:**
  - ✅ Filled email field with getByLabel('Email')
  - ✅ Filled password field  
  - ✅ Clicked login button
  - ✅ Verified error message appears
- **Quality score rationale:** 7/10 due to missing test IDs on inputs
```

**Update this file as you complete each step.**

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

**Create `.playwright-wizard-mcp/project-config.md`:**

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

## Step 2: Browse & Analyze Pages (LIVE TESTING REQUIRED)

**🚨 CRITICAL: You MUST use Playwright MCP browser for this step**

### For EACH page discovered:

#### 2.1: Navigate to the Page

```typescript
await mcp_playwright_browser_navigate({ 
  url: 'http://localhost:3000/login' 
});
```

#### 2.2: Take Accessibility Snapshot

```typescript
const snapshot = await mcp_playwright_browser_snapshot();
```

**The snapshot shows the actual rendered DOM structure like:**

```
heading "Sign In" (level=1)
textbox "Email" (type=email)
textbox "Password" (type=password)
button "Sign In" (type=submit)
link "Create account"
```

#### 2.3: Verify Test Selectors in Live DOM ⚠️ MANDATORY

**For EACH interactive element, FUNCTIONALLY test if selectors work with MCP:**

> 🚨 **NOT OPTIONAL**: Every selector must be verified with actual MCP tool calls  
> 🚨 **NOT PSEUDO-CODE**: Use real mcp_playwright_browser_* tools  
> 🚨 **MUST INTERACT**: Don't just check if element exists - actually click/fill

**Use MCP tools to test selectors:**

```typescript
// Test button with MCP - get ref from snapshot
await mcp_playwright_browser_click({
  element: 'Sign In button',
  ref: '2' // From snapshot output
});
// ✅ Works - document: getByRole('button', { name: 'Sign In' })

// Test input with MCP
await mcp_playwright_browser_type({
  element: 'Email input',
  ref: '0', // From snapshot output
  text: 'test@example.com'
});
// ✅ Works - document: getByLabel('Email')

// If selector fails with MCP:
// ❌ Doesn't work - needs test ID or different selector
```

#### 2.4: Test Interactive Flows ⚠️ MANDATORY

**Don't just view - interact with MCP tools!**

```typescript
// Example: Test login flow with ACTUAL MCP calls
await mcp_playwright_browser_type({
  element: 'Email input',
  ref: '0',
  text: 'test@example.com'
});

await mcp_playwright_browser_type({
  element: 'Password input',
  ref: '1',
  text: 'password123'
});

await mcp_playwright_browser_click({
  element: 'Sign In button',
  ref: '2'
});

// Wait and check what happens
await mcp_playwright_browser_wait_for({ time: 1 });
const afterSubmit = await mcp_playwright_browser_snapshot();
const error = await page.getByRole('alert').textContent();
// Document the behavior
```

#### 2.5: Score HTML Quality Based on ACTUAL DOM

**Score (0-100) based on snapshot and interaction results:**

- ✅ **+20:** Proper form elements | ✅ **+15:** ARIA labels work with getByLabel()
- ✅ **+15:** Semantic landmarks | ✅ **+15:** Heading hierarchy correct
- ✅ **+10:** Role attributes verified | ✅ **+10:** Test IDs present
- ❌ **-20:** Clickable divs | ❌ **-15:** Inputs without labels | ❌ **-15:** Generic divs

**Mark findings:** ✅ VERIFIED (tested) or ⚠️ INFERRED (code-based guess)

> 📚 **Reference:** `reference/selector-strategies.md` for detailed rubric

**Create `.playwright-wizard-mcp/pages.md`:**

```markdown
# Application Pages

> **Analysis Method:** ✅ LIVE BROWSER TESTING with Playwright MCP

## Example Page - Contact Form (/contact) - Score: 92/100 ✅

**Verification:** ✅ Visited, ✅ Snapshot taken, ✅ Selectors tested, ✅ Flow tested

**Interactive Elements (VERIFIED):**

| Element | From Snapshot | Selector | Status |
|---------|--------------|----------|--------|
| Email | `textbox "Email"` | `getByLabel('Email')` | ✅ VERIFIED |
| Password | `textbox "Password"` | `getByLabel('Password')` | ✅ VERIFIED |
| Submit | `button "Sign In"` | `getByRole('button', {name: 'Sign In'})` | ✅ VERIFIED |

**Score Rationale:** Excellent semantic HTML, all elements accessible, minor issue with autocomplete

**Flow Tested:** ✅ Fill email → ✅ Fill password → ✅ Click submit → ✅ Error shows

[Repeat for each page...]
```

**🚨 IMPORTANT:** Do NOT write "Expected..." or "Should..." unless you ACTUALLY tested it!

---

## Step 3: Decide Selector Strategy

Apply decision matrix:

| Score | Action |
|-------|--------|
| 80-100% | ✅ Semantic selectors - NO test IDs needed |
| 50-79% | ⚠️ Selective test IDs - Only problematic elements |
| 0-49% | ❌ Full test IDs - All interactive elements |

**Create `.playwright-wizard-mcp/selector-strategy.md`:**

```markdown
# Selector Strategy

> **Analysis Method:** ✅ LIVE BROWSER TESTING with Playwright MCP

## Per-Page Strategy

### High Score Page (80%+) - Use Semantic Selectors

**Example - Contact Form (92%):** All semantic selectors work ✅

### Low Score Page (<80%) - Add Test IDs

**Example - Complex Dashboard (42%):** Semantic selectors fail ❌

| Element | Tested Selector | Result | Recommendation |
|---------|----------------|--------|----------------|
| Logout | `getByRole('button')` | ❌ FAILED | Add `data-testid="dashboard-logout-btn"` |

**If cannot determine selector with MCP:** 🆘

Sometimes MCP snapshot may not reveal complex elements. As last resort:

```bash
# Create minimal test
npx playwright test --debug
```

Ask user to use "Pick locator" tool in Playwright Inspector to identify the element, then document that selector in the strategy.

**Files to modify:** `app/dashboard/page.tsx`
```

**Naming convention:** `{page}-{element}-{type}` (e.g., `dashboard-logout-btn`)

**🚨 Only recommend test IDs where semantic selectors ACTUALLY FAILED in testing!**

---

## Step 4: Add Test IDs (If Needed)

**Only for pages scoring <80%**

```tsx
// Example: Add test ID
<button 
  onClick={handleLogout}
  data-testid="dashboard-logout-btn"
>
  Logout
</button>
```

---

## Step 5: Re-Verify in Browser ⚠️ MANDATORY

**Re-test everything after code changes with MCP:**

```typescript
await mcp_playwright_browser_navigate({ 
  url: 'http://localhost:3000/dashboard' 
});

// Test the new selector works
await mcp_playwright_browser_click({
  element: 'Logout button',
  ref: 'X' // from snapshot
});

// Verify it worked
await mcp_playwright_browser_wait_for({ time: 1 });
const afterLogout = await mcp_playwright_browser_snapshot();
// ✅ Should show login/home page
```

**Update VERIFICATION.md with re-test results showing MCP tool calls succeeded.**

---

## Output Checklist

- [ ] `.playwright-wizard-mcp/project-config.md` - Stack detection
- [ ] `.playwright-wizard-mcp/pages.md` - All pages with VERIFIED scores  
- [ ] `.playwright-wizard-mcp/selector-strategy.md` - TESTED recommendations
- [ ] `.playwright-wizard-mcp/VERIFICATION.md` - Evidence log with verification summary
- [ ] **Every selector tested with MCP browser tools** ⚠️ MANDATORY
- [ ] **Every interaction verified with mcp_playwright_browser_click/type** ⚠️ MANDATORY
- [ ] Test IDs added to source (if pages scored <80%)
- [ ] **All selectors re-verified with MCP after changes** ⚠️ MANDATORY

**Add verification summary to end of selector-strategy.md:**

```markdown
## Verification Summary
**Analysis Method:** Live browser testing ✅  
**Pages:** 8 visited, 8 snapshots, 45 selectors tested  
**Confidence:** HIGH - All findings based on actual testing  
**Evidence:** See VERIFICATION.md
```

---

## 🚨 ANTI-PATTERNS

**❌ WRONG:** Guessing - "Expected to find..." or "Should have..."  
**✅ CORRECT:** Evidence - "✅ Visited, ✅ Snapshot shows..., ✅ Tested selector works"

**❌ WRONG:** `data-testid="login-button" (inferred)`  
**✅ CORRECT:** `data-testid="login-button" ✅ VERIFIED` or `❌ NOT FOUND`

**❌ WRONG:** "All pages have good HTML"  
**✅ CORRECT:** "Login: `heading level=1` ✅, Dashboard: `navigation` + `main` ✅"

---

## 📋 Summary: Key Changes in This Prompt

This prompt was updated to address critical issues found during validation:

### What Changed

1. **Mandatory live browser testing** - No longer optional
2. **VERIFICATION.md required** - Evidence of testing must be documented
3. **Explicit verification status** - Every finding marked as VERIFIED or needs documentation
4. **Interactive flow testing** - Must actually use the application, not just view it
5. **Pre-analysis checklist** - App must be running before starting
6. **Anti-patterns section** - Clear examples of what NOT to do
7. **Score verification** - Must explain rationale based on actual testing

### Why These Changes

**Original Problem:** Agents were analyzing code instead of using live browser testing, leading to:
- Inaccurate quality scores
- Recommendations to add test IDs that already existed
- Missing actual runtime behavior
- Unreliable foundation for subsequent test development

**Solution:** This updated prompt enforces verification at every step and requires evidence.

### Success Criteria

Analysis is only valid if:
- ✅ Every page visited with Playwright MCP browser
- ✅ Every selector tested in actual rendered DOM
- ✅ Interactive flows tested (not just viewed)
- ✅ VERIFICATION.md documents all testing
- ✅ No "inferred" or "estimated" findings without disclaimer
- ✅ Scores justified with evidence from snapshots

**Result:** Reliable, accurate analysis that teams can trust for building test automation.
