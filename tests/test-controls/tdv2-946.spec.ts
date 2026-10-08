import { test } from '@playwright/test';

test.skip(process.env.TDV2_946_ENABLED !== '1', 'Use the TDV2-946 QA runner');
async function result(value: string, retry: number) {
  console.log('QA_946_TEST_STARTED:' + Date.now());
  if (value === 'skip') { test.skip(); return; }
  if (value === 'slow') { console.log('QA_946_SLOW_STARTED'); await new Promise(resolve => setTimeout(resolve, 60000)); return; }
  if (value === 'fail' || (value === 'retry' && retry === 0)) throw new Error('QA_946_FAILURE: intentional reporter exit-code verification');
}
test('TDV2-946 quarantine one', async ({}, info) => result(process.env.TDV2_946_Q1 || 'pass', info.retry));
test('TDV2-946 quarantine two', async ({}, info) => result(process.env.TDV2_946_Q2 || 'pass', info.retry));
test('TDV2-946 ordinary target', async ({}, info) => result(process.env.TDV2_946_ORDINARY || 'pass', info.retry));
