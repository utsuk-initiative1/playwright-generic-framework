#!/bin/bash

# Mobile Automation Setup Script
# This script helps set up the mobile automation environment with Appium

set -e

echo "🚀 Setting up Mobile Automation with Appium..."

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
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Check if Java is installed
check_java() {
    print_status "Checking Java installation..."
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        print_success "Java is installed: $JAVA_VERSION"
    else
        print_error "Java is not installed. Please install Java JDK 8 or higher."
        exit 1
    fi
}

# Install Appium globally
install_appium() {
    print_status "Installing Appium globally..."
    if command -v appium &> /dev/null; then
        APPIUM_VERSION=$(appium --version)
        print_success "Appium is already installed: $APPIUM_VERSION"
    else
        npm install -g appium
        print_success "Appium installed successfully"
    fi
}

# Install Appium drivers
install_appium_drivers() {
    print_status "Installing Appium drivers..."
    
    # Install UiAutomator2 driver for Android
    print_status "Installing UiAutomator2 driver for Android..."
    appium driver install uiautomator2
    
    # Install XCUITest driver for iOS
    print_status "Installing XCUITest driver for iOS..."
    appium driver install xcuitest
    
    print_success "Appium drivers installed successfully"
}

# Check Android SDK setup
check_android_sdk() {
    print_status "Checking Android SDK setup..."
    
    if [ -z "$ANDROID_HOME" ]; then
        print_warning "ANDROID_HOME environment variable is not set."
        print_status "Please set ANDROID_HOME to your Android SDK path:"
        print_status "export ANDROID_HOME=/path/to/android/sdk"
        print_status "Add this to your ~/.bashrc or ~/.zshrc file"
    else
        print_success "ANDROID_HOME is set to: $ANDROID_HOME"
    fi
    
    # Check if adb is available
    if command -v adb &> /dev/null; then
        print_success "ADB is available"
    else
        print_warning "ADB is not available. Make sure Android SDK platform-tools are installed."
    fi
}

# Check iOS setup (macOS only)
check_ios_setup() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Checking iOS setup..."
        
        # Check if Xcode is installed
        if command -v xcodebuild &> /dev/null; then
            XCODE_VERSION=$(xcodebuild -version | head -n 1)
            print_success "Xcode is installed: $XCODE_VERSION"
        else
            print_warning "Xcode is not installed. Please install Xcode from the App Store."
        fi
        
        # Check if Xcode Command Line Tools are installed
        if command -v xcrun &> /dev/null; then
            print_success "Xcode Command Line Tools are available"
        else
            print_warning "Xcode Command Line Tools are not installed. Run: xcode-select --install"
        fi
    else
        print_status "Skipping iOS setup (not on macOS)"
    fi
}

# Install project dependencies
install_project_dependencies() {
    print_status "Installing project dependencies..."
    
    # Navigate to the Playwright directory
    cd "$(dirname "$0")/.."
    
    # Install npm dependencies
    npm install
    
    print_success "Project dependencies installed successfully"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Create apps directory for mobile apps
    mkdir -p apps
    
    # Create logs directory
    mkdir -p logs
    
    # Create screenshots directory
    mkdir -p screenshots
    
    # Create test-results directory
    mkdir -p test-results
    
    print_success "Directories created successfully"
}

# Create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# Mobile Automation Environment Variables

# Android Configuration
ANDROID_HOME=/path/to/android/sdk
ANDROID_APP_PATH=./apps/your-app.apk

# iOS Configuration
IOS_APP_PATH=./apps/your-app.app

# Appium Configuration
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# Test Configuration
MOBILE_TEST_TIMEOUT=30000
MOBILE_IMPLICIT_WAIT=10000
EOF
        print_success "Environment file created: .env"
        print_warning "Please update the paths in .env file with your actual app paths"
    else
        print_status "Environment file already exists: .env"
    fi
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check Appium drivers
    print_status "Checking Appium drivers..."
    appium driver list
    
    # Check if WebDriverIO is available
    if npx wdio --version &> /dev/null; then
        print_success "WebDriverIO is available"
    else
        print_error "WebDriverIO is not available. Please check the installation."
    fi
    
    print_success "Installation verification completed"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Mobile Automation Setup Complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update the .env file with your app paths"
    echo "2. Set up Android SDK and ANDROID_HOME environment variable"
    echo "3. For iOS testing, ensure Xcode is installed (macOS only)"
    echo "4. Place your mobile apps in the apps/ directory"
    echo "5. Run tests using:"
    echo "   - npm run mobile:android (for Android)"
    echo "   - npm run mobile:ios (for iOS)"
    echo "   - npm run mobile:parallel (for both platforms)"
    echo ""
    echo "For more information, see: mobile/README.md"
    echo ""
}

# Main execution
main() {
    echo "🚀 Starting Mobile Automation Setup..."
    echo ""
    
    check_nodejs
    check_npm
    check_java
    install_appium
    install_appium_drivers
    check_android_sdk
    check_ios_setup
    install_project_dependencies
    create_directories
    create_env_file
    verify_installation
    show_next_steps
}

# Run main function
main "$@"
