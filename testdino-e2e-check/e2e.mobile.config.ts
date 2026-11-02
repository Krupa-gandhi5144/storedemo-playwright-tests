// e2e (TesterArmy) config for TDV2-1087 — phone-size browsers.
// WebKit at iPhone size (Safari engine) and Chromium at Pixel size.
// This is browser emulation; real iOS/Android devices need @e2e-dev/mobile
// and simulators, which the ticket lists as out of scope.
//   npm run e2e:mobile
import { existsSync } from 'node:fs';
import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

const appUrl = process.env.APP_URL ?? 'https://storedemo.testdino.com';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PIXEL_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';

export default {
  projectId: 'testdino-e2e-check',
  tests: 'e2e-mobile/**/*.e2e.ts',
  output: '.e2e/mobile',
  retries: 1,
  workers: 2,
  timeout: 60_000,
  assertionTimeout: 5_000,
  trace: 'retain-on-failure',
  video: 'retain-on-failure',

  targets: [
    {
      name: 'mobile-safari',
      engine: web({ browser: 'webkit', viewport: { width: 390, height: 844 }, userAgent: IPHONE_UA }),
      app: { url: appUrl },
    },
    {
      name: 'mobile-chrome',
      engine: web({ browser: 'chromium', viewport: { width: 412, height: 915 }, userAgent: PIXEL_UA }),
      app: { url: appUrl },
    },
  ],

  reporters: ['list', testdino({ tags: ['tdv2-1087', 'e2e', 'mobile'] })],
} satisfies E2EConfig;
