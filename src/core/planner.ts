import { Plan, PlanStep, Intent } from '../types';

export class Planner {
  buildPlan(intent: Intent): Plan {
    const steps: PlanStep[] = [];

    if (intent.mode === 'setup') {
      steps.push(
        { tool: 'adapters.context7.scanProject', description: 'Analyze project structure and tech stack' },
        { tool: 'internal.prompts.setupInfrastructure', description: 'Generate infra scaffolding based on best practices' },
        { tool: 'adapters.editFile.write', input: { target: 'playwright.config.ts' }, description: 'Write/update Playwright config' }
      );
    }

    if (intent.mode === 'analysis') {
      steps.push(
        { tool: 'adapters.context7.scanProject', description: 'Scan repository for routes/components' },
        { tool: 'internal.prompts.analyzeApp', description: 'Produce analysis artifacts (project-config.md, pages.md, selector-strategy.md)' },
        { tool: 'internal.prompts.generateTestPlan', description: 'Create test plan with flows and edge cases' }
      );
    }

    if (intent.mode === 'implementation') {
      steps.push(
        { tool: 'adapters.context7.scanProject', description: 'Confirm targets for page objects' },
        { tool: 'internal.prompts.generatePageObjects', description: 'Generate POMs with robust selectors' },
        { tool: 'internal.prompts.implementTestSuite', description: 'Create smoke/regression tests using POMs' },
        { tool: 'adapters.editFile.write', input: { targetDir: 'tests/' }, description: 'Persist generated tests' }
      );
    }

    if (intent.mode === 'debug') {
      steps.push(
        { tool: 'adapters.pwDebug.analyzeFailure', description: 'Analyze traces/logs for root cause' },
        { tool: 'adapters.pwDebug.validateSelectors', description: 'Find flaky or brittle selectors' }
      );
    }

    return { mode: intent.mode, steps };
  }
}
