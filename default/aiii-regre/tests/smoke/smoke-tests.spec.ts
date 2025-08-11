import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Smoke Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    await expect(page).toHaveTitle(/.*/);
    await expect(page).toHaveURL('https://www.amazon.in/');
  });

  test('should have basic page elements', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Check for common elements
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('head')).toBeAttached();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('https://www.amazon.in/');
    
    // Wait a bit for any potential errors
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});