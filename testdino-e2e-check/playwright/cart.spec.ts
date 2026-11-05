// Playwright: cart and wishlist header tests (all pass), for sharding/worker coverage.
import { test, expect } from '@playwright/test';

test.describe('cart', () => {
  test('cart drawer opens from the header', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('header-cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  });

  test('cart drawer has a close button', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('header-cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
    await expect(page.getByTestId('close-cart')).toBeVisible();
  });

  test('wishlist button is in the header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('header-wishlist-button')).toBeVisible();
  });

  test('cart drawer opens on the products page', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('header-cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  });
});
