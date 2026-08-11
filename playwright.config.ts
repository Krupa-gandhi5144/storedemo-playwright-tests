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
  //     // token: 'td_api_7e43cca7cc0ffd72089a2bcfd90b91c04aa4f243206a027a60d387d2a27b7859',
  //      token: 'td_api_7e43cca7cc0ffd72089a2bcfd90b91c04aa4f243206a027a60d387d2a27b7859',
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
      serverUrl: 'https://stg-analytics.testdino.com',
      token: 'td_api_c9390ccc9d856cd6a0fe260b07f813a69f80efe33bd10498c5939fd3b04e7c45',
      // serverUrl: 'https://analytics.testdino.com',
      // token: 'td_api_bf842ba824c0b2e12e847db221722a53cfe57218d75ccda4b500107c9713fbd8',
      // token: 'td_api_41adb680ddaf63ab53d633c9bd3be03d621483237de4aeba57a2b5ea9b3a6c5d',
      debug: false,
      ciRunId: "Adasd",
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
