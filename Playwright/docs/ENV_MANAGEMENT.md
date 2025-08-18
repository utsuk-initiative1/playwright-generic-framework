# Environment Variable Management

This document outlines the comprehensive .env credential management system implemented to securely handle sensitive information in the Playwright test automation framework.

## Overview

The environment variable management system addresses the feedback requirements by:

- **Securely managing credentials**: All sensitive data is stored in .env files, not hardcoded
- **Environment-specific configuration**: Support for multiple environments (local, staging, production)
- **Credential rotation**: Easy management of API keys and authentication tokens
- **Security best practices**: Prevents accidental exposure of secrets

## Architecture

```
Playwright/
├── .env.example              # Template with all available variables
├── .env.local               # Local development environment (not committed)
├── .env.staging             # Staging environment (not committed)
├── .env.production          # Production environment (not committed)
├── framework/
│   └── config/
│       └── ConfigManager.ts  # Environment variable loader and manager
└── .gitignore               # Ensures .env files are not committed
```

## Environment Files

### 1. .env.example
This is the template file that contains all available environment variables with placeholder values. It serves as:

- **Documentation**: Shows all available configuration options
- **Onboarding**: New team members can copy this file to get started
- **Reference**: Complete list of all environment variables

**Important**: This file is committed to version control and contains NO real credentials.

### 2. Environment-Specific Files
- `.env.local` - Local development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

**Important**: These files are NOT committed to version control and contain real credentials.

## Configuration Variables

### Test Environment Configuration
```bash
# Test environment
TEST_ENV=local                    # Environment: local, staging, production
BASE_URL=https://example.com      # Default base URL
API_BASE_URL=https://api.example.com  # Default API URL

# Environment-specific URLs
LOCAL_BASE_URL=http://localhost:3000
LOCAL_API_URL=http://localhost:3001
STAGING_BASE_URL=https://staging.example.com
STAGING_API_URL=https://api-staging.example.com
PRODUCTION_BASE_URL=https://example.com
PRODUCTION_API_URL=https://api.example.com
```

### Test User Credentials
```bash
# Standard test user (REQUIRED)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_USER_USERNAME=testuser

# Admin user credentials (OPTIONAL)
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=AdminPassword123!
ADMIN_USER_USERNAME=admin

# Premium user credentials (OPTIONAL)
PREMIUM_USER_EMAIL=premium@example.com
PREMIUM_USER_PASSWORD=PremiumPassword123!
PREMIUM_USER_USERNAME=premiumuser

# Special test users
LOCKED_USER_EMAIL=locked@example.com
LOCKED_USER_PASSWORD=LockedPass123!
RESET_USER_EMAIL=reset@example.com
```

### API Authentication Tokens
```bash
# Bearer token for API authentication
API_BEARER_TOKEN=your_bearer_token_here

# OAuth tokens
OAUTH_TOKEN=your_oauth_token_here
REFRESH_TOKEN=your_refresh_token_here

# API keys for external services
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

### Playwright Test Configuration
```bash
# Browser and test settings
HEADLESS=false
SLOW_MO=0
TEST_TIMEOUT=30000
RETRIES=2
WORKERS=1

# Screenshot and video settings
SCREENSHOT=true
VIDEO=false
TRACE=false

# Output directories
OUTPUT_DIR=sample-tests
REPORT_DIR=test-results
```

### CI/CD Configuration
```bash
# CI environment detection
CI=false
GITHUB_ACTIONS=false
GITLAB_CI=false
JENKINS_URL=

# CI-specific settings
CI_HEADLESS=true
CI_TIMEOUT=60000
CI_RETRIES=3
```

### External Services
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testdb
DB_USER=testuser
DB_PASSWORD=testpassword

# Email service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=test@example.com
SMTP_PASSWORD=email_password_here

# Payment gateway
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
PAYMENT_GATEWAY_SECRET=your_payment_gateway_secret
```

### Security Configuration
```bash
# Encryption keys
ENCRYPTION_KEY=your_encryption_key_here
JWT_SECRET=your_jwt_secret_here
```

## Setup Instructions

### 1. Initial Setup
```bash
# Copy the example file to create your local environment
cp .env.example .env.local

# Edit the file with your actual credentials
nano .env.local
```

### 2. Environment-Specific Setup
```bash
# For staging environment
cp .env.example .env.staging
nano .env.staging

# For production environment  
cp .env.example .env.production
nano .env.production
```

### 3. Set Environment Variable
```bash
# Set the environment you want to use
export TEST_ENV=local    # or staging, production
```

## Usage in Code

### ConfigManager Class
The `ConfigManager` class provides a clean interface for accessing environment variables:

```typescript
import { ConfigManager } from '../config/ConfigManager';

const config = new ConfigManager();

// Get environment variable with fallback
const baseUrl = config.getEnvVar('BASE_URL', 'https://default.com');

// Get required environment variable (throws if missing)
const email = config.getRequiredEnvVar('TEST_USER_EMAIL');

// Get boolean environment variable
const headless = config.getBoolEnvVar('HEADLESS', false);

// Get numeric environment variable
const timeout = config.getNumberEnvVar('TEST_TIMEOUT', 30000);
```

