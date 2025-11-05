import { ToolResult } from '../../types';

export class Context7Adapter {
  async scanProject(): Promise<ToolResult> {
    // Stub: integrate with context7 scanning here
    return { findings: ['context7.scanProject invoked (stub)'] };
  }
}
