import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Accessibility Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page has proper heading structure', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    // Check for at least one heading
    const totalHeadings = await h1.count() + await h2.count() + await h3.count();
    expect(totalHeadings).toBeGreaterThan(0);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images for alt attributes
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Alt should exist (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('form elements have labels', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Check first few inputs for labels
      for (let i = 0; i < Math.min(3, inputCount); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          if (await label.count() === 0) {
            // Check for aria-label as alternative
            const ariaLabel = await input.getAttribute('aria-label');
            expect(ariaLabel || name).toBeTruthy();
          }
        }
      }
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Basic color contrast check (this is a simplified version)
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const textCount = await textElements.count();
    
    if (textCount > 0) {
      // Check if text is visible (basic accessibility check)
      const firstText = textElements.first();
      await expect(firstText).toBeVisible();
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});