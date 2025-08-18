import { defineConfig, devices } from '@playwright/test';
import { ConfigManager } from './framework/config/ConfigManager';

// Initialize configuration manager
const configManager = new ConfigManager();
const testConfig = configManager.getTestConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: testConfig.retries,
  workers: configManager.isCI() ? 1 : testConfig.workers,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  use: {
    baseURL: testConfig.baseUrl,
    headless: configManager.isCI() ? true : testConfig.headless,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: testConfig.timeout,
    navigationTimeout: testConfig.timeout,
    // Add slowMo for debugging if needed
    ...(testConfig.slowMo > 0 && { launchOptions: { slowMo: testConfig.slowMo } }),
    // Conditional settings based on configuration
    ...(testConfig.trace && { trace: 'on-first-retry' }),
    ...(testConfig.screenshot && { screenshot: 'only-on-failure' }),
    ...(testConfig.video && { video: 'on-first-retry' }),
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Add mobile testing projects
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  outputDir: testConfig.reportDir || 'test-results/',
  timeout: testConfig.timeout,
  expect: {
    timeout: 10000,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./framework/setup/globalSetup.ts'),
  globalTeardown: require.resolve('./framework/setup/globalTeardown.ts'),

  // Environment-specific configurations
  ...(configManager.isCI() && {
    retries: 3,
    workers: 1,
  }),
});