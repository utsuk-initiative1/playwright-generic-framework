# Robust Assertion Utilities

This document outlines the comprehensive assertion utilities system implemented to provide strong, reusable assertion capabilities with custom, detailed checks and better error handling.

## Overview

The assertion utilities system addresses the feedback requirements by providing:

- **Custom assertion utilities**: Specialized assertions for different scenarios
- **Soft vs. hard assertion logic**: Flexible assertion handling
- **Detailed error messages**: Comprehensive failure information
- **API and Schema specific assertions**: Domain-specific validation
- **Type-safe interfaces**: Full TypeScript support

## Architecture

```
framework/utils/
├── AssertionUtils.ts           # Base assertion utilities
├── ApiAssertionUtils.ts        # API-specific assertions
├── UIAssertionUtils.ts         # UI-specific assertions
├── AssertionFactory.ts         # Unified assertion factory
└── ASSERTION_UTILITIES_README.md # This documentation
```

## Core Components

### 1. AssertionUtils (Base Class)
The foundation class providing core assertion functionality:

- **Custom assertions** with detailed error messages
- **Soft vs. hard assertion logic**
- **Automatic screenshot capture** on failures
- **Element information extraction** for better error reporting

### 2. ApiAssertionUtils (API Assertions)
Specialized assertions for API testing:

- **Response status code validation**
- **Content type verification**
- **Response time performance checks**
- **JSON schema validation**
- **Header validation**
- **Security header checks**

### 3. UIAssertionUtils (UI Assertions)
Specialized assertions for UI testing:

- **Element visibility and presence**
- **Form field validation**
- **CSS property verification**
- **Accessibility attribute checks**
- **Element positioning and dimensions**
- **Form validation error detection**

### 4. AssertionFactory (Unified Interface)
A factory class that provides:

- **Unified access** to all assertion types
- **Quick assertion methods** for common scenarios
- **Configurable defaults** for timeouts and behavior
- **Soft assertion management**

## Usage Examples

### Basic Usage with Fixtures

```typescript
import { test, expect } from '../../framework/fixtures';

test('should demonstrate assertions', async ({ assertions }) => {
  // Quick assertions
  await assertions.visible('h1', 'Main heading should be visible');
  await assertions.text('h1', 'Example Domain', 'Heading should have correct text');
  await assertions.count('p', 2, 'Should have exactly 2 paragraphs');
  
  // Form field assertions
  await assertions.field('input[name="email"]', 'test@example.com', 'Email should be filled');
  await assertions.checked('input[type="checkbox"]', 'Checkbox should be checked');
});
```

### Advanced UI Assertions

```typescript
test('should demonstrate advanced UI assertions', async ({ assertions }) => {
  // Element state assertions
  await assertions.enabled('button', 'Button should be enabled');
  await assertions.disabled('input[disabled]', 'Input should be disabled');
  await assertions.focused('input[name="search"]', 'Search input should be focused');
  
  // Element positioning
  await assertions.inViewport('h1', 'Heading should be in viewport');
  await assertions.notInViewport('.footer', 'Footer should not be in viewport');
  
  // Element attributes and CSS
  await assertions.attribute('a', 'href', /^https:\/\//, 'Link should have HTTPS URL');
  await assertions.css('h1', 'display', 'block', 'Heading should be block display');
  
  // Element dimensions and position
  await assertions.ui.assertElementDimensions('h1', 200, 50, 20, {
    message: 'Heading should have reasonable dimensions'
  });
});
```

### API Assertions

```typescript
test('should demonstrate API assertions', async ({ page, assertions }) => {
  // Make API request
  const response = await page.request.get('https://api.example.com/users');
  
  // Comprehensive API response validation
  await assertions.apiResponse(response, {
    statusCode: 200,
    contentType: 'application/json',
    responseTime: 5000,
    expectedHeaders: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    }
  });
  
  // Response content validation
  await assertions.api.assertResponseContains(response, {
    'users.0.name': 'John Doe',
    'users.0.email': 'john@example.com'
  });
  
  // Array length validation
  await assertions.api.assertResponseArrayLength(response, 10, 'users');
  
  // Performance and security checks
  await assertions.api.assertResponsePerformance(response, 5000);
  await assertions.api.assertSecurityHeaders(response);
});
```

