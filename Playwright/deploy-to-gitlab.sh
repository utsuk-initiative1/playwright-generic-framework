#!/bin/bash

# Enhanced Playwright CLI - GitLab Deployment Script
# This script helps you publish the CLI tool to GitLab registry

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Enhanced Playwright CLI - GitLab Deployment${NC}"
echo "=================================================="

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}📋 Checking dependencies...${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install Node.js and npm first.${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ git is not installed. Please install git first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies are installed${NC}"
}

# Get GitLab configuration
get_gitlab_config() {
    echo -e "${YELLOW}🔧 GitLab Configuration${NC}"
    
    # Get GitLab username
    read -p "Enter your GitLab username: " GITLAB_USERNAME
    
    # Get GitLab project ID
    read -p "Enter your GitLab project ID: " PROJECT_ID
    
    # Get GitLab token
    read -s -p "Enter your GitLab Personal Access Token: " GITLAB_TOKEN
    echo
    
    # Validate inputs
    if [ -z "$GITLAB_USERNAME" ] || [ -z "$PROJECT_ID" ] || [ -z "$GITLAB_TOKEN" ]; then
        echo -e "${RED}❌ All fields are required${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ GitLab configuration captured${NC}"
}

# Update package.json with GitLab details
update_package_json() {
    echo -e "${YELLOW}📦 Updating package.json...${NC}"
    
    # Create backup
    cp package.json package.json.backup
    
    # Update package name
    sed -i.bak "s/@your-gitlab-username/@$GITLAB_USERNAME/g" package.json
    
    # Update repository URL
    sed -i.bak "s|git+https://gitlab.com/your-gitlab-username/playwright-enhanced-cli.git|git+https://gitlab.com/$GITLAB_USERNAME/playwright-enhanced-cli.git|g" package.json
    
    # Update bugs URL
    sed -i.bak "s|https://gitlab.com/your-gitlab-username/playwright-enhanced-cli/issues|https://gitlab.com/$GITLAB_USERNAME/playwright-enhanced-cli/issues|g" package.json
    
    # Update homepage URL
    sed -i.bak "s|https://gitlab.com/your-gitlab-username/playwright-enhanced-cli#readme|https://gitlab.com/$GITLAB_USERNAME/playwright-enhanced-cli#readme|g" package.json
    
    # Update publish script
    sed -i.bak "s/YOUR_PROJECT_ID/$PROJECT_ID/g" package.json
    
    echo -e "${GREEN}✅ package.json updated${NC}"
}

# Update .npmrc with GitLab configuration
update_npmrc() {
    echo -e "${YELLOW}⚙️  Updating .npmrc...${NC}"
    
    # Create backup
    cp .npmrc .npmrc.backup
    
    # Update .npmrc with actual values
    sed -i.bak "s/your-gitlab-username/$GITLAB_USERNAME/g" .npmrc
    sed -i.bak "s/YOUR_PROJECT_ID/$PROJECT_ID/g" .npmrc
    
    echo -e "${GREEN}✅ .npmrc updated${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    
    npm install
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Login to GitLab registry
login_to_gitlab() {
    echo -e "${YELLOW}🔐 Logging in to GitLab registry...${NC}"
    
    # Set GitLab token as environment variable
    export GITLAB_TOKEN="$GITLAB_TOKEN"
    
    # Login to GitLab registry
    echo "$GITLAB_TOKEN" | npm login --registry=https://gitlab.com/api/v4/packages/npm/ --scope=@$GITLAB_USERNAME --auth-type=legacy
    
    echo -e "${GREEN}✅ Logged in to GitLab registry${NC}"
}

# Publish package
publish_package() {
    echo -e "${YELLOW}📤 Publishing package to GitLab...${NC}"
    
    # Publish to GitLab registry
    npm publish --registry=https://gitlab.com/api/v4/packages/npm/
    
    echo -e "${GREEN}✅ Package published successfully!${NC}"
}

# Create installation instructions
create_install_instructions() {
    echo -e "${YELLOW}📝 Creating installation instructions...${NC}"
    
    cat > INSTALL_INSTRUCTIONS.md << EOF
# Installation Instructions

## For Users

### 1. Set up GitLab registry access

\`\`\`bash
# Set your GitLab token
export GITLAB_TOKEN=your_gitlab_token_here

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export GITLAB_TOKEN=your_gitlab_token_here' >> ~/.zshrc
source ~/.zshrc
\`\`\`

### 2. Install the CLI tool

\`\`\`bash
# Install globally
npm install -g @$GITLAB_USERNAME/playwright-enhanced-cli

# Or install locally in a project
npm install @$GITLAB_USERNAME/playwright-enhanced-cli
\`\`\`

### 3. Use the CLI

\`\`\`bash
# Run the CLI
playwright-enhanced

# Or run directly
npx @$GITLAB_USERNAME/playwright-enhanced-cli
\`\`\`

## For Package Maintainers

### Update and republish

\`\`\`bash
# Update version in package.json
npm version patch  # or minor, major

# Publish to GitLab
npm run publish-gitlab
\`\`\`

## GitLab Registry URL

Package URL: https://gitlab.com/$GITLAB_USERNAME/playwright-enhanced-cli
Registry: https://gitlab.com/api/v4/packages/npm/
EOF
    
    echo -e "${GREEN}✅ Installation instructions created${NC}"
}

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    
    # Remove backup files
    rm -f package.json.bak .npmrc.bak
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main execution
main() {
    check_dependencies
    get_gitlab_config
    update_package_json
    update_npmrc
    install_dependencies
    login_to_gitlab
    publish_package
    create_install_instructions
    cleanup
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Share the INSTALL_INSTRUCTIONS.md with your team"
    echo "2. Users can now install your CLI tool using:"
    echo "   npm install -g @$GITLAB_USERNAME/playwright-enhanced-cli"
    echo ""
    echo -e "${BLUE}🔗 Package URL:${NC}"
    echo "https://gitlab.com/$GITLAB_USERNAME/playwright-enhanced-cli"
}

# Run main function
main "$@" 