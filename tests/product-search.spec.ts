import { test, expect } from '@playwright/test';

test.describe('Product Search', () => {

  // ✅ PASS (20)
  test('Search bar is visible on products page', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Page loads without errors', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Products page URL is correct', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  test('Page body is not empty after load', async ({ page }) => {
    await page.goto('/products');
    const content = await page.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(0);
  });

  test('Page has images loaded', async ({ page }) => {
    await page.goto('/products');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Search input is enabled and interactable', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeEnabled({ timeout: 10000 });
  });

  test('Products page has navigation bar', async ({ page }) => {
    await page.goto('/products');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Products page has header', async ({ page }) => {
    await page.goto('/products');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Products page document title exists', async ({ page }) => {
    await page.goto('/products');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Search area has proper placeholder or label', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    const placeholder = await searchInput.getAttribute('placeholder');
    const ariaLabel = await searchInput.getAttribute('aria-label');
    expect(placeholder || ariaLabel).toBeTruthy();
  });

  test('Products page loads stylesheets', async ({ page }) => {
    await page.goto('/products');
    const styles = page.locator('link[rel="stylesheet"], style');
    const count = await styles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Products page HTTPS enforced', async ({ page }) => {
    await page.goto('/products');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Reload products page and verify search bar persists', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Type in search field and verify input value', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('test query');
    const value = await searchInput.inputValue();
    expect(value).toBe('test query');
  });

  test('Clear search field after typing', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('some text');
    await searchInput.fill('');
    const value = await searchInput.inputValue();
    expect(value).toBe('');
  });

  test('Products page no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Products page footer is visible', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Navigate to products page from homepage for search', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Type multiple queries sequentially in search', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('laptop');
    await page.waitForTimeout(500);
    await searchInput.fill('phone');
    await page.waitForTimeout(500);
    await searchInput.fill('tablet');
    const value = await searchInput.inputValue();
    expect(value).toBe('tablet');
  });

  test('Search field accepts keyboard input', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await page.keyboard.type('keyboard input test');
    const value = await searchInput.inputValue();
    expect(value).toContain('keyboard input test');
  });

  test('Products page main container visible', async ({ page }) => {
    await page.goto('/products');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  // ❌ FAIL (7)
  test('Search for xyz123 shows No results message', async ({ page }) => {
    await page.goto('/products');
    const noResults = page.locator('text=No results found for "xyz123"');
    await expect(noResults).toBeVisible({ timeout: 2500 });
  });

  test('Search suggestions dropdown appears on typing', async ({ page }) => {
    await page.goto('/products');
    const dropdown = page.locator('[data-testid="search-suggestions"]');
    await expect(dropdown).toBeVisible({ timeout: 2500 });
  });

  test('Voice search button is present', async ({ page }) => {
    await page.goto('/products');
    const voiceBtn = page.locator('[aria-label="Voice search"]');
    await expect(voiceBtn).toBeVisible({ timeout: 2500 });
  });

  test('Search filter by category should be visible', async ({ page }) => {
    await page.goto('/products');
    const categoryFilter = page.locator('[data-testid="search-category-filter"]');
    await expect(categoryFilter).toBeVisible({ timeout: 2500 });
  });

  test('Search results should show result count', async ({ page }) => {
    await page.goto('/products');
    const resultCount = page.locator('[data-testid="search-result-count"]');
    await expect(resultCount).toBeVisible({ timeout: 2500 });
  });

  test('Advanced search link should be visible', async ({ page }) => {
    await page.goto('/products');
    const advancedLink = page.locator('text=Advanced Search');
    await expect(advancedLink).toBeVisible({ timeout: 2500 });
  });

  test('Search autocomplete should show top 5 suggestions', async ({ page }) => {
    await page.goto('/products');
    const suggestions = page.locator('[data-testid="autocomplete-item"]');
    await expect(suggestions).toHaveCount(5, { timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Search results load time', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Flaky - Search debounce timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Search index refresh', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
  });

  // ⏭️ SKIP (2)
  test.skip('Search history shows recent searches', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="search-history"]');
  });

  test.skip('Image search by uploading photo', async ({ page }) => {
    await page.goto('/products');
    await page.click('[data-testid="image-search"]');
  });

});
