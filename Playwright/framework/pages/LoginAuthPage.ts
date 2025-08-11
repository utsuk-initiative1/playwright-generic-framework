import { Page, expect } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class LoginAuthPage extends BasePage {
  private readonly emailInput = '#email, input[type="email"], [name="email"]';
  private readonly passwordInput = '#password, input[type="password"], [name="password"]';
  private readonly loginButton = '#login, button[type="submit"], .login-btn';
  private readonly rememberMeCheckbox = '#remember-me, input[type="checkbox"][name="remember"]';
  private readonly forgotPasswordLink = 'a[href*="forgot"], a[href*="reset"]';
  private readonly signUpLink = 'a[href*="signup"], a[href*="register"], a[href*="sign-up"]';
  private readonly googleLoginButton = 'button[data-provider="google"], .google-login';
  private readonly errorMessage = '.error, .alert, .message, [role="alert"]';
  private readonly profileLink = 'a[href*="profile"], a[href*="account"], a[href*="dashboard"]';
  private readonly logoutLink = 'a[href*="logout"], .logout-btn, button[data-action="logout"]';
  private readonly twoFactorInput = '#2fa, input[name="2fa"], input[name="otp"]';
  private readonly resendCodeButton = '#resend, button[data-action="resend"]';

  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    
    if (rememberMe) {
      await this.page.check(this.rememberMeCheckbox);
    }
    
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithInvalidCredentials() {
    await this.fillInput(this.emailInput, 'invalid@example.com');
    await this.fillInput(this.passwordInput, 'wrongpassword');
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async verifyLoginSuccess(): Promise<boolean> {
    try {
      // Check if we're redirected to a dashboard or profile page
      const currentUrl = this.page.url();
      const isLoggedIn = currentUrl.includes('/dashboard') || 
                         currentUrl.includes('/profile') || 
                         currentUrl.includes('/account') ||
                         !currentUrl.includes('/login');
      
      // Also check for user-specific elements
      const userElement = await this.page.locator('.user-info, .profile, [data-user]').isVisible();
      
      return isLoggedIn || userElement;
    } catch {
      return false;
    }
  }

  async getErrorMessages(): Promise<string[]> {
    const errorElements = await this.page.locator(this.errorMessage).all();
    const messages: string[] = [];
    
    for (const element of errorElements) {
      const text = await element.textContent();
      if (text) {
        messages.push(text.trim());
      }
    }
    
    return messages;
  }

  async validateLoginForm() {
    // Try to submit empty form
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async navigateToForgotPassword() {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  async navigateToSignUp() {
    await this.clickElement(this.signUpLink);
    await this.waitForPageLoad();
  }

  async performSocialLogin(provider: string) {
    if (provider.toLowerCase() === 'google') {
      await this.clickElement(this.googleLoginButton);
      // Note: Social login typically opens a popup
      // This is a basic implementation
    }
  }

  async clearLoginForm() {
    await this.page.fill(this.emailInput, '');
    await this.page.fill(this.passwordInput, '');
    await this.page.uncheck(this.rememberMeCheckbox);
  }

  async handleTwoFactorAuthentication(code: string) {
    await this.page.fill(this.twoFactorInput, code);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async resendTwoFactorCode() {
    await this.clickElement(this.resendCodeButton);
  }

  async accessProfile() {
    await this.clickElement(this.profileLink);
    await this.waitForPageLoad();
  }

  async logout() {
    await this.clickElement(this.logoutLink);
    await this.waitForPageLoad();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if logout link is visible (indicates user is logged in)
      const logoutVisible = await this.page.locator(this.logoutLink).isVisible();
      
      // Check if we're on a protected page
      const currentUrl = this.page.url();
      const isOnProtectedPage = currentUrl.includes('/dashboard') || 
                                currentUrl.includes('/profile') || 
                                currentUrl.includes('/account');
      
      return logoutVisible || isOnProtectedPage;
    } catch {
      return false;
    }
  }
} 