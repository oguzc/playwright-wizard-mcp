# Publishing Playwright Wizard MCP

This guide covers publishing the MCP server to npm and submitting it to the official MCP registry.

## Prerequisites

- npm account (sign up at https://www.npmjs.com/signup)
- GitHub account
- Repository pushed to GitHub

## Step 1: Prepare for npm Publishing

1. **Update package.json with your information:**
   ```json
   {
     "name": "playwright-wizard-mcp",
     "author": "Your Name <your.email@example.com>",
     "repository": {
       "type": "git",
       "url": "https://github.com/oguzc/playwright-wizard-mcp.git"
     },
     "bugs": {
       "url": "https://github.com/oguzc/playwright-wizard-mcp/issues"
     },
     "homepage": "https://github.com/oguzc/playwright-wizard-mcp#readme"
   }
   ```

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Test the package locally:**
   ```bash
   npm pack
   # This creates a .tgz file you can test with: npm install ./playwright-wizard-mcp-0.1.0.tgz
   ```

## Step 2: Publish to npm

1. **Publish the package:**
   ```bash
   npm publish --access public
   ```

2. **Verify it's published:**
   - Visit https://www.npmjs.com/package/playwright-wizard-mcp
   - Test installation: `npx playwright-wizard-mcp`

## Step 3: Submit to MCP Registry

The MCP registry is hosted at https://github.com/modelcontextprotocol/servers

1. **Fork the repository:**
   - Go to https://github.com/modelcontextprotocol/servers
   - Click "Fork" in the top right

2. **Add your server to the registry:**
   
   Create a new file: `src/playwright-wizard-mcp/index.json`
   
   ```json
   {
     "name": "playwright-wizard-mcp",
     "description": "MCP server providing Playwright test generation wizard with intelligent prompts and best practices",
     "version": "0.1.0",
     "repository": {
       "type": "git",
       "url": "https://github.com/oguzc/playwright-wizard-mcp"
     },
     "homepage": "https://github.com/oguzc/playwright-wizard-mcp",
     "license": "MIT",
     "author": "Your Name",
     "keywords": [
       "playwright",
       "testing",
       "e2e",
       "test-generation",
       "automation",
       "wizard"
     ],
     "runtime": "node",
     "installCommand": "npm install -g playwright-wizard-mcp",
     "configExample": {
       "mcpServers": {
         "playwright-wizard": {
           "command": "npx",
           "args": ["-y", "playwright-wizard-mcp"]
         }
       }
     },
     "capabilities": {
       "prompts": true,
       "tools": true,
       "resources": false
     }
   }
   ```

3. **Update the main servers list:**
   
   Add your server to the README or index file:
   
   ```markdown
   ### playwright-wizard-mcp
   
   Intelligent Playwright test generation wizard with step-by-step prompts and best practices.
   
   **Features:**
   - 6-step wizard workflow for comprehensive test suites
   - Selector strategies and HTML quality scoring
   - Fixture patterns for parallel execution
   - Optional accessibility and API testing
   
   [Repository](https://github.com/oguzc/playwright-wizard-mcp) | 
   [npm](https://www.npmjs.com/package/playwright-wizard-mcp)
   ```

4. **Create a Pull Request:**
   - Commit your changes
   - Push to your fork
   - Create a PR to the main repository
   - Fill in the PR template with details about your server

## Step 4: Tag a Release on GitHub

1. **Create a git tag:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. **Create a GitHub release:**
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Choose the tag you just created
   - Add release notes from CHANGELOG.md
   - Publish the release

## Publishing Updates

When you want to publish a new version:

1. **Update version:**
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Update CHANGELOG.md** with new changes

3. **Build and publish:**
   ```bash
   npm run build
   npm publish
   ```

4. **Tag and release on GitHub** (see Step 4 above)

## Checklist Before Publishing

- [ ] All tests pass
- [ ] README is complete and accurate
- [ ] CHANGELOG is updated
- [ ] License file is present
- [ ] package.json has correct author and repository info
- [ ] .npmignore excludes source files
- [ ] Built files are in the `build/` directory
- [ ] Server runs successfully with `npm run dev`

## Notes

- **Naming:** MCP server packages should be named `*-mcp` or `mcp-*`
- **Version:** Follow semantic versioning (semver.org)
- **Documentation:** Keep README up to date with examples
- **Support:** Respond to issues and PRs promptly
