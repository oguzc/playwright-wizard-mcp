# Workflow Overview

> High-level guide to the prompt sequence and outputs

## Prompt Sequence

```
1. analyze-app
   ↓ Creates: .playwright-wizard-mcp/{project-config, pages, selector-strategy}.md
   ↓ Optionally adds test IDs to source code
   
2. generate-test-plan
   ↓ Creates: .playwright-wizard-mcp/test-plan.md
   
3. setup-infrastructure
   ↓ Creates: playwright.config.ts, CI/CD, fixtures, test-data, db-helpers
   
4. generate-page-objects
   ↓ Creates: tests/pages/*.ts (BasePage + one per page)
   
5. implement-test-suite (REPEATABLE)
   ↓ Creates: tests/e2e/*.spec.ts (one suite at a time)
   ↓ Updates: .playwright-wizard-mcp/test-plan.md (marks complete)
   ↓ Run again for next suite
   
6. review-and-optimize
   ↓ Audits: Parallel safety + performance
   ↓ Fixes: Race conditions, unnecessary waits
```

## Optional Enhancements

Run these after completing the core workflow:

- **add-accessibility** - Add axe-core accessibility tests
- **add-api-testing** - Add API contract tests

---

## Workflow Files

All documentation files are created in `.playwright-wizard-mcp/`:

| File | Created By | Used By | Purpose |
|------|-----------|---------|---------|
| `project-config.md` | Prompt 1 | All prompts | Tech stack detection |
| `pages.md` | Prompt 1 | Prompts 2,4 | Page inventory with quality scores |
| `selector-strategy.md` | Prompt 1 | Prompt 4 | Per-page selector approach |
| `test-plan.md` | Prompt 2 | Prompt 5 | Test suites with progress tracking |

---

## Example Session

```bash
# Step 1: Analyze
User: "Run analyze-app prompt for http://localhost:3000"
Agent: → Detects Next.js 14 + Prisma + Auth.js
       → Browses all pages with Playwright MCP
       → Scores HTML: Login (92%), Dashboard (45%)
       → Adds test IDs to Dashboard components
       → Creates 3 docs in .playwright-wizard-mcp/

# Step 2: Plan
User: "Run generate-test-plan prompt"
Agent: → Reads project-config, pages, selector-strategy
       → Creates test-plan.md with 5 suites
       → Marks: 3 P0 (critical), 2 P1 (high priority)

# Step 3: Infrastructure
User: "Run setup-infrastructure prompt"
Agent: → Creates playwright.config.ts (parallel-safe)
       → Creates GitHub Actions workflow
       → Creates worker fixtures (DB per worker)
       → Creates test fixtures (unique data per test)
       → Creates Faker.js data factories
       → Creates DB seed/cleanup helpers

# Step 4: Page Objects
User: "Run generate-page-objects prompt"
Agent: → Creates BasePage.ts
       → Creates LoginPage (semantic selectors - score 92%)
       → Creates DashboardPage (test IDs - score 45%)
       → Verifies all selectors with MCP

# Step 5a: First Suite
User: "Run implement-test-suite prompt"
Agent: → Reads test-plan.md
       → Implements auth.spec.ts (first unchecked)
       → Tests pass with --workers=4
       → Tests pass with --workers=1
       → Marks [x] auth.spec.ts in test-plan.md
       → Progress: [1/5 complete]

# Step 5b: Second Suite
User: "Run implement-test-suite prompt"
Agent: → Implements dashboard.spec.ts (next unchecked)
       → Tests pass with --workers=4
       → Tests pass with --workers=1
       → Marks [x] dashboard.spec.ts in test-plan.md
       → Progress: [2/5 complete]

# ... repeat for remaining suites ...

# Step 6: Final Review
User: "Run review-and-optimize prompt"
Agent: → Audits all suites for parallel safety
       → Tests with 1, 2, 4, 8 workers (all pass)
       → Removes unnecessary waits
       → Adds storageState for auth optimization
       → Reports: All tests parallel-safe, 35% faster
```

---

## When to Use Optional Prompts

### add-accessibility

Use when:
- [ ] Public-facing website (legal compliance)
- [ ] Accessibility is a product requirement
- [ ] Design system library

Skip when:
- Internal tools (no compliance needs)
- Pure API/backend service

### add-api-testing

Use when:
- [ ] REST/GraphQL/tRPC API exists
- [ ] Backend under active development
- [ ] Want faster feedback than E2E

Skip when:
- Static site (no backend)
- Third-party APIs only (can't control)

---

## File Output Summary

### Code Files Created

```
tests/
├── e2e/
│   ├── auth.spec.ts           # Prompt 5 (run 1)
│   ├── dashboard.spec.ts      # Prompt 5 (run 2)
│   └── ...                    # Prompt 5 (run N)
├── pages/
│   ├── BasePage.ts            # Prompt 4
│   ├── LoginPage.ts           # Prompt 4
│   └── ...                    # Prompt 4
├── fixtures.ts                # Prompt 3
├── test-data.ts               # Prompt 3
└── utils/
    └── db-helpers.ts          # Prompt 3

playwright.config.ts           # Prompt 3

.github/workflows/
└── playwright.yml             # Prompt 3
```

### Documentation Files Created

```
.playwright-wizard-mcp/
├── project-config.md          # Prompt 1
├── pages.md                   # Prompt 1
├── selector-strategy.md       # Prompt 1
└── test-plan.md               # Prompt 2 (updated by Prompt 5)
```

---

## Key Workflow Characteristics

1. **One-shot analysis** - Prompt 1 does everything (stack + pages + selectors + test IDs)
2. **One-shot infrastructure** - Prompt 3 creates all setup files at once
3. **Incremental testing** - Prompt 5 repeatable, one suite at a time
4. **Always verified** - MCP checks selectors before writing tests
5. **Always tracked** - test-plan.md shows progress with checkboxes
6. **Parallel-safe by design** - Worker fixtures + unique test data
