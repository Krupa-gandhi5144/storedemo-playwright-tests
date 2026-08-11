// @ts-check
// Import from @playwright/test — NOT ./support/test.js. The TestDino coverage
// fixture is auto and depends on `page`, which forces a browser launch per case.
import { expect, test } from '@playwright/test';

/**
 * Quota-burn suite for billing limit / usage-alert verification.
 *
 * Billable unit = passed + failed + flaky (skipped/interrupted are free).
 * Each case here is an instant pass → 1 execution against the project meter.
 *
 * Opt-in only — unset QUOTA_BURN_COUNT registers a single skipped placeholder so
 * weekday CI / accidental full-suite runs do not consume quota.
 *
 * Prefer `npm run test:quota-burn` (scripts/quota-burn.sh): it chunks large
 * totals into ≤250-case Playwright runs. One process with thousands of instant
 * cases overflows Kafka max message size; HTTP fallback then fails on host with
 * ENOTFOUND for docker DNS `ingestion-service`.
 *
 *   QUOTA_BURN_COUNT=20 npm run test:quota-burn
 *   QUOTA_BURN_COUNT=5000 npm run test:quota-burn
 *
 * Do not enable retries — retries can turn fails into flaky and muddy the burn.
 */

/** Per Playwright process — keep under reporter buffer / Kafka produce limits. */
const MAX_BURN_PER_RUN = 250;

/**
 * @param {string | undefined} raw
 * @returns {number}
 */
function parseBurnCount(raw) {
  if (raw === undefined || raw === '') return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(Math.floor(n), MAX_BURN_PER_RUN);
}

const burnCount = parseBurnCount(process.env.QUOTA_BURN_COUNT);

const annotate = (i, total) => ({
  annotation: [
    { type: 'testdino:priority', description: 'p2' },
    { type: 'testdino:feature', description: 'Quota Burn' },
    { type: 'testdino:owner', description: 'qa-team' },
    {
      type: 'testdino:context',
      description: `Instant pass ${i}/${total} — burns one billable execution for limit/alert testing`,
    },
  ],
});

test.describe('Quota Burn Suite', { tag: '@quota-burn' }, () => {
  // Global config enables retries for flaky demos; this suite must never retry.
  test.describe.configure({ retries: 0, timeout: 5_000 });

  if (burnCount < 1) {
    test('disabled — set QUOTA_BURN_COUNT to burn executions', () => {
      test.skip(
        true,
        'Set QUOTA_BURN_COUNT (e.g. QUOTA_BURN_COUNT=20) via npm run test:quota-burn; skipped tests do not bill',
      );
    });
    return;
  }

  for (let i = 1; i <= burnCount; i++) {
    test(`Quota burn ${i}/${burnCount}: instant pass`, annotate(i, burnCount), async () => {
      expect(true).toBe(true);
    });
  }
});