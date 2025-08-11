# 🚀 Quick Reference - Playwright Framework CLI

## ⚡ One-Line Installation

```bash
curl -fsSL https://raw.githubusercontent.com/utsuk-initiative1/playwright-generic-framework/main/Playwright/install-cli.sh | bash
```

## 🔑 Setup GitHub Token

```bash
# Get token from: https://github.com/settings/tokens
export GITHUB_TOKEN=your_github_token_here
```

## 🎯 Essential Commands

```bash
# Install CLI
npm install -g @utsuk-initiative1/playwright-framework-cli

# Create new project
playwright-framework

# Run with AI features
playwright-framework --api-key=your_gemini_api_key

# Show help
playwright-framework --help
```

## 🏗️ Project Setup

```bash
# 1. Run CLI
playwright-framework

# 2. Follow prompts (name, URL, template, features)

# 3. Navigate to project
cd your-project-name

# 4. Install dependencies
npm install

# 5. Install browsers
npx playwright install

# 6. Run tests
npm test
```

## 🧪 Test Commands

```bash
npm test                    # All tests
npm run test:ui            # With UI
npm run test:smoke         # Smoke tests
npm run test:regression    # Regression tests
npm run test:e2e           # E2E tests
npm run test:accessibility # Accessibility tests
npm run test:performance   # Performance tests
npm run test:api           # API tests
npm run test:visual        # Visual tests
npm run test:mobile        # Mobile tests
```

## 🔧 Configuration Files

- `playwright.config.ts` - Playwright settings
- `framework.config.ts` - Framework configuration
- `framework/config/EnvironmentConfig.ts` - Environment URLs
- `tsconfig.json` - TypeScript settings

## 📊 Reports & Analytics

```bash
npm run report             # Show HTML report
npm run dashboard          # Start dashboard
npx playwright show-report # Open latest report
```

## 🛠️ Troubleshooting

```bash
# Permission issues
sudo chown -R $USER /usr/local/lib/node_modules

# Package not found
export GITHUB_TOKEN=your_token
npm install -g @utsuk-initiative1/playwright-framework-cli

# Update CLI
npm update -g @utsuk-initiative1/playwright-framework-cli
```

## 📞 Support

- **Documentation**: `TEAM_SETUP_GUIDE.md`
- **Repository**: https://github.com/utsuk-initiative1/playwright-generic-framework
- **Issues**: https://github.com/utsuk-initiative1/playwright-generic-framework/issues

---

**Remember**: Always set your `GITHUB_TOKEN` before installing! 🔑
