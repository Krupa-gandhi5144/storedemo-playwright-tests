// TDV2-1087: a second spec file with passing tests only,
// so the Summary spec cards show more than one file with real totals.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('navigation', { tags: ['navigation'] }, () => {
  test('about us page opens from the menu (slow)', async ({ app, screen }) => {
    await app.open('/');
    await pause(3_000);
    await screen.getByTestId('header-menu-about-us').tap();
    await pause(3_000);
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  test('contact us page opens from the menu (slow)', async ({ app, screen }) => {
    await app.open('/');
    await pause(3_000);
    await screen.getByTestId('header-menu-contact-us').tap();
    await pause(3_000);
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  test('home link brings back the home page', async ({ app, screen }) => {
    await app.open('/');
    await screen.getByTestId('header-menu-home').tap();
    await expect(screen.getByTestId('header-menu-all-products')).toBeVisible();
  });
});
