import { ToolResult } from '../../types';

export class EditFileAdapter {
  async write(input: { target?: string; targetDir?: string; content?: string }): Promise<ToolResult> {
    // Stub: integrate with your edit_file MCP tool here
    return { findings: ['edit_file.write invoked (stub)'] };
  }
}
