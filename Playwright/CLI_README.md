# Playwright Framework CLI

A powerful command-line tool to quickly set up a comprehensive Playwright automation framework with TypeScript support, Page Object Model, and best practices.

## 🚀 Quick Start

### Option 1: Run directly (Recommended for one-time use)

```bash
# Clone or download the CLI file
curl -o cli.js https://raw.githubusercontent.com/yourusername/playwright-framework-cli/main/cli.js
chmod +x cli.js

# Run the CLI
node cli.js
```

### Option 2: Install globally via npm

```bash
# Install globally
npm install -g playwright-framework-cli

# Run the CLI
playwright-framework
# or
pw-framework
```

### Option 3: Use npx (No installation required)

```bash
npx playwright-framework-cli
```

## 📋 What the CLI Creates

The CLI will set up a complete Playwright automation framework with:

### 🏗️ Project Structure
```
your-project/
├── framework/
│   ├── config/          # Environment configurations
│   ├── core/            # Core framework classes
│   ├── pages/           # Page Object Models
│   ├── setup/           # Global setup/teardown
│   ├── tests/           # Test files
│   └── utils/           # Utility functions
├── data/                # Test data files
├── fixtures/            # Test fixtures
├── sample-tests/        # Sample test suites
├── test-results/        # Test execution results
├── playwright-report/   # HTML test reports
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── framework.config.ts  # Framework configuration
├── playwright.config.ts # Playwright configuration
└── README.md           # Project documentation
```

### 🔧 Configuration Files
- **EnvironmentConfig.ts**: Multi-environment configuration (local, staging, production)
- **framework.config.ts**: Advanced Playwright configuration with custom settings
- **playwright.config.ts**: Standard Playwright configuration
- **tsconfig.json**: TypeScript configuration with path mapping

### 🧪 Framework Components
- **BasePage**: Core page interaction methods
- **TestBase**: Extended test fixtures
- **Sample Tests**: Working examples to get started
- **Utility Classes**: Common testing utilities

### 📦 Dependencies
- Playwright Test Framework
- TypeScript support
- Multiple browser configurations
- Mobile device testing
- Enhanced reporting

## 🎯 Features

### ✅ Interactive Setup
- Guided project configuration
- Environment-specific settings
- Custom application URLs
- Browser selection

### ✅ Multi-Environment Support
- Local development
- Staging environment
- Production environment
- Environment-specific configurations

### ✅ Browser Support
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome
- Mobile Safari
- Tablet devices

### ✅ Advanced Features
- Page Object Model pattern
- TypeScript support
- Parallel test execution
- Screenshot capture
- Video recording
- Trace recording
- HTML reports
- JUnit reports
- JSON reports

### ✅ CI/CD Ready
- Headless mode support
- Environment variables
- Parallel execution
- Retry mechanisms
- Timeout configurations

## 🛠️ Usage

### Basic Setup
```bash
# Run the CLI
node cli.js

# Follow the interactive prompts:
# 1. Enter project name
# 2. Enter application base URL
# 3. Enter API base URL
# 4. Select environments to configure
```

### Example Session
```
🚀 Playwright Automation Framework Setup CLI

This CLI will help you set up a comprehensive Playwright automation framework.

📋 Project Configuration

Enter project name (default: playwright-automation): my-app-tests
Enter your application base URL (default: https://example.com): https://myapp.com
Enter your API base URL (default: https://api.example.com): https://api.myapp.com
Enter environments to configure (comma-separated, default: local,staging,production): local,staging,production

✅ Project details captured!

📁 Creating project structure...
✅ Created: framework/config
✅ Created: framework/core
✅ Created: framework/pages
...

📦 Installing dependencies...
✅ package.json created
✅ tsconfig.json created
✅ Dependencies installed
✅ Playwright browsers installed

⚙️ Configuring environment settings...
✅ EnvironmentConfig.ts created
✅ framework.config.ts created
✅ playwright.config.ts created

🧪 Creating sample tests and framework files...
✅ BasePage.ts created
✅ TestBase.ts created
✅ example-test.spec.ts created
✅ README.md created

📝 Setting up Git repository...
✅ .gitignore created
✅ Git repository initialized

🎉 Framework setup completed successfully!

📋 Next Steps:
1. Navigate to your project: cd my-app-tests
2. Update framework/config/EnvironmentConfig.ts with your application URLs
3. Create your first page object in framework/pages/
4. Write your first test in framework/tests/
5. Run tests: npm test
```

## 🎮 Available Scripts

After setup, you'll have these npm scripts available:

```bash
# Basic testing
npm test                    # Run all tests
npm run test:ui            # Run tests with Playwright UI
npm run test:headed        # Run tests in headed mode
npm run test:debug         # Run tests in debug mode

# Browser-specific testing
npm run test:chrome        # Run tests only in Chrome
npm run test:firefox       # Run tests only in Firefox
npm run test:safari        # Run tests only in Safari
npm run test:mobile        # Run tests on mobile devices

# Environment-specific testing
npm run test:local         # Run tests against local environment
npm run test:staging       # Run tests against staging environment
npm run test:production    # Run tests against production environment

# Execution modes
npm run test:parallel      # Run tests in parallel (4 workers)
npm run test:sequential    # Run tests sequentially (1 worker)

# Reporting and utilities
npm run report             # Show test report
npm run install-browsers   # Install Playwright browsers
npm run codegen            # Generate test code
npm run trace              # Show trace viewer
```

## 🔧 Configuration

### Environment Variables
```bash
# Set test environment
export TEST_ENV=staging

# Set credentials
export STAGING_USERNAME=your-username
export STAGING_PASSWORD=your-password

# Set local environment
export LOCAL_USERNAME=local-user
export LOCAL_PASSWORD=local-pass
```

### Custom Configuration
Edit `framework/config/EnvironmentConfig.ts` to customize:
- Base URLs for different environments
- Timeout settings
- Retry configurations
- Browser settings
- Recording preferences

## 📚 Writing Tests

### Page Object Model
```typescript
// framework/pages/LoginPage.ts
import { BasePage } from '../core/BasePage';

export class LoginPage extends BasePage {
  private usernameInput = '#username';
  private passwordInput = '#password';
  private loginButton = '#login-btn';

  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }
}
```

### Test Example
```typescript
// framework/tests/login.spec.ts
import { test, expect } from '../core/TestBase';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page, basePage }) => {
    const loginPage = new LoginPage(page);
    
    await basePage.navigateTo('/login');
    await loginPage.login('testuser', 'testpass');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## 🚀 Next Steps

1. **Customize Configuration**: Update environment URLs and settings
2. **Create Page Objects**: Build page objects for your application
3. **Write Tests**: Create test suites using the framework
4. **Set Up CI/CD**: Configure your CI pipeline
5. **Add Custom Utilities**: Extend the framework with your needs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the generated README.md in your project
- **Issues**: Report bugs on GitHub
- **Playwright Docs**: https://playwright.dev/
- **Community**: Join Playwright Discord

---

**Happy Testing! 🎉** 