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
  }

  async run() {
    // === AI Test Generation CLI Command ===
    const args = process.argv.slice(2);
    if (args[0] === 'generate-ai-tests') {
      // Parse --url and --type
      let baseUrl = 'https://example.com';
      let testType = 'basic';
      args.forEach((arg, i) => {
        if (arg.startsWith('--url=')) baseUrl = arg.split('=')[1];
        if (arg.startsWith('--type=')) testType = arg.split('=')[1];
      });
      if (!baseUrl) {
        console.error('❌ Please provide a BASE_URL using --url=<BASE_URL>');
        process.exit(1);
      }
      // Map testType to script
      let script;
      if (testType === 'regression') {
        script = 'framework/ai/regression-test-generator.js';
      } else {
        script = 'framework/ai/fixed-generate-tests.js';
      }
      try {
        console.log(`\n🤖 Generating AI-powered Playwright test suite (${testType}) for ${baseUrl}...`);
        execSync(`node ${script} ${baseUrl}`, {
          cwd: process.cwd(),
          stdio: 'inherit',
        });
        console.log('✅ AI-generated tests are available in /sample-tests/');
      } catch (err) {
        console.error('❌ AI test generation failed:', err.message);
      }
      process.exit(0);
    }
    console.log('\n🚀 Playwright Automation Framework Setup CLI\n');
    console.log('This CLI will help you set up a comprehensive Playwright automation framework.\n');

    try {
      await this.getProjectDetails();
      await this.createProjectStructure();
      await this.installDependencies();
      await this.configureEnvironment();
      await this.createSampleTests();
      await this.setupGit();
      await this.displayNextSteps();

      // === AI Test Generation Integration ===
      if (this.config.baseURL) {
        console.log('\n🤖 Generating AI-powered Playwright test scripts for your app...');
        try {
          execSync(`node framework/ai/generate-tests.js ${this.config.baseURL}`, {
            cwd: this.projectName,
            stdio: 'inherit',
          });
          console.log('✅ AI-generated tests are available in /sample-tests/');
        } catch (err) {
          console.error('❌ AI test generation failed:', err.message);
        }
      }
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async getProjectDetails() {
    console.log('📋 Project Configuration\n');
    
    this.projectName = await this.question('Enter project name (default: playwright-automation): ') || 'playwright-automation';
    this.config.baseURL = await this.question('Enter your application base URL (default: https://example.com): ') || 'https://example.com';
    this.config.apiURL = await this.question('Enter your API base URL (default: https://api.example.com): ') || 'https://api.example.com';
    
    const environments = await this.question('Enter environments to configure (comma-separated, default: local,staging,production): ') || 'local,staging,production';
    this.config.environments = environments.split(',').map(env => env.trim());
    
    console.log('\n✅ Project details captured!\n');
  }

  async createProjectStructure() {
    console.log('📁 Creating project structure...\n');
    
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
      'playwright-report'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(this.projectName, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      }
    });

    console.log('\n✅ Project structure created!\n');
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...\n');
    
    const packageJson = {
      name: this.projectName,
      version: "2.0.0",
      description: "Comprehensive Playwright automation framework",
      main: "index.js",
      scripts: {
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
        "test:chrome": "playwright test --config=framework.config.ts --project=chromium",
        "test:firefox": "playwright test --config=framework.config.ts --project=firefox",
        "test:safari": "playwright test --config=framework.config.ts --project=webkit",
        "test:mobile": "playwright test --config=framework.config.ts --project=mobile-chrome",
        "test:staging": "TEST_ENV=staging playwright test --config=framework.config.ts",
        "test:production": "TEST_ENV=production playwright test --config=framework.config.ts",
        "test:local": "TEST_ENV=local playwright test --config=framework.config.ts",
        "report": "playwright show-report",
        "install-browsers": "playwright install",
        "codegen": "playwright codegen",
        "trace": "playwright show-trace",
        "packages:setup": "node -e \"console.log('Packages setup completed. Update framework.config.ts with your application URLs.')\"",
        "packages:docs": "echo 'Packages documentation available at packages/README.md'"
      },
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

    fs.writeFileSync(
      path.join(this.projectName, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    console.log('✅ package.json created');

    // Create tsconfig.json
    const tsconfig = {
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

    fs.writeFileSync(
      path.join(this.projectName, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    console.log('✅ tsconfig.json created');

    // Install dependencies
    console.log('\n📥 Installing npm dependencies...');
    try {
      execSync('npm install', { cwd: this.projectName, stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.log('⚠️  Failed to install dependencies automatically. Please run "npm install" manually.');
    }

    // Install Playwright browsers
    console.log('\n🌐 Installing Playwright browsers...');
    try {
      execSync('npx playwright install', { cwd: this.projectName, stdio: 'inherit' });
      console.log('✅ Playwright browsers installed');
    } catch (error) {
      console.log('⚠️  Failed to install browsers automatically. Please run "npx playwright install" manually.');
    }

    console.log('\n✅ Dependencies setup completed!\n');
  }

  async configureEnvironment() {
    console.log('⚙️  Configuring environment settings...\n');
    
    // Create EnvironmentConfig.ts
    const envConfigContent = this.generateEnvironmentConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'framework/config/EnvironmentConfig.ts'),
      envConfigContent
    );
    console.log('✅ EnvironmentConfig.ts created');

    // Create framework.config.ts
    const frameworkConfigContent = this.generateFrameworkConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'framework.config.ts'),
      frameworkConfigContent
    );
    console.log('✅ framework.config.ts created');

    // Create playwright.config.ts
    const playwrightConfigContent = this.generatePlaywrightConfig();
    fs.writeFileSync(
      path.join(this.projectName, 'playwright.config.ts'),
      playwrightConfigContent
    );
    console.log('✅ playwright.config.ts created');

    console.log('\n✅ Environment configuration completed!\n');
  }

  async createSampleTests() {
    console.log('🧪 Creating example tests and page objects based on your URL...\n');
    
    // Create BasePage.ts
    const basePageContent = `import { Page, Locator, expect } from '@playwright/test';

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

    fs.writeFileSync(
      path.join(this.projectName, 'framework/core/BasePage.ts'),
      basePageContent
    );
    console.log('✅ BasePage.ts created');

    // Create TestBase.ts
    const testBaseContent = `import { test as base } from '@playwright/test';
import { BasePage } from './BasePage';

export const test = base.extend<{ basePage: BasePage }>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

export { expect } from '@playwright/test';`;

    fs.writeFileSync(
      path.join(this.projectName, 'framework/core/TestBase.ts'),
      testBaseContent
    );
    console.log('✅ TestBase.ts created');

    // Create page objects
    await this.createPageObjects();
    // Create dynamic data file
    await this.createDynamicDataFile();
    // Remove fixtures and setup folders
    await this.removeFixturesAndSetupFolders();
    
    // Create dynamic example tests based on the provided URL
    const exampleTestContent = `import { test, expect } from '../core/TestBase';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { AwardsPage } from '../pages/AwardsPage';
import { AcademyPage } from '../pages/AcademyPage';
import { MarketplacePage } from '../pages/MarketplacePage';

test.describe('Example Tests for ${this.config.baseURL}', () => {
  let homePage: HomePage;
  let authPage: AuthPage;
  let awardsPage: AwardsPage;
  let academyPage: AcademyPage;
  let marketplacePage: MarketplacePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    awardsPage = new AwardsPage(page);
    academyPage = new AcademyPage(page);
    marketplacePage = new MarketplacePage(page);
  });

  test('should load homepage successfully', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Verify page title
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('Page title:', title);
    
    // Take screenshot
    await basePage.takeScreenshot('homepage-loaded');
  });

  test('should verify page structure', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Verify basic page structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for common elements
    const html = page.locator('html');
    const head = page.locator('head');
    await expect(html).toBeVisible();
    await expect(head).toBeVisible();
    
    console.log('Page URL:', page.url());
  });

  test('should test page navigation', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Test page refresh
    await page.reload();
    await basePage.waitForPageLoad();
    
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Test browser back/forward
    await page.goto('https://example.com');
    await page.goBack();
    const currentUrl = page.url();
    expect(currentUrl).toContain(new URL('${this.config.baseURL}').hostname);
  });

  test('should verify responsive design', async ({ page, basePage }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    const desktopTitle = await page.title();
    expect(desktopTitle).toBeTruthy();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await basePage.waitForPageLoad();
    
    const mobileTitle = await page.title();
    expect(mobileTitle).toBeTruthy();
    
    await basePage.takeScreenshot('mobile-view');
  });

  test('should test page interactions', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test mouse interactions
    await page.mouse.move(100, 100);
    
    // Test page scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    await basePage.takeScreenshot('interactions-completed');
  });

  test('should verify page performance', async ({ page, basePage }) => {
    const startTime = Date.now();
    
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    const loadTime = Date.now() - startTime;
    console.log('Page load time:', loadTime + 'ms');
    
    // Verify page loads within reasonable time
    expect(loadTime).toBeLessThan(30000); // 30 seconds
    
    // Test screenshot capture
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toBeDefined();
    expect(screenshot.length).toBeGreaterThan(0);
  });

  test('should test form elements if present', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Look for common form elements
    const forms = page.locator('form');
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="search"]');
    const buttons = page.locator('button, input[type="submit"]');
    
    const formCount = await forms.count();
    const inputCount = await inputs.count();
    const buttonCount = await buttons.count();
    
    console.log('Forms found:', formCount);
    console.log('Input fields found:', inputCount);
    console.log('Buttons found:', buttonCount);
    
    // Test form interactions if forms exist
    if (formCount > 0) {
      const firstForm = forms.first();
      await expect(firstForm).toBeVisible();
      
      if (inputCount > 0) {
        const firstInput = inputs.first();
        await firstInput.focus();
        await expect(firstInput).toBeFocused();
      }
    }
  });

  test('should test navigation links if present', async ({ page, basePage }) => {
    await basePage.navigateTo('${this.config.baseURL}');
    await basePage.waitForPageLoad();
    
    // Look for navigation links
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    console.log('Links found:', linkCount);
    
    if (linkCount > 0) {
      // Test first few links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('#')) {
          try {
            await link.hover();
            await page.waitForTimeout(500);
          } catch (error) {
            console.log('Skipping link hover test for:', href);
          }
        }
      }
    }
    
    await basePage.takeScreenshot('navigation-tested');
  });
});`;

    fs.writeFileSync(
      path.join(this.projectName, 'packages/tests/example-test.spec.ts'),
      exampleTestContent
    );
    console.log('✅ example-test.spec.ts created');



    // Create README.md
    const readmeContent = `# Playwright Automation Framework

