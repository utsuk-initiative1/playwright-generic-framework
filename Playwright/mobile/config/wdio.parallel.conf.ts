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
  maxInstances: 2,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:platformVersion': '13.0',
      'appium:app': process.env.ANDROID_APP_PATH || './apps/app-debug.apk',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:adbExecTimeout': 120000,
      'appium:androidInstallTimeout': 90000,
      'appium:avdLaunchTimeout': 60000,
      'appium:avdReadyTimeout': 60000,
      'appium:androidDeviceReadyTimeout': 60000
    },
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone Simulator',
      'appium:platformVersion': '16.0',
      'appium:app': process.env.IOS_APP_PATH || './apps/YourApp.app',
      'appium:autoAcceptAlerts': true,
      'appium:noReset': false,
      'appium:newCommandTimeout': 60,
      'appium:useNewWDA': true,
      'appium:shouldTerminateApp': true,
      'appium:preventWDAAttachments': true,
      'appium:webDriverAgentUrl': 'http://localhost:8100'
    }
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  appium: {
    command: 'appium',
    args: {
      address: '127.0.0.1',
      port: 4723,
      log: './logs/appium-parallel.log',
      logLevel: 'info'
    }
  }
};
