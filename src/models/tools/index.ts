import { MCPTool } from "../types.js";
import { analyzeAppTool } from "./analyzer.js";
import { generateTestPlanTool } from "./planner.js";
import {
  setupInfrastructureTool,
  generatePageObjectsTool,
  implementTestSuiteTool,
} from "./generator.js";
import { corePrinciplesTool, selectorStrategiesTool } from "./reference.js";

export const workflowTools: MCPTool[] = [
  analyzeAppTool,
  generateTestPlanTool,
  setupInfrastructureTool,
  generatePageObjectsTool,
  implementTestSuiteTool,
];

export const referenceTools: MCPTool[] = [
  corePrinciplesTool,
  selectorStrategiesTool,
];

export const allTools: MCPTool[] = [...workflowTools, ...referenceTools];