### JSON Schema Validation

```typescript
test('should demonstrate schema validation', async ({ page, assertions }) => {
  const response = await page.request.get('https://api.example.com/user/1');
  const jsonData = await response.json();
  
  // Define schema
  const userSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
      active: { type: 'boolean' }
    },
    required: ['id', 'name', 'email', 'active']
  };
  
  // Validate against schema
  await assertions.base.assertJsonSchema(jsonData, userSchema, {
    strict: true,
    message: 'User data should match expected schema'
  });
});
```

### Soft Assertions

```typescript
test('should demonstrate soft assertions', async ({ assertions }) => {
  // Collect multiple assertions without stopping on first failure
  await assertions.visible('.element-1', 'First element should be visible', { soft: true });
  await assertions.visible('.element-2', 'Second element should be visible', { soft: true });
  await assertions.visible('.element-3', 'Third element should be visible', { soft: true });
  
  // Check for failures
  const failures = assertions.getSoftAssertionFailures();
  console.log(`Found ${failures.length} soft assertion failures`);
  
  // Assert all soft assertions passed (will fail if any failed)
  await assertions.assertAllSoftAssertionsPassed();
});
```

### Custom Assertion Factory

```typescript
test('should demonstrate custom factory', async ({ page }) => {
  // Create custom assertion factory
  const customAssertions = new AssertionFactory(page, {
    defaultTimeout: 5000,
    defaultSoft: true,
    screenshotOnFailure: false
  });
  
  // Use custom configuration
  await customAssertions.visible('h1', 'Should work with custom timeout');
  
  // Check soft assertions
  expect(customAssertions.getSoftAssertionFailures().length).toBe(0);
});
```

## Available Assertion Methods

### Quick Assertion Methods (AssertionFactory)

#### Element Assertions
- `visible(locator, message?, options?)` - Element is visible
- `notVisible(locator, message?, options?)` - Element is not visible
- `count(locator, expectedCount, message?, options?)` - Element count
- `enabled(locator, message?, options?)` - Element is enabled
- `disabled(locator, message?, options?)` - Element is disabled
- `checked(locator, message?, options?)` - Element is checked
- `notChecked(locator, message?, options?)` - Element is not checked
- `focused(locator, message?, options?)` - Element is focused
- `inViewport(locator, message?, options?)` - Element is in viewport
- `notInViewport(locator, message?, options?)` - Element is not in viewport
- `empty(locator, message?, options?)` - Element is empty
- `notEmpty(locator, message?, options?)` - Element is not empty

#### Text and Content Assertions
- `text(locator, expectedText, message?, options?)` - Exact text match
- `containsText(locator, expectedText, message?, options?)` - Contains text
- `exactText(locator, expectedText, message?, options?)` - Exact text (case-sensitive)
- `field(locator, expectedValue, message?, options?)` - Form field value
- `value(locator, expectedValue, message?, options?)` - Input value

#### Attribute and CSS Assertions
- `attribute(locator, attribute, expectedValue, message?, options?)` - Element attribute
- `css(locator, property, expectedValue, message?, options?)` - CSS property

#### Navigation Assertions
- `url(expectedUrl, message?, options?)` - Current URL
- `title(expectedTitle, message?, options?)` - Page title

#### Data Assertions
- `arrayLength(array, expectedLength, message?, options?)` - Array length
- `arrayContains(array, expectedItem, message?, options?)` - Array contains item
- `dateEquals(actualDate, expectedDate, toleranceMs?, message?, options?)` - Date equality
- `fileDownloaded(fileName, message?, options?)` - File download

#### API Assertions
- `apiResponse(response, options?)` - API response validation

### Advanced UI Assertions (UIAssertionUtils)

#### Element Information
- `assertElementPresent(locator, options?)` - Element exists in DOM
- `assertElementCount(locator, expectedCount, options?)` - Element count
- `assertElementEnabled(locator, options?)` - Element is enabled
- `assertElementDisabled(locator, options?)` - Element is disabled
- `assertElementFocused(locator, options?)` - Element is focused
- `assertElementChecked(locator, options?)` - Element is checked
- `assertElementNotChecked(locator, options?)` - Element is not checked

