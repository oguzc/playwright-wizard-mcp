# Prompt 7: Setup CI/CD Pipeline 🚀

> **OPTIONAL** - Add GitHub Actions workflow for automated testing

**Input:** Generated test suite from Steps 1-6

**Output:** `.github/workflows/playwright.yml`

---

## Prerequisites

> 💡 This step is optional but recommended for production projects

**When to use:**
- ✅ Project uses GitHub
- ✅ Want automated test runs on PRs
- ✅ Need CI/CD integration
- ✅ Team collaboration workflow

**When to skip:**
- Project uses different CI (GitLab, Bitbucket, etc.)
- Local-only testing sufficient
- User wants custom CI configuration

---

## Task 1: Detect Project CI Setup

Check if CI already exists:

```bash
# Check for existing workflows
ls -la .github/workflows/
```

**If workflows exist:**
- Ask user if they want to add Playwright workflow
- Avoid overwriting existing files
- Suggest integration with existing workflows

**If no workflows:**
- Safe to create new workflow

---

## Task 2: Analyze Project Configuration

Read these files to configure CI correctly:

### 2.1: Check `playwright.config.ts`

```typescript
// Look for:
- baseURL (may need to change for CI)
- webServer command (how to start app)
- webServer port (must match CI setup)
- workers config (may need to override in CI)
```

### 2.2: Check `package.json`

```json
// Look for:
- Node version (engines field)
- Package manager (npm, yarn, pnpm)
- Test scripts (npm run test, etc.)
- Build scripts (if app needs building)
```

### 2.3: Check Project Structure

```bash
# Check if there's:
- Database setup needed (seed scripts, migrations)
- Environment variables required (.env.example)
- Build step before tests (npm run build)
```

---

## Task 3: Create GitHub Actions Workflow

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    strategy:
      fail-fast: false
      matrix:
        # Run tests across multiple shards for faster CI
        shard: [1, 2, 3, 4]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20  # Adjust based on package.json engines
        cache: 'npm'      # Change to 'yarn' or 'pnpm' if needed
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps chromium
    
    # Add any setup steps (database, env vars, etc.)
    # - name: Setup Database
    #   run: npm run db:setup
    
    # - name: Create .env file
    #   run: |
    #     echo "API_URL=${{ secrets.API_URL }}" >> .env
    
    - name: Run Playwright tests
      run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }}
      env:
        CI: true
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-${{ matrix.shard }}
        path: playwright-report/
        retention-days: 30
    
    - name: Upload test artifacts
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results-${{ matrix.shard }}
        path: test-results/
        retention-days: 7

  # Merge reports from all shards
  merge-reports:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
    
    - name: Install dependencies
      run: npm ci
    
    - name: Download all reports
      uses: actions/download-artifact@v4
      with:
        path: all-reports/
        pattern: playwright-report-*
    
    - name: Merge reports
      run: npx playwright merge-reports --reporter html ./all-reports
    
    - name: Upload merged report
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report-merged
        path: playwright-report/
        retention-days: 30
```

---

## Task 4: Customize for Project

### 4.1: Adjust Node Version

Based on `package.json`:

```json
// If package.json has:
"engines": {
  "node": ">=18.0.0"
}

// Update workflow to:
node-version: 18
```

### 4.2: Adjust Package Manager

```yaml
# For Yarn:
- name: Install dependencies
  run: yarn install --frozen-lockfile

- uses: actions/setup-node@v4
  with:
    cache: 'yarn'

# For pnpm:
- uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Install dependencies
  run: pnpm install --frozen-lockfile

- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'
```

### 4.3: Add Database Setup

If project uses database:

```yaml
- name: Setup Database
  run: |
    npm run db:setup
    npm run db:seed

# Or for Docker-based DB:
- name: Start Database
  run: docker-compose up -d postgres
  
- name: Wait for Database
  run: |
    until docker-compose exec -T postgres pg_isready; do
      sleep 1
    done
  
- name: Run Migrations
  run: npm run db:migrate
```

### 4.4: Add Environment Variables

If `.env.example` exists:

```yaml
- name: Create .env file
  run: |
    echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> .env
    echo "API_KEY=${{ secrets.API_KEY }}" >> .env
    # Add all required env vars

# Or copy from example:
- name: Setup environment
  run: cp .env.example .env
```

### 4.5: Add Build Step

If app needs building:

```yaml
- name: Build application
  run: npm run build

- name: Run Playwright tests
  run: npx playwright test
```

### 4.6: Adjust Browser Coverage

```yaml
# Test only Chromium (faster):
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

# Test all browsers (slower but comprehensive):
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

# Use matrix for parallel browser testing:
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    
- name: Run tests on ${{ matrix.browser }}
  run: npx playwright test --project=${{ matrix.browser }}
```

---

## Task 5: Add Status Badge to README

If `README.md` exists, add workflow status badge:

```markdown
# Project Name

