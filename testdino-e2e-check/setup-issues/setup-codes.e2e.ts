// TDV2-1095. Every test fails on purpose, retries 0.
// Expected in TestDino:
//   "Setup issue": the 10 setup-code tests below
//   "Timed out": STEP_TIMEOUT control
//   "Unclassified error": MODEL_REFUSED control
//   "File system": missing file control
//   "Assertion failed": assertion control
import { readFileSync } from 'node:fs';
import { describe, test } from '@e2e-dev/web';
import { AgentError, credentials, expect, secrets } from 'e2e';

const brokenFixture = test.extend<{ seededCart: string }>({
  // Breaks the fixture contract (returns without calling use) -> TEST_SETUP_FAILED.
  seededCart: async () => {},
});

describe('setup codes', { tags: ['setup'] }, () => {
  test('AUTH_CREDENTIAL_UNAVAILABLE: unknown credential', async () => {
    credentials.user('member-not-configured').username;
  });

  test('SECRET_UNAVAILABLE: unknown secret', async () => {
    await secrets.get('SECRET_NOT_CONFIGURED');
  });

  brokenFixture('TEST_SETUP_FAILED: fixture never calls use()', async ({ seededCart }) => {
    expect(seededCart).toBeTruthy();
  });

  test('APP_NOT_OPEN: tap before app.open()', async ({ screen }) => {
    await screen.getByTestId('header-logo').tap({ timeout: 3_000 });
  });

  test('AUTH_CREDENTIAL_INVALID: app rejected the credential', async () => {
    throw new AgentError('AUTH_CREDENTIAL_INVALID', 'storedemo rejected the configured member credential', { blocked: true });
  });

  test('ENVIRONMENT_UNAVAILABLE: environment is down', async () => {
    throw new AgentError('ENVIRONMENT_UNAVAILABLE', 'payment sandbox is down', { blocked: true });
  });

  test('SEED_DATA_MISSING: product seed data missing', async () => {
    throw new AgentError('SEED_DATA_MISSING', 'no product named "Rode NT1-A" in the catalog', { blocked: true });
  });

  test('APP_ALREADY_RUNNING: app already running', async () => {
    throw new AgentError('APP_ALREADY_RUNNING', 'readyUrl answered before app.command started');
  });

  test('POLICY_DENIED: policy refused the operation', async () => {
    throw new AgentError('POLICY_DENIED', 'destination https://example.invalid is denied by policy');
  });

  test('MODEL_UNAVAILABLE: no model (thrown in test)', async () => {
    throw new AgentError('MODEL_UNAVAILABLE', 'agent "default" has no model configured');
  });
});

describe('controls (must NOT be Setup issue)', { tags: ['control'] }, () => {
  test('STEP_TIMEOUT stays Timed out', async () => {
    throw new AgentError('STEP_TIMEOUT', 'step deadline of 30000 ms expired');
  });

  test('MODEL_REFUSED stays Unclassified error', async () => {
    throw new AgentError('MODEL_REFUSED', 'the model refused the request');
  });

  test('missing file is a File system failure', async () => {
    readFileSync('/tmp/tdv2-1095-no-such-file.json', 'utf8');
  });

  test('assertion failure stays Assertion failed', async ({ app, screen }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-logo')).toHaveText('Not the logo text');
  });
});
