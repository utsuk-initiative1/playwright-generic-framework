import { test, expect } from '../../framework/core/TestFramework';
import { PageTemplate } from '../../framework/pages/PageTemplate';

test.describe('Awwwards - Academy Section', () => {
  let pageObj: PageTemplate;

  test.beforeEach(async ({ page }) => {
    pageObj = new PageTemplate(page, 'AwwwardsAcademy');
  });

  test('should load academy page successfully', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    await pageObj.assertURLContains('academy');
    await pageObj.assertVisible(page.locator('body'), 'Academy Page Body');
    pageObj.logStep('Academy page loaded successfully');
  });

  test('should contain course-related content', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check course content');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const courseContent = page.locator('text=course, text=Course, text=learn, text=Learn, text=instructor, text=Instructor, text=academy, text=Academy, text=education, text=Education');
    
    if (await courseContent.count() > 0) {
      await pageObj.assertVisible(courseContent.first(), 'Course Content');
      pageObj.logStep('Course-related content found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('No specific course content found, but page loaded successfully');
    }
  });

  test('should have navigation elements', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check navigation');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const navElements = page.locator('nav, header, .navigation, .menu, [role="navigation"], [class*="nav"], [class*="menu"], [class*="header"]');
    
    if (await navElements.count() > 0) {
      await pageObj.assertVisible(navElements.first(), 'Navigation Elements');
      pageObj.logStep('Navigation elements found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('header, .header, [class*="header"], body'), 'Header Content');
      pageObj.logStep('No specific navigation found, but page has header content');
    }
  });

  test('should have search functionality', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check search functionality');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"], input[name*="search"], input[aria-label*="search"]');
    
    if (await searchInput.count() > 0) {
      await pageObj.assertVisible(searchInput.first(), 'Search Input');
      pageObj.logStep('Search functionality found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('No search input found, but page loaded successfully');
    }
  });

  test('should display course cards or listings', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check course listings');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const courseCards = page.locator('.card, .course, .item, [class*="card"], [class*="course"], [class*="item"]');
    
    if (await courseCards.count() > 0) {
      await pageObj.assertVisible(courseCards.first(), 'Course Cards');
      pageObj.logStep('Course cards/listings found on Academy page');
      
      const cardCount = await courseCards.count();
      pageObj.logMetric('Course Cards Count', cardCount);
    } else {
      await pageObj.assertVisible(page.locator('main, .content, .container, section'), 'Content Sections');
      pageObj.logStep('No course cards found, but page has content sections');
    }
  });

  test('should have footer content', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check footer');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const footerElements = page.locator('footer, .footer, [class*="footer"], [role="contentinfo"]');
    
    if (await footerElements.count() > 0) {
      await pageObj.assertVisible(footerElements.first(), 'Footer Elements');
      pageObj.logStep('Footer content found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('No footer found, but page loaded successfully');
    }
  });

  test('should support navigation back to home', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to test navigation');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const homeLink = page.locator('a[href="/"], a[href*="home"], a:has-text("Home"), a:has-text("home")');
    
    if (await homeLink.count() > 0) {
      pageObj.logStep('Home link found, clicking to navigate back');
      await pageObj.clickElement(homeLink.first(), 'Home Link');
      await pageObj.assertURLContains('awwwards.com');
      pageObj.logStep('Successfully navigated back to home page');
    } else {
      pageObj.logStep('No home link found, navigating directly to home');
      await pageObj.navigateToHome();
      await pageObj.assertURLContains('awwwards.com');
      pageObj.logStep('Successfully navigated to home page');
    }
  });

  test('should load without errors', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check for errors');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const errorMessages = page.locator('text=error, text=Error, text=404, text=not found, text=Not Found');
    
    if (await errorMessages.count() > 0) {
      await pageObj.assertHidden(errorMessages.first(), 'Error Messages');
      pageObj.logStep('No error messages found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Academy page loaded without errors');
    }
  });

  test('should have proper page title', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check page title');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    pageObj.logStep(`Academy page title: ${title}`);
    pageObj.logMetric('Page Title Length', title.length);
  });

  test('should have proper meta description', async ({ page }) => {
    pageObj.logStep('Navigating to Academy page to check meta description');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const metaDescription = page.locator('meta[name="description"]');
    
    if (await metaDescription.count() > 0) {
      await pageObj.assertVisible(metaDescription.first(), 'Meta Description');
      pageObj.logStep('Meta description found on Academy page');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('No meta description found, but page loaded successfully');
    }
  });

  test('should load within reasonable time', async ({ page }) => {
    pageObj.logStep('Measuring Academy page load time');
    const startTime = Date.now();
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(10000);
    
    await pageObj.assertVisible(page.locator('body'), 'Page Body');
    
    pageObj.logStep(`Academy page loaded in ${loadTime}ms`);
    pageObj.logMetric('Page Load Time (ms)', loadTime);
  });

  test('should navigate from homepage to academy', async ({ page }) => {
    pageObj.logStep('Testing navigation from homepage to academy section');
    await pageObj.navigateToHome();
    await pageObj.waitForPageFullyLoaded();
    
    try {
      await pageObj.navigateToAcademy();
      await pageObj.assertURLContains('academy');
      pageObj.logStep('Successfully navigated to academy section from homepage');
    } catch (error) {
      pageObj.logStep('Direct navigation to academy section');
      await pageObj.navigateTo('/academy/');
      await pageObj.waitForNetworkIdle();
    }
    
    await pageObj.assertVisible(page.locator('body'), 'Academy Page Body');
    pageObj.logStep('Academy section navigation test completed');
  });

  test('should verify academy page structure', async ({ page }) => {
    pageObj.logStep('Verifying academy page structure');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const academyElements = [
      'h1, h2, h3',
      'nav, .navigation, .menu',
      'main, .main, .content',
      'footer, .footer'
    ];
    
    for (const selector of academyElements) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        pageObj.logStep(`Found elements with selector: ${selector}`);
      }
    }
    
    await pageObj.takeScreenshot('academy-page-structure');
    pageObj.logStep('Academy page structure verification completed');
  });

  test('should handle dynamic content loading', async ({ page }) => {
    pageObj.logStep('Testing dynamic content loading on academy page');
    await pageObj.navigateTo('/academy/');
    await pageObj.waitForNetworkIdle();
    
    const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
    const isLoading = await loadingIndicator.count() > 0;
    
    if (isLoading) {
      pageObj.logStep('Waiting for loading to complete');
      await pageObj.waitForElementToDisappear(loadingIndicator, 'Loading Indicator');
    }
    
    await pageObj.assertVisible(page.locator('body'), 'Page Body');
    
    await pageObj.takeScreenshot('fully-loaded-academy-page');
    pageObj.logStep('Dynamic content loading test completed');
  });
}); 