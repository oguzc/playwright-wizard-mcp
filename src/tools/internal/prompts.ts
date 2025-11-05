import { Artifact, ToolResult } from '../types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export class InternalPrompts {
  constructor(private rootDir = process.cwd()) {}

  private async readPrompt(rel: string): Promise<string> {
    const tryPaths = [
      join(this.rootDir, rel),
      join(this.rootDir, '..', rel)
    ];
    for (const p of tryPaths) {
      try { return await readFile(p, 'utf-8'); } catch {}
    }
    throw new Error(`Prompt not found: ${rel}`);
  }

  async analyzeApp(): Promise<ToolResult> {
    const content = await this.readPrompt('.github/prompts/1-analyze-app.prompt.md');
    return { findings: ['loaded analyze-app prompt'], artifacts: [{ path: 'analysis/instructions.md', kind: 'note', content }] };
  }

  async generateTestPlan(): Promise<ToolResult> {
    const content = await this.readPrompt('.github/prompts/2-generate-test-plan.prompt.md');
    return { findings: ['loaded test-plan prompt'], artifacts: [{ path: 'analysis/test-plan-instructions.md', kind: 'note', content }] };
  }

  async setupInfrastructure(): Promise<ToolResult> {
    const content = await this.readPrompt('.github/prompts/3-setup-infrastructure.prompt.md');
    return { findings: ['loaded setup-infrastructure prompt'], artifacts: [{ path: 'setup/infra-instructions.md', kind: 'note', content }] };
  }

  async generatePageObjects(): Promise<ToolResult> {
    const content = await this.readPrompt('.github/prompts/4-generate-page-objects.prompt.md');
    return { findings: ['loaded page-objects prompt'], artifacts: [{ path: 'implementation/pom-instructions.md', kind: 'note', content }] };
  }

  async implementTestSuite(): Promise<ToolResult> {
    const content = await this.readPrompt('.github/prompts/5-implement-test-suite.prompt.md');
    return { findings: ['loaded implement-test-suite prompt'], artifacts: [{ path: 'implementation/test-suite-instructions.md', kind: 'note', content }] };
  }
}
