// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__',  // ✅ Baseline image storage
  fullyParallel: true,
  // forbidOnly: isCI,
  retries: isCI ? 1 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 5 : 5,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  // reporter: [
  //   ['html', {
  //     outputFolder: 'playwright-report',
  //     open: 'never'
  //   }],
  //   ['blob', { outputDir: 'blob-report' }], // Blob reporter for merging
  //   ['json', { outputFile: './playwright-report/report.json' }],
  //   // ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
  // ],
  
    // Add this in playwright.config.js|ts|mjs
  // reporter: [
  //   ['html', { outputDir: './playwright-report' }],
  //   ['json', { outputFile: './playwright-report/report.json' }],
  // ],

  // reporter: [
  //   ['@testdino/playwright', {
  //     serverUrl: 'https://stg-analytics.testdino.com',
  //     // token: 'td_api_e7927f225b69bc5cf522bd3c3b6395e48d73fc2e10a3bd970fbae426943f47d7',
  //      token: 'td_api_ad3e91d4c6e78c6a4ca4010e42086b969dc0bb8e0a20eac52ca4b89fe4fc49af',
  //     // ciRunId,
  //     debug: false,
  //     artifacts: false
  //   }]
  // ],

  reporter: [
  [
    '@testdino/playwright',
    {
      serverUrl: 'https://reporter.testdino.com',
      // token: 'td_api_90e86a4418409d2f65622b2dfce15fef90160076d0e9292c1718c20fc886a21e'
      token: 'td_api_71e49d719e0eee2a5ad8e66f34884331fde6e45ced5cc3bee7fed9f532ac299a',
      debug: true,
      artifacts: true,
    },
  ],
  ['html', { outputFolder: './playwright-report', open: 'never' }],
  ['json', { outputFile: 'report.json' }],
],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   grep: /@webkit/, // only run tests tagged @webkit
    // },
    {
      name: 'android',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'ios',
      use: { ...devices['iPhone 12'] },
    },

    {
      name: 'api',
      use: { ...devices['API'] },
    },
  ],
});
