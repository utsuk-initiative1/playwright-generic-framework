import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export class ConfigManager {
  private envVars: { [key: string]: string } = {};
  private configLoaded = false;

  constructor() {
    this.loadEnvironmentConfig();
  }

  /**
   * Load environment configuration from .env files
   */
  private loadEnvironmentConfig(): void {
    if (this.configLoaded) return;

    const env = process.env.TEST_ENV || 'local';
    const rootDir = this.findProjectRoot();
    
    // Load environment-specific .env file
    const envFiles = [
      path.join(rootDir, `.env.${env}`),
      path.join(rootDir, '.env.local'),
      path.join(rootDir, '.env'),
      path.join(rootDir, '.env.example')
    ];

    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const result = dotenv.config({ path: envFile });
        if (result.error) {
          console.warn(`Warning: Could not load ${envFile}:`, result.error.message);
        } else {
          console.log(`Loaded environment config from: ${envFile}`);
        }
      }
    }

    // Store all environment variables
    this.envVars = { ...process.env };
    this.configLoaded = true;
  }

  /**
   * Find the project root directory
   */
  private findProjectRoot(): string {
    let currentDir = process.cwd();
    const maxDepth = 10;
    let depth = 0;

    while (depth < maxDepth) {
      // Check for common project root indicators
      const hasPackageJson = fs.existsSync(path.join(currentDir, 'package.json'));
      const hasPlaywrightConfig = fs.existsSync(path.join(currentDir, 'playwright.config.ts')) ||
                                 fs.existsSync(path.join(currentDir, 'playwright.config.js'));
      
      if (hasPackageJson && hasPlaywrightConfig) {
        return currentDir;
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached filesystem root
      }
      
      currentDir = parentDir;
      depth++;
    }

    return process.cwd(); // Fallback to current working directory
  }

  /**
   * Get environment variable with fallback
   */
  getEnvVar(key: string, defaultValue?: string): string | undefined {
    return this.envVars[key] || defaultValue;
  }

  /**
   * Get required environment variable (throws error if not found)
   */
  getRequiredEnvVar(key: string): string {
    const value = this.getEnvVar(key);
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  /**
   * Get boolean environment variable
   */
  getBoolEnvVar(key: string, defaultValue: boolean = false): boolean {
    const value = this.getEnvVar(key);
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Get numeric environment variable
   */
  getNumberEnvVar(key: string, defaultValue: number = 0): number {
    const value = this.getEnvVar(key);
    if (!value) return defaultValue;
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Get all environment variables
   */
  getAllEnvVars(): { [key: string]: string } {
    return { ...this.envVars };
  }

  /**
   * Get test configuration
   */
  getTestConfig() {
    return {
      baseUrl: this.getEnvVar('BASE_URL') || 'https://example.com',
      apiBaseUrl: this.getEnvVar('API_BASE_URL') || 'https://api.example.com',
      testEnv: this.getEnvVar('TEST_ENV') || 'local',
      headless: this.getBoolEnvVar('HEADLESS', false),
      slowMo: this.getNumberEnvVar('SLOW_MO', 0),
      timeout: this.getNumberEnvVar('TEST_TIMEOUT', 30000),
      retries: this.getNumberEnvVar('RETRIES', 2),
      workers: this.getNumberEnvVar('WORKERS', 1),
      screenshot: this.getBoolEnvVar('SCREENSHOT', true),
      video: this.getBoolEnvVar('VIDEO', false),
      trace: this.getBoolEnvVar('TRACE', false),
      reportDir: this.getEnvVar('REPORT_DIR') || 'test-results'
    };
  }

  /**
   * Get authentication configuration
   */
  getAuthConfig() {
    return {
      testUser: {
        email: this.getRequiredEnvVar('TEST_USER_EMAIL'),
        password: this.getRequiredEnvVar('TEST_USER_PASSWORD'),
        username: this.getEnvVar('TEST_USER_USERNAME')
      },
      adminUser: {
        email: this.getEnvVar('ADMIN_USER_EMAIL'),
        password: this.getEnvVar('ADMIN_USER_PASSWORD'),
        username: this.getEnvVar('ADMIN_USER_USERNAME')
      },
      premiumUser: {
        email: this.getEnvVar('PREMIUM_USER_EMAIL'),
        password: this.getEnvVar('PREMIUM_USER_PASSWORD'),
        username: this.getEnvVar('PREMIUM_USER_USERNAME')
      },
      apiTokens: {
        bearer: this.getEnvVar('API_BEARER_TOKEN'),
        oauth: this.getEnvVar('OAUTH_TOKEN'),
        refresh: this.getEnvVar('REFRESH_TOKEN')
      }
    };
  }

  /**
   * Validate required environment variables
   */
  validateRequiredEnvVars(requiredVars: string[]): string[] {
    const missingVars: string[] = [];
    
    for (const varName of requiredVars) {
      if (!this.getEnvVar(varName)) {
        missingVars.push(varName);
      }
    }
    
    return missingVars;
  }

  /**
   * Check if running in CI environment
   */
  isCI(): boolean {
    return this.getBoolEnvVar('CI') || 
           this.getBoolEnvVar('GITHUB_ACTIONS') || 
           this.getBoolEnvVar('GITLAB_CI') ||
           this.getBoolEnvVar('JENKINS_URL');
  }

  /**
   * Get environment-specific base URL
   */
  getBaseUrl(): string {
    const env = this.getEnvVar('TEST_ENV') || 'local';
    
    switch (env) {
      case 'local':
        return this.getEnvVar('LOCAL_BASE_URL') || 'http://localhost:3000';
      case 'staging':
        return this.getEnvVar('STAGING_BASE_URL') || 'https://staging.example.com';
      case 'production':
        return this.getEnvVar('PRODUCTION_BASE_URL') || 'https://example.com';
      default:
        return this.getEnvVar('BASE_URL') || 'https://example.com';
    }
  }

  /**
   * Get environment-specific API URL
   */
  getApiUrl(): string {
    const env = this.getEnvVar('TEST_ENV') || 'local';
    
    switch (env) {
      case 'local':
        return this.getEnvVar('LOCAL_API_URL') || 'http://localhost:3001';
      case 'staging':
        return this.getEnvVar('STAGING_API_URL') || 'https://api-staging.example.com';
      case 'production':
        return this.getEnvVar('PRODUCTION_API_URL') || 'https://api.example.com';
      default:
        return this.getEnvVar('API_BASE_URL') || 'https://api.example.com';
    }
  }
}
