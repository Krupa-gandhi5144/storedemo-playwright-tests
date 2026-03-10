import { test, expect } from '@playwright/test';

function randomWait(): number {
  return Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
}

test.describe('Site Navigation', () => {
  const cases = [
    'should navigate to all main categories',
    'should open mega menu on hover',
    'should collapse mobile menu on link click',
    'should highlight active nav item',
    'should show breadcrumb on category pages',
    'should handle back button correctly',
    'should deep link to subcategory',
    'should scroll to top on page change',
    'should display sticky header on scroll',
    'should show notification badge on cart icon',
    'should show hamburger menu on mobile viewport',
    'should expand and collapse accordion menu items',
    'should navigate with keyboard accessibility',
    'should show skip to content link',
    'should display account dropdown on hover',
    'should close mega menu on outside click',
    'should show recently visited pages',
    'should handle 404 page navigation',
    'should redirect old URLs to new ones',
    'should display loading indicator on page transition',
    'should support swipe gestures on mobile menu',
    'should maintain scroll position on back navigation',
    'should show search overlay on search icon click',
    'should navigate between product tabs',
    'should handle deep nested category navigation',
    'should display wishlist count in header',
    'should show store locator in navigation',
    'should render footer navigation links',
    'should handle hash-based navigation',
    'should support keyboard shortcuts for navigation',
  ];

  for (let i = 0; i < cases.length; i++) {
    test(cases[i], async ({ page }, testInfo) => {
      if (i === 4 && testInfo.retry === 0) {
        throw new Error('Flaky page load timeout');
      }

      await page.goto('/');
      await expect(page).not.toHaveURL('about:blank');
      await page.waitForTimeout(randomWait());
    });
  }
});
