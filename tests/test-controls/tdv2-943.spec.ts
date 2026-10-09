import { test } from '@playwright/test';

test.skip(process.env.TDV2_943_ENABLED !== '1', 'Use the TDV2-943 QA runner');

async function outcome(value: string, retry: number, label: string) {
  if (value === 'skip') { test.skip(true, 'Intentional QA skip'); return; }
  if (value === 'expected-fail') test.fail(true, 'Intentional expected failure');
  if (value === 'timeout') { await new Promise(() => {}); return; }
  if (value === 'fail' || value === 'expected-fail'
    || (value === 'retry' && retry === 0)
    || (value === 'retry-two' && retry < 2)) throw new Error(`QA_${label}_FAILURE: predictable critical-test verification`);
  if (!['pass','retry','retry-two','fail','skip','timeout','expected-fail'].includes(value)) throw new Error(`Invalid QA outcome: ${value}`);
}

test('TDV2-943 critical target', {tag:'@tdv2-943-critical'}, async ({}, info) => {
  await outcome(process.env.TDV2_943_CRITICAL || 'pass', info.retry, 'CRITICAL');
});

test('TDV2-943 second critical target', {tag:'@tdv2-943-second'}, async ({}, info) => {
  await outcome(process.env.TDV2_943_SECOND || 'pass', info.retry, 'SECOND_CRITICAL');
});

test('TDV2-943 ordinary target', {tag:'@tdv2-943-ordinary'}, async ({}, info) => {
  await outcome(process.env.TDV2_943_ORDINARY || 'pass', info.retry, 'ORDINARY');
});

test('TDV2-943 quarantine target', {tag:'@tdv2-943-quarantine'}, async ({}, info) => {
  await outcome(process.env.TDV2_943_QUARANTINE || 'pass', info.retry, 'QUARANTINE');
});

test('TDV2-943 passing reference', {tag:'@tdv2-943-reference'}, async () => {});
