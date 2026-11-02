// TDV2-1087: cart and wishlist header tests (all pass), for sharding/worker coverage.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('cart', { tags: ['cart'] }, () => {
  test('cart drawer opens from the header', async ({ app, screen }) => {
    await app.open('/');
    await screen.getByTestId('header-cart-icon').tap();
    await expect(screen.getByRole('heading', 'Your Cart')).toBeVisible();
  });

  test('cart drawer has a close button', async ({ app, screen }) => {
    await app.open('/');
    await screen.getByTestId('header-cart-icon').tap();
    await expect(screen.getByRole('heading', 'Your Cart')).toBeVisible();
    await expect(screen.getByTestId('close-cart')).toBeVisible();
  });

  test('wishlist button is in the header', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-wishlist-button')).toBeVisible();
  });

  test('cart drawer opens on the products page', async ({ app, screen }) => {
    await app.open('/products');
    await screen.getByTestId('header-cart-icon').tap();
    await expect(screen.getByRole('heading', 'Your Cart')).toBeVisible();
  });
});
