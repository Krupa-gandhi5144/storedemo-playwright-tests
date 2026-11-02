// TDV2-1087 edge cases. Expected (retries: 1):
//   passed 4, failed 4 (timeout, plain error, HTML message, serial member),
//   skipped 3 (runtime skip, serial member after the failure, registration skip).
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('edge cases', { tags: ['edge'] }, () => {
  test('unicode title — émoji 🚀 ünïcödé 日本語 العربية', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  test(
    'a very long title ' + 'that keeps going and going '.repeat(12) + 'end',
    async ({ app, screen }) => {
      await app.open('/');
      await expect(screen.getByTestId('header-logo')).toBeVisible();
    },
  );

  test('times out after 3 seconds (fails by design)', { timeout: 3_000 }, async ({ app }) => {
    await app.open('/');
    await new Promise((resolve) => setTimeout(resolve, 10_000));
  });

  test('throws a plain error (fails by design)', async ({ app }) => {
    await app.open('/');
    throw new Error('plain error thrown by the test, not an assertion');
  });

  test('HTML in the error message is shown as text (fails by design)', async () => {
    expect('<b>bold</b> & <i>italic</i> "quotes"').toBe('<b>not bold</b>');
  });

  test('skips itself at runtime with a reason', async ({ app }) => {
    await app.open('/');
    test.skip(true, 'feature flag "wishlist-pdf" is off on storedemo');
  });

  test.skip('skipped at registration (no body runs)', async () => {});

  describe('nested group', { tags: ['nested'] }, () => {
    describe('second level', () => {
      test('passes inside two nested groups', async ({ app, screen }) => {
        await app.open('/');
        await expect(screen.getByTestId('header-menu-home')).toBeVisible();
      });
    });
  });
});

// A serial group retries as one unit; after a member fails, the rest are skipped.
describe('serial checkout flow', { serial: true, tags: ['serial'] }, () => {
  test('step 1 opens the home page', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });

  test('step 2 finds the checkout button (fails by design)', async ({ screen }) => {
    await expect(screen.getByRole('button', 'Checkout now')).toBeVisible();
  });

  test('step 3 never runs after step 2 fails', async ({ screen }) => {
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });
});
