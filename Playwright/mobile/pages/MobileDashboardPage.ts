import { Remote } from 'webdriverio';
import { BaseMobilePage } from '../core/BaseMobilePage';

export class MobileDashboardPage extends BaseMobilePage {
  // Android locators
  private readonly androidMenuButton = '~menu_button, #menu, [resource-id="menu"]';
  private readonly androidProfileButton = '~profile_button, #profile, [resource-id="profile"]';
  private readonly androidSettingsButton = '~settings_button, #settings, [resource-id="settings"]';
  private readonly androidNotificationsButton = '~notifications_button, #notifications, [resource-id="notifications"]';
  private readonly androidSearchButton = '~search_button, #search, [resource-id="search"]';
  private readonly androidLogoutButton = '~logout_button, #logout, [resource-id="logout"]';
  private readonly androidWelcomeText = '~welcome_text, #welcome, [resource-id="welcome"]';
  private readonly androidUserAvatar = '~user_avatar, #avatar, [resource-id="avatar"]';
  private readonly androidQuickActions = '~quick_actions, #quick-actions, [resource-id="quick_actions"]';
  private readonly androidBottomNav = '~bottom_navigation, #bottom-nav, [resource-id="bottom_navigation"]';

  // iOS locators
  private readonly iosMenuButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Menu"';
  private readonly iosProfileButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Profile"';
  private readonly iosSettingsButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Settings"';
  private readonly iosNotificationsButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Notifications"';
  private readonly iosSearchButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Search"';
  private readonly iosLogoutButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Logout"';
  private readonly iosWelcomeText = '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "Welcome"';
  private readonly iosUserAvatar = '-ios predicate string:type == "XCUIElementTypeImage" AND name == "User Avatar"';
  private readonly iosQuickActions = '-ios predicate string:type == "XCUIElementTypeCollectionView" AND name == "Quick Actions"';
  private readonly iosBottomNav = '-ios predicate string:type == "XCUIElementTypeTabBar"';

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
        menuButton: this.androidMenuButton,
        profileButton: this.androidProfileButton,
        settingsButton: this.androidSettingsButton,
        notificationsButton: this.androidNotificationsButton,
        searchButton: this.androidSearchButton,
        logoutButton: this.androidLogoutButton,
        welcomeText: this.androidWelcomeText,
        userAvatar: this.androidUserAvatar,
        quickActions: this.androidQuickActions,
        bottomNav: this.androidBottomNav
      };
    } else {
      return {
        menuButton: this.iosMenuButton,
        profileButton: this.iosProfileButton,
        settingsButton: this.iosSettingsButton,
        notificationsButton: this.iosNotificationsButton,
        searchButton: this.iosSearchButton,
        logoutButton: this.iosLogoutButton,
        welcomeText: this.iosWelcomeText,
        userAvatar: this.iosUserAvatar,
        quickActions: this.iosQuickActions,
        bottomNav: this.iosBottomNav
      };
    }
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad(): Promise<void> {
    const locators = await this.getLocators();
    await this.waitForElement(locators.welcomeText, 15000);
  }

  /**
   * Verify dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    try {
      const locators = await this.getLocators();
      const welcomeVisible = await this.isElementDisplayed(locators.welcomeText);
      const menuVisible = await this.isElementDisplayed(locators.menuButton);
      return welcomeVisible && menuVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    const locators = await this.getLocators();
    return await this.getElementText(locators.welcomeText);
  }

  /**
   * Open menu
   */
  async openMenu(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.menuButton);
  }

  /**
   * Navigate to profile
   */
  async navigateToProfile(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.profileButton);
  }

  /**
   * Navigate to settings
   */
  async navigateToSettings(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.settingsButton);
  }

  /**
   * Open notifications
   */
  async openNotifications(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.notificationsButton);
  }

  /**
   * Open search
   */
  async openSearch(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.searchButton);
  }

  /**
   * Logout from dashboard
   */
  async logout(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.logoutButton);
  }

  /**
   * Check if user avatar is displayed
   */
  async isUserAvatarDisplayed(): Promise<boolean> {
    const locators = await this.getLocators();
    return await this.isElementDisplayed(locators.userAvatar);
  }

  /**
   * Tap on user avatar
   */
  async tapUserAvatar(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.userAvatar);
  }

  /**
   * Check if quick actions are available
   */
  async areQuickActionsAvailable(): Promise<boolean> {
    const locators = await this.getLocators();
    return await this.isElementDisplayed(locators.quickActions);
  }

  /**
   * Get quick actions count
   */
  async getQuickActionsCount(): Promise<number> {
    const locators = await this.getLocators();
    try {
      const quickActionsElement = await this.driver.$(locators.quickActions);
      const children = await quickActionsElement.$$('*');
      return children.length;
    } catch {
      return 0;
    }
  }

  /**
   * Tap on quick action by index
   */
  async tapQuickAction(index: number): Promise<void> {
    const locators = await this.getLocators();
    const quickActionsElement = await this.driver.$(locators.quickActions);
    const actions = await quickActionsElement.$$('*');
    
    if (actions[index]) {
      await actions[index].click();
    } else {
      throw new Error(`Quick action at index ${index} not found`);
    }
  }

  /**
   * Check if bottom navigation is available
   */
  async isBottomNavigationAvailable(): Promise<boolean> {
    const locators = await this.getLocators();
    return await this.isElementDisplayed(locators.bottomNav);
  }

  /**
   * Navigate using bottom navigation
   */
  async navigateWithBottomNav(tabName: string): Promise<void> {
    const locators = await this.getLocators();
    const bottomNav = await this.driver.$(locators.bottomNav);
    
    // Find tab by name
    const tab = await bottomNav.$(`~${tabName}, -ios predicate string:name == "${tabName}"`);
    if (await tab.isDisplayed()) {
      await tab.click();
    } else {
      throw new Error(`Tab "${tabName}" not found in bottom navigation`);
    }
  }

  /**
   * Swipe to refresh dashboard
   */
  async pullToRefresh(): Promise<void> {
    await this.swipeDown();
  }

  /**
   * Take dashboard screenshot
   */
  async takeDashboardScreenshot(): Promise<string> {
    return await this.takeScreenshot('dashboard');
  }

  /**
   * Get dashboard performance metrics
   */
  async getDashboardMetrics(): Promise<{
    loadTime: number;
    elementCount: number;
    memoryUsage: number;
  }> {
    const startTime = Date.now();
    
    // Wait for dashboard to be fully loaded
    await this.waitForDashboardLoad();
    
    const loadTime = Date.now() - startTime;
    
    // Count visible elements
    const locators = await this.getLocators();
    let elementCount = 0;
    
    for (const [key, selector] of Object.entries(locators)) {
      if (await this.isElementDisplayed(selector)) {
        elementCount++;
      }
    }

    // Get memory usage (if available)
    let memoryUsage = 0;
    try {
      const metrics = await this.driver.getPerformanceData();
      memoryUsage = metrics.memory || 0;
    } catch {
      // Memory metrics not available
    }

    return {
      loadTime,
      elementCount,
      memoryUsage
    };
  }

  /**
   * Handle dashboard permissions
   */
  async handleDashboardPermissions(): Promise<void> {
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
   * Check for any error messages on dashboard
   */
  async getDashboardErrors(): Promise<string[]> {
    const errorSelectors = [
      '~error_message',
      '~Error',
      '.error',
      '[resource-id="error"]',
      '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "error"'
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
}
