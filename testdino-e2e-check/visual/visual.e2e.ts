// TDV2-1133 item 10: visual comparison for a failed toHaveScreenshot.
// 1st run with --update-snapshots stores the baseline.
// 2nd run with VISUAL_CHANGE=1 paints a banner, so the comparison fails
// and TestDino should show Expected / Actual / Diff.
import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('visual', { tags: ['visual'] }, () => {
  test('home page matches its stored screenshot', async ({ app, screen, browser }) => {
    await app.open('/');
    await expect(screen.getByTestId('header-cart-icon')).toBeVisible();
    if (process.env.VISUAL_CHANGE === '1') {
      await browser.evaluate(() => {
        const banner = document.createElement('div');
        banner.textContent = 'TDV2-1133 visual change';
        banner.style.cssText =
          'position:fixed;top:120px;left:80px;width:600px;height:200px;background:#e11;color:#fff;font:bold 40px sans-serif;z-index:99999;display:flex;align-items:center;justify-content:center';
        document.body.appendChild(banner);
      });
    }
    await expect(screen).toHaveScreenshot('home', { maxDiffPixelRatio: 0.01 });
  });
});
