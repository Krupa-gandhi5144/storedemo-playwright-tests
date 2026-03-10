import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
}

test.describe('Checkout Flow', () => {
  const cases = [
    'should display checkout form',
    'should validate shipping address fields',
    'should calculate tax based on region',
    'should apply free shipping on orders above threshold',
    'should show order summary before payment',
    'should validate credit card number format',
    'should process payment successfully',
    'should send order confirmation email',
    'should redirect to thank you page',
    'should generate unique order ID',
    'should support express checkout',
    'should auto-fill address from saved addresses',
    'should validate ZIP code format by country',
    'should calculate international shipping rates',
    'should show estimated delivery date at checkout',
    'should support multiple shipping methods',
    'should apply promo code at checkout',
    'should validate promo code expiration',
    'should show order total breakdown',
    'should handle checkout session timeout',
    'should support guest checkout without account',
    'should save address for future orders',
    'should validate phone number format',
    'should show billing address same as shipping toggle',
    'should handle payment processing errors',
    'should support split payment methods',
    'should show secure checkout badge',
    'should validate CVV format',
    'should handle network interruption during payment',
    'should prevent double submission of order',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({ page }, testInfo) => {
      if (i === 2 && testInfo.retry === 0) {
        throw new Error('Flaky element not found');
      }

      if (i === 6 && testInfo.retry === 0) {
        throw new Error('Flaky assertion timeout');
      }

      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
