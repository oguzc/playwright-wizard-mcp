import { ChatMode } from '../types';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ROOT_DIR = '.playwright-wizard';
const STATE_PATH = join(ROOT_DIR, 'session-state.json');

interface SessionState {
  currentMode: ChatMode;
  lastUpdated: string;
}

export class ModeManager {
  private state: SessionState | null = null;

  constructor(private fsRoot: string = process.cwd()) {}

  private async ensureRoot() {
    await mkdir(join(this.fsRoot, ROOT_DIR), { recursive: true });
  }

  async load(): Promise<void> {
    await this.ensureRoot();
    try {
      const raw = await readFile(join(this.fsRoot, STATE_PATH), 'utf-8');
      this.state = JSON.parse(raw);
    } catch {
      this.state = { currentMode: 'analysis', lastUpdated: new Date().toISOString() };
      await this.save();
    }
  }

  async save(): Promise<void> {
    await this.ensureRoot();
    const payload = JSON.stringify(this.state, null, 2);
    await writeFile(join(this.fsRoot, STATE_PATH), payload, 'utf-8');
  }

  getCurrentMode(): ChatMode {
    if (!this.state) throw new Error('ModeManager not loaded');
    return this.state.currentMode;
  }

  async switchMode(next: ChatMode): Promise<void> {
    if (!this.state) await this.load();
    this.state = { currentMode: next, lastUpdated: new Date().toISOString() };
    await this.save();
  }
}
