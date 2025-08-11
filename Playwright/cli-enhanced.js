#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class PlaywrightFrameworkCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.projectName = '';
    this.config = {};
    this.isVerbose = false;
  }

  async run() {
    console.log('\n🚀 Playwright Automation Framework Setup CLI v2.0\n');
    console.log('Enhanced with interactive menus, smart defaults, and validation!\n');

    try {
      await this.showMainMenu();
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      if (this.isVerbose) {
        console.error('Stack trace:', error.stack);
      }
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async showMainMenu() {
    while (true) {
      console.log('\n🎯 Main Menu\n');
      console.log('1. 🚀 Create new project');
      console.log('2. 🔧 Add features to existing project');
      console.log('3. 📊 Generate test reports');
      console.log('4. 🔍 Project health check');
      console.log('5. 📚 Show documentation');
      console.log('6. ⚙️  Settings');
      console.log('7. ❌ Exit');
      
      const choice = await this.question('\nSelect an option (1-7): ');
      
      switch (choice) {
        case '1':
          await this.createNewProject();
          break;
        case '2':
          await this.addFeaturesToProject();
          break;
        case '3':
          await this.generateTestReports();
          break;
        case '4':
          await this.projectHealthCheck();
          break;
        case '5':
          await this.showDocumentation();
          break;
        case '6':
          await this.showSettings();
          break;
        case '7':
          console.log('\n👋 Goodbye! Happy testing! 🎉');
          return;
        default:
          console.log('\n❌ Invalid option. Please select 1-7.');
      }
    }
  }

  async createNewProject() {
    console.log('\n🚀 Creating New Project\n');
    
    await this.getProjectDetails();
    await this.showProgress('Creating project structure', () => this.createProjectStructure());
    await this.showProgress('Installing dependencies', () => this.installDependencies());
    await this.showProgress('Configuring environment', () => this.configureEnvironment());
    await this.showProgress('Creating sample tests', () => this.createSampleTests());
    await this.showProgress('Setting up Git repository', () => this.setupGit());
    await this.displayNextSteps();
  }

  async getProjectDetails() {
    console.log('📋 Project Configuration\n');
    
    // Project name with validation
    this.projectName = await this.getValidProjectName();
    
    // Base URL with validation
    this.config.baseURL = await this.getValidURL('application base URL', 'https://example.com');
    
    // API URL with validation
    this.config.apiURL = await this.getValidURL('API base URL', 'https://api.example.com');
    
    // Environment selection with smart defaults
    this.config.environments = await this.selectEnvironments();
    
    // Additional configuration
    await this.getAdditionalConfig();
    
    console.log('\n✅ Project details captured!\n');
  }

  async getValidProjectName() {
    while (true) {
      const name = await this.question('Enter project name (default: playwright-automation): ') || 'playwright-automation';
      
      if (this.isValidProjectName(name)) {
        if (fs.existsSync(name)) {
          const overwrite = await this.question(`⚠️  Project "${name}" already exists. Overwrite? (y/n): `);
          if (overwrite.toLowerCase() === 'y') {
            fs.rmSync(name, { recursive: true, force: true });
            console.log('✅ Existing project removed.');
          } else {
            continue;
          }
        }
        return name;
      } else {
        console.log('❌ Invalid project name. Use only letters, numbers, hyphens, and underscores.');
      }
    }
  }

  async getValidURL(prompt, defaultValue) {
    while (true) {
      const url = await this.question(`Enter your ${prompt} (default: ${defaultValue}): `) || defaultValue;
      
      if (this.isValidUrl(url)) {
        return url;
      } else {
        console.log('❌ Invalid URL format. Please enter a valid URL (e.g., https://example.com)');
      }
    }
  }

  async selectEnvironments() {
    console.log('\n🌍 Environment Configuration\n');
    console.log('Available environments:');
    console.log('1. local (Development)');
    console.log('2. staging (Testing)');
    console.log('3. production (Live)');
    console.log('4. custom (Specify your own)');
    
    const choice = await this.question('\nSelect environments (1-4, comma-separated, default: 1,2,3): ') || '1,2,3';
    
    const environmentMap = {
      '1': 'local',
      '2': 'staging', 
      '3': 'production',
      '4': 'custom'
    };
    
    const selectedNumbers = choice.split(',').map(n => n.trim());
    let environments = selectedNumbers.map(n => environmentMap[n]).filter(Boolean);
    
    // Handle custom environment
    if (environments.includes('custom')) {
      const customEnv = await this.question('Enter custom environment name: ');
      environments = environments.filter(env => env !== 'custom');
      environments.push(customEnv);
    }
    
    // Smart defaults based on URL
    if (this.config.baseURL.includes('localhost') && !environments.includes('local')) {
      environments.unshift('local');
      console.log('✅ Added local environment (detected localhost URL)');
    }
    
    return environments;
  }

  async getAdditionalConfig() {
    console.log('\n⚙️ Additional Configuration\n');
    
    // Browser selection
    this.config.browsers = await this.selectBrowsers();
    
    // Test features
    this.config.features = await this.selectFeatures();
    
    // Reporting options
    this.config.reporting = await this.selectReporting();
  }

  async selectBrowsers() {
    console.log('\n🌐 Browser Selection\n');
    const browsers = [
      { name: 'chromium', default: true },
      { name: 'firefox', default: true },
      { name: 'webkit', default: true },
      { name: 'mobile-chrome', default: false },
      { name: 'mobile-safari', default: false }
    ];
    
    const selectedBrowsers = [];
    
    for (const browser of browsers) {
      const choice = await this.question(`Include ${browser.name}? (${browser.default ? 'Y' : 'y'}/n): `);
      if (choice === '' || choice.toLowerCase() === 'y') {
        selectedBrowsers.push(browser.name);
      }
    }
    
    return selectedBrowsers;
  }

  async selectFeatures() {
    console.log('\n🔧 Feature Selection\n');
    const features = [
      { name: 'api-testing', description: 'API testing capabilities' },
      { name: 'visual-testing', description: 'Visual regression testing' },
      { name: 'accessibility-testing', description: 'Accessibility testing' },
      { name: 'performance-testing', description: 'Performance testing' },
      { name: 'mobile-testing', description: 'Mobile device testing' }
    ];
    
    const selectedFeatures = [];
    
    for (const feature of features) {
      const choice = await this.question(`Include ${feature.description}? (y/N): `);
      if (choice.toLowerCase() === 'y') {
        selectedFeatures.push(feature.name);
      }
    }
    
    return selectedFeatures;
  }

  async selectReporting() {
    console.log('\n📊 Reporting Options\n');
    const reports = [
      { name: 'html', default: true },
      { name: 'json', default: true },
      { name: 'junit', default: true },
      { name: 'allure', default: false }
    ];
    
    const selectedReports = [];
    
    for (const report of reports) {
      const choice = await this.question(`Include ${report.name.toUpperCase()} reports? (${report.default ? 'Y' : 'y'}/n): `);
      if (choice === '' || choice.toLowerCase() === 'y') {
        selectedReports.push(report.name);
      }
    }
    
    return selectedReports;
  }

  async showProgress(message, task) {
    console.log(`\n⏳ ${message}...`);
    const startTime = Date.now();
    
    try {
      await task();
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ ${message} completed in ${duration}s`);
    } catch (error) {
      console.log(`❌ ${message} failed: ${error.message}`);
      throw error;
    }
  }

  async createProjectStructure() {
    const directories = [
      'packages/config',
      'packages/core',
      'packages/pages',
      'packages/setup',
      'packages/tests',
      'packages/utils',
      'data',
      'fixtures',
      'test-results',
      'playwright-report',
      'sample-tests/authentication',
      'sample-tests/products',
      'sample-tests/purchases',
      'sample-tests/views'
    ];

    // Add feature-specific directories
    if (this.config.features.includes('api-testing')) {
      directories.push('packages/api');
    }
    if (this.config.features.includes('visual-testing')) {
      directories.push('packages/visual');
    }
    if (this.config.features.includes('accessibility-testing')) {
      directories.push('packages/a11y');
    }

    directories.forEach(dir => {
      const fullPath = path.join(this.projectName, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async installDependencies() {
    const packageJson = this.generatePackageJson();
    
    fs.writeFileSync(
      path.join(this.projectName, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    const tsconfig = this.generateTsConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Install dependencies
    try {
      execSync('npm install', { cwd: this.projectName, stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Failed to install dependencies automatically. Please run "npm install" manually.');
    }

    // Install Playwright browsers
    try {
      execSync('npx playwright install', { cwd: this.projectName, stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Failed to install browsers automatically. Please run "npx playwright install" manually.');
    }
  }

  generatePackageJson() {
    const scripts = {
      "test": "playwright test --config=framework.config.ts",
      "test:ui": "playwright test --config=framework.config.ts --ui",
      "test:headed": "playwright test --config=framework.config.ts --headed",
      "test:debug": "playwright test --config=framework.config.ts --debug",
      "test:packages": "playwright test packages/tests/ --config=framework.config.ts",
      "test:example": "playwright test packages/tests/example-test.spec.ts --config=framework.config.ts",
      "test:all": "playwright test --config=framework.config.ts",
      "test:suites": "playwright test --config=framework.config.ts --reporter=html && playwright show-report",
      "test:parallel": "playwright test --config=framework.config.ts --workers=4",
      "test:sequential": "playwright test --config=framework.config.ts --workers=1",
      "report": "playwright show-report",
      "install-browsers": "playwright install",
      "codegen": "playwright codegen",
      "trace": "playwright show-trace",
      "packages:setup": "node -e \"console.log('Packages setup completed. Update framework.config.ts with your application URLs.')\"",
      "packages:docs": "echo 'Packages documentation available at packages/README.md'"
    };

    // Add browser-specific scripts
    this.config.browsers.forEach(browser => {
      scripts[`test:${browser}`] = `playwright test --config=framework.config.ts --project=${browser}`;
    });

    // Add environment-specific scripts
    this.config.environments.forEach(env => {
      scripts[`test:${env}`] = `TEST_ENV=${env} playwright test --config=framework.config.ts`;
    });

    return {
      name: this.projectName,
      version: "2.0.0",
      description: "Comprehensive Playwright automation framework",
      main: "index.js",
      scripts,
      keywords: [
        "playwright",
        "testing",
        "automation",
        "framework",
        "e2e",
        "typescript",
        "page-object-model",
        "api-testing",
        "mobile-testing"
      ],
      author: "Your Name",
      license: "MIT",
      devDependencies: {
        "@playwright/test": "^1.53.0",
        "@types/node": "^20.11.24"
      },
      engines: {
        "node": ">=16.0.0"
      }
    };
  }

  generateTsConfig() {
    return {
      "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "outDir": "./dist",
        "rootDir": "./",
        "baseUrl": "./",
        "paths": {
          "@/*": ["./packages/*"],
          "@config/*": ["./packages/config/*"],
          "@core/*": ["./packages/core/*"],
          "@pages/*": ["./packages/pages/*"],
          "@utils/*": ["./packages/utils/*"],
          "@data/*": ["./data/*"],
          "@fixtures/*": ["./fixtures/*"]
        }
      },
      "include": [
        "packages/**/*",
        "tests/**/*",
        "sample-tests/**/*"
      ],
      "exclude": [
        "node_modules",
        "dist",
        "test-results",
        "playwright-report"
      ]
    };
  }

  async configureEnvironment() {
    const envConfigContent = this.generateEnvironmentConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'packages/config/EnvironmentConfig.ts'),
      envConfigContent
    );

    const frameworkConfigContent = this.generateFrameworkConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'framework.config.ts'),
      frameworkConfigContent
    );

    const playwrightConfigContent = this.generatePlaywrightConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'playwright.config.ts'),
      playwrightConfigContent
    );
  }

  async createSampleTests() {
    // Create BasePage.ts
    const basePageContent = this.generateBasePage();
    fs.writeFileSync(
      path.join(this.projectName, 'packages/core/BasePage.ts'),
      basePageContent
    );

    // Create TestBase.ts
    const testBaseContent = this.generateTestBase();
    fs.writeFileSync(
      path.join(this.projectName, 'packages/core/TestBase.ts'),
      testBaseContent
    );

    // Create sample test
    const sampleTestContent = this.generateSampleTest();
    fs.writeFileSync(
      path.join(this.projectName, 'packages/tests/example-test.spec.ts'),
      sampleTestContent
    );

    // Create README.md
    const readmeContent = this.generateReadme();
    fs.writeFileSync(
      path.join(this.projectName, 'README.md'),
      readmeContent
    );
  }

  async setupGit() {
    const gitignoreContent = this.generateGitignore();
    fs.writeFileSync(
      path.join(this.projectName, '.gitignore'),
      gitignoreContent
    );

    try {
      execSync('git init', { cwd: this.projectName, stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Failed to initialize Git repository. Please run "git init" manually.');
    }
  }

  async displayNextSteps() {
    console.log('\n🎉 Project setup completed successfully!\n');
    console.log('📋 Next Steps:\n');
    console.log(`1. Navigate to your project: cd ${this.projectName}`);
    console.log('2. Update packages/config/EnvironmentConfig.ts with your application URLs');
    console.log('3. Create your first page object in packages/pages/');
    console.log('4. Write your first test in packages/tests/');
    console.log('5. Run tests: npm test');
    console.log('\n📚 Documentation:');
    console.log('- Framework README: README.md');
    console.log('- Playwright docs: https://playwright.dev/');
    console.log('\n🚀 Happy testing!\n');
  }

  // Utility methods
  isValidProjectName(name) {
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0;
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  // Placeholder methods for other menu options
  async addFeaturesToProject() {
    console.log('\n🔧 Add Features to Project\n');
    console.log('This feature is coming soon! 🚀');
    console.log('You can manually add features by editing the configuration files.');
  }

  async generateTestReports() {
    console.log('\n📊 Generate Test Reports\n');
    console.log('This feature is coming soon! 🚀');
    console.log('Use "npm run report" to view existing reports.');
  }

  async projectHealthCheck() {
    console.log('\n🔍 Project Health Check\n');
    console.log('This feature is coming soon! 🚀');
    console.log('Check your project manually for:');
    console.log('- Dependencies are up to date');
    console.log('- Tests are running successfully');
    console.log('- Configuration is valid');
  }

  async showDocumentation() {
    console.log('\n📚 Documentation\n');
    console.log('1. 🚀 Quick Start Guide');
    console.log('2. 📖 Framework Documentation');
    console.log('3. 🎯 Best Practices');
    console.log('4. 🔧 Troubleshooting');
    console.log('5. 📞 Support & Community');
    
    const choice = await this.question('\nSelect documentation topic (1-5): ');
    
    const docs = {
      '1': 'Quick Start: https://playwright.dev/docs/intro',
      '2': 'Framework Docs: Check README.md in your project',
      '3': 'Best Practices: https://playwright.dev/docs/best-practices',
      '4': 'Troubleshooting: https://playwright.dev/docs/troubleshooting',
      '5': 'Community: https://playwright.dev/community'
    };
    
    console.log(`\n📖 ${docs[choice] || 'Invalid selection'}`);
  }

  async showSettings() {
    console.log('\n⚙️ Settings\n');
    console.log('1. Toggle verbose mode');
    console.log('2. Reset configuration');
    console.log('3. Back to main menu');
    
    const choice = await this.question('\nSelect setting (1-3): ');
    
    switch (choice) {
      case '1':
        this.isVerbose = !this.isVerbose;
        console.log(`✅ Verbose mode ${this.isVerbose ? 'enabled' : 'disabled'}`);
        break;
      case '2':
        this.config = {};
        console.log('✅ Configuration reset');
        break;
      case '3':
        return;
      default:
        console.log('❌ Invalid option');
    }
  }

  // Configuration generation methods (simplified for brevity)
  generateEnvironmentConfig() {
    // Implementation similar to original but with enhanced features
    return `export interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  username: string;
  password: string;
  timeout: number;
  retries: number;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  screenshotOnFailure: boolean;
  videoRecording: boolean;
  traceRecording: boolean;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const environment = process.env.TEST_ENV || 'staging';
    
    const baseConfigs: Record<string, EnvironmentConfig> = {
      "staging": {
        "baseURL": "${this.config.baseURL}",
        "apiURL": "${this.config.apiURL}",
        "username": "process.env.STAGING_USERNAME || 'staginguser'",
        "password": "process.env.STAGING_PASSWORD || 'stagingpass'",
        "timeout": 30000,
        "retries": 2,
        "headless": true,
        "viewport": { "width": 1920, "height": 1080 },
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "screenshotOnFailure": true,
        "videoRecording": false,
        "traceRecording": false
      }
    };

    return baseConfigs[environment] || baseConfigs.staging;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }
}

export const configManager = ConfigManager.getInstance();`;
  }

  generateFrameworkConfig() {
    return `import { defineConfig, devices } from '@playwright/test';
import { configManager } from './packages/config/EnvironmentConfig';

const config = configManager.getConfig();

export default defineConfig({
  testDir: './packages/tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: config.retries,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

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
  ],

  outputDir: 'test-results/',
  timeout: config.timeout,
  expect: {
    timeout: 10000,
  },
});`;
  }

  generatePlaywrightConfig() {
    return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './packages/tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  use: {
    baseURL: '${this.config.baseURL}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: false,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 30000,
    navigationTimeout: 30000,
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
  ],

  outputDir: 'test-results/',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
});`;
  }

  generateBasePage() {
    return `import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: \`test-results/\${name}.png\` });
  }

  async getElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  async clickElement(selector: string) {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async expectElementToBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementToHaveText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }
}`;
  }

  generateTestBase() {
    return `import { test as base } from '@playwright/test';
import { BasePage } from './BasePage';

export const test = base.extend<{ basePage: BasePage }>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

export { expect } from '@playwright/test';`;
  }

  generateSampleTest() {
    return `import { test, expect } from '../core/TestBase';

test.describe('Sample Test Suite', () => {
  test('should navigate to homepage', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Verify page title
    await expect(page).toHaveTitle(/.*/);
    
    // Take screenshot
    await basePage.takeScreenshot('homepage');
  });

  test('should verify page elements', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    
    // Example: verify a common element exists
    // await basePage.expectElementToBeVisible('body');
    
    console.log('Page URL:', page.url());
  });
});`;
  }

  generateReadme() {
    return `# Playwright Automation Framework

A comprehensive Playwright automation framework with TypeScript support.

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Install Playwright browsers:
   \`\`\`bash
   npx playwright install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

## Available Scripts

- \`npm test\` - Run all tests
- \`npm run test:ui\` - Run tests with Playwright UI
- \`npm run test:headed\` - Run tests in headed mode
- \`npm run test:debug\` - Run tests in debug mode
- \`npm run test:chrome\` - Run tests only in Chrome
- \`npm run test:firefox\` - Run tests only in Firefox
- \`npm run test:safari\` - Run tests only in Safari
- \`npm run test:mobile\` - Run tests on mobile devices
- \`npm run test:staging\` - Run tests against staging environment
- \`npm run test:production\` - Run tests against production environment
- \`npm run report\` - Show test report

## Project Structure

\`\`\`
${this.projectName}/
├── packages/
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
\`\`\`

## Configuration

Update \`packages/config/EnvironmentConfig.ts\` to configure your environments.

## Writing Tests

1. Create page objects in \`packages/pages/\`
2. Write tests in \`packages/tests/\`
3. Use the BasePage class for common operations

## Environment Variables

- \`TEST_ENV\` - Set environment (local, staging, production)
- \`TEST_USERNAME\` - Test username
- \`TEST_PASSWORD\` - Test password

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include meaningful test descriptions
4. Use page object model pattern
`;
  }

  generateGitignore() {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Playwright
test-results/
playwright-report/
playwright/.cache/

# Environment variables
.env
.env.local
.env.staging
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port`;
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new PlaywrightFrameworkCLI();
  cli.run().catch(console.error);
}

module.exports = PlaywrightFrameworkCLI; 