import { Remote } from 'webdriverio';
import { BaseMobilePage } from '../core/BaseMobilePage';

export class MobileLoginPage extends BaseMobilePage {
  // Android locators
  private readonly androidEmailInput = '~email_input, #email, [resource-id="email"]';
  private readonly androidPasswordInput = '~password_input, #password, [resource-id="password"]';
  private readonly androidLoginButton = '~login_button, #login, [resource-id="login"]';
  private readonly androidRememberMeCheckbox = '~remember_me, #remember-me, [resource-id="remember_me"]';
  private readonly androidForgotPasswordLink = '~forgot_password, a[href*="forgot"], [resource-id="forgot_password"]';
  private readonly androidSignUpLink = '~sign_up, a[href*="signup"], [resource-id="sign_up"]';
  private readonly androidErrorMessage = '~error_message, .error, [resource-id="error_message"]';
  private readonly androidProfileLink = '~profile, a[href*="profile"], [resource-id="profile"]';
  private readonly androidLogoutLink = '~logout, a[href*="logout"], [resource-id="logout"]';

  // iOS locators
  private readonly iosEmailInput = '-ios predicate string:type == "XCUIElementTypeTextField" AND name == "email"';
  private readonly iosPasswordInput = '-ios predicate string:type == "XCUIElementTypeSecureTextField" AND name == "password"';
  private readonly iosLoginButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Login"';
  private readonly iosRememberMeCheckbox = '-ios predicate string:type == "XCUIElementTypeCheckBox" AND name == "Remember Me"';
  private readonly iosForgotPasswordLink = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Forgot Password"';
  private readonly iosSignUpLink = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Sign Up"';
  private readonly iosErrorMessage = '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "error"';
  private readonly iosProfileLink = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Profile"';
  private readonly iosLogoutLink = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Logout"';

  constructor(driver: Remote) {
    super(driver);
  }

  /**
   * Get platform-specific locators
   */
  private async getLocators() {
    const platform = await this.driver.getPlatform();
    
    if (platform === 'android') {
      return {
        emailInput: this.androidEmailInput,
        passwordInput: this.androidPasswordInput,
        loginButton: this.androidLoginButton,
        rememberMeCheckbox: this.androidRememberMeCheckbox,
        forgotPasswordLink: this.androidForgotPasswordLink,
        signUpLink: this.androidSignUpLink,
        errorMessage: this.androidErrorMessage,
        profileLink: this.androidProfileLink,
        logoutLink: this.androidLogoutLink
      };
    } else {
      return {
        emailInput: this.iosEmailInput,
        passwordInput: this.iosPasswordInput,
        loginButton: this.iosLoginButton,
        rememberMeCheckbox: this.iosRememberMeCheckbox,
        forgotPasswordLink: this.iosForgotPasswordLink,
        signUpLink: this.iosSignUpLink,
        errorMessage: this.iosErrorMessage,
        profileLink: this.iosProfileLink,
        logoutLink: this.iosLogoutLink
      };
    }
  }

  /**
   * Navigate to login screen
   */
  async navigateToLogin(): Promise<void> {
    // For mobile apps, this might involve launching the app
    // or navigating to a specific screen
    console.log('Navigating to login screen...');
  }

  /**
   * Perform login
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    const locators = await this.getLocators();
    
    await this.fillInput(locators.emailInput, email);
    await this.fillInput(locators.passwordInput, password);
    
    if (rememberMe) {
      await this.clickElement(locators.rememberMeCheckbox);
    }
    
    await this.clickElement(locators.loginButton);
    await this.hideKeyboard();
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<void> {
    const locators = await this.getLocators();
    
    await this.fillInput(locators.emailInput, 'invalid@example.com');
    await this.fillInput(locators.passwordInput, 'wrongpassword');
    await this.clickElement(locators.loginButton);
    await this.hideKeyboard();
  }

  /**
   * Verify login success
   */
  async verifyLoginSuccess(): Promise<boolean> {
    try {
      const locators = await this.getLocators();
      
      // Check if profile link is visible (indicates successful login)
      const profileVisible = await this.isElementDisplayed(locators.profileLink);
      
      // Check if logout link is visible
      const logoutVisible = await this.isElementDisplayed(locators.logoutLink);
      
      // Check current activity/screen
      const currentActivity = await this.getCurrentActivity();
      const isOnDashboard = currentActivity.includes('Dashboard') || 
                           currentActivity.includes('Home') || 
                           currentActivity.includes('Main');
      
      return profileVisible || logoutVisible || isOnDashboard;
    } catch {
      return false;
    }
  }

  /**
   * Get error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const locators = await this.getLocators();
    const messages: string[] = [];
    
    try {
      const errorElement = await this.driver.$(locators.errorMessage);
      if (await errorElement.isDisplayed()) {
        const text = await errorElement.getText();
        if (text) {
          messages.push(text.trim());
        }
      }
    } catch (error) {
      console.log('No error message found');
    }
    
    return messages;
  }

  /**
   * Validate login form
   */
  async validateLoginForm(): Promise<void> {
    const locators = await this.getLocators();
    
    // Try to submit empty form
    await this.clickElement(locators.loginButton);
  }

  /**
   * Navigate to forgot password
   */
  async navigateToForgotPassword(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.forgotPasswordLink);
  }

  /**
   * Navigate to sign up
   */
  async navigateToSignUp(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.signUpLink);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    const locators = await this.getLocators();
    
    await this.driver.$(locators.emailInput).clearValue();
    await this.driver.$(locators.passwordInput).clearValue();
    
    // Uncheck remember me if it's checked
    try {
      const checkbox = await this.driver.$(locators.rememberMeCheckbox);
      if (await checkbox.isSelected()) {
        await checkbox.click();
      }
    } catch (error) {
      // Checkbox might not be present or selectable
    }
  }

  /**
   * Access profile
   */
  async accessProfile(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.profileLink);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.logoutLink);
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const locators = await this.getLocators();
      
      // Check if logout link is visible (indicates user is logged in)
      const logoutVisible = await this.isElementDisplayed(locators.logoutLink);
      
      // Check if profile link is visible
      const profileVisible = await this.isElementDisplayed(locators.profileLink);
      
      return logoutVisible || profileVisible;
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot of login screen
   */
  async takeLoginScreenshot(): Promise<string> {
    return await this.takeScreenshot('login_screen');
  }

  /**
   * Handle biometric authentication (if available)
   */
  async handleBiometricAuth(): Promise<void> {
    // This would be implemented based on the specific app's biometric implementation
    console.log('Handling biometric authentication...');
  }

  /**
   * Handle app permissions
   */
  async handlePermissions(): Promise<void> {
    // Handle permission dialogs that might appear
    try {
      // Common permission button selectors
      const allowButton = await this.driver.$('~Allow, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Allow"');
      if (await allowButton.isDisplayed()) {
        await allowButton.click();
      }
    } catch (error) {
      // No permission dialog found
    }
  }
}
