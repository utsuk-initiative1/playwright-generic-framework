import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { Remote } from 'webdriverio';
import { MobileLoginPage } from '../pages/MobileLoginPage';

describe('Mobile Login Tests', () => {
  let driver: Remote;
  let loginPage: MobileLoginPage;

  before(async () => {
    // Driver is initialized by WebDriverIO
    driver = global.driver;
    loginPage = new MobileLoginPage(driver);
    
    // Handle any initial permissions
    await loginPage.handlePermissions();
  });

  after(async () => {
    // Cleanup is handled by WebDriverIO
  });

  describe('Login Functionality', () => {
    it('should successfully login with valid credentials', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform login
      await loginPage.login('test@example.com', 'password123');
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).to.be.true;
      
      // Take screenshot for verification
      await loginPage.takeLoginScreenshot();
    });

    it('should show error message with invalid credentials', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform login with invalid credentials
      await loginPage.loginWithInvalidCredentials();
      
      // Get error messages
      const errorMessages = await loginPage.getErrorMessages();
      expect(errorMessages.length).to.be.greaterThan(0);
      expect(errorMessages[0]).to.include('Invalid');
    });

    it('should validate empty form submission', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Try to submit empty form
      await loginPage.validateLoginForm();
      
      // Get error messages
      const errorMessages = await loginPage.getErrorMessages();
      expect(errorMessages.length).to.be.greaterThan(0);
    });

    it('should handle remember me functionality', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform login with remember me checked
      await loginPage.login('test@example.com', 'password123', true);
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).to.be.true;
    });
  });

  describe('Navigation Tests', () => {
    it('should navigate to forgot password screen', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Navigate to forgot password
      await loginPage.navigateToForgotPassword();
      
      // Verify navigation (you would add specific checks for forgot password screen)
      console.log('Navigated to forgot password screen');
    });

    it('should navigate to sign up screen', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Navigate to sign up
      await loginPage.navigateToSignUp();
      
      // Verify navigation (you would add specific checks for sign up screen)
      console.log('Navigated to sign up screen');
    });
  });

  describe('User Session Tests', () => {
    it('should access user profile after login', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform login
      await loginPage.login('test@example.com', 'password123');
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).to.be.true;
      
      // Access profile
      await loginPage.accessProfile();
      
      // Verify profile access (you would add specific checks for profile screen)
      console.log('Accessed user profile');
    });

    it('should successfully logout', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform login
      await loginPage.login('test@example.com', 'password123');
      
      // Verify login success
      const isLoggedIn = await loginPage.verifyLoginSuccess();
      expect(isLoggedIn).to.be.true;
      
      // Logout
      await loginPage.logout();
      
      // Verify logout
      const isStillLoggedIn = await loginPage.isLoggedIn();
      expect(isStillLoggedIn).to.be.false;
    });
  });

  describe('Device Interaction Tests', () => {
    it('should handle device orientation changes', async () => {
      // Get current orientation
      const initialOrientation = await loginPage.getOrientation();
      
      // Change orientation
      const newOrientation = initialOrientation === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT';
      await loginPage.setOrientation(newOrientation);
      
      // Verify orientation change
      const currentOrientation = await loginPage.getOrientation();
      expect(currentOrientation).to.equal(newOrientation);
      
      // Restore original orientation
      await loginPage.setOrientation(initialOrientation);
    });

    it('should perform swipe gestures', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Perform swipe up
      await loginPage.swipeUp();
      
      // Perform swipe down
      await loginPage.swipeDown();
      
      // Perform swipe left
      await loginPage.swipeLeft();
      
      // Perform swipe right
      await loginPage.swipeRight();
      
      console.log('Successfully performed all swipe gestures');
    });

    it('should handle keyboard interactions', async () => {
      // Navigate to login screen
      await loginPage.navigateToLogin();
      
      // Fill email field (this will show keyboard)
      const locators = await (loginPage as any).getLocators();
      await loginPage.fillInput(locators.emailInput, 'test@example.com');
      
      // Hide keyboard
      await loginPage.hideKeyboard();
      
      console.log('Successfully handled keyboard interactions');
    });
  });

  describe('Device Information Tests', () => {
    it('should get device information', async () => {
      const deviceInfo = await loginPage.getDeviceInfo();
      
      expect(deviceInfo).to.have.property('platform');
      expect(deviceInfo).to.have.property('version');
      expect(deviceInfo).to.have.property('device');
      
      console.log('Device Info:', deviceInfo);
    });

    it('should get current activity/screen', async () => {
      const currentActivity = await loginPage.getCurrentActivity();
      expect(currentActivity).to.be.a('string');
      
      console.log('Current Activity:', currentActivity);
    });
  });
});
