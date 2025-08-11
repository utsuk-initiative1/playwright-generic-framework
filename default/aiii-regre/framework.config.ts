import { defineConfig, devices } from '@playwright/test';
import { configManager } from './framework/config/EnvironmentConfig';

const config = configManager.getConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: config.retries,
  workers: process.env.CI ? 1 : undefined,
  
  // Enhanced reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

  // Global test configuration
  use: {
    baseURL: config.baseURL,
    trace: config.traceRecording ? 'on-first-retry' : 'off',
    screenshot: config.screenshotOnFailure ? 'only-on-failure' : 'off',
    video: config.videoRecording ? 'on-first-retry' : 'off',
    headless: config.headless,
    viewport: config.viewport,
    userAgent: config.userAgent,
    actionTimeout: config.timeout,
    navigationTimeout: config.timeout,
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  // Multiple browser configurations
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--no-sandbox']
        }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          args: ['--no-sandbox']
        }
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro 11 landscape'] },
    },
  ],

  // Web server configuration
  webServer: process.env.START_SERVER === 'true' ? {
    command: process.env.SERVER_COMMAND || 'npm run start',
    url: process.env.SERVER_URL || config.baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,

  // Test output directory
  outputDir: 'test-results/',

  // Timeout configuration
  timeout: config.timeout,
  expect: {
    timeout: 10000,
  },

  // Metadata
  metadata: {
    framework: 'Playwright',
    version: '2.0.0',
    environment: process.env.TEST_ENV || 'staging',
    browser: 'chromium',
  },
});