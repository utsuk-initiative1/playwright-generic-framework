# Playwright Fixtures System

This directory contains the comprehensive fixture system for the Playwright test automation framework, providing reusable components for authentication, test data management, and page object instantiation.

## Overview

The fixture system addresses the feedback requirements by providing:

- **Reusability**: Page objects and test data are created once and reused across multiple tests
- **Consistent Setup**: All tests get the same page object instances and authentication setup
- **Better Maintainability**: Changes to page objects only need to be made in one place
- **Centralized Management**: All fixtures are managed centrally for easy updates

## Architecture

```
framework/fixtures/
├── index.ts              # Main fixture definitions and exports
├── testData.ts           # Test data management and user credentials
├── authFixtures.ts       # Authentication flows and helper methods
└── README.md            # This documentation
```

## Fixtures Available

### 1. Page Fixtures
- `page`: Playwright Page instance
- `browser`: Playwright Browser instance  
- `context`: Playwright BrowserContext instance

### 2. Page Object Fixtures
- `loginPage`: Pre-instantiated LoginAuthPage object
- `testData`: TestData class instance with user credentials and test scenarios
- `auth`: AuthFixtures class with authentication helper methods

## Usage Examples

### Basic Test with Fixtures

```typescript
import { test, expect } from '../../framework/fixtures';

test('should login successfully', async ({ auth, testData }) => {
  // Use auth fixture to login
  const loginSuccess = await auth.loginAsValidUser();
  expect(loginSuccess).toBe(true);
  
  // Get user data from test data fixture
  const user = testData.getUsers().valid;
  console.log(`Logged in as: ${user.email}`);
});
```

### Authentication Tests

```typescript
test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ auth }) => {
    // Ensure clean state before each test
    await auth.setupUnauthenticatedState();
  });

  test('should login as admin', async ({ auth }) => {
    const success = await auth.loginAsAdmin();
    expect(success).toBe(true);
    
    const status = await auth.getAuthStatus();
    expect(status.userRole).toBe('admin');
  });

  test('should login as premium user', async ({ auth }) => {
    const success = await auth.loginAsPremiumUser();
    expect(success).toBe(true);
  });

  test('should fail with invalid credentials', async ({ auth }) => {
    const errors = await auth.loginWithInvalidCredentials();
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

### Using Test Data

```typescript
test('should test form validation', async ({ loginPage, testData }) => {
  await loginPage.navigateToLogin();
  
  // Get form test data
  const formData = testData.getFormTestData();
  
  // Test with invalid emails
  for (const invalidEmail of formData.invalidEmails) {
    await loginPage.fillInput(loginPage['emailInput'], invalidEmail);
    await loginPage.clickElement(loginPage['loginButton']);
    
    const errors = await loginPage.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
  }
});
```

## Test Data Management

The `TestData` class provides:

### User Credentials
```typescript
const users = testData.getUsers();
// users.valid - Standard test user
// users.admin - Admin user
// users.premium - Premium user
// users.invalid - Invalid credentials for negative testing
```

### API Tokens
```typescript
const tokens = testData.getApiTokens();
// tokens.bearer - Bearer token for API authentication
// tokens.oauth - OAuth token
// tokens.refresh - Refresh token
```

### Form Validation Data
```typescript
const formData = testData.getFormTestData();
// formData.validEmails - Array of valid email formats
// formData.invalidEmails - Array of invalid email formats
// formData.validPasswords - Array of valid password formats
// formData.invalidPasswords - Array of invalid password formats
```

### Scenario Data
```typescript
const scenarios = testData.getScenarioData();
// scenarios.login.success - Successful login credentials
// scenarios.login.failure - Failed login credentials
// scenarios.registration.newUser - New user for registration
// scenarios.passwordReset - Password reset test data
```

## Authentication Fixtures

The `AuthFixtures` class provides:

### Login Methods
- `loginAsValidUser(rememberMe?)` - Login with standard test user
- `loginAsAdmin(rememberMe?)` - Login with admin credentials
- `loginAsPremiumUser(rememberMe?)` - Login with premium user
- `loginWithCredentials(credentials, rememberMe?)` - Login with custom credentials
- `loginWithInvalidCredentials()` - Attempt login with invalid credentials

### State Management
- `setupAuthenticatedState(userType)` - Setup authenticated state for tests
- `setupUnauthenticatedState()` - Ensure clean unauthenticated state
- `getAuthStatus()` - Get current authentication status and user info

### Additional Features
- `logout()` - Logout from application
- `handleTwoFactorAuth(code)` - Handle 2FA authentication
- `resetPassword(email)` - Reset password flow
- `navigateToSignUp()` - Navigate to sign up page

## Environment Configuration

The fixture system integrates with the ConfigManager for environment-specific settings:

```typescript
// Environment variables are automatically loaded from:
// - .env.{TEST_ENV} (e.g., .env.local, .env.staging, .env.production)
// - .env.local
// - .env
// - .env.example
```

### Required Environment Variables
- `TEST_USER_EMAIL` - Standard test user email
- `TEST_USER_PASSWORD` - Standard test user password

### Optional Environment Variables
- `ADMIN_USER_EMAIL` / `ADMIN_USER_PASSWORD` - Admin credentials
- `PREMIUM_USER_EMAIL` / `PREMIUM_USER_PASSWORD` - Premium user credentials
- `API_BEARER_TOKEN` - API authentication token
- `TEST_ENV` - Test environment (local, staging, production)

## Benefits

### 1. Reusability
- Page objects are created once and reused across multiple tests
- No need to instantiate page objects in every test
- Consistent object instances across test suite

### 2. Consistent Setup
- All tests get the same page object instances
- Authentication and other setup is handled automatically
- Reduces code duplication significantly

### 3. Better Maintainability
- Changes to page objects only need to be made in one place
- Easier to update when application changes
- Centralized fixture management

### 4. Type Safety
- Full TypeScript support with proper type definitions
- IntelliSense support for all fixture methods
- Compile-time error checking

## Migration Guide

### From Old Test Structure
**Before:**
```typescript
import { test, expect } from '@playwright/test';
import { LoginAuthPage } from '../framework/pages/LoginAuthPage';

test('should login', async ({ page }) => {
  const loginPage = new LoginAuthPage(page);
  await loginPage.navigateToLogin();
  await loginPage.login('test@example.com', 'password');
});
```

**After:**
```typescript
import { test, expect } from '../../framework/fixtures';

test('should login', async ({ auth }) => {
  const success = await auth.loginAsValidUser();
  expect(success).toBe(true);
});
```

## Best Practices

1. **Use beforeEach for setup**: Always use `beforeEach` to ensure clean state
2. **Leverage test data**: Use the test data fixture for dynamic test scenarios
3. **Handle authentication properly**: Use auth fixtures for all authentication flows
4. **Validate state**: Always verify authentication status after login/logout
5. **Use environment variables**: Store sensitive data in .env files, never in code

## Troubleshooting

### Common Issues

1. **Missing environment variables**: Ensure all required .env variables are set
2. **Authentication failures**: Check if credentials are correct for the target environment
3. **Fixture not found**: Ensure you're importing from the correct fixtures path

### Debug Mode
Enable debug logging by setting `LOG_LEVEL=debug` in your .env file.

## Contributing

When adding new fixtures:

1. Create the fixture class in the appropriate file
2. Add the fixture to the `TestFixtures` interface in `index.ts`
3. Implement the fixture in the `test.extend()` call
4. Update this documentation
5. Add example usage in test files
