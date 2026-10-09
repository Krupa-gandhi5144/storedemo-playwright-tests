import { test } from '@playwright/test';
test.skip(process.env.TDV2_943_ENABLED !== '1', 'Use the TDV2-943 QA runner');
for (let i = 1; i <= 51; i++) {
  test(`TDV2-943 capacity reference ${String(i).padStart(2, '0')}`, async ({}, info) => {
    if (i <= Number(process.env.TDV2_950_CAPACITY_RETRIES || 0) && info.retry === 0)
      throw new Error('QA_950_CAPACITY_RETRY: intentional critical retry');
  });
}
