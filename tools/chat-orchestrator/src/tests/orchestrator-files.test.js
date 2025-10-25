import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';

const tmpDirRoot = path.join(os.tmpdir(), 'pw-mcp-tests');

async function writeMode(obj, name = 'mode.json') {
  await fs.mkdir(tmpDirRoot, { recursive: true });
  const p = path.join(tmpDirRoot, `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
  await fs.writeFile(p, JSON.stringify(obj, null, 2), 'utf8');
  return p;
}

test('orchestrator refuses unsafe paths', async () => {
  const unsafeMode = {
    meta: { id: 'unsafe-test', requires_mcp: false },
    messages: [],
    output_schema: {},
    examples: [ { input: 'x', output: { files: [ { path: '../outside.txt', content: 'should not write' } ] } } ]
  };
  const modePath = await writeMode(unsafeMode, `mode-unsafe-${Date.now()}.json`);
  const orchestratorPath = path.join(process.cwd(), 'src', 'orchestrator.js');
  const res = spawnSync('node', [orchestratorPath, '--mode', modePath, '--mcp-url', 'https://example.com'], { encoding: 'utf8' });
  assert.notEqual(res.status, 0);
  const out = (res.stderr || '') + (res.stdout || '');
  assert.match(out, /Refusing to write unsafe path/);
});

test('orchestrator writes files to staging dir with --apply', async () => {
  const stagingDir = path.join(tmpDirRoot, `staging-${Date.now()}`);
  await fs.mkdir(stagingDir, { recursive: true });
  const applyMode = {
    meta: { id: 'apply-test', requires_mcp: false },
    messages: [],
    output_schema: {},
    examples: [ { input: 'x', output: { files: [ { path: 'generated/test.txt', content: 'hello from mode', encoding: 'utf8' } ] } } ]
  };
  const applyModePath = await writeMode(applyMode, `mode-apply-${Date.now()}.json`);
  const orchestratorPath = path.join(process.cwd(), 'src', 'orchestrator.js');
  const resApply = spawnSync('node', [orchestratorPath, '--mode', applyModePath, '--mcp-url', 'https://example.com', '--apply', '--staging-dir', stagingDir], { encoding: 'utf8' });
  if (resApply.status !== 0) {
    throw new Error('Orchestrator apply failed: ' + (resApply.stderr || resApply.stdout));
  }
  const written = path.join(stagingDir, 'generated', 'test.txt');
  if (!fsSync.existsSync(written)) throw new Error('Expected file not written to staging dir: ' + written);
  const content = await fs.readFile(written, 'utf8');
  assert.ok(content.includes('hello from mode'));
});
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { strict as assert } from 'assert';

// Create a temporary mode file that tries to write an unsafe path
const tmpDir = path.join(os.tmpdir(), 'pw-mcp-tests');
await fs.ensureDir(tmpDir);

const unsafeMode = {
  meta: { id: 'unsafe-test', requires_mcp: false },
  messages: [],
  output_schema: {},
  examples: [ { input: 'x', output: { files: [ { path: '../outside.txt', content: 'should not write' } ] } } ]
};

const modePath = path.join(tmpDir, `mode-unsafe-${Date.now()}.json`);
fs.writeFileSync(modePath, JSON.stringify(unsafeMode, null, 2), 'utf8');

test('orchestrator refuses unsafe paths', () => {
  const orchestrator = path.join(process.cwd(), 'src', 'orchestrator.js');
  const res = spawnSync('node', [orchestrator, '--mode', modePath, '--mcp-url', 'https://example.com'], { encoding: 'utf8' });
  // exit code should be non-zero
  assert.notEqual(res.status, 0);
  assert.match(res.stderr + res.stdout, /Refusing to write unsafe path/);
});
