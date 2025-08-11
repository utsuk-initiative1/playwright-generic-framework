#!/bin/bash

# Playwright Framework Installation Script for Mac
# This script installs and sets up the complete Playwright test automation framework

echo "🚀 Starting Playwright Framework Installation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/en/download/"
    echo "Or install via Homebrew: brew install node"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Check if Homebrew is installed (recommended for Mac)
print_status "Checking Homebrew installation..."
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew is not installed. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    print_success "Homebrew installed successfully"
else
    BREW_VERSION=$(brew --version | head -n 1)
    print_success "Homebrew version: $BREW_VERSION"
fi

# Install system dependencies
print_status "Installing system dependencies..."
brew install git

# Create project directory (if not exists)
PROJECT_DIR="playwright-automation-framework"
if [ ! -d "$PROJECT_DIR" ]; then
    print_status "Creating project directory: $PROJECT_DIR"
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
else
    print_warning "Project directory already exists. Using existing directory."
    cd "$PROJECT_DIR"
fi

# Initialize npm project
print_status "Initializing npm project..."
npm init -y

# Install Playwright and dependencies
print_status "Installing Playwright and core dependencies..."
npm install playwright
npm install @playwright/test

# Install additional dependencies
print_status "Installing additional dependencies..."
npm install typescript
npm install ts-node
npm install dotenv
npm install winston
npm install chalk
npm install moment
npm install fs-extra
npm install @types/node
npm install @types/fs-extra

# Install development dependencies
print_status "Installing development dependencies..."
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev @typescript-eslint/parser
npm install --save-dev eslint
npm install --save-dev prettier
npm install --save-dev husky
npm install --save-dev lint-staged

# Install Playwright browsers
print_status "Installing Playwright browsers..."
npx playwright install

# Install Playwright browsers for different platforms (optional)
print_status "Installing additional browser platforms..."
npx playwright install-deps

# Create basic project structure
print_status "Creating project structure..."
mkdir -p src/{pages,tests,utils,config}
mkdir -p reports
mkdir -p screenshots
mkdir -p videos
mkdir -p downloads

# Create basic configuration files
print_status "Creating configuration files..."

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@pages/*": ["src/pages/*"],
      "@tests/*": ["src/tests/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports",
    "screenshots",
    "videos"
  ]
}
EOF

# Create playwright.config.ts
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
EOF

# Create .env file
cat > .env << 'EOF'
# Environment Configuration
BASE_URL=https://example.com
BROWSER=chromium
HEADLESS=false
SLOW_MO=1000
TIMEOUT=30000
RETRIES=2

# Test Configuration
PARALLEL=true
WORKERS=4
REPORTER=html,json,junit

# Screenshot and Video
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true

# API Configuration
API_BASE_URL=https://api.example.com
API_TIMEOUT=10000

# Database Configuration (if needed)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=testuser
DB_PASSWORD=testpass
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Test results
test-results/
playwright-report/
reports/
screenshots/
videos/
downloads/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Coverage
coverage/
.nyc_output/

# Temporary files
tmp/
temp/
EOF

# Create package.json scripts
print_status "Updating package.json with scripts..."
npm pkg set scripts.test="playwright test"
npm pkg set scripts.test:headed="playwright test --headed"
npm pkg set scripts.test:debug="playwright test --debug"
npm pkg set scripts.test:ui="playwright test --ui"
npm pkg set scripts.test:codegen="playwright codegen"
npm pkg set scripts.install:browsers="playwright install"
npm pkg set scripts.show:report="playwright show-report"
npm pkg set scripts.lint="eslint src/**/*.ts"
npm pkg set scripts.lint:fix="eslint src/**/*.ts --fix"
npm pkg set scripts.format="prettier --write src/**/*.ts"
npm pkg set scripts.type-check="tsc --noEmit"

# Create basic test file
print_status "Creating sample test file..."
mkdir -p src/tests
cat > src/tests/example.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Example Test Suite', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should have basic structure', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
EOF

# Create basic page object
print_status "Creating sample page object..."
mkdir -p src/pages
cat > src/pages/BasePage.ts << 'EOF'
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
EOF

# Create utility file
print_status "Creating utility file..."
mkdir -p src/utils
cat > src/utils/helpers.ts << 'EOF'
import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async clickElement(page: Page, selector: string) {
    await page.click(selector);
  }

  static async typeText(page: Page, selector: string, text: string) {
    await page.fill(selector, text);
  }

  static async getText(page: Page, selector: string) {
    return await page.textContent(selector);
  }
}
EOF

# Create README
print_status "Creating README file..."
cat > README.md << 'EOF'
# Playwright Test Automation Framework

A comprehensive test automation framework built with Playwright, TypeScript, and modern development tools.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Generate test code
npm run test:codegen
```

### Available Scripts
- `npm test` - Run all tests
- `npm run test:headed` - Run tests in headed mode
- `npm run test:debug` - Run tests in debug mode
- `npm run test:ui` - Run tests with UI mode
- `npm run test:codegen` - Generate test code
- `npm run install:browsers` - Install Playwright browsers
- `npm run show:report` - Show test report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure
```
src/
├── pages/          # Page Object Models
├── tests/          # Test files
├── utils/          # Utility functions
└── config/         # Configuration files
```

## 🔧 Configuration
- `playwright.config.ts` - Playwright configuration
- `.env` - Environment variables
- `tsconfig.json` - TypeScript configuration

## 📊 Reporting
Test reports are generated in the `reports/` directory:
- HTML report
- JSON report
- JUnit XML report

## 🐛 Debugging
- Use `npm run test:debug` for step-by-step debugging
- Use `npm run test:ui` for interactive test running
- Screenshots and videos are saved on test failures

## 📝 Best Practices
1. Use Page Object Model pattern
2. Write descriptive test names
3. Use data-driven testing
4. Implement proper error handling
5. Use environment variables for configuration
6. Follow TypeScript best practices

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.
EOF

# Set up Git repository
print_status "Initializing Git repository..."
git init
git add .
git commit -m "Initial commit: Playwright framework setup"

# Final setup
print_status "Finalizing setup..."

# Make scripts executable
chmod +x node_modules/.bin/*

print_success "🎉 Playwright Framework Installation Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. cd $PROJECT_DIR"
echo "2. npm run install:browsers"
echo "3. npm test"
echo ""
echo "📚 Documentation:"
echo "- Framework README: README.md"
echo "- Playwright Docs: https://playwright.dev/"
echo "- TypeScript Docs: https://www.typescriptlang.org/"
echo ""
echo "🔧 Available Commands:"
echo "- npm test (run all tests)"
echo "- npm run test:headed (run with browser visible)"
echo "- npm run test:ui (interactive mode)"
echo "- npm run test:debug (debug mode)"
echo "- npm run test:codegen (generate tests)"
echo ""
print_success "Happy testing! 🚀" 