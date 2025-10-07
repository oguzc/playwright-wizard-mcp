# 📁 Documentation Structure

## For Users (Published to npm)
- **README.md** - Main documentation with installation and usage
- **QUICKSTART.md** - Quick start guide for new users  
- **CHANGELOG.md** - Version history
- **LICENSE** - MIT license

## For Maintainers (Not published, in repo only)
- **PUBLISHING.md** - How to publish updates
- **TESTING.md** - Testing guide
- **CONTRIBUTING.md** - Contribution guidelines
- **CHECKLIST.md** - Pre-publish checklist

## Configuration Files
- **package.json** - npm package config
- **mcp.json** - MCP server metadata
- **tsconfig.json** - TypeScript config
- **.npmignore** - What to exclude from npm package
- **.gitignore** - What to exclude from git

## Structure
```
playwright-wizard-mcp/
├── .github/
│   ├── prompts/              # ✅ Published to npm
│   │   ├── 1-analyze-app.md
│   │   ├── 2-generate-test-plan.md
│   │   ├── ... (6 core + 2 optional)
│   │   └── reference/        # ✅ Published to npm
│   ├── workflows/            # ❌ Not published
│   └── copilot-instructions.md # ❌ Not published
├── build/                    # ✅ Published to npm
├── src/                      # ❌ Not published (source only)
├── examples/                 # ❌ Not published
├── README.md                 # ✅ Published
├── QUICKSTART.md             # ✅ Published
├── CHANGELOG.md              # ✅ Published
├── LICENSE                   # ✅ Published
└── ... (other docs)          # ❌ Not published
```

## Clean Structure ✨

Your package is now clean with only essential files! 

**Published to npm:**
- Server code (`build/`)
- All prompts (`.github/prompts/`)
- User documentation (README, QUICKSTART, CHANGELOG)
- License

**Kept in repo only:**
- Source code (`src/`)
- Developer docs (TESTING, PUBLISHING, etc.)
- Examples
- CI/CD workflows
