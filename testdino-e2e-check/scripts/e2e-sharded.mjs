// Runs the e2e suite as N shards in parallel (like CI jobs) with one
// TESTDINO_CI_RUN_ID, so TestDino merges them into one run.
// TDV2-1087: counts and spec-card totals must cover every shard.
//   SHARDS=3 WORKERS=2 npm run e2e:sharded
// Each shard writes its own output dir so they don't overwrite each other.
import { spawn } from 'node:child_process';

const total = Number(process.env.SHARDS ?? 3);
const workers = process.env.WORKERS ?? '2';
const ciRunId = process.env.TESTDINO_CI_RUN_ID ?? `tdv2-1087-e2e-${Date.now()}`;
console.log(`e2e: ${total} shards x ${workers} workers, TESTDINO_CI_RUN_ID=${ciRunId}`);

const runs = Array.from({ length: total }, (_, i) =>
  new Promise((resolve) => {
    const child = spawn(
      'npx',
      ['e2e', 'run', '--shard', `${i + 1}/${total}`, '--workers', workers, '--output', `.e2e/shard-${i + 1}`],
      { stdio: 'inherit', env: { ...process.env, TESTDINO_CI_RUN_ID: ciRunId } },
    );
    child.on('close', (code) => resolve(code ?? 1));
  }),
);

const codes = await Promise.all(runs);
console.log(`shard exit codes: ${codes.join(', ')}`);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
