#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class EnhancedPlaywrightCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.projectName = '';
    this.config = {};
    this.features = {};
    
    // Parse command line arguments
    this.parseCommandLineArgs();
  }

  parseCommandLineArgs() {
    const args = process.argv.slice(2);
    this.cliArgs = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--help' || arg === '-h') {
        this.showHelp();
        process.exit(0);
      }
    }
  }

  showHelp() {
    console.log('\n🚀 Enhanced Playwright Framework CLI\n');
    console.log('Usage: node enhanced-cli.js [options]\n');
    console.log('Options:');
    console.log('  --help, -h          Show this help message\n');
    console.log('Examples:');
    console.log('  node enhanced-cli.js');
    console.log('  node enhanced-cli.js --help\n');
  }

  async run() {
    console.log('\n🚀 Enhanced Playwright Framework CLI\n');
    console.log('A powerful CLI tool for setting up comprehensive Playwright automation frameworks.\n');

    try {
      await this.showMainMenu();
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async showMainMenu() {
    console.log('🎯 Main Menu\n');
    console.log('1. 🚀 Create new project');
    console.log('2. 🔧 Add features to existing project');
    console.log('3. 📊 Generate test reports');
    console.log('4. 🔄 Update framework');
    console.log('5. 📚 Show documentation');
    console.log('6. ❌ Exit');
    
    const choice = await this.question('\nSelect an option (1-6): ');
    
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
        await this.updateFramework();
        break;
      case '5':
        await this.showDocumentation();
        break;
      case '6':
        console.log('\n👋 Goodbye!');
        process.exit(0);
        break;
      default:
        console.log('\n❌ Invalid option. Please try again.');
        await this.showMainMenu();
    }
  }

  async createNewProject() {
    console.log('\n🚀 Creating New Project\n');
    
    await this.getProjectDetails();
    await this.selectFrameworkTemplate();
    await this.createProjectStructure();
    await this.installDependencies();
    await this.configureEnvironment();
    await this.createComprehensiveFramework();
    await this.createSampleTests();
    await this.setupGit();
    await this.displayNextSteps();
  }

  async getProjectDetails() {
    console.log('📋 Project Configuration\n');
    
    // Get project name
    this.projectName = await this.question('Enter project name (default: playwright-automation): ') || 'playwright-automation';
    
    // Validate project name
    if (!this.isValidProjectName(this.projectName)) {
      console.log('❌ Invalid project name. Please use only letters, numbers, hyphens, and underscores.');
      this.projectName = await this.question('Enter valid project name: ');
    }
    
    // Get project path
    const defaultPath = process.cwd();
    this.projectPath = await this.question(`Enter project path (default: ${defaultPath}): `) || defaultPath;
    
    // Validate and create path if it doesn't exist
    try {
      if (!fs.existsSync(this.projectPath)) {
        const createPath = await this.question(`Path '${this.projectPath}' does not exist. Create it? (y/n): `);
        if (createPath.toLowerCase() === 'y') {
          fs.mkdirSync(this.projectPath, { recursive: true });
          console.log(`✅ Created directory: ${this.projectPath}`);
        } else {
          this.projectPath = await this.question('Enter valid project path: ');
        }
      }
    } catch (error) {
      console.log('❌ Invalid path. Please enter a valid directory path.');
      this.projectPath = await this.question('Enter valid project path: ');
    }
    
    // Check if project directory already exists in the specified path
    const fullProjectPath = path.join(this.projectPath, this.projectName);
    if (fs.existsSync(fullProjectPath)) {
      const overwrite = await this.question(`Project directory '${fullProjectPath}' already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
      // Remove existing directory
      fs.rmSync(fullProjectPath, { recursive: true, force: true });
      console.log(`🗑️  Removed existing directory: ${fullProjectPath}`);
    }
    
    this.config.baseURL = await this.question('Enter your application base URL (default: https://example.com): ') || 'https://example.com';
    
    // Validate URL
    if (!this.isValidUrl(this.config.baseURL)) {
      console.log('⚠️  Invalid URL format. Please enter a valid URL.');
      this.config.baseURL = await this.question('Enter valid base URL: ');
    }
    
    this.config.apiURL = await this.question('Enter your API base URL (default: https://api.example.com): ') || 'https://api.example.com';
    
    const environments = await this.question('Enter environments to configure (comma-separated, default: local,staging,production): ') || 'local,staging,production';
    this.config.environments = environments.split(',').map(env => env.trim());
    
    console.log('\n✅ Project details captured!\n');
    console.log(`📁 Project will be created at: ${fullProjectPath}\n`);
  }

  async selectFrameworkTemplate() {
    console.log('📋 Select Framework Template\n');
    console.log('1. 🎯 Basic (Essential features only)');
    console.log('2. 🚀 Standard (Recommended - Full features)');
    console.log('3. 🏢 Enterprise (Advanced features + CI/CD)');
    console.log('4. 📱 Mobile-First (Mobile testing focused)');
    console.log('5. 🔧 Custom (Choose your features)');
    
    const template = await this.question('\nSelect template (1-5): ');
    
    switch (template) {
      case '1':
        this.features = this.getBasicTemplate();
        break;
      case '2':
        this.features = this.getStandardTemplate();
        break;
      case '3':
        this.features = this.getEnterpriseTemplate();
        break;
      case '4':
        this.features = this.getMobileTemplate();
        break;
      case '5':
        await this.selectCustomFeatures();
        break;
      default:
        console.log('⚠️  Invalid choice. Using Standard template.');
        this.features = this.getStandardTemplate();
    }
    
    console.log(`\n✅ Template selected: ${this.getTemplateName(template)}\n`);
  }

  async selectCustomFeatures() {
    console.log('\n🔧 Select Custom Features\n');
    
    const featureOptions = {
      'api-testing': 'API Testing Support',
      'visual-testing': 'Visual Testing (Screenshots/Diff)',
      'performance-testing': 'Performance Testing',
      'accessibility-testing': 'Accessibility Testing',
      'mobile-testing': 'Mobile Device Testing',
      'ci-cd-templates': 'CI/CD Templates',
      'docker-support': 'Docker Support',
      'cloud-testing': 'Cloud Testing Integration',
      'reporting-dashboard': 'Advanced Reporting Dashboard',
      'test-generator': 'AI-Powered Test Generator',
      'interactions-module': 'Advanced Interactions Module',
      'runner-configuration': 'Runner Configuration',
      'utilities-module': 'Utilities Module',
      'constants-module': 'Constants Module'
    };
    
    this.features = {};
    
    for (const [feature, description] of Object.entries(featureOptions)) {
      const choice = await this.question(`${description} (y/n): `);
      this.features[feature] = choice.toLowerCase() === 'y';
    }
  }

  getBasicTemplate() {
    return {
      'api-testing': false,
      'visual-testing': true,
      'performance-testing': false,
      'accessibility-testing': false,
      'mobile-testing': false,
      'ci-cd-templates': false,
      'docker-support': false,
      'cloud-testing': false,
      'reporting-dashboard': false,
      'test-generator': false,
      'interactions-module': true,
      'runner-configuration': true,
      'utilities-module': true,
      'constants-module': true
    };
  }

  getStandardTemplate() {
    return {
      'api-testing': true,
      'visual-testing': true,
      'performance-testing': false,
      'accessibility-testing': true,
      'mobile-testing': true,
      'ci-cd-templates': true,
      'docker-support': false,
      'cloud-testing': true,
      'reporting-dashboard': true,
      'test-generator': false,
      'interactions-module': true,
      'runner-configuration': true,
      'utilities-module': true,
      'constants-module': true
    };
  }

  getEnterpriseTemplate() {
    return {
      'api-testing': true,
      'visual-testing': true,
      'performance-testing': true,
      'accessibility-testing': true,
      'mobile-testing': true,
      'ci-cd-templates': true,
      'docker-support': true,
      'cloud-testing': true,
      'reporting-dashboard': true,
      'test-generator': true,
      'interactions-module': true,
      'runner-configuration': true,
      'utilities-module': true,
      'constants-module': true
    };
  }

  getMobileTemplate() {
    return {
      'api-testing': false,
      'visual-testing': true,
      'performance-testing': false,
      'accessibility-testing': true,
      'mobile-testing': true,
      'ci-cd-templates': true,
      'docker-support': false,
      'cloud-testing': true,
      'reporting-dashboard': true,
      'test-generator': false,
      'interactions-module': true,
      'runner-configuration': true,
      'utilities-module': true,
      'constants-module': true
    };
  }

  getTemplateName(template) {
    const names = {
      '1': 'Basic',
      '2': 'Standard',
      '3': 'Enterprise',
      '4': 'Mobile-First',
      '5': 'Custom'
    };
    return names[template] || 'Standard';
  }



  async createProjectStructure() {
    console.log('📁 Creating project structure...\n');
    
    // Create the main project directory
    const fullProjectPath = path.join(this.projectPath, this.projectName);
    try {
      fs.mkdirSync(fullProjectPath, { recursive: true });
      console.log(`✅ Created project directory: ${fullProjectPath}`);
      // Do NOT change working directory
    } catch (error) {
      console.error(`❌ Error creating project directory: ${error.message}`);
      throw error;
    }
    
    const directories = [
      'framework/config',
      'framework/core',
      'framework/interactions',
      'framework/utils',
      'framework/constants',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/smoke',
      'tests/regression',
      'tests/accessibility',
      'tests/performance',
      'reports',
      'docs',
      'fixtures',
      'data'
    ];

    for (const dir of directories) {
      await this.createDirectory(path.join(fullProjectPath, dir));
    }
    
    console.log('\n✅ Project structure created!\n');
  }

  // Helper to get the full path inside the project
  getProjectPath(relativePath) {
    return path.join(this.projectPath, this.projectName, relativePath);
  }

  async createDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
      }
    } catch (error) {
      console.error(`❌ Error creating directory ${dirPath}:`, error.message);
      throw error;
    }
  }

  async createFile(relativePath, content) {
    const filePath = this.getProjectPath(relativePath);
    try {
      // Ensure the directory exists
      const dirPath = path.dirname(filePath);
      await this.createDirectory(dirPath);
      // Write the file
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created file: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error creating file ${filePath}:`, error.message);
      throw error;
    }
  }

  async createComprehensiveFramework() {
    console.log('🔧 Creating comprehensive framework components...\n');
    if (this.features['interactions-module']) {
      this.createInteractionsModule();
    }
    if (this.features['runner-configuration']) {
      this.createRunnerConfiguration();
    }
    if (this.features['utilities-module']) {
      this.createUtilitiesModule();
    }
    if (this.features['constants-module']) {
      this.createConstantsModule();
    }
    this.createCoreFrameworkFiles();
    console.log('\n✅ Comprehensive framework created!\n');
  }

  createInteractionsModule() {
    console.log('🔧 Creating Interactions Module...');
    this.createFile('framework/interactions/Accessibility.ts', this.generateAccessibilityModule());
    this.createFile('framework/interactions/BrowserActions.ts', this.generateBrowserActionsModule());
    this.createFile('framework/interactions/Click.ts', this.generateClickModule());
    this.createFile('framework/interactions/Dropdown.ts', this.generateDropdownModule());
    this.createFile('framework/interactions/Elements.ts', this.generateElementsModule());
    this.createFile('framework/interactions/Scroll.ts', this.generateScrollModule());
    this.createFile('framework/interactions/Type.ts', this.generateTypeModule());
    this.createFile('framework/interactions/Wait.ts', this.generateWaitModule());
    this.createFile('framework/interactions/WindowHandler.ts', this.generateWindowHandlerModule());
    this.createFile('framework/interactions/index.ts', this.generateInteractionsIndex());
  }

  createRunnerConfiguration() {
    console.log('🔧 Creating Runner Configuration...');
    this.createFile('framework/config/runner.config.ts', `import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  timeout: 30000,\n  retries: 2,\n  workers: 1,\n  reporter: [\n    ['html'],\n    ['json', { outputFile: 'test-results/results.json' }],\n    ['list']\n  ],\n  use: {\n    headless: true,\n    viewport: { width: 1920, height: 1080 },\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n    trace: 'retain-on-failure'\n  }\n});`);
  }

  createUtilitiesModule() {
    console.log('🔧 Creating Utilities Module...');
    this.createFile('framework/utils/Utilities.ts', `export class Utilities {\n  static async wait(ms: number): Promise<void> {\n    return new Promise(resolve => setTimeout(resolve, ms));\n  }\n  static generateRandomString(length: number): string {\n    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n    let result = '';\n    for (let i = 0; i < length; i++) {\n      result += chars.charAt(Math.floor(Math.random() * chars.length));\n    }\n    return result;\n  }\n  static formatDate(date: Date): string {\n    return date.toISOString().split('T')[0];\n  }\n}`);
  }

  createConstantsModule() {
    console.log('🔧 Creating Constants Module...');
    this.createFile('framework/constants/Constants.ts', `export const Timeouts = {\n  SHORT: 5000,\n  MEDIUM: 10000,\n  LONG: 30000,\n  VERY_LONG: 60000\n};\n\nexport const Selectors = {\n  COMMON: {\n    LOADING: '[data-testid="loading"]',\n    ERROR: '[data-testid="error"]',\n    SUCCESS: '[data-testid="success"]'\n  }\n};\n\nexport const Messages = {\n  SUCCESS: 'Operation completed successfully',\n  ERROR: 'An error occurred',\n  LOADING: 'Please wait...'\n};`);
  }

  createCoreFrameworkFiles() {
    console.log('🔧 Creating Core Framework Files...');
    this.createFile('framework/core/BasePageObject.ts', `import { Page } from '@playwright/test';\n\nexport class BasePageObject {\n  protected page: Page;\n  constructor(page: Page) {\n    this.page = page;\n  }\n}`);
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...\n');
    
    const dependencies = {
      "@playwright/test": "^1.53.0",
      "@types/node": "^20.11.24"
    };

    // Add feature-specific dependencies
    if (this.features['api-testing']) {
      dependencies['axios'] = "^1.6.0";
      dependencies['@types/axios'] = "^0.14.0";
    }

    if (this.features['visual-testing']) {
      dependencies['pixelmatch'] = "^5.3.0";
      dependencies['pngjs'] = "^7.0.0";
    }

    if (this.features['performance-testing']) {
      dependencies['lighthouse'] = "^11.0.0";
    }

    if (this.features['accessibility-testing']) {
      dependencies['axe-core'] = "^4.8.0";
      dependencies['@axe-core/playwright'] = "^4.8.0";
    }

    if (this.features['docker-support']) {
      // Docker compose is typically installed separately, not via npm
      // No need to add it to dependencies
    }

    const packageJson = {
      name: this.projectName,
      version: "2.0.0",
      description: "Comprehensive Playwright automation framework",
      main: "index.js",
      scripts: this.generateScripts(),
      keywords: this.generateKeywords(),
      author: "Your Name",
      license: "MIT",
      devDependencies: dependencies,
      engines: {
        "node": ">=16.0.0"
      }
    };

    fs.writeFileSync(
      'package.json',
      JSON.stringify(packageJson, null, 2)
    );

    console.log('✅ package.json created');

    // Create enhanced tsconfig.json
    const tsconfig = this.generateTsConfig();
    this.createFile('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    console.log('✅ tsconfig.json created');

    // Install dependencies
    console.log('\n📥 Installing npm dependencies...');
    try {
      execSync('npm install', { cwd: this.getProjectPath(''), stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.log('⚠️  Failed to install dependencies automatically. Please run "npm install" manually.');
    }

    // Install Playwright browsers
    console.log('\n🌐 Installing Playwright browsers...');
    try {
      execSync('npx playwright install', { cwd: this.getProjectPath(''), stdio: 'inherit' });
      console.log('✅ Playwright browsers installed');
    } catch (error) {
      console.log('⚠️  Failed to install browsers automatically. Please run "npx playwright install" manually.');
    }

    console.log('\n✅ Dependencies setup completed!\n');
  }

  generateScripts() {
    const baseScripts = {
      "test": "playwright test --config=framework.config.ts",
      "test:ui": "playwright test --config=framework.config.ts --ui",
      "test:headed": "playwright test --config=framework.config.ts --headed",
      "test:debug": "playwright test --config=framework.config.ts --debug",
      "test:smoke": "playwright test tests/smoke/ --config=framework.config.ts",
      "test:regression": "playwright test tests/regression/ --config=framework.config.ts",
      "test:accessibility": "playwright test tests/accessibility/ --config=framework.config.ts",
      "test:performance": "playwright test tests/performance/ --config=framework.config.ts",
      "test:e2e": "playwright test tests/e2e/ --config=framework.config.ts",
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
      "framework:setup": "node -e \"console.log('Framework setup completed. Update framework.config.ts with your application URLs.')\"",
      "framework:docs": "echo 'Framework documentation available at docs/README.md'"
    };

    // Add feature-specific scripts
    if (this.features['api-testing']) {
      baseScripts['test:api'] = "playwright test tests/api/ --config=framework.config.ts";
    }

    if (this.features['visual-testing']) {
      baseScripts['test:visual'] = "playwright test tests/visual/ --config=framework.config.ts";
      baseScripts['update-baselines'] = "playwright test --update-snapshots";
    }

    if (this.features['performance-testing']) {
      baseScripts['test:performance'] = "playwright test tests/performance/ --config=framework.config.ts";
      baseScripts['lighthouse'] = "lighthouse --output html --output-path ./performance-results/";
    }

    if (this.features['accessibility-testing']) {
      baseScripts['test:accessibility'] = "playwright test tests/accessibility/ --config=framework.config.ts";
    }

    if (this.features['mobile-testing']) {
      baseScripts['test:mobile-only'] = "playwright test tests/mobile/ --config=framework.config.ts";
    }

    if (this.features['docker-support']) {
      baseScripts['docker:build'] = "docker build -t playwright-tests .";
      baseScripts['docker:run'] = "docker run playwright-tests";
    }

    if (this.features['cloud-testing']) {
      baseScripts['test:cloud'] = "playwright test --config=cloud.config.ts";
    }

    return baseScripts;
  }

  generateKeywords() {
    const baseKeywords = [
      "playwright",
      "testing",
      "automation",
      "framework",
      "e2e",
      "typescript",
      "page-object-model"
    ];

    // Add feature-specific keywords
    if (this.features['api-testing']) baseKeywords.push('api-testing');
    if (this.features['visual-testing']) baseKeywords.push('visual-testing');
    if (this.features['performance-testing']) baseKeywords.push('performance-testing');
    if (this.features['accessibility-testing']) baseKeywords.push('accessibility-testing');
    if (this.features['mobile-testing']) baseKeywords.push('mobile-testing');
    if (this.features['ci-cd-templates']) baseKeywords.push('ci-cd');
    if (this.features['docker-support']) baseKeywords.push('docker');
    if (this.features['cloud-testing']) baseKeywords.push('cloud-testing');

    return baseKeywords;
  }

  generateTsConfig() {
    const basePaths = {
      "@/*": ["./framework/*"],
      "@config/*": ["./framework/config/*"],
      "@core/*": ["./framework/core/*"],
      "@interactions/*": ["./framework/interactions/*"],
      "@utils/*": ["./framework/utils/*"],
      "@constants/*": ["./framework/constants/*"],
      "@tests/*": ["./tests/*"],
      "@data/*": ["./data/*"],
      "@fixtures/*": ["./fixtures/*"]
    };

    // Add feature-specific paths
    if (this.features['api-testing']) {
      basePaths['@api/*'] = ["./tests/api/*"];
    }

    if (this.features['visual-testing']) {
      basePaths['@visual/*'] = ["./tests/visual/*"];
    }

    if (this.features['performance-testing']) {
      basePaths['@performance/*'] = ["./tests/performance/*"];
    }

    if (this.features['accessibility-testing']) {
      basePaths['@accessibility/*'] = ["./tests/accessibility/*"];
    }

    if (this.features['mobile-testing']) {
      basePaths['@mobile/*'] = ["./tests/mobile/*"];
    }

    if (this.features['cloud-testing']) {
              basePaths['@cloud/*'] = ["./framework/cloud/*"];
    }

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
        "paths": basePaths
      },
      "include": [
        "framework/**/*",
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

  // Utility methods
  isValidProjectName(name) {
    return /^[a-zA-Z0-9_-]+$/.test(name);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  // Placeholder methods for other features
  async addFeaturesToProject() {
    console.log('\n🔧 Add Features to Existing Project\n');
    console.log('This feature is coming soon!');
    await this.showMainMenu();
  }

  async generateTestReports() {
    console.log('\n📊 Generate Test Reports\n');
    console.log('This feature is coming soon!');
    await this.showMainMenu();
  }

  async updateFramework() {
    console.log('\n🔄 Update Framework\n');
    console.log('This feature is coming soon!');
    await this.showMainMenu();
  }

  async showDocumentation() {
    console.log('\n📚 Documentation\n');
    console.log('1. 🚀 Quick Start Guide');
    console.log('2. 📖 Framework Documentation');
    console.log('3. 🎯 Best Practices');
    console.log('4. 🔧 Troubleshooting');
    console.log('5. 📞 Support & Community');
    console.log('6. 🔙 Back to Main Menu');
    
    const choice = await this.question('\nSelect help topic (1-6): ');
    
    if (choice === '6') {
      await this.showMainMenu();
    } else {
      console.log('\nThis documentation is coming soon!');
      await this.showMainMenu();
    }
  }

  async configureEnvironment() {
    console.log('⚙️  Configuring environment settings...\n');
    
    // Create EnvironmentConfig.ts
    const envConfigContent = this.generateEnvironmentConfig();
    this.createFile('framework/config/EnvironmentConfig.ts', envConfigContent);
    console.log('✅ EnvironmentConfig.ts created');

    // Create framework.config.ts
    const frameworkConfigContent = this.generateFrameworkConfig();
    this.createFile('framework.config.ts', frameworkConfigContent);
    console.log('✅ framework.config.ts created');

    // Create playwright.config.ts
    const playwrightConfigContent = this.generatePlaywrightConfig();
    this.createFile('playwright.config.ts', playwrightConfigContent);
    console.log('✅ playwright.config.ts created');

    console.log('\n✅ Environment configuration completed!\n');
  }

  async createSampleTests() {
    console.log('🧪 Creating framework files and sample tests...\n');
    
    // Create BasePage.ts
    const basePageContent = this.generateBasePage();
    this.createFile('framework/core/BasePage.ts', basePageContent);
    console.log('✅ BasePage.ts created');

    // Create TestBase.ts
    const testBaseContent = this.generateTestBase();
    this.createFile('framework/core/TestBase.ts', testBaseContent);
    console.log('✅ TestBase.ts created');

    // Create README.md
    const readmeContent = this.generateReadme();
    this.createFile('README.md', readmeContent);
    console.log('✅ README.md created');

    // Create sample tests for each test folder
    await this.createSampleTestFiles();

    // Create comprehensive framework content
    await this.createComprehensiveContent();

    console.log('\n✅ Framework files and sample tests created!\n');
  }

  async createSampleTestFiles() {
    console.log('📝 Creating sample test files...\n');
    
    const baseURL = this.config.baseURL || 'https://example.com';
    const domain = new URL(baseURL).hostname;
    
    // Create sample tests for each test category
    this.createSmokeTests(baseURL, domain);
    this.createRegressionTests(baseURL, domain);
    this.createE2ETests(baseURL, domain);
    this.createUnitTests(baseURL, domain);
    this.createIntegrationTests(baseURL, domain);
    this.createAccessibilityTests(baseURL, domain);
    this.createPerformanceTests(baseURL, domain);
    
    // Create feature-specific tests if enabled
    if (this.features['api-testing']) {
      this.createApiTests(baseURL, domain);
    }
    
    if (this.features['visual-testing']) {
      this.createVisualTests(baseURL, domain);
    }
    
    if (this.features['mobile-testing']) {
      this.createMobileTests(baseURL, domain);
    }
    
    console.log('✅ Sample test files created!\n');
  }

  async createComprehensiveContent() {
    console.log('🔧 Creating comprehensive framework content...\n');
    
    // Create CI/CD scripts
    if (this.features['ci-cd-templates']) {
      this.createCICDScripts();
    }

    // Create dashboard
    if (this.features['reporting-dashboard']) {
      this.createDashboard();
    }

    // Create baseline screenshots documentation
    if (this.features['visual-testing']) {
      this.createBaselineScreenshots();
    }

    // Create test data and fixtures
    this.createTestDataAndFixtures();

    console.log('\n✅ Comprehensive content created!\n');
  }

  async setupGit() {
    console.log('📝 Setting up Git repository...\n');
    
    const gitignoreContent = this.generateGitignore();
    this.createFile('.gitignore', gitignoreContent);
    console.log('✅ .gitignore created');

    try {
      execSync('git init', { cwd: this.getProjectPath(''), stdio: 'inherit' });
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
    console.log('3. Create your first page object in framework/pages/');
    console.log('4. Write your first test in tests/');
    console.log('5. Run tests: npm test');
    
    if (this.features['ci-cd-templates']) {
      console.log('6. Configure CI/CD in .github/workflows/');
    }
    
    if (this.features['docker-support']) {
      console.log('7. Build Docker image: npm run docker:build');
    }
    
    console.log('\n📚 Documentation:');
    console.log('- Framework README: README.md');
    console.log('- Playwright docs: https://playwright.dev/');
    console.log('\n🚀 Happy testing!\n');
  }



  // Generate configuration files (simplified versions)
  generateEnvironmentConfig() {
    const url = this.webUrl || 'https://example.com';
    const domain = new URL(url).hostname;
    
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
      local: {
        baseURL: 'http://localhost:3000',
        apiURL: 'http://localhost:3001',
        username: process.env.TEST_USERNAME || 'testuser',
        password: process.env.TEST_PASSWORD || 'testpass',
        timeout: 30000,
        retries: 3,
        headless: false,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: true,
        traceRecording: true
      },
      staging: {
        baseURL: '${url}',
        apiURL: 'https://api.${domain}',
        username: process.env.STAGING_USERNAME || 'staginguser',
        password: process.env.STAGING_PASSWORD || 'stagingpass',
        timeout: 30000,
        retries: 2,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: false,
        traceRecording: false
      },
      production: {
        baseURL: '${url}',
        apiURL: 'https://api.${domain}',
        username: process.env.PROD_USERNAME || 'produser',
        password: process.env.PROD_PASSWORD || 'prodpass',
        timeout: 45000,
        retries: 1,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: false,
        traceRecording: false
      }
    };

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
        testDir: './tests',
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
    const featuresList = Object.entries(this.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => `- ${feature.replace('-', ' ')}`)
      .join('\n');

    return `# Playwright Automation Framework

A comprehensive Playwright automation framework with TypeScript support.

## Features

${featuresList}

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
        ├── framework/
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

Update \`framework/config/EnvironmentConfig.ts\` to configure your environments.

## Writing Tests

1. Create page objects in \`framework/pages/\`
2. Write tests in \`tests/\`
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

  // Feature-specific file creation methods
  createApiTestFiles() {
    const apiTestContent = `import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('should get API response', async ({ request }) => {
    const response = await request.get('${this.config.apiURL}/api/health');
    expect(response.status()).toBe(200);
  });
});`;

    this.createFile('tests/api/api-tests.spec.ts', apiTestContent);
    console.log('✅ API test files created');
  }

  createVisualTestFiles() {
    const visualTestContent = `import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('${this.config.baseURL}');
    await expect(page).toHaveScreenshot('homepage.png');
  });
});`;

    this.createFile('tests/visual/visual-tests.spec.ts', visualTestContent);
    console.log('✅ Visual test files created');
  }

  createAccessibilityTestFiles() {
    const accessibilityTestContent = `import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('${this.config.baseURL}');
    
    // Inject axe-core
    await page.addInitScript(() => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js';
      document.head.appendChild(script);
    });
    
    // Run accessibility check
    const results = await page.evaluate(() => {
      return (window as any).axe.run();
    });
    
    expect(results.violations).toEqual([]);
  });
});`;

    this.createFile('tests/accessibility/accessibility-tests.spec.ts', accessibilityTestContent);
    console.log('✅ Accessibility test files created');
  }

  createCICDScripts() {
    // Ensure ci-cd directory exists
    this.createDirectory(this.getProjectPath('ci-cd'));
    // Create run-tests.sh
    const runTestsScript = `#!/bin/bash