#### Text and Content
- `assertElementContainsText(locator, expectedText, options?)` - Contains text
- `assertElementExactText(locator, expectedText, options?)` - Exact text
- `assertElementValue(locator, expectedValue, options?)` - Input value
- `assertElementEmpty(locator, options?)` - Element is empty
- `assertElementNotEmpty(locator, options?)` - Element is not empty

#### Attributes and CSS
- `assertElementAttribute(locator, attribute, expectedValue, options?)` - Element attribute
- `assertElementCSSProperty(locator, property, expectedValue, options?)` - CSS property

#### Positioning and Dimensions
- `assertElementInViewport(locator, options?)` - Element in viewport
- `assertElementNotInViewport(locator, options?)` - Element not in viewport
- `assertElementDimensions(locator, width, height, tolerance?, options?)` - Element dimensions
- `assertElementPosition(locator, x, y, tolerance?, options?)` - Element position

#### Form Validation
- `assertFormValidationError(locator, expectedError, options?)` - Form validation error
- `assertAccessibility(locator, expectedAttributes, options?)` - Accessibility attributes

### Advanced API Assertions (ApiAssertionUtils)

#### Response Validation
- `assertApiResponse(response, options?)` - Comprehensive response validation
- `assertEndpointAvailable(url, method?, options?)` - Endpoint availability
- `assertResponseContains(response, expectedData, options?)` - Response contains data
- `assertResponseArrayLength(response, expectedLength, arrayPath?, options?)` - Array length
- `assertApiError(response, expectedError, options?)` - API error validation

#### Performance and Security
- `assertResponsePerformance(response, maxResponseTime, options?)` - Response time
- `assertResponseSize(response, maxSizeBytes, options?)` - Response size
- `assertCachingHeaders(response, expectedCacheControl?, options?)` - Caching headers
- `assertSecurityHeaders(response, options?)` - Security headers

### Base Assertions (AssertionUtils)

#### Core Assertions
- `assert(condition, message, options?)` - Custom assertion
- `assertElementVisible(locator, options?)` - Element visibility
- `assertElementNotVisible(locator, options?)` - Element not visible
- `assertTextContent(locator, expectedText, options?)` - Text content
- `assertUrl(expectedUrl, options?)` - URL assertion
- `assertPageTitle(expectedTitle, options?)` - Page title
- `assertFormField(locator, expectedValue, options?)` - Form field
- `assertApiResponse(response, options?)` - API response
- `assertJsonSchema(data, schema, options?)` - JSON schema validation

#### Data Assertions
- `assertArrayLength(array, expectedLength, options?)` - Array length
- `assertArrayContains(array, expectedItem, options?)` - Array contains
- `assertDateEquals(actualDate, expectedDate, toleranceMs?, options?)` - Date equality
- `assertFileDownloaded(fileName, options?)` - File download

#### Soft Assertion Management
- `collectSoftAssertions()` - Collect soft assertions
- `getSoftAssertionFailures()` - Get soft assertion failures
- `clearSoftAssertions()` - Clear soft assertions
- `assertAllSoftAssertionsPassed(options?)` - Assert all soft assertions passed

## Configuration Options

### AssertionOptions
```typescript
interface AssertionOptions {
  timeout?: number;        // Timeout in milliseconds
  soft?: boolean;          // Use soft assertion
  message?: string;        // Custom error message
  screenshot?: boolean;    // Capture screenshot on failure
}
```

### ApiAssertionOptions
```typescript
interface ApiAssertionOptions extends AssertionOptions {
  statusCode?: number;     // Expected HTTP status code
  contentType?: string;    // Expected content type
  responseTime?: number;   // Maximum response time
}
```

### UIAssertionOptions
```typescript
interface UIAssertionOptions extends AssertionOptions {
  exact?: boolean;         // Exact match for text/value
  caseSensitive?: boolean; // Case-sensitive comparison
  trim?: boolean;          // Trim whitespace
}
```

### SchemaAssertionOptions
```typescript
interface SchemaAssertionOptions extends AssertionOptions {
  strict?: boolean;        // Strict schema validation
  ignoreFields?: string[]; // Fields to ignore
  allowExtraFields?: boolean; // Allow extra fields
}
```

