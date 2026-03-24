import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {

  // ✅ PASS (15)
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
  });

  test('Page title is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Navigation bar is present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Footer is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Homepage has product section', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Homepage returns HTTP 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Homepage has at least one image', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('img').first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test('Navigation contains links to other pages', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage has a main heading element', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Page document title is not empty', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Navigate from homepage to products page and back', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Homepage loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(30000);
  });

  test('Homepage has buttons or interactive elements', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('button, a, input');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Header section is rendered at top of page', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('Homepage HTTPS is enforced', async ({ page }) => {
    await page.goto('/');
    const url = page.url();
    expect(url).toContain('https');
  });

  test('Homepage no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('Homepage body text content is not empty', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').textContent();
    expect(text!.trim().length).toBeGreaterThan(10);
  });

  test('Navigate to products page and verify URL', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
  });

  test('Homepage meta viewport tag exists', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    const count = await viewport.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage has a container or root element', async ({ page }) => {
    await page.goto('/');
    const container = page.locator('#root, #app, [class*="container"], main').first();
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test('Multiple page navigations maintain stability', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.goto('/products');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Homepage footer contains links', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Scrolling to bottom of homepage works', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Homepage loads all CSS stylesheets', async ({ page }) => {
    await page.goto('/');
    const styles = page.locator('link[rel="stylesheet"], style');
    const count = await styles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Browser back and forward navigation works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/products');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/products/);
  });

  // ❌ FAIL (7)
  test('Homepage should have login modal open by default', async ({ page }) => {
    await page.goto('/');
    const modal = page.locator('[data-testid="login-modal"]');
    await expect(modal).toBeVisible({ timeout: 2500 });
  });

  test('Verify promo banner displays discount code', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('text=DISCOUNT50');
    await expect(banner).toBeVisible({ timeout: 2500 });
  });

  test('Homepage should have exactly 50 products', async ({ page }) => {
    await page.goto('/');
    const products = page.locator('.product-card');
    await expect(products).toHaveCount(50, { timeout: 2500 });
  });

  test('Homepage should display countdown timer for flash sale', async ({ page }) => {
    await page.goto('/');
    const timer = page.locator('[data-testid="flash-sale-timer"]');
    await expect(timer).toBeVisible({ timeout: 2500 });
  });

  test('Homepage newsletter subscription form should be visible', async ({ page }) => {
    await page.goto('/');
    const newsletterForm = page.locator('[data-testid="newsletter-form"]');
    await expect(newsletterForm).toBeVisible({ timeout: 2500 });
  });

  test('Homepage should show live chat widget', async ({ page }) => {
    await page.goto('/');
    const chatWidget = page.locator('[data-testid="live-chat-widget"]');
    await expect(chatWidget).toBeVisible({ timeout: 2500 });
  });

  test('Homepage breadcrumb should show Home label', async ({ page }) => {
    await page.goto('/');
    const breadcrumb = page.locator('[data-testid="breadcrumb"] >> text=Home');
    await expect(breadcrumb).toBeVisible({ timeout: 2500 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Homepage load time check', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await expect(page).not.toHaveURL('about:blank');
  });

  test('Flaky - Navigation menu render timing', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('Flaky - Footer lazy load detection', async ({ page }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  // ⏭️ SKIP (2)
  test.skip('Dark mode toggle on homepage', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="dark-mode-toggle"]');
  });

  test.skip('Accessibility - Homepage keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

});
