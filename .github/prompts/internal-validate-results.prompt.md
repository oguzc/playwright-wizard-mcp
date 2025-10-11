# Validate Workflow Results 🔍

> Analyze a project where a specific Playwright Wizard workflow step was executed

**Purpose:** Review the generated files from ONE step and provide feedback for improving that specific prompt

---

## ⚠️ CRITICAL: Validate ONE Step at a Time

**This prompt validates a SINGLE workflow step, not the entire workflow.**

The user must tell you which step to validate, OR you must detect it from the files.

### Detection Logic:

1. **Ask the user first:** "Which step should I validate? (1-6)"
2. **If user doesn't specify**, detect from files:
   - `.playwright-wizard-mcp/` files exist → Steps 1-2 completed
   - `playwright.config.ts` + `tests/fixtures.ts` exist → Step 3 completed
   - `tests/pages/` directory exists with POM files → Step 4 completed
   - `tests/*/` directories with `.spec.ts` files → Step 5 completed
   - Review/optimization notes → Step 6 completed
3. **If multiple steps completed**, ask: "I see Steps X, Y, Z were completed. Which one should I validate?"

---

## Critical Validation Points

### For Step 1 (Analyze App):

**MUST verify the agent used live browser testing:**

- ✅ Did the agent launch the application?
- ✅ Did the agent use Playwright MCP to visit pages?
- ✅ Did the agent take accessibility snapshots?
- ✅ Did the agent test authentication (login/register)?
- ✅ Did the agent interact with the cart?
- ✅ Are HTML quality scores based on actual DOM or code estimates?

**Red flags that indicate code-only analysis:**
- ❌ Pages marked as "Expected score" or "needs verification"
- ❌ No mention of browser navigation or snapshots
- ❌ Selectors recommended without verification
- ❌ No evidence of form interactions
- ❌ No screenshots or snapshot references

**If live testing was NOT done, this is a CRITICAL FAILURE** - the analysis is unreliable.

---

## Usage Flow

### Step 1: User provides project path

User: "Validate C:\projects\my-app"

### Step 2: Ask which step to validate

Agent: "Which step should I validate?"
- Step 1: Analyze App (project-config.md, pages.md, selector-strategy.md)
- Step 2: Test Plan (test-plan.md)
- Step 3: Infrastructure (playwright.config.ts, fixtures.ts, helpers/)
- Step 4: Page Objects (tests/pages/*.ts)
- Step 5: Test Suite (tests/**/*.spec.ts)
- Step 6: Review & Optimize

### Step 3: Validate ONLY that step

Based on the user's answer, validate ONLY the specified step and provide targeted feedback.

---

## Task: Validate ONE Specific Step

Based on which step you're validating, follow the appropriate section below.

---

## Step 1 Validation: Analyze App

### Files to Check:
- `.playwright-wizard-mcp/project-config.md`
- `.playwright-wizard-mcp/pages.md`
- `.playwright-wizard-mcp/selector-strategy.md`
- `.playwright-wizard-mcp/VERIFICATION.md` (if exists)

### What to Evaluate:
### What to Evaluate:

#### project-config.md:
- ✅ Tech stack detected correctly?
- ✅ Project structure understood?
- ✅ Dependencies identified?
- ✅ **LIVE TESTING EVIDENCE**: Mentions browser navigation, snapshots, interactions?
- ❌ Any misunderstandings or missing info?

#### pages.md:
- ✅ All pages discovered?
- ✅ Quality scores make sense (0-100)?
- ✅ **VERIFIED** tag on each page?
- ✅ URLs correct?
- ✅ Key elements identified?
- ✅ Evidence of actual DOM inspection?
- ❌ Missing pages or incorrect scores?
- ❌ Any "Expected" or "needs verification" warnings?

#### selector-strategy.md:
- ✅ Selector recommendations appropriate per page?
- ✅ Test ID suggestions reasonable?
- ✅ Strategy matches quality scores?
- ✅ Examples show tested selectors?
- ❌ Wrong strategy for any page?

#### VERIFICATION.md (if exists):
- ✅ Complete checklist filled out?
- ✅ Evidence of actual browser testing?
- ✅ Snapshots mentioned?
- ✅ E2E flows tested?

---

## Step 2 Validation: Test Plan

### Files to Check:
- `.playwright-wizard-mcp/test-plan.md`

### What to Evaluate:
- ✅ Test scenarios comprehensive?
- ✅ Priorities (P0/P1/P2) assigned well?
- ✅ Dependencies identified?
- ✅ Realistic estimates?
- ✅ Parallel testing considerations addressed?
- ✅ Test data requirements specified?
- ❌ Missing critical test cases?
- ❌ Unrealistic expectations?

---

## Step 3 Validation: Infrastructure

### Files to Check:
- `playwright.config.ts`
- `tests/fixtures.ts`
- `tests/helpers/*.ts`
- `tests/tsconfig.json` (if exists)

### What to Evaluate:

#### playwright.config.ts:
- ✅ Config makes sense for detected stack?
- ✅ baseURL correct?
- ✅ webServer command appropriate?
- ✅ Parallel settings good (workers configured)?
- ✅ Timeout settings reasonable?
- ✅ Reporter configuration present?
- ❌ Any config issues?

