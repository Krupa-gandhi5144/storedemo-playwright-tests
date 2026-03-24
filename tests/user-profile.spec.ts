import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {

  // ✅ PASS (20)
  test('Store homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Page document has a title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Main content area is rendered', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('No console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Page has at least one link', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage returns 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Homepage header visible for profile access', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Homepage navigation visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Homepage HTTPS enforced for profile security', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Homepage body has content', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Homepage images are loaded', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Homepage has buttons for interaction', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage footer visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Navigate from home to products and back for profile', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Reload homepage and verify profile elements persist', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Homepage stylesheets loaded for profile styling', async ({ page }) => {
    await page.goto('/');
    const styles = page.locator('link[rel="stylesheet"], style');
    const count = await styles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage has form inputs', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input, button');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(30000);
  });

  test('Scroll homepage to view profile related content', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Multiple navigation cycles maintain stability', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await page.goto('/');
    await page.goto('/products');
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Homepage meta viewport exists for responsive profile', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    const count = await viewport.count();
    expect(count).toBeGreaterThan(0);
  });

  // ❌ FAIL (5)
  test('User avatar placeholder is shown when not logged in', async ({ page }) => {
    await page.goto('/');
    const avatar = page.locator('[data-testid="user-avatar-placeholder"]');
    await expect(avatar).toBeVisible({ timeout: 2500 });
  });

  test('Profile page should show edit profile button', async ({ page }) => {
    await page.goto('/');
    const editBtn = page.locator('[data-testid="edit-profile-btn"]');
    await expect(editBtn).toBeVisible({ timeout: 2500 });
  });

  test('Profile should display order history tab', async ({ page }) => {
    await page.goto('/');
    const orderTab = page.locator('text=Order History');
    await expect(orderTab).toBeVisible({ timeout: 2500 });
  });

  test('Profile should show saved addresses section', async ({ page }) => {
    await page.goto('/');
    const addresses = page.locator('[data-testid="saved-addresses"]');
    await expect(addresses).toBeVisible({ timeout: 2500 });
  });

  test('Profile should display notification preferences', async ({ page }) => {
    await page.goto('/');
    const notifications = page.locator('[data-testid="notification-preferences"]');
    await expect(notifications).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Profile data fetch', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Flaky - Profile image load timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Profile session persistence', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  // ⏭️ SKIP (2)
  test.skip('Upload profile picture', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('[data-testid="avatar-upload"]', 'test.png');
  });

  test.skip('Delete user account', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="delete-account"]');
  });

});
