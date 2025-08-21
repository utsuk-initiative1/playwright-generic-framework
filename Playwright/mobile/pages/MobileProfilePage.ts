import { Remote } from 'webdriverio';
import { BaseMobilePage } from '../core/BaseMobilePage';

export class MobileProfilePage extends BaseMobilePage {
  // Android locators
  private readonly androidProfileImage = '~profile_image, #profile-image, [resource-id="profile_image"]';
  private readonly androidEditProfileButton = '~edit_profile, #edit-profile, [resource-id="edit_profile"]';
  private readonly androidNameField = '~name_field, #name, [resource-id="name"]';
  private readonly androidEmailField = '~email_field, #email, [resource-id="email"]';
  private readonly androidPhoneField = '~phone_field, #phone, [resource-id="phone"]';
  private readonly androidSaveButton = '~save_button, #save, [resource-id="save"]';
  private readonly androidCancelButton = '~cancel_button, #cancel, [resource-id="cancel"]';
  private readonly androidChangePasswordButton = '~change_password, #change-password, [resource-id="change_password"]';
  private readonly androidDeleteAccountButton = '~delete_account, #delete-account, [resource-id="delete_account"]';
  private readonly androidBackButton = '~back_button, #back, [resource-id="back"]';
  private readonly androidProfileStats = '~profile_stats, #stats, [resource-id="profile_stats"]';

