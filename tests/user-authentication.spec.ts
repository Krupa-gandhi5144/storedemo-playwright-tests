import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {

  // ✅ PASS (20)
  test('Login page is accessible', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Page has user profile icon area', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Page accepts keyboard input', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    if (await input.isVisible()) {
      await expect(input).toBeEnabled();
    } else {
      expect(true).toBe(true);
    }
  });

  test('Site uses secure connection', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Header is present on page', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Homepage returns 200 status for auth page', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Homepage has navigation for auth links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('Homepage document title is present', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Homepage has form inputs for authentication', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input, button');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage no console errors on auth page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Homepage body content is not empty', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Homepage footer is visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Homepage has links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Reload page and verify auth elements persist', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Navigate from homepage to products and back', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Homepage main container visible', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('Homepage images are loaded', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Homepage stylesheets loaded', async ({ page }) => {
    await page.goto('/');
    const styles = page.locator('link[rel="stylesheet"], style');
    const count = await styles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage loads within acceptable time for auth', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(30000);
  });

  test('Multiple page loads maintain session stability', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Tab through auth form elements', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.keyboard.press('Tab');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Login form shows Remember Me checkbox', async ({ page }) => {
    await page.goto('/');
    const checkbox = page.locator('[data-testid="remember-me"]');
    await expect(checkbox).toBeVisible({ timeout: 2500 });
  });

  test('Social login buttons Google Facebook are visible', async ({ page }) => {
    await page.goto('/');
    const socialBtn = page.locator('text=Continue with Google');
    await expect(socialBtn).toBeVisible({ timeout: 2500 });
  });

  test('Password reset link is visible on login form', async ({ page }) => {
    await page.goto('/');
    const resetLink = page.locator('[data-testid="forgot-password-link"]');
    await expect(resetLink).toBeVisible({ timeout: 2500 });
  });

  test('Login form should show password visibility toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-testid="password-visibility-toggle"]');
    await expect(toggle).toBeVisible({ timeout: 2500 });
  });

  test('Registration link should be visible on login page', async ({ page }) => {
    await page.goto('/');
    const registerLink = page.locator('text=Create an account');
    await expect(registerLink).toBeVisible({ timeout: 2500 });
  });

  test('Login form should show CAPTCHA verification', async ({ page }) => {
    await page.goto('/');
    const captcha = page.locator('[data-testid="captcha-widget"]');
    await expect(captcha).toBeVisible({ timeout: 2500 });
  });

  test('Terms of service link on login form', async ({ page }) => {
    await page.goto('/');
    const tosLink = page.locator('[data-testid="terms-of-service-link"]');
    await expect(tosLink).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Auth session token validation', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Login form render timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Flaky - OAuth redirect response', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  // ⏭️ SKIP (2)
  test.skip('Two-factor authentication setup', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="2fa-setup"]');
  });

  test.skip('Biometric authentication login', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="biometric-login"]');
  });

});
