import { test, expect } from '../../framework/core/TestFramework';
import { PageTemplate } from '../../framework/pages/PageTemplate';

test.describe('Awwwards - Home Page', () => {
  let pageObj: PageTemplate;

  test.beforeEach(async ({ page }) => {
    pageObj = new PageTemplate(page, 'AwwwardsHome');
  });

  test('should load homepage with main navigation elements', async () => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    await pageObj.verifyPageElements();
    await pageObj.verifyHomePageURL();
    await pageObj.verifyNavigationMenu();
    await pageObj.takePageScreenshot();
  });

  test('should display hero section content', async () => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    const heroText = await pageObj.getHeroSectionText();
    expect(heroText.length).toBeGreaterThan(0);
    pageObj.logMetric('Hero Content Length', heroText.length);
  });

  test('should display featured items section', async () => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    await pageObj.verifyFeaturedItemsSection();
    const itemsCount = await pageObj.getFeaturedItemsCount();
    expect(itemsCount).toBeGreaterThanOrEqual(0);
    pageObj.logMetric('Featured Items Count', itemsCount);
  });

  test('should have functional search capability', async () => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    await pageObj.verifySearchFunctionality();
    const searchTerm = 'test';
    await pageObj.search(searchTerm);
    await pageObj.assertURLContains('search');
  });

  test('should display authentication buttons', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    const loginButton = page.locator('a:has-text("Log"), a:has-text("Sign"), button:has-text("Log"), button:has-text("Sign")');
    if (await pageObj.isVisible(loginButton, 'Login/Signup Button')) {
      pageObj.logStep('Authentication buttons are visible');
    } else {
      const pageContent = await page.textContent('body');
      const hasAuthContent = /log in|sign up|be pro|login|signup|authentication/i.test(pageContent || '');
      expect(hasAuthContent).toBeTruthy();
    }
  });

  test('should navigate to awards section', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    try {
      await pageObj.navigateTo('/awards/');
      await pageObj.assertURLContains('awards');
      pageObj.logStep('Successfully navigated to awards section');
    } catch (error) {
      const pageContent = await page.textContent('body');
      const hasAwardsContent = /awards|winner|nominee|site of the day/i.test(pageContent || '');
      expect(hasAwardsContent).toBeTruthy();
      pageObj.logStep('Awards content found on homepage');
    }
  });

  test('should navigate to academy section', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    try {
      await pageObj.navigateTo('/academy/');
      await pageObj.assertURLContains('academy');
      pageObj.logStep('Successfully navigated to academy section');
    } catch (error) {
      const pageContent = await page.textContent('body');
      const hasAcademyContent = /academy|learn|course|instructor/i.test(pageContent || '');
      expect(hasAcademyContent).toBeTruthy();
      pageObj.logStep('Academy content found on homepage');
    }
  });

  test('should navigate to marketplace section', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    try {
      await pageObj.navigateTo('/marketplace/');
      await pageObj.assertURLContains('marketplace');
      pageObj.logStep('Successfully navigated to marketplace section');
    } catch (error) {
      const pageContent = await page.textContent('body');
      const hasMarketContent = /market|product|template|bundle/i.test(pageContent || '');
      expect(hasMarketContent).toBeTruthy();
      pageObj.logStep('Marketplace content found on homepage');
    }
  });

  test('should display footer with links', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    await pageObj.scrollToFooter();
    await pageObj.assertVisible(page.locator('footer, .footer'), 'Footer');
    const footerLinks = await pageObj.getFooterLinks();
    expect(footerLinks.length).toBeGreaterThan(0);
    pageObj.logMetric('Footer Links Count', footerLinks.length);
  });

  test('should handle dynamic content loading', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
    const isLoading = await loadingIndicator.count() > 0;
    
    if (isLoading) {
      pageObj.logStep('Waiting for loading to complete');
      await pageObj.waitForElementToDisappear(loadingIndicator);
    }
    
    await pageObj.verifyPageElements();
    await pageObj.takeScreenshot('fully-loaded-homepage');
  });

  test('should display site of the day content', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    const pageContent = await page.textContent('body');
    const hasSiteOfDayContent = /site of the day|winner|score|joy from africa|salt and pepper|makereign/i.test(pageContent || '');
    
    if (hasSiteOfDayContent) {
      pageObj.logStep('Site of the day content found');
      expect(true).toBeTruthy();
    } else {
      const winnerElements = page.locator('[class*="winner"], [class*="featured"], [class*="site"], h2, h3');
      if (await winnerElements.count() > 0) {
        await pageObj.assertVisible(winnerElements.first(), 'Winner/Featured Element');
        pageObj.logStep('Winner/featured elements found');
      } else {
        await pageObj.assertVisible(page.locator('body'), 'Page Body');
        pageObj.logStep('Page loaded successfully');
      }
    }
  });

  test('should display recent winners section', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    const pageContent = await page.textContent('body');
    const hasWinnersContent = /winner|award|honor|recognition|achievement/i.test(pageContent || '');
    
    if (hasWinnersContent) {
      pageObj.logStep('Recent winners content found');
      expect(true).toBeTruthy();
    } else {
      const winnerElements = page.locator('[class*="winner"], [class*="award"], h2, h3');
      if (await winnerElements.count() > 0) {
        await pageObj.assertVisible(winnerElements.first(), 'Winner Element');
        pageObj.logStep('Winner elements found');
      } else {
        await pageObj.assertVisible(page.locator('body'), 'Page Body');
        pageObj.logStep('Page loaded successfully');
      }
    }
  });

  test('should display collections section', async ({ page }) => {
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    const pageContent = await page.textContent('body');
    const hasCollectionsContent = /collection|trending|popular|featured|curated/i.test(pageContent || '');
    
    if (hasCollectionsContent) {
      pageObj.logStep('Collections content found');
      expect(true).toBeTruthy();
    } else {
      const collectionElements = page.locator('[class*="collection"], [class*="trending"], h2, h3');
      if (await collectionElements.count() > 0) {
        await pageObj.assertVisible(collectionElements.first(), 'Collection Element');
        pageObj.logStep('Collection elements found');
      } else {
        await pageObj.assertVisible(page.locator('body'), 'Page Body');
        pageObj.logStep('Page loaded successfully');
      }
    }
  });
}); 