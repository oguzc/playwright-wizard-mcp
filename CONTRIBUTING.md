# Contributing to Playwright Wizard MCP

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make your changes
4. Build and test:
   ```bash
   npm run build
   npm run dev
   ```

## Project Structure

```
playwright-wizard-mcp/
├── src/
│   └── index.ts           # Main MCP server implementation
├── .github/
│   ├── prompts/           # Core wizard prompts
│   │   ├── 1-analyze-app.md
│   │   ├── 2-generate-test-plan.md
│   │   ├── 3-setup-infrastructure.md
│   │   ├── 4-generate-page-objects.md
│   │   ├── 5-implement-test-suite.md
│   │   ├── 6-review-and-optimize.md
│   │   ├── optional-add-accessibility.md
│   │   ├── optional-add-api-testing.md
│   │   └── reference/      # Reference documentation
│   └── copilot-instructions.md
├── build/                 # Compiled TypeScript output
└── package.json
```

## Adding New Prompts

To add a new prompt:

1. Create a markdown file in `.github/prompts/`
2. Add the prompt to the `PROMPTS` or `REFERENCES` mapping in `src/index.ts`
3. Update the README with the new prompt
4. Test that it loads correctly

## Code Style

- TypeScript with strict mode enabled
- Use async/await for asynchronous operations
- Follow existing code patterns
- Add JSDoc comments for public APIs

## Testing

Before submitting a PR:

1. Ensure `npm run build` succeeds without errors
2. Test the server with `npm run dev`
3. Verify prompts load correctly in an MCP client

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Update documentation as needed
4. Submit a PR with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
