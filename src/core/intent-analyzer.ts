import { Intent } from '../types';

const KEYWORDS: Record<Intent['mode'], string[]> = {
  setup: ['setup','configure','install','fixture','ci','workflow','config'],
  analysis: ['analyze','analysis','plan','strategy','coverage','pages','selectors'],
  implementation: ['generate','create','page object','tests','suite','assertions'],
  debug: ['fail','flaky','timeout','trace','log','error','selector not found']
};

export class IntentAnalyzer {
  analyze(message: string): Intent {
    const lower = message.toLowerCase();
    let bestMode: Intent['mode'] = 'analysis';
    let bestScore = 0;

    for (const [mode, words] of Object.entries(KEYWORDS) as [Intent['mode'], string[]][]) {
      const hits = words.filter(w => lower.includes(w)).length;
      if (hits > bestScore) {
        bestScore = hits;
        bestMode = mode;
      }
    }

    const entities = Array.from(new Set((lower.match(/[a-z0-9\-/]+/gi) || []).filter(w => w.length > 3))).slice(0, 10);

    return {
      mode: bestMode,
      task: message.trim(),
      confidence: Math.min(1, bestScore / 3),
      entities
    };
  }
}
