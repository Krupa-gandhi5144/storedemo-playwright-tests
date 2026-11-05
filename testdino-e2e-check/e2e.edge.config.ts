// e2e edge-case suite for TDV2-1087 (chromium only): timeouts, unicode and
// long titles, HTML in errors, serial groups, runtime skips, plain errors.
//   npm run e2e:edge
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

export default {
  projectId: 'testdino-e2e-check',
  tests: 'edge/**/*.e2e.ts',
  output: '.e2e/edge',
  retries: 1,
  workers: 2,
  timeout: 60_000,
  assertionTimeout: 3_000,
  trace: 'retain-on-failure',
  targets: [
    {
      name: 'chromium',
      engine: web({ viewport: { width: 1280, height: 720 } }),
      app: { url: process.env.APP_URL ?? 'https://storedemo.testdino.com' },
    },
  ],
  reporters: ['list', testdino({ tags: ['tdv2-1087', 'e2e', 'edge'] })],
} satisfies E2EConfig;
