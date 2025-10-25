import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { strict as assert } from 'assert';
import { spawnSync } from 'child_process';
import { requireMcpCheck } from '../lib/precheck.js';

async function main() {
  const tmpDir = path.join(os.tmpdir(), 'pw-mcp-tests');
  await fs.ensureDir(tmpDir);

  function writeMode(obj, name = 'mode.json') {
    const p = path.join(tmpDir, `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
    fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
    return p;
  }

  console.log('Running precheck tests...');
  // Test 1: requires_mcp false
  const p1 = writeMode({ meta: { id: 'no-mcp', requires_mcp: false }, messages: [], output_schema: {} }, 'no-mcp.json');
  const r1 = await requireMcpCheck(p1, {});
  assert.equal(r1.ok, true);
  assert.equal(r1.reason, 'not_required');
  console.log('  ✓ requireMcpCheck returns ok for non-MCP mode');

  // Test 2: requires_mcp true but no url
  const p2 = writeMode({ meta: { id: 'needs-mcp', requires_mcp: true }, messages: [], output_schema: {} }, 'needs-mcp.json');
  const r2 = await requireMcpCheck(p2, {});
  assert.equal(r2.ok, false);
  assert.equal(r2.reason, 'no_mcp_url_configured');
  console.log('  ✓ requireMcpCheck fails when MCP required but no URL');

  // Orchestrator unsafe path test
  console.log('Running orchestrator unsafe-path test...');
  const unsafeMode = {
    meta: { id: 'unsafe-test', requires_mcp: false },
    messages: [],
    output_schema: {},
    examples: [ { input: 'x', output: { files: [ { path: '../outside.txt', content: 'should not write' } ] } } ]
  };
  const modePath = writeMode(unsafeMode, `mode-unsafe-${Date.now()}.json`);
  const orchestratorPath = path.join(process.cwd(), 'src', 'orchestrator.js');
  const res = spawnSync('node', [orchestratorPath, '--mode', modePath, '--mcp-url', 'https://example.com'], { encoding: 'utf8' });
  if (res.status === 0) {
    console.error('Orchestrator unexpectedly succeeded when it should have rejected unsafe path');
    process.exit(2);
  }
  const out = (res.stderr || '') + (res.stdout || '');
  if (!/Refusing to write unsafe path/.test(out)) {
    console.error('Orchestrator did not report unsafe path rejection:', out);
    process.exit(2);
  }
  console.log('  ✓ orchestrator refuses unsafe paths');

  // Test writing files into a staging directory with --apply
  console.log('Running orchestrator apply->staging test...');
  const stagingDir = path.join(tmpDir, `staging-${Date.now()}`);
  await fs.ensureDir(stagingDir);
  const applyMode = {
    meta: { id: 'apply-test', requires_mcp: false },
    messages: [],
    output_schema: {},
    examples: [ { input: 'x', output: { files: [ { path: 'generated/test.txt', content: 'hello from mode', encoding: 'utf8' } ] } } ]
  };
  const applyModePath = writeMode(applyMode, `mode-apply-${Date.now()}.json`);
  const resApply = spawnSync('node', [orchestratorPath, '--mode', applyModePath, '--mcp-url', 'https://example.com', '--apply', '--staging-dir', stagingDir], { encoding: 'utf8' });
  if (resApply.status !== 0) {
    console.error('Orchestrator apply failed:', resApply.stderr || resApply.stdout);
    process.exit(2);
  }
  const written = path.join(stagingDir, 'generated', 'test.txt');
  if (!await fs.pathExists(written)) {
    console.error('Expected file not written to staging dir:', written);
    process.exit(2);
  }
  const content = await fs.readFile(written, 'utf8');
  if (content.indexOf('hello from mode') === -1) {
    console.error('Written file content mismatch:', content);
    process.exit(2);
  }
  console.log('  ✓ orchestrator wrote files to staging dir with --apply');


  console.log('\nAll tests passed.');
}

main().catch(err => { console.error('Tests failed:', err); process.exit(2); });
