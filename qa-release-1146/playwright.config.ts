import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  retries: Number(process.env.RETRIES ?? 1),
  workers: 4,
  timeout: 15000,
  reporter: [['list']],
  projects: process.env.ONE_BROWSER ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }] : [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
