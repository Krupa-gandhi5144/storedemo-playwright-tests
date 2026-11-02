// Clears the flaky-test markers so the next run starts fresh:
// each flaky test fails its first attempt and passes on retry.
// Only touches .e2e-state/ inside this project.
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../.e2e-state', import.meta.url));
rmSync(dir, { recursive: true, force: true });
console.log('reset: cleared .e2e-state');
