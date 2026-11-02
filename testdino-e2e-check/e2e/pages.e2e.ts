// TDV2-1087: more passing tests so shards and workers have real work to split.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('pages', { tags: ['pages'] }, () => {
  test('products page opens by URL', async ({ app, screen, browser }) => {
    await app.open('/products');
    await expect(browser).toHaveURL(/products/);
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  test('products page opens from the menu', async ({ app, screen, browser }) => {
    await app.open('/');
    await screen.getByTestId('header-menu-all-products').tap();
    await expect(browser).toHaveURL(/products/);
  });

  test('page title names the demo store', async ({ app, browser }) => {
    await app.open('/');
    const title = await browser.title();
    expect(title).toContain('Demo Store');
  });

  test('header stays after reload (slow)', async ({ app, screen, browser }) => {
    await app.open('/');
    await pause(3_000);
    await browser.reload();
    await pause(2_000);
    await expect(screen.getByTestId('header-menu-home')).toBeVisible();
  });

  test('header is shown on the products page', async ({ app, screen }) => {
    await app.open('/products');
    await expect(screen.getByTestId('header-menu-all-products')).toBeVisible();
    await expect(screen.getByTestId('header-cart-icon')).toBeVisible();
  });
});
