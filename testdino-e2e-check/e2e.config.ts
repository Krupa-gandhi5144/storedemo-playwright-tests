// e2e (TesterArmy) config for TDV2-1087.
// Reports every run to TestDino through @testdino/e2e.
// Token and server come from .env (see .env.example) or the shell.
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

const appUrl = process.env.APP_URL ?? 'https://storedemo.testdino.com';

export default {
  projectId: 'testdino-e2e-check',
  tests: 'e2e/**/*.e2e.ts',

  // Ticket setup: retries 1, so a flaky test fails once and passes on retry.
  retries: 1,
  workers: 2,
  timeout: 60_000,
  assertionTimeout: 5_000,

  // Trace pages feed the TestDino "walkthrough" attachment (reporter 1.1.0).
  trace: 'retain-on-failure',
  video: 'retain-on-failure',

  // Two targets, so the Configuration tab's Targets table has two rows.
  // Both are desktop sizes: below ~1024 px storedemo hides the header menu
  // and cart icon, and every header test would fail on that target.
  targets: [
    { name: 'desktop', engine: web({ viewport: { width: 1280, height: 720 } }), app: { url: appUrl } },
    { name: 'desktop-wide', engine: web({ viewport: { width: 1920, height: 1080 } }), app: { url: appUrl } },
  ],

  reporters: ['list', testdino({ tags: ['tdv2-1087', 'e2e'] })],
} satisfies E2EConfig;
