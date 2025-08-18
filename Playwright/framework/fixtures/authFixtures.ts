import { Page } from '@playwright/test';
import { LoginAuthPage } from '../pages/LoginAuthPage';
import { TestData, UserCredentials } from './testData';

export class AuthFixtures {
  private page: Page;
  private loginPage: LoginAuthPage;
  private testData: TestData;

  constructor(page: Page, loginPage: LoginAuthPage, testData: TestData) {
    this.page = page;
    this.loginPage = loginPage;
    this.testData = testData;
  }

  /**
   * Login with valid credentials
   */
  async loginAsValidUser(rememberMe: boolean = false): Promise<boolean> {
    try {
      const user = this.testData.getUsers().valid;
      await this.loginPage.navigateToLogin();
      await this.loginPage.login(user.email, user.password, rememberMe);
      return await this.loginPage.verifyLoginSuccess();
    } catch (error) {
      console.error('Failed to login as valid user:', error);
      return false;
    }
  }

  /**
   * Login with admin credentials
   */
  async loginAsAdmin(rememberMe: boolean = false): Promise<boolean> {
    try {
      const user = this.testData.getUsers().admin;
      await this.loginPage.navigateToLogin();
      await this.loginPage.login(user.email, user.password, rememberMe);
      return await this.loginPage.verifyLoginSuccess();
    } catch (error) {
      console.error('Failed to login as admin:', error);
      return false;
    }
  }

  /**
   * Login with premium user credentials
   */
  async loginAsPremiumUser(rememberMe: boolean = false): Promise<boolean> {
    try {
      const user = this.testData.getUsers().premium;
      await this.loginPage.navigateToLogin();
      await this.loginPage.login(user.email, user.password, rememberMe);
      return await this.loginPage.verifyLoginSuccess();
    } catch (error) {
      console.error('Failed to login as premium user:', error);
      return false;
    }
  }

  /**
   * Login with custom credentials
   */
  async loginWithCredentials(credentials: UserCredentials, rememberMe: boolean = false): Promise<boolean> {
    try {
      await this.loginPage.navigateToLogin();
      await this.loginPage.login(credentials.email, credentials.password, rememberMe);
      return await this.loginPage.verifyLoginSuccess();
    } catch (error) {
      console.error('Failed to login with custom credentials:', error);
      return false;
    }
  }

  /**
   * Attempt login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<string[]> {
    try {
      await this.loginPage.navigateToLogin();
      await this.loginPage.loginWithInvalidCredentials();
      return await this.loginPage.getErrorMessages();
    } catch (error) {
      console.error('Failed to attempt invalid login:', error);
      return [];
    }
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<boolean> {
    try {
      await this.loginPage.logout();
      return !(await this.loginPage.isLoggedIn());
    } catch (error) {
      console.error('Failed to logout:', error);
      return false;
    }
  }

  /**
   * Setup authenticated state for tests
   */
  async setupAuthenticatedState(userType: 'valid' | 'admin' | 'premium' = 'valid'): Promise<boolean> {
    try {
      switch (userType) {
        case 'admin':
          return await this.loginAsAdmin();
        case 'premium':
          return await this.loginAsPremiumUser();
        default:
          return await this.loginAsValidUser();
      }
    } catch (error) {
      console.error(`Failed to setup authenticated state for ${userType} user:`, error);
      return false;
    }
  }

  /**
   * Setup unauthenticated state for tests
   */
  async setupUnauthenticatedState(): Promise<boolean> {
    try {
      // Navigate to login page to ensure we're not logged in
      await this.loginPage.navigateToLogin();
      
      // Check if we're actually logged out
      const isLoggedIn = await this.loginPage.isLoggedIn();
      if (isLoggedIn) {
        await this.logout();
      }
      
      return !(await this.loginPage.isLoggedIn());
    } catch (error) {
      console.error('Failed to setup unauthenticated state:', error);
      return false;
    }
  }

  /**
   * Get current authentication status
   */
  async getAuthStatus(): Promise<{
    isLoggedIn: boolean;
    currentUser?: UserCredentials;
    userRole?: string;
  }> {
    try {
      const isLoggedIn = await this.loginPage.isLoggedIn();
      
      if (!isLoggedIn) {
        return { isLoggedIn: false };
      }

      // Try to determine current user based on available data
      const users = this.testData.getUsers();
      const currentUrl = this.page.url();
      
      // Simple heuristic to determine user type based on URL or page content
      if (currentUrl.includes('/admin') || currentUrl.includes('/dashboard/admin')) {
        return { isLoggedIn: true, currentUser: users.admin, userRole: 'admin' };
      } else if (currentUrl.includes('/premium') || currentUrl.includes('/dashboard/premium')) {
        return { isLoggedIn: true, currentUser: users.premium, userRole: 'premium' };
      } else {
        return { isLoggedIn: true, currentUser: users.valid, userRole: 'user' };
      }
    } catch (error) {
      console.error('Failed to get auth status:', error);
      return { isLoggedIn: false };
    }
  }

  /**
   * Handle two-factor authentication
   */
  async handleTwoFactorAuth(code: string): Promise<boolean> {
    try {
      await this.loginPage.handleTwoFactorAuthentication(code);
      return await this.loginPage.verifyLoginSuccess();
    } catch (error) {
      console.error('Failed to handle 2FA:', error);
      return false;
    }
  }

  /**
   * Reset password flow
   */
  async resetPassword(email: string): Promise<boolean> {
    try {
      await this.loginPage.navigateToLogin();
      await this.loginPage.navigateToForgotPassword();
      
      // Fill email for password reset
      await this.page.fill('input[type="email"], #email', email);
      await this.page.click('button[type="submit"], #submit');
      
      // Wait for success message or redirect
      await this.page.waitForTimeout(2000);
      
      return true;
    } catch (error) {
      console.error('Failed to reset password:', error);
      return false;
    }
  }

  /**
   * Navigate to sign up page
   */
  async navigateToSignUp(): Promise<boolean> {
    try {
      await this.loginPage.navigateToLogin();
      await this.loginPage.navigateToSignUp();
      return this.page.url().includes('/signup') || this.page.url().includes('/register');
    } catch (error) {
      console.error('Failed to navigate to sign up:', error);
      return false;
    }
  }
}
