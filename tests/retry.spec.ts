import { test, expect } from '@playwright/test';
import fs from 'fs';

const marker = '.retry-marker';

  test('Verify retry behaviour', { tag: '@VerifyRetryBehaviour' }, async () => {
  if (!fs.existsSync(marker)) {
    fs.writeFileSync(marker, 'first-run');
    expect(false).toBe(true); // Fail only the first attempt
  }

  expect(true).toBe(true); // Pass on retry
});

test.afterAll(() => {
  if (fs.existsSync(marker)) {
    fs.unlinkSync(marker);
  }
});
