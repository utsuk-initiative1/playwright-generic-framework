# 📦 GitHub Packages Setup Guide

This guide will help you set up and use GitHub Packages for the Playwright Framework CLI tool.

## 🚀 What is GitHub Packages?

GitHub Packages is a package registry that allows you to host your packages privately or publicly on GitHub. It supports npm, Docker, Maven, NuGet, and other package formats.

## 📋 Setup Steps

### Step 1: Enable GitHub Packages

1. Go to your GitHub repository: `https://github.com/utsuk-initiative1/playwright-generic-framework`
2. Click **Settings** tab
3. Scroll down to **Features** section
4. Make sure **Packages** is enabled

### Step 2: Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name like "Playwright CLI Package"
4. Select scopes:
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `delete:packages` - Delete packages from GitHub Package Registry
5. Click **Generate token**
6. **Copy the token** (you'll need it for authentication)

### Step 3: Configure Authentication

#### Option A: Environment Variable (Recommended)
```bash
# Set the token as environment variable
export GITHUB_TOKEN=your_github_token_here

# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export GITHUB_TOKEN=your_github_token_here' >> ~/.zshrc
source ~/.zshrc
```

#### Option B: .npmrc File
Create a `.npmrc` file in your home directory:
```bash
# Create .npmrc file
cat > ~/.npmrc << EOF
@utsuk-initiative1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=your_github_token_here
EOF
```

## 🎯 Publishing the Package

### Automatic Publishing (GitHub Actions)
The package will be automatically published when you push to the main branch. The GitHub Actions workflow will:

1. Build the package
2. Publish to GitHub Packages
3. Create a GitHub release

### Manual Publishing
```bash
# Navigate to Playwright directory
cd Playwright

# Login to GitHub Packages
npm login --registry=https://npm.pkg.github.com --scope=@utsuk-initiative1

# Publish the package
npm publish
```

## 📦 Installing the Package

### Method 1: Using the Installation Script
```bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/utsuk-initiative1/playwright-generic-framework/main/Playwright/install-cli.sh | bash
```

### Method 2: Manual Installation
```bash
# Set your GitHub token
export GITHUB_TOKEN=your_github_token_here

# Install the package
npm install -g @utsuk-initiative1/playwright-framework-cli
```

### Method 3: Using .npmrc
```bash
# Create .npmrc for this installation
echo "@utsuk-initiative1:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc

# Install the package
npm install -g @utsuk-initiative1/playwright-framework-cli

# Clean up
rm .npmrc
```

## 🛠️ Using the CLI

After installation, you can use any of these commands:

```bash
# Main command
playwright-framework

# Short alias
pw-framework

# Branded command
utsuk-playwright
```

## 🔧 Package Configuration

The package is configured with:

- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)
- **Scope**: `@utsuk-initiative1`
- **Package Name**: `@utsuk-initiative1/playwright-framework-cli`
- **Visibility**: Private (by default)

## 📁 Package Contents

The GitHub Package includes:

- `enhanced-cli.js` - Main CLI executable
- `run-enhanced-cli.js` - Alternative runner
- `cli-templates/` - Template files
- `ENHANCED_CLI_README.md` - Detailed documentation
- `README.md` - Package documentation
- `CLI_README.md` - CLI-specific documentation
- `QUICK_START.md` - Quick start guide

## 🔄 Updating the Package

### Automatic Updates
- Push changes to main branch
- GitHub Actions will automatically publish new version
- Version is auto-incremented

### Manual Updates
```bash
# Update version
npm version patch  # or minor, major

# Publish to GitHub Packages
npm publish --registry=https://npm.pkg.github.com
```

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   # Make sure your token is set
   export GITHUB_TOKEN=your_github_token_here
   
   # Re-login to GitHub Packages
   npm login --registry=https://npm.pkg.github.com --scope=@utsuk-initiative1
   ```

2. **Package Not Found**
   ```bash
   # Check if package exists
   npm view @utsuk-initiative1/playwright-framework-cli --registry=https://npm.pkg.github.com
   ```

3. **Permission Denied**
   - Make sure you have access to the repository
   - Check if your token has the correct scopes
   - Verify you're a member of the organization

4. **GitHub Actions Fails**
   - Check if GitHub Packages is enabled
   - Verify the workflow has access to publish
   - Check the Actions logs for specific errors

### Debug Commands

```bash
# Check npm configuration
npm config list

# Check registry settings
npm config get registry

# View package details
npm view @utsuk-initiative1/playwright-framework-cli --registry=https://npm.pkg.github.com

# Check if logged in
npm whoami --registry=https://npm.pkg.github.com
```

## 🔒 Security

### Token Security
- Never commit your GitHub token to version control
- Use environment variables or .npmrc files
- Rotate tokens regularly
- Use minimal required scopes

### Package Security
- GitHub Packages are private by default
- Only repository members can access private packages
- You can make packages public if needed

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify GitHub Packages is enabled
3. Ensure your token has correct scopes
4. Check repository permissions

## 🎉 Success!

Once everything is set up:

- Every push to main will trigger automatic publishing
- Users can install your CLI tool from GitHub Packages
- Your framework will be accessible to your team/organization
- Private packages keep your code secure

---

**Package URL**: https://github.com/utsuk-initiative1/playwright-generic-framework/packages
