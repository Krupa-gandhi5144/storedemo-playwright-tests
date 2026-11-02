// e2e (TesterArmy) config for TDV2-1087 — desktop browsers.
// Reports every run to TestDino through @testdino/e2e.
// Token and server come from .env (see .env.example) or the shell.
//
// Env toggles for edge/negative runs:
//   E2E_TRACE=on         keep a trace page for every test (default: retain-on-failure)
//   TD_ARTIFACTS=false   reporter keeps screenshots/videos/traces local
//   TD_TAGS=a,b          run-level tags (default: tdv2-1087,e2e)
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

const appUrl = process.env.APP_URL ?? 'https://storedemo.testdino.com';
const viewport = { width: 1280, height: 720 };
const trace = process.env.E2E_TRACE === 'on' ? 'on' : 'retain-on-failure';

export default {
  projectId: 'testdino-e2e-check',
  tests: 'e2e/**/*.e2e.ts',

  // Ticket setup: retries 1, so a flaky test fails once and passes on retry.
  retries: 1,
  workers: 2,
  timeout: 60_000,
  assertionTimeout: 5_000,

  // Trace pages feed the TestDino "walkthrough" attachment (reporter 1.1.0).
  trace,
  video: 'retain-on-failure',

  // One target per browser engine, all desktop size (storedemo hides the
  // header menu below ~1024 px; phones are in e2e.mobile.config.ts).
  // Run one with --target, for example: npx e2e run --target webkit
  targets: [
    { name: 'chromium', engine: web({ browser: 'chromium', viewport }), app: { url: appUrl } },
    { name: 'firefox', engine: web({ browser: 'firefox', viewport }), app: { url: appUrl } },
    { name: 'webkit', engine: web({ browser: 'webkit', viewport }), app: { url: appUrl } },
  ],

  reporters: [
    'list',
    testdino({
      tags: (process.env.TD_TAGS ?? 'tdv2-1087,e2e').split(',').filter(Boolean),
      ...(process.env.TD_ARTIFACTS === 'false' ? { artifacts: false } : {}),
    }),
  ],
} satisfies E2EConfig;
