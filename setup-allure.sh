#!/bin/bash

# 🎭 Allure Report Setup Script
# This script sets up Allure reporting for all automation frameworks

set -e

echo "🎭 Setting up Allure Reporting for Automation Frameworks"
echo "========================================================"

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
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_success "Node.js is installed: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm is installed: $(npm --version)"
}

# Install Allure command line tool
install_allure_cli() {
    print_status "Installing Allure command line tool..."
    
    # Check if allure is already installed
    if command -v allure &> /dev/null; then
        print_success "Allure CLI is already installed: $(allure --version)"
        return
    fi
    
    # Install allure commandline globally
    npm install -g allure-commandline
    
    if command -v allure &> /dev/null; then
        print_success "Allure CLI installed successfully: $(allure --version)"
    else
        print_error "Failed to install Allure CLI"
        exit 1
    fi
}

# Install Allure dependencies for each framework
install_allure_dependencies() {
    print_status "Installing Allure dependencies for all frameworks..."
    
    # List of framework directories
    frameworks=(
        "Playwright"
        "Mobile-Grace"
        "Grace-android"
        "mobile"
        "playwright-automation"
        "default/aiii-regre"
    )
    
    for framework in "${frameworks[@]}"; do
        if [ -d "$framework" ]; then
            print_status "Installing dependencies for $framework..."
            cd "$framework"
            
            # Install allure-playwright if package.json exists
            if [ -f "package.json" ]; then
                npm install allure-playwright@^2.9.0 --save-dev
                print_success "Installed allure-playwright for $framework"
            fi
            
            # Create allure-results directory
            mkdir -p allure-results
            print_success "Created allure-results directory for $framework"
            
            cd ..
        else
            print_warning "Framework directory $framework not found, skipping..."
        fi
    done
}

# Update Playwright configurations
update_playwright_configs() {
    print_status "Updating Playwright configurations to include Allure reporter..."
    
    frameworks=(
        "Playwright"
        "Mobile-Grace"
        "Grace-android"
        "mobile"
        "playwright-automation"
        "default/aiii-regre"
    )
    
    for framework in "${frameworks[@]}"; do
        if [ -d "$framework" ] && [ -f "$framework/playwright.config.ts" ]; then
            print_status "Updating playwright.config.ts for $framework..."
            
            # Create backup
            cp "$framework/playwright.config.ts" "$framework/playwright.config.ts.backup"
            
            # Update the config to include allure reporter
            sed -i.bak 's/reporter: \[/reporter: [\n    [\"allure-playwright\", { outputFolder: \"allure-results\" }],/' "$framework/playwright.config.ts"
            
            print_success "Updated playwright.config.ts for $framework"
        fi
    done
}

# Create Allure configuration files
create_allure_configs() {
    print_status "Creating Allure configuration files..."
    
    frameworks=(
        "Playwright"
        "Mobile-Grace"
        "Grace-android"
        "mobile"
        "playwright-automation"
        "default/aiii-regre"
    )
    
    for framework in "${frameworks[@]}"; do
        if [ -d "$framework" ]; then
            print_status "Creating allure configuration for $framework..."
            
            # Create allure.config.js
            cat > "$framework/allure.config.js" << EOF
module.exports = {
  resultsDir: './allure-results',
  reportDir: './allure-report',
  clean: true,
  port: 0
};
EOF
            
            print_success "Created allure.config.js for $framework"
        fi
    done
}

# Add npm scripts for Allure
add_npm_scripts() {
    print_status "Adding Allure npm scripts to package.json files..."
    
    frameworks=(
        "Playwright"
        "Mobile-Grace"
        "Grace-android"
        "mobile"
        "playwright-automation"
        "default/aiii-regre"
    )
    
    for framework in "${frameworks[@]}"; do
        if [ -d "$framework" ] && [ -f "$framework/package.json" ]; then
            print_status "Adding Allure scripts to $framework/package.json..."
            
            # Create backup
            cp "$framework/package.json" "$framework/package.json.backup"
            
            # Add allure scripts using node
            node -e "
                const fs = require('fs');
                const path = '$framework/package.json';
                const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
                
                if (!pkg.scripts) pkg.scripts = {};
                
                pkg.scripts['test:allure'] = 'playwright test --reporter=allure-playwright';
                pkg.scripts['allure:generate'] = 'allure generate allure-results --clean -o allure-report';
                pkg.scripts['allure:open'] = 'allure open allure-report';
                pkg.scripts['allure:serve'] = 'allure serve allure-results';
                pkg.scripts['allure:report'] = 'npm run allure:generate && npm run allure:open';
                
                fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
            "
            
            print_success "Added Allure scripts to $framework"
        fi
    done
}