### Test Data Integration
```typescript
import { TestData } from '../fixtures/testData';

const testData = new TestData();

// Get user credentials
const users = testData.getUsers();
const validUser = users.valid;
const adminUser = users.admin;

// Get API tokens
const tokens = testData.getApiTokens();
const bearerToken = tokens.bearer;
```

### Authentication Configuration
```typescript
import { ConfigManager } from '../config/ConfigManager';

const config = new ConfigManager();
const authConfig = config.getAuthConfig();

// Access authentication data
const testUser = authConfig.testUser;
const adminUser = authConfig.adminUser;
const apiTokens = authConfig.apiTokens;
```

## Security Best Practices

### 1. Never Commit .env Files
Ensure `.env` files are in `.gitignore`:
```gitignore
# Environment files
.env
.env.local
.env.staging
.env.production
.env.*
!.env.example
```

### 2. Use Strong Passwords
- Use complex passwords with mixed case, numbers, and special characters
- Avoid common patterns and dictionary words
- Consider using password managers for credential generation

### 3. Rotate Credentials Regularly
- Set up a schedule for credential rotation
- Update .env files when credentials change
- Notify team members of credential updates

### 4. Limit Access
- Only share .env files with authorized team members
- Use secure channels for sharing credentials
- Consider using secret management services for production

### 5. Validate Configuration
The system automatically validates required environment variables:
```typescript
const missingVars = config.validateRequiredEnvVars([
  'TEST_USER_EMAIL',
  'TEST_USER_PASSWORD'
]);

if (missingVars.length > 0) {
  console.error('Missing required variables:', missingVars);
}
```

## Environment-Specific Configuration

### Local Development
```bash
TEST_ENV=local
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001
HEADLESS=false
SLOW_MO=1000  # Slower execution for debugging
```

### Staging Environment
```bash
TEST_ENV=staging
BASE_URL=https://staging.example.com
API_BASE_URL=https://api-staging.example.com
HEADLESS=true
SLOW_MO=0
```

### Production Environment
```bash
TEST_ENV=production
BASE_URL=https://example.com
API_BASE_URL=https://api.example.com
HEADLESS=true
SLOW_MO=0
CI_HEADLESS=true
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      TEST_ENV: staging
      CI: true
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npx playwright test
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

### GitLab CI
```yaml
test:
  stage: test
  variables:
    TEST_ENV: staging
    CI: true
  script:
    - npm ci
    - npx playwright test
  environment:
    name: staging
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```bash
   # Check if .env file exists
   ls -la .env*
   
   # Verify TEST_ENV is set
   echo $TEST_ENV
   ```

2. **Wrong Environment Loaded**
   ```bash
   # Set the correct environment
   export TEST_ENV=local
   
   # Restart your test runner
   npx playwright test
   ```

3. **Credentials Not Working**
   ```bash
   # Verify credentials in .env file
   grep TEST_USER_EMAIL .env.local
   
   # Check if credentials are valid
   # Test manually in browser
   ```

### Debug Mode
Enable debug logging:
```bash
LOG_LEVEL=debug npx playwright test
```

## Migration Guide

### From Hardcoded Credentials
**Before:**
```typescript
const email = 'test@example.com';
const password = 'password123';
```

**After:**
```typescript
import { ConfigManager } from '../config/ConfigManager';

const config = new ConfigManager();
const email = config.getRequiredEnvVar('TEST_USER_EMAIL');
const password = config.getRequiredEnvVar('TEST_USER_PASSWORD');
```

### From Multiple Config Files
**Before:**
```typescript
// config/local.ts
export const config = {
  baseUrl: 'http://localhost:3000',
  email: 'test@example.com'
};

// config/staging.ts  
export const config = {
  baseUrl: 'https://staging.example.com',
  email: 'test@example.com'
};
```

**After:**
```typescript
import { ConfigManager } from '../config/ConfigManager';

const config = new ConfigManager();
const baseUrl = config.getBaseUrl(); // Automatically environment-specific
const email = config.getRequiredEnvVar('TEST_USER_EMAIL');
```

## Best Practices

1. **Use .env.example**: Always keep .env.example updated with all variables
2. **Validate early**: Check for missing variables at startup
3. **Environment isolation**: Use different credentials for each environment
4. **Regular updates**: Keep credentials and tokens up to date
5. **Documentation**: Document any new environment variables added
6. **Team communication**: Notify team when credentials change
7. **Backup strategy**: Have a secure backup of production credentials
8. **Monitoring**: Monitor for credential expiration and rotation needs

## Contributing

When adding new environment variables:

1. Add the variable to `.env.example` with a descriptive comment
2. Update this documentation
3. Add validation if the variable is required
4. Update the ConfigManager if needed
5. Test in all environments
6. Notify the team of the new variable
