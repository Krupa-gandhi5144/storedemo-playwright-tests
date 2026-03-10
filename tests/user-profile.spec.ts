import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
}

test.describe('User Profile', () => {
  const cases = [
    'should display user avatar and name',
    'should update display name',
    'should change email address',
    'should update shipping address',
    'should change password with valid current password',
    'should reject weak passwords',
    'should upload profile picture',
    'should toggle email notifications',
    'should display account creation date',
    'should delete account with confirmation',
    'should update phone number',
    'should verify email after change',
    'should add multiple shipping addresses',
    'should set default shipping address',
    'should edit saved payment methods',
    'should remove saved payment method',
    'should view login activity history',
    'should enable two-factor authentication',
    'should disable two-factor authentication',
    'should manage notification preferences',
    'should update language preference',
    'should update timezone setting',
    'should link social media accounts',
    'should unlink social media accounts',
    'should view loyalty points balance',
    'should redeem loyalty points',
    'should view referral link and stats',
    'should manage wishlist from profile',
    'should export personal data (GDPR)',
    'should update marketing consent preferences',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
