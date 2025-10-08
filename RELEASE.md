# Release Process

This document outlines the automated publishing process for NPM and MCP Registry.

## Setup (Already Configured) ✅

- **NPM Token**: Already configured as `NPM_TOKEN` secret
- **GitHub OIDC**: Already configured in workflow permissions

## Publishing a New Version

1. **Create a GitHub Release**:
   - Go to GitHub repo → Releases → Create new release
   - Create new tag (e.g., `v0.1.2`)
   - Add release notes
   - Publish release

   Or via command line:
   ```bash
   git tag v0.1.2
   git push origin v0.1.2
   # Then create release on GitHub
   ```

2. **Automated process** (via GitHub Actions):
   - ✅ Builds the package
   - ✅ Publishes to NPM
   - ✅ Updates server.json version automatically
   - ✅ Publishes to MCP Registry

## Manual Testing (Optional)

To manually test publishing without actually publishing:

```bash
# Install MCP publisher
curl -L "https://github.com/modelcontextprotocol/registry/releases/download/latest/mcp-publisher_windows_amd64.tar.gz" -o mcp-publisher.tar.gz
tar xf mcp-publisher.tar.gz

# Login (requires GitHub authentication)
./mcp-publisher login github

# Validate server.json
./mcp-publisher validate
```

## Verification

After publishing, verify your server appears in the registry:
```bash
curl "https://registry.modelcontextprotocol.io/v0/servers?search=playwright-wizard-mcp"
```