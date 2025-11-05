import { ToolResult } from '../../types';

export class PwDebugAdapter {
  async analyzeFailure(): Promise<ToolResult> {
    return { findings: ['pwDebug.analyzeFailure invoked (stub)'] };
  }
  async validateSelectors(): Promise<ToolResult> {
    return { findings: ['pwDebug.validateSelectors invoked (stub)'] };
  }
}
