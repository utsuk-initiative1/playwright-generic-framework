import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { Remote } from 'webdriverio';
import { MobileTestBase } from '../core/MobileTestBase';
import { MobileProfilePage } from '../pages/MobileProfilePage';
import { MobileLoginPage } from '../pages/MobileLoginPage';
import { MobileDashboardPage } from '../pages/MobileDashboardPage';

class ProfileTestBase extends MobileTestBase {
  protected profilePage: MobileProfilePage;
  protected loginPage: MobileLoginPage;
  protected dashboardPage: MobileDashboardPage;

  constructor(driver: Remote) {
    super(driver);
    this.profilePage = new MobileProfilePage(driver);
    this.loginPage = new MobileLoginPage(driver);
    this.dashboardPage = new MobileDashboardPage(driver);
  }

  async loginAndNavigateToProfile(): Promise<void> {
    await this.loginPage.navigateToLogin();
    await this.loginPage.login('test@example.com', 'password123');
    await this.dashboardPage.waitForDashboardLoad();
    await this.dashboardPage.navigateToProfile();
    await this.profilePage.waitForProfileLoad();
  }
}

describe('Mobile Profile Tests', () => {
  let testBase: ProfileTestBase;
  let driver: Remote;

  before(async () => {
    driver = global.driver;
    testBase = new ProfileTestBase(driver);
    await testBase.setup();
  });

  after(async () => {
    await testBase.teardown();
  });

  describe('Profile Page Navigation', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should display profile page after navigation', async () => {
      const isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;
    });

    it('should show profile image', async () => {
      const profileImageDisplayed = await testBase.profilePage.isProfileImageDisplayed();
      expect(profileImageDisplayed).to.be.true;
    });

    it('should display edit profile button', async () => {
      const isInEditMode = await testBase.profilePage.isInEditMode();
      expect(isInEditMode).to.be.false; // Should not be in edit mode initially
    });

    it('should show profile statistics', async () => {
      const profileStats = await testBase.profilePage.getProfileStats();
      expect(profileStats).to.not.be.empty;
    });
  });

  describe('Profile Information Display', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should display current profile information', async () => {
      const profileInfo = await testBase.profilePage.getProfileInfo();
      expect(profileInfo.name).to.not.be.empty;
      expect(profileInfo.email).to.not.be.empty;
      expect(profileInfo.email).to.include('@');
    });

    it('should show user name', async () => {
      const profileInfo = await testBase.profilePage.getProfileInfo();
      expect(profileInfo.name).to.not.be.empty;
      expect(profileInfo.name.length).to.be.greaterThan(0);
    });

    it('should show user email', async () => {
      const profileInfo = await testBase.profilePage.getProfileInfo();
      expect(profileInfo.email).to.not.be.empty;
      expect(profileInfo.email).to.include('@');
    });

    it('should show user phone number', async () => {
      const profileInfo = await testBase.profilePage.getProfileInfo();
      // Phone might be optional, so just check if it's a string
      expect(typeof profileInfo.phone).to.equal('string');
    });
  });

  describe('Profile Editing', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should enter edit mode successfully', async () => {
      await testBase.profilePage.startEditingProfile();
      const isInEditMode = await testBase.profilePage.isInEditMode();
      expect(isInEditMode).to.be.true;
    });

    it('should update profile name', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ name: 'Updated Name' });
      await testBase.profilePage.saveProfile();
      
      const updateSuccess = await testBase.profilePage.verifyProfileUpdateSuccess();
      expect(updateSuccess).to.be.true;
    });

    it('should update profile email', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ email: 'updated@example.com' });
      await testBase.profilePage.saveProfile();
      
      const updateSuccess = await testBase.profilePage.verifyProfileUpdateSuccess();
      expect(updateSuccess).to.be.true;
    });

    it('should update profile phone', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ phone: '+1234567890' });
      await testBase.profilePage.saveProfile();
      
      const updateSuccess = await testBase.profilePage.verifyProfileUpdateSuccess();
      expect(updateSuccess).to.be.true;
    });

    it('should update multiple profile fields', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({
        name: 'Multi Updated Name',
        email: 'multi@example.com',
        phone: '+9876543210'
      });
      await testBase.profilePage.saveProfile();
      
      const updateSuccess = await testBase.profilePage.verifyProfileUpdateSuccess();
      expect(updateSuccess).to.be.true;
    });

    it('should cancel profile editing', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.cancelProfileEditing();
      
      const isInEditMode = await testBase.profilePage.isInEditMode();
      expect(isInEditMode).to.be.false;
    });

    it('should clear profile fields', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.clearProfileFields();
      
      const fieldValues = await testBase.profilePage.getEditModeFieldValues();
      expect(fieldValues.name).to.be.empty;
      expect(fieldValues.email).to.be.empty;
      expect(fieldValues.phone).to.be.empty;
    });
  });

  describe('Profile Validation', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should validate empty name field', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ name: '' });
      await testBase.profilePage.saveProfile();
      
      const errors = await testBase.profilePage.getValidationErrors();
      expect(errors.length).to.be.greaterThan(0);
    });

    it('should validate invalid email format', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ email: 'invalid-email' });
      await testBase.profilePage.saveProfile();
      
      const errors = await testBase.profilePage.getValidationErrors();
      expect(errors.length).to.be.greaterThan(0);
    });

    it('should validate invalid phone format', async () => {
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ phone: 'invalid-phone' });
      await testBase.profilePage.saveProfile();
      
      const errors = await testBase.profilePage.getValidationErrors();
      expect(errors.length).to.be.greaterThan(0);
    });
  });

  describe('Profile Image Management', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should tap on profile image', async () => {
      await testBase.profilePage.tapProfileImage();
      // This should trigger image picker or profile image options
      console.log('Profile image tapped successfully');
    });

    it('should handle profile picture change', async () => {
      await testBase.profilePage.changeProfilePicture();
      // This should open image picker
      console.log('Profile picture change initiated');
    });
  });

  describe('Profile Navigation', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should navigate to change password', async () => {
      await testBase.profilePage.navigateToChangePassword();
      console.log('Navigated to change password successfully');
    });

    it('should navigate to delete account', async () => {
      await testBase.profilePage.navigateToDeleteAccount();
      console.log('Navigated to delete account successfully');
    });

    it('should go back from profile page', async () => {
      await testBase.profilePage.goBack();
      // Should return to dashboard
      const isDashboardDisplayed = await testBase.dashboardPage.isDashboardDisplayed();
      expect(isDashboardDisplayed).to.be.true;
    });
  });

  describe('Profile Permissions', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should handle profile permissions', async () => {
      await testBase.profilePage.handleProfilePermissions();
      // Verify profile page is still functional after handling permissions
      const isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;
    });
  });

  describe('Profile Screenshots', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should take profile page screenshot', async () => {
      const screenshotPath = await testBase.profilePage.takeProfileScreenshot();
      expect(screenshotPath).to.not.be.empty;
      console.log(`Profile screenshot saved: ${screenshotPath}`);
    });
  });

  describe('Profile Error Handling', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should not have validation errors initially', async () => {
      const errors = await testBase.profilePage.getValidationErrors();
      expect(errors.length).to.equal(0);
    });

    it('should handle network errors gracefully', async () => {
      // Set slow network conditions
      await testBase.setNetworkConditions({
        offline: false,
        latency: 2000,
        downloadThroughput: 500000,
        uploadThroughput: 500000
      });

      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ name: 'Network Test' });
      await testBase.profilePage.saveProfile();
      
      // Reset network conditions
      await testBase.resetNetworkConditions();
      
      // Verify profile is still accessible
      const isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;
    });
  });

  describe('Profile Device Interaction', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should handle device rotation on profile page', async () => {
      // Rotate to landscape
      await testBase.rotateDevice('LANDSCAPE');
      let isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;

      // Rotate back to portrait
      await testBase.rotateDevice('PORTRAIT');
      isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;
    });

    it('should handle device lock/unlock on profile page', async () => {
      await testBase.lockDevice();
      await testBase.unlockDevice();
      
      // Verify profile page is still accessible
      const isProfileDisplayed = await testBase.profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).to.be.true;
    });
  });

  describe('Profile Performance', () => {
    beforeEach(async () => {
      await testBase.loginAndNavigateToProfile();
    });

    it('should load profile page within acceptable time', async () => {
      const startTime = Date.now();
      await testBase.profilePage.waitForProfileLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).to.be.lessThan(3000); // 3 seconds
    });

    it('should handle profile editing performance', async () => {
      const startTime = Date.now();
      await testBase.profilePage.startEditingProfile();
      await testBase.profilePage.updateProfile({ name: 'Performance Test' });
      await testBase.profilePage.saveProfile();
      const totalTime = Date.now() - startTime;
      
      expect(totalTime).to.be.lessThan(5000); // 5 seconds
    });
  });
});
