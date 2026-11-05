// TDV2-1087 phone-size suite: 5 passed + 1 failed per target.
// On phones storedemo shows the logo, a menu icon, the hero and categories;
// the desktop menu, cart and wishlist icons are hidden.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('mobile home', { tags: ['mobile'] }, () => {
  test('logo and menu icon are shown', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-logo')).toBeVisible();
    await expect(screen.getByTestId('header-menu-icon')).toBeVisible();
  });

  test('hero shows the title and Shop Now', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('hero-title')).toBeVisible();
    await expect(screen.getByTestId('hero-shop-now')).toBeVisible();
  });

  test('product categories are listed', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('category-title-camera')).toBeVisible();
    await expect(screen.getByTestId('product-categories')).toBeVisible();
  });

  test('products page opens by URL', async ({ app, browser }) => {
    await app.open('/products');
    await expect(browser).toHaveURL(/products/);
  });

  test('desktop menu is hidden on a phone', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-menu-all-products')).toBeHidden();
  });

  // FAILS BY DESIGN: checks the phone size shows in "Page at failure" (390×844 / 412×915).
  test('close carts button can be tapped on a phone (fails by design)', async ({ app, screen }) => {
    await app.open('/');
    await screen.getByRole('button', 'Close carts').tap({ timeout: 5_000 });
  });
});
