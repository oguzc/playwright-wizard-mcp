export type ChatMode = 'setup' | 'analysis' | 'implementation' | 'debug';

export interface Intent {
  mode: ChatMode;
  task: string;
  confidence: number; // 0..1
  entities?: string[];
}

export interface PlanStep {
  tool: string; // registry key, e.g. "adapters.context7.scanProject"
  input?: Record<string, unknown>;
  description?: string;
}

export interface Plan {
  mode: ChatMode;
  steps: PlanStep[];
}

export interface Artifact {
  path: string;
  kind: 'file' | 'note' | 'report';
  content: string;
}

export interface ToolResult {
  artifacts?: Artifact[];
  findings?: string[];
  nextHints?: string[];
}
