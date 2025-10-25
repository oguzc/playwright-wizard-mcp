import fs from 'fs-extra';
import path from 'path';

async function resolveModePath(provided) {
  if (provided) return path.resolve(process.cwd(), provided);
  return path.resolve(process.cwd(), '..', '..', '.github', 'chat-modes', '01-analyze-app.json');
}

async function probeUrl(url, timeoutMs = 3000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function requireMcpCheck(modePath, options = {}) {
  const resolved = await resolveModePath(modePath);
  if (!await fs.pathExists(resolved)) {
    throw new Error(`Mode file not found: ${resolved}`);
  }
  const raw = await fs.readFile(resolved, 'utf8');
  let mode;
  try { mode = JSON.parse(raw); } catch (e) { throw new Error('Invalid JSON in mode file: ' + e.message); }

  const requiresMcp = mode?.meta?.requires_mcp;
  if (!requiresMcp) return { ok: true, reason: 'not_required' };

  const envUrl = process.env.MCP_SERVER_URL || process.env.MCP_HEALTH_URL || process.env.MCP_URL;
  const probeUrlCandidate = options.mcpUrl || envUrl;
  if (!probeUrlCandidate) return { ok: false, reason: 'no_mcp_url_configured' };

  const ok = await probeUrl(probeUrlCandidate, options.timeoutMs || 3000);
  return { ok, reason: ok ? 'reachable' : 'unreachable', probeUrl: probeUrlCandidate };
}

export default {
  requireMcpCheck
};
