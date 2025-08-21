#!/bin/bash

# Mobile Automation Framework Setup Script
# This script sets up the complete mobile automation environment

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 16 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 16 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version | cut -d'.' -f1)
        if [ "$NPM_VERSION" -ge 8 ]; then
            print_success "npm version $(npm --version) is compatible"
            return 0
        else
            print_error "npm version $(npm --version) is too old. Please install npm 8 or higher."
            return 1
        fi
    else
        print_error "npm is not installed. Please install npm 8 or higher."
        return 1
    fi
}

# Function to check Java installation
check_java() {
    if command_exists java; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 8 ]; then
            print_success "Java version $(java -version 2>&1 | head -n 1) is compatible"
            return 0
        else
            print_error "Java version is too old. Please install Java 8 or higher."
            return 1
        fi
    else
        print_error "Java is not installed. Please install Java 8 or higher."
        return 1
    fi
}

# Function to check Android SDK
check_android_sdk() {
    if [ -n "$ANDROID_HOME" ]; then
        if [ -d "$ANDROID_HOME" ]; then
            print_success "Android SDK found at $ANDROID_HOME"
            return 0
        else
            print_error "ANDROID_HOME is set but directory does not exist: $ANDROID_HOME"
            return 1
        fi
    else
        print_warning "ANDROID_HOME is not set. Android testing will not be available."
        return 1
    fi
}

# Function to check Xcode (macOS only)
check_xcode() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists xcode-select; then
            if xcode-select -p >/dev/null 2>&1; then
                print_success "Xcode Command Line Tools are installed"
                return 0
            else
                print_error "Xcode Command Line Tools are not installed. Run: xcode-select --install"
                return 1
            fi
        else
            print_error "Xcode is not installed. Please install Xcode from the App Store."
            return 1
        fi
    else
        print_warning "Xcode check skipped (not on macOS)"
        return 0
    fi
}

# Function to install Appium
install_appium() {
    print_status "Installing Appium..."
    if command_exists appium; then
        print_success "Appium is already installed"
    else
        npm install -g appium
        print_success "Appium installed successfully"
    fi
}

# Function to install Appium drivers
install_appium_drivers() {
    print_status "Installing Appium drivers..."
    
    # Install UiAutomator2 driver for Android
    if appium driver list | grep -q "uiautomator2"; then
        print_success "UiAutomator2 driver is already installed"
    else
        appium driver install uiautomator2
        print_success "UiAutomator2 driver installed"
    fi
    
    # Install XCUITest driver for iOS (macOS only)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if appium driver list | grep -q "xcuitest"; then
            print_success "XCUITest driver is already installed"
        else
            appium driver install xcuitest
            print_success "XCUITest driver installed"
        fi
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p apps
    mkdir -p screenshots
    mkdir -p logs
    mkdir -p allure-results
    mkdir -p test-results
    mkdir -p reports
    
    print_success "Directories created successfully"
}

# Function to install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Project dependencies installed"
    else
        print_error "package.json not found. Please run this script from the mobile directory."
        exit 1
    fi
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Mobile Automation Environment Variables

# App paths (update these with your actual app paths)
ANDROID_APP_PATH=./apps/your-android-app.apk
IOS_APP_PATH=./apps/your-ios-app.app

# Device UDIDs (update these with your actual device UDIDs)
ANDROID_UDID_1=emulator-5554
ANDROID_UDID_2=emulator-5556
IOS_UDID_1=simulator-1
IOS_UDID_2=simulator-2

# Appium settings
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# Test settings
HEADLESS=false
DEBUG=false
PARALLEL=true

# Reporting
ALLURE_RESULTS_DIR=./allure-results
SCREENSHOTS_DIR=./screenshots
LOGS_DIR=./logs
EOF
        print_success "Environment file created: .env"
        print_warning "Please update the .env file with your actual app paths and device UDIDs"
    else
        print_success "Environment file already exists: .env"
    fi
}

# Function to create sample apps directory
create_sample_apps() {
    print_status "Creating sample apps directory..."
    
    mkdir -p apps
    
    # Create placeholder files
    touch apps/your-android-app.apk
    touch apps/your-ios-app.app
    
    print_success "Sample apps directory created"
    print_warning "Please replace the placeholder files with your actual mobile apps"
}

# Function to validate setup
validate_setup() {
    print_status "Validating setup..."
    
    local errors=0
    
    # Check if all required tools are available
    if ! check_node_version; then
        ((errors++))
    fi
    
    if ! check_npm_version; then
        ((errors++))
    fi
    
    if ! check_java; then
        ((errors++))
    fi
    
    # Check if Appium is installed
    if ! command_exists appium; then
        print_error "Appium is not installed"
        ((errors++))
    fi
    
    # Check if Appium drivers are installed
    if ! appium driver list | grep -q "uiautomator2"; then
        print_error "UiAutomator2 driver is not installed"
        ((errors++))
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! appium driver list | grep -q "xcuitest"; then
            print_error "XCUITest driver is not installed"
            ((errors++))
        fi
    fi
    
    # Check if project dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_error "Project dependencies are not installed"
        ((errors++))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Setup validation passed!"
        return 0
    else
        print_error "Setup validation failed with $errors error(s)"
        return 1
    fi
}

# Function to display next steps
show_next_steps() {
    echo
    print_success "Mobile automation framework setup completed!"
    echo
    echo "Next steps:"
    echo "1. Update the .env file with your actual app paths and device UDIDs"
    echo "2. Place your mobile apps in the apps/ directory"
    echo "3. Start your Android emulator or iOS simulator"
    echo "4. Run your first test: npm run mobile:android"
    echo
    echo "Available commands:"
    echo "  npm run mobile:android     - Run Android tests"
    echo "  npm run mobile:ios         - Run iOS tests (macOS only)"
    echo "  npm run mobile:parallel    - Run tests in parallel"
    echo "  npm run mobile:login       - Run login tests"
    echo "  npm run mobile:dashboard   - Run dashboard tests"
    echo "  npm run mobile:profile     - Run profile tests"
    echo "  npm run mobile:report      - Generate test reports"
    echo
    echo "For more information, see the README.md file"
}

# Main setup function
main() {
    echo "=========================================="
    echo "Mobile Automation Framework Setup"
    echo "=========================================="
    echo
    
    # Check system requirements
    print_status "Checking system requirements..."
    check_node_version
    check_npm_version
    check_java
    check_android_sdk
    check_xcode
    
    # Install Appium and drivers
    install_appium
    install_appium_drivers
    
    # Create project structure
    create_directories
    create_sample_apps
    
    # Install dependencies
    install_dependencies
    
    # Create configuration files
    create_env_file
    
    # Validate setup
    validate_setup
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@"
