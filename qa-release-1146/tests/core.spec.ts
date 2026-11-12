import { test } from '@playwright/test'; import { step } from './h';
test('q46 home loads', { tag: '@smoke' }, step('home'));
test('q46 profile opens', { tag: '@smoke' }, step('profile'));
test('q46 orders list', step('orders'));
test('q46 retry pass', step('retry'));
test('q46 browser fail', step('browser'));
test('q46 plain check', step('plain'));
test('q46 slow step', step('slow'));