  // iOS locators
  private readonly iosProfileImage = '-ios predicate string:type == "XCUIElementTypeImage" AND name == "Profile Image"';
  private readonly iosEditProfileButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Edit Profile"';
  private readonly iosNameField = '-ios predicate string:type == "XCUIElementTypeTextField" AND name == "Name"';
  private readonly iosEmailField = '-ios predicate string:type == "XCUIElementTypeTextField" AND name == "Email"';
  private readonly iosPhoneField = '-ios predicate string:type == "XCUIElementTypeTextField" AND name == "Phone"';
  private readonly iosSaveButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Save"';
  private readonly iosCancelButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Cancel"';
  private readonly iosChangePasswordButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Change Password"';
  private readonly iosDeleteAccountButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Delete Account"';
  private readonly iosBackButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Back"';
  private readonly iosProfileStats = '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "Stats"';

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
        profileImage: this.androidProfileImage,
        editProfileButton: this.androidEditProfileButton,
        nameField: this.androidNameField,
        emailField: this.androidEmailField,
        phoneField: this.androidPhoneField,
        saveButton: this.androidSaveButton,
        cancelButton: this.androidCancelButton,
        changePasswordButton: this.androidChangePasswordButton,
        deleteAccountButton: this.androidDeleteAccountButton,
        backButton: this.androidBackButton,
        profileStats: this.androidProfileStats
      };
    } else {
      return {
        profileImage: this.iosProfileImage,
        editProfileButton: this.iosEditProfileButton,
        nameField: this.iosNameField,
        emailField: this.iosEmailField,
        phoneField: this.iosPhoneField,
        saveButton: this.iosSaveButton,
        cancelButton: this.iosCancelButton,
        changePasswordButton: this.iosChangePasswordButton,
        deleteAccountButton: this.iosDeleteAccountButton,
        backButton: this.iosBackButton,
        profileStats: this.iosProfileStats
      };
    }
  }

  /**
   * Wait for profile page to load
   */
  async waitForProfileLoad(): Promise<void> {
    const locators = await this.getLocators();
    await this.waitForElement(locators.profileImage, 15000);
  }

  /**
   * Verify profile page is displayed
   */
  async isProfilePageDisplayed(): Promise<boolean> {
    try {
      const locators = await this.getLocators();
      const profileImageVisible = await this.isElementDisplayed(locators.profileImage);
      const editButtonVisible = await this.isElementDisplayed(locators.editProfileButton);
      return profileImageVisible && editButtonVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get current profile information
   */
  async getProfileInfo(): Promise<{
    name: string;
    email: string;
    phone: string;
  }> {
    const locators = await this.getLocators();
    
    const name = await this.getElementText(locators.nameField);
    const email = await this.getElementText(locators.emailField);
    const phone = await this.getElementText(locators.phoneField);
    
    return {
      name: name || '',
      email: email || '',
      phone: phone || ''
    };
  }

  /**
   * Start editing profile
   */
  async startEditingProfile(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.editProfileButton);
  }

  /**
   * Update profile information
   */
  async updateProfile(info: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    const locators = await this.getLocators();
    
    if (info.name) {
      await this.fillInput(locators.nameField, info.name);
    }
    
    if (info.email) {
      await this.fillInput(locators.emailField, info.email);
    }
    
    if (info.phone) {
      await this.fillInput(locators.phoneField, info.phone);
    }
  }

  /**
   * Save profile changes
   */
  async saveProfile(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.saveButton);
    await this.hideKeyboard();
  }

  /**
   * Cancel profile editing
   */
  async cancelProfileEditing(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.cancelButton);
  }

  /**
   * Change profile picture
   */
  async changeProfilePicture(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.profileImage);
    
    // Handle image picker dialog
    await this.handleImagePicker();
  }

  /**
   * Handle image picker dialog
   */
  private async handleImagePicker(): Promise<void> {
    const imagePickerSelectors = [
      '~Camera',
      '~Gallery',
      '~Photo Library',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Camera"',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Gallery"',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Photo Library"'
    ];

    for (const selector of imagePickerSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.click();
          break;
        }
      } catch (error) {
        // Element not found, continue
      }
    }
  }

  /**
   * Navigate to change password
   */
  async navigateToChangePassword(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.changePasswordButton);
  }

  /**
   * Navigate to delete account
   */
  async navigateToDeleteAccount(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.deleteAccountButton);
  }

  /**
   * Go back from profile page
   */
  async goBack(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.backButton);
  }

  /**
   * Get profile statistics
   */
  async getProfileStats(): Promise<string> {
    const locators = await this.getLocators();
    return await this.getElementText(locators.profileStats);
  }

  /**
   * Check if profile image is displayed
   */
  async isProfileImageDisplayed(): Promise<boolean> {
    const locators = await this.getLocators();
    return await this.isElementDisplayed(locators.profileImage);
  }

  /**
   * Tap on profile image
   */
  async tapProfileImage(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.profileImage);
  }

  /**
   * Verify profile update success
   */
  async verifyProfileUpdateSuccess(): Promise<boolean> {
    try {
      // Check if save button is no longer visible (indicating edit mode is closed)
      const locators = await this.getLocators();
      const saveButtonVisible = await this.isElementDisplayed(locators.saveButton);
      return !saveButtonVisible;
    } catch {
      return false;
    }
  }

  /**
   * Check for validation errors
   */
  async getValidationErrors(): Promise<string[]> {
    const errorSelectors = [
      '~validation_error',
      '~Error',
      '.error',
      '[resource-id="error"]',
      '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "error"',
      '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "invalid"'
    ];

    const errors: string[] = [];
    
    for (const selector of errorSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          const text = await element.getText();
          if (text) {
            errors.push(text.trim());
          }
        }
      } catch (error) {
        // Element not found, continue
      }
    }

    return errors;
  }

  /**
   * Clear profile fields
   */
  async clearProfileFields(): Promise<void> {
    const locators = await this.getLocators();
    
    await this.driver.$(locators.nameField).clearValue();
    await this.driver.$(locators.emailField).clearValue();
    await this.driver.$(locators.phoneField).clearValue();
  }

  /**
   * Take profile page screenshot
   */
  async takeProfileScreenshot(): Promise<string> {
    return await this.takeScreenshot('profile_page');
  }

  /**
   * Handle profile permissions
   */
  async handleProfilePermissions(): Promise<void> {
    const permissionSelectors = [
      '~Allow',
      '~OK',
      '~Continue',
      '~Accept',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Allow"',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "OK"'
    ];

    for (const selector of permissionSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.click();
          await this.waitForElement('~', 2000);
        }
      } catch (error) {
        // Element not found, continue
      }
    }
  }

  /**
   * Check if profile is in edit mode
   */
  async isInEditMode(): Promise<boolean> {
    const locators = await this.getLocators();
    return await this.isElementDisplayed(locators.saveButton);
  }

  /**
   * Get profile field values in edit mode
   */
  async getEditModeFieldValues(): Promise<{
    name: string;
    email: string;
    phone: string;
  }> {
    const locators = await this.getLocators();
    
    const name = await this.driver.$(locators.nameField).getValue();
    const email = await this.driver.$(locators.emailField).getValue();
    const phone = await this.driver.$(locators.phoneField).getValue();
    
    return {
      name: name || '',
      email: email || '',
      phone: phone || ''
    };
  }
}
