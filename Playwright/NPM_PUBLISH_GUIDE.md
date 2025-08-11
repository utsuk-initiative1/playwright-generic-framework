# 📦 NPM Package Publishing Guide

This guide will help you set up automatic publishing of the Playwright Framework CLI to npm when you push changes to GitHub.

## 🚀 Quick Setup

### Step 1: Create NPM Account (if you don't have one)

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create NPM Access Token

1. Go to [npmjs.com](https://www.npmjs.com/) and sign in
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token**
4. Select **Automation** token type
5. Set expiration (recommend 90 days or longer)
6. Copy the token (you'll need it for GitHub)

### Step 3: Add NPM Token to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/utsuk-initiative1/playwright-generic-framework`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `NPM_TOKEN`
6. Value: Paste your npm access token
7. Click **Add secret**

### Step 4: Test the Setup

1. Make a small change to any CLI file
2. Commit and push to main branch
3. Check the **Actions** tab in GitHub
4. The workflow should automatically publish to npm

## 📋 Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# Navigate to Playwright directory
cd Playwright

# Login to npm
npm login

# Publish the package
npm publish --access public
```

## 🔧 Package Configuration

The package is configured with:

- **Name**: `@utsuk-initiative1/playwright-framework-cli`
- **Version**: Auto-incremented by GitHub Actions
- **Access**: Public (scoped package)
- **Bin commands**: 
  - `playwright-framework`
  - `pw-framework`
  - `utsuk-playwright`

## 📁 Included Files

The npm package includes:

- `enhanced-cli.js` - Main CLI executable
- `run-enhanced-cli.js` - Alternative runner
- `cli-templates/` - Template files
- `ENHANCED_CLI_README.md` - Detailed documentation
- `README.md` - Package documentation
- `CLI_README.md` - CLI-specific documentation
- `QUICK_START.md` - Quick start guide

## 🎯 Usage After Publishing

Once published, users can install and use:

```bash
# Install globally
npm install -g @utsuk-initiative1/playwright-framework-cli

# Use the CLI
playwright-framework
# or
pw-framework
# or
utsuk-playwright
```

## 🔄 Updating the Package

### Automatic Updates
- Push changes to main branch
- GitHub Actions will automatically publish new version
- Version is auto-incremented

### Manual Updates
```bash
# Update version
npm version patch  # or minor, major

# Publish
npm publish --access public
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied**
   - Make sure you're logged in to npm
   - Check if you have access to the package scope

2. **Package Already Exists**
   - Update the version number
   - Use `npm version patch` to increment

3. **GitHub Actions Fails**
   - Check if `NPM_TOKEN` secret is set correctly
   - Verify the token has publish permissions

4. **Package Name Conflict**
   - The scoped name `@utsuk-initiative1/playwright-framework-cli` should be unique
   - If conflict occurs, change the name in `package.json`

### Debug Commands

```bash
# Check npm configuration
npm config list

# Check if logged in
npm whoami

# View package details
npm view @utsuk-initiative1/playwright-framework-cli

# Test package locally
npm pack
```

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify npm token permissions
3. Ensure package name is available
4. Check npm account status

## 🎉 Success!

Once everything is set up:

- Every push to main will trigger automatic publishing
- Users can install your CLI tool globally
- Your framework will be easily accessible to the community

---

**Package URL**: https://www.npmjs.com/package/@utsuk-initiative1/playwright-framework-cli
