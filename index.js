#!/usr/bin/env node

/**
 * @utsuk-initiative/playwright-framework
 * 
 * A comprehensive Playwright automation framework with mobile support.
 * Provides robust testing capabilities for web, API, mobile, and performance testing.
 * 
 * @author Utsuk Initiative
 * @version 2.0.0
 */

// Export main framework components
module.exports = {
  // Framework info
  version: require('./package.json').version,
  description: 'Comprehensive Playwright automation framework with mobile support',
  
  // Configuration
  frameworkConfig: require('./framework.config'),
  playwrightConfig: require('./playwright.config'),
  
  // Core utilities
  utilities: require('./framework/utils/Utilities'),
  assertionUtils: require('./framework/utils/AssertionUtils'),
  uiAssertionUtils: require('./framework/utils/UIAssertionUtils'),
  apiAssertionUtils: require('./framework/utils/ApiAssertionUtils'),
  
  // Base classes
  basePage: require('./framework/core/BasePage'),
  testBase: require('./framework/core/TestBase'),
  
  // Constants
  constants: require('./framework/constants/Constants'),
  
  // Environment config
  environmentConfig: require('./framework/config/EnvironmentConfig'),
  
  // Mobile framework (if available)
  mobile: require('./Playwright/mobile')
};

// CLI setup for direct usage
if (require.main === module) {
  console.log('🚀 Utsuk Initiative Playwright Framework');
  console.log('Version:', require('./package.json').version);
  console.log('');
  console.log('Available commands:');
  console.log('  npm test                    - Run all tests');
  console.log('  npm run test:ui            - Run tests with UI');
  console.log('  npm run test:headed        - Run tests in headed mode');
  console.log('  npm run test:debug         - Run tests in debug mode');
  console.log('  npm run test:smoke         - Run smoke tests');
  console.log('  npm run test:regression    - Run regression tests');
  console.log('  npm run test:accessibility - Run accessibility tests');
  console.log('  npm run test:performance   - Run performance tests');
  console.log('  npm run test:e2e           - Run end-to-end tests');
  console.log('  npm run test:api           - Run API tests');
  console.log('  npm run test:visual        - Run visual tests');
  console.log('  npm run test:mobile        - Run mobile tests');
  console.log('');
  console.log('For more information, visit:');
  console.log('https://github.com/utsuk-initiative1/playwright-generic-framework');
}
