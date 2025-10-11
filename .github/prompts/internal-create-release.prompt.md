# Create GitHub Release

Create a GitHub release for the current version tag.

## Steps

1. **Get version info**:
   - Read `package.json` to get current version
   - Get recent commits since last version using `git log`
   - Extract changes for release notes

2. **Open GitHub release page**:
   ```
   https://github.com/oguzc/playwright-wizard-mcp/releases/new?tag=v{VERSION}&title=v{VERSION}
   ```

3. **Format release information**:
   ```
   Create Release v{VERSION}
   
   The GitHub release page should now be open. Here's what to use:
   
   Release Details:
   - Tag: v{VERSION} (should be pre-filled)
   - Title: v{VERSION} - {SHORT_DESCRIPTION}
   - Description:
   
   ## What's Changed
   
   {CATEGORIZED_CHANGES}
   
   ## 🔗 Links
   - [NPM Package](https://www.npmjs.com/package/playwright-wizard-mcp)
   - [MCP Registry](https://mcp.so/server/playwright-wizard-mcp) (available after publishing)
   
   **Full Changelog**: https://github.com/oguzc/playwright-wizard-mcp/compare/v{PREV_VERSION}...v{VERSION}
   ```

## Change Categorization

Group commits by conventional commit type:
- **feat**: New features → "✨ Features"
- **fix**: Bug fixes → "🐛 Bug Fixes"
- **docs**: Documentation → "📚 Documentation"
- **refactor**: Code refactoring → "♻️ Refactoring"
- **perf**: Performance → "⚡ Performance"
- **test**: Tests → "✅ Tests"
- **chore**: Maintenance → "🔧 Maintenance"

## Example Output

```
Create Release v0.1.4

The GitHub release page should now be open. Here's what to use:

Release Details:
- Tag: v0.1.4 (should be pre-filled)
- Title: v0.1.4 - Fixed MCP Registry Publishing
- Description:

## What's Changed

### 🐛 Bug Fixes
- Fixed MCP Publisher download URL pattern

### 📚 Documentation
- Cleaned up README for end users
- Enhanced documentation with MCP Registry integration

## 🔗 Links
- [NPM Package](https://www.npmjs.com/package/playwright-wizard-mcp)
- [MCP Registry](https://mcp.so/server/playwright-wizard-mcp) (available after publishing)

**Full Changelog**: https://github.com/oguzc/playwright-wizard-mcp/compare/v0.1.3...v0.1.4
```

## Notes

- Use Simple Browser to open the release page
- Pre-fill tag and title parameters in URL
- Generate concise, user-friendly release notes
- Include comparison link to previous version
- Add relevant links (NPM, MCP Registry)
