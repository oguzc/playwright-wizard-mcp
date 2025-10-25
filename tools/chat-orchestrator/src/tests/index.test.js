// Test index - imports individual test modules so Node's test runner loads them properly
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { strict as assert } from 'assert';
import { spawnSync } from 'child_process';
import { requireMcpCheck } from '../lib/precheck.js';

// Setup tmp dir
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

// Orchestrator file safety test
test('orchestrator refuses unsafe paths', () => {
	const unsafeMode = {
		meta: { id: 'unsafe-test', requires_mcp: false },
		messages: [],
		output_schema: {},
		examples: [ { input: 'x', output: { files: [ { path: '../outside.txt', content: 'should not write' } ] } } ]
	};
	const modePath = writeMode(unsafeMode, `mode-unsafe-${Date.now()}.json`);
	const orchestrator = path.join(process.cwd(), 'src', 'orchestrator.js');
	const res = spawnSync('node', [orchestrator, '--mode', modePath, '--mcp-url', 'https://example.com'], { encoding: 'utf8' });
	assert.notEqual(res.status, 0);
	const out = (res.stderr || '') + (res.stdout || '');
	assert.match(out, /Refusing to write unsafe path/);
});
