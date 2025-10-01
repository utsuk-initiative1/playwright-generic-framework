import { test, expect } from '@playwright/test';

test.describe('Allure Report Demo', () => {
  test('should visit Playwright homepage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should navigate to docs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs/);
  });

  test('should search for test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.fill('[placeholder="Search docs"]', 'test');
    await page.press('[placeholder="Search docs"]', 'Enter');
    await expect(page.locator('h1')).toContainText('Search results');
  });
});
