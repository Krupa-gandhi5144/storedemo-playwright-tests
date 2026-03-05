import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000;
}

test.describe('Shard 03 - Store Demo Tests', () => {
  for (let i = 1; i <= 10; i++) {
    test(`Shard-03 Test ${i}: Visit store demo`, async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
