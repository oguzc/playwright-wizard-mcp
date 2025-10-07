# Pre-Publishing Checklist

Complete this checklist before publishing to npm and submitting to the MCP registry.

## Repository Setup

- [ ] Repository created on GitHub
- [ ] Repository is public
- [ ] README.md is complete and accurate
- [ ] LICENSE file is present (MIT)
- [ ] .gitignore is configured
- [ ] All code is committed and pushed

## Package Configuration

- [ ] `package.json` has correct name
- [ ] `package.json` has correct version (start with 0.1.0)
- [ ] `package.json` has correct author information
- [ ] `package.json` has correct repository URL
- [ ] `package.json` has correct homepage URL
- [ ] `package.json` has correct bugs URL
- [ ] Keywords are relevant and complete

## Build & Test

- [ ] `npm install` runs without errors
- [ ] `npm run build` completes successfully
- [ ] `build/index.js` exists and is executable
- [ ] `npm run dev` starts the server successfully
- [ ] `.github/prompts/` directory exists with all prompt files
- [ ] Prompts load correctly when accessed

## Documentation

- [ ] README has installation instructions
- [ ] README has configuration examples
- [ ] README lists all available prompts
- [ ] CHANGELOG.md is up to date
- [ ] QUICKSTART.md is helpful and accurate
- [ ] examples/config.md has working examples

## npm Publishing

- [ ] You have an npm account
- [ ] You're logged in with `npm login`
- [ ] `npm pack` runs successfully
- [ ] Test the packed .tgz file locally
- [ ] Run `npm publish --dry-run` to verify
- [ ] Ready to run `npm publish --access public`

## GitHub Setup

- [ ] GitHub repository has description
- [ ] GitHub repository has topics/tags
- [ ] Release notes prepared
- [ ] Version tag ready (v0.1.0)

## MCP Registry Submission

- [ ] Package is published to npm
- [ ] Package is installable via `npx -y playwright-wizard-mcp`
- [ ] Fork https://github.com/modelcontextprotocol/servers
- [ ] Prepare server entry JSON
- [ ] Prepare README entry
- [ ] Create pull request with both additions

## Post-Publishing

- [ ] Verify package appears on npm
- [ ] Test installation with `npx playwright-wizard-mcp`
- [ ] Test in Claude Desktop or Cline
- [ ] Create GitHub release with tag
- [ ] Share on social media / communities
- [ ] Monitor for issues and feedback

## Before Each Update

- [ ] Update version in package.json (`npm version patch/minor/major`)
- [ ] Update CHANGELOG.md with changes
- [ ] Test build and functionality
- [ ] Commit and push changes
- [ ] Publish to npm
- [ ] Create GitHub release with new tag

---

## Quick Reference

### Publishing Commands

```bash
# First time setup
npm login

# Build and test
npm run build
npm pack
npm install ./playwright-wizard-mcp-0.1.0.tgz

# Publish
npm publish --access public

# Version updates
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.1 -> 0.2.0
npm version major  # 0.2.0 -> 1.0.0
```

### GitHub Release Commands

```bash
# Create and push tag
git tag v0.1.0
git push origin v0.1.0

# Then create release on GitHub web interface
```

### Testing Locally

```bash
# Run in dev mode
npm run dev

# Build and test production build
npm run build
node build/index.js
```
