# Quick Start Guide - Pre-Automation Framework

This guide will help you quickly integrate the pre-automation framework with any application in just a few steps.

## 🚀 Step 1: Setup Framework

```bash
# Navigate to your project directory
cd your-project

# Copy the framework files
cp -r Playwright/framework ./
cp Playwright/framework.config.ts ./
cp Playwright/package.json ./

# Install dependencies
npm install
npm run install-browsers
```

## 🔧 Step 2: Configure for Your Application

### Update Configuration

Edit `framework.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';
import { configManager } from './framework/config/EnvironmentConfig';

const config = configManager.getConfig();

export default defineConfig({
  // Update these URLs for your application
  use: {
    baseURL: 'https://your-app.com', // Your app URL
    // ... other settings
  },
  
  // Update API URL if needed
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers as needed
  ],
});
```

### Update Environment Configuration

Edit `framework/config/EnvironmentConfig.ts`:

```typescript
// Update the baseConfigs object
const baseConfigs: Record<string, EnvironmentConfig> = {
  local: {
    baseURL: 'http://localhost:3000', // Your local dev server
    apiURL: 'http://localhost:3001',  // Your local API
    // ... other settings
  },
  staging: {
    baseURL: 'https://staging.your-app.com',
    apiURL: 'https://api-staging.your-app.com',
    // ... other settings
  },
  production: {
    baseURL: 'https://your-app.com',
    apiURL: 'https://api.your-app.com',
    // ... other settings
  }
};
```

## 📝 Step 3: Create Your First Page Object

Create `framework/pages/LoginPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

export class LoginPage extends BasePageObject {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
    
    // Update these selectors for your application
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateToPage('/login');
  }

  async login(email: string, password: string): Promise<void> {
    this.logStep('Performing login');
    await this.fillInputWithLog(this.emailInput, email, 'Email Input');
    await this.fillInputWithLog(this.passwordInput, password, 'Password Input');
    await this.clickElementWithLog(this.loginButton, 'Login Button');
    await this.waitForNetworkIdleWithLog();
  }

  async verifyLoginForm(): Promise<void> {
    this.logStep('Verifying login form elements');
    await this.assertElementVisibleWithLog(this.emailInput, 'Email Input');
    await this.assertElementVisibleWithLog(this.passwordInput, 'Password Input');
    await this.assertElementVisibleWithLog(this.loginButton, 'Login Button');
  }

  async verifyErrorMessage(): Promise<void> {
    await this.assertElementVisibleWithLog(this.errorMessage, 'Error Message');
  }
}
```

## 🧪 Step 4: Write Your First Test

Create `framework/tests/login.spec.ts`:

```typescript
import { test, expect } from '../core/TestBase';
import { LoginPage } from '../pages/LoginPage';
import { dataManager } from '../utils/DataManager';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should display login form', async () => {
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginForm();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.navigateToLogin();
    
    // Get test data
    const userData = dataManager.generateUserData();
    
    // Perform login
    await loginPage.login(userData.email, userData.password);
    
    // Verify successful login (update URL for your app)
    await loginPage.assertURLContainsWithLog('/dashboard');
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.navigateToLogin();
    
    // Attempt login with invalid credentials
    await loginPage.login('invalid@email.com', 'wrongpassword');
    
    // Verify error message
    await loginPage.verifyErrorMessage();
  });
});
```

## 🚀 Step 5: Run Your Tests

```bash
# Run all tests
npm test

# Run specific test file
npm run test:framework

# Run tests in UI mode (recommended for development)
npm run test:ui

# Run tests for specific environment
TEST_ENV=staging npm test
```

## 📊 Step 6: View Results

```bash
# View HTML report
npm run report

# View test results in browser
playwright show-report
```

## 🔄 Step 7: Integrate with CI/CD

### GitHub Actions Example

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🛠️ Customization Examples

### Adding Custom Utilities

Create `framework/utils/CustomHelper.ts`:

```typescript
import { Page } from '@playwright/test';

export class CustomHelper {
  static async waitForCustomElement(page: Page, selector: string): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
  }
  
  static async performCustomAction(page: Page): Promise<void> {
    // Your custom logic here
    await page.evaluate(() => {
      // Custom JavaScript execution
    });
  }
}
```

### Creating Data-Driven Tests

Create `fixtures/test-data.json`:

```json
{
  "users": {
    "admin": {
      "email": "admin@example.com",
      "password": "admin123",
      "role": "admin"
    },
    "user": {
      "email": "user@example.com",
      "password": "user123",
      "role": "user"
    }
  },
  "testScenarios": [
    {
      "name": "Valid Login",
      "email": "test@example.com",
      "password": "password123",
      "expectedResult": "success"
    },
    {
      "name": "Invalid Email",
      "email": "invalid-email",
      "password": "password123",
      "expectedResult": "error"
    }
  ]
}
```

Use in tests:

```typescript
import { dataManager } from '../utils/DataManager';

test('data-driven login tests', async ({ page }) => {
  const testData = dataManager.loadTestData('test-data.json');
  
  for (const scenario of testData.testScenarios) {
    await loginPage.navigateToLogin();
    await loginPage.login(scenario.email, scenario.password);
    
    if (scenario.expectedResult === 'success') {
      await loginPage.assertURLContainsWithLog('/dashboard');
    } else {
      await loginPage.verifyErrorMessage();
    }
  }
});
```

## 📈 Performance Testing

```typescript
test('should load page within performance threshold', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  // Log performance metric
  console.log(`Page load time: ${loadTime}ms`);
  
  // Assert performance threshold
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

## 🔍 Debugging

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test framework/tests/login.spec.ts --debug
```

### Trace Viewer

```bash
# Record trace
npx playwright test --trace on

# View trace
npm run trace
```

## 📚 Next Steps

1. **Read the full documentation**: `framework/README.md`
2. **Explore examples**: `framework/tests/example-test.spec.ts`
3. **Customize for your needs**: Update selectors and URLs
4. **Add more page objects**: Create page objects for each page in your app
5. **Implement API testing**: Use the built-in API helper
6. **Set up CI/CD**: Integrate with your deployment pipeline

## 🆘 Need Help?

- Check the framework documentation: `framework/README.md`
- Review example tests: `framework/tests/example-test.spec.ts`
- Use debug mode for troubleshooting: `npm run test:debug`
- Check generated reports: `npm run report`

## 🎯 Framework Benefits

✅ **Reusable** - Works with any web application  
✅ **Maintainable** - Page Object Model pattern  
✅ **Scalable** - Supports parallel execution  
✅ **Reliable** - Built-in retry mechanisms  
✅ **Comprehensive** - API testing, mobile testing, performance monitoring  
✅ **CI/CD Ready** - Optimized for automation pipelines  
✅ **Well Documented** - Extensive documentation and examples  

Start testing your application today with this powerful, flexible framework! 