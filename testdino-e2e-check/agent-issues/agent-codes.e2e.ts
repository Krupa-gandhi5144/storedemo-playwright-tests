// TDV2-1095: agent steps whose failure code is produced by the e2e runner.
// Expected in TestDino:
//   STEP_TIMEOUT        -> Timed out
//   MODEL_REFUSED       -> Unclassified error
//   blocked setup codes -> Setup issue
//   failed verdict      -> a product failure (not Setup issue)
import { describe, test } from '@e2e-dev/web';

describe('agent codes', { tags: ['agent'] }, () => {
  test('agent step times out (STEP_TIMEOUT)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('hang: add the first featured product to the cart', { timeout: 3_000 });
  });

  test('agent refuses (MODEL_REFUSED)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('refuse: add the first featured product to the cart');
  });

  test('blocked by credentials (AUTH_CREDENTIAL_INVALID)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('blocked:AUTH_CREDENTIAL_INVALID sign in as the member user');
  });

  test('blocked by environment (ENVIRONMENT_UNAVAILABLE)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('blocked:ENVIRONMENT_UNAVAILABLE pay with the sandbox card');
  });

  test('blocked by seed data (SEED_DATA_MISSING)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('blocked:SEED_DATA_MISSING open the product "Rode NT1-A"');
  });

  test('blocked by test setup (TEST_SETUP_FAILED)', async ({ app, agent }) => {
    await app.open('/');
    await agent.act('blocked:TEST_SETUP_FAILED start from an empty cart');
  });

  test('agent finds a product bug (failed verdict)', async ({ app, agent }) => {
    await app.open('/');
    await agent.assert('fail: the cart shows the added item');
  });
});
