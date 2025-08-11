import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Visual Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('homepage visual regression', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('responsive design visual test', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png');
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('homepage-tablet.png');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('homepage-desktop.png');
  });

  test('header component visual test', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const header = page.locator('header, .header, #header, [role="banner"]').first();
    
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('header.png');
    }
  });

  test('footer component visual test', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const footer = page.locator('footer, .footer, #footer, [role="contentinfo"]').first();
    
    if (await footer.isVisible()) {
      await expect(footer).toHaveScreenshot('footer.png');
    }
  });
});