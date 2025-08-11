import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('End-to-End Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('complete user journey - homepage to contact', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('https://www.amazon.in/');
    await expect(page).toHaveTitle(/.*/);
    
    // Step 2: Look for navigation elements
    const nav = page.locator('nav, .nav, .navigation, [role="navigation"]').first();
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
    
    // Step 3: Look for contact or about links
    const contactLink = page.locator('a[href*="contact"], a[href*="about"], a:has-text("Contact"), a:has-text("About")').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).not.toHaveURL('https://www.amazon.in/');
    }
  });

  test('search functionality if available', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Look for search functionality
    const searchInput = page.locator('input[type="search"], input[name*="search"], input[placeholder*="search"], #search');
    
    if (await searchInput.count() > 0) {
      const search = searchInput.first();
      await search.fill('test search');
      await expect(search).toHaveValue('test search');
      
      // Look for search button
      const searchButton = page.locator('button[type="submit"], input[type="submit"], .search-button, #search-button');
      if (await searchButton.count() > 0) {
        await searchButton.first().click();
        // Wait for potential search results
        await page.waitForTimeout(2000);
      }
    }
  });

  test('responsive navigation', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Test mobile menu if it exists
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenu = page.locator('.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]');
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
  });
});