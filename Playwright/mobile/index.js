#!/usr/bin/env node

/**
 * @utsuk-initiative/mobile-automation-framework
 * 
 * A comprehensive mobile automation framework built with Appium and WebDriverIO.
 * Provides robust testing capabilities for both Android and iOS mobile applications.
 * 
 * @author Utsuk Initiative
 * @version 1.0.0
 */

// Export main framework components
module.exports = {
  // Core classes
  BaseMobilePage: require('./core/BaseMobilePage'),
  MobileTestBase: require('./core/MobileTestBase'),
  
  // Page objects
  MobileLoginPage: require('./pages/MobileLoginPage'),
  MobileDashboardPage: require('./pages/MobileDashboardPage'),
  MobileProfilePage: require('./pages/MobileProfilePage'),
  
  // Utilities
  MobileUtilities: require('./utils/MobileUtilities'),
  MobileAssertionUtils: require('./utils/MobileAssertionUtils'),
  
  // Configuration
  androidConfig: require('./config/wdio.android.conf'),
  iosConfig: require('./config/wdio.ios.conf'),
  parallelConfig: require('./config/wdio.parallel.conf'),
  
  // Framework info
  version: require('./package.json').version,
  description: 'Mobile automation framework using Appium and WebDriverIO'
};

// CLI setup for direct usage
if (require.main === module) {
  console.log('🚀 Utsuk Initiative Mobile Automation Framework');
  console.log('Version:', require('./package.json').version);
  console.log('');
  console.log('Available commands:');
  console.log('  npm run mobile:android     - Run Android tests');
  console.log('  npm run mobile:ios         - Run iOS tests (macOS only)');
  console.log('  npm run mobile:parallel    - Run tests in parallel');
  console.log('  npm run mobile:login       - Run login tests');
  console.log('  npm run mobile:dashboard   - Run dashboard tests');
  console.log('  npm run mobile:profile     - Run profile tests');
  console.log('  npm run mobile:setup       - Setup mobile environment');
  console.log('');
  console.log('For more information, visit:');
  console.log('https://github.com/utsuk-initiative1/playwright-generic-framework');
}