[![Playwright Tests](https://github.com/USERNAME/REPO/actions/workflows/playwright.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/playwright.yml)

...rest of README...
```

Replace `USERNAME` and `REPO` with actual values from git remote.

---

## Task 6: Create PR Template (Optional)

Create `.github/pull_request_template.md`:

```markdown
## Description

<!-- Brief description of changes -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] All existing tests still pass

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)

## Screenshots (if applicable)

<!-- Add screenshots here -->
```

---

## Task 7: Verify CI Configuration

### 7.1: Check Workflow Syntax

```bash
# GitHub CLI (if installed)
gh workflow list

# Or use online validator:
# https://rhysd.github.io/actionlint/
```

### 7.2: Test Locally with Act (Optional)

```bash
# Install act: https://github.com/nektos/act
# Run workflow locally
act -j test
```

### 7.3: Commit and Push

```bash
git add .github/workflows/playwright.yml
git commit -m "ci: add Playwright test automation"
git push
```

### 7.4: Monitor First Run

- Go to GitHub Actions tab
- Watch workflow execution
- Check for any failures
- Review test reports in artifacts

---

## Common CI Issues & Fixes

### Issue: Tests timeout in CI

**Fix:**
```yaml
# Increase timeout
jobs:
  test:
    timeout-minutes: 90  # Increase from 60

# Or in playwright.config.ts:
timeout: process.env.CI ? 60000 : 30000,
```

### Issue: Flaky tests in CI

**Fix:**
```yaml
# Add retries in CI
- name: Run Playwright tests
  run: npx playwright test --retries=2
```

### Issue: Port conflicts

**Fix:**
```typescript
// playwright.config.ts
webServer: {
  command: 'npm run dev',
  port: process.env.CI ? 3000 : 5173,
  reuseExistingServer: !process.env.CI,
}
```

### Issue: Out of memory

**Fix:**
```yaml
# Reduce parallel workers in CI
- name: Run Playwright tests
  run: npx playwright test --workers=2
```

### Issue: Missing dependencies

**Fix:**
```yaml
# Install system dependencies
- name: Install system dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y libpq-dev
```

---

## CI Best Practices

### 1. Fast Feedback

```yaml
# Run P0 tests first
- name: Run critical tests
  run: npx playwright test --grep @critical

- name: Run all tests
  if: success()
  run: npx playwright test
```

### 2. Parallel Execution

```yaml
# Use sharding for faster CI
strategy:
  matrix:
    shard: [1, 2, 3, 4]  # 4 parallel jobs

- name: Run tests
  run: npx playwright test --shard=${{ matrix.shard }}/4
```

### 3. Cache Dependencies

```yaml
# Cache Playwright browsers
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

### 4. Conditional Runs

```yaml
# Skip CI for docs changes
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### 5. Scheduled Runs

```yaml
# Run tests nightly
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

---

## Output Checklist

- [ ] `.github/workflows/playwright.yml` created
- [ ] Node version matches project
- [ ] Package manager correct (npm/yarn/pnpm)
- [ ] Browser installation included
- [ ] Database setup added (if needed)
- [ ] Environment variables configured (if needed)
- [ ] Build step added (if needed)
- [ ] Test sharding configured (for faster CI)
- [ ] Artifact upload configured
- [ ] Report merging configured
- [ ] Workflow syntax valid
- [ ] README badge added (optional)
- [ ] PR template added (optional)
- [ ] First CI run successful

---

## Response Format

```
✅ CI/CD Pipeline Setup Complete

Files Created:
- .github/workflows/playwright.yml

Configuration:
- Node version: 20
- Package manager: npm
- Browsers: chromium only (for speed)
- Sharding: 4 parallel jobs
- Artifacts: Reports + test results
- Retries: Enabled in CI

Next Steps:
1. Commit and push: git add .github && git commit -m "ci: add Playwright tests"
2. Monitor first run in GitHub Actions tab
3. Review test reports in workflow artifacts

Optional Enhancements:
- Add database setup if needed
- Configure environment variables
- Add build step if needed
- Enable all browsers for comprehensive testing
```

---

## Alternative CI Platforms

If not using GitHub Actions, provide equivalent configuration:

### GitLab CI (.gitlab-ci.yml)

```yaml
playwright-tests:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  stage: test
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week
```

### Bitbucket Pipelines (bitbucket-pipelines.yml)

```yaml
pipelines:
  default:
    - step:
        name: Playwright Tests
        image: mcr.microsoft.com/playwright:v1.40.0-jammy
        script:
          - npm ci
          - npx playwright test
        artifacts:
          - playwright-report/**
```

### CircleCI (.circleci/config.yml)

```yaml
version: 2.1
jobs:
  test:
    docker:
      - image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - checkout
      - run: npm ci
      - run: npx playwright test
      - store_artifacts:
          path: playwright-report
```

---

**Note:** This step is optional. If user declines, skip to documentation or completion.
