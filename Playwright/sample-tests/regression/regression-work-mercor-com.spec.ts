import { test, expect } from '@playwright/test';

test.describe('Regression Test Suite for https://work.mercor.com/', () => {

  test.describe('Critical Functionality', () => {
    test('Homepage loads correctly', async ({ page }) => {
      await page.goto('https://work.mercor.com/');
      await expect(page).toHaveTitle(/Mercor/); // Adjust expected title as needed
      await expect(page.locator('body')).toBeVisible();
    });

    test('Navigation menu functionality', async ({ page }) => {
      await page.goto('https://work.mercor.com/');
      // TODO: Update selector for navigation links as per actual site structure
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        const text = await link.textContent();
        try {
          await link.click();
          await expect(page).toHaveURL(/work\.mercor\.com\/.*$/);
          await page.goBack();
        } catch (error) {
          console.error(`Error clicking link "${text}": `, error);
          await page.screenshot({ path: `screenshots/nav-error-${text}.png` });
          throw error;
        }
      }
    });

    test('Contact Form Submission', async ({ page }) => {
      await page.goto('https://work.mercor.com/contact'); // Update URL if needed
      // TODO: Update selectors for form fields
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.fill('textarea[name="message"]', 'This is a test message.');
      await page.click('button[type="submit"]');
      // TODO: Update selector for success message
      await expect(page.locator('h1:has-text("Thank you")')).toBeVisible();
    });
  });

  test.describe('UI/UX Regression', () => {
    test('Responsive design', async ({ page }) => {
      await page.goto('https://work.mercor.com/');
      const viewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1280, height: 800 }
      ];
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await expect(page).toHaveTitle(/Mercor/);
        await page.screenshot({ path: `screenshots/responsive-${viewport.width}x${viewport.height}.png` });
      }
    });
    // TODO: Add accessibility and visual element tests
  });

  test.describe('Performance Regression', () => {
    test('Homepage load time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://work.mercor.com/');
      const loadTime = Date.now() - startTime;
      console.log(`Homepage load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThanOrEqual(3000); // Adjust threshold as needed
    });
    // TODO: Add more performance tests
  });

  test.describe('Edge Cases and Error Scenarios', () => {
    test('Invalid form input', async ({ page }) => {
      await page.goto('https://work.mercor.com/contact'); // Update URL if needed
      // TODO: Update selectors for form fields and error message
      await page.fill('#email', 'invalid-email');
      await page.click('button[type="submit"]');
      await expect(page.locator('.error-message')).toBeVisible();
    });
    // TODO: Add network failure, 404, 500 error tests
  });

  // TODO: Add Data Integrity and Security tests as needed

});