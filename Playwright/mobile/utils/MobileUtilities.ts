import { Remote } from 'webdriverio';

export class MobileUtilities {
  private driver: Remote;

  constructor(driver: Remote) {
    this.driver = driver;
  }

  /**
   * Wait for app to be ready
   */
  async waitForAppReady(timeout: number = 30000): Promise<void> {
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
        timeout,
        timeoutMsg: `App not ready after ${timeout}ms`
      }
    );
  }

  /**
   * Install app on device
   */
  async installApp(appPath: string): Promise<void> {
    await this.driver.installApp(appPath);
  }

  /**
   * Uninstall app from device
   */
  async uninstallApp(bundleId: string): Promise<void> {
    await this.driver.removeApp(bundleId);
  }

  /**
   * Launch app
   */
  async launchApp(bundleId: string): Promise<void> {
    await this.driver.activateApp(bundleId);
  }

  /**
   * Terminate app
   */
  async terminateApp(bundleId: string): Promise<void> {
    await this.driver.terminateApp(bundleId);
  }

  /**
   * Check if app is installed
   */
  async isAppInstalled(bundleId: string): Promise<boolean> {
    return await this.driver.isAppInstalled(bundleId);
  }

  /**
   * Get app state
   */
  async getAppState(bundleId: string): Promise<string> {
    return await this.driver.queryAppState(bundleId);
  }

  /**
   * Reset app state
   */
  async resetApp(): Promise<void> {
    await this.driver.reset();
  }

  /**
   * Get device logs
   */
  async getDeviceLogs(logType: string = 'syslog'): Promise<string[]> {
    return await this.driver.getLogs(logType);
  }

  /**
   * Get device performance data
   */
  async getPerformanceData(packageName: string, dataType: string): Promise<any> {
    return await this.driver.getPerformanceData(packageName, dataType);
  }

  /**
   * Start recording screen
   */
  async startRecordingScreen(options: {
    videoSize?: string;
    bitRate?: number;
    timeLimit?: number;
  } = {}): Promise<void> {
    await this.driver.startRecordingScreen(options);
  }

  /**
   * Stop recording screen
   */
  async stopRecordingScreen(): Promise<string> {
    return await this.driver.stopRecordingScreen();
  }

  /**
   * Get device clipboard content
   */
  async getClipboard(): Promise<string> {
    return await this.driver.getClipboard();
  }

  /**
   * Set device clipboard content
   */
  async setClipboard(content: string): Promise<void> {
    await this.driver.setClipboard(content);
  }

  /**
   * Get device battery info
   */
  async getBatteryInfo(): Promise<any> {
    return await this.driver.getBatteryInfo();
  }

  /**
   * Get device network connection info
   */
  async getNetworkConnection(): Promise<number> {
    return await this.driver.getNetworkConnection();
  }

  /**
   * Set device network connection
   */
  async setNetworkConnection(type: number): Promise<void> {
    await this.driver.setNetworkConnection(type);
  }

  /**
   * Toggle airplane mode
   */
  async toggleAirplaneMode(): Promise<void> {
    await this.driver.toggleAirplaneMode();
  }

  /**
   * Toggle WiFi
   */
  async toggleWiFi(): Promise<void> {
    await this.driver.toggleWiFi();
  }

  /**
   * Toggle data
   */
  async toggleData(): Promise<void> {
    await this.driver.toggleData();
  }

  /**
   * Get device location
   */
  async getLocation(): Promise<{ latitude: number; longitude: number; altitude: number }> {
    return await this.driver.getLocation();
  }

  /**
   * Set device location
   */
  async setLocation(latitude: number, longitude: number, altitude?: number): Promise<void> {
    await this.driver.setLocation(latitude, longitude, altitude);
  }

  /**
   * Shake device
   */
  async shake(): Promise<void> {
    await this.driver.shake();
  }

  /**
   * Lock device
   */
  async lock(seconds?: number): Promise<void> {
    await this.driver.lock(seconds);
  }

  /**
   * Unlock device
   */
  async unlock(): Promise<void> {
    await this.driver.unlock();
  }

  /**
   * Check if device is locked
   */
  async isLocked(): Promise<boolean> {
    return await this.driver.isLocked();
  }

  /**
   * Press device key
   */
  async pressKey(key: string): Promise<void> {
    await this.driver.pressKeyCode(key);
  }

  /**
   * Long press device key
   */
  async longPressKey(key: string, duration: number = 2000): Promise<void> {
    await this.driver.longPressKeyCode(key, undefined, undefined, undefined, duration);
  }

  /**
   * Get device time
   */
  async getDeviceTime(): Promise<string> {
    return await this.driver.getDeviceTime();
  }

  /**
   * Set device time
   */
  async setDeviceTime(time: string): Promise<void> {
    await this.driver.setDeviceTime(time);
  }

  /**
   * Get device timezone
   */
  async getDeviceTimezone(): Promise<string> {
    return await this.driver.getDeviceTimezone();
  }

  /**
   * Set device timezone
   */
  async setDeviceTimezone(timezone: string): Promise<void> {
    await this.driver.setDeviceTimezone(timezone);
  }

  /**
   * Get device language
   */
  async getDeviceLanguage(): Promise<string> {
    return await this.driver.getDeviceLanguage();
  }

  /**
   * Set device language
   */
  async setDeviceLanguage(language: string): Promise<void> {
    await this.driver.setDeviceLanguage(language);
  }

  /**
   * Get device locale
   */
  async getDeviceLocale(): Promise<string> {
    return await this.driver.getDeviceLocale();
  }

  /**
   * Set device locale
   */
  async setDeviceLocale(locale: string): Promise<void> {
    await this.driver.setDeviceLocale(locale);
  }

  /**
   * Get device rotation
   */
  async getDeviceRotation(): Promise<{ x: number; y: number; z: number }> {
    return await this.driver.getDeviceRotation();
  }

  /**
   * Set device rotation
   */
  async setDeviceRotation(x: number, y: number, z: number): Promise<void> {
    await this.driver.setDeviceRotation({ x, y, z });
  }

  /**
   * Get device window size
   */
  async getWindowSize(): Promise<{ width: number; height: number }> {
    return await this.driver.getWindowSize();
  }

  /**
   * Set device window size
   */
  async setWindowSize(width: number, height: number): Promise<void> {
    await this.driver.setWindowSize(width, height);
  }

  /**
   * Get device window position
   */
  async getWindowPosition(): Promise<{ x: number; y: number }> {
    return await this.driver.getWindowPosition();
  }

  /**
   * Set device window position
   */
  async setWindowPosition(x: number, y: number): Promise<void> {
    await this.driver.setWindowPosition(x, y);
  }

  /**
   * Maximize device window
   */
  async maximizeWindow(): Promise<void> {
    await this.driver.maximizeWindow();
  }

  /**
   * Minimize device window
   */
  async minimizeWindow(): Promise<void> {
    await this.driver.minimizeWindow();
  }

  /**
   * Fullscreen device window
   */
  async fullscreenWindow(): Promise<void> {
    await this.driver.fullscreenWindow();
  }

  /**
   * Get device window handles
   */
  async getWindowHandles(): Promise<string[]> {
    return await this.driver.getWindowHandles();
  }

  /**
   * Get current device window handle
   */
  async getCurrentWindowHandle(): Promise<string> {
    return await this.driver.getCurrentWindowHandle();
  }

  /**
   * Switch to device window
   */
  async switchToWindow(handle: string): Promise<void> {
    await this.driver.switchToWindow(handle);
  }

  /**
   * Close current device window
   */
  async closeWindow(): Promise<void> {
    await this.driver.closeWindow();
  }

  /**
   * Get device page source
   */
  async getPageSource(): Promise<string> {
    return await this.driver.getPageSource();
  }

  /**
   * Get device title
   */
  async getTitle(): Promise<string> {
    return await this.driver.getTitle();
  }

  /**
   * Get device URL
   */
  async getUrl(): Promise<string> {
    return await this.driver.getUrl();
  }

  /**
   * Navigate to URL (for hybrid apps)
   */
  async navigateTo(url: string): Promise<void> {
    await this.driver.navigateTo(url);
  }

  /**
   * Go back in device history
   */
  async back(): Promise<void> {
    await this.driver.back();
  }

  /**
   * Go forward in device history
   */
  async forward(): Promise<void> {
    await this.driver.forward();
  }

  /**
   * Refresh device page
   */
  async refresh(): Promise<void> {
    await this.driver.refresh();
  }

  /**
   * Get device cookies
   */
  async getCookies(): Promise<any[]> {
    return await this.driver.getCookies();
  }

  /**
   * Get device cookie
   */
  async getCookie(name: string): Promise<any> {
    return await this.driver.getCookie(name);
  }

  /**
   * Set device cookie
   */
  async setCookie(cookie: any): Promise<void> {
    await this.driver.setCookie(cookie);
  }

  /**
   * Delete device cookie
   */
  async deleteCookie(name: string): Promise<void> {
    await this.driver.deleteCookie(name);
  }

  /**
   * Delete all device cookies
   */
  async deleteAllCookies(): Promise<void> {
    await this.driver.deleteAllCookies();
  }

  /**
   * Get device local storage
   */
  async getLocalStorage(): Promise<any[]> {
    return await this.driver.getLocalStorage();
  }

  /**
   * Get device local storage item
   */
  async getLocalStorageItem(key: string): Promise<string> {
    return await this.driver.getLocalStorageItem(key);
  }

  /**
   * Set device local storage item
   */
  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.driver.setLocalStorageItem(key, value);
  }

  /**
   * Delete device local storage item
   */
  async deleteLocalStorageItem(key: string): Promise<void> {
    await this.driver.deleteLocalStorageItem(key);
  }

  /**
   * Clear device local storage
   */
  async clearLocalStorage(): Promise<void> {
    await this.driver.clearLocalStorage();
  }

  /**
   * Get device session storage
   */
  async getSessionStorage(): Promise<any[]> {
    return await this.driver.getSessionStorage();
  }

  /**
   * Get device session storage item
   */
  async getSessionStorageItem(key: string): Promise<string> {
    return await this.driver.getSessionStorageItem(key);
  }

  /**
   * Set device session storage item
   */
  async setSessionStorageItem(key: string, value: string): Promise<void> {
    await this.driver.setSessionStorageItem(key, value);
  }

  /**
   * Delete device session storage item
   */
  async deleteSessionStorageItem(key: string): Promise<void> {
    await this.driver.deleteSessionStorageItem(key);
  }

  /**
   * Clear device session storage
   */
  async clearSessionStorage(): Promise<void> {
    await this.driver.clearSessionStorage();
  }
}