# Create test script for Allure
create_test_script() {
    print_status "Creating Allure test script..."
    
    cat > "test-allure.sh" << 'EOF'
#!/bin/bash

# 🎭 Allure Test Runner Script
# This script runs tests with Allure reporting for all frameworks

set -e

echo "🎭 Running Tests with Allure Reporting"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# List of framework directories
frameworks=(
    "Playwright"
    "Mobile-Grace"
    "Grace-android"
    "mobile"
    "playwright-automation"
    "default/aiii-regre"
)

for framework in "${frameworks[@]}"; do
    if [ -d "$framework" ]; then
        print_status "Running tests for $framework..."
        cd "$framework"
        
        if [ -f "package.json" ]; then
            # Run tests with Allure reporter
            npm run test:allure || print_status "Some tests failed in $framework, continuing..."
            
            # Generate Allure report
            npm run allure:generate || print_status "Failed to generate report for $framework"
            
            print_success "Completed testing for $framework"
        else
            print_status "No package.json found in $framework, skipping..."
        fi
        
        cd ..
    else
        print_status "Framework directory $framework not found, skipping..."
    fi
done

print_success "All tests completed! Check individual allure-report directories for results."
EOF

    chmod +x test-allure.sh
    print_success "Created test-allure.sh script"
}

# Create unified Allure report script
create_unified_report_script() {
    print_status "Creating unified Allure report script..."
    
    cat > "generate-unified-allure-report.sh" << 'EOF'
#!/bin/bash

# 🎭 Unified Allure Report Generator
# This script generates a unified Allure report from all frameworks

set -e

echo "🎭 Generating Unified Allure Report"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Create unified allure-results directory
mkdir -p unified-allure-results

# List of framework directories
frameworks=(
    "Playwright"
    "Mobile-Grace"
    "Grace-android"
    "mobile"
    "playwright-automation"
    "default/aiii-regre"
)

# Copy allure results from all frameworks
for framework in "${frameworks[@]}"; do
    if [ -d "$framework/allure-results" ]; then
        print_status "Copying results from $framework..."
        cp -r "$framework/allure-results"/* unified-allure-results/ 2>/dev/null || true
    fi
done

# Generate unified report
print_status "Generating unified Allure report..."
allure generate unified-allure-results --clean -o unified-allure-report

print_success "Unified Allure report generated!"
print_success "Report location: ./unified-allure-report/index.html"

# Ask if user wants to open the report
read -p "Open unified Allure report in browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    allure open unified-allure-report
fi
EOF

    chmod +x generate-unified-allure-report.sh
    print_success "Created generate-unified-allure-report.sh script"
}

# Main execution
main() {
    print_status "Starting Allure setup process..."
    
    check_node
    check_npm
    install_allure_cli
    install_allure_dependencies
    update_playwright_configs
    create_allure_configs
    add_npm_scripts
    create_test_script
    create_unified_report_script
    
    print_success "🎉 Allure setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Run tests: ./test-allure.sh"
    echo "2. Generate unified report: ./generate-unified-allure-report.sh"
    echo "3. Open individual reports: cd <framework> && npm run allure:open"
    echo "4. Use enhanced CLI: node Playwright/enhanced-cli.js -> Generate test reports"
    echo ""
    print_status "Available commands:"
    echo "- npm run test:allure     # Run tests with Allure"
    echo "- npm run allure:generate # Generate Allure report"
    echo "- npm run allure:open     # Open Allure report"
    echo "- npm run allure:serve    # Serve Allure report"
    echo "- npm run allure:report   # Generate and open report"
}

# Run main function
main "$@"
