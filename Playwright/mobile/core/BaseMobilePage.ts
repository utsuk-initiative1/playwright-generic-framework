import { Remote } from 'webdriverio';

export abstract class BaseMobilePage {
  protected driver: Remote;

  constructor(driver: Remote) {
    this.driver = driver;
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => await this.driver.$(locator).isDisplayed(),
      {
        timeout,
        timeoutMsg: `Element ${locator} not visible after ${timeout}ms`
      }
    );
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(locator: string, timeout: number = 10000): Promise<void> {
    await this.driver.waitUntil(
      async () => await this.driver.$(locator).isClickable(),
      {
        timeout,
        timeoutMsg: `Element ${locator} not clickable after ${timeout}ms`
      }
    );
  }

  /**
   * Click on element
   */
  async clickElement(locator: string): Promise<void> {
    await this.waitForClickable(locator);
    await this.driver.$(locator).click();
  }

  /**
   * Fill input field
   */
  async fillInput(locator: string, value: string): Promise<void> {
    await this.waitForElement(locator);
    await this.driver.$(locator).setValue(value);
  }

  /**
   * Get element text
   */
  async getElementText(locator: string): Promise<string> {
    await this.waitForElement(locator);
    return await this.driver.$(locator).getText();
  }

  /**
   * Check if element is displayed
   */
  async isElementDisplayed(locator: string): Promise<boolean> {
    try {
      return await this.driver.$(locator).isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: string): Promise<void> {
    const element = await this.driver.$(locator);
    await element.scrollIntoView();
  }

  /**
   * Swipe gesture
   */
  async swipe(startX: number, startY: number, endX: number, endY: number, duration: number = 1000): Promise<void> {
    await this.driver.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: duration },
      { action: 'moveTo', x: endX, y: endY },
      'release'
    ]);
  }

  /**
   * Swipe up
   */
  async swipeUp(): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const startX = width * 0.5;
    const startY = height * 0.8;
    const endY = height * 0.2;
    await this.swipe(startX, startY, startX, endY);
  }

  /**
   * Swipe down
   */
  async swipeDown(): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const startX = width * 0.5;
    const startY = height * 0.2;
    const endY = height * 0.8;
    await this.swipe(startX, startY, startX, endY);
  }

  /**
   * Swipe left
   */
  async swipeLeft(): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const startX = width * 0.8;
    const startY = height * 0.5;
    const endX = width * 0.2;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Swipe right
   */
  async swipeRight(): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const startX = width * 0.2;
    const startY = height * 0.5;
    const endX = width * 0.8;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Tap on coordinates
   */
  async tap(x: number, y: number): Promise<void> {
    await this.driver.touchAction([
      { action: 'tap', x, y }
    ]);
  }

  /**
   * Long press on element
   */
  async longPress(locator: string, duration: number = 2000): Promise<void> {
    const element = await this.driver.$(locator);
    await this.driver.touchAction([
      { action: 'longPress', element, ms: duration }
    ]);
  }

  /**
   * Get current activity (Android) or bundle ID (iOS)
   */
  async getCurrentActivity(): Promise<string> {
    const platform = await this.driver.getPlatform();
    if (platform === 'android') {
      return await this.driver.getCurrentActivity();
    } else {
      return await this.driver.getBundleId();
    }
  }

  /**
   * Hide keyboard
   */
  async hideKeyboard(): Promise<void> {
    try {
      await this.driver.hideKeyboard();
    } catch (error) {
      // Keyboard might not be visible, ignore error
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./screenshots/${name}_${timestamp}.png`;
    await this.driver.saveScreenshot(filename);
    return filename;
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.driver.waitUntil(
      async () => await this.driver.execute(() => document.readyState === 'complete'),
      {
        timeout: 10000,
        timeoutMsg: 'Page did not load completely'
      }
    );
  }

  /**
   * Get device orientation
   */
  async getOrientation(): Promise<string> {
    return await this.driver.getOrientation();
  }

  /**
   * Set device orientation
   */
  async setOrientation(orientation: 'LANDSCAPE' | 'PORTRAIT'): Promise<void> {
    await this.driver.setOrientation(orientation);
  }

  /**
   * Get device info
   */
  async getDeviceInfo(): Promise<{ platform: string; version: string; device: string }> {
    const platform = await this.driver.getPlatform();
    const version = await this.driver.getPlatformVersion();
    const device = await this.driver.getDeviceName();
    return { platform, version, device };
  }
}
