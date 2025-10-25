#!/usr/bin/env node
import { promises as fs } from 'fs';
import { join } from 'path';

async function main() {
  const repo = process.cwd();
  const src = join(repo, '.github', 'chat-modes');
  const dest = join(repo, 'build', 'modes');
  try {
    await fs.access(src);
  } catch (e) {
    console.error('No source chat-modes dir at', src);
    return;
  }
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const s = join(src, f);
    const d = join(dest, f);
    await fs.copyFile(s, d);
    console.error('Copied', s, '->', d);
  }
  console.log('Copied chat-modes to', dest);
}

main().catch(err => { console.error(err); process.exit(2); });
