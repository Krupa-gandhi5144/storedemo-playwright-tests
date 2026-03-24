import { test, expect } from '@playwright/test';

test.describe('Product Details', () => {

  // ✅ PASS (20)
  test('Product detail page loads', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page has clickable elements', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a').first();
    await expect(links).toBeVisible({ timeout: 10000 });
  });

  test('Product images are present', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Page renders without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Product page has text content', async ({ page }) => {
    await page.goto('/products');
    const text = await page.locator('body').textContent();
    expect(text).toBeTruthy();
  });

  test('Products page returns 200 status', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Product page has navigation bar', async ({ page }) => {
    await page.goto('/products');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Product page header is visible', async ({ page }) => {
    await page.goto('/products');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Product page has multiple images', async ({ page }) => {
    await page.goto('/products');
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navigate to product and back to listing', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
  });

  test('Product page footer is visible', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Product page document title is not empty', async ({ page }) => {
    await page.goto('/products');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Product page has buttons', async ({ page }) => {
    await page.goto('/products');
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Product images have src attributes', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img[src]').first();
    await expect(img).toBeVisible({ timeout: 10000 });
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('Reload product page maintains state', async ({ page }) => {
    await page.goto('/products');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Product page HTTPS enforced', async ({ page }) => {
    await page.goto('/products');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Product page has links', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Scroll down product page to view more details', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Product detail page has content text', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Navigate through multiple products', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body1 = page.locator('body');
    await expect(body1).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
  });

  test('Product page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/products');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(30000);
  });

  test('Product detail page no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  // ❌ FAIL (7)
  test('Product detail shows 360-degree view button', async ({ page }) => {
    await page.goto('/products');
    const btn = page.locator('[data-testid="360-view"]');
    await expect(btn).toBeVisible({ timeout: 2500 });
  });

  test('Product detail has size selector', async ({ page }) => {
    await page.goto('/products');
    const selector = page.locator('[data-testid="size-selector"]');
    await expect(selector).toBeVisible({ timeout: 2500 });
  });

  test('Product availability shows In Stock 150 units', async ({ page }) => {
    await page.goto('/products');
    const stock = page.locator('text=In Stock: 150 units');
    await expect(stock).toBeVisible({ timeout: 2500 });
  });

  test('Product detail should show customer reviews section', async ({ page }) => {
    await page.goto('/products');
    const reviews = page.locator('[data-testid="customer-reviews"]');
    await expect(reviews).toBeVisible({ timeout: 2500 });
  });

  test('Product detail should display color swatches', async ({ page }) => {
    await page.goto('/products');
    const swatches = page.locator('[data-testid="color-swatches"]');
    await expect(swatches).toBeVisible({ timeout: 2500 });
  });

  test('Product detail should show related products carousel', async ({ page }) => {
    await page.goto('/products');
    const carousel = page.locator('[data-testid="related-products"]');
    await expect(carousel).toBeVisible({ timeout: 2500 });
  });

  test('Product detail should show add to wishlist button', async ({ page }) => {
    await page.goto('/products');
    const wishlistBtn = page.locator('[data-testid="add-to-wishlist"]');
    await expect(wishlistBtn).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product image gallery loads', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Product detail tab switching', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await page.locator('[class*="product"], [class*="card"], a[href*="product"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - Product zoom feature', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (2)
  test.skip('Product comparison feature', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="compare-btn"]');
  });

  test.skip('Product 3D model viewer', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="3d-viewer"]');
  });

});
