import { test, expect } from '@playwright/test';

test.describe('Fast test suite', { tag: '@FastTestSuite' }, () => {

  // ✅ PASSING TESTS (5)bb

  test('pass 1 - basic math', { tag: '@Pass1BasicMath' }, async () => {
    expect(1 + 1).toBe(2);
  });

  test('pass 2 - string match', { tag: '@Pass2StringMatch' }, async () => {
    expect('qa').toContain('q');
  });

  test('pass 3 - boolean check', { tag: '@Pass3BooleanCheck' }, async () => {
    expect(true).toBeTruthy();
  });

  test('pass 4 - array length', { tag: '@Pass4ArrayLength' }, async () => {
    expect([1, 2, 3]).toHaveLength(3);
  });

  test('pass 5 - object equality', { tag: '@Pass5ObjectEquality' }, async () => {
    expect({ a: 1 }).toEqual({ a: 1 });
  });


  // ❌ FAILING TESTS (4)

  test('fail 1 - wrong math', { tag: '@Fail1WrongMath' }, async () => {
    expect(1 + 1).toBe(3);
  });

  test('fail 2 - string mismatch', { tag: '@Fail2StringMismatch' }, async () => {
    expect('automation').toContain('z');
  });

  test('fail 3 - false check', { tag: '@Fail3FalseCheck' }, async () => {
    expect(false).toBeTruthy();
  });

  test('fail 4 - wrong length', { tag: '@Fail4WrongLength' }, async () => {
    expect([1, 2]).toHaveLength(3);
  });

});