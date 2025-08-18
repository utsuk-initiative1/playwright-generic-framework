import { ConfigManager } from '../config/ConfigManager';

export interface UserCredentials {
  email: string;
  password: string;
  username?: string;
  role?: string;
}

export interface TestUser {
  valid: UserCredentials;
  invalid: UserCredentials;
  admin: UserCredentials;
  premium: UserCredentials;
}

export class TestData {
  private config: ConfigManager;

  constructor() {
    this.config = new ConfigManager();
  }

  /**
   * Get test users for different scenarios
   */
  getUsers(): TestUser {
    return {
      valid: {
        email: this.config.getEnvVar('TEST_USER_EMAIL') || 'test@example.com',
        password: this.config.getEnvVar('TEST_USER_PASSWORD') || 'TestPassword123!',
        username: this.config.getEnvVar('TEST_USER_USERNAME') || 'testuser',
        role: 'user'
      },
      invalid: {
        email: 'invalid@example.com',
        password: 'wrongpassword',
        username: 'invaliduser',
        role: 'user'
      },
      admin: {
        email: this.config.getEnvVar('ADMIN_USER_EMAIL') || 'admin@example.com',
        password: this.config.getEnvVar('ADMIN_USER_PASSWORD') || 'AdminPassword123!',
        username: this.config.getEnvVar('ADMIN_USER_USERNAME') || 'admin',
        role: 'admin'
      },
      premium: {
        email: this.config.getEnvVar('PREMIUM_USER_EMAIL') || 'premium@example.com',
        password: this.config.getEnvVar('PREMIUM_USER_PASSWORD') || 'PremiumPassword123!',
        username: this.config.getEnvVar('PREMIUM_USER_USERNAME') || 'premiumuser',
        role: 'premium'
      }
    };
  }

  /**
   * Get API tokens for different environments
   */
  getApiTokens() {
    return {
      bearer: this.config.getEnvVar('API_BEARER_TOKEN'),
      oauth: this.config.getEnvVar('OAUTH_TOKEN'),
      refresh: this.config.getEnvVar('REFRESH_TOKEN')
    };
  }

  /**
   * Get test data for form validation
   */
  getFormTestData() {
    return {
      validEmails: [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ],
      invalidEmails: [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com'
      ],
      validPasswords: [
        'Password123!',
        'SecurePass456@',
        'MyP@ssw0rd'
      ],
      invalidPasswords: [
        'short',
        'nouppercaseornumber',
        'NOUPPERCASEORNUMBER',
        '123456789'
      ]
    };
  }

  /**
   * Get test data for different test scenarios
   */
  getScenarioData() {
    return {
      login: {
        success: this.getUsers().valid,
        failure: this.getUsers().invalid,
        locked: {
          email: this.config.getEnvVar('LOCKED_USER_EMAIL') || 'locked@example.com',
          password: this.config.getEnvVar('LOCKED_USER_PASSWORD') || 'LockedPass123!'
        }
      },
      registration: {
        newUser: {
          email: `newuser${Date.now()}@example.com`,
          password: 'NewUserPass123!',
          username: `newuser${Date.now()}`
        }
      },
      passwordReset: {
        email: this.config.getEnvVar('RESET_USER_EMAIL') || 'reset@example.com'
      }
    };
  }

  /**
   * Get environment-specific data
   */
  getEnvironmentData() {
    const env = this.config.getEnvVar('TEST_ENV') || 'local';
    
    return {
      local: {
        baseUrl: this.config.getEnvVar('LOCAL_BASE_URL') || 'http://localhost:3000',
        apiUrl: this.config.getEnvVar('LOCAL_API_URL') || 'http://localhost:3001'
      },
      staging: {
        baseUrl: this.config.getEnvVar('STAGING_BASE_URL') || 'https://staging.example.com',
        apiUrl: this.config.getEnvVar('STAGING_API_URL') || 'https://api-staging.example.com'
      },
      production: {
        baseUrl: this.config.getEnvVar('PRODUCTION_BASE_URL') || 'https://example.com',
        apiUrl: this.config.getEnvVar('PRODUCTION_API_URL') || 'https://api.example.com'
      }
    }[env] || {};
  }
}
