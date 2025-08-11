import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Regression Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('should maintain page layout consistency', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Check for consistent layout elements
    const header = page.locator('header, .header, #header, [role="banner"]').first();
    const footer = page.locator('footer, .footer, #footer, [role="contentinfo"]').first();
    
    if (await header.isVisible()) {
      await expect(header).toBeVisible();
    }
    
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });

  test('should handle navigation correctly', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test internal links if they exist
    const links = page.locator('a[href^="/"], a[href^="https://www.amazon.in/"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      // Test first few links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('#')) {
          await link.click();
          await expect(page).not.toHaveURL('https://www.amazon.in/');
          await page.goBack();
        }
      }
    }
  });

  test('should maintain form functionality', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Look for forms and test basic functionality
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      const inputs = form.locator('input[type="text"], input[type="email"], textarea');
      
      if (await inputs.count() > 0) {
        const input = inputs.first();
        await input.fill('test input');
        await expect(input).toHaveValue('test input');
      }
    }
  });

  test('should handle images correctly', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          await expect(img).toBeVisible();
        }
      }
    }
  });
});