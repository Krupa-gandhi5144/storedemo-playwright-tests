// e2e visual suite for TDV2-1133 item 10 (chromium only).
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

export default {
  projectId: 'testdino-e2e-check',
  tests: 'visual/**/*.e2e.ts',
  output: '.e2e/visual',
  retries: 0,
  workers: 1,
  timeout: 60_000,
  trace: 'retain-on-failure',
  targets: [
    {
      name: 'chromium',
      engine: web({ viewport: { width: 1280, height: 720 } }),
      app: { url: process.env.APP_URL ?? 'https://storedemo.testdino.com' },
    },
  ],
  reporters: ['list', testdino({ tags: ['tdv2-1133', 'visual'] })],
} satisfies E2EConfig;
