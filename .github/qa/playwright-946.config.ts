import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', fullyParallel: true, workers: 1, retries: 1, timeout: 5000,
  reporter: [['list'], ['@testdino/playwright', {token:process.env.TESTDINO_TOKEN,serverUrl:'https://stg-reporter.testdino.com',artifacts:false}]],
  projects: [{name:'chromium'}],
});
