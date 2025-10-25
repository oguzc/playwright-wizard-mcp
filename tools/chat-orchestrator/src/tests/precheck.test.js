import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { requireMcpCheck } from '../lib/precheck.js';

const tmpDirRoot = path.join(os.tmpdir(), 'pw-mcp-tests');

async function writeMode(obj, name = 'mode.json') {
  await fs.mkdir(tmpDirRoot, { recursive: true });
  const p = path.join(tmpDirRoot, `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
  await fs.writeFile(p, JSON.stringify(obj, null, 2), 'utf8');
  return p;
}

test('requireMcpCheck: non-MCP mode returns ok', async () => {
  const p = await writeMode({ meta: { id: 'no-mcp', requires_mcp: false }, messages: [], output_schema: {} }, 'no-mcp.json');
  const res = await requireMcpCheck(p, {});
  assert.equal(res.ok, true);
  assert.equal(res.reason, 'not_required');
});

test('requireMcpCheck: requires_mcp true with no url returns no_mcp_url_configured', async () => {
  const p = await writeMode({ meta: { id: 'needs-mcp', requires_mcp: true }, messages: [], output_schema: {} }, 'needs-mcp.json');
  const res = await requireMcpCheck(p, {});
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'no_mcp_url_configured');
});
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { strict as assert } from 'assert';
import { requireMcpCheck } from '../lib/precheck.js';

const tmpDir = path.join(os.tmpdir(), 'pw-mcp-tests');
await fs.ensureDir(tmpDir);

function writeMode(obj, name = 'mode.json') {
  const p = path.join(tmpDir, `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
  return p;
}

test('requireMcpCheck returns ok for mode that does not require MCP', async () => {
  const p = writeMode({ meta: { id: 'no-mcp', requires_mcp: false }, messages: [], output_schema: {} }, 'no-mcp.json');
  const res = await requireMcpCheck(p, {});
  assert.equal(res.ok, true);
  assert.equal(res.reason, 'not_required');
});

test('requireMcpCheck returns no_mcp_url_configured when requires_mcp true and no url', async () => {
  const p = writeMode({ meta: { id: 'needs-mcp', requires_mcp: true }, messages: [], output_schema: {} }, 'needs-mcp.json');
  const res = await requireMcpCheck(p, {});
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'no_mcp_url_configured');
});
