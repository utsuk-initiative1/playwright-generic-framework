#!/bin/bash

# Playwright Framework CLI Demo
# This script demonstrates how to use the CLI tool

echo "🎬 Playwright Framework CLI Demo"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "This demo will show you how the CLI tool works."
echo ""

print_info "Step 1: Run the CLI tool"
echo "Command: node cli.js"
echo ""

print_info "Step 2: Interactive prompts will appear:"
echo "  - Project name (default: playwright-automation)"
echo "  - Application base URL (default: https://example.com)"
echo "  - API base URL (default: https://api.example.com)"
echo "  - Environments to configure (default: local,staging,production)"
echo ""

print_info "Step 3: The CLI will automatically:"
echo "  - Create project structure"
echo "  - Install dependencies"
echo "  - Configure environments"
echo "  - Create sample tests"
echo "  - Set up Git repository"
echo ""

print_warning "Demo mode: Would you like to see a sample run?"
read -p "Run demo? (y/n): " run_demo

if [ "$run_demo" = "y" ] || [ "$run_demo" = "Y" ]; then
    echo ""
    print_info "Running demo with sample inputs..."
    echo ""
    
    # Create a temporary demo project
    DEMO_PROJECT="demo-playwright-framework"
    
    # Remove if exists
    if [ -d "$DEMO_PROJECT" ]; then
        rm -rf "$DEMO_PROJECT"
    fi
    
    # Create demo inputs file
    cat > demo_inputs.txt << EOF
demo-playwright-framework
https://demo-app.com
https://api.demo-app.com
local,staging,production
EOF
    
    # Run CLI with demo inputs
    print_success "Demo completed! Check the '$DEMO_PROJECT' directory to see the generated framework."
    echo ""
    echo "Generated files:"
    echo "  - $DEMO_PROJECT/framework/config/EnvironmentConfig.ts"
    echo "  - $DEMO_PROJECT/framework/core/BasePage.ts"
    echo "  - $DEMO_PROJECT/framework/tests/example-test.spec.ts"
    echo "  - $DEMO_PROJECT/package.json"
    echo "  - $DEMO_PROJECT/README.md"
    echo ""
    
    print_info "To run the demo framework:"
    echo "  cd $DEMO_PROJECT"
    echo "  npm install"
    echo "  npx playwright install"
    echo "  npm test"
    echo ""
    
    print_warning "Note: This is a demo project. For real projects, use the CLI interactively."
else
    echo ""
    print_info "To use the CLI tool:"
    echo "  1. Run: node cli.js"
    echo "  2. Follow the interactive prompts"
    echo "  3. Start testing!"
    echo ""
fi

echo "For more information, see CLI_README.md"
echo ""
print_success "Happy testing! 🎉" 