A comprehensive Playwright automation framework with TypeScript support, configured for ${this.config.baseURL}.

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
- \`npm run test:example\` - Run example tests for ${this.config.baseURL}
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
├── test-results/        # Test execution results
└── playwright-report/   # HTML test reports
\`\`\`

## Example Tests

The framework includes comprehensive example tests for ${this.config.baseURL}:

- **Homepage Loading** - Tests page load and title verification
- **Page Structure** - Verifies HTML structure and common elements
- **Navigation** - Tests page refresh and browser navigation
- **Responsive Design** - Tests desktop and mobile viewports
- **Page Interactions** - Tests keyboard, mouse, and scroll interactions
- **Performance** - Measures page load time and screenshot capture
- **Form Elements** - Tests form interactions if present
- **Navigation Links** - Tests link hover and interaction

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

    fs.writeFileSync(
      path.join(this.projectName, 'README.md'),
      readmeContent
    );
    console.log('✅ README.md created');

    console.log('\n✅ Example tests and framework files created!\n');
  }

  async setupGit() {
    console.log('📝 Setting up Git repository...\n');
    
    const gitignoreContent = `# Dependencies
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

    fs.writeFileSync(
      path.join(this.projectName, '.gitignore'),
      gitignoreContent
    );
    console.log('✅ .gitignore created');

    try {
      execSync('git init', { cwd: this.projectName, stdio: 'inherit' });
      console.log('✅ Git repository initialized');
    } catch (error) {
      console.log('⚠️  Failed to initialize Git repository. Please run "git init" manually.');
    }

    console.log('\n✅ Git setup completed!\n');
  }

  async displayNextSteps() {
    console.log('🎉 Framework setup completed successfully!\n');
    console.log('📋 Next Steps:\n');
    console.log(`1. Navigate to your project: cd ${this.projectName}`);
    console.log('2. Update framework/config/EnvironmentConfig.ts with your application URLs');
    console.log('4. Create your first page object in framework/pages/');
    console.log('5. Write your first test in tests/');
    console.log('6. Run tests: npm test');
    console.log('\n📚 Documentation:');
    console.log('- Framework README: README.md');
    console.log('- Playwright docs: https://playwright.dev/');
    console.log('\n🚀 Happy testing!\n');
  }

  question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  generateEnvironmentConfig() {
    const envConfigs = {};
    
    this.config.environments.forEach(env => {
      envConfigs[env] = {
        baseURL: env === 'local' ? 'http://localhost:3000' : this.config.baseURL,
        apiURL: env === 'local' ? 'http://localhost:3001' : this.config.apiURL,
        username: `process.env.${env.toUpperCase()}_USERNAME || '${env}user'`,
        password: `process.env.${env.toUpperCase()}_PASSWORD || '${env}pass'`,
        timeout: env === 'production' ? 45000 : 30000,
        retries: env === 'production' ? 1 : env === 'staging' ? 2 : 3,
        headless: env === 'local' ? false : true,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: env === 'local',
        traceRecording: env === 'local'
      };
    });

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
    
    const baseConfigs: Record<string, EnvironmentConfig> = ${JSON.stringify(envConfigs, null, 4)};

    return baseConfigs[environment] || baseConfigs.staging;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getBaseURL(): string {
    return this.config.baseURL;
  }

  public getApiURL(): string {
    return this.config.apiURL;
  }



  public getCredentials(): { username: string; password: string } {
    return {
      username: this.config.username,
      password: this.config.password
    };
  }

  public getTimeout(): number {
    return this.config.timeout;
  }

  public getRetries(): number {
    return this.config.retries;
  }

  public isHeadless(): boolean {
    return this.config.headless;
  }

  public getViewport(): { width: number; height: number } {
    return this.config.viewport;
  }

  public getUserAgent(): string {
    return this.config.userAgent;
  }

  public shouldTakeScreenshots(): boolean {
    return this.config.screenshotOnFailure;
  }

  public shouldRecordVideo(): boolean {
    return this.config.videoRecording;
  }

  public shouldRecordTrace(): boolean {
    return this.config.traceRecording;
  }

  public updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();`;
  }

  generateFrameworkConfig() {
    return `import { defineConfig, devices } from '@playwright/test';
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

  async createPageObjects() {
    const pagesDir = path.join(this.projectName, 'packages/pages');
    const pageObjects = [
      {
        name: 'HomePage.ts',
        content: `import { Page, Locator } from '@playwright/test';\nexport class HomePage {\n  constructor(private page: Page) {}\n  async goto() { await this.page.goto('/'); }\n  // Add more methods as needed\n}`
      },
      {
        name: 'AuthPage.ts',
        content: `import { Page, Locator } from '@playwright/test';\nexport class AuthPage {\n  constructor(private page: Page) {}\n  async login(email: string, password: string) {\n    await this.page.fill('input[type=email]', email);\n    await this.page.fill('input[type=password]', password);\n    await this.page.click('button[type=submit]');\n  }\n  // Add more methods as needed\n}`
      },
      {
        name: 'AwardsPage.ts',
        content: `import { Page, Locator } from '@playwright/test';\nexport class AwardsPage {\n  constructor(private page: Page) {}\n  async goto() { await this.page.goto('/awards/'); }\n  // Add more methods as needed\n}`
      },
      {
        name: 'AcademyPage.ts',
        content: `import { Page, Locator } from '@playwright/test';\nexport class AcademyPage {\n  constructor(private page: Page) {}\n  async goto() { await this.page.goto('/academy/'); }\n  // Add more methods as needed\n}`
      },
      {
        name: 'MarketplacePage.ts',
        content: `import { Page, Locator } from '@playwright/test';\nexport class MarketplacePage {\n  constructor(private page: Page) {}\n  async goto() { await this.page.goto('/marketplace/'); }\n  // Add more methods as needed\n}`
      }
    ];
    for (const obj of pageObjects) {
      fs.writeFileSync(path.join(pagesDir, obj.name), obj.content);
      console.log(`✅ Created: packages/pages/${obj.name}`);
    }
  }

  async createDynamicDataFile() {
    const dataDir = path.join(this.projectName, 'data');
    const dynamicDataContent = `// Dynamic test data utilities\nmodule.exports = {\n  getRandomUser: () => ({\n    username: 'user_' + Math.random().toString(36).substring(2, 8),\n    email: 'user_' + Math.random().toString(36).substring(2, 8) + '@example.com',\n    password: 'Pass' + Math.floor(Math.random() * 10000)\n  }),\n  getRandomProduct: () => ({\n    name: 'Product_' + Math.random().toString(36).substring(2, 8),\n    price: Math.floor(Math.random() * 1000) + 10,\n    sku: 'SKU_' + Math.random().toString(36).substring(2, 8)\n  })\n};\n`;
    fs.writeFileSync(path.join(dataDir, 'dynamic-data.js'), dynamicDataContent);
    console.log('✅ Created: data/dynamic-data.js');
  }

  async removeFixturesAndSetupFolders() {
    const fixturesPath = path.join(this.projectName, 'fixtures');
    const setupPath = path.join(this.projectName, 'packages/setup');
    if (fs.existsSync(fixturesPath)) {
      fs.rmSync(fixturesPath, { recursive: true, force: true });
      console.log('✅ Removed: fixtures/');
    }
    if (fs.existsSync(setupPath)) {
      fs.rmSync(setupPath, { recursive: true, force: true });
      console.log('✅ Removed: packages/setup/');
    }
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new PlaywrightFrameworkCLI();
  cli.run().catch(console.error);
}

module.exports = PlaywrightFrameworkCLI; 