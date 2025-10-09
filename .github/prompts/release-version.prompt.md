# Release Version

Increment package version, commit, tag, and push to remote.

## Steps

1. Run `npm version patch` to:
   - Bump patch version in package.json
   - Create git commit with version message
   - Create git tag

2. Push changes:
   - Push commit: `git push`
   - Push tag: `git push --tags`

Alternatively, use GitKraken MCP `git_push` if available to handle both operations.

## Semantic Versioning

- **patch**: Bug fixes (`1.2.3` → `1.2.4`)
- **minor**: New features, backward-compatible (`1.2.3` → `1.3.0`)
- **major**: Breaking changes (`1.2.3` → `2.0.0`)

Use: `npm version [patch|minor|major]`
