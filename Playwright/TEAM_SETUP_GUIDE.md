# 🚀 Team Setup Guide - Playwright Framework CLI

This guide will help your team members set up and use the Playwright Framework CLI tool on their systems.

## 📋 Prerequisites

Before installing the CLI tool, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **GitHub account** with access to the repository

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js

#### For macOS:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

#### For Windows:
1. Download from [https://nodejs.org/](https://nodejs.org/)
2. Run the installer
3. Follow the installation wizard

#### For Linux (Ubuntu/Debian):
```bash
# Using apt
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using snap
sudo snap install node --classic
```

### Step 2: Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Both should show version 16 or higher
```

### Step 3: Get GitHub Access Token

1. **Go to GitHub**: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. **Click "Generate new token (classic)"**
3. **Give it a name**: "Playwright CLI Access"
4. **Select scopes**:
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `repo` - Full control of private repositories (if needed)
5. **Click "Generate token"**
6. **Copy the token** (you'll need it for authentication)

### Step 4: Install the CLI Tool

#### Option A: Using Installation Script (Recommended)

```bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/utsuk-initiative1/playwright-generic-framework/main/Playwright/install-cli.sh | bash
```

#### Option B: Manual Installation

```bash
# Set your GitHub token as environment variable
export GITHUB_TOKEN=your_github_token_here

# Install the CLI tool globally
npm install -g @utsuk-initiative1/playwright-framework-cli
```

#### Option C: Using .npmrc File

```bash
# Create .npmrc file in your home directory
cat > ~/.npmrc << EOF
@utsuk-initiative1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=your_github_token_here
EOF

# Install the CLI tool
npm install -g @utsuk-initiative1/playwright-framework-cli
```

### Step 5: Verify Installation

```bash
# Test the main command
playwright-framework --help

# Test the short alias
pw-framework --help

# Test the branded command
utsuk-playwright --help
```

You should see the help output for each command.

## 🎯 Using the CLI Tool

### Basic Usage

```bash
# Start the interactive setup
playwright-framework

# Or use the short alias
pw-framework

# Or use the branded command
utsuk-playwright
```

### Advanced Usage

```bash
# With AI test generation (requires Gemini API key)
playwright-framework --api-key=your_gemini_api_key

# Specify AI model
playwright-framework --api-key=your_key --ai-model=gemini-1.5sh

# Show help
playwright-framework --help
```

## 🏗️ Creating Your First Project

### Step 1: Run the CLI

```bash
playwright-framework
```

### Step 2: Follow the Interactive Prompts

1. **Enter project name**: Choose a descriptive name for your project
2. **Enter target URL**: The website you want to test
3. **Select template**: Choose from Basic, Standard, Enterprise, or Mobile
4. **Select features**: Choose which testing features you need
5. **Configure AI**: Set up AI test generation (optional)
6. **Wait for setup**: The CLI will create your project structure

### Step 3: Navigate to Your Project

```bash
# Change to your project directory
cd your-project-name

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Step 4: Run Your First Test

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test suites
npm run test:smoke
npm run test:regression
npm run test:e2e
```

## 📁 Project Structure

After setup, your project will have this structure:

```
your-project/
├── framework/
│   ├── config/          # Configuration files
│   ├── core/            # Core framework classes
│   ├── interactions/    # Browser interaction modules
│   ├── utils/           # Utility functions
│   └── constants/       # Constants and enums
├── tests/
│   ├── smoke/           # Smoke tests
│   ├── regression/      # Regression tests
│   ├── e2e/            # End-to-end tests
│   ├── accessibility/   # Accessibility tests
│   ├── performance/     # Performance tests
│   ├── api/            # API tests
│   ├── visual/         # Visual regression tests
│   └── mobile/         # Mobile tests
├── data/               # Test data files
├── fixtures/           # Test fixtures
├── baseline-screenshots/ # Visual test baselines
├── reports/            # Test reports
├── ci-cd/              # CI/CD scripts
├── dashboard/          # Test dashboard
├── playwright.config.ts # Playwright configuration
├── framework.config.ts # Framework configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 🛠️ Available Scripts

```bash
# Test scripts
npm test                # Run all tests
npm run test:ui         # Run tests with Playwright UI
npm run test:headed     # Run tests in headed mode
npm run test:debug      # Run tests in debug mode
npm run test:smoke      # Run smoke tests only
npm run test:regression # Run regression tests only
npm run test:e2e        # Run end-to-end tests only
npm run test:accessibility # Run accessibility tests only
npm run test:performance   # Run performance tests only
npm run test:api        # Run API tests only
npm run test:visual     # Run visual regression tests only
npm run test:mobile     # Run mobile tests only

# Browser-specific tests
npm run test:chrome     # Run tests in Chrome only
npm run test:firefox    # Run tests in Firefox only
npm run test:safari     # Run tests in Safari only

# Environment-specific tests
npm run test:staging    # Run tests against staging
npm run test:production # Run tests against production
npm run test:local      # Run tests against local

# Utility scripts
npm run report          # Show test report
npm run install-browsers # Install Playwright browsers
npm run codegen         # Generate tests with Playwright Codegen
npm run trace           # Show trace viewer
npm run update-baselines # Update visual test baselines
```

## 🔧 Configuration

### Environment Configuration

Edit `framework/config/EnvironmentConfig.ts`:

```typescript
export const environments = {
  local: {
    baseURL: 'http://localhost:3000',
    username: 'testuser',
    password: 'testpass'
  },
  staging: {
    baseURL: 'https://staging.yourapp.com',
    username: process.env.STAGING_USERNAME,
    password: process.env.STAGING_PASSWORD
  },
  production: {
    baseURL: 'https://yourapp.com',
    username: process.env.PROD_USERNAME,
    password: process.env.PROD_PASSWORD
  }
};
```

### Playwright Configuration

Edit `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } }
  ]
});
```

## 🤖 AI Test Generation

### Setup Gemini API

1. **Get API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Generate API Key**: Create a new API key
3. **Use with CLI**:

```bash
# Run CLI with AI features
playwright-framework --api-key=your_gemini_api_key

# Or set as environment variable
export GEMINI_API_KEY=your_gemini_api_key
playwright-framework
```

### AI Features

- **Smart Test Generation**: AI creates test cases based on your website
- **Test Data Generation**: AI generates realistic test data
- **Accessibility Testing**: AI identifies accessibility issues
- **Performance Insights**: AI suggests performance improvements

## 📊 Reporting and Analytics

### HTML Reports

```bash
# Generate HTML report
npm test

# View report
npm run report
```

### JSON Reports

```bash
# Generate JSON report for CI/CD
npx playwright test --reporter=json
```

### Dashboard

```bash
# Start dashboard
npm run dashboard

# Open in browser
open http://localhost:3000
```

## 🔄 Updating the CLI Tool

### Automatic Updates

The CLI tool will be updated automatically when you run:

```bash
npm update -g @utsuk-initiative1/playwright-framework-cli
```

### Manual Updates

```bash
# Uninstall current version
npm uninstall -g @utsuk-initiative1/playwright-framework-cli

# Install latest version
npm install -g @utsuk-initiative1/playwright-framework-cli
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Fix npm permissions
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER ~/.npm
```

#### 2. Package Not Found
```bash
# Check if token is set
echo $GITHUB_TOKEN

# Reinstall with token
export GITHUB_TOKEN=your_token_here
npm install -g @utsuk-initiative1/playwright-framework-cli
```

#### 3. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Update Node.js if needed
# Visit https://nodejs.org/ for latest version
```

#### 4. Network Issues
```bash
# Check npm registry
npm config get registry

# Set GitHub Packages registry
npm config set @utsuk-initiative1:registry https://npm.pkg.github.com
```

### Getting Help

1. **Check Documentation**: Read the CLI README files
2. **GitHub Issues**: Report issues on the repository
3. **Team Support**: Ask your team members for help
4. **Logs**: Check npm and CLI logs for error details

## 📚 Additional Resources

- **CLI Documentation**: `CLI_README.md`
- **Quick Start Guide**: `QUICK_START.md`
- **Enhanced Features**: `ENHANCED_CLI_README.md`
- **GitHub Repository**: [https://github.com/utsuk-initiative1/playwright-generic-framework](https://github.com/utsuk-initiative1/playwright-generic-framework)
- **Playwright Documentation**: [https://playwright.dev/](https://playwright.dev/)

## 🎉 Success!

Once you've completed these steps, you'll have:

- ✅ CLI tool installed and working
- ✅ Access to all framework features
- ✅ AI-powered test generation (if configured)
- ✅ Comprehensive testing capabilities
- ✅ Professional reporting and analytics

You're now ready to create robust, scalable test automation frameworks! 🚀

---

**Need Help?** Contact your team lead or check the repository issues for support.
