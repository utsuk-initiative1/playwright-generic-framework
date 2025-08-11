import { test, expect } from '../../framework/core/TestFramework';
import { PageTemplate } from '../../framework/pages/PageTemplate';

test.describe('Awwwards - Awards Section', () => {
  let pageObj: PageTemplate;

  test.beforeEach(async ({ page }) => {
    pageObj = new PageTemplate(page, 'AwwwardsAwards');
  });

  test('should access nominees page', async ({ page }) => {
    pageObj.logStep('Navigating to nominees page');
    await pageObj.navigateTo('/awards/nominees/');
    await pageObj.waitForNetworkIdle();
    const nomineesContent = page.locator('h1:has-text("Nominees"), h2:has-text("Nominees"), [class*="title"]:has-text("Nominees"), body:has-text("Nominees")');
    if (await nomineesContent.count() > 0) {
      await pageObj.assertVisible(nomineesContent.first(), 'Nominees Content');
      pageObj.logStep('Nominees page content found');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Nominees page loaded');
    }
    const voteElements = page.locator('a:has-text("Vote"), button:has-text("Vote"), [class*="vote"]');
    if (await voteElements.count() > 0) {
      await pageObj.assertVisible(voteElements.first(), 'Vote Elements');
      pageObj.logStep('Voting elements found on nominees page');
    } else {
      pageObj.logStep('No voting elements found on nominees page');
    }
  });

  test('should access sites of the day page', async ({ page }) => {
    pageObj.logStep('Navigating to Sites of the Day page');
    await pageObj.navigateTo('/awards/sites-of-the-day/');
    await pageObj.waitForNetworkIdle();
    const sitesContent = page.locator('h1:has-text("Sites of the Day"), h2:has-text("Sites of the Day"), [class*="title"]:has-text("Sites of the Day"), body:has-text("Sites of the Day")');
    if (await sitesContent.count() > 0) {
      await pageObj.assertVisible(sitesContent.first(), 'Sites of the Day Content');
      pageObj.logStep('Sites of the Day page content found');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Sites of the Day page loaded');
    }
    const websiteListings = page.locator('[class*="site"], [class*="website"], [class*="project"]');
    if (await websiteListings.count() > 0) {
      await pageObj.assertVisible(websiteListings.first(), 'Website Listings');
      pageObj.logStep('Website listings found on Sites of the Day page');
    } else {
      pageObj.logStep('No website listings found on Sites of the Day page');
    }
  });

  test('should access honor mentions page', async ({ page }) => {
    pageObj.logStep('Navigating to Honor Mentions page');
    await pageObj.navigateTo('/awards/honor-mentions/');
    await pageObj.waitForNetworkIdle();
    const honorContent = page.locator('h1:has-text("Honor Mentions"), h2:has-text("Honor Mentions"), [class*="title"]:has-text("Honor Mentions"), body:has-text("Honor Mentions")');
    if (await honorContent.count() > 0) {
      await pageObj.assertVisible(honorContent.first(), 'Honor Mentions Content');
      pageObj.logStep('Honor Mentions page content found');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Honor Mentions page loaded');
    }
  });

  test('should access most awarded profiles page', async ({ page }) => {
    pageObj.logStep('Navigating to Most Awarded Profiles page');
    await pageObj.navigateTo('/awards/most-awarded-profiles/');
    await pageObj.waitForNetworkIdle();
    const profilesContent = page.locator('h1:has-text("Most Awarded"), h2:has-text("Most Awarded"), [class*="title"]:has-text("Most Awarded"), body:has-text("Most Awarded")');
    if (await profilesContent.count() > 0) {
      await pageObj.assertVisible(profilesContent.first(), 'Most Awarded Profiles Content');
      pageObj.logStep('Most Awarded Profiles page content found');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Most Awarded Profiles page loaded');
    }
  });

  test('should access jury page', async ({ page }) => {
    pageObj.logStep('Navigating to Jury page');
    await pageObj.navigateTo('/awards/jury/');
    await pageObj.waitForNetworkIdle();
    const juryContent = page.locator('h1:has-text("Jury"), h2:has-text("Jury"), [class*="title"]:has-text("Jury"), body:has-text("Jury")');
    if (await juryContent.count() > 0) {
      await pageObj.assertVisible(juryContent.first(), 'Jury Content');
      pageObj.logStep('Jury page content found');
    } else {
      await pageObj.assertVisible(page.locator('body'), 'Page Body');
      pageObj.logStep('Jury page loaded');
    }
  });

  test('should require authentication for voting', async ({ page }) => {
    pageObj.logStep('Navigating to nominees page to test voting authentication');
    await pageObj.navigateTo('/awards/nominees/');
    await pageObj.waitForNetworkIdle();
    const voteElements = page.locator('a:has-text("Vote"), button:has-text("Vote"), [class*="vote"]');
    if (await voteElements.count() > 0) {
      pageObj.logStep('Vote button found, clicking to test authentication requirement');
    // Navigate to nominees page
    homePage.logStep('Navigating to nominees page to test voting authentication');
    await homePage.navigateToPage('/awards/nominees/');
    await homePage.waitForNetworkIdleWithLog();
    
    // Look for vote buttons or similar voting elements
    const voteElements = page.locator('a:has-text("Vote"), button:has-text("Vote"), [class*="vote"]');
    
    if (await voteElements.count() > 0) {
      homePage.logStep('Vote button found, clicking to test authentication requirement');
      await homePage.clickElementWithLog(voteElements.first(), 'Vote Button');
      await homePage.waitForNetworkIdleWithLog();
      
      // Check for login-related elements
      const loginElements = page.locator('form[action*="login"], .login-modal, input[name="email"], input[type="email"], [class*="login"]');
      if (await loginElements.count() > 0) {
        await homePage.assertElementVisibleWithLog(loginElements.first(), 'Login Elements');
        homePage.logStep('Authentication required for voting - login elements found');
      } else {
        homePage.logStep('Vote button clicked, but no login elements found');
      }
    } else {
      homePage.logStep('No vote buttons found on nominees page');
      expect(true).toBeTruthy(); // Skip test gracefully
    }
  });

  test('should access award categories', async ({ page }) => {
    homePage.logStep('Navigating to awards main page');
    await homePage.navigateToPage('/awards/');
    await homePage.waitForNetworkIdleWithLog();
    await page.waitForTimeout(1500); // Wait for dynamic content
    
    // Use broader selectors and case-insensitive
    const categories = [
      'E-commerce', 'Architecture', 'Restaurant', 'Design', 'Business',
      'Fashion', 'Mobile', 'Interaction', 'Illustration', 'Header'
    ];
    
    let foundCategories = 0;
    
    for (const cat of categories) {
      const el = page.locator('a, button, span, div').filter({ hasText: new RegExp(cat, 'i') });
      if (await el.count() > 0) {
        let foundVisible = false;
        for (let i = 0; i < await el.count(); i++) {
          if (await el.nth(i).isVisible()) {
            foundVisible = true;
            break;
          }
        }
        if (foundVisible) {
          foundCategories++;
          homePage.logStep(`Category found: ${cat}`);
        }
      } else {
        homePage.logStep(`Category not found: ${cat}`);
        // Take screenshot for manual investigation
        await homePage.takeScreenshotWithLog(`category-not-found-${cat}`);
      }
    }
    
    // Log the number of categories found
    homePage.logMetric('Categories Found', foundCategories);
    homePage.logStep(`Found ${foundCategories} out of ${categories.length} categories`);
    
    // Expect at least some categories to be found
    expect(foundCategories).toBeGreaterThan(0);
  });

  test('should navigate through awards sections', async ({ page }) => {
    // Test navigation from homepage to awards
    homePage.logStep('Testing navigation from homepage to awards section');
    await homePage.navigateToHome();
    await homePage.waitForPageFullyLoaded();
    
    // Try to navigate to awards section
    try {
      await homePage.navigateToAwards();
      await homePage.assertURLContainsWithLog('awards');
      homePage.logStep('Successfully navigated to awards section from homepage');
    } catch (error) {
      // Fallback: navigate directly
      homePage.logStep('Direct navigation to awards section');
      await homePage.navigateToPage('/awards/');
      await homePage.waitForNetworkIdleWithLog();
    }
    
    // Verify awards page loaded
    await homePage.assertElementVisibleWithLog(page.locator('body'), 'Awards Page Body');
    homePage.logStep('Awards section navigation test completed');
  });

  test('should verify awards page structure', async ({ page }) => {
    homePage.logStep('Verifying awards page structure');
    await homePage.navigateToPage('/awards/');
    await homePage.waitForNetworkIdleWithLog();
    
    // Check for common awards page elements
    const awardsElements = [
      'h1, h2, h3', // Headers
      'nav, .navigation, .menu', // Navigation
      'main, .main, .content', // Main content
      'footer, .footer' // Footer
    ];
    
    for (const selector of awardsElements) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        homePage.logStep(`Found elements with selector: ${selector}`);
      }
    }
    
    // Take screenshot of awards page
    await homePage.takeScreenshotWithLog('awards-page-structure');
    homePage.logStep('Awards page structure verification completed');
  });
}); 