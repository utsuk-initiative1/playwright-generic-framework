# CI/CD Scripts Documentation

This directory contains scripts for continuous integration and deployment of the Playwright automation framework.

## 📁 Files Overview

### `run-tests.sh`
Main test execution script that handles running tests in different environments.

**Usage:**
```bash
# Basic usage
./ci-cd/run-tests.sh

# With custom environment
TEST_ENV=production ./ci-cd/run-tests.sh

# With custom browser
BROWSER=firefox ./ci-cd/run-tests.sh

# With custom workers
WORKERS=8 ./ci-cd/run-tests.sh
```

**Environment Variables:**
- `TEST_ENV`: Environment to run tests in (local, staging, production)
- `BROWSER`: Browser to use (chromium, firefox, webkit)
- `WORKERS`: Number of parallel workers
- `HEADLESS`: Run in headless mode (true/false)
- `RETRIES`: Number of retries for failed tests

### `deploy.sh`
Deployment script for different environments.

**Usage:**
```bash
# Basic deployment
./ci-cd/deploy.sh

# Deploy to specific environment
DEPLOY_ENV=production ./ci-cd/deploy.sh

# Deploy with custom type
DEPLOY_TYPE=full ./ci-cd/deploy.sh
```

**Environment Variables:**
- `DEPLOY_ENV`: Target environment (local, staging, production)
- `DEPLOY_TYPE`: Type of deployment (test, full)
- `BACKUP_REPORTS`: Create backup of existing reports (true/false)

## 🚀 Quick Start

1. **Make scripts executable:**
   ```bash
   chmod +x ci-cd/*.sh
   ```

2. **Run tests locally:**
   ```bash
   ./ci-cd/run-tests.sh
   ```

3. **Deploy to staging:**
   ```bash
   DEPLOY_ENV=staging ./ci-cd/deploy.sh
   ```

## 🔧 Integration with CI/CD Platforms

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    chmod +x ci-cd/*.sh
    ./ci-cd/run-tests.sh
  env:
    TEST_ENV: staging
    BROWSER: chromium
    WORKERS: 4
```

### Jenkins Pipeline
```groovy
stage('Test') {
    steps {
        sh '''
            chmod +x ci-cd/*.sh
            ./ci-cd/run-tests.sh
        '''
    }
    environment {
        TEST_ENV = 'staging'
        BROWSER = 'chromium'
    }
}
```

### GitLab CI
```yaml
test:
  script:
    - chmod +x ci-cd/*.sh
    - ./ci-cd/run-tests.sh
  variables:
    TEST_ENV: "staging"
    BROWSER: "chromium"
```

## 📊 Monitoring and Reporting

The scripts automatically:
- Generate test reports in `test-results/`
- Create HTML reports in `playwright-report/`
- Backup existing reports before new runs
- Provide colored console output for better visibility

## 🔍 Troubleshooting

### Common Issues

1. **Permission Denied:**
   ```bash
   chmod +x ci-cd/*.sh
   ```

2. **Browsers Not Installed:**
   ```bash
   npx playwright install
   ```

3. **Dependencies Missing:**
   ```bash
   npm install
   ```

### Debug Mode
Run with debug information:
```bash
set -x  # Enable debug mode
./ci-cd/run-tests.sh
```

## 📈 Best Practices

1. **Environment Variables:** Always use environment variables for sensitive data
2. **Backup Reports:** Enable backup before major deployments
3. **Parallel Execution:** Use appropriate worker count for your infrastructure
4. **Monitoring:** Check logs and reports after each run
5. **Cleanup:** Regularly clean up old test results and reports

## 🔗 Related Documentation

- [Framework Configuration](../framework.config.ts)
- [Environment Configuration](../framework/config/EnvironmentConfig.ts)
- [Package.json Scripts](../package.json)