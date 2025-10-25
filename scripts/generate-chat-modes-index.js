#!/usr/bin/env node
import { promises as fs } from 'fs';
import { join } from 'path';

async function main() {
  const repo = process.cwd();
  const dir = join(repo, '.github', 'chat-modes');
  const outPath = join(repo, 'build', 'chat-modes-index.json');
  const result = [];
  try {
    await fs.access(dir);
  } catch (e) {
    console.error('No chat-modes dir found at', dir);
    await fs.mkdir(join(repo, 'build'), { recursive: true }).catch(() => { });
    await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('Wrote empty index to', outPath);
    return;
  }
  const files = await fs.readdir(dir);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    try {
      const full = join(dir, f);
      const raw = await fs.readFile(full, 'utf8');
      const mode = JSON.parse(raw);
      const id = mode?.meta?.id || f.replace(/\.json$/, '');
      result.push({ id, path: full, meta: mode.meta || null });
      // Also generate a human-readable markdown prompt for UIs
      try {
        const promptsDir = join(repo, 'build', 'prompts');
        await fs.mkdir(promptsDir, { recursive: true }).catch(() => {});
        const mdPath = join(promptsDir, `${id}.md`);
        const lines = [];
        lines.push(`# ${mode.meta?.title || id}`);
        if (mode.meta?.description) lines.push(`\n${mode.meta.description}\n`);
        if (Array.isArray(mode.messages)) {
          lines.push('\n---\n');
          for (const msg of mode.messages) {
            const role = msg.role || 'message';
            const content = (typeof msg.content === 'string') ? msg.content : JSON.stringify(msg.content, null, 2);
            lines.push(`**${role.toUpperCase()}**:\n\n${content}\n`);
          }
        }
        if (mode.output_schema) {
          lines.push('\n---\n');
          lines.push('## Output schema');
          lines.push('```json');
          lines.push(JSON.stringify(mode.output_schema, null, 2));
          lines.push('```');
        }
        await fs.writeFile(mdPath, lines.join('\n'), 'utf8');
      } catch (e) {
        console.error('Failed to write prompt markdown for', id, e?.message || String(e));
      }
    } catch (e) {
      console.error('Skipping invalid mode file', f, e?.message || String(e));
    }
  }
  await fs.mkdir(join(repo, 'build'), { recursive: true }).catch(() => { });
  await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('Wrote', outPath, 'with', result.length, 'modes');
}

main().catch(err => { console.error(err); process.exit(2); });
