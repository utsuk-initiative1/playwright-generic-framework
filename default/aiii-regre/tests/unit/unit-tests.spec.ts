import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Unit Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page title validation', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    const title = await page.title();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Document');
  });

  test('meta tags validation', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Check for essential meta tags
    const viewport = page.locator('meta[name="viewport"]');
    const charset = page.locator('meta[charset]');
    
    if (await viewport.count() > 0) {
      await expect(viewport.first()).toBeAttached();
    }
    
    if (await charset.count() > 0) {
      await expect(charset.first()).toBeAttached();
    }
  });

  test('favicon validation', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const favicon = page.locator('link[rel*="icon"]');
    if (await favicon.count() > 0) {
      await expect(favicon.first()).toBeAttached();
    }
  });

  test('language attribute validation', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    
    expect(lang).toBeTruthy();
    expect(lang.length).toBeGreaterThan(0);
  });
});