#### tests/fixtures.ts:
- ✅ Exports `test` and `expect`?
- ✅ Worker fixtures defined (if needed)?
- ✅ Test fixtures defined (if needed)?
- ✅ Proper TypeScript types?
- ✅ If page objects exist, are they integrated as fixtures?
- ❌ Missing fixture definitions?
- ❌ Incorrect fixture scope?

#### tests/helpers/*.ts:
- ✅ TestDataFactory or similar helper exists?
- ✅ Generates unique data per worker?
- ✅ Helper functions well-designed?
- ❌ Missing critical helpers?

### TypeScript Check:
```bash
npx tsc --noEmit
# Should have ZERO errors
```

---

## Step 4 Validation: Page Objects

### Files to Check:
- `tests/pages/BasePage.ts`
- `tests/pages/*.ts` (all page object files)

### What to Evaluate:

#### BasePage.ts:
- ✅ Exists and properly structured?
- ✅ Common methods defined?
- ✅ Takes `Page` in constructor?
- ❌ Missing base functionality?

#### Page Object Files:
- ✅ One POM per page from pages.md?
- ✅ Extends BasePage?
- ✅ Selectors match selector-strategy.md?
- ✅ Methods well-named and documented?
- ✅ POMs are stateless (no instance variables for test data)?
- ✅ Uses locators properly?
- ✅ No hardcoded test data?
- ❌ Wrong selectors or poor structure?
- ❌ Anti-patterns (stateful POMs, page.waitForTimeout, etc.)?

#### Integration with Fixtures:
- ✅ All page objects added to fixtures.ts?
- ✅ Fixture definitions created for each POM?
- ✅ Correct fixture scope?

### TypeScript Check:
```bash
npx tsc --noEmit
# Should have ZERO errors
```

---

## Step 5 Validation: Test Suite

### Files to Check:
- `tests/**/*.spec.ts` (all test spec files)

### What to Evaluate:

#### Test Structure:
- ✅ Tests use fixtures (not manual instantiation)?
- ✅ No `new PageName(page)` in tests?
- ✅ Web-first assertions used?
- ✅ Unique test data per test?
- ✅ Tests well-structured?
- ✅ Proper test organization (describe blocks)?
- ❌ Bad patterns or anti-patterns?

#### Test Quality:
- ✅ Tests are deterministic (no race conditions)?
- ✅ Proper cleanup (if needed)?
- ✅ Tests are isolated?
- ✅ No dependencies between tests?
- ✅ Parallel-safe (no shared state)?
- ❌ Flaky tests?
- ❌ Tests that depend on execution order?

#### Test Coverage:
- ✅ All scenarios from test-plan.md covered?
- ✅ Edge cases included?
- ✅ Error handling tested?

### TypeScript Check:
```bash
npx tsc --noEmit
# Should have ZERO errors
```

### Run Tests (if possible):
```bash
npx playwright test --workers=1
```

**Report:**
- ✅ Tests pass?
- ❌ Test failures? (list them)
- ❌ Selector issues?
- ❌ Configuration issues?

---

## Step 6 Validation: Review & Optimize

### Files to Check:
- Review notes or optimization suggestions
- Test results
- Coverage reports

### What to Evaluate:
- ✅ Identified flaky tests?
- ✅ Performance issues addressed?
- ✅ Best practices followed?
- ✅ Code quality improvements suggested?

---

## Output Format: Step-Specific Feedback Report

### Summary

**Project:** [name]  
**Step Validated:** Step [X] - [Name]  
**Date:** [date]  
**Overall Quality:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

### What Worked Well

List positives for this specific step:

**[Step Name]:**
- ✅ [what was good]
- ✅ [what was good]
- ✅ [what was good]

---

### Issues Found

List problems for this specific step:

**[Step Name]:**
- ❌ Issue: [description]
- 💡 Improvement needed: [suggestion for prompt]
- � How to fix: [specific change to make]

---

### Code Quality Assessment (if applicable)

**TypeScript:**
- ✅/❌ Compiles without errors
- Issues: [list if any]

**Generated Code Quality:**
- Quality: ⭐⭐⭐⭐⭐
- Issues: [list if any]

---

### Specific Recommendations for This Prompt

#### For Prompt [X] ([Step Name]):
1. [specific improvement suggestion]
2. [specific improvement suggestion]
3. [specific improvement suggestion]

---

### Missing or Unclear

List anything in this specific step that was:
- Confusing in the prompt
- Missing from the output
- Needs better documentation
- Needs additional validation

---

### Overall Assessment for This Step

**Was this step executed correctly?** Yes/No  
**Is the output production-ready?** Yes/No/Needs work  
**Biggest strength:** [what stood out as excellent]  
**Biggest weakness:** [what needs most improvement]  

---

## Example Usage

```
User: "Validate C:\projects\my-app"

Agent: "Which step should I validate?
- Step 1: Analyze App
- Step 2: Test Plan  
- Step 3: Infrastructure
- Step 4: Page Objects
- Step 5: Test Suite
- Step 6: Review & Optimize"

User: "Step 3"

Agent:
- Reads playwright.config.ts
- Reads tests/fixtures.ts
- Reads tests/helpers/*.ts
- Runs npx tsc --noEmit
- Provides focused feedback ONLY on Step 3 infrastructure
```

