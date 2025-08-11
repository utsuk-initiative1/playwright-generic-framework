# GitLab Registry Setup Guide

This guide will help you publish the Enhanced Playwright CLI tool to your GitLab registry so you can install it directly from your Mac terminal.

## 🚀 Quick Start

### Step 1: Create GitLab Personal Access Token

1. Go to GitLab → Settings → Access Tokens
2. Create a new token with the following scopes:
   - `read_api`
   - `write_packages`
   - `read_registry`
3. Copy the token (you'll need it later)

### Step 2: Create GitLab Project

1. Create a new project in GitLab
2. Note down your:
   - GitLab username
   - Project ID (found in project settings)

### Step 3: Run the Deployment Script

```bash
# Make sure you're in the Playwright directory
cd Playwright

# Run the deployment script
./deploy-to-gitlab.sh
```

The script will:
- Ask for your GitLab details
- Update package.json and .npmrc
- Install dependencies
- Login to GitLab registry
- Publish the package
- Create installation instructions

### Step 4: Install and Use

After successful deployment, you can install the CLI tool:

```bash
# Set your GitLab token
export GITLAB_TOKEN=your_gitlab_token_here

# Install globally
npm install -g @your-gitlab-username/playwright-enhanced-cli

# Use the CLI
playwright-enhanced
```

## 📋 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Update package.json

Replace `your-gitlab-username` with your actual GitLab username:

```json
{
  "name": "@your-gitlab-username/playwright-enhanced-cli",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "git+https://gitlab.com/your-gitlab-username/playwright-enhanced-cli.git"
  }
}
```

### 2. Update .npmrc

Replace placeholders with your actual values:

```ini
@your-gitlab-username:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=${GITLAB_TOKEN}
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Login to GitLab Registry

```bash
export GITLAB_TOKEN=your_gitlab_token_here
npm login --registry=https://gitlab.com/api/v4/packages/npm/ --scope=@your-gitlab-username
```

### 5. Publish Package

```bash
npm publish --registry=https://gitlab.com/api/v4/packages/npm/
```

## 🔧 Configuration Details

### Package Structure

The npm package includes:
- `enhanced-cli.js` - Main CLI executable
- `run-enhanced-cli.js` - Alternative runner
- `cli-templates/` - Template files
- `ENHANCED_CLI_README.md` - Detailed documentation
- `README.md` - Package documentation

### Bin Configuration

The package.json includes a `bin` field that makes the CLI globally accessible:

```json
{
  "bin": {
    "playwright-enhanced": "./enhanced-cli.js"
  }
}
```

### Files Included

The `files` field in package.json specifies which files are included in the npm package:

```json
{
  "files": [
    "enhanced-cli.js",
    "run-enhanced-cli.js",
    "cli-templates/",
    "ENHANCED_CLI_README.md",
    "README.md"
  ]
}
```

## 🎯 Usage Examples

### Install and Run

```bash
# Install globally
npm install -g @your-gitlab-username/playwright-enhanced-cli

# Run the CLI
playwright-enhanced

# Or run directly
npx @your-gitlab-username/playwright-enhanced-cli
```

### Example Session

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

## 🔄 Updating the Package

### For Package Updates

1. **Update version**:
   ```bash
   npm version patch  # or minor, major
   ```

2. **Publish update**:
   ```bash
   npm run publish-gitlab
   ```

### For Users

```bash
# Update the CLI tool
npm update -g @your-gitlab-username/playwright-enhanced-cli
```

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   # Make sure your token is set
   export GITLAB_TOKEN=your_gitlab_token_here
   
   # Re-login to registry
   npm login --registry=https://gitlab.com/api/v4/packages/npm/ --scope=@your-gitlab-username
   ```

2. **Permission Denied**
   ```bash
   # Make sure you have write access to the project
   # Check your GitLab project permissions
   ```

3. **Package Not Found**
   ```bash
   # Verify the package name is correct
   # Check if the package was published successfully
   npm view @your-gitlab-username/playwright-enhanced-cli
   ```

### Debug Commands

```bash
# Check npm configuration
npm config list

# Check registry settings
npm config get registry

# View package details
npm view @your-gitlab-username/playwright-enhanced-cli

# Check if logged in
npm whoami --registry=https://gitlab.com/api/v4/packages/npm/
```

## 📞 Support

If you encounter issues:

1. Check the GitLab project issues
2. Verify your GitLab token has the correct scopes
3. Ensure your project has package registry enabled
4. Check the npm registry configuration

## 🎉 Success!

Once deployed, your team can install and use the CLI tool with:

```bash
npm install -g @your-gitlab-username/playwright-enhanced-cli
playwright-enhanced
```

This will create a complete Playwright framework with all the advanced features we've built! 