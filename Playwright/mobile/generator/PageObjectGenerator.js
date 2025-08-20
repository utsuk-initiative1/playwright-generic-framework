const fs = require('fs');
const path = require('path');

class PageObjectGenerator {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.mobilePath = path.join(projectPath, 'mobile');
  }

  async generateFramework(analysis) {
    console.log('📝 Generating mobile automation framework...');
    
    try {
      await this.createMobileStructure();
      await this.generatePageObjects(analysis);
      await this.generateTestTemplates(analysis);
      await this.generateConfigFiles(analysis);
      
      console.log('✅ Mobile automation framework generated successfully!');
    } catch (error) {
      console.error('❌ Error generating framework:', error.message);
      throw error;
    }
  }

  async createMobileStructure() {
    const directories = [
      'mobile/config',
      'mobile/core',
      'mobile/pages',
      'mobile/tests',
      'mobile/apps'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.projectPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    }
  }

  async generatePageObjects(analysis) {
    console.log('📄 Generating page objects...');
    
    // Generate base mobile page
    const basePageContent = `import { Remote } from 'webdriverio';

export abstract class BaseMobilePage {
  protected driver: Remote;

  constructor(driver: Remote) {
    this.driver = driver;
  }

  async clickElement(locator: string): Promise<void> {
    await this.driver.$(locator).click();
  }

  async fillInput(locator: string, value: string): Promise<void> {
    await this.driver.$(locator).setValue(value);
  }

  async getDeviceInfo(): Promise<any> {
    const platform = await this.driver.getPlatform();
    const version = await this.driver.getPlatformVersion();
    const device = await this.driver.getDeviceName();
    return { platform, version, device };
  }
}`;

    const basePagePath = path.join(this.mobilePath, 'core', 'BaseMobilePage.ts');
    fs.writeFileSync(basePagePath, basePageContent);
    console.log('✅ Generated BaseMobilePage.ts');

    // Generate login page
    const loginPageContent = `import { Remote } from 'webdriverio';
import { BaseMobilePage } from '../core/BaseMobilePage';

export class LoginPage extends BaseMobilePage {
  constructor(driver: Remote) {
    super(driver);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput('#email', email);
    await this.fillInput('#password', password);
    await this.clickElement('#login');
  }
}`;

    const loginPagePath = path.join(this.mobilePath, 'pages', 'LoginPage.ts');
    fs.writeFileSync(loginPagePath, loginPageContent);
    console.log('✅ Generated LoginPage.ts');
  }

  async generateTestTemplates(analysis) {
    console.log('🧪 Generating test templates...');
    
    const testContent = `import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { LoginPage } from '../pages/LoginPage';

describe('Mobile App Tests', () => {
  let loginPage: LoginPage;

  before(async () => {
    loginPage = new LoginPage(driver);
  });

  it('should launch app successfully', async () => {
    const deviceInfo = await loginPage.getDeviceInfo();
    expect(deviceInfo.platform).to.be.a('string');
    console.log('Device Info:', deviceInfo);
  });
});`;

    const testPath = path.join(this.mobilePath, 'tests', 'basic-functionality.spec.ts');
    fs.writeFileSync(testPath, testContent);
    console.log('✅ Generated basic-functionality.spec.ts');
  }

  async generateConfigFiles(analysis) {
    console.log('⚙️ Generating configuration files...');
    
    const configContent = `import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['../tests/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [{
    platformName: '${analysis.platform === 'android' ? 'Android' : 'iOS'}',
    'appium:automationName': '${analysis.platform === 'android' ? 'UiAutomator2' : 'XCUITest'}',
    'appium:deviceName': '${analysis.platform === 'android' ? 'Android Emulator' : 'iPhone Simulator'}',
    'appium:app': './apps/${analysis.appName.toLowerCase().replace(/\s+/g, '-')}.${analysis.platform === 'android' ? 'apk' : 'app'}'
  }],
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec']
};`;

    const configPath = path.join(this.mobilePath, 'config', 'wdio.conf.ts');
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Generated wdio.conf.ts');
  }
}

module.exports = PageObjectGenerator;
