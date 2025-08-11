# 🚀 Playwright Framework CLI

A comprehensive CLI tool to set up Playwright automation frameworks with AI-powered test generation, accessibility testing, and advanced features.

## 📦 Installation

```bash
# Install globally
npm install -g @utsuk-initiative1/playwright-framework-cli

# Or install locally in a project
npm install @utsuk-initiative1/playwright-framework-cli
```

## 🎯 Usage

After installation, you can use any of these commands:

```bash
# Main command
playwright-framework

# Short alias
pw-framework

# Branded command
utsuk-playwright
```

## 🚀 Quick Start

```bash
# Install the CLI
npm install -g @utsuk-initiative1/playwright-framework-cli

# Run the CLI
playwright-framework

# Follow the interactive prompts to set up your framework
```

## ✨ Features

### 🎯 Interactive Project Setup
- Guided project creation with multiple templates
- Customizable framework configuration
- Environment-specific settings

### 🤖 AI-Powered Test Generation
- Generate tests using Gemini AI
- Smart test case creation
- Automated test data generation

### ♿ Accessibility Testing
- Built-in accessibility testing modules
- WCAG compliance checking
- Screen reader compatibility tests

### 📊 Performance Testing
- Lighthouse integration
- Performance benchmarking
- Load testing capabilities

### 📱 Mobile Testing
- Mobile device simulation
- Touch gesture testing
- Responsive design validation

### 🔍 Visual Regression Testing
- Screenshot comparison
- Baseline management
- Visual diff reporting

### 🧪 API Testing
- REST API testing
- GraphQL support
- API documentation generation

### 📈 Comprehensive Reporting
- HTML reports
- JSON output
- Custom report formats

## 🏗️ Framework Templates

### 1. Basic Template
- Essential Playwright setup
- Basic test structure
- Minimal configuration

### 2. Standard Template
- Full testing framework
- Page Object Model
- Common test utilities

### 3. Enterprise Template
- Advanced features
- CI/CD integration
- Comprehensive reporting

### 4. Mobile Template
- Mobile-specific testing
- Touch interactions
- Device simulation

## 🛠️ CLI Commands

```bash
# Create a new project
playwright-framework

# With AI test generation
playwright-framework --api-key=your_gemini_api_key

# Specify AI model
playwright-framework --api-key=your_key --ai-model=gemini-1.5sh

# Show help
playwright-framework --help
```

## 📁 Generated Project Structure

```
your-project/
├── framework/
│   ├── config/
│   │   ├── EnvironmentConfig.ts
│   │   └── runner.config.ts
│   ├── core/
│   │   ├── BasePage.ts
│   │   ├── BasePageObject.ts
│   │   └── TestBase.ts
│   ├── interactions/
│   │   ├── Accessibility.ts
│   │   ├── BrowserActions.ts
│   │   ├── Click.ts
│   │   ├── Dropdown.ts
│   │   ├── Elements.ts
│   │   ├── Scroll.ts
│   │   ├── Type.ts
│   │   ├── Wait.ts
│   │   ├── WindowHandler.ts
│   │   └── index.ts
│   ├── utils/
│   │   └── Utilities.ts
│   └── constants/
│       └── Constants.ts
├── tests/
│   ├── smoke/
│   ├── regression/
│   ├── e2e/
│   ├── accessibility/
│   ├── performance/
│   ├── api/
│   ├── visual/
│   └── mobile/
├── data/
│   └── test-data.json
├── fixtures/
│   └── sample-data.json
├── baseline-screenshots/
├── reports/
├── ci-cd/
├── dashboard/
├── playwright.config.ts
├── framework.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 Configuration Options

### Environment Configuration
- Local, staging, and production environments
- Environment-specific URLs and credentials
- Custom configuration per environment

### Test Configuration
- Browser selection (Chrome, Firefox, Safari, Edge)
- Mobile device simulation
- Parallel test execution
- Retry mechanisms

### AI Configuration
- Gemini API integration
- Custom AI models
- Test generation parameters
- AI prompt customization

## 📊 Reporting Features

### HTML Reports
- Interactive test results
- Screenshot galleries
- Performance metrics
- Accessibility violations

### JSON Reports
- Machine-readable output
- CI/CD integration
- Custom report processing

### Dashboard
- Real-time test monitoring
- Historical data analysis
- Performance trends
- Team collaboration

## 🚀 CI/CD Integration

### GitHub Actions
- Automated testing
- Parallel execution
- Artifact management
- Slack notifications

### GitLab CI
- Pipeline integration
- Docker support
- Artifact storage
- Merge request validation

### Jenkins
- Pipeline scripts
- Multi-branch support
- Test result analysis
- Deployment integration

## 📚 Documentation

- [CLI README](./CLI_README.md) - Detailed CLI documentation
- [Quick Start Guide](./QUICK_START.md) - Step-by-step setup
- [Enhanced CLI README](./ENHANCED_CLI_README.md) - Advanced features
- [Framework Documentation](./docs/README.md) - Framework usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details

## 🆘 Support

- [GitHub Issues](https://github.com/utsuk-initiative1/playwright-generic-framework/issues)
- [Documentation](./docs/README.md)
- [Examples](./sample-tests/)

## 🎉 Acknowledgments

- Playwright team for the amazing testing framework
- Google Gemini for AI-powered test generation
- The open-source community for contributions

---

**Made with ❤️ by Utsuk Initiative**
