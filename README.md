# 🚀 Playwright Generic Framework

A comprehensive, modular Playwright automation framework supporting E2E, API, mobile, accessibility, performance, and visual testing.

## 📦 Quick Start with CLI

### One-Line Installation
```bash
curl -fsSL https://raw.githubusercontent.com/utsuk-initiative1/playwright-generic-framework/main/Playwright/install-cli.sh | bash
```

### Manual Installation
```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Install the CLI tool
npm install -g @utsuk-initiative1/playwright-framework-cli

# Create your first project
playwright-framework
```

## 🎯 What You Get

This framework provides a complete testing solution with:

- 🎯 **Interactive CLI Setup** - Guided project creation

- ♿ **Accessibility Testing** - WCAG compliance checking
- 📱 **Mobile Testing** - Device simulation and touch testing
- 🔍 **Visual Regression Testing** - Screenshot comparison
- 📊 **Performance Testing** - Lighthouse integration
- 🧪 **API Testing** - REST and GraphQL support
- 📈 **Comprehensive Reporting** - HTML, JSON, and dashboard
- 🚀 **CI/CD Integration** - GitHub Actions, GitLab CI, Jenkins
- 🐳 **Docker Support** - Containerized testing
- ☁️ **Cloud Testing** - Cross-browser testing

## 🏗️ Framework Architecture

```
your-project/
├── framework/
│   ├── config/          # Environment and runner configuration
│   ├── core/            # Base classes and test foundation
│   ├── interactions/    # Browser interaction modules
│   ├── utils/           # Utility functions and helpers
│   └── constants/       # Framework constants
├── tests/
│   ├── smoke/           # Critical path tests
│   ├── regression/      # Comprehensive test suites
│   ├── e2e/            # End-to-end workflows
│   ├── accessibility/   # WCAG compliance tests
│   ├── performance/     # Performance benchmarks
│   ├── api/            # API endpoint tests
│   ├── visual/         # Visual regression tests
│   └── mobile/         # Mobile-specific tests
├── data/               # Test data and fixtures
├── baseline-screenshots/ # Visual test baselines
├── reports/            # Test execution reports
├── ci-cd/              # CI/CD pipeline scripts
├── dashboard/          # Real-time test monitoring
└── config files        # Playwright and framework config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **GitHub account** with repository access
- **GitHub Personal Access Token** (for CLI installation)

### Step 1: Get GitHub Token
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Generate new token with `read:packages` scope
3. Copy the token

### Step 2: Install CLI Tool
```bash
# Option A: Using installation script (recommended)
curl -fsSL https://raw.githubusercontent.com/utsuk-initiative1/playwright-generic-framework/main/Playwright/install-cli.sh | bash

# Option B: Manual installation
export GITHUB_TOKEN=your_github_token_here
npm install -g @utsuk-initiative1/playwright-framework-cli
```

### Step 3: Create Your Project
```bash
# Start interactive setup
playwright-framework

# Or use short alias
pw-framework

# Or use branded command
utsuk-playwright
```

### Step 4: Follow the Prompts
1. **Project Name** - Choose a descriptive name
2. **Target URL** - Your application URL
3. **Template** - Basic, Standard, Enterprise, or Mobile
4. **Features** - Select testing capabilities

### Step 5: Run Your Tests
```bash
cd your-project-name
npm install
npx playwright install
npm test
```

## 🛠️ Available Commands

### CLI Commands
```bash
playwright-framework          # Main command
pw-framework                  # Short alias
utsuk-playwright             # Branded command


```

### Test Commands
```bash
npm test                     # Run all tests
npm run test:ui             # Run with Playwright UI
npm run test:smoke          # Smoke tests only
npm run test:regression     # Regression tests only
npm run test:e2e            # End-to-end tests only
npm run test:accessibility  # Accessibility tests only
npm run test:performance    # Performance tests only
npm run test:api            # API tests only
npm run test:visual         # Visual regression tests only
npm run test:mobile         # Mobile tests only
```

### Browser-Specific Tests
```bash
npm run test:chrome         # Chrome only
npm run test:firefox        # Firefox only
npm run test:safari         # Safari only
npm run test:mobile-chrome  # Mobile Chrome
npm run test:mobile-safari  # Mobile Safari
```

### Environment-Specific Tests
```bash
npm run test:local          # Local environment
npm run test:staging        # Staging environment
npm run test:production     # Production environment
```

### Utility Commands
```bash
npm run report              # Show test report
npm run dashboard           # Start monitoring dashboard
npm run install-browsers    # Install Playwright browsers
npm run codegen             # Generate tests with Codegen
npm run trace               # Show trace viewer
npm run update-baselines    # Update visual test baselines
```



## 📊 Reporting & Analytics

### HTML Reports
```bash
npm test                    # Generates HTML report
npm run report              # Opens report viewer
```

### JSON Reports
```bash
npx playwright test --reporter=json
```

### Dashboard
```bash
npm run dashboard           # Start real-time monitoring
# Open http://localhost:3000
```

### Features
- 📈 **Real-time Monitoring** - Live test execution tracking
- 📊 **Performance Metrics** - Response times and benchmarks
- 🎯 **Test Analytics** - Success rates and trends
- 📱 **Mobile Insights** - Device-specific performance
- ♿ **Accessibility Reports** - WCAG compliance status

## 🔧 Configuration

### Environment Setup
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

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI
```yaml
stages:
  - test

playwright:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm test
  artifacts:
    when: always
    paths:
      - playwright-report/
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
                sh 'npm test'
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

## 🐳 Docker Support

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["npm", "test"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  playwright:
    build: .
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - CI=true
```

## 📚 Documentation

- **[Team Setup Guide](Playwright/TEAM_SETUP_GUIDE.md)** - Complete setup instructions
- **[Quick Reference](Playwright/QUICK_REFERENCE.md)** - Common commands
- **[CLI Documentation](Playwright/CLI_README.md)** - CLI tool details
- **[Enhanced Features](Playwright/ENHANCED_CLI_README.md)** - Advanced capabilities
- **[GitHub Packages Guide](Playwright/GITHUB_PACKAGES_GUIDE.md)** - Package management

## 🛠️ Troubleshooting

### Common Issues

#### Permission Denied
```bash
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER ~/.npm
```

#### Package Not Found
```bash
export GITHUB_TOKEN=your_token_here
npm install -g @utsuk-initiative1/playwright-framework-cli
```

#### Node.js Version Issues
```bash
node --version  # Should be 16+
# Update from https://nodejs.org/
```

#### Network Issues
```bash
npm config set @utsuk-initiative1:registry https://npm.pkg.github.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **GitHub Issues**: [Report Issues](https://github.com/utsuk-initiative1/playwright-generic-framework/issues)
- **Documentation**: Check the guides in the `Playwright/` directory
- **Team Support**: Contact your team lead

## 🎉 Acknowledgments

- **Playwright Team** - For the amazing testing framework

- **Open Source Community** - For contributions and feedback

---

**Made with ❤️ by Utsuk Initiative**

**Repository**: https://github.com/utsuk-initiative1/playwright-generic-framework
