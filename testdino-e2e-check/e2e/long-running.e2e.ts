// TDV2-1087 live check: a test that runs for more than 2 minutes with nothing
// else happening. The run must stay "running" in TestDino, not end as incomplete.
// Registered only with E2E_LONG_TEST=1 (npm run e2e:long), so normal runs skip it.
import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

if (process.env.E2E_LONG_TEST) {
  test('stays running for 2.5 minutes', { timeout: 240_000, tags: ['long'] }, async ({ app, screen }) => {
    await app.open('/');
    await new Promise((resolve) => setTimeout(resolve, 150_000));
    await expect(screen.getByTestId('header-logo')).toBeVisible();
  });
}
