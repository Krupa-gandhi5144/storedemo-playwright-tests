// Playwright config for the TDV2-1087 "Changed on purpose" and "Unchanged" checks:
// a Playwright run must still show Playwright + version, the usual settings
// table, the trace viewer and its own Re-run sheet. Sharded runs
// (npm run pw:sharded) check that spec-card totals count every shard.
import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  testDir: './playwright',
  // fullyParallel lets one spec file's tests spread across shards.
  fullyParallel: true,
  retries: 1,
  workers: 3,
  timeout: 60_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: process.env.APP_URL ?? 'https://storedemo.testdino.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  reporter: [
    ['list'],
    [
      '@testdino/playwright',
      {
        token: process.env.TESTDINO_TOKEN,
        serverUrl: process.env.TESTDINO_SERVER_URL,
        tags: ['tdv2-1087', 'playwright'],
      },
    ],
  ],
});
