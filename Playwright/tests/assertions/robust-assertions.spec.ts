import { test, expect } from '../../framework/fixtures';

test.describe('Robust Assertion Utilities', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page
    await page.goto('https://example.com');
  });

  test('should demonstrate basic UI assertions', async ({ assertions }) => {
    // Element visibility assertions
    await assertions.visible('h1', 'Main heading should be visible');
    await assertions.notVisible('.hidden-element', 'Hidden element should not be visible');
    
    // Text content assertions
    await assertions.text('h1', 'Example Domain', 'Main heading should have correct text');
    await assertions.containsText('p', 'This domain is for use in illustrative examples', 'Page should contain specific text');
    
    // Element count assertions
    await assertions.count('p', 2, 'Should have exactly 2 paragraphs');
    
    // Element state assertions
    await assertions.enabled('a', 'Link should be enabled');
    await assertions.notChecked('input[type="checkbox"]', 'Checkbox should not be checked');
  });

  test('should demonstrate form field assertions', async ({ page, assertions }) => {
    // Navigate to a form page
    await page.goto('https://httpbin.org/forms/post');
    
    // Form field assertions
    await assertions.field('input[name="custname"]', '', 'Customer name field should be empty initially');
    
    // Fill the form
    await page.fill('input[name="custname"]', 'John Doe');
    await page.fill('input[name="custtel"]', '123-456-7890');
    await page.check('input[name="size"]');
    
    // Assert form values
    await assertions.value('input[name="custname"]', 'John Doe', 'Customer name should be filled');
    await assertions.value('input[name="custtel"]', '123-456-7890', 'Phone number should be filled');
    await assertions.checked('input[name="size"]', 'Size checkbox should be checked');
  });

  test('should demonstrate element attribute and CSS assertions', async ({ assertions }) => {
    // Attribute assertions
    await assertions.attribute('a', 'href', /^https:\/\//, 'Link should have HTTPS URL');
    await assertions.attribute('h1', 'id', 'main-heading', 'Heading should have specific ID');
    
    // CSS property assertions
    await assertions.css('h1', 'display', 'block', 'Heading should be block display');
    await assertions.css('body', 'font-family', /sans-serif/, 'Body should use sans-serif font');
  });

  test('should demonstrate element positioning and dimensions', async ({ assertions }) => {
    // Element in viewport assertions
    await assertions.inViewport('h1', 'Main heading should be in viewport');
    await assertions.notInViewport('.footer', 'Footer should not be in viewport initially');
    
    // Element dimensions (with tolerance)
    await assertions.ui.assertElementDimensions('h1', 200, 50, 20, {
      message: 'Heading should have reasonable dimensions'
    });
    
    // Element position
    await assertions.ui.assertElementPosition('h1', 0, 0, 50, {
      message: 'Heading should be positioned at top-left'
    });
  });

  test('should demonstrate soft assertions', async ({ assertions }) => {
    // Use soft assertions to collect multiple failures
    await assertions.base.assert(true, 'This should pass', { soft: true });
    await assertions.base.assert(false, 'This should fail but not stop the test', { soft: true });
    await assertions.base.assert(false, 'This should also fail but not stop the test', { soft: true });
    
    // Check soft assertion failures
    const failures = assertions.getSoftAssertionFailures();
    expect(failures.length).toBe(2);
    
    // Assert all soft assertions passed (this will fail)
    try {
      await assertions.assertAllSoftAssertionsPassed();
    } catch (error) {
      expect(error.message).toContain('Soft assertions failed');
    }
    
    // Clear soft assertions
    assertions.clearSoftAssertions();
    expect(assertions.getSoftAssertionFailures().length).toBe(0);
  });

  test('should demonstrate API assertions', async ({ page, assertions }) => {
    // Make API request
    const response = await page.request.get('https://httpbin.org/json');
    
    // API response assertions
    await assertions.apiResponse(response, {
      statusCode: 200,
      contentType: 'application/json',
      responseTime: 5000,
      message: 'API response should be valid'
    });
    
    // API response content assertions
    await assertions.api.assertResponseContains(response, {
      'slideshow.author': 'Yours Truly',
      'slideshow.title': 'Sample Slide Show'
    });
    
    // API response array length
    await assertions.api.assertResponseArrayLength(response, 2, 'slideshow.slides');
    
    // API response performance
    await assertions.api.assertResponsePerformance(response, 5000);
    
    // API response size
    await assertions.api.assertResponseSize(response, 10000);
    
    // API response headers
    await assertions.api.assertCachingHeaders(response, 'no-cache');
    await assertions.api.assertSecurityHeaders(response);
  });

  test('should demonstrate JSON schema validation', async ({ page, assertions }) => {
    // Make API request
    const response = await page.request.get('https://httpbin.org/json');
    const jsonData = await response.json();
    
    // Define schema
    const schema = {
      type: 'object',
      properties: {
        slideshow: {
          type: 'object',
          properties: {
            author: { type: 'string' },
            title: { type: 'string' },
            slides: { type: 'array' }
          },
          required: ['author', 'title', 'slides']
        }
      },
      required: ['slideshow']
    };
    
    // Schema validation
    await assertions.base.assertJsonSchema(jsonData, schema, {
      strict: true,
      message: 'Response should match expected schema'
    });
  });

  test('should demonstrate array and date assertions', async ({ assertions }) => {
    // Array assertions
    const testArray = ['apple', 'banana', 'cherry'];
    await assertions.arrayLength(testArray, 3, 'Array should have 3 items');
    await assertions.arrayContains(testArray, 'banana', 'Array should contain banana');
    
    // Date assertions
    const now = new Date();
    const oneSecondLater = new Date(now.getTime() + 1000);
    await assertions.dateEquals(now, now, 100, 'Same dates should be equal');
    await assertions.dateEquals(now, oneSecondLater, 2000, 'Dates within tolerance should be equal');
  });

  test('should demonstrate file download assertions', async ({ page, assertions }) => {
    // Navigate to a page with download link
    await page.goto('https://httpbin.org/');
    
    // This test demonstrates the structure - actual file download would depend on the page
    // await assertions.fileDownloaded(/\.pdf$/, 'Should download PDF file');
  });

  test('should demonstrate accessibility assertions', async ({ assertions }) => {
    // Accessibility attribute assertions
    await assertions.ui.assertAccessibility('h1', {
      'role': 'heading',
      'aria-level': '1'
    }, {
      message: 'Heading should have proper accessibility attributes'
    });
    
    // Form validation error assertions
    await page.goto('https://httpbin.org/forms/post');
    await page.click('input[type="submit"]');
    
    // Check for validation errors
    await assertions.ui.assertFormValidationError('input[required]', 'required', {
      message: 'Required field should show validation error'
    });
  });

  test('should demonstrate custom assertion with detailed error messages', async ({ assertions }) => {
    // Custom assertion with detailed error message
    await assertions.base.assert(
      false,
      'Custom assertion failed with detailed context',
      {
        message: 'This is a custom error message with additional context',
        screenshot: true
      }
    );
  });

  test('should demonstrate assertion factory configuration', async ({ page }) => {
    // Create assertion factory with custom configuration
    const customAssertions = new AssertionFactory(page, {
      defaultTimeout: 5000,
      defaultSoft: true,
      screenshotOnFailure: false
    });
    
    // Use custom configuration
    await customAssertions.visible('h1', 'Should work with custom timeout');
    
    // Check that soft assertions are enabled by default
    await customAssertions.base.assert(false, 'This should be a soft assertion');
    expect(customAssertions.getSoftAssertionFailures().length).toBe(1);
  });

  test('should demonstrate comprehensive form validation', async ({ page, assertions }) => {
    // Navigate to a form page
    await page.goto('https://httpbin.org/forms/post');
    
    // Test form validation with multiple assertions
    const formFields = [
      { selector: 'input[name="custname"]', expectedValue: '', message: 'Customer name should be empty' },
      { selector: 'input[name="custtel"]', expectedValue: '', message: 'Phone should be empty' },
      { selector: 'input[name="custemail"]', expectedValue: '', message: 'Email should be empty' }
    ];
    
    // Assert all form fields are empty initially
    for (const field of formFields) {
      await assertions.field(field.selector, field.expectedValue, field.message);
      await assertions.empty(field.selector, `${field.selector} should be empty`);
    }
    
    // Fill form with invalid data
    await page.fill('input[name="custemail"]', 'invalid-email');
    await page.click('input[type="submit"]');
    
    // Assert validation errors
    await assertions.ui.assertFormValidationError('input[name="custemail"]', 'valid email', {
      message: 'Invalid email should show validation error'
    });
  });

  test('should demonstrate error handling and recovery', async ({ assertions }) => {
    // Test error handling with non-existent elements
    try {
      await assertions.visible('.non-existent-element', 'This should fail gracefully');
    } catch (error) {
      expect(error.message).toContain('Element should be visible');
    }
    
    // Test with soft assertions to collect multiple errors
    await assertions.visible('.non-existent-element-1', 'First non-existent element', { soft: true });
    await assertions.visible('.non-existent-element-2', 'Second non-existent element', { soft: true });
    await assertions.visible('.non-existent-element-3', 'Third non-existent element', { soft: true });
    
    // Verify all soft assertions were collected
    const failures = assertions.getSoftAssertionFailures();
    expect(failures.length).toBe(3);
    
    // Clear and continue
    assertions.clearSoftAssertions();
    
    // Test should continue with valid assertions
    await assertions.visible('h1', 'This should work after clearing soft assertions');
  });
});
