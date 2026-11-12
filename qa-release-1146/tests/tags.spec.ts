import { test } from '@playwright/test'; import { step } from './h';
test('q46 tag upper', { tag: '@CRITICAL' }, step('tupper'));
test('q46 tag title', { tag: '@Critical' }, step('ttitle'));
test('q46 tag P0', { tag: '@P0' }, step('tp0'));
test('q46 tag critical-path', { tag: '@critical-path' }, step('tpath'));
test('q46 tag p01', { tag: '@p01' }, step('tp01'));
