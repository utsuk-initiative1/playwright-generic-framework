// Centralized Prompt Management System for AI Test Generation
// This file contains all prompts used by the AI test generators

const PROMPTS = {
  // Basic test generation prompt
  BASIC_TEST: (baseUrl) => `
You are an expert Playwright test developer. Generate comprehensive Playwright test scenarios in TypeScript for this website: ${baseUrl}

Create tests that cover:
1. Page loading and title verification2avigation and user interactions
3 Form validation (if forms exist)
4. Responsive design testing
5. Common user journeys

Output only valid TypeScript code that can be saved as a .spec.ts file. Use modern Playwright syntax with async/await.

Example structure:
import { test, expect } from@playwright/test';

test.describe('AI Generated Tests for ${baseUrl}', () => {
  test('should load homepage successfully', async ({ page }) => [object Object]   await page.goto(${baseUrl}');
    await expect(page).toHaveTitle(/./);
  });
  
  // Add more comprehensive tests here...
});
`,

  // Regression test suite prompt
  REGRESSION_TEST: (baseUrl) => `
You are an expert QA automation engineer specializing in regression testing. Generate a comprehensive Playwright regression test suite in TypeScript for this website: ${baseUrl}

Create a detailed regression test suite that covers:

1. **CRITICAL FUNCTIONALITY TESTS:**
   - Homepage loading and core functionality
   - Navigation menu functionality
   - All major page transitions
   - Form submissions and validations
   - Search functionality (if present)
   - User authentication flows (if present)

2. **UI/UX REGRESSION TESTS:**
   - Visual elements rendering correctly
   - Responsive design across all breakpoints
   - Accessibility compliance (ARIA labels, keyboard navigation)
   - Cross-browser compatibility indicators
   - Loading states and error handling3 **PERFORMANCE REGRESSION TESTS:**
   - Page load times
   - Image loading and optimization
   - JavaScript execution
   - Network request optimization

4. **EDGE CASES AND ERROR SCENARIOS:**
   - Invalid form inputs
   - Network failures
   - 44 error handling
   - Server error responses
   - Browser back/forward navigation
   - Page refresh scenarios5. **DATA INTEGRITY TESTS:**
   - Content consistency across pages
   - Dynamic content loading
   - API integration points (if visible)

6ECURITY REGRESSION TESTS:**
   - XSS prevention
   - Input sanitization
   - Secure headers
   - HTTPS enforcement

Output only valid TypeScript code that can be saved as a .spec.ts file. Use modern Playwright syntax with:
- Proper error handling with try/catch blocks
- Explicit waits and assertions
- Detailed test descriptions
- Screenshot capture on failures
- Video recording for debugging
- Comprehensive logging

Structure the tests in logical groups using test.describe() blocks.

Example structure:
import { test, expect } from@playwright/test';

test.describe('Regression Test Suite for ${baseUrl}', () =>[object Object]
  test.describe(Critical Functionality', () =>[object Object] // Critical tests here
  });
  
  test.describe('UI/UX Regression', () =>[object Object]  // UI tests here
  });
  
  test.describe('Performance Regression', () => {
    // Performance tests here
  });
  
  // Continue with other test groups...
});
`,

  // Smoke test prompt
  SMOKE_TEST: (baseUrl) => `
You are an expert QA automation engineer. Generate a focused smoke test suite in TypeScript for this website: ${baseUrl}

Create smoke tests that verify the most critical functionality:

1. **ESSENTIAL FUNCTIONALITY:**
   - Homepage loads successfully
   - Core navigation works
   - Main features are accessible
   - No critical errors on page load

2**BASIC USER FLOWS:**
   - User can navigate to key pages
   - Forms can be accessed (if present)
   - Search functionality works (if present)
   - Contact/help pages are accessible3 **PERFORMANCE BASICS:**
   - Page loads within reasonable time
   - No broken images or resources
   - JavaScript executes without errors

Output only valid TypeScript code that can be saved as a .spec.ts file. Keep tests focused and fast.

Example structure:
import { test, expect } from@playwright/test';

test.describe('Smoke Tests for ${baseUrl}', () => {
  test('should load homepage', async ({ page }) => [object Object]   await page.goto(${baseUrl}');
    await expect(page).toHaveTitle(/./);
  });
  
  // Add more smoke tests here...
});
`,

  // E2E test prompt
  E2TEST: (baseUrl) => `
You are an expert QA automation engineer. Generate comprehensive end-to-end test scenarios in TypeScript for this website: ${baseUrl}

Create E2E tests that simulate real user journeys:

1 **COMPLETE USER JOURNEYS:**
   - New user registration flow (if present)
   - User login and authentication flow
   - Product/service browsing and selection
   - Checkout/purchase flow (if e-commerce)
   - Contact/support request flow
   - Account management flow

2*BUSINESS CRITICAL SCENARIOS:**
   - Complete user onboarding
   - Data submission and validation
   - Payment processing (if applicable)
   - Email notifications (if applicable)
   - Profile updates and settings

3*CROSS-FEATURE INTEGRATION:**
   - Multi-step workflows
   - Data persistence across pages
   - Session management
   - Error recovery scenarios

Output only valid TypeScript code that can be saved as a .spec.ts file. Use realistic test data and comprehensive assertions.

Example structure:
import { test, expect } from@playwright/test';

test.describe('E2E Test Suite for ${baseUrl}', () => {
  test('complete user registration flow', async ({ page }) => {
    // Complete registration journey
  });
  
  // Add more E2E tests here...
});
`,

  // Accessibility test prompt
  ACCESSIBILITY_TEST: (baseUrl) => `
You are an expert accessibility testing engineer. Generate comprehensive accessibility test scenarios in TypeScript for this website: ${baseUrl}

Create accessibility tests that verify WCAG compliance:
1. **KEYBOARD NAVIGATION:**
   - All interactive elements are keyboard accessible
   - Tab order is logical
   - Focus indicators are visible
   - Skip links work properly

2SCREEN READER COMPATIBILITY:**
   - Proper ARIA labels and roles
   - Semantic HTML structure
   - Alt text for images
   - Form labels and descriptions

3 **VISUAL ACCESSIBILITY:**
   - Color contrast ratios
   - Text resizing capabilities
   - High contrast mode support
   - No reliance on color alone
4. **MOTOR ACCESSIBILITY:**
   - Clickable areas are large enough
   - Touch targets meet minimum size
   - No time limits that can't be extended
   - Error prevention and recovery

Output only valid TypeScript code that can be saved as a .spec.ts file. Use Playwright's accessibility testing features.

Example structure:
import { test, expect } from@playwright/test';

test.describe('Accessibility Tests for ${baseUrl}', () => {
  test(should meet WCAG 2.1 standards', async ({ page }) => [object Object]   await page.goto(${baseUrl}');
    await expect(page).toPassAxe();
  });
  
  // Add more accessibility tests here...
});
`,

  // Performance test prompt
  PERFORMANCE_TEST: (baseUrl) => `
You are an expert performance testing engineer. Generate comprehensive performance test scenarios in TypeScript for this website: ${baseUrl}

Create performance tests that measure and validate:

1. **LOAD TIME METRICS:**
   - Page load time (DOMContentLoaded, load)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
2. **RESOURCE OPTIMIZATION:**
   - Image loading and optimization
   - JavaScript bundle sizes
   - CSS optimization
   - Network request efficiency

3. **MEMORY AND CPU USAGE:**
   - Memory leaks detection
   - CPU usage during interactions
   - JavaScript execution time
   - Rendering performance4 **SCALABILITY TESTS:**
   - Concurrent user load
   - Database query performance
   - API response times
   - Server resource utilization

Output only valid TypeScript code that can be saved as a .spec.ts file. Use Playwright's performance APIs and metrics.

Example structure:
import { test, expect } from@playwright/test';

test.describe(Performance Tests for ${baseUrl}', () => {
  test('should load within performance budget', async ({ page }) =>[object Object]   const startTime = Date.now();
    await page.goto(${baseUrl});    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(300
  });
  
  // Add more performance tests here...
});
`,

  // API test prompt
  API_TEST: (baseUrl) => `
You are an expert API testing engineer. Generate comprehensive API test scenarios in TypeScript for this website: ${baseUrl}

Create API tests that validate:

1. **ENDPOINT FUNCTIONALITY:**
   - All API endpoints are accessible
   - Proper HTTP status codes
   - Response format validation
   - Data integrity checks

2. **AUTHENTICATION & AUTHORIZATION:**
   - API key validation
   - Token-based authentication
   - Role-based access control
   - Session management

3. **DATA VALIDATION:**
   - Request payload validation
   - Response schema validation
   - Error handling and messages
   - Edge case handling

4*PERFORMANCE & RELIABILITY:**
   - Response time benchmarks
   - Rate limiting compliance
   - Error recovery
   - Load testing scenarios

Output only valid TypeScript code that can be saved as a .spec.ts file. Use Playwright's API testing capabilities.

Example structure:
import { test, expect } from@playwright/test';

test.describe('API Tests for ${baseUrl}', () => {
  test('should return valid API response', async ({ request }) => {
    const response = await request.get('${baseUrl}/api/health');
    expect(response.status()).toBe(20
  });
  
  // Add more API tests here...
});
`,

  // Mobile test prompt
  MOBILE_TEST: (baseUrl) => `
You are an expert mobile testing engineer. Generate comprehensive mobile test scenarios in TypeScript for this website: ${baseUrl}

Create mobile-specific tests that validate:

1. **RESPONSIVE DESIGN:**
   - Mobile viewport rendering
   - Touch-friendly interface elements
   - Swipe and gesture interactions
   - Orientation changes2 **MOBILE-SPECIFIC FEATURES:**
   - Touch target sizes
   - Mobile navigation patterns
   - Mobile form interactions
   - Mobile-specific content3. **PERFORMANCE ON MOBILE:**
   - Mobile network optimization
   - Battery usage considerations
   - Mobile browser compatibility
   - Offline functionality4*MOBILE USER EXPERIENCE:**
   - Thumb-friendly navigation
   - Mobile-optimized content
   - Mobile-specific workflows
   - Accessibility on mobile

Output only valid TypeScript code that can be saved as a .spec.ts file. Use mobile-specific viewports and interactions.

Example structure:
import { test, expect } from@playwright/test';

test.describe('Mobile Tests for ${baseUrl}', () => {
  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height:667});
    await page.goto(${baseUrl}');
    await expect(page).toHaveTitle(/./);
  });
  
  // Add more mobile tests here...
});
`
};

module.exports = PROMPTS; 