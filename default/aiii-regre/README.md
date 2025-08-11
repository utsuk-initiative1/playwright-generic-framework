# Playwright Automation Framework

A comprehensive Playwright automation framework with TypeScript support.

## Features

- api testing
- visual testing
- performance testing
- accessibility testing
- mobile testing
- ci cd-templates
- docker support
- cloud testing
- reporting dashboard
- test generator
- interactions module
- runner configuration
- utilities module
- constants module

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Available Scripts

- `npm test` - Run all tests
- `npm run test:ui` - Run tests with Playwright UI
- `npm run test:headed` - Run tests in headed mode
- `npm run test:debug` - Run tests in debug mode
- `npm run test:chrome` - Run tests only in Chrome
- `npm run test:firefox` - Run tests only in Firefox
- `npm run test:safari` - Run tests only in Safari
- `npm run test:mobile` - Run tests on mobile devices
- `npm run test:staging` - Run tests against staging environment
- `npm run test:production` - Run tests against production environment
- `npm run report` - Show test report

## Project Structure

```
aiii-regre/
        ├── framework/
│   ├── config/          # Configuration files
│   ├── core/            # Core framework classes
│   ├── pages/           # Page Object Models
│   ├── setup/           # Global setup/teardown
│   ├── tests/           # Test files
│   └── utils/           # Utility functions
├── data/                # Test data files
├── fixtures/            # Test fixtures
├── sample-tests/        # Sample test suites
├── test-results/        # Test execution results
└── playwright-report/   # HTML test reports
```

## Configuration

Update `framework/config/EnvironmentConfig.ts` to configure your environments.

## Writing Tests

1. Create page objects in `framework/pages/`
2. Write tests in `tests/`
3. Use the BasePage class for common operations

## Environment Variables

- `TEST_ENV` - Set environment (local, staging, production)
- `TEST_USERNAME` - Test username
- `TEST_PASSWORD` - Test password

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include meaningful test descriptions
4. Use page object model pattern
