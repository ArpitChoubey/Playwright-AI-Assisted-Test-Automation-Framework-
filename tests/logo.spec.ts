import { test, expect } from '@playwright/test';

test('Select site logo and take screenshot', async ({ page }) => {
  await page.goto('https://sparklecartonline.com/');

  const logo = page.locator('img[alt*="logo"i], [class*="logo"] img, .site-logo img, .logo img, header img').first();
  await expect(logo).toBeVisible({ timeout: 10000 });

  await logo.screenshot({ path: 'tests/logo-screenshot.png' });
});
