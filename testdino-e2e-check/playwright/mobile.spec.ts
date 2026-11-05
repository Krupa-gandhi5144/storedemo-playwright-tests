// Playwright phone projects only (mobile-safari = iPhone 13, mobile-chrome = Pixel 7).
// 5 passed + 1 failed by design per project.
import { test, expect } from '@playwright/test';

test.describe('mobile home', () => {
  test('logo and menu icon are shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('header-logo')).toBeVisible();
    await expect(page.getByTestId('header-menu-icon')).toBeVisible();
  });

  test('hero shows the title and Shop Now', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-title')).toBeVisible();
    await expect(page.getByTestId('hero-shop-now')).toBeVisible();
  });

  test('product categories are listed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('category-title-camera')).toBeVisible();
  });

  test('products page opens by URL', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('desktop menu is hidden on a phone', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('header-menu-all-products')).toBeHidden();
  });

  test('close carts button can be tapped on a phone (fails by design)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Close carts' }).click({ timeout: 5_000 });
  });
});
