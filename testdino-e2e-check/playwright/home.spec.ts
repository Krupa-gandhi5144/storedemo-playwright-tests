// Playwright twin of e2e/home.e2e.ts: 4 passed, 1 failed, 1 flaky, 1 skipped.
// 7 tests in one file, so a 2-shard run splits this file across shards.
import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page shows the header', async ({ page }) => {
    await expect(page.getByTestId('header-logo')).toBeVisible();
    await expect(page.getByTestId('header-cart-icon')).toBeVisible();
  });

  test('header menu lists the main pages', async ({ page }) => {
    await expect(page.getByTestId('header-menu-home')).toHaveText('Home');
    await expect(page.getByTestId('header-menu-about-us')).toHaveText('About Us');
    await expect(page.getByTestId('header-menu-contact-us')).toHaveText('Contact Us');
    await expect(page.getByTestId('header-menu-all-products')).toHaveText('All Products');
  });

  test('all products page opens from the menu', async ({ page }) => {
    await page.getByTestId('header-menu-all-products').click();
    await expect(page.getByTestId('header-logo')).toBeVisible();
  });

  test('logo is shown after reload', async ({ page }) => {
    await page.reload();
    await expect(page.getByTestId('header-logo')).toBeVisible();
  });

  // FAILS BY DESIGN: trace on retry must open in the Playwright trace viewer.
  test('place order button is shown on the home page (fails by design)', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Place order' })).toBeVisible();
  });

  // FLAKY BY DESIGN: fails on the first attempt, passes on the retry.
  test('cart icon is shown (flaky by design)', async ({ page }, testInfo) => {
    expect(testInfo.retry, 'first attempt fails on purpose').toBeGreaterThan(0);
    await expect(page.getByTestId('header-cart-icon')).toBeVisible();
  });

  // SKIPPED BY DESIGN.
  test.skip('wishlist can be exported as PDF (skipped by design)', async () => {});
});