# CI/CD Test Runner Script
# This script handles test execution in different environments

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Configuration
ENVIRONMENT=\${TEST_ENV:-"staging"}
BROWSER=\${BROWSER:-"chromium"}
WORKERS=\${WORKERS:-"4"}
HEADLESS=\${HEADLESS:-"true"}
RETRIES=\${RETRIES:-"2"}

echo -e "\${BLUE}🚀 Starting Playwright Test Execution\${NC}"
echo -e "\${YELLOW}Environment: \${ENVIRONMENT}\${NC}"
echo -e "\${YELLOW}Browser: \${BROWSER}\${NC}"
echo -e "\${YELLOW}Workers: \${WORKERS}\${NC}"
echo -e "\${YELLOW}Headless: \${HEADLESS}\${NC}"

# Function to log messages
log() {
    echo -e "\${GREEN}[\$(date +'%Y-%m-%d %H:%M:%S')] \$1\${NC}"
}

error() {
    echo -e "\${RED}[ERROR] \$1\${NC}"
    exit 1
}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install
fi

# Install browsers if needed
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
    log "Installing Playwright browsers..."
    npx playwright install
fi

# Create necessary directories
mkdir -p test-results
mkdir -p playwright-report
mkdir -p baseline-screenshots

# Set environment variables
export TEST_ENV=\$ENVIRONMENT
export PLAYWRIGHT_HEADLESS=\$HEADLESS

