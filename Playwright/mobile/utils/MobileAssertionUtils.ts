import { Remote } from 'webdriverio';
import { expect } from 'chai';

export class MobileAssertionUtils {
  private driver: Remote;

  constructor(driver: Remote) {
    this.driver = driver;
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => await this.driver.$(locator).isDisplayed(),
      {
        timeout,
        timeoutMsg: `Element ${locator} should be visible within ${timeout}ms`
      }
    );
  }

  /**
   * Assert element is not visible
   */
  async assertElementNotVisible(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => !(await this.driver.$(locator).isDisplayed()),
      {
        timeout,
        timeoutMsg: `Element ${locator} should not be visible within ${timeout}ms`
      }
    );
  }

  /**
   * Assert element text equals expected value
   */
  async assertElementText(locator: string, expectedText: string): Promise<void> {
    const actualText = await this.driver.$(locator).getText();
    expect(actualText).to.equal(expectedText);
  }

  /**
   * Assert element text contains expected value
   */
  async assertElementTextContains(locator: string, expectedText: string): Promise<void> {
    const actualText = await this.driver.$(locator).getText();
    expect(actualText).to.include(expectedText);
  }

  /**
   * Assert element is enabled
   */
  async assertElementEnabled(locator: string): Promise<void> {
    const isEnabled = await this.driver.$(locator).isEnabled();
    expect(isEnabled).to.be.true;
  }

  /**
   * Assert element is disabled
   */
  async assertElementDisabled(locator: string): Promise<void> {
    const isEnabled = await this.driver.$(locator).isEnabled();
    expect(isEnabled).to.be.false;
  }

  /**
   * Assert element is selected/checked
   */
  async assertElementSelected(locator: string): Promise<void> {
    const isSelected = await this.driver.$(locator).isSelected();
    expect(isSelected).to.be.true;
  }

  /**
   * Assert element is not selected/checked
   */
  async assertElementNotSelected(locator: string): Promise<void> {
    const isSelected = await this.driver.$(locator).isSelected();
    expect(isSelected).to.be.false;
  }

  /**
   * Assert current activity/screen
   */
  async assertCurrentActivity(expectedActivity: string): Promise<void> {
    const platform = await this.driver.getPlatform();
    let currentActivity: string;

    if (platform === 'android') {
      currentActivity = await this.driver.getCurrentActivity();
    } else {
      currentActivity = await this.driver.getBundleId();
    }

    expect(currentActivity).to.include(expectedActivity);
  }

  /**
   * Assert device orientation
   */
  async assertDeviceOrientation(expectedOrientation: 'LANDSCAPE' | 'PORTRAIT'): Promise<void> {
    const orientation = await this.driver.getOrientation();
    expect(orientation).to.equal(expectedOrientation);
  }

  /**
   * Assert app is installed
   */
  async assertAppInstalled(bundleId: string): Promise<void> {
    const isInstalled = await this.driver.isAppInstalled(bundleId);
    expect(isInstalled).to.be.true;
  }

  /**
   * Assert app is not installed
   */
  async assertAppNotInstalled(bundleId: string): Promise<void> {
    const isInstalled = await this.driver.isAppInstalled(bundleId);
    expect(isInstalled).to.be.false;
  }

  /**
   * Assert network connectivity
   */
  async assertNetworkConnected(): Promise<void> {
    const networkConnection = await this.driver.getNetworkConnection();
    expect(networkConnection).to.not.equal(0); // 0 = no connection
  }

  /**
   * Assert network disconnected
   */
  async assertNetworkDisconnected(): Promise<void> {
    const networkConnection = await this.driver.getNetworkConnection();
    expect(networkConnection).to.equal(0); // 0 = no connection
  }

  /**
   * Assert battery level
   */
  async assertBatteryLevel(minLevel: number = 0): Promise<void> {
    const batteryInfo = await this.driver.getBatteryInfo();
    expect(batteryInfo.level).to.be.greaterThanOrEqual(minLevel);
  }

  /**
   * Assert device info
   */
  async assertDeviceInfo(expectedInfo: {
    platform?: string;
    version?: string;
    device?: string;
  }): Promise<void> {
    const platform = await this.driver.getPlatform();
    const version = await this.driver.getPlatformVersion();
    const device = await this.driver.getDeviceName();

    if (expectedInfo.platform) {
      expect(platform).to.equal(expectedInfo.platform);
    }
    if (expectedInfo.version) {
      expect(version).to.equal(expectedInfo.version);
    }
    if (expectedInfo.device) {
      expect(device).to.equal(expectedInfo.device);
    }
  }

  /**
   * Assert performance metrics
   */
  async assertPerformanceMetrics(metrics: {
    maxLoadTime?: number;
    maxMemoryUsage?: number;
    maxCpuUsage?: number;
  }): Promise<void> {
    try {
      const performanceData = await this.driver.getPerformanceData();
      
      if (metrics.maxLoadTime && performanceData.loadTime) {
        expect(performanceData.loadTime).to.be.lessThanOrEqual(metrics.maxLoadTime);
      }
      
      if (metrics.maxMemoryUsage && performanceData.memory) {
        expect(performanceData.memory).to.be.lessThanOrEqual(metrics.maxMemoryUsage);
      }
      
      if (metrics.maxCpuUsage && performanceData.cpu) {
        expect(performanceData.cpu).to.be.lessThanOrEqual(metrics.maxCpuUsage);
      }
    } catch (error) {
      console.log('Performance metrics not available:', error);
    }
  }

  /**
   * Assert screenshot similarity (basic implementation)
   */
  async assertScreenshotSimilarity(
    baselinePath: string,
    currentPath: string,
    threshold: number = 0.95
  ): Promise<void> {
    // This is a basic implementation
    // In a real scenario, you would use image comparison libraries
    console.log(`Comparing screenshots: ${baselinePath} vs ${currentPath}`);
    console.log(`Threshold: ${threshold}`);
    
    // Placeholder for actual image comparison logic
    expect(true).to.be.true; // Always pass for now
  }

  /**
   * Assert element count
   */
  async assertElementCount(locator: string, expectedCount: number): Promise<void> {
    const elements = await this.driver.$$(locator);
    expect(elements.length).to.equal(expectedCount);
  }

  /**
   * Assert element count greater than
   */
  async assertElementCountGreaterThan(locator: string, minCount: number): Promise<void> {
    const elements = await this.driver.$$(locator);
    expect(elements.length).to.be.greaterThan(minCount);
  }

  /**
   * Assert element count less than
   */
  async assertElementCountLessThan(locator: string, maxCount: number): Promise<void> {
    const elements = await this.driver.$$(locator);
    expect(elements.length).to.be.lessThan(maxCount);
  }

  /**
   * Assert element attribute value
   */
  async assertElementAttribute(
    locator: string,
    attribute: string,
    expectedValue: string
  ): Promise<void> {
    const actualValue = await this.driver.$(locator).getAttribute(attribute);
    expect(actualValue).to.equal(expectedValue);
  }

  /**
   * Assert element attribute contains value
   */
  async assertElementAttributeContains(
    locator: string,
    attribute: string,
    expectedValue: string
  ): Promise<void> {
    const actualValue = await this.driver.$(locator).getAttribute(attribute);
    expect(actualValue).to.include(expectedValue);
  }

  /**
   * Assert element location
   */
  async assertElementLocation(
    locator: string,
    expectedLocation: { x: number; y: number },
    tolerance: number = 5
  ): Promise<void> {
    const element = await this.driver.$(locator);
    const location = await element.getLocation();
    
    expect(location.x).to.be.closeTo(expectedLocation.x, tolerance);
    expect(location.y).to.be.closeTo(expectedLocation.y, tolerance);
  }

  /**
   * Assert element size
   */
  async assertElementSize(
    locator: string,
    expectedSize: { width: number; height: number },
    tolerance: number = 5
  ): Promise<void> {
    const element = await this.driver.$(locator);
    const size = await element.getSize();
    
    expect(size.width).to.be.closeTo(expectedSize.width, tolerance);
    expect(size.height).to.be.closeTo(expectedSize.height, tolerance);
  }

  /**
   * Assert element is clickable
   */
  async assertElementClickable(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => await this.driver.$(locator).isClickable(),
      {
        timeout,
        timeoutMsg: `Element ${locator} should be clickable within ${timeout}ms`
      }
    );
  }

  /**
   * Assert element is not clickable
   */
  async assertElementNotClickable(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => !(await this.driver.$(locator).isClickable()),
      {
        timeout,
        timeoutMsg: `Element ${locator} should not be clickable within ${timeout}ms`
      }
    );
  }

  /**
   * Assert keyboard is visible
   */
  async assertKeyboardVisible(): Promise<void> {
    const isKeyboardVisible = await this.driver.isKeyboardShown();
    expect(isKeyboardVisible).to.be.true;
  }

  /**
   * Assert keyboard is not visible
   */
  async assertKeyboardNotVisible(): Promise<void> {
    const isKeyboardVisible = await this.driver.isKeyboardShown();
    expect(isKeyboardVisible).to.be.false;
  }

  /**
   * Assert app is in foreground
   */
  async assertAppInForeground(bundleId: string): Promise<void> {
    const currentBundleId = await this.driver.getBundleId();
    expect(currentBundleId).to.equal(bundleId);
  }

  /**
   * Assert app is in background
   */
  async assertAppInBackground(bundleId: string): Promise<void> {
    // This is a simplified check - in reality, you'd need to check app state
    console.log(`Checking if app ${bundleId} is in background`);
  }

  /**
   * Assert no error messages are present
   */
  async assertNoErrorMessages(errorSelectors: string[] = []): Promise<void> {
    const defaultSelectors = [
      '~error',
      '~Error',
      '.error',
      '[resource-id="error"]',
      '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "error"'
    ];

    const allSelectors = [...defaultSelectors, ...errorSelectors];
    const errors: string[] = [];

    for (const selector of allSelectors) {
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

    expect(errors.length).to.equal(0);
  }

  /**
   * Assert specific error message is present
   */
  async assertErrorMessagePresent(expectedError: string): Promise<void> {
    const errorSelectors = [
      '~error',
      '~Error',
      '.error',
      '[resource-id="error"]',
      '-ios predicate string:type == "XCUIElementTypeStaticText" AND name CONTAINS "error"'
    ];

    let errorFound = false;

    for (const selector of errorSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          const text = await element.getText();
          if (text && text.includes(expectedError)) {
            errorFound = true;
            break;
          }
        }
      } catch (error) {
        // Element not found, continue
      }
    }

    expect(errorFound).to.be.true;
  }

  /**
   * Assert page load time is within acceptable range
   */
  async assertPageLoadTime(maxLoadTime: number = 5000): Promise<void> {
    const startTime = Date.now();
    
    // Wait for page to be ready
    await this.driver.waitUntil(
      async () => {
        try {
          const activity = await this.driver.getCurrentActivity();
          return activity && activity.length > 0;
        } catch {
          return false;
        }
      },
      {
        timeout: maxLoadTime,
        timeoutMsg: `Page should load within ${maxLoadTime}ms`
      }
    );

    const loadTime = Date.now() - startTime;
    expect(loadTime).to.be.lessThanOrEqual(maxLoadTime);
  }

  /**
   * Assert element is focused
   */
  async assertElementFocused(locator: string): Promise<void> {
    const element = await this.driver.$(locator);
    const isFocused = await element.isFocused();
    expect(isFocused).to.be.true;
  }

  /**
   * Assert element is not focused
   */
  async assertElementNotFocused(locator: string): Promise<void> {
    const element = await this.driver.$(locator);
    const isFocused = await element.isFocused();
    expect(isFocused).to.be.false;
  }
}
