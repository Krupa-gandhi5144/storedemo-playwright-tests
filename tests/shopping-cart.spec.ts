import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', { tag: '@ShoppingCart' }, () => {

  // ✅ PASS (15)
  test('Cart icon and page full verification', { tag: '@CartIconAndPageFullVerification' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
    const response = await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const bodyText = await body.textContent();
    expect(bodyText!.trim().length).toBeGreaterThan(10);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const images = page.locator('img');
    expect(await images.count()).toBeGreaterThan(0);
    const buttons = page.locator('button, [role="button"]');
    expect(await buttons.count()).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(header).toBeVisible();
  });

  test('Cart page product selection and navigation flow', { tag: '@CartPageProductSelectionAndNavigationFlow' }, async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/storedemo/);
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);
    await page.waitForTimeout(2000);
    const productCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
    await productCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const detailBody = page.locator('body');
    await expect(detailBody).toBeVisible();
    const detailText = await detailBody.textContent();
    expect(detailText!.trim().length).toBeGreaterThan(10);
    const detailImages = page.locator('img');
    expect(await detailImages.count()).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const finalBody = page.locator('body');
    await expect(finalBody).toBeVisible();
  });

  test('Cart page buttons and interactive elements deep check', { tag: '@CartPageButtonsAndInteractiveElementsDeepCheck' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const buttons = page.locator('button');
    const btnCount = await buttons.count();
    expect(btnCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(btnCount, 8); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        expect(await btn.isEnabled()).toBeTruthy();
        const box = await btn.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
      }
      await page.waitForTimeout(500);
    }
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(linkCount, 8); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Cart page no JS errors during full interaction', { tag: '@CartPageNoJsErrorsDuringFullInteraction' }, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/products');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    expect(errors.length).toBe(0);
  });

  test('Cart page reload stability and DOM consistency', { tag: '@CartPageReloadStabilityAndDomConsistency' }, async ({ page }) => {
    await page.goto('/products');
    const titleBefore = await page.title();
    const imgsBefore = await page.locator('img').count();
    const btnsBefore = await page.locator('button').count();
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(await page.title()).toBe(titleBefore);
    expect(await page.locator('img').count()).toBe(imgsBefore);
    expect(await page.locator('button').count()).toBe(btnsBefore);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(await page.title()).toBe(titleBefore);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Cart page multi-cycle navigation flow', { tag: '@CartPageMulticycleNavigationFlow' }, async ({ page }) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.goto('/');
      await expect(page).toHaveURL(/storedemo/);
      await page.waitForTimeout(1500);
      await page.goto('/products');
      await expect(page).toHaveURL(/products/);
      await page.waitForTimeout(1500);
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
      const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
      await expect(cartIcon).toBeVisible({ timeout: 10000 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Cart page full scroll with element bounding box checks', { tag: '@CartPageFullScrollWithElementBoundingBoxChecks' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
    }
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    const footerBox = await footer.boundingBox();
    expect(footerBox).toBeTruthy();
    for (let i = steps; i >= 0; i--) {
      await page.evaluate((y) => window.scrollTo(0, y), (scrollHeight * i) / steps);
      await page.waitForTimeout(1500);
    }
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(headerBox!.y).toBeLessThan(100);
  });

  test('Cart page image deep inspection', { tag: '@CartPageImageDeepInspection' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    expect(totalImages).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(totalImages, 10); i++) {
      const img = allImages.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      if (await img.isVisible()) {
        const box = await img.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      }
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Cart page product card interaction and back', { tag: '@CartPageProductCardInteractionAndBack' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[class*="product"], [class*="card"], [class*="item"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cards.nth(i);
      if (await card.isVisible()) {
        const box = await card.boundingBox();
        expect(box).toBeTruthy();
      }
      await page.waitForTimeout(800);
    }
    const firstCard = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await firstCard.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
  });

  test('Cart page performance validation', { tag: '@CartPagePerformanceValidation' }, async ({ page }) => {
    const loadTimes: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      await page.goto('/products');
      await page.waitForLoadState('domcontentloaded');
      loadTimes.push(Date.now() - start);
      await page.waitForTimeout(2000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 10000 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1500);
    }
    for (const lt of loadTimes) {
      expect(lt).toBeLessThan(30000);
    }
  });

  test('Cart page CSS and visual layout verification', { tag: '@CartPageCssAndVisualLayoutVerification' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const styles = page.locator('link[rel="stylesheet"], style');
    expect(await styles.count()).toBeGreaterThan(0);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    const container = page.locator('main, #root, #app, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('https');
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  });

  test('Cart page keyboard navigation', { tag: '@CartPageKeyboardNavigation' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    await page.keyboard.press('End');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(800);
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Cart page document metadata check', { tag: '@CartPageDocumentMetadataCheck' }, async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const url = page.url();
    expect(url).toContain('https');
    expect(url).toContain('products');
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
    const stylesheets = page.locator('link[rel="stylesheet"]');
    expect(await stylesheets.count()).toBeGreaterThan(0);
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text!.trim().length).toBeGreaterThan(50);
  });

  test('Cart page back forward navigation deep test', { tag: '@CartPageBackForwardNavigationDeepTest' }, async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const card = page.locator('[class*="product"], [class*="card"], a[href*="product"]').first();
    await card.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/products/);
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ❌ FAIL (7)
  test('Cart shows empty cart message by default', { tag: '@CartShowsEmptyCartMessageByDefault' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const emptyMsg = page.locator('[data-testid="empty-cart-message"]');
    await expect(emptyMsg).toBeVisible({ timeout: 3000 });
  });

  test('Cart badge shows count of 3 items', { tag: '@CartBadgeShowsCountOf3Items' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const badge = page.locator('text=3 items in cart');
    await expect(badge).toBeVisible({ timeout: 3000 });
  });

  test('Cart total displays $0.00 when empty', { tag: '@CartTotalDisplays000WhenEmpty' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const total = page.locator('[data-testid="cart-total-zero"]');
    await expect(total).toBeVisible({ timeout: 3000 });
  });

  test('Cart should show remove item button', { tag: '@CartShouldShowRemoveItemButton' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const removeBtn = page.locator('[data-testid="remove-from-cart"]').first();
    await expect(removeBtn).toBeVisible({ timeout: 3000 });
  });

  test('Cart quantity selector visible', { tag: '@CartQuantitySelectorVisible' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const qty = page.locator('[data-testid="quantity-selector"]').first();
    await expect(qty).toBeVisible({ timeout: 3000 });
  });

  test('Cart should show estimated shipping cost', { tag: '@CartShouldShowEstimatedShippingCost' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const shipping = page.locator('[data-testid="estimated-shipping"]');
    await expect(shipping).toBeVisible({ timeout: 3000 });
  });

  test('Cart proceed to checkout button visible', { tag: '@CartProceedToCheckoutButtonVisible' }, async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);
    const checkoutBtn = page.locator('[data-testid="proceed-to-checkout"]');
    await expect(checkoutBtn).toBeVisible({ timeout: 3000 });
  });

  // 🔄 FLAKY (3)
  test('Flaky - Add to cart button response', { tag: '@FlakyAddToCartButtonResponse' }, async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const btn = page.locator('button').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Cart animation rendering', { tag: '@FlakyCartAnimationRendering' }, async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    const cartIcon = page.locator('[class*="cart"], [aria-label*="cart"], [href*="cart"], svg').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });

  test('Flaky - Cart badge count update', { tag: '@FlakyCartBadgeCountUpdate' }, async ({ page }) => {
    if (test.info().retry === 0) { expect(true).toBe(false); }
    await page.goto('/products');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/products/);
  });

  // ⏭️ SKIP (2)
  test.skip('Apply coupon code to cart', { tag: '@ApplyCouponCodeToCart' }, async ({ page }) => {
    await page.goto('/products');
  });

  test.skip('Save cart for later feature', { tag: '@SaveCartForLaterFeature' }, async ({ page }) => {
    await page.goto('/products');
  });

});
