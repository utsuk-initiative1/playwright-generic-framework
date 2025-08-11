// Template for LoginAuthPage that can be generated during CLI execution
export const LoginAuthPageTemplate = `
import { Page, Locator } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

export class LoginAuthPage extends BasePageObject {
  // Login form elements
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly submitButton: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signUpLink: Locator;
  private readonly socialLoginButtons: Locator;
  
  // Error and validation elements
  private readonly errorMessage: Locator;
  private readonly validationErrors: Locator;
  private readonly successMessage: Locator;
  
  // Navigation elements
  private readonly userMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly profileLink: Locator;
  
  // Two-factor authentication elements
  private readonly twoFactorInput: Locator;
  private readonly twoFactorSubmitButton: Locator;
  private readonly resendCodeButton: Locator;

  constructor(page: Page) {
    super(page, 'LoginAuthPage');
    
    // Initialize login form elements with flexible selectors
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[id*="email"], #email, .email-input');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password"], input[id*="password"], #password, .password-input');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In"), .login-btn, .submit-btn');
    this.submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Submit")');
    
    // Additional login form elements
    this.rememberMeCheckbox = page.locator('input[type="checkbox"], input[name="remember"], .remember-me, [data-testid="remember-me"]');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), a:has-text("Forgot"), .forgot-password, [data-testid="forgot-password"]');
    this.signUpLink = page.locator('a:has-text("Sign Up"), a:has-text("Register"), a:has-text("Create Account"), .signup-link, [data-testid="signup-link"]');
    this.socialLoginButtons = page.locator('button:has-text("Google"), button:has-text("Facebook"), button:has-text("GitHub"), .social-login, [class*="social"]');
    
    // Error and validation elements
    this.errorMessage = page.locator('.error, .alert, .error-message, [class*="error"], [data-testid="error-message"]');
    this.validationErrors = page.locator('.error, .validation-error, .field-error, [class*="error"], [class*="validation"]');
    this.successMessage = page.locator('.success, .success-message, .alert-success, [class*="success"]');
    
    // Navigation elements
    this.userMenu = page.locator('.user-menu, .profile-dropdown, [data-testid="user-menu"], .avatar, .user-avatar, [class*="user"], [class*="profile"]');
    this.logoutButton = page.locator('a:has-text("Logout"), a:has-text("Sign Out"), button:has-text("Logout"), button:has-text("Sign Out"), .logout-btn');
    this.profileLink = page.locator('a:has-text("Profile"), a:has-text("Account"), a:has-text("Settings"), .profile-link');
    
    // Two-factor authentication elements
    this.twoFactorInput = page.locator('input[name="code"], input[name="otp"], input[name="2fa"], input[placeholder*="code"], input[placeholder*="OTP"], .two-factor-input');
    this.twoFactorSubmitButton = page.locator('button:has-text("Verify"), button:has-text("Submit Code"), button:has-text("Confirm"), .verify-btn');
    this.resendCodeButton = page.locator('button:has-text("Resend"), button:has-text("Send Again"), a:has-text("Resend"), .resend-btn');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLogin(): Promise<void> {
    this.logStep('Navigating to login page');
    await this.navigateToPage('/login');
    await this.waitForPageLoad();
    await this.waitForLoginForm();
  }

  /**
   * Wait for login form to be visible
   */
  async waitForLoginForm(): Promise<void> {
    this.logStep('Waiting for login form to be visible');
    await this.page.waitForSelector('input[type="email"], input[name="email"], input[type="password"], input[name="password"]', { timeout: 10000 });
  }

  /**
   * Perform login with provided credentials
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    this.logStep(\`Attempting login with email: \${email}\`);
    
    // Fill email field
    if (await this.emailInput.count() > 0) {
      await this.fillInputWithLog(this.emailInput.first(), email, 'Email Input');
    } else {
      throw new Error('Email input field not found');
    }
    
    // Fill password field
    if (await this.passwordInput.count() > 0) {
      await this.fillInputWithLog(this.passwordInput.first(), password, 'Password Input');
    } else {
      throw new Error('Password input field not found');
    }
    
    // Check remember me if requested
    if (rememberMe && await this.rememberMeCheckbox.count() > 0) {
      await this.clickElementWithLog(this.rememberMeCheckbox.first(), 'Remember Me Checkbox');
    }
    
    // Submit the form
    if (await this.loginButton.count() > 0) {
      await this.clickElementWithLog(this.loginButton.first(), 'Login Button');
    } else if (await this.submitButton.count() > 0) {
      await this.clickElementWithLog(this.submitButton.first(), 'Submit Button');
    } else {
      throw new Error('Login button not found');
    }
    
    await this.waitForNetworkIdleWithLog();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Login with invalid credentials for testing error handling
   */
  async loginWithInvalidCredentials(): Promise<void> {
    const invalidEmail = this.generateRandomEmail();
    const invalidPassword = this.generateRandomString(8);
    
    this.logStep(\`Attempting login with invalid credentials: \${invalidEmail}\`);
    await this.login(invalidEmail, invalidPassword);
  }

  /**
   * Validate login form with empty fields
   */
  async validateLoginForm(): Promise<void> {
    this.logStep('Validating login form with empty fields');
    
    if (await this.submitButton.count() > 0) {
      this.logStep('Submitting empty login form');
      await this.clickElementWithLog(this.submitButton.first(), 'Submit Button');
      await this.page.waitForTimeout(1000);
      
      if (await this.validationErrors.count() > 0) {
        this.logStep('Validation errors found as expected');
        const errorCount = await this.validationErrors.count();
        this.logStep(\`Found \${errorCount} validation error(s)\`);
      } else {
        this.logStep('No validation errors found for empty form');
      }
    } else {
      this.logStep('Submit button not found, skipping validation test');
    }
  }

  /**
   * Verify if login was successful
   */
  async verifyLoginSuccess(): Promise<boolean> {
    this.logStep('Verifying login success');
    
    // Check for user menu or profile elements
    if (await this.userMenu.count() > 0) {
      await this.assertElementVisibleWithLog(this.userMenu.first(), 'User Menu');
      this.logStep('Login successful - user menu visible');
      return true;
    }
    
    // Check for success message
    if (await this.successMessage.count() > 0) {
      const successText = await this.getTextWithLog(this.successMessage.first(), 'Success Message');
      this.logStep(\`Login successful - success message: \${successText}\`);
      return true;
    }
    
    // Check if we're redirected to dashboard or home page
    const currentUrl = this.page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/home') || currentUrl.includes('/profile')) {
      this.logStep('Login successful - redirected to authenticated page');
      return true;
    }
    
    this.logStep('Login status unclear - no clear success indicators found');
    return false;
  }

  /**
   * Handle two-factor authentication if required
   */
  async handleTwoFactorAuthentication(code: string): Promise<void> {
    this.logStep('Handling two-factor authentication');
    
    if (await this.twoFactorInput.count() > 0) {
      this.logStep('Two-factor authentication required');
      await this.fillInputWithLog(this.twoFactorInput.first(), code, 'Two-Factor Code Input');
      
      if (await this.twoFactorSubmitButton.count() > 0) {
        await this.clickElementWithLog(this.twoFactorSubmitButton.first(), 'Verify Two-Factor Code');
        await this.waitForNetworkIdleWithLog();
        await this.page.waitForTimeout(2000);
      }
    } else {
      this.logStep('Two-factor authentication not required');
    }
  }

  /**
   * Resend two-factor authentication code
   */
  async resendTwoFactorCode(): Promise<void> {
    this.logStep('Resending two-factor authentication code');
    
    if (await this.resendCodeButton.count() > 0) {
      await this.clickElementWithLog(this.resendCodeButton.first(), 'Resend Code Button');
      await this.waitForNetworkIdleWithLog();
      this.logStep('Two-factor code resent successfully');
    } else {
      this.logStep('Resend code button not found');
    }
  }

  /**
   * Access user profile after login
   */
  async accessProfile(): Promise<void> {
    this.logStep('Accessing user profile');
    
    if (await this.userMenu.count() > 0) {
      this.logStep('User menu found, clicking to access profile');
      await this.clickElementWithLog(this.userMenu.first(), 'User Menu');
      
      if (await this.profileLink.count() > 0) {
        await this.clickElementWithLog(this.profileLink.first(), 'Profile Link');
        await this.waitForNetworkIdleWithLog();
        this.logStep('Profile page accessed successfully');
      } else {
        this.logStep('Profile link not found in user menu');
      }
    } else {
      this.logStep('User menu not found after login');
    }
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    this.logStep('Logging out from application');
    
    if (await this.userMenu.count() > 0) {
      await this.clickElementWithLog(this.userMenu.first(), 'User Menu');
      
      if (await this.logoutButton.count() > 0) {
        await this.clickElementWithLog(this.logoutButton.first(), 'Logout Button');
        await this.waitForNetworkIdleWithLog();
        this.logStep('Logout successful');
      } else {
        this.logStep('Logout button not found in user menu');
      }
    } else {
      this.logStep('User menu not found for logout');
    }
  }

  /**
   * Navigate to forgot password page
   */
  async navigateToForgotPassword(): Promise<void> {
    this.logStep('Navigating to forgot password page');
    
    if (await this.forgotPasswordLink.count() > 0) {
      await this.clickElementWithLog(this.forgotPasswordLink.first(), 'Forgot Password Link');
      await this.waitForNetworkIdleWithLog();
      this.logStep('Forgot password page accessed');
    } else {
      this.logStep('Forgot password link not found');
    }
  }

  /**
   * Navigate to sign up page
   */
  async navigateToSignUp(): Promise<void> {
    this.logStep('Navigating to sign up page');
    
    if (await this.signUpLink.count() > 0) {
      await this.clickElementWithLog(this.signUpLink.first(), 'Sign Up Link');
      await this.waitForNetworkIdleWithLog();
      this.logStep('Sign up page accessed');
    } else {
      this.logStep('Sign up link not found');
    }
  }

  /**
   * Perform social login (Google, Facebook, etc.)
   */
  async performSocialLogin(provider: string): Promise<void> {
    this.logStep(\`Attempting social login with \${provider}\`);
    
    const socialButton = this.page.locator(\`button:has-text("\${provider}"), .\${provider.toLowerCase()}-login, [data-provider="\${provider.toLowerCase()}"]\`);
    
    if (await socialButton.count() > 0) {
      await this.clickElementWithLog(socialButton.first(), \`\${provider} Login Button\`);
      await this.waitForNetworkIdleWithLog();
      this.logStep(\`\${provider} login initiated\`);
    } else {
      this.logStep(\`\${provider} login button not found\`);
    }
  }

  /**
   * Get error messages from the page
   */
  async getErrorMessages(): Promise<string[]> {
    const errors: string[] = [];
    
    if (await this.errorMessage.count() > 0) {
      for (let i = 0; i < await this.errorMessage.count(); i++) {
        const errorText = await this.getTextWithLog(this.errorMessage.nth(i), \`Error Message \${i + 1}\`);
        errors.push(errorText);
      }
    }
    
    if (await this.validationErrors.count() > 0) {
      for (let i = 0; i < await this.validationErrors.count(); i++) {
        const validationText = await this.getTextWithLog(this.validationErrors.nth(i), \`Validation Error \${i + 1}\`);
        errors.push(validationText);
      }
    }
    
    return errors;
  }

  /**
   * Check if user is currently logged in
   */
  async isLoggedIn(): Promise<boolean> {
    this.logStep('Checking if user is logged in');
    
    if (await this.userMenu.count() > 0) {
      this.logStep('User is logged in - user menu visible');
      return true;
    }
    
    // Check for login form elements (if present, user is not logged in)
    if (await this.emailInput.count() > 0 || await this.passwordInput.count() > 0) {
      this.logStep('User is not logged in - login form visible');
      return false;
    }
    
    this.logStep('Login status unclear');
    return false;
  }

  /**
   * Clear login form fields
   */
  async clearLoginForm(): Promise<void> {
    this.logStep('Clearing login form fields');
    
    if (await this.emailInput.count() > 0) {
      await this.emailInput.first().clear();
    }
    
    if (await this.passwordInput.count() > 0) {
      await this.passwordInput.first().clear();
    }
    
    this.logStep('Login form fields cleared');
  }

  /**
   * Generate random email for testing
   */
  private generateRandomEmail(): string {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    return \`test_\${timestamp}_\${randomId}@example.com\`;
  }

  /**
   * Generate random string for testing
   */
  private generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
`;

