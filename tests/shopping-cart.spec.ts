import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {

  // ✅ PASS (20)
  test('Cart icon is visible on page', async ({ page }) => {
    await page.goto('/products');
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });

  test('Store page loads without errors', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Page has interactive buttons', async ({ page }) => {
    await page.goto('/products');
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('Navigation works from products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Page has visible content', async ({ page }) => {
    await page.goto('/products');
    const content = await page.locator('body').textContent();
    expect(content!.trim().length).toBeGreaterThan(10);
  });

  test('Products page has navigation bar for cart access', async ({ page }) => {
    await page.goto('/products');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Products page has header with cart area', async ({ page }) => {
    await page.goto('/products');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Products page loads all images', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Products page has multiple buttons for add to cart', async ({ page }) => {
    await page.goto('/products');
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Products page HTTPS enforced for secure cart', async ({ page }) => {
    await page.goto('/products');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Products page no console errors during cart interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Products page footer visible after scrolling', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Reload products page and verify cart icon persists', async ({ page }) => {
    await page.goto('/products');
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });

  test('Navigate from homepage to products for cart testing', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('Products page document title is present', async ({ page }) => {
    await page.goto('/products');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Click on product card from products page', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Navigate product detail and go back to listing', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
  });

  test('Products page main container rendered for cart', async ({ page }) => {
    await page.goto('/products');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('Products page has links for navigation', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(1);
  });

  test('Scroll products page to view all items', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Cart shows Your cart is empty message by default', async ({ page }) => {
    await page.goto('/products');
    const emptyMsg = page.locator('[data-testid="empty-cart-message"]');
    await expect(emptyMsg).toBeVisible({ timeout: 2500 });
  });

  test('Cart badge shows count of 3 items', async ({ page }) => {
    await page.goto('/products');
    const badge = page.locator('text=3 items in cart');
    await expect(badge).toBeVisible({ timeout: 2500 });
  });

  test('Cart total displays $0.00 when empty', async ({ page }) => {
    await page.goto('/products');
    const total = page.locator('[data-testid="cart-total-zero"]');
    await expect(total).toBeVisible({ timeout: 2500 });
  });

  test('Cart should show remove item button', async ({ page }) => {
    await page.goto('/products');
    const removeBtn = page.locator('[data-testid="remove-from-cart"]').first();
    await expect(removeBtn).toBeVisible({ timeout: 2500 });
  });

  test('Cart quantity selector should be visible', async ({ page }) => {
    await page.goto('/products');
    const quantitySelector = page.locator('[data-testid="quantity-selector"]').first();
    await expect(quantitySelector).toBeVisible({ timeout: 2500 });
  });

  test('Cart should show estimated shipping cost', async ({ page }) => {
    await page.goto('/products');
    const shipping = page.locator('[data-testid="estimated-shipping"]');
    await expect(shipping).toBeVisible({ timeout: 2500 });
  });

  test('Cart should display proceed to checkout button', async ({ page }) => {
    await page.goto('/products');
    const checkoutBtn = page.locator('[data-testid="proceed-to-checkout"]');
    await expect(checkoutBtn).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Add to cart button response', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Cart animation rendering', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Cart badge count update', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  // ⏭️ SKIP (2)
  test.skip('Apply coupon code to cart', async ({ page }) => {
    await page.goto('/products');
    await page.fill('[data-testid="coupon-input"]', 'SAVE20');
  });

  test.skip('Save cart for later feature', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="save-for-later"]');
  });

});
