// TDV2-1095: e2e failures that are setup problems (not product bugs) must show
// as "Setup issue". This suite produces each e2e setup code plus controls.
//   npm run e2e:setup
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

export default {
  projectId: 'testdino-e2e-check',
  tests: 'setup-issues/**/*.e2e.ts',
  output: '.e2e/setup',
  retries: 0,
  workers: 2,
  timeout: 30_000,
  assertionTimeout: 3_000,
  targets: [
    {
      name: 'chromium',
      engine: web({ viewport: { width: 1280, height: 720 } }),
      app: { url: process.env.APP_URL ?? 'https://storedemo.testdino.com' },
    },
  ],
  reporters: ['list', testdino({ tags: ['tdv2-1095', 'setup-issues'] })],
} satisfies E2EConfig;
