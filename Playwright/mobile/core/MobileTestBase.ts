import { Remote } from 'webdriverio';
import { BaseMobilePage } from './BaseMobilePage';

export abstract class MobileTestBase {
  protected driver: Remote;
  protected basePage: BaseMobilePage;

  constructor(driver: Remote) {
    this.driver = driver;
    this.basePage = new BaseMobilePage(driver);
  }

  /**
   * Setup method to be called before each test
   */
  async setup(): Promise<void> {
    try {
      // Handle app permissions
      await this.handleAppPermissions();
      
      // Wait for app to be ready
      await this.waitForAppReady();
      
      // Take initial screenshot
      await this.basePage.takeScreenshot('test_start');
      
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  }

  /**
   * Teardown method to be called after each test
   */
  async teardown(): Promise<void> {
    try {
      // Take final screenshot
      await this.basePage.takeScreenshot('test_end');
      
      // Reset app state if needed
      await this.resetAppState();
      
    } catch (error) {
      console.error('Teardown failed:', error);
    }
  }

  /**
   * Handle app permissions that might appear
   */
  private async handleAppPermissions(): Promise<void> {
    const permissionSelectors = [
      '~Allow',
      '~OK',
      '~Continue',
      '~Accept',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Allow"',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "OK"',
      '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Continue"'
    ];

    for (const selector of permissionSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.click();
          await this.basePage.waitForElement('~', 2000); // Wait for dialog to disappear
        }
      } catch (error) {
        // Element not found, continue
      }
    }
  }

  /**
   * Wait for app to be fully loaded and ready
   */
  private async waitForAppReady(): Promise<void> {
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
        timeout: 30000,
        timeoutMsg: 'App did not load within 30 seconds'
      }
    );
  }

  /**
   * Reset app state between tests
   */
  private async resetAppState(): Promise<void> {
    try {
      // Close and relaunch app
      await this.driver.terminateApp(await this.driver.getBundleId());
      await this.driver.activateApp(await this.driver.getBundleId());
    } catch (error) {
      console.log('Could not reset app state:', error);
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<{ platform: string; version: string; device: string; orientation: string }> {
    const platform = await this.driver.getPlatform();
    const version = await this.driver.getPlatformVersion();
    const device = await this.driver.getDeviceName();
    const orientation = await this.driver.getOrientation();
    
    return { platform, version, device, orientation };
  }

  /**
   * Set network conditions for testing
   */
  async setNetworkConditions(conditions: {
    offline?: boolean;
    latency?: number;
    downloadThroughput?: number;
    uploadThroughput?: number;
  }): Promise<void> {
    try {
      await this.driver.setNetworkConditions(conditions);
    } catch (error) {
      console.log('Network conditions not supported on this device:', error);
    }
  }

  /**
   * Reset network conditions to normal
   */
  async resetNetworkConditions(): Promise<void> {
    try {
      await this.driver.setNetworkConditions({
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1
      });
    } catch (error) {
      console.log('Could not reset network conditions:', error);
    }
  }

  /**
   * Get app performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    try {
      return await this.driver.getPerformanceData();
    } catch (error) {
      console.log('Performance metrics not available:', error);
      return {};
    }
  }

  /**
   * Lock device
   */
  async lockDevice(): Promise<void> {
    try {
      await this.driver.lock();
    } catch (error) {
      console.log('Device lock not supported:', error);
    }
  }

  /**
   * Unlock device
   */
  async unlockDevice(): Promise<void> {
    try {
      await this.driver.unlock();
    } catch (error) {
      console.log('Device unlock not supported:', error);
    }
  }

  /**
   * Rotate device
   */
  async rotateDevice(orientation: 'LANDSCAPE' | 'PORTRAIT'): Promise<void> {
    await this.driver.setOrientation(orientation);
  }

  /**
   * Shake device
   */
  async shakeDevice(): Promise<void> {
    try {
      await this.driver.shake();
    } catch (error) {
      console.log('Device shake not supported:', error);
    }
  }

  /**
   * Get app logs
   */
  async getAppLogs(): Promise<string[]> {
    try {
      const logs = await this.driver.getLogs('syslog');
      return logs.map((log: any) => log.message);
    } catch (error) {
      console.log('Could not get app logs:', error);
      return [];
    }
  }

  /**
   * Clear app data
   */
  async clearAppData(): Promise<void> {
    try {
      await this.driver.reset();
    } catch (error) {
      console.log('Could not clear app data:', error);
    }
  }
}
