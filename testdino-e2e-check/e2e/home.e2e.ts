// TDV2-1087: the main e2e suite.
// Per target it gives: 3 passed, 1 failed, 1 flaky, 1 skipped (retries: 1).
// With navigation.e2e.ts and 2 targets the full run is
// 12 passed, 2 failed, 2 flaky, 2 skipped (18 tests).
// The slow tests take 5–10 s so the live checks (Running tab, Active runs) are easy to see.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { isFirstAttempt } from './support/flaky.ts';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('home page', { tags: ['home'] }, () => {
  test('home page shows the header', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-logo')).toBeVisible();
    await expect(screen.getByTestId('header-cart-icon')).toBeVisible();
  });

  test('header menu lists the main pages (slow)', async ({ app, screen }) => {
    await app.open('/');
    await pause(3_000);
    await expect(screen.getByTestId('header-menu-home')).toHaveText('Home');
    await expect(screen.getByTestId('header-menu-about-us')).toHaveText('About Us');
    await pause(3_000);
    await expect(screen.getByTestId('header-menu-contact-us')).toHaveText('Contact Us');
    await expect(screen.getByTestId('header-menu-all-products')).toHaveText('All Products');
  });

  test('all products page opens from the menu (slow)', async ({ app, screen }) => {
    await app.open('/');
    await pause(4_000);
    await screen.getByTestId('header-menu-all-products').tap();
    await pause(3_000);
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  // FAILS BY DESIGN: a locator that finds nothing.
  // Checks: Error Details → "Page at failure", "Closest matches on screen";
  // Console → the app's log lines; Retry #1 → screenshot, log, walkthrough.
  test('place order button is shown on the home page (fails by design)', async ({ app, screen, browser }) => {
    await app.open('/');
    await browser.evaluate(() => {
      console.log('[storedemo] home page loaded');
      console.warn('[storedemo] cart is empty');
      console.error('[storedemo] place order button not rendered');
    });
    console.log('test stdout: looking for the Place order button');
    await expect(screen.getByRole('button', 'Place order')).toBeVisible();
  });

  // FLAKY BY DESIGN: fails on the first attempt, passes on the retry.
  // Checks: the passing retry has a walkthrough; the run counts it as flaky.
  test('cart icon is shown (flaky by design)',async ({ app, screen, browser }) => {
    await app.open('/');
    const width = await browser.evaluate(() => window.innerWidth);
    if (isFirstAttempt(`home-flaky-${width}`)) {
      await browser.evaluate(() => console.error('[storedemo] cart drawer slow to load'));
      await expect(screen.getByText('Cart loaded on first try')).toBeVisible();
    }
    await expect(screen.getByTestId('header-cart-icon')).toBeVisible();
  });

  // SKIPPED BY DESIGN.
  test.skip('wishlist can be exported as PDF (skipped by design)', async ({ app }) => {
    await app.open('/');
  });
});