// Template for the corresponding test file
export const LoginAuthTestTemplate = `
import { test, expect } from '@playwright/test';
import { LoginAuthPage } from '../../framework/pages/LoginAuthPage';

test.describe('Login Authentication Tests', () => {
  let loginPage: LoginAuthPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginAuthPage(page);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login with valid credentials
    await loginPage.login('test@example.com', 'password123');
    
    // Verify login success
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login with invalid credentials
    await loginPage.loginWithInvalidCredentials();
    
    // Get error messages
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('should validate empty form submission', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Validate form with empty fields
    await loginPage.validateLoginForm();
    
    // Get validation errors
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('should handle remember me functionality', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login with remember me checked
    await loginPage.login('test@example.com', 'password123', true);
    
    // Verify login success
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Navigate to forgot password
    await loginPage.navigateToForgotPassword();
    
    // Verify we're on forgot password page
    await expect(page).toHaveURL(/.*forgot.*|.*reset.*/);
  });

  test('should navigate to sign up page', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Navigate to sign up
    await loginPage.navigateToSignUp();
    
    // Verify we're on sign up page
    await expect(page).toHaveURL(/.*signup.*|.*register.*|.*sign-up.*/);
  });

  test('should logout successfully', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login first
    await loginPage.login('test@example.com', 'password123');
    
    // Verify we're logged in
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).toBeTruthy();
    
    // Logout
    await loginPage.logout();
    
    // Verify we're logged out
    const isLoggedOut = await loginPage.isLoggedIn();
    expect(isLoggedOut).toBeFalsy();
  });
});
`;

// Function to generate the LoginAuthPage during CLI execution
export function generateLoginAuthPage(projectPath: string): void {
  const fs = require('fs');
  const path = require('path');
  
  // Create the pages directory if it doesn't exist
  const pagesDir = path.join(projectPath, 'packages/pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  // Write the LoginAuthPage
  const loginAuthPagePath = path.join(pagesDir, 'LoginAuthPage.ts');
  fs.writeFileSync(loginAuthPagePath, LoginAuthPageTemplate);
  
  // Create the test directory if it doesn't exist
  const testDir = path.join(projectPath, 'sample-tests/authentication');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Write the test file
  const testFilePath = path.join(testDir, 'login-auth.spec.ts');
  fs.writeFileSync(testFilePath, LoginAuthTestTemplate);
  
  console.log('✅ Created: packages/pages/LoginAuthPage.ts');
  console.log('✅ Created: sample-tests/authentication/login-auth.spec.ts');
} 