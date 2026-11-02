// Playwright: more passing tests so shards and workers have real work to split.
import { test, expect } from '@playwright/test';

test.describe('pages', () => {
  test('products page opens by URL', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await expect(page.getByTestId('header-logo')).toBeVisible();
  });

  test('products page opens from the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('header-menu-all-products').click();
    await expect(page).toHaveURL(/products/);
  });

  test('page title names the demo store', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Demo Store/);
  });

  test('header stays after reload', async ({ page }) => {
    await page.goto('/');
    await page.reload();
    await expect(page.getByTestId('header-menu-home')).toBeVisible();
  });

  test('header is shown on the products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByTestId('header-menu-all-products')).toBeVisible();
    await expect(page.getByTestId('header-cart-icon')).toBeVisible();
  });

  test('wishlist button is shown on the products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByTestId('header-wishlist-button')).toBeVisible();
  });
});
