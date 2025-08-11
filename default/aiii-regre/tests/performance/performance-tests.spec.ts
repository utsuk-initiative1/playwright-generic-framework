import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Performance Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://www.amazon.in/');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('DOM content loaded quickly', async ({ page }) => {
    const domContentLoaded = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            resolve(performance.now());
          });
        } else {
          resolve(performance.now());
        }
      });
    });
    
    // DOM should be ready within 5 seconds
    expect(domContentLoaded).toBeLessThan(5000);
  });

  test('resource loading performance', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalResources: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.loadComplete).toBeLessThan(5000);
  });

  test('memory usage is reasonable', async ({ page }) => {
    await page.goto('https://www.amazon.in/');
    
    // Wait for page to stabilize
    await page.waitForTimeout(2000);
    
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    if (memoryInfo) {
      console.log('Memory usage:', memoryInfo);
      
      // Check if memory usage is reasonable (less than 100MB)
      const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      expect(usedMemoryMB).toBeLessThan(100);
    }
  });
});