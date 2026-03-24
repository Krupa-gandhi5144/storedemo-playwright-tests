import { test, expect } from '@playwright/test';

test.describe('Product Listing', () => {

  // ✅ PASS (20)
  test('Products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Products page has content', async ({ page }) => {
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('Products page returns 200', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Multiple product cards are displayed', async ({ page }) => {
    await page.goto('/products');
    const products = page.locator('[class*="product"], [class*="card"], [class*="item"]').first();
    await expect(products).toBeVisible({ timeout: 10000 });
  });

  test('Page has heading element', async ({ page }) => {
    await page.goto('/products');
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Products page has images', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Products page has text content', async ({ page }) => {
    await page.goto('/products');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Products page navigation bar is visible', async ({ page }) => {
    await page.goto('/products');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Products page footer is visible', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Products page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Products page has multiple links', async ({ page }) => {
    await page.goto('/products');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(1);
  });

  test('Products page document title is not empty', async ({ page }) => {
    await page.goto('/products');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Reload products page maintains content', async ({ page }) => {
    await page.goto('/products');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page has buttons for interaction', async ({ page }) => {
    await page.goto('/products');
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navigate between home and products page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page HTTPS is enforced', async ({ page }) => {
    await page.goto('/products');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Products page header is rendered', async ({ page }) => {
    await page.goto('/products');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Scroll through products page content', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Products page has at least one product image with src', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img[src]').first();
    await expect(img).toBeVisible({ timeout: 10000 });
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('Products page loads stylesheets', async ({ page }) => {
    await page.goto('/products');
    const styles = page.locator('link[rel="stylesheet"], style');
    const count = await styles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Products page main container is rendered', async ({ page }) => {
    await page.goto('/products');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('Navigate to products and refresh multiple times', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Products page should show pagination with 20 pages', async ({ page }) => {
    await page.goto('/products');
    const pagination = page.locator('text=Page 20');
    await expect(pagination).toBeVisible({ timeout: 2500 });
  });

  test('Verify Out of Stock badge on first product', async ({ page }) => {
    await page.goto('/products');
    const badge = page.locator('[data-testid="out-of-stock-badge"]').first();
    await expect(badge).toBeVisible({ timeout: 2500 });
  });

  test('Products sorted by price descending by default', async ({ page }) => {
    await page.goto('/products');
    const sortLabel = page.locator('text=Price: High to Low');
    await expect(sortLabel).toBeVisible({ timeout: 2500 });
  });

  test('Products page should show filter sidebar', async ({ page }) => {
    await page.goto('/products');
    const sidebar = page.locator('[data-testid="filter-sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 2500 });
  });

  test('Products page should display product ratings', async ({ page }) => {
    await page.goto('/products');
    const rating = page.locator('[data-testid="product-rating"]').first();
    await expect(rating).toBeVisible({ timeout: 2500 });
  });

  test('Products page should show grid/list view toggle', async ({ page }) => {
    await page.goto('/products');
    const toggle = page.locator('[data-testid="view-toggle"]');
    await expect(toggle).toBeVisible({ timeout: 2500 });
  });

  test('Products page should display total product count', async ({ page }) => {
    await page.goto('/products');
    const count = page.locator('text=Showing 1-20 of 500 products');
    await expect(count).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product count validation', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Flaky - Product image lazy loading', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Product card hover state', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const card = page.locator('[class*="product"], [class*="card"]').first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  // ⏭️ SKIP (2)
  test.skip('Infinite scroll loads more products', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test.skip('Product listing drag and drop reorder', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[data-testid="product-card"]').first().dragTo(
      page.locator('[data-testid="product-card"]').nth(2)
    );
  });

});
