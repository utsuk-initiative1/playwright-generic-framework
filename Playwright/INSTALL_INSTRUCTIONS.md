# Installation Instructions for @madukar14/playwright-enhanced-cli

## 🚀 Quick Installation

### Prerequisites
1. Node.js (version 16 or higher)
2. GitLab Personal Access Token with `read_api`, `write_packages`, and `read_registry` scopes

### Step 1: Set up GitLab Registry Access

```bash
# Set your GitLab token
export GITLAB_TOKEN=your_gitlab_token_here

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export GITLAB_TOKEN=your_gitlab_token_here' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: Install the CLI Tool

```bash
# Install globally
npm install -g @madukar14/playwright-enhanced-cli

# Or install locally in a project
npm install @madukar14/playwright-enhanced-cli
```

### Step 3: Use the CLI

```bash
# Run the CLI
playwright-enhanced

# Or run directly
npx @madukar14/playwright-enhanced-cli
```

## 📋 Configuration

### .npmrc Configuration

Create or update your `.npmrc` file:

```ini
@madukar14:registry=https://gitlab.com/api/v4/projects/70779677/packages/npm/
//gitlab.com/api/v4/projects/70779677/packages/npm/:_authToken=${GITLAB_TOKEN}
```

### Environment Variables

```bash
# Required
export GITLAB_TOKEN=your_gitlab_token_here

# Optional: Set npm registry
export npm_config_registry=https://gitlab.com/api/v4/projects/70779677/packages/npm/
```

## 🎯 Usage Examples

### Create a New Project

```bash
$ playwright-enhanced

🎯 Enhanced Playwright Framework CLI
=====================================

🚀 Starting Enhanced Playwright Framework Setup...

📝 Project Setup

Enter project name: my-test-project
Enter the web URL to test (e.g., https://example.com): https://www.example.com
🌐 Target URL: https://www.example.com
✅ Created project directory: my-test-project
📁 Working directory changed to: my-test-project
📁 Creating project structure...
✅ Created directory: framework/config
✅ Created directory: framework/core
✅ Created directory: framework/interactions
...

✅ Enhanced Playwright Framework setup completed successfully!

🚀 Next steps:
   1. cd my-test-project
   2. npm install
   3. npm run test
   4. Check the generated documentation
```

### Available Commands

The CLI provides several options:
1. 🚀 Create new project
2. 🔧 Add features to existing project
3. 📊 Generate test reports
4. 🔄 Update framework
5. 📚 Show documentation

## 🔧 Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Ensure your GitLab token has the correct scopes
   - Check that the token is not expired

2. **404 Not Found Error**
   - Verify the package name is correct: `@madukar14/playwright-enhanced-cli`
   - Check that the package was published successfully

3. **Authentication Issues**
   - Make sure `GITLAB_TOKEN` environment variable is set
   - Verify the token has the required permissions

### Debug Commands

```bash
# Check npm configuration
npm config list

# Check GitLab authentication
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" "https://gitlab.com/api/v4/user"

# List available packages
npm search @madukar14/playwright-enhanced-cli --registry=https://gitlab.com/api/v4/projects/70779677/packages/npm/
```

## 📦 Package Information

- **Package Name**: `@madukar14/playwright-enhanced-cli`
- **Version**: 1.0.0
- **Registry**: GitLab Project Registry
- **Project ID**: 70779677
- **GitLab Username**: madukar14

## 🔄 Updating the Package

### For Package Maintainers

```bash
# Update version
npm version patch  # or minor, major

# Publish to GitLab
npm publish --registry=https://gitlab.com/api/v4/projects/70779677/packages/npm/
```

### For Users

```bash
# Update to latest version
npm update -g @madukar14/playwright-enhanced-cli

# Install specific version
npm install -g @madukar14/playwright-enhanced-cli@1.0.0
```

## 📚 Documentation

- **Main Documentation**: `ENHANCED_CLI_README.md`
- **Quick Start**: `QUICK_START.md`
- **GitLab Setup**: `GITLAB_SETUP_GUIDE.md`

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the documentation files
3. Verify your GitLab token permissions
4. Ensure you're using the correct registry URL

## 🔗 Links

- **GitLab Project**: https://gitlab.com/madukar14/playwright-enhanced-cli
- **Package Registry**: https://gitlab.com/api/v4/projects/70779677/packages/npm/
- **Issues**: https://gitlab.com/madukar14/playwright-enhanced-cli/issues 