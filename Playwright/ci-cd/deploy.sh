#!/bin/bash

# Deployment Script for Playwright Framework
# Handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${DEPLOY_ENV:-"staging"}
DEPLOY_TYPE=${DEPLOY_TYPE:-"test"}
BACKUP_REPORTS=${BACKUP_REPORTS:-"true"}

echo -e "${BLUE}🚀 Starting Deployment Process${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Deploy Type: ${DEPLOY_TYPE}${NC}"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Create backup of existing reports
if [ "$BACKUP_REPORTS" = "true" ]; then
    log "Creating backup of existing reports..."
    if [ -d "test-results" ]; then
        tar -czf "test-results-backup-$(date +%Y%m%d-%H%M%S).tar.gz" test-results/
    fi
    if [ -d "playwright-report" ]; then
        tar -czf "playwright-report-backup-$(date +%Y%m%d-%H%M%S).tar.gz" playwright-report/
    fi
fi

# Environment-specific deployment
case $ENVIRONMENT in
    "local")
        log "Deploying to LOCAL environment..."
        ./ci-cd/run-tests.sh
        ;;
    "staging")
        log "Deploying to STAGING environment..."
        export TEST_ENV=staging
        export HEADLESS=true
        ./ci-cd/run-tests.sh
        ;;
    "production")
        log "Deploying to PRODUCTION environment..."
        export TEST_ENV=production
        export HEADLESS=true
        export WORKERS=2
        ./ci-cd/run-tests.sh
        ;;
    *)
        error "Unknown environment: $ENVIRONMENT"
        ;;
esac

# Post-deployment tasks
log "Running post-deployment tasks..."

# Generate deployment summary
cat > deployment-summary.txt << EOF
Deployment Summary
==================
Environment: $ENVIRONMENT
Deploy Type: $DEPLOY_TYPE
Timestamp: $(date)
Status: SUCCESS

Test Results:
- Location: test-results/
- Report: playwright-report/

Next Steps:
1. Review test results
2. Check for any failures
3. Update documentation if needed
EOF

log "✅ Deployment completed successfully!"
log "📋 Deployment summary saved to deployment-summary.txt"