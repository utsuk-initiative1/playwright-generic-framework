import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Integration Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('CSS and JavaScript integration', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Check if CSS is loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    if (await stylesheets.count() > 0) {
      await expect(stylesheets.first()).toBeAttached();
    }
    
    // Check if JavaScript is working
    const result = await page.evaluate(() => {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    });
    
    expect(result).toBe(true);
  });

  test('external resource integration', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Check for external resources (fonts, analytics, etc.)
    const externalResources = page.locator('link[href*="//"], script[src*="//"]');
    const resourceCount = await externalResources.count();
    
    if (resourceCount > 0) {
      // Log external resources for review
      console.log(`Found ${resourceCount} external resources`);
    }
  });

  test('form submission integration', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      const action = await form.getAttribute('action');
      const method = await form.getAttribute('method');
      
      expect(action).toBeTruthy();
      expect(method).toBeTruthy();
    }
  });
});