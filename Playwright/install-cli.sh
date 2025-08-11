#!/bin/bash

# Playwright Framework CLI Installation Script
# This script installs the CLI tool globally from GitHub Packages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Playwright Framework CLI - Installation${NC}"
echo "=============================================="

# Check if Node.js is installed
check_node() {
    echo -e "${YELLOW}📋 Checking Node.js installation...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js and npm are installed${NC}"
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
}

# Setup GitHub Packages authentication
setup_github_packages() {
    echo -e "${YELLOW}🔐 Setting up GitHub Packages authentication...${NC}"
    
    # Check if GITHUB_TOKEN is set
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GITHUB_TOKEN environment variable not set.${NC}"
        echo "You can set it with: export GITHUB_TOKEN=your_github_token"
        echo "Or create a .npmrc file manually with your GitHub token."
        echo ""
        echo "To get a GitHub token:"
        echo "1. Go to GitHub → Settings → Developer settings → Personal access tokens"
        echo "2. Generate a new token with 'read:packages' scope"
        echo "3. Set it as: export GITHUB_TOKEN=your_token"
        echo ""
        read -p "Do you want to continue without setting up authentication? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✅ GITHUB_TOKEN is set${NC}"
    fi
}

# Install the CLI tool
install_cli() {
    echo -e "${YELLOW}📦 Installing Playwright Framework CLI from GitHub Packages...${NC}"
    
    # Create temporary .npmrc for installation
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "@utsuk-initiative1:registry=https://npm.pkg.github.com" > /tmp/.npmrc
        echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> /tmp/.npmrc
        
        # Install using the temporary .npmrc
        npm install -g @utsuk-initiative1/playwright-framework-cli --userconfig /tmp/.npmrc
        
        # Clean up
        rm /tmp/.npmrc
    else
        # Try to install without authentication (will work if package is public)
        npm install -g @utsuk-initiative1/playwright-framework-cli
    fi
    
    echo -e "${GREEN}✅ CLI tool installed successfully!${NC}"
}

# Verify installation
verify_installation() {
    echo -e "${YELLOW}🔍 Verifying installation...${NC}"
    
    if command -v playwright-framework &> /dev/null; then
        echo -e "${GREEN}✅ playwright-framework command is available${NC}"
    else
        echo -e "${RED}❌ playwright-framework command not found${NC}"
        exit 1
    fi
    
    if command -v pw-framework &> /dev/null; then
        echo -e "${GREEN}✅ pw-framework command is available${NC}"
    else
        echo -e "${RED}❌ pw-framework command not found${NC}"
        exit 1
    fi
    
    if command -v utsuk-playwright &> /dev/null; then
        echo -e "${GREEN}✅ utsuk-playwright command is available${NC}"
    else
        echo -e "${RED}❌ utsuk-playwright command not found${NC}"
        exit 1
    fi
}

# Show usage instructions
show_usage() {
    echo -e "${BLUE}📚 Usage Instructions${NC}"
    echo "===================="
    echo ""
    echo "You can now use any of these commands:"
    echo ""
    echo "  playwright-framework  - Main command"
    echo "  pw-framework          - Short alias"
    echo "  utsuk-playwright      - Branded command"
    echo ""
    echo "Examples:"
    echo "  playwright-framework                    # Start interactive setup"
    echo "  playwright-framework --help            # Show help"
    echo "  playwright-framework --api-key=YOUR_KEY # With AI features"
    echo ""
    echo "For more information, visit:"
    echo "https://github.com/utsuk-initiative1/playwright-generic-framework"
}

# Main execution
main() {
    check_node
    setup_github_packages
    install_cli
    verify_installation
    show_usage
    
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready to create your Playwright framework!${NC}"
    echo "Run: playwright-framework"
}

# Run main function
main "$@"
