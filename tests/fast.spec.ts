import { test, expect } from '@playwright/test';

test.describe.only('Fast test suite', () => {

  // ✅ PASSING TESTS (5)bb

  test('pass 1 - basic math', async () => {
    expect(1 + 1).toBe(2);
  });

  test('pass 2 - string match', async () => {
    expect('qa').toContain('q');
  });

  test('pass 3 - boolean check', async () => {
    expect(true).toBeTruthy();
  });

  test('pass 4 - array length', async () => {
    expect([1, 2, 3]).toHaveLength(3);
  });

  test('pass 5 - object equality', async () => {
    expect({ a: 1 }).toEqual({ a: 1 });
  });


  // ❌ FAILING TESTS (4)

  test('fail 1 - wrong math', async () => {
    expect(1 + 1).toBe(3);
  });

  test('fail 2 - string mismatch', async () => {
    expect('automation').toContain('z');
  });

  test('fail 3 - false check', async () => {
    expect(false).toBeTruthy();
  });

  test('fail 4 - wrong length', async () => {
    expect([1, 2]).toHaveLength(3);
  });

});