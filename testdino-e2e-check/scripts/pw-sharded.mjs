// Runs the Playwright suite as 2 shards with one TESTDINO_CI_RUN_ID,
// so TestDino merges them into one run (TDV2-1087: sharded spec-card totals).
import { spawnSync } from 'node:child_process';

const total = Number(process.env.SHARDS ?? 2);
const ciRunId = process.env.TESTDINO_CI_RUN_ID ?? `tdv2-1087-shard-${Date.now()}`;
console.log(`TESTDINO_CI_RUN_ID=${ciRunId}, ${total} shards`);

let exitCode = 0;
for (let i = 1; i <= total; i++) {
  const r = spawnSync('npx', ['playwright', 'test', `--shard=${i}/${total}`], {
    stdio: 'inherit',
    env: { ...process.env, TESTDINO_CI_RUN_ID: ciRunId },
  });
  exitCode ||= r.status ?? 1;
}
process.exit(exitCode);
