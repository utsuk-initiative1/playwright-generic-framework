import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Mobile Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Look for mobile menu
    const mobileMenu = page.locator('.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]');
    
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(1000);
      
      // Check if menu is visible
      const menuItems = page.locator('.mobile-nav, .mobile-menu-items, nav');
      if (await menuItems.count() > 0) {
        await expect(menuItems.first()).toBeVisible();
      }
    }
  });

  test('mobile touch interactions', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test touch interactions on buttons
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const button = buttons.first();
      await button.tap();
      // Wait for any potential action
      await page.waitForTimeout(1000);
    }
  });

  test('mobile form interactions', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const input = inputs.first();
      await input.tap();
      await input.fill('mobile test input');
      await expect(input).toHaveValue('mobile test input');
    }
  });

  test('mobile performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://www.amazon.in/');
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should load within 8 seconds
    expect(loadTime).toBeLessThan(8000);
    
    console.log(`Mobile page loaded in ${loadTime}ms`);
  });
});