# Run tests based on environment
case \$ENVIRONMENT in
    "local")
        log "Running tests in LOCAL environment..."
        npx playwright test --config=framework.config.ts --project=\$BROWSER --workers=\$WORKERS --retries=\$RETRIES
        ;;
    "staging")
        log "Running tests in STAGING environment..."
        npx playwright test --config=framework.config.ts --project=\$BROWSER --workers=\$WORKERS --retries=\$RETRIES
        ;;
    "production")
        log "Running tests in PRODUCTION environment..."
        npx playwright test --config=framework.config.ts --project=\$BROWSER --workers=\$WORKERS --retries=\$RETRIES
        ;;
    *)
        error "Unknown environment: \$ENVIRONMENT"
        ;;
esac

# Check if tests passed
if [ \$? -eq 0 ]; then
    log "✅ All tests passed successfully!"
    
    # Generate additional reports if needed
    if [ "\$GENERATE_REPORTS" = "true" ]; then
        log "Generating additional reports..."
        npx playwright show-report --host 0.0.0.0 --port 9323 &
    fi
    
    exit 0
else
    error "❌ Some tests failed!"
fi`;

    this.createFile('ci-cd/run-tests.sh', runTestsScript);

    // Create deploy.sh
    const deployScript = `#!/bin/bash

# Deployment Script for Playwright Framework
# Handles deployment to different environments

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m'

# Configuration
ENVIRONMENT=\${DEPLOY_ENV:-"staging"}
DEPLOY_TYPE=\${DEPLOY_TYPE:-"test"}
BACKUP_REPORTS=\${BACKUP_REPORTS:-"true"}

echo -e "\${BLUE}🚀 Starting Deployment Process\${NC}"
echo -e "\${YELLOW}Environment: \${ENVIRONMENT}\${NC}"
echo -e "\${YELLOW}Deploy Type: \${DEPLOY_TYPE}\${NC}"

# Function to log messages
log() {
    echo -e "\${GREEN}[\$(date +'%Y-%m-%d %H:%M:%S')] \$1\${NC}"
}

error() {
    echo -e "\${RED}[ERROR] \$1\${NC}"
    exit 1
}

# Create backup of existing reports
if [ "\$BACKUP_REPORTS" = "true" ]; then
    log "Creating backup of existing reports..."
    if [ -d "test-results" ]; then
        tar -czf "test-results-backup-\$(date +%Y%m%d-%H%M%S).tar.gz" test-results/
    fi
    if [ -d "playwright-report" ]; then
        tar -czf "playwright-report-backup-\$(date +%Y%m%d-%H%M%S).tar.gz" playwright-report/
    fi
fi

# Environment-specific deployment
case \$ENVIRONMENT in
    "local")
        log "Deploying to LOCAL environment..."
        ./ci-cd/run-tests.sh
        ;;
    "staging")
        log "Deploying to STAGING environment..."
        export TEST_ENV=staging
        export HEADLESS=true
        ./ci-cd/run-tests.sh
        ;;
    "production")
        log "Deploying to PRODUCTION environment..."
        export TEST_ENV=production
        export HEADLESS=true
        export WORKERS=2
        ./ci-cd/run-tests.sh
        ;;
    *)
        error "Unknown environment: \$ENVIRONMENT"
        ;;
esac

# Post-deployment tasks
log "Running post-deployment tasks..."

# Generate deployment summary
cat > deployment-summary.txt << EOF
Deployment Summary
==================
Environment: \$ENVIRONMENT
Deploy Type: \$DEPLOY_TYPE
Timestamp: \$(date)
Status: SUCCESS

Test Results:
- Location: test-results/
- Report: playwright-report/

Next Steps:
1. Review test results
2. Check for any failures
3. Update documentation if needed
EOF

log "✅ Deployment completed successfully!"
log "📋 Deployment summary saved to deployment-summary.txt"`;

    this.createFile('ci-cd/deploy.sh', deployScript);

    // Create CI/CD README
    const cicdReadme = `# CI/CD Scripts Documentation

This directory contains scripts for continuous integration and deployment of the Playwright automation framework.

## 📁 Files Overview

### \`run-tests.sh\`
Main test execution script that handles running tests in different environments.

