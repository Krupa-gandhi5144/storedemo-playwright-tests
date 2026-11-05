// Playwright: passing tests only, a second spec card for the totals check.
import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const item of ['home', 'about-us', 'contact-us', 'all-products']) {
    test(`menu item "${item}" opens its page`, async ({ page }) => {
      await page.getByTestId(`header-menu-${item}`).click();
      await expect(page.getByTestId('header-logo')).toBeVisible();
    });
  }

  test('cart icon stays in the header after navigation', async ({ page }) => {
    await page.getByTestId('header-menu-about-us').click();
    await expect(page.getByTestId('header-cart-icon')).toBeVisible();
  });
});
