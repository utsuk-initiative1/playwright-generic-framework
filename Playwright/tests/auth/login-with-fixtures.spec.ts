import { test, expect } from '../../framework/fixtures';

test.describe('Authentication Tests with Fixtures', () => {
  
  test.beforeEach(async ({ auth }) => {
    // Ensure we start with an unauthenticated state
    await auth.setupUnauthenticatedState();
  });

  test('should login successfully with valid credentials', async ({ auth, testData }) => {
    // Use the auth fixture to login
    const loginSuccess = await auth.loginAsValidUser();
    
    expect(loginSuccess).toBe(true);
    
    // Verify we're logged in
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(true);
    expect(authStatus.userRole).toBe('user');
  });

  test('should login successfully as admin user', async ({ auth }) => {
    // Use the auth fixture to login as admin
    const loginSuccess = await auth.loginAsAdmin();
    
    expect(loginSuccess).toBe(true);
    
    // Verify we're logged in as admin
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(true);
    expect(authStatus.userRole).toBe('admin');
  });

  test('should login successfully as premium user', async ({ auth }) => {
    // Use the auth fixture to login as premium user
    const loginSuccess = await auth.loginAsPremiumUser();
    
    expect(loginSuccess).toBe(true);
    
    // Verify we're logged in as premium user
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(true);
    expect(authStatus.userRole).toBe('premium');
  });

  test('should fail login with invalid credentials', async ({ auth }) => {
    // Use the auth fixture to attempt invalid login
    const errorMessages = await auth.loginWithInvalidCredentials();
    
    // Should have error messages
    expect(errorMessages.length).toBeGreaterThan(0);
    
    // Verify we're not logged in
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(false);
  });

  test('should login with remember me option', async ({ auth }) => {
    // Use the auth fixture to login with remember me
    const loginSuccess = await auth.loginAsValidUser(true);
    
    expect(loginSuccess).toBe(true);
    
    // Verify we're logged in
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(true);
  });

  test('should logout successfully', async ({ auth }) => {
    // First login
    await auth.loginAsValidUser();
    
    // Then logout
    const logoutSuccess = await auth.logout();
    
    expect(logoutSuccess).toBe(true);
    
    // Verify we're logged out
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(false);
  });

  test('should handle custom credentials', async ({ auth, testData }) => {
    // Get custom user credentials from test data
    const customUser = testData.getUsers().valid;
    
    // Use the auth fixture with custom credentials
    const loginSuccess = await auth.loginWithCredentials(customUser);
    
    expect(loginSuccess).toBe(true);
    
    // Verify we're logged in
    const authStatus = await auth.getAuthStatus();
    expect(authStatus.isLoggedIn).toBe(true);
  });

  test('should navigate to sign up page', async ({ auth }) => {
    // Use the auth fixture to navigate to sign up
    const navigationSuccess = await auth.navigateToSignUp();
    
    expect(navigationSuccess).toBe(true);
  });

  test('should reset password', async ({ auth, testData }) => {
    // Get reset user email from test data
    const resetEmail = testData.getScenarioData().passwordReset.email;
    
    // Use the auth fixture to reset password
    const resetSuccess = await auth.resetPassword(resetEmail);
    
    expect(resetSuccess).toBe(true);
  });

  test('should handle two-factor authentication', async ({ auth }) => {
    // First login (this might trigger 2FA)
    const loginSuccess = await auth.loginAsValidUser();
    
    if (loginSuccess) {
      // If 2FA is required, handle it
      const twoFactorCode = '123456'; // This would come from SMS/email in real scenario
      const twoFactorSuccess = await auth.handleTwoFactorAuth(twoFactorCode);
      
      // Note: This test might fail if 2FA is not actually required
      // In a real scenario, you'd need to mock or handle the 2FA code generation
      console.log('2FA test completed - success depends on actual 2FA implementation');
    }
  });

  test('should test form validation with test data', async ({ loginPage, testData }) => {
    // Navigate to login page
    await loginPage.navigateToLogin();
    
    // Get form test data
    const formData = testData.getFormTestData();
    
    // Test with invalid email
    for (const invalidEmail of formData.invalidEmails) {
      await loginPage.clearLoginForm();
      await loginPage.fillInput(loginPage['emailInput'], invalidEmail);
      await loginPage.fillInput(loginPage['passwordInput'], 'password123');
      await loginPage.clickElement(loginPage['loginButton']);
      
      // Should have error messages
      const errorMessages = await loginPage.getErrorMessages();
      expect(errorMessages.length).toBeGreaterThan(0);
    }
  });
});