### AssertionFactoryOptions
```typescript
interface AssertionFactoryOptions {
  defaultTimeout?: number;     // Default timeout
  defaultSoft?: boolean;       // Default soft assertion
  screenshotOnFailure?: boolean; // Default screenshot behavior
}
```

## Error Handling and Reporting

### Detailed Error Messages
All assertions provide detailed error messages including:
- Expected vs actual values
- Element information (tag, id, class, text)
- Context information
- Timestamp and location

### Screenshot Capture
Automatic screenshot capture on assertion failures:
- Full page screenshots
- Timestamped filenames
- Configurable capture behavior

### Soft Assertion Collection
Soft assertions allow collecting multiple failures:
- Non-blocking assertion failures
- Batch failure reporting
- Easy failure analysis

## Best Practices

### 1. Use Appropriate Assertion Types
```typescript
// Good: Use specific UI assertions
await assertions.ui.assertElementVisible('button');

// Good: Use API assertions for API testing
await assertions.api.assertApiResponse(response, { statusCode: 200 });

// Good: Use base assertions for custom logic
await assertions.base.assert(condition, 'Custom validation failed');
```

### 2. Provide Meaningful Error Messages
```typescript
// Good: Descriptive error messages
await assertions.visible('button', 'Submit button should be visible after form validation');

// Good: Include context
await assertions.text('h1', 'Welcome', 'Page title should show welcome message after login');
```

### 3. Use Soft Assertions for Multiple Checks
```typescript
// Good: Collect multiple failures
await assertions.visible('.field-1', 'Field 1 should be visible', { soft: true });
await assertions.visible('.field-2', 'Field 2 should be visible', { soft: true });
await assertions.visible('.field-3', 'Field 3 should be visible', { soft: true });

// Check all failures at once
await assertions.assertAllSoftAssertionsPassed();
```

### 4. Configure Appropriate Timeouts
```typescript
// Good: Use appropriate timeouts
await assertions.visible('button', 'Button should appear', { timeout: 5000 });
await assertions.apiResponse(response, { responseTime: 3000 });
```

### 5. Use Schema Validation for API Testing
```typescript
// Good: Validate API responses against schemas
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' }
  },
  required: ['id', 'name']
};

await assertions.base.assertJsonSchema(responseData, userSchema);
```

## Migration Guide

### From Basic expect() Assertions
**Before:**
```typescript
import { expect } from '@playwright/test';

test('should validate page', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Example Domain');
});
```

**After:**
```typescript
import { test } from '../../framework/fixtures';

test('should validate page', async ({ assertions }) => {
  await assertions.visible('h1', 'Main heading should be visible');
  await assertions.text('h1', 'Example Domain', 'Heading should have correct text');
});
```

### From Custom Assertion Functions
**Before:**
```typescript
async function assertElementVisible(page: Page, selector: string) {
  try {
    await expect(page.locator(selector)).toBeVisible();
  } catch (error) {
    throw new Error(`Element ${selector} should be visible: ${error}`);
  }
}
```

**After:**
```typescript
// Use built-in assertion utilities
await assertions.visible(selector, 'Element should be visible');
```

## Troubleshooting

### Common Issues

1. **Assertion Timeouts**
   - Increase timeout values for slow-loading elements
   - Use appropriate wait strategies

2. **Soft Assertion Management**
   - Clear soft assertions between tests
   - Check soft assertion failures before test completion

3. **Schema Validation Errors**
   - Verify schema structure matches actual data
   - Use appropriate schema validation options

4. **API Response Validation**
   - Check response format and content type
   - Verify API endpoint availability

### Debug Mode
Enable debug logging for assertion utilities:
```typescript
const assertions = new AssertionFactory(page, {
  defaultTimeout: 10000,
  defaultSoft: false,
  screenshotOnFailure: true
});
```

## Contributing

When adding new assertion methods:

1. **Choose appropriate utility class** (Base, UI, or API)
2. **Implement with proper error handling**
3. **Add TypeScript interfaces** for options
4. **Include comprehensive documentation**
5. **Add example usage** in test files
6. **Update this documentation**

The assertion utilities system provides a solid foundation for robust, maintainable test assertions with comprehensive error reporting and flexible configuration options.
