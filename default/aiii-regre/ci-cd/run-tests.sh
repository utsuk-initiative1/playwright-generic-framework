#!/bin/bash

# CI/CD Test Runner Script
# This script handles test execution in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${TEST_ENV:-"staging"}
BROWSER=${BROWSER:-"chromium"}
WORKERS=${WORKERS:-"4"}
HEADLESS=${HEADLESS:-"true"}
RETRIES=${RETRIES:-"2"}

echo -e "${BLUE}🚀 Starting Playwright Test Execution${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Browser: ${BROWSER}${NC}"
echo -e "${YELLOW}Workers: ${WORKERS}${NC}"
echo -e "${YELLOW}Headless: ${HEADLESS}${NC}"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install
fi

# Install browsers if needed
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
    log "Installing Playwright browsers..."
    npx playwright install
fi

# Create necessary directories
mkdir -p test-results
mkdir -p playwright-report
mkdir -p baseline-screenshots

# Set environment variables
export TEST_ENV=$ENVIRONMENT
export PLAYWRIGHT_HEADLESS=$HEADLESS

# Run tests based on environment
case $ENVIRONMENT in
    "local")
        log "Running tests in LOCAL environment..."
        npx playwright test --config=framework.config.ts --project=$BROWSER --workers=$WORKERS --retries=$RETRIES
        ;;
    "staging")
        log "Running tests in STAGING environment..."
        npx playwright test --config=framework.config.ts --project=$BROWSER --workers=$WORKERS --retries=$RETRIES
        ;;
    "production")
        log "Running tests in PRODUCTION environment..."
        npx playwright test --config=framework.config.ts --project=$BROWSER --workers=$WORKERS --retries=$RETRIES
        ;;
    *)
        error "Unknown environment: $ENVIRONMENT"
        ;;
esac

# Check if tests passed
if [ $? -eq 0 ]; then
    log "✅ All tests passed successfully!"
    
    # Generate additional reports if needed
    if [ "$GENERATE_REPORTS" = "true" ]; then
        log "Generating additional reports..."
        npx playwright show-report --host 0.0.0.0 --port 9323 &
    fi
    
    exit 0
else
    error "❌ Some tests failed!"
fi