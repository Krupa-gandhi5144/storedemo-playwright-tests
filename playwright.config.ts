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
  //     // ciRunId,
  //     debug: false,
  //     artifacts: false
  //   }]
  // ],

  reporter: [
  ['blob', { outputDir: 'blob-report' }],
  [
    '@testdino/playwright',
    {
      serverUrl: 'https://stg-reporter.testdino.com',
      token: 'td_api_799e19d51ed439c03fbf8c656d08b1101e2725822c6ef0293709a619b151e3dc',
      // serverUrl: 'https://analytics.testdino.com',
      debug: false,
      // ciRunId: process.env.TESTDINO_CI_RUN_ID, // Use environment variable if needed
      artifacts: false,
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
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   grep: /@webkit/, // only run tests tagged @webkit
    //  },
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
     {
      // Opt-in via QUOTA_BURN_COUNT — without it the suite is one skipped (free) case.
      // No browser / traces: instant passes only; each still bills one execution.
      // workers:2 — keep reporter flush rate under Kafka max message size.
      name: 'quota-burn',
      use: {
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
      workers: 2,
      grep: /@quota-burn/,
    },
  ],
});
