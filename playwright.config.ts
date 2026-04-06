// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__', // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
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
  //   ['blob', { outputDir: 'blob-report' }],
  //   ['json', { outputFile: './playwright-report/report.json' }],
  //   ['@testdino/playwright', {
  //     token: process.env.TESTDINO_TOKEN,
  //     debug: true,
  //     serverUrl: 'https://stg-api.testdino.com',
  //   }],
  // ],

  reporter: [
  ['html', {
    outputFolder: 'playwright-report',
    open: 'never'
  }],
  ['json', { outputFile: './playwright-report/report.json' }],
  ['@testdino/playwright', {
    token: 'trx_production_ce76d772fa4d80509ed5dbb3386723e797902e5f6048c2f5955a20cb2a7cb17',
    // Remove serverUrl if you're on production, not staging
    // serverUrl: 'https://stg-api.testdino.com',  ← This points to STAGING, not production!
  }],
],

  use: {
    baseURL: 'https://storedemo.testdino.com/',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Run all test cases (Homepage, Login, Cart, Checkout, Navigation, Search, Payment, User Profile, Order History, Product Listing) on each browser
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});