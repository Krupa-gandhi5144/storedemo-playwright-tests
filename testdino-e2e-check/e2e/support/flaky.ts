// Makes a test fail on its first attempt and pass on the retry.
// e2e re-imports the test file for each retry, so state lives in a marker
// file under .e2e-state/. `npm run reset` (run by every npm e2e script)
// clears it before a run.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STATE_DIR = join(process.cwd(), '.e2e-state');

/** Returns true on the first attempt for this key, false on later ones. */
export function isFirstAttempt(key: string): boolean {
  mkdirSync(STATE_DIR, { recursive: true });
  const marker = join(STATE_DIR, `${key.replace(/[^a-z0-9-]/gi, '_')}.marker`);
  if (existsSync(marker)) return false;
  writeFileSync(marker, new Date().toISOString());
  return true;
}
