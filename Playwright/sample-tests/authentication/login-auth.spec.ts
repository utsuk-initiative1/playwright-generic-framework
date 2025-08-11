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
    
    // Verify error message contains expected text
    const hasError = errorMessages.some((message: string) => 
      message.toLowerCase().includes('invalid') || 
      message.toLowerCase().includes('incorrect') ||
      message.toLowerCase().includes('failed')
    );
    expect(hasError).toBeTruthy();
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

  test('should handle social login buttons', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Test Google login
    await loginPage.performSocialLogin('Google');
    
    // Note: Social login typically opens a popup or redirects to external service
    // This test verifies the button is clickable
  });

  test('should clear form fields', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Fill form with some data
    await loginPage.login('test@example.com', 'password123');
    
    // Clear the form
    await loginPage.clearLoginForm();
    
    // Verify form is cleared (this would need custom verification based on your app)
  });

  test('should handle two-factor authentication', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login (this might trigger 2FA)
    await loginPage.login('test@example.com', 'password123');
    
    // Handle 2FA if required
    await loginPage.handleTwoFactorAuthentication('123456');
    
    // Verify login success
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should resend two-factor code', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login (this might trigger 2FA)
    await loginPage.login('test@example.com', 'password123');
    
    // Resend 2FA code
    await loginPage.resendTwoFactorCode();
    
    // Note: This test verifies the resend functionality is available
  });

  test('should access user profile after login', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    // Login
    await loginPage.login('test@example.com', 'password123');
    
    // Access profile
    await loginPage.accessProfile();
    
    // Verify we're on profile page
    await expect(page).toHaveURL(/.*profile.*|.*account.*|.*dashboard.*/);
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

  test('should check login status', async ({ page }) => {
    // Check if user is logged in (should be false initially)
    let isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
    
    // Navigate to login and login
    await loginPage.navigateToLogin();
    await loginPage.login('test@example.com', 'password123');
    
    // Check if user is logged in (should be true after login)
    isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should handle login with different email formats', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const testEmails = [
      'test@example.com',
      'test.user@example.com',
      'test+tag@example.com',
      'test123@example.co.uk'
    ];
    
    for (const email of testEmails) {
      await loginPage.login(email, 'password123');
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).toBeTruthy();
      
      // Logout for next iteration
      await loginPage.logout();
      
      // Navigate back to login
      await loginPage.navigateToLogin();
    }
  });

  test('should handle special characters in password', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const testPasswords = [
      'password123',
      'Pass@word123',
      'P@ssw0rd!',
      'MyP@ssw0rd123!'
    ];
    
    for (const password of testPasswords) {
      await loginPage.login('test@example.com', password);
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).toBeTruthy();
      
      // Logout for next iteration
      await loginPage.logout();
      
      // Navigate back to login
      await loginPage.navigateToLogin();
    }
  });
});

test.describe('Login Authentication - Negative Tests', () => {
  let loginPage: LoginAuthPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginAuthPage(page);
  });

  test('should handle very long email addresses', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const longEmail = 'a'.repeat(100) + '@example.com';
    await loginPage.login(longEmail, 'password123');
    
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('should handle very long passwords', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const longPassword = 'a'.repeat(1000);
    await loginPage.login('test@example.com', longPassword);
    
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('should handle SQL injection attempts', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const sqlInjectionEmail = "'; DROP TABLE users; --";
    const sqlInjectionPassword = "'; DROP TABLE users; --";
    
    await loginPage.login(sqlInjectionEmail, sqlInjectionPassword);
    
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  test('should handle XSS attempts', async ({ page }) => {
    await loginPage.navigateToLogin();
    
    const xssEmail = '<script>alert("XSS")</script>';
    const xssPassword = '<script>alert("XSS")</script>';
    
    await loginPage.login(xssEmail, xssPassword);
    
    const errorMessages = await loginPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
  });
}); 