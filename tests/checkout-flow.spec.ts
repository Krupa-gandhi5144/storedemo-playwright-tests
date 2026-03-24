import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {

  // ✅ PASS (20)
  test('Store homepage is accessible', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Products page renders correctly', async ({ page }) => {
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Page has form elements', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input, button, a');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('HTTPS is enforced on the site', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/https/);
  });

  test('Page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/products');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(30000);
  });

  test('Homepage navigation to products works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Products page has buttons for checkout flow', async ({ page }) => {
    await page.goto('/products');
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Products page header visible for navigation', async ({ page }) => {
    await page.goto('/products');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Products page has product cards', async ({ page }) => {
    await page.goto('/products');
    const products = page.locator('[class*="product"], [class*="card"], [class*="item"]').first();
    await expect(products).toBeVisible({ timeout: 10000 });
  });

  test('Products page no JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Navigate to product detail for checkout', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Product detail page has content for checkout', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Products page footer visible', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Products page document title exists', async ({ page }) => {
    await page.goto('/products');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Reload products page for checkout flow', async ({ page }) => {
    await page.goto('/products');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
  });

  test('Products page images loaded for product selection', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Multiple page navigation for checkout flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page links are functional', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(1);
  });

  test('Products page main container visible', async ({ page }) => {
    await page.goto('/products');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('Complete navigation flow: home to product to back', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page scroll and verify footer for checkout info', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Checkout page shows shipping form by default', async ({ page }) => {
    await page.goto('/checkout');
    const form = page.locator('[data-testid="shipping-form"]');
    await expect(form).toBeVisible({ timeout: 2500 });
  });

  test('Payment methods include PayPal option', async ({ page }) => {
    await page.goto('/products');
    const paypal = page.locator('text=Pay with PayPal');
    await expect(paypal).toBeVisible({ timeout: 2500 });
  });

  test('Order summary shows tax calculation', async ({ page }) => {
    await page.goto('/products');
    const tax = page.locator('[data-testid="tax-amount"]');
    await expect(tax).toBeVisible({ timeout: 2500 });
  });

  test('Checkout should display order confirmation number', async ({ page }) => {
    await page.goto('/products');
    const orderNum = page.locator('[data-testid="order-confirmation-number"]');
    await expect(orderNum).toBeVisible({ timeout: 2500 });
  });

  test('Checkout should show estimated delivery date', async ({ page }) => {
    await page.goto('/products');
    const deliveryDate = page.locator('[data-testid="estimated-delivery"]');
    await expect(deliveryDate).toBeVisible({ timeout: 2500 });
  });

  test('Checkout progress bar should show 4 steps', async ({ page }) => {
    await page.goto('/products');
    const progressSteps = page.locator('[data-testid="checkout-step"]');
    await expect(progressSteps).toHaveCount(4, { timeout: 2500 });
  });

  test('Checkout should display gift wrap option', async ({ page }) => {
    await page.goto('/products');
    const giftWrap = page.locator('[data-testid="gift-wrap-option"]');
    await expect(giftWrap).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Checkout redirect timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Flaky - Payment gateway connection', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - Checkout form validation timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const buttons = page.locator('button').first();
    await expect(buttons).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (2)
  test.skip('Guest checkout without account', async ({ page }) => {
    await page.goto('/checkout');
    await page.click('[data-testid="guest-checkout"]');
  });

  test.skip('Express checkout with saved payment', async ({ page }) => {
    await page.goto('/checkout');
    await page.click('[data-testid="express-checkout"]');
  });

});