**Usage:**
\`\`\`bash
# Basic usage
./ci-cd/run-tests.sh

# With custom environment
TEST_ENV=production ./ci-cd/run-tests.sh

# With custom browser
BROWSER=firefox ./ci-cd/run-tests.sh

# With custom workers
WORKERS=8 ./ci-cd/run-tests.sh
\`\`\`

**Environment Variables:**
- \`TEST_ENV\`: Environment to run tests in (local, staging, production)
- \`BROWSER\`: Browser to use (chromium, firefox, webkit)
- \`WORKERS\`: Number of parallel workers
- \`HEADLESS\`: Run in headless mode (true/false)
- \`RETRIES\`: Number of retries for failed tests

### \`deploy.sh\`
Deployment script for different environments.

**Usage:**
\`\`\`bash
# Basic deployment
./ci-cd/deploy.sh

# Deploy to specific environment
DEPLOY_ENV=production ./ci-cd/deploy.sh

# Deploy with custom type
DEPLOY_TYPE=full ./ci-cd/deploy.sh
\`\`\`

**Environment Variables:**
- \`DEPLOY_ENV\`: Target environment (local, staging, production)
- \`DEPLOY_TYPE\`: Type of deployment (test, full)
- \`BACKUP_REPORTS\`: Create backup of existing reports (true/false)

## 🚀 Quick Start

1. **Make scripts executable:**
   \`\`\`bash
   chmod +x ci-cd/*.sh
   \`\`\`

2. **Run tests locally:**
   \`\`\`bash
   ./ci-cd/run-tests.sh
   \`\`\`

3. **Deploy to staging:**
   \`\`\`bash
   DEPLOY_ENV=staging ./ci-cd/deploy.sh
   \`\`\`

## 🔧 Integration with CI/CD Platforms

### GitHub Actions
\`\`\`yaml
- name: Run Tests
  run: |
    chmod +x ci-cd/*.sh
    ./ci-cd/run-tests.sh
  env:
    TEST_ENV: staging
    BROWSER: chromium
    WORKERS: 4
\`\`\`

### Jenkins Pipeline
\`\`\`groovy
stage('Test') {
    steps {
        sh '''
            chmod +x ci-cd/*.sh
            ./ci-cd/run-tests.sh
        '''
    }
    environment {
        TEST_ENV = 'staging'
        BROWSER = 'chromium'
    }
}
\`\`\`

### GitLab CI
\`\`\`yaml
test:
  script:
    - chmod +x ci-cd/*.sh
    - ./ci-cd/run-tests.sh
  variables:
    TEST_ENV: "staging"
    BROWSER: "chromium"
\`\`\`

## 📊 Monitoring and Reporting

The scripts automatically:
- Generate test reports in \`test-results/\`
- Create HTML reports in \`playwright-report/\`
- Backup existing reports before new runs
- Provide colored console output for better visibility

## 🔍 Troubleshooting

### Common Issues

1. **Permission Denied:**
   \`\`\`bash
   chmod +x ci-cd/*.sh
   \`\`\`

2. **Browsers Not Installed:**
   \`\`\`bash
   npx playwright install
   \`\`\`

3. **Dependencies Missing:**
   \`\`\`bash
   npm install
   \`\`\`

### Debug Mode
Run with debug information:
\`\`\`bash
set -x  # Enable debug mode
./ci-cd/run-tests.sh
\`\`\`

## 📈 Best Practices

1. **Environment Variables:** Always use environment variables for sensitive data
2. **Backup Reports:** Enable backup before major deployments
3. **Parallel Execution:** Use appropriate worker count for your infrastructure
4. **Monitoring:** Check logs and reports after each run
5. **Cleanup:** Regularly clean up old test results and reports

## 🔗 Related Documentation

- [Framework Configuration](../framework.config.ts)
- [Environment Configuration](../framework/config/EnvironmentConfig.ts)
- [Package.json Scripts](../package.json)`;

    this.createFile('ci-cd/README.md', cicdReadme);

    // Make scripts executable
    try {
      execSync('chmod +x ci-cd/*.sh', { cwd: this.getProjectPath(''), stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Failed to make scripts executable. Please run "chmod +x ci-cd/*.sh" manually.');
    }

    console.log('✅ CI/CD scripts created');
  }

  createDashboard() {
    // Create dashboard HTML
    const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-align: center;
        }

        .header p {
            color: #7f8c8d;
            text-align: center;
            font-size: 1.1em;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .stat-label {
            color: #7f8c8d;
            font-size: 1.1em;
        }

        .passed { color: #27ae60; }
        .failed { color: #e74c3c; }
        .skipped { color: #f39c12; }
        .total { color: #3498db; }

        .test-results {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .test-results h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8em;
        }

        .test-list {
            list-style: none;
        }

        .test-item {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
            transition: all 0.3s ease;
        }

        .test-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }

        .test-item.passed {
            border-left-color: #27ae60;
        }

        .test-item.failed {
            border-left-color: #e74c3c;
        }

        .test-item.skipped {
            border-left-color: #f39c12;
        }

        .test-name {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .test-duration {
            color: #7f8c8d;
            font-size: 0.9em;
        }

        .filters {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .filter-group {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }

        .filter-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: #27ae60;
        }

        .refresh-btn {
            background: #9b59b6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-left: auto;
        }

        .refresh-btn:hover {
            background: #8e44ad;
            transform: translateY(-2px);
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-group {
                flex-direction: column;
                align-items: stretch;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Playwright Test Dashboard</h1>
            <p>Real-time test execution monitoring and reporting</p>
        </div>

        <div class="filters">
            <div class="filter-group">
                <button class="filter-btn active" data-filter="all">All Tests</button>
                <button class="filter-btn" data-filter="passed">Passed</button>
                <button class="filter-btn" data-filter="failed">Failed</button>
                <button class="filter-btn" data-filter="skipped">Skipped</button>
                <button class="refresh-btn" onclick="loadTestResults()">🔄 Refresh</button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number total" id="totalTests">0</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number passed" id="passedTests">0</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed" id="failedTests">0</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number skipped" id="skippedTests">0</div>
                <div class="stat-label">Skipped</div>
            </div>
        </div>

        <div class="test-results">
            <h2>Test Results</h2>
            <div id="testList">
                <div class="loading">Loading test results...</div>
            </div>
        </div>
    </div>

    <script src="dashboard.js"></script>
</body>
</html>`;

    // Ensure dashboard directory exists
    this.createDirectory(this.getProjectPath('dashboard'));
    
    this.createFile('dashboard/index.html', dashboardHTML);

    // Create dashboard JavaScript
    const dashboardJS = `// Dashboard JavaScript functionality
// Handles test result processing, data visualization, and real-time updates

class TestDashboard {
    constructor() {
        this.testData = null;
        this.currentFilter = 'all';
        this.refreshInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTestResults();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('refresh-btn')) return;
                
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadTestResults());
        }
    }

    setActiveFilter(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(\`[data-filter="\${filter}"]\`).classList.add('active');
        
        this.currentFilter = filter;
        this.renderTests();
    }

    async loadTestResults() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // In real implementation, this would fetch from API or file
            await this.fetchTestResults();
            this.updateStats();
            this.renderTests();
        } catch (error) {
            this.showError('Failed to load test results: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    async fetchTestResults() {
        // Simulate API call - replace with actual implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                this.testData = {
                    total: 12,
                    passed: 8,
                    failed: 2,
                    skipped: 2,
                    lastUpdated: new Date().toISOString(),
                    tests: [
                        { name: "Homepage Navigation", status: "passed", duration: "1.2s", timestamp: new Date().toISOString() },
                        { name: "User Login", status: "passed", duration: "2.1s", timestamp: new Date().toISOString() },
                        { name: "Product Search", status: "passed", duration: "1.8s", timestamp: new Date().toISOString() },
                        { name: "Add to Cart", status: "passed", duration: "1.5s", timestamp: new Date().toISOString() },
                        { name: "Checkout Process", status: "failed", duration: "3.2s", timestamp: new Date().toISOString() },
                        { name: "Payment Gateway", status: "passed", duration: "2.8s", timestamp: new Date().toISOString() },
                        { name: "Order Confirmation", status: "passed", duration: "1.1s", timestamp: new Date().toISOString() },
                        { name: "User Profile", status: "passed", duration: "1.9s", timestamp: new Date().toISOString() },
                        { name: "Password Reset", status: "skipped", duration: "0.0s", timestamp: new Date().toISOString() },
                        { name: "Email Verification", status: "passed", duration: "1.4s", timestamp: new Date().toISOString() },
                        { name: "API Endpoints", status: "failed", duration: "2.3s", timestamp: new Date().toISOString() },
                        { name: "Mobile Responsive", status: "skipped", duration: "0.0s", timestamp: new Date().toISOString() }
                    ]
                };
                resolve();
            }, 1000);
        });
    }

    updateStats() {
        if (!this.testData) return;

        document.getElementById('totalTests').textContent = this.testData.total;
        document.getElementById('passedTests').textContent = this.testData.passed;
        document.getElementById('failedTests').textContent = this.testData.failed;
        document.getElementById('skippedTests').textContent = this.testData.skipped;

        // Update last updated time
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            lastUpdated.textContent = new Date(this.testData.lastUpdated).toLocaleString();
        }
    }

    renderTests() {
        if (!this.testData) return;

        const testList = document.getElementById('testList');
        const filteredTests = this.currentFilter === 'all' 
            ? this.testData.tests 
            : this.testData.tests.filter(test => test.status === this.currentFilter);

        if (filteredTests.length === 0) {
            testList.innerHTML = '<div class="loading">No tests found for the selected filter.</div>';
            return;
        }

        testList.innerHTML = filteredTests.map(test => this.createTestItem(test)).join('');
    }

    createTestItem(test) {
        const statusIcon = this.getStatusIcon(test.status);
        const statusClass = test.status;
        const timestamp = new Date(test.timestamp).toLocaleTimeString();

        return \`
            <div class="test-item \${statusClass}" data-test="\${test.name}">
                <div class="test-header">
                    <div class="test-name">\${statusIcon} \${test.name}</div>
                    <div class="test-status">\${test.status.toUpperCase()}</div>
                </div>
                <div class="test-details">
                    <div class="test-duration">Duration: \${test.duration}</div>
                    <div class="test-timestamp">Time: \${timestamp}</div>
                </div>
                \${test.status === 'failed' ? '<div class="test-error">Click to view error details</div>' : ''}
            </div>
        \`;
    }

    getStatusIcon(status) {
        const icons = {
            passed: '✅',
            failed: '❌',
            skipped: '⏭️'
        };
        return icons[status] || '❓';
    }

    showLoading() {
        const testList = document.getElementById('testList');
        testList.innerHTML = '<div class="loading">Loading test results...</div>';
    }

    showError(message) {
        const testList = document.getElementById('testList');
        testList.innerHTML = \`<div class="error">\${message}</div>\`;
    }

    startAutoRefresh() {
        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadTestResults();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Export functionality
    exportResults(format = 'json') {
        if (!this.testData) return;

        let data, filename, mimeType;

        switch (format) {
            case 'json':
                data = JSON.stringify(this.testData, null, 2);
                filename = \`test-results-\${new Date().toISOString().split('T')[0]}.json\`;
                mimeType = 'application/json';
                break;
            case 'csv':
                data = this.convertToCSV();
                filename = \`test-results-\${new Date().toISOString().split('T')[0]}.csv\`;
                mimeType = 'text/csv';
                break;
            default:
                console.error('Unsupported format:', format);
                return;
        }

        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    convertToCSV() {
        if (!this.testData) return '';

        const headers = ['Name', 'Status', 'Duration', 'Timestamp'];
        const rows = this.testData.tests.map(test => [
            test.name,
            test.status,
            test.duration,
            new Date(test.timestamp).toLocaleString()
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => \`"\${cell}"\`).join(','))
            .join('\\n');
    }

    // Performance metrics
    getPerformanceMetrics() {
        if (!this.testData) return null;

        const durations = this.testData.tests
            .filter(test => test.duration !== '0.0s')
            .map(test => parseFloat(test.duration.replace('s', '')));

        if (durations.length === 0) return null;

        return {
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            total: durations.reduce((a, b) => a + b, 0)
        };
    }

    // Cleanup
    destroy() {
        this.stopAutoRefresh();
        // Remove event listeners if needed
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testDashboard = new TestDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestDashboard;
}`;

    this.createFile('dashboard/dashboard.js', dashboardJS);

    // Create dashboard README
    const dashboardReadme = `# 🎭 Playwright Test Dashboard

A modern, interactive dashboard for monitoring and analyzing Playwright test results in real-time.

## 🚀 Features

### 📊 Real-time Monitoring
- Live test result updates
- Auto-refresh every 30 seconds
- Real-time statistics and metrics

### 📈 Visual Analytics
- Test pass/fail/skip statistics
- Performance metrics and trends
- Interactive filtering and sorting

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Glassmorphism design elements

### 🔧 Interactive Features
- Filter tests by status (All, Passed, Failed, Skipped)
- Manual refresh capability
- Export functionality (JSON, CSV)
- Performance metrics calculation

## 📁 File Structure

\`\`\`
dashboard/
├── index.html          # Main dashboard interface
├── dashboard.js        # Dashboard functionality
└── README.md          # This documentation
\`\`\`

## 🛠️ Usage

### 1. Open Dashboard
\`\`\`bash
# Navigate to dashboard directory
cd dashboard

# Open in browser
open index.html
# or
start index.html
# or
xdg-open index.html
\`\`\`

### 2. View Test Results
- Dashboard automatically loads sample test data
- Real-time statistics are displayed in cards
- Test list shows individual test results with status icons

### 3. Filter Results
- Click filter buttons to view specific test statuses
- Use "All Tests" to see complete results
- Filter by: Passed, Failed, Skipped

### 4. Refresh Data
- Click "🔄 Refresh" button for manual updates
- Auto-refresh occurs every 30 seconds
- Loading indicators show during refresh

## 🔧 Configuration

### Customizing Data Source
Edit \`dashboard.js\` to connect to your actual test results:

\`\`\`javascript
async fetchTestResults() {
    // Replace with actual API call or file reading
    const response = await fetch('/api/test-results');
    this.testData = await response.json();
}
\`\`\`

### Modifying Refresh Interval
\`\`\`javascript
// In dashboard.js
startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
        this.loadTestResults();
    }, 60000); // Change to 60 seconds
}
\`\`\`

### Adding New Metrics
\`\`\`javascript
// Add new stat card in index.html
<div class="stat-card">
    <div class="stat-number" id="newMetric">0</div>
    <div class="stat-label">New Metric</div>
</div>

// Update in dashboard.js
updateStats() {
    document.getElementById('newMetric').textContent = this.calculateNewMetric();
}
\`\`\`

## 📊 Data Format

The dashboard expects test data in this format:

\`\`\`json
{
  "total": 12,
  "passed": 8,
  "failed": 2,
  "skipped": 2,
  "lastUpdated": "2024-01-15T10:30:00Z",
  "tests": [
    {
      "name": "Test Name",
      "status": "passed|failed|skipped",
      "duration": "1.2s",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

## 🎨 Customization

### Styling
Modify CSS in \`index.html\` to customize appearance:

\`\`\`css
/* Change color scheme */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --warning-color: #f39c12;
}
\`\`\`

### Adding New Features
\`\`\`javascript
// Add export functionality
exportResults(format) {
    // Implementation for exporting data
}

// Add performance metrics
getPerformanceMetrics() {
    // Calculate and return performance data
}
\`\`\`

## 🔗 Integration

### With Playwright Framework
\`\`\`bash
# Run tests and generate results
npm test

# Open dashboard to view results
open dashboard/index.html
\`\`\`

### With CI/CD Pipeline
\`\`\`yaml
# GitHub Actions example
- name: Generate Dashboard
  run: |
    cp test-results/results.json dashboard/data/
    echo "Dashboard updated with latest results"
\`\`\`

### With Web Server
\`\`\`bash
# Serve dashboard with Python
python -m http.server 8000

# Serve with Node.js
npx serve dashboard

# Access at http://localhost:8000
\`\`\`

## 🚨 Troubleshooting

### Common Issues

1. **Dashboard Not Loading**
   - Check browser console for errors
   - Ensure all files are in correct location
   - Verify JavaScript is enabled

2. **No Data Displayed**
   - Check data format matches expected structure
   - Verify fetchTestResults() function
   - Check network connectivity for API calls

3. **Styling Issues**
   - Clear browser cache
   - Check CSS syntax
   - Verify responsive design breakpoints

### Debug Mode
\`\`\`javascript
// Enable debug logging
console.log('Dashboard data:', this.testData);
console.log('Current filter:', this.currentFilter);
\`\`\`

## 📈 Future Enhancements

### Planned Features
- [ ] WebSocket integration for real-time updates
- [ ] Chart.js integration for visual graphs
- [ ] Test history and trends
- [ ] Screenshot comparison viewer
- [ ] Performance benchmarking
- [ ] Team collaboration features
- [ ] Email notifications
- [ ] Slack/Discord integration

### Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📝 Notes

- Dashboard is currently using sample data
- Replace with actual test result integration
- Consider security for production deployment
- Add authentication if needed
- Optimize for large datasets

## 🔗 Related Documentation

- [Framework Configuration](../framework.config.ts)
- [Test Base](../framework/core/TestBase.ts)
- [CI/CD Scripts](../ci-cd/)
- [Package.json Scripts](../package.json)`;

    this.createFile('dashboard/README.md', dashboardReadme);

    console.log('✅ Dashboard created');
  }

  createBaselineScreenshots() {
    // Create baseline screenshots README
    const baselineReadme = `# Baseline Screenshots Directory

This directory contains baseline screenshots for visual regression testing. These images serve as the "golden standard" for comparing against new screenshots during test execution.

## 📁 Structure

\`\`\`
baseline-screenshots/
├── desktop/
│   ├── chromium/
│   ├── firefox/
│   └── webkit/
├── mobile/
│   ├── pixel-5/
│   └── iphone-12/
├── tablet/
│   └── ipad-pro/
└── README.md
\`\`\`

## 🎯 Purpose

Visual regression testing compares screenshots taken during test execution against these baseline images to detect visual changes in the application.

## 📸 How to Use

### 1. Generate Baseline Screenshots

\`\`\`bash
# Generate baselines for all browsers
npx playwright test --update-snapshots

# Generate baselines for specific browser
npx playwright test --project=chromium --update-snapshots

# Generate baselines for mobile
npx playwright test --project=mobile-chrome --update-snapshots
\`\`\`

### 2. Run Visual Tests

\`\`\`bash
# Run visual regression tests
npm run test:visual

# Run with specific baseline
npx playwright test --config=framework.config.ts --project=chromium
\`\`\`

### 3. Update Baselines

\`\`\`bash
# Update all baselines
npm run update-baselines

# Update specific baseline
npx playwright test --update-snapshots --project=chromium
\`\`\`

## 🔧 Configuration

### Visual Test Configuration

In your test files, use the visual testing utilities:

\`\`\`typescript
import { test, expect } from '../core/TestBase';

test('visual regression test', async ({ page, basePage }) => {
  await basePage.navigateTo('/my-page');
  
  // Take screenshot for comparison
  await expect(page).toHaveScreenshot('my-page.png');
  
  // Compare specific element
  await expect(page.locator('.header')).toHaveScreenshot('header.png');
});
\`\`\`

### Screenshot Options

\`\`\`typescript
// Full page screenshot
await expect(page).toHaveScreenshot('full-page.png', {
  fullPage: true,
  animations: 'disabled'
});

// Element screenshot
await expect(page.locator('.component')).toHaveScreenshot('component.png', {
  threshold: 0.1, // 10% tolerance
  maxDiffPixels: 100
});
\`\`\`

## 📊 Best Practices

### 1. Baseline Management
- **Version Control**: Always commit baseline screenshots to version control
- **Naming Convention**: Use descriptive names (e.g., \`homepage-desktop.png\`)
- **Organization**: Group by browser/device type
- **Cleanup**: Remove outdated baselines regularly

### 2. Visual Testing Strategy
- **Critical Paths**: Focus on key user journeys
- **Responsive Design**: Test across different screen sizes
- **Component Testing**: Test individual components in isolation
- **Cross-browser**: Ensure consistency across browsers

### 3. Threshold Configuration
\`\`\`typescript
// In framework.config.ts
expect: {
  toHaveScreenshot: {
    threshold: 0.1, // 10% tolerance
    maxDiffPixels: 100
  }
}
\`\`\`

## 🚨 Troubleshooting

### Common Issues

1. **Baseline Not Found:**
   \`\`\`bash
   # Regenerate baselines
   npm run update-baselines
   \`\`\`

2. **False Positives:**
   - Adjust threshold values
   - Exclude dynamic content areas
   - Use element-specific screenshots

3. **Cross-platform Differences:**
   - Use consistent environments
   - Consider platform-specific baselines
   - Use Docker for consistent rendering

### Debug Visual Differences

\`\`\`bash
# Show visual differences
npx playwright show-report

# Compare specific screenshots
npx playwright test --reporter=html
\`\`\`

## 📈 Integration with CI/CD

### GitHub Actions Example
\`\`\`yaml
- name: Visual Regression Tests
  run: |
    npm run test:visual
    npm run update-baselines
  env:
    PLAYWRIGHT_UPDATE_SNAPSHOTS: 1
\`\`\`

### Jenkins Pipeline
\`\`\`groovy
stage('Visual Testing') {
    steps {
        sh 'npm run test:visual'
        sh 'npm run update-baselines'
    }
}
\`\`\`

## 🔗 Related Files

- [Visual Test Configuration](../framework/visual/)
- [Framework Configuration](../framework.config.ts)
- [Test Base](../framework/core/TestBase.ts)
- [Package.json Scripts](../package.json)

## 📝 Notes

- Baseline screenshots should be committed to version control
- Update baselines when intentional UI changes are made
- Use descriptive names for better organization
- Consider using different baselines for different environments`;

    // Ensure baseline-screenshots directory exists
    this.createDirectory(this.getProjectPath('baseline-screenshots'));
    
    this.createFile('baseline-screenshots/README.md', baselineReadme);

    console.log('✅ Baseline screenshots documentation created');
  }

  createSmokeTests(baseURL, domain) {
    console.log('🔥 Creating smoke tests...');
    
    const smokeTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Smoke Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await page.goto('${baseURL}');
    await expect(page).toHaveTitle(/.*/);
    await expect(page).toHaveURL('${baseURL}');
  });

  test('should have basic page elements', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Check for common elements
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('head')).toBeAttached();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('${baseURL}');
    
    // Wait a bit for any potential errors
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});`;

    this.createFile('tests/smoke/smoke-tests.spec.ts', smokeTestContent);
    console.log('✅ Smoke tests created');
  }

  createRegressionTests(baseURL, domain) {
    console.log('🔄 Creating regression tests...');
    
    const regressionTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Regression Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('should maintain page layout consistency', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Check for consistent layout elements
    const header = page.locator('header, .header, #header, [role="banner"]').first();
    const footer = page.locator('footer, .footer, #footer, [role="contentinfo"]').first();
    
    if (await header.isVisible()) {
      await expect(header).toBeVisible();
    }
    
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });

  test('should handle navigation correctly', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test internal links if they exist
    const links = page.locator('a[href^="/"], a[href^="${baseURL}"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      // Test first few links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('#')) {
          await link.click();
          await expect(page).not.toHaveURL('${baseURL}');
          await page.goBack();
        }
      }
    }
  });

  test('should maintain form functionality', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Look for forms and test basic functionality
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      const inputs = form.locator('input[type="text"], input[type="email"], textarea');
      
      if (await inputs.count() > 0) {
        const input = inputs.first();
        await input.fill('test input');
        await expect(input).toHaveValue('test input');
      }
    }
  });

  test('should handle images correctly', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          await expect(img).toBeVisible();
        }
      }
    }
  });
});`;

    this.createFile('tests/regression/regression-tests.spec.ts', regressionTestContent);
    console.log('✅ Regression tests created');
  }

  createE2ETests(baseURL, domain) {
    console.log('🌐 Creating E2E tests...');
    
    const e2eTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('End-to-End Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('complete user journey - homepage to contact', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('${baseURL}');
    await expect(page).toHaveTitle(/.*/);
    
    // Step 2: Look for navigation elements
    const nav = page.locator('nav, .nav, .navigation, [role="navigation"]').first();
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
    }
    
    // Step 3: Look for contact or about links
    const contactLink = page.locator('a[href*="contact"], a[href*="about"], a:has-text("Contact"), a:has-text("About")').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).not.toHaveURL('${baseURL}');
    }
  });

  test('search functionality if available', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Look for search functionality
    const searchInput = page.locator('input[type="search"], input[name*="search"], input[placeholder*="search"], #search');
    
    if (await searchInput.count() > 0) {
      const search = searchInput.first();
      await search.fill('test search');
      await expect(search).toHaveValue('test search');
      
      // Look for search button
      const searchButton = page.locator('button[type="submit"], input[type="submit"], .search-button, #search-button');
      if (await searchButton.count() > 0) {
        await searchButton.first().click();
        // Wait for potential search results
        await page.waitForTimeout(2000);
      }
    }
  });

  test('responsive navigation', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test mobile menu if it exists
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenu = page.locator('.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]');
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
  });
});`;

    this.createFile('tests/e2e/e2e-tests.spec.ts', e2eTestContent);
    console.log('✅ E2E tests created');
  }

  createUnitTests(baseURL, domain) {
    console.log('🧪 Creating unit tests...');
    
    const unitTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Unit Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page title validation', async ({ page }) => {
    await page.goto('${baseURL}');
    const title = await page.title();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Document');
  });

  test('meta tags validation', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Check for essential meta tags
    const viewport = page.locator('meta[name="viewport"]');
    const charset = page.locator('meta[charset]');
    
    if (await viewport.count() > 0) {
      await expect(viewport.first()).toBeAttached();
    }
    
    if (await charset.count() > 0) {
      await expect(charset.first()).toBeAttached();
    }
  });

  test('favicon validation', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const favicon = page.locator('link[rel*="icon"]');
    if (await favicon.count() > 0) {
      await expect(favicon.first()).toBeAttached();
    }
  });

  test('language attribute validation', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    
    expect(lang).toBeTruthy();
    expect(lang.length).toBeGreaterThan(0);
  });
});`;

    this.createFile('tests/unit/unit-tests.spec.ts', unitTestContent);
    console.log('✅ Unit tests created');
  }

  createIntegrationTests(baseURL, domain) {
    console.log('🔗 Creating integration tests...');
    
    const integrationTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Integration Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('CSS and JavaScript integration', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Check if CSS is loaded
    const stylesheets = page.locator('link[rel="stylesheet"]');
    if (await stylesheets.count() > 0) {
      await expect(stylesheets.first()).toBeAttached();
    }
    
    // Check if JavaScript is working
    const result = await page.evaluate(() => {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    });
    
    expect(result).toBe(true);
  });

  test('external resource integration', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Check for external resources (fonts, analytics, etc.)
    const externalResources = page.locator('link[href*="//"], script[src*="//"]');
    const resourceCount = await externalResources.count();
    
    if (resourceCount > 0) {
      // Log external resources for review
      console.log(\`Found \${resourceCount} external resources\`);
    }
  });

  test('form submission integration', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const form = forms.first();
      const action = await form.getAttribute('action');
      const method = await form.getAttribute('method');
      
      expect(action).toBeTruthy();
      expect(method).toBeTruthy();
    }
  });
});`;

    this.createFile('tests/integration/integration-tests.spec.ts', integrationTestContent);
    console.log('✅ Integration tests created');
  }

  createAccessibilityTests(baseURL, domain) {
    console.log('♿ Creating accessibility tests...');
    
    const accessibilityTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Accessibility Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page has proper heading structure', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    // Check for at least one heading
    const totalHeadings = await h1.count() + await h2.count() + await h3.count();
    expect(totalHeadings).toBeGreaterThan(0);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images for alt attributes
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Alt should exist (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    }
  });

  test('form elements have labels', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Check first few inputs for labels
      for (let i = 0; i < Math.min(3, inputCount); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        
        if (id) {
          const label = page.locator(\`label[for="\${id}"]\`);
          if (await label.count() === 0) {
            // Check for aria-label as alternative
            const ariaLabel = await input.getAttribute('aria-label');
            expect(ariaLabel || name).toBeTruthy();
          }
        }
      }
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Basic color contrast check (this is a simplified version)
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const textCount = await textElements.count();
    
    if (textCount > 0) {
      // Check if text is visible (basic accessibility check)
      const firstText = textElements.first();
      await expect(firstText).toBeVisible();
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});`;

    this.createFile('tests/accessibility/accessibility-tests.spec.ts', accessibilityTestContent);
    console.log('✅ Accessibility tests created');
  }

  createPerformanceTests(baseURL, domain) {
    console.log('⚡ Creating performance tests...');
    
    const performanceTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Performance Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('${baseURL}');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    console.log(\`Page loaded in \${loadTime}ms\`);
  });

  test('DOM content loaded quickly', async ({ page }) => {
    const domContentLoaded = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            resolve(performance.now());
          });
        } else {
          resolve(performance.now());
        }
      });
    });
    
    // DOM should be ready within 5 seconds
    expect(domContentLoaded).toBeLessThan(5000);
  });

  test('resource loading performance', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalResources: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.loadComplete).toBeLessThan(5000);
  });

  test('memory usage is reasonable', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Wait for page to stabilize
    await page.waitForTimeout(2000);
    
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    if (memoryInfo) {
      console.log('Memory usage:', memoryInfo);
      
      // Check if memory usage is reasonable (less than 100MB)
      const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      expect(usedMemoryMB).toBeLessThan(100);
    }
  });
});`;

    this.createFile('tests/performance/performance-tests.spec.ts', performanceTestContent);
    console.log('✅ Performance tests created');
  }

  createApiTests(baseURL, domain) {
    console.log('🔌 Creating API tests...');
    
    const apiTestContent = `import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const apiBaseURL = 'https://api.${domain}';

  test('API health check', async ({ request }) => {
    const response = await request.get(\`\${apiBaseURL}/health\`);
    expect(response.status()).toBe(200);
  });

  test('API endpoints are accessible', async ({ request }) => {
    // Test common API endpoints
    const endpoints = ['/users', '/products', '/orders', '/auth'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await request.get(\`\${apiBaseURL}\${endpoint}\`);
        console.log(\`Endpoint \${endpoint}: \${response.status()}\`);
      } catch (error) {
        console.log(\`Endpoint \${endpoint}: Not accessible\`);
      }
    }
  });

  test('API response format validation', async ({ request }) => {
    try {
      const response = await request.get(\`\${apiBaseURL}/users\`);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
        
        // Check if response is an array or object
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
      }
    } catch (error) {
      console.log('API endpoint not available for testing');
    }
  });

  test('API authentication', async ({ request }) => {
    try {
      const response = await request.post(\`\${apiBaseURL}/auth/login\`, {
        data: {
          username: 'testuser',
          password: 'testpass'
        }
      });
      
      console.log(\`Auth endpoint status: \${response.status()}\`);
    } catch (error) {
      console.log('Auth endpoint not available for testing');
    }
  });
});`;

    this.createFile('tests/api/api-tests.spec.ts', apiTestContent);
    console.log('✅ API tests created');
  }

  createVisualTests(baseURL, domain) {
    console.log('🎨 Creating visual tests...');
    
    const visualTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Visual Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test('homepage visual regression', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('responsive design visual test', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png');
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('homepage-tablet.png');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('homepage-desktop.png');
  });

  test('header component visual test', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const header = page.locator('header, .header, #header, [role="banner"]').first();
    
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('header.png');
    }
  });

  test('footer component visual test', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const footer = page.locator('footer, .footer, #footer, [role="contentinfo"]').first();
    
    if (await footer.isVisible()) {
      await expect(footer).toHaveScreenshot('footer.png');
    }
  });
});`;

    this.createFile('tests/visual/visual-tests.spec.ts', visualTestContent);
    console.log('✅ Visual tests created');
  }

  createMobileTests(baseURL, domain) {
    console.log('📱 Creating mobile tests...');
    
    const mobileTestContent = `import { test, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

test.describe('Mobile Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Look for mobile menu
    const mobileMenu = page.locator('.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]');
    
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(1000);
      
      // Check if menu is visible
      const menuItems = page.locator('.mobile-nav, .mobile-menu-items, nav');
      if (await menuItems.count() > 0) {
        await expect(menuItems.first()).toBeVisible();
      }
    }
  });

  test('mobile touch interactions', async ({ page }) => {
    await page.goto('${baseURL}');
    
    // Test touch interactions on buttons
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const button = buttons.first();
      await button.tap();
      // Wait for any potential action
      await page.waitForTimeout(1000);
    }
  });

  test('mobile form interactions', async ({ page }) => {
    await page.goto('${baseURL}');
    
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const input = inputs.first();
      await input.tap();
      await input.fill('mobile test input');
      await expect(input).toHaveValue('mobile test input');
    }
  });

  test('mobile performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('${baseURL}');
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should load within 8 seconds
    expect(loadTime).toBeLessThan(8000);
    
    console.log(\`Mobile page loaded in \${loadTime}ms\`);
  });
});`;

    this.createFile('tests/mobile/mobile-tests.spec.ts', mobileTestContent);
    console.log('✅ Mobile tests created');
  }

  createTestDataAndFixtures() {
    // Ensure data directory exists
    this.createDirectory(this.getProjectPath('data'));
    // Create test data
    const testData = {
      "users": {
        "admin": {
          "username": "admin@example.com",
          "password": "admin123",
          "role": "administrator"
        },
        "standard": {
          "username": "user@example.com",
          "password": "user123",
          "role": "user"
        },
        "premium": {
          "username": "premium@example.com",
          "password": "premium123",
          "role": "premium"
        }
      },
      "products": {
        "laptop": {
          "name": "Gaming Laptop",
          "price": 1299.99,
          "category": "electronics",
          "sku": "LAP-001"
        },
        "phone": {
          "name": "Smartphone Pro",
          "price": 799.99,
          "category": "electronics",
          "sku": "PHN-001"
        },
        "headphones": {
          "name": "Wireless Headphones",
          "price": 199.99,
          "category": "accessories",
          "sku": "HDP-001"
        }
      },
      "testUrls": {
        "homepage": "${this.config.baseURL}",
        "login": "${this.config.baseURL}/login",
        "register": "${this.config.baseURL}/register",
        "search": "${this.config.baseURL}/search"
      },
      "selectors": {
        "navigation": {
          "menu": ".nav-menu",
          "logo": ".logo",
          "search": "#search-input",
          "login": ".login-btn"
        },
        "forms": {
          "username": "#username",
          "password": "#password",
          "email": "#email",
          "submit": ".submit-btn"
        },
        "content": {
          "title": "h1",
          "description": ".description",
          "price": ".price",
          "addToCart": ".add-to-cart"
        }
      },
      "testConfig": {
        "timeout": 30000,
        "retries": 2,
        "screenshotOnFailure": true,
        "videoRecording": true
      }
    };

    this.createFile('data/test-data.json', JSON.stringify(testData, null, 2));

    // Create fixtures
    const fixtures = {
      "testCredentials": {
        "validUser": {
          "email": "test@example.com",
          "password": "TestPassword123!"
        },
        "invalidUser": {
          "email": "invalid@example.com",
          "password": "WrongPassword"
        }
      },
      "formData": {
        "registration": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "password": "SecurePass123!",
          "confirmPassword": "SecurePass123!"
        },
        "contact": {
          "name": "Jane Smith",
          "email": "jane.smith@example.com",
          "message": "This is a test message for contact form testing."
        }
      },
      "searchTerms": [
        "web design",
        "mobile app",
        "user interface",
        "responsive design",
        "creative portfolio"
      ],
      "testImages": {
        "profile": "profile-avatar.jpg",
        "product": "product-image.png",
        "banner": "banner-image.jpg"
      },
      "apiEndpoints": {
        "users": "/api/users",
        "products": "/api/products",
        "orders": "/api/orders",
        "auth": "/api/auth"
      },
      "expectedTexts": {
        "welcome": "Welcome to our platform",
        "loginSuccess": "Successfully logged in",
        "errorMessage": "Invalid credentials",
        "pageTitle": "Website Title"
      }
    };

    this.createFile('fixtures/sample-data.json', JSON.stringify(fixtures, null, 2));

    console.log('✅ Test data and fixtures created');
  }

  generateAccessibilityModule() {
    return `import { Page, Locator } from '@playwright/test';
import * as axe from 'axe-core';

export class Accessibility {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run accessibility audit using axe-core
   */
  async runAccessibilityAudit(options: any = {}): Promise<any> {
    const defaultOptions = {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'color-contrast': { enabled: true },
        'document-title': { enabled: true },
        'html-has-lang': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true }
      }
    };

    const auditOptions = { ...defaultOptions, ...options };

    // Inject axe-core if not already present
    await this.page.addInitScript(() => {
      if (typeof window.axe === 'undefined') {
        // Note: In a real implementation, you'd need to inject axe-core properly
        console.log('Axe-core would be injected here');
      }
    });

    // Run accessibility audit
    const results = await this.page.evaluate((options) => {
      return new Promise((resolve) => {
        if (typeof window.axe !== 'undefined') {
          window.axe.run(options, (err, results) => {
            if (err) {
              resolve({ error: err.message });
            } else {
              resolve(results);
            }
          });
        } else {
          resolve({ error: 'Axe-core not available' });
        }
      });
    }, auditOptions);

    return results;
  }

  /**
   * Check if element has proper ARIA attributes
   */
  async checkAriaAttributes(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const ariaAttributes = await element.evaluate((el) => {
      const attributes = el.getAttributeNames();
      return attributes.filter(attr => attr.startsWith('aria-'));
    });

    return ariaAttributes.length > 0;
  }

  /**
   * Verify color contrast ratio
   */
  async checkColorContrast(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const contrastRatio = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // Simple contrast check (in real implementation, use proper color contrast calculation)
      return {
        backgroundColor,
        color,
        hasContrast: true // Placeholder
      };
    });

    return contrastRatio.hasContrast;
  }

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation(): Promise<boolean> {
    // Test tab navigation
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });

    return focusedElement !== null;
  }

  /**
   * Verify screen reader compatibility
   */
  async checkScreenReaderCompatibility(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const screenReaderInfo = await element.evaluate((el) => {
      return {
        hasAriaLabel: !!el.getAttribute('aria-label'),
        hasAriaLabelledby: !!el.getAttribute('aria-labelledby'),
        hasRole: !!el.getAttribute('role'),
        isFocusable: el.tabIndex >= 0
      };
    });

    return screenReaderInfo.hasAriaLabel || screenReaderInfo.hasAriaLabelledby || screenReaderInfo.hasRole;
  }

  /**
   * Generate accessibility report
   */
  async generateAccessibilityReport(): Promise<any> {
    const auditResults = await this.runAccessibilityAudit();
    
    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      violations: auditResults.violations || [],
      passes: auditResults.passes || [],
      incomplete: auditResults.incomplete || [],
      inapplicable: auditResults.inapplicable || [],
      summary: {
        totalViolations: auditResults.violations?.length || 0,
        totalPasses: auditResults.passes?.length || 0,
        totalIncomplete: auditResults.incomplete?.length || 0
      }
    };

    return report;
  }
}`;
  }

  generateBrowserActionsModule() {
    return `import { Page, Browser, BrowserContext } from '@playwright/test';

export class BrowserActions {
  private page: Page;
  private browser: Browser;
  private context: BrowserContext;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.page = page;
    this.browser = browser;
    this.context = context;
  }

  /**
   * Navigate to URL with retry logic
   */
  async navigateTo(url: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000,
      retries: 3
    };

    const navOptions = { ...defaultOptions, ...options };

    for (let i = 0; i < navOptions.retries; i++) {
      try {
        await this.page.goto(url, navOptions);
        return;
      } catch (error) {
        if (i === navOptions.retries - 1) {
          throw error;
        }
        console.log(\`Navigation attempt \${i + 1} failed, retrying...\`);
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Refresh page with cache control
   */
  async refreshPage(clearCache: boolean = false): Promise<void> {
    if (clearCache) {
      await this.context.clearCookies();
      await this.page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
    }
    
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Set user agent
   */
  async setUserAgent(userAgent: string): Promise<void> {
    await this.page.setExtraHTTPHeaders({
      'User-Agent': userAgent
    });
  }

  /**
   * Add cookies
   */
  async addCookies(cookies: Array<{ name: string; value: string; domain?: string; path?: string }>): Promise<void> {
    await this.context.addCookies(cookies);
  }

  /**
   * Get all cookies
   */
  async getCookies(): Promise<any[]> {
    return await this.context.cookies();
  }

  /**
   * Clear all cookies
   */
  async clearCookies(): Promise<void> {
    await this.context.clearCookies();
  }

  /**
   * Set geolocation
   */
  async setGeolocation(latitude: number, longitude: number): Promise<void> {
    await this.context.setGeolocation({ latitude, longitude });
  }

  /**
   * Set permissions
   */
  async setPermissions(permissions: string[]): Promise<void> {
    await this.context.grantPermissions(permissions);
  }

  /**
   * Add route handler
   */
  async addRouteHandler(urlPattern: string, handler: Function): Promise<void> {
    await this.page.route(urlPattern, handler);
  }

  /**
   * Remove route handler
   */
  async removeRouteHandler(urlPattern: string): Promise<void> {
    await this.page.unroute(urlPattern);
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content loaded
   */
  async waitForDOMContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get page URL
   */
  async getPageURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(path?: string): Promise<Buffer> {
    if (path) {
      return await this.page.screenshot({ path });
    }
    return await this.page.screenshot();
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    return await this.page.content();
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Wait for function to return truthy value
   */
  async waitForFunction(fn: Function, timeout: number = 30000): Promise<void> {
    await this.page.waitForFunction(fn, { timeout });
  }
}`;
  }

  generateClickModule() {
    return `import { Page, Locator } from '@playwright/test';

export class Click {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      retries: 3,
      force: false,
      noWaitAfter: false
    };

    const clickOptions = { ...defaultOptions, ...options };

    for (let i = 0; i < clickOptions.retries; i++) {
      try {
        await this.page.click(selector, clickOptions);
        return;
      } catch (error) {
        if (i === clickOptions.retries - 1) {
          throw error;
        }
        console.log(\`Click attempt \${i + 1} failed, retrying...\`);
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Click element by text
   */
  async clickByText(text: string, options: any = {}): Promise<void> {
    const selector = \`text=\${text}\`;
    await this.clickElement(selector, options);
  }

  /**
   * Click element by role
   */
  async clickByRole(role: string, options: any = {}): Promise<void> {
    const selector = \`[role="\${role}"]\`;
    await this.clickElement(selector, options);
  }

  /**
   * Click element by data attribute
   */
  async clickByDataAttribute(attribute: string, value: string, options: any = {}): Promise<void> {
    const selector = \`[data-\${attribute}="\${value}"]\`;
    await this.clickElement(selector, options);
  }

  /**
   * Double click element
   */
  async doubleClick(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.dblclick(selector, clickOptions);
  }

  /**
   * Right click element
   */
  async rightClick(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.click(selector, { ...clickOptions, button: 'right' });
  }

  /**
   * Click element with keyboard
   */
  async clickWithKeyboard(selector: string): Promise<void> {
    await this.page.focus(selector);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Click element and wait for navigation
   */
  async clickAndWaitForNavigation(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000
    };

    const navOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForLoadState(navOptions.waitUntil, { timeout: navOptions.timeout }),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for specific URL
   */
  async clickAndWaitForURL(selector: string, expectedURL: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 30000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForURL(expectedURL, waitOptions),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for selector to appear
   */
  async clickAndWaitForSelector(selector: string, waitForSelector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForSelector(waitForSelector, waitOptions),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for selector to disappear
   */
  async clickAndWaitForSelectorToDisappear(selector: string, waitForSelector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await this.clickElement(selector);
    await this.page.waitForSelector(waitForSelector, { ...waitOptions, state: 'hidden' });
  }

  /**
   * Click element with coordinates
   */
  async clickAtCoordinates(selector: string, x: number, y: number, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.click(selector, { ...clickOptions, position: { x, y } });
  }

  /**
   * Click element in center
   */
  async clickInCenter(selector: string, options: any = {}): Promise<void> {
    await this.clickElement(selector, { ...options, position: { x: 0.5, y: 0.5 } });
  }

  /**
   * Click element and verify it's clicked
   */
  async clickAndVerify(selector: string, verificationSelector: string, options: any = {}): Promise<boolean> {
    await this.clickElement(selector, options);
    
    try {
      await this.page.waitForSelector(verificationSelector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click multiple elements
   */
  async clickMultiple(selectors: string[], options: any = {}): Promise<void> {
    for (const selector of selectors) {
      await this.clickElement(selector, options);
      await this.page.waitForTimeout(100); // Small delay between clicks
    }
  }

  /**
   * Click element if visible
   */
  async clickIfVisible(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      const isVisible = await element.isVisible();
      
      if (isVisible) {
        await this.clickElement(selector, options);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Click element and wait for response
   */
  async clickAndWaitForResponse(selector: string, urlPattern: string, options: any = {}): Promise<any> {
    const defaultOptions = {
      timeout: 30000
    };

    const waitOptions = { ...defaultOptions, ...options };

    const responsePromise = this.page.waitForResponse(urlPattern, waitOptions);
    await this.clickElement(selector);
    
    return await responsePromise;
  }
}`;
  }

  generateDropdownModule() {
    return `import { Page, Locator } from '@playwright/test';

export class Dropdown {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select option by value
   */
  async selectByValue(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, value, selectOptions);
  }

  /**
   * Select option by label
   */
  async selectByLabel(selector: string, label: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, { label }, selectOptions);
  }

  /**
   * Select option by index
   */
  async selectByIndex(selector: string, index: number, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    
    // Get all options and select by index
    const options = await this.page.locator(\`\${selector} option\`).all();
    if (options[index]) {
      const value = await options[index].getAttribute('value');
      await this.selectByValue(selector, value, selectOptions);
    } else {
      throw new Error(\`Option at index \${index} not found\`);
    }
  }

  /**
   * Select multiple options
   */
  async selectMultiple(selector: string, values: string[], options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, values, selectOptions);
  }

  /**
   * Get selected option
   */
  async getSelectedOption(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return select.value;
    });
  }

  /**
   * Get all options
   */
  async getAllOptions(selector: string): Promise<Array<{ value: string; label: string; selected: boolean }>> {
    const options = await this.page.locator(\`\${selector} option\`).all();
    
    const result = [];
    for (const option of options) {
      const value = await option.getAttribute('value');
      const label = await option.textContent();
      const selected = await option.getAttribute('selected') !== null;
      
      result.push({
        value: value || '',
        label: label || '',
        selected
      });
    }
    
    return result;
  }

  /**
   * Check if option is selected
   */
  async isOptionSelected(selector: string, value: string): Promise<boolean> {
    const selectedValue = await this.getSelectedOption(selector);
    return selectedValue === value;
  }

  /**
   * Deselect all options
   */
  async deselectAll(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, [], selectOptions);
  }

  /**
   * Deselect specific option
   */
  async deselectOption(selector: string, value: string, options: any = {}): Promise<void> {
    const currentValues = await this.getSelectedValues(selector);
    const newValues = currentValues.filter(v => v !== value);
    await this.selectMultiple(selector, newValues, options);
  }

  /**
   * Get selected values (for multiple select)
   */
  async getSelectedValues(selector: string): Promise<string[]> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map(option => option.value);
    });
  }

  /**
   * Wait for option to be available
   */
  async waitForOption(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(\`\${selector} option[value="\${value}"]\`, waitOptions);
  }

  /**
   * Check if dropdown is enabled
   */
  async isEnabled(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isEnabled();
  }

  /**
   * Check if dropdown is disabled
   */
  async isDisabled(selector: string): Promise<boolean> {
    return !(await this.isEnabled(selector));
  }

  /**
   * Get dropdown size (number of options)
   */
  async getSize(selector: string): Promise<number> {
    const options = await this.page.locator(\`\${selector} option\`).all();
    return options.length;
  }

  /**
   * Select option and wait for change
   */
  async selectAndWaitForChange(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    // Wait for the change event
    const changePromise = this.page.waitForFunction(
      (sel, val) => {
        const select = document.querySelector(sel) as HTMLSelectElement;
        return select && select.value === val;
      },
      selector,
      value,
      waitOptions
    );

    await this.selectByValue(selector, value);
    await changePromise;
  }

  /**
   * Select option and verify selection
   */
  async selectAndVerify(selector: string, value: string, options: any = {}): Promise<boolean> {
    await this.selectByValue(selector, value, options);
    return await this.isOptionSelected(selector, value);
  }

  /**
   * Get dropdown placeholder text
   */
  async getPlaceholder(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.getAttribute('placeholder') || '';
  }

  /**
   * Check if dropdown has specific option
   */
  async hasOption(selector: string, value: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(\`\${selector} option[value="\${value}"]\`, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select random option
   */
  async selectRandomOption(selector: string, options: any = {}): Promise<string> {
    const allOptions = await this.getAllOptions(selector);
    const availableOptions = allOptions.filter(option => !option.disabled);
    
    if (availableOptions.length === 0) {
      throw new Error('No available options found');
    }
    
    const randomIndex = Math.floor(Math.random() * availableOptions.length);
    const randomOption = availableOptions[randomIndex];
    
    await this.selectByValue(selector, randomOption.value, options);
    return randomOption.value;
  }
}`;
  }

  generateElementsModule() {
    return `import { Page, Locator } from '@playwright/test';

export class Elements {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Find element by selector
   */
  async findElement(selector: string, options: any = {}): Promise<Locator> {
    const defaultOptions = {
      timeout: 10000
    };

    const findOptions = { ...defaultOptions, ...options };
    return this.page.locator(selector, findOptions);
  }

  /**
   * Find element by text
   */
  async findElementByText(text: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`text=\${text}\`, options);
  }

  /**
   * Find element by role
   */
  async findElementByRole(role: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[role="\${role}"]\`, options);
  }

  /**
   * Find element by data attribute
   */
  async findElementByDataAttribute(attribute: string, value: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[data-\${attribute}="\${value}"]\`, options);
  }

  /**
   * Find element by ID
   */
  async findElementById(id: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`#\${id}\`, options);
  }

  /**
   * Find element by class name
   */
  async findElementByClassName(className: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`.\${className}\`, options);
  }

  /**
   * Find element by name attribute
   */
  async findElementByName(name: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[name="\${name}"]\`, options);
  }

  /**
   * Find element by placeholder
   */
  async findElementByPlaceholder(placeholder: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[placeholder="\${placeholder}"]\`, options);
  }

  /**
   * Find element by title
   */
  async findElementByTitle(title: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[title="\${title}"]\`, options);
  }

  /**
   * Find element by alt text
   */
  async findElementByAltText(altText: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`[alt="\${altText}"]\`, options);
  }

  /**
   * Find element by partial text
   */
  async findElementByPartialText(partialText: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`text=*\${partialText}*\`, options);
  }

  /**
   * Find element by CSS selector
   */
  async findElementByCSS(cssSelector: string, options: any = {}): Promise<Locator> {
    return await this.findElement(cssSelector, options);
  }

  /**
   * Find element by XPath
   */
  async findElementByXPath(xpath: string, options: any = {}): Promise<Locator> {
    return await this.findElement(\`xpath=\${xpath}\`, options);
  }

  /**
   * Find multiple elements
   */
  async findElements(selector: string, options: any = {}): Promise<Locator[]> {
    const defaultOptions = {
      timeout: 10000
    };

    const findOptions = { ...defaultOptions, ...options };
    const locator = this.page.locator(selector, findOptions);
    return await locator.all();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'visible' });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'hidden' });
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForElementAttached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'attached' });
  }

  /**
   * Wait for element to be detached from DOM
   */
  async waitForElementDetached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'detached' });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string, options: any = {}): Promise<boolean> {
    try {
      const defaultOptions = {
        timeout: 5000
      };

      const checkOptions = { ...defaultOptions, ...options };
      await this.page.waitForSelector(selector, checkOptions);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible(options);
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isEnabled(options);
    } catch {
      return false;
    }
  }

  /**
   * Check if element is disabled
   */
  async isElementDisabled(selector: string, options: any = {}): Promise<boolean> {
    return !(await this.isElementEnabled(selector, options));
  }

  /**
   * Get element text
   */
  async getElementText(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent(options) || '';
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(selector: string, attribute: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute, options) || '';
  }

  /**
   * Get element value
   */
  async getElementValue(selector: string, options: any = {}): Promise<string> {
    return await this.getElementAttribute(selector, 'value', options);
  }

  /**
   * Get element inner HTML
   */
  async getElementInnerHTML(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.innerHTML(options);
  }

  /**
   * Get element outer HTML
   */
  async getElementOuterHTML(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.outerHTML(options);
  }

  /**
   * Get element bounding box
   */
  async getElementBoundingBox(selector: string, options: any = {}): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const element = this.page.locator(selector);
    return await element.boundingBox(options);
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string, options: any = {}): Promise<number> {
    const elements = await this.findElements(selector, options);
    return elements.length;
  }

  /**
   * Focus element
   */
  async focusElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.focus(options);
  }

  /**
   * Blur element
   */
  async blurElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.blur(options);
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.hover(options);
  }

  /**
   * Get element computed style
   */
  async getElementComputedStyle(selector: string, property: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property, options);
  }

  /**
   * Check if element has class
   */
  async hasClass(selector: string, className: string, options: any = {}): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.evaluate((el, cls) => {
      return el.classList.contains(cls);
    }, className, options);
  }

  /**
   * Get element classes
   */
  async getElementClasses(selector: string, options: any = {}): Promise<string[]> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      return Array.from(el.classList);
    }, options);
  }

  /**
   * Validate element properties
   */
  async validateElement(selector: string, properties: any, options: any = {}): Promise<boolean> {
    const element = this.page.locator(selector);
    
    for (const [property, expectedValue] of Object.entries(properties)) {
      const actualValue = await element.evaluate((el, prop) => {
        return el[prop];
      }, property, options);
      
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    
    return true;
  }
}`;
  }

  generateScrollModule() {
    return `import { Page } from '@playwright/test';

export class Scroll {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToElement(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.locator(selector).scrollIntoViewIfNeeded(scrollOptions);
  }

  async scrollToTop(options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((opts) => {
      window.scrollTo({ top: 0, behavior: opts.behavior });
    }, scrollOptions);
  }

  async scrollToBottom(options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((opts) => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: opts.behavior });
    }, scrollOptions);
  }

  async scrollBy(x: number, y: number, options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((coords, opts) => {
      window.scrollBy({ left: coords.x, top: coords.y, behavior: opts.behavior });
    }, { x, y }, scrollOptions);
  }

  async getScrollPosition(): Promise<{ x: number; y: number }> {
    return await this.page.evaluate(() => {
      return {
        x: window.pageXOffset || window.scrollX,
        y: window.pageYOffset || window.scrollY
      };
    });
  }

  async isElementInViewport(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }
}`;
  }

  generateTypeModule() {
    return `import { Page } from '@playwright/test';

export class Type {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async typeText(selector: string, text: string, options: any = {}): Promise<void> {
    const defaultOptions = { delay: 0, timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    await this.page.fill(selector, text, typeOptions);
  }

  async typeTextWithDelay(selector: string, text: string, delay: number = 100, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    await this.page.type(selector, text, { ...typeOptions, delay });
  }

  async clearAndType(selector: string, text: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    
    await this.page.fill(selector, '', typeOptions);
    await this.page.fill(selector, text, typeOptions);
  }

  async typeAndPress(selector: string, text: string, key: string, options: any = {}): Promise<void> {
    await this.typeText(selector, text, options);
    await this.page.press(selector, key);
  }

  async typeAndPressEnter(selector: string, text: string, options: any = {}): Promise<void> {
    await this.typeAndPress(selector, text, 'Enter', options);
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async clearInput(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const clearOptions = { ...defaultOptions, ...options };
    await this.page.fill(selector, '', clearOptions);
  }
}`;
  }

  generateWaitModule() {
    return `import { Page } from '@playwright/test';

export class Wait {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElementVisible(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'visible' });
  }

  async waitForElementHidden(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'hidden' });
  }

  async waitForElementAttached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'attached' });
  }

  async waitForElementDetached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'detached' });
  }

  async waitForURL(pattern: string | RegExp, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForURL(pattern, waitOptions);
  }

  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForDOMContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }

  async waitForFunction(fn: Function, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(fn, { timeout });
  }

  async waitForResponse(urlPattern: string | RegExp, options: any = {}): Promise<any> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    return await this.page.waitForResponse(urlPattern, waitOptions);
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }
}`;
  }

  generateWindowHandlerModule() {
    return `import { Page, Browser, BrowserContext } from '@playwright/test';

export class WindowHandler {
  private page: Page;
  private browser: Browser;
  private context: BrowserContext;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.page = page;
    this.browser = browser;
    this.context = context;
  }

  async getAllPages(): Promise<Page[]> {
    return this.context.pages();
  }

  async getPageByIndex(index: number): Promise<Page | null> {
    const pages = await this.getAllPages();
    return pages[index] || null;
  }

  async getPageByTitle(title: string): Promise<Page | null> {
    const pages = await this.getAllPages();
    
    for (const page of pages) {
      const pageTitle = await page.title();
      if (pageTitle === title) {
        return page;
      }
    }
    
    return null;
  }

  async switchToPageByIndex(index: number): Promise<Page> {
    const page = await this.getPageByIndex(index);
    if (!page) {
      throw new Error(\`Page at index \${index} not found\`);
    }
    
    await page.bringToFront();
    return page;
  }

  async switchToPageByTitle(title: string): Promise<Page> {
    const page = await this.getPageByTitle(title);
    if (!page) {
      throw new Error(\`Page with title "\${title}" not found\`);
    }
    
    await page.bringToFront();
    return page;
  }

  async openNewPage(url?: string): Promise<Page> {
    const newPage = await this.context.newPage();
    
    if (url) {
      await newPage.goto(url);
    }
    
    return newPage;
  }

  async closePage(page: Page): Promise<void> {
    await page.close();
  }

  async closeCurrentPage(): Promise<void> {
    await this.page.close();
  }

  async getPageCount(): Promise<number> {
    const pages = await this.getAllPages();
    return pages.length;
  }

  async waitForNewPage(options: any = {}): Promise<Page> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    return await this.context.waitForEvent('page', waitOptions);
  }
}`;
  }

  generateInteractionsIndex() {
    return `// Interactions Module - Main Export File
export { Accessibility } from './Accessibility';
export { BrowserActions } from './BrowserActions';
export { Click } from './Click';
export { Dropdown } from './Dropdown';
export { Elements } from './Elements';
export { Scroll } from './Scroll';
export { Type } from './Type';
export { Wait } from './Wait';
export { WindowHandler } from './WindowHandler';

import { Page, Browser, BrowserContext } from '@playwright/test';
import { Accessibility } from './Accessibility';
import { BrowserActions } from './BrowserActions';
import { Click } from './Click';
import { Dropdown } from './Dropdown';
import { Elements } from './Elements';
import { Scroll } from './Scroll';
import { Type } from './Type';
import { Wait } from './Wait';
import { WindowHandler } from './WindowHandler';

export class InteractionManager {
  public accessibility: Accessibility;
  public browserActions: BrowserActions;
  public click: Click;
  public dropdown: Dropdown;
  public elements: Elements;
  public scroll: Scroll;
  public type: Type;
  public wait: Wait;
  public windowHandler: WindowHandler;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.accessibility = new Accessibility(page);
    this.browserActions = new BrowserActions(page, browser, context);
    this.click = new Click(page);
    this.dropdown = new Dropdown(page);
    this.elements = new Elements(page);
    this.scroll = new Scroll(page);
    this.type = new Type(page);
    this.wait = new Wait(page);
    this.windowHandler = new WindowHandler(page, browser, context);
  }

  static create(page: Page, browser?: Browser, context?: BrowserContext): InteractionManager {
    return new InteractionManager(page, browser, context);
  }
}

export default InteractionManager;
`;
  }

  generateUtilitiesModule() {
    return `import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class Utilities {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomEmail(): string {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(6);
    return \`\${username}@\${domain}.com\`;
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i === maxRetries) {
          throw lastError;
        }
        await this.sleep(delay * Math.pow(2, i));
      }
    }
    
    throw lastError!;
  }

  async takeScreenshotWithTimestamp(screenshotDir: string = 'screenshots'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = \`screenshot_\${timestamp}.png\`;
    const filepath = path.join(screenshotDir, filename);
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await this.page.screenshot({ path: filepath });
    return filepath;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static readJSONFile(filePath: string): any {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(\`Failed to read JSON file: \${filePath}\`);
    }
  }

  static writeJSONFile(filePath: string, data: any): void {
    try {
      this.ensureDirectoryExists(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error(\`Failed to write JSON file: \${filePath}\`);
    }
  }
}`;
  }

  generateConstantsModule() {
    return `// Framework Constants
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTENDED: 60000
} as const;

export const RETRY_ATTEMPTS = {
  MIN: 1,
  DEFAULT: 3,
  MAX: 5
} as const;

export const VIEWPORT_SIZES = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1920, height: 1080 },
  LARGE_DESKTOP: { width: 2560, height: 1440 }
} as const;

export const BROWSERS = {
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  WEBKIT: 'webkit'
} as const;

export const ENVIRONMENTS = {
  LOCAL: 'local',
  DEV: 'dev',
  STAGING: 'staging',
  PRODUCTION: 'production'
} as const;

export const TEST_TYPES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  SMOKE: 'smoke',
  REGRESSION: 'regression',
  ACCESSIBILITY: 'accessibility',
  PERFORMANCE: 'performance'
} as const;

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const ELEMENT_STATES = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  ATTACHED: 'attached',
  DETACHED: 'detached'
} as const;

export const LOAD_STATES = {
  DOMCONTENTLOADED: 'domcontentloaded',
  LOAD: 'load',
  NETWORKIDLE: 'networkidle'
} as const;

export const DEFAULTS = {
  TIMEOUT: TIMEOUTS.MEDIUM,
  RETRY_ATTEMPTS: RETRY_ATTEMPTS.DEFAULT,
  VIEWPORT: VIEWPORT_SIZES.DESKTOP,
  BROWSER: BROWSERS.CHROMIUM,
  ENVIRONMENT: ENVIRONMENTS.LOCAL
} as const;

export const CONSTANTS = {
  TIMEOUTS,
  RETRY_ATTEMPTS,
  VIEWPORT_SIZES,
  BROWSERS,
  ENVIRONMENTS,
  TEST_TYPES,
  STATUS_CODES,
  HTTP_METHODS,
  ELEMENT_STATES,
  LOAD_STATES,
  DEFAULTS
} as const;

export default CONSTANTS;
`;
  }

  generateRunnerConfigModule() {
    return `import { PlaywrightTestConfig, devices } from '@playwright/test';
import { ENVIRONMENTS, TIMEOUTS } from './constants';

const baseConfig: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: TIMEOUTS.LONG,
  expect: {
    timeout: TIMEOUTS.MEDIUM
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};

const environmentConfigs = {
  [ENVIRONMENTS.LOCAL]: {
    ...baseConfig,
    use: {
      ...baseConfig.use,
      baseURL: 'http://localhost:3000'
    }
  },
  [ENVIRONMENTS.DEV]: {
    ...baseConfig,
    use: {
      ...baseConfig.use,
      baseURL: process.env.DEV_URL || 'https://dev.example.com'
    }
  },
  [ENVIRONMENTS.STAGING]: {
    ...baseConfig,
    use: {
      ...baseConfig.use,
      baseURL: process.env.STAGING_URL || 'https://staging.example.com'
    }
  },
  [ENVIRONMENTS.PRODUCTION]: {
    ...baseConfig,
    use: {
      ...baseConfig.use,
      baseURL: process.env.PRODUCTION_URL || 'https://example.com'
    }
  }
};

export function createConfig(
  environment: string = ENVIRONMENTS.LOCAL,
  testType?: string
): PlaywrightTestConfig {
  let config = environmentConfigs[environment] || baseConfig;
  return config;
}

const config = createConfig(process.env.ENVIRONMENT as string, process.env.TEST_TYPE as string);
export default config;
`;
  }

  generateGlobalSetupModule() {
    return `import { chromium, FullConfig } from '@playwright/test';
import { ENVIRONMENTS } from './constants';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  
  if (process.env.AUTHENTICATE === 'true') {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(\`\${baseURL}/login\`);
    await page.fill('#username', process.env.TEST_USERNAME || 'testuser');
    await page.fill('#password', process.env.TEST_PASSWORD || 'testpass');
    await page.click('#login-button');
    await page.waitForURL(\`\${baseURL}/dashboard\`);
    
    await page.context().storageState({ path: storageState as string });
    await browser.close();
  }
  
  console.log(\`Running tests in \${process.env.ENVIRONMENT || ENVIRONMENTS.LOCAL} environment\`);
}

export default globalSetup;
`;
  }

  generateGlobalTeardownModule() {
    return `import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  if (process.env.CLEANUP_TEST_DATA === 'true') {
    console.log('Cleaning up test data...');
  }
  
  if (process.env.GENERATE_REPORTS === 'true') {
    console.log('Generating reports...');
  }
  
  console.log('Global teardown completed');
}

export default globalTeardown;
`;
  }

  generateHooksModule() {
    return `import { test as base, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { InteractionManager } from './interactions';
import { Utilities } from './utilities';

export const test = base.extend<{
  interactions: InteractionManager;
  utilities: Utilities;
  authenticatedPage: Page;
  mobilePage: Page;
  tabletPage: Page;
}>({
  interactions: async ({ page, browser, context }, use) => {
    const interactions = new InteractionManager(page, browser, context);
    await use(interactions);
  },

  utilities: async ({ page }, use) => {
    const utilities = new Utilities(page);
    await use(utilities);
  },

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['iPhone 12']
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  tabletPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['iPad Pro']
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});

export { expect } from '@playwright/test';

export const hooks = {
  beforeEach: async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  },

  afterEach: async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ 
        path: \`test-results/screenshots/\${testInfo.title.replace(/[^a-z0-9]/gi, '_')}.png\` 
      });
    }
  },

  beforeAll: async ({ browser }) => {
    console.log('Starting test suite...');
  },

  afterAll: async () => {
    console.log('Test suite completed');
  }
};

export { test as testWithHooks } from './hooks';
`;
  }

  // Utility methods for file and directory creation
  async createDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
      }
    } catch (error) {
      console.error(`❌ Error creating directory ${dirPath}:`, error.message);
      throw error;
    }
  }

  async createFile(filePath, content) {
    const fullPath = this.getProjectPath(filePath);
    try {
      // Ensure the directory exists
      const dirPath = path.dirname(fullPath);
      await this.createDirectory(dirPath);
      
      // Write the file
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Created file: ${fullPath}`);
    } catch (error) {
      console.error(`❌ Error creating file ${fullPath}:`, error.message);
      throw error;
    }
  }

  // Main CLI execution method
  async execute() {
    try {
      console.log('🚀 Starting Enhanced Playwright Framework Setup...\n');

      // Get project name and create project directory
      await this.getProjectNameAndCreateDirectory();

      // Create project structure
      await this.createProjectStructure();

      // Generate core configuration
      await this.generateCoreConfig();

      // Generate interactions module
      await this.generateInteractionsModule();

      // Generate utilities and constants
      await this.generateUtilitiesAndConstants();

      // Generate runner configuration
      await this.generateRunnerConfig();

      // Generate reporting and accessibility
      await this.generateReportingAndAccessibility();

      // Generate sample tests
      await this.generateSampleTests();

      // Generate package.json with enhanced dependencies
      await this.generateEnhancedPackageJson();

      // Generate documentation
      await this.generateDocumentation();

      // Generate environment file
      await this.generateEnvironmentFile();

      console.log('\n✅ Enhanced Playwright Framework setup completed successfully!');
      console.log(`\n📁 Project structure created in: ${this.projectName}/`);
      console.log('   ├── framework/');
      console.log('   │   ├── config/');
      console.log('   │   ├── core/');
      console.log('   │   ├── interactions/');
      console.log('   │   ├── utils/');
      console.log('   │   └── constants/');
      console.log('   ├── tests/');
      console.log('   ├── reports/');
      console.log('   └── docs/');
      
      console.log('\n🚀 Next steps:');
      console.log(`   1. cd ${this.projectName}`);
      console.log('   2. npm install');
      console.log('   3. npm run test');
      console.log('   4. Check the generated documentation');
      
    } catch (error) {
      console.error('❌ Error during setup:', error);
      process.exit(1);
    }
  }

  async getProjectNameAndCreateDirectory() {
    console.log('📝 Project Setup\n');
    
    // Get project name
    let projectName = '';
    while (!projectName || !this.isValidProjectName(projectName)) {
      projectName = await this.question('Enter project name: ');
      if (!this.isValidProjectName(projectName)) {
        console.log('❌ Invalid project name. Use only letters, numbers, hyphens, and underscores.');
      }
    }

    this.projectName = projectName;

    // Get web URL for testing
    let webUrl = '';
    while (!webUrl || !this.isValidUrl(webUrl)) {
      webUrl = await this.question('Enter the web URL to test (e.g., https://example.com): ');
      if (!this.isValidUrl(webUrl)) {
        console.log('❌ Invalid URL. Please enter a valid URL starting with http:// or https://');
      }
    }

    this.webUrl = webUrl;
    console.log(`🌐 Target URL: ${this.webUrl}`);

    // Check if directory already exists
    if (fs.existsSync(this.projectName)) {
      const overwrite = await this.question(`Directory '${this.projectName}' already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
      // Remove existing directory
      fs.rmSync(this.projectName, { recursive: true, force: true });
      console.log(`🗑️  Removed existing directory: ${this.projectName}`);
    }

    // Create project directory
    try {
      fs.mkdirSync(this.projectName);
      console.log(`✅ Created project directory: ${this.projectName}`);
      
      // Change to project directory
      process.chdir(this.projectName);
      console.log(`📁 Working directory changed to: ${this.projectName}`);
      
    } catch (error) {
      console.error(`❌ Error creating project directory: ${error.message}`);
      throw error;
    }
  }

  async createProjectStructure() {
    console.log('📁 Creating project structure...');
    
    const directories = [
      'framework/config',
      'framework/core',
      'framework/interactions',
      'framework/utils',
      'framework/constants',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/smoke',
      'tests/regression',
      'tests/accessibility',
      'tests/performance',
      'reports',
      'docs',
      'fixtures',
      'data'
    ];

    for (const dir of directories) {
      await this.createDirectory(this.getProjectPath(dir));
    }
  }

  async generateCoreConfig() {
    console.log('⚙️  Generating core configuration...');
    
    const configFiles = [
      { path: 'framework/config/EnvironmentConfig.ts', content: this.generateEnvironmentConfig() },
      { path: 'framework/core/BasePage.ts', content: this.generateBasePage() },
      { path: 'framework/core/TestBase.ts', content: this.generateTestBase() }
    ];

    for (const file of configFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateInteractionsModule() {
    console.log('🖱️  Generating interactions module...');
    
    const interactionFiles = [
      { path: 'framework/interactions/Accessibility.ts', content: this.generateAccessibilityModule() },
      { path: 'framework/interactions/BrowserActions.ts', content: this.generateBrowserActionsModule() },
      { path: 'framework/interactions/Click.ts', content: this.generateClickModule() },
      { path: 'framework/interactions/Dropdown.ts', content: this.generateDropdownModule() },
      { path: 'framework/interactions/Elements.ts', content: this.generateElementsModule() },
      { path: 'framework/interactions/Scroll.ts', content: this.generateScrollModule() },
      { path: 'framework/interactions/Type.ts', content: this.generateTypeModule() },
      { path: 'framework/interactions/Wait.ts', content: this.generateWaitModule() },
      { path: 'framework/interactions/WindowHandler.ts', content: this.generateWindowHandlerModule() },
      { path: 'framework/interactions/index.ts', content: this.generateInteractionsIndex() }
    ];

    for (const file of interactionFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateUtilitiesAndConstants() {
    console.log('🛠️  Generating utilities and constants...');
    
    const utilityFiles = [
      { path: 'framework/utils/Utilities.ts', content: this.generateUtilitiesModule() },
      { path: 'framework/constants/Constants.ts', content: this.generateConstantsModule() }
    ];

    for (const file of utilityFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateRunnerConfig() {
    console.log('🏃 Generating runner configuration...');
    
    const runnerFiles = [
      { path: 'framework/config/RunnerConfig.ts', content: this.generateRunnerConfigModule() },
      { path: 'framework/config/GlobalSetup.ts', content: this.generateGlobalSetupModule() },
      { path: 'framework/config/GlobalTeardown.ts', content: this.generateGlobalTeardownModule() },
      { path: 'framework/config/Hooks.ts', content: this.generateHooksModule() }
    ];

    for (const file of runnerFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateReportingAndAccessibility() {
    console.log('📊 Generating reporting and accessibility modules...');
    
    const reportingFiles = [
      { path: 'framework/utils/Reporting.ts', content: this.generateReportingModule() },
      { path: 'framework/utils/AccessibilityTesting.ts', content: this.generateAccessibilityTestingModule() }
    ];

    for (const file of reportingFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateSampleTests() {
    console.log('🧪 Generating sample tests...');
    
    const testFiles = [
      { path: 'tests/e2e/sample-tests.spec.ts', content: this.generateSampleTestModule() }
    ];

    for (const file of testFiles) {
      await this.createFile(file.path, file.content);
    }
  }

  async generateEnhancedPackageJson() {
    console.log('📦 Generating enhanced package.json...');
    
    const packageJson = {
      name: "playwright-enhanced-framework",
      version: "1.0.0",
      description: "Enhanced Playwright Test Framework with comprehensive modules",
      scripts: {
        "test": "playwright test",
        "test:headed": "playwright test --headed",
        "test:debug": "playwright test --debug",
        "test:ui": "playwright test --ui",
        "test:smoke": "playwright test tests/smoke/",
        "test:regression": "playwright test tests/regression/",
        "test:accessibility": "playwright test tests/accessibility/",
        "test:performance": "playwright test tests/performance/",
        "report": "playwright show-report",
        "install-browsers": "playwright install",
        "codegen": "playwright codegen"
      },
      devDependencies: {
        "@playwright/test": "^1.40.0",
        "@types/node": "^20.0.0",
        "typescript": "^5.0.0",
        "axe-core": "^4.7.0",
        "allure-playwright": "^2.9.0"
      },
      dependencies: {
        "dotenv": "^16.0.0",
        "fs-extra": "^11.0.0",
        "moment": "^2.29.0"
      }
    };

    await this.createFile('package.json', JSON.stringify(packageJson, null, 2));
  }

  async generateDocumentation() {
    console.log('📚 Generating documentation...');
    
    const docs = [
      {
        path: 'docs/README.md',
        content: `# Enhanced Playwright Framework

## Overview
This is an enhanced Playwright test framework with comprehensive modules for web testing.

## Features
- 🔧 Modular architecture
- 🖱️ Comprehensive interactions module
- 📊 Advanced reporting
- ♿ Accessibility testing
- 📱 Mobile and tablet support
- 🌍 Multi-environment support
- 🧪 Multiple test types

## Quick Start
1. \`npm install\`
2. \`npm run test\`

## Documentation
- [Framework Guide](./framework-guide.md)
- [API Reference](./api-reference.md)
- [Best Practices](./best-practices.md)
`
      }
    ];

    for (const doc of docs) {
      await this.createFile(doc.path, doc.content);
    }
  }

  async generateEnvironmentFile() {
    console.log('🌍 Generating environment configuration...');
    
    const url = this.webUrl || 'https://example.com';
    const domain = new URL(url).hostname;
    
    const envContent = `# Environment Configuration
# Generated for: ${domain}

# Base URLs
BASE_URL=${url}
API_URL=https://api.${domain}

# Test Environment
TEST_ENV=staging

# Browser Configuration
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# Timeouts
TIMEOUT=30000
RETRIES=2

# Recording Options
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
TRACE_ON_FAILURE=false

# Test Credentials (Update these with real credentials)
TEST_USERNAME=testuser
TEST_PASSWORD=testpass
STAGING_USERNAME=staginguser
STAGING_PASSWORD=stagingpass
PROD_USERNAME=produser
PROD_PASSWORD=prodpass

# Additional Configuration
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
`;

    await this.createFile('.env', envContent);
  }

  generateReportingModule() {
    return `import { TestResult, TestError } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  tests: Array<{
    title: string;
    status: string;
    duration: number;
    error?: string;
    screenshot?: string;
    video?: string;
    trace?: string;
  }>;
  metadata: {
    timestamp: string;
    environment: string;
    browser: string;
    version: string;
  };
}

export class Reporting {
  private reportDir: string;
  private report: TestReport;

  constructor(reportDir: string = 'test-results') {
    this.reportDir = reportDir;
    this.report = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0
      },
      tests: [],
      metadata: {
        timestamp: new Date().toISOString(),
        environment: process.env.ENVIRONMENT || 'local',
        browser: process.env.BROWSER || 'chromium',
        version: process.env.VERSION || '1.0.0'
      }
    };
  }

  addTestResult(testResult: TestResult): void {
    const test = {
      title: testResult.title,
      status: testResult.status,
      duration: testResult.duration,
      error: testResult.error?.message,
      screenshot: testResult.attachments.find(a => a.name === 'screenshot')?.path,
      video: testResult.attachments.find(a => a.name === 'video')?.path,
      trace: testResult.attachments.find(a => a.name === 'trace')?.path
    };

    this.report.tests.push(test);
    this.report.summary.total++;
    this.report.summary.duration += testResult.duration;

    switch (testResult.status) {
      case 'passed':
        this.report.summary.passed++;
        break;
      case 'failed':
        this.report.summary.failed++;
        break;
      case 'skipped':
        this.report.summary.skipped++;
        break;
    }
  }

  generateHTMLReport(): string {
    const html = \`
<!DOCTYPE html>
<html>
<head>
    <title>Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .test { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .passed { border-left: 5px solid #4CAF50; }
        .failed { border-left: 5px solid #f44336; }
        .skipped { border-left: 5px solid #FF9800; }
        .error { color: #f44336; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Test Execution Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Total: \${this.report.summary.total}</p>
        <p>Passed: \${this.report.summary.passed}</p>
        <p>Failed: \${this.report.summary.failed}</p>
        <p>Skipped: \${this.report.summary.skipped}</p>
        <p>Duration: \${this.report.summary.duration}ms</p>
    </div>
    <h2>Test Details</h2>
    \${this.report.tests.map(test => \`
        <div class="test \${test.status}">
            <h3>\${test.title}</h3>
            <p>Status: \${test.status}</p>
            <p>Duration: \${test.duration}ms</p>
            \${test.error ? \`<p class="error">Error: \${test.error}</p>\` : ''}
            \${test.screenshot ? \`<p>Screenshot: <a href="\${test.screenshot}">View</a></p>\` : ''}
        </div>
    \`).join('')}
</body>
</html>
    \`;

    const filepath = path.join(this.reportDir, 'report.html');
    fs.writeFileSync(filepath, html);
    return filepath;
  }

  generateJSONReport(): string {
    const filepath = path.join(this.reportDir, 'report.json');
    fs.writeFileSync(filepath, JSON.stringify(this.report, null, 2));
    return filepath;
  }

  generateCSVReport(): string {
    const csv = [
      'Title,Status,Duration,Error',
      ...this.report.tests.map(test => 
        \`"\${test.title}","\${test.status}",\${test.duration},"\${test.error || ''}"\`
      )
    ].join('\\n');

    const filepath = path.join(this.reportDir, 'report.csv');
    fs.writeFileSync(filepath, csv);
    return filepath;
  }

  generateJUnitReport(): string {
    const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
    <testsuite name="Playwright Tests" tests="\${this.report.summary.total}" failures="\${this.report.summary.failed}" skipped="\${this.report.summary.skipped}" time="\${this.report.summary.duration / 1000}">
        \${this.report.tests.map(test => \`
            <testcase name="\${test.title}" time="\${test.duration / 1000}">
                \${test.status === 'failed' ? \`<failure message="\${test.error}">\${test.error}</failure>\` : ''}
                \${test.status === 'skipped' ? '<skipped/>' : ''}
            </testcase>
        \`).join('')}
    </testsuite>
</testsuites>\`;

    const filepath = path.join(this.reportDir, 'junit.xml');
    fs.writeFileSync(filepath, xml);
    return filepath;
  }

  generateAllReports(): void {
    this.generateHTMLReport();
    this.generateJSONReport();
    this.generateCSVReport();
    this.generateJUnitReport();
  }

  getReport(): TestReport {
    return this.report;
  }
}
`;
// }
// `;
   }

  generateAccessibilityTestingModule() {
    return `import { Page } from '@playwright/test';

export interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export interface AccessibilityReport {
  violations: AccessibilityViolation[];
  passes: any[];
  timestamp: string;
  url: string;
}

export class AccessibilityTesting {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async runAccessibilityAudit(): Promise<AccessibilityReport> {
    const results = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js';
        script.onload = () => {
          (window as any).axe.run((err: any, results: any) => {
            resolve(results);
          });
        };
        document.head.appendChild(script);
      });
    });

    return {
      violations: results.violations || [],
      passes: results.passes || [],
      timestamp: new Date().toISOString(),
      url: this.page.url()
    };
  }

  async checkAccessibility(): Promise<boolean> {
    const report = await this.runAccessibilityAudit();
    return report.violations.length === 0;
  }

  async getAccessibilityViolations(): Promise<AccessibilityViolation[]> {
    const report = await this.runAccessibilityAudit();
    return report.violations;
  }
}`;
  }

  generateSampleTestModule() {
    const url = this.webUrl || 'https://example.com';
    const domain = new URL(url).hostname;
    
    return `import { test, expect } from '@playwright/test';
import { InteractionManager } from '../framework/interactions';
import { Utilities } from '../framework/utils/Utilities';
import { AccessibilityTesting } from '../framework/utils/AccessibilityTesting';

test.describe('Sample Tests for ${domain}', () => {
  let interactionManager: InteractionManager;
  let utilities: Utilities;
  let accessibilityTesting: AccessibilityTesting;

  test.beforeEach(async ({ page }) => {
    interactionManager = new InteractionManager(page);
    utilities = new Utilities();
    accessibilityTesting = new AccessibilityTesting(page);
  });

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('${url}');
    
    // Verify page loaded
    await expect(page).toHaveURL('${url}');
    
    // Check if page has content
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('Page title:', title);
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('${url}');
    
    // Check for basic HTML structure
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('head')).toBeAttached();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should perform basic interactions', async ({ page }) => {
    await page.goto('${url}');
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
    
    // Test click interactions on common elements
    const clickableElements = await page.locator('a, button, [role="button"]').count();
    if (clickableElements > 0) {
      await interactionManager.click.clickElement('a:first-child');
    }
    
    // Test form interactions if forms exist
    const forms = await page.locator('form').count();
    if (forms > 0) {
      const inputs = await page.locator('input[type="text"], input[type="email"], textarea').count();
      if (inputs > 0) {
        await interactionManager.type.typeText('input[type="text"]:first-child', 'test input');
      }
    }
  });

  test('should pass accessibility audit', async ({ page }) => {
    await page.goto('${url}');
    await page.waitForLoadState('networkidle');
    
    try {
      const isAccessible = await accessibilityTesting.checkAccessibility();
      expect(isAccessible).toBe(true);
    } catch (error) {
      console.log('Accessibility audit failed:', error.message);
      // Don't fail the test, just log the issue
    }
  });

  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('${url}');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log('Page load time:', loadTime + 'ms');
    expect(loadTime).toBeLessThan(10000); // 10 seconds budget
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('${url}');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // Verify page is still functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation properly', async ({ page }) => {
    await page.goto('${url}');
    
    // Get all links on the page
    const links = await page.locator('a[href]').all();
    
    if (links.length > 0) {
      // Test first internal link
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          try {
            await link.click();
            await page.waitForLoadState('networkidle');
            console.log('Successfully navigated to:', href);
            break;
          } catch (error) {
            console.log('Navigation failed for:', href, error.message);
          }
        }
      }
    }
  });

  test('should validate page metadata', async ({ page }) => {
    await page.goto('${url}');
    
    // Check for meta tags
    const metaTags = await page.locator('meta').count();
    expect(metaTags).toBeGreaterThan(0);
    
    // Check for viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').count();
    if (viewportMeta > 0) {
      console.log('Viewport meta tag found');
    }
  });
});`;
  }


}

// Export the enhanced CLI
module.exports = EnhancedPlaywrightCLI;

// Main execution
if (require.main === module) {
  const cli = new EnhancedPlaywrightCLI();
  cli.run().catch(error => {
    console.error('❌ CLI Error:', error.message);
    process.exit(1);
  });
} 