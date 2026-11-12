import { test, expect } from '@playwright/test';
const env = (k: string) => (process.env[k] || '').split(',').filter(Boolean);
// FAIL=keys to fail; FLAKY=keys failing on first try only; FAIL_FF=keys failing on firefox only; SKIPALL=1
export function step(key: string) {
  return async ({ page }, testInfo) => {
    if (process.env.SKIPALL) test.skip(true, 'skip all');
    await test.step('open page', async () => { await page.setContent(`<h1>${key}</h1>`); });
    await test.step('check result', async () => {
      if (env('HANG').includes(key)) await new Promise(r => setTimeout(r, 60000));
      if (env('FAIL').includes(key)) expect(key, `${key} broke`).toBe('working');
      if (env('FAIL_FF').includes(key) && testInfo.project.name === 'firefox') expect(key, `${key} broke on firefox`).toBe('working');
      if (env('FLAKY').includes(key) && testInfo.retry === 0) expect(key, `${key} flaky`).toBe('stable');
      await expect(page.locator('h1')).toHaveText(key);
    });
  };
}
