import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true
    }
  },
  specs: [
    '../tests/**/*.spec.ts'
  ],
  exclude: [],
  maxInstances: 4, // Run up to 4 tests in parallel
  capabilities: [
    // Android Emulator 1
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator 1',
      'appium:platformVersion': '13.0',
      'appium:app': process.env.ANDROID_APP_PATH || './apps/app-debug.apk',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:adbExecTimeout': 120000,
      'appium:androidInstallTimeout': 90000,
      'appium:avdLaunchTimeout': 60000,
      'appium:avdReadyTimeout': 60000,
      'appium:androidDeviceReadyTimeout': 60000,
      'appium:udid': process.env.ANDROID_UDID_1 || 'emulator-5554'
    },
    // Android Emulator 2
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator 2',
      'appium:platformVersion': '12.0',
      'appium:app': process.env.ANDROID_APP_PATH || './apps/app-debug.apk',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:adbExecTimeout': 120000,
      'appium:androidInstallTimeout': 90000,
      'appium:avdLaunchTimeout': 60000,
      'appium:avdReadyTimeout': 60000,
      'appium:androidDeviceReadyTimeout': 60000,
      'appium:udid': process.env.ANDROID_UDID_2 || 'emulator-5556'
    },
    // iOS Simulator 1 (macOS only)
    ...(process.platform === 'darwin' ? [{
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 14',
      'appium:platformVersion': '16.0',
      'appium:app': process.env.IOS_APP_PATH || './apps/app.app',
      'appium:autoAcceptAlerts': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:webDriverAgentUrl': 'http://localhost:8100',
      'appium:udid': process.env.IOS_UDID_1 || 'simulator-1'
    }] : []),
    // iOS Simulator 2 (macOS only)
    ...(process.platform === 'darwin' ? [{
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 14 Pro',
      'appium:platformVersion': '16.0',
      'appium:app': process.env.IOS_APP_PATH || './apps/app.app',
      'appium:autoAcceptAlerts': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:webDriverAgentUrl': 'http://localhost:8101',
      'appium:udid': process.env.IOS_UDID_2 || 'simulator-2'
    }] : [])
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false
    }]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  appium: {
    command: 'appium',
    args: {
      address: '127.0.0.1',
      port: 4723,
      log: './logs/appium.log',
      logLevel: 'info',
      allowInsecure: ['chromedriver_autodownload']
    }
  },
  // Hooks
  before: async function (capabilities, specs) {
    console.log(`Starting test on ${capabilities.platformName} ${capabilities['appium:deviceName']}`);
  },
  beforeSession: async function (capabilities, specs) {
    console.log(`Session starting for ${capabilities.platformName}`);
  },
  beforeTest: async function (test, context) {
    console.log(`Test starting: ${test.title}`);
  },
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (error) {
      console.log(`Test failed: ${test.title}`);
      // Take screenshot on failure
      await browser.saveScreenshot(`./screenshots/failure_${Date.now()}.png`);
    }
  },
  afterSession: async function (capabilities, specs) {
    console.log(`Session ending for ${capabilities.platformName}`);
  },
  after: async function (capabilities, specs) {
    console.log(`Test completed on ${capabilities.platformName}`);
  }
};
