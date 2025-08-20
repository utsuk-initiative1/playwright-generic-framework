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
  maxInstances: 1,
  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone Simulator',
    'appium:platformVersion': '16.0',
    'appium:app': process.env.IOS_APP_PATH || './apps/YourApp.app',
    'appium:autoAcceptAlerts': true,
    'appium:noReset': false,
    'appium:newCommandTimeout': 60,
    'appium:webDriverAgentUrl': 'http://localhost:8100',
    'appium:useNewWDA': true,
    'appium:shouldTerminateApp': true,
    'appium:preventWDAAttachments': true,
    'appium:webDriverAgentUrl': 'http://localhost:8100'
  }],
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
      port: 4724,
      log: './logs/appium-ios.log',
      logLevel: 'info'
    }
  }
};
