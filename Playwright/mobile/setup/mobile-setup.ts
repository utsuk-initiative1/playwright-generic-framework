import { Remote } from 'webdriverio';
import { MobileUtilities } from '../utils/MobileUtilities';

export class MobileSetup {
  private driver: Remote;
  private utilities: MobileUtilities;

  constructor(driver: Remote) {
    this.driver = driver;
    this.utilities = new MobileUtilities(driver);
  }

  /**
   * Initialize mobile test environment
   */
  async initialize(): Promise<void> {
    console.log('Initializing mobile test environment...');
    
    // Wait for app to be ready
    await this.utilities.waitForAppReady();
    
    // Handle permissions
    await this.handleInitialPermissions();
    
    // Set up device for testing
    await this.setupDeviceForTesting();
    
    console.log('Mobile test environment initialized successfully');
  }

  /**
   * Handle initial app permissions
   */
  private async handleInitialPermissions(): Promise<void> {
    console.log('Handling initial permissions...');
    
    try {
      // Common permission dialogs
      const permissionSelectors = [
        '~Allow, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Allow"',
        '~OK, -ios predicate string:type == "XCUIElementTypeButton" AND name == "OK"',
        '~Continue, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Continue"',
        '~Accept, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Accept"',
        '~Yes, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Yes"',
        '~Don\'t Allow, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Don\'t Allow"',
        '~Deny, -ios predicate string:type == "XCUIElementTypeButton" AND name == "Deny"'
      ];

      for (const selector of permissionSelectors) {
        try {
          const element = await this.driver.$(selector);
          if (await element.isDisplayed()) {
            await element.click();
            console.log(`Clicked permission dialog: ${selector}`);
            await this.driver.pause(1000); // Wait for dialog to close
          }
        } catch (error) {
          // Element not found or not clickable, continue
        }
      }
    } catch (error) {
      console.log('No permission dialogs found or error handling permissions:', error);
    }
  }

  /**
   * Set up device for testing
   */
  private async setupDeviceForTesting(): Promise<void> {
    console.log('Setting up device for testing...');
    
    try {
      // Unlock device if locked
      if (await this.utilities.isLocked()) {
        await this.utilities.unlock();
        console.log('Device unlocked');
      }

      // Set device to portrait orientation
      await this.driver.setOrientation('PORTRAIT');
      console.log('Device orientation set to portrait');

      // Enable network connections
      await this.utilities.setNetworkConnection(6); // All network types enabled
      console.log('Network connections enabled');

      // Set device language and locale if needed
      // await this.utilities.setDeviceLanguage('en');
      // await this.utilities.setDeviceLocale('en_US');
      
    } catch (error) {
      console.log('Error setting up device:', error);
    }
  }

  /**
   * Install and launch app
   */
  async installAndLaunchApp(appPath: string, bundleId: string): Promise<void> {
    console.log(`Installing and launching app: ${bundleId}`);
    
    try {
      // Check if app is already installed
      const isInstalled = await this.utilities.isAppInstalled(bundleId);
      
      if (!isInstalled) {
        // Install app
        await this.utilities.installApp(appPath);
        console.log('App installed successfully');
      } else {
        console.log('App already installed');
      }

      // Launch app
      await this.utilities.launchApp(bundleId);
      console.log('App launched successfully');

      // Wait for app to be ready
      await this.utilities.waitForAppReady();
      
    } catch (error) {
      console.error('Error installing/launching app:', error);
      throw error;
    }
  }

  /**
   * Reset app state
   */
  async resetAppState(): Promise<void> {
    console.log('Resetting app state...');
    
    try {
      await this.utilities.resetApp();
      console.log('App state reset successfully');
    } catch (error) {
      console.log('Error resetting app state:', error);
    }
  }

  /**
   * Clean up test environment
   */
  async cleanup(): Promise<void> {
    console.log('Cleaning up mobile test environment...');
    
    try {
      // Stop any screen recording
      try {
        await this.utilities.stopRecordingScreen();
      } catch (error) {
        // Screen recording might not be active
      }

      // Reset app state
      await this.resetAppState();
      
      console.log('Mobile test environment cleaned up successfully');
    } catch (error) {
      console.log('Error during cleanup:', error);
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<any> {
    try {
      const platform = await this.driver.getPlatform();
      const version = await this.driver.getPlatformVersion();
      const device = await this.driver.getDeviceName();
      const orientation = await this.driver.getOrientation();
      const networkConnection = await this.utilities.getNetworkConnection();
      const batteryInfo = await this.utilities.getBatteryInfo();
      
      return {
        platform,
        version,
        device,
        orientation,
        networkConnection,
        batteryInfo
      };
    } catch (error) {
      console.log('Error getting device info:', error);
      return {};
    }
  }

  /**
   * Validate test environment
   */
  async validateEnvironment(): Promise<boolean> {
    console.log('Validating test environment...');
    
    try {
      // Check if device is unlocked
      const isLocked = await this.utilities.isLocked();
      if (isLocked) {
        console.log('Device is locked, attempting to unlock...');
        await this.utilities.unlock();
      }

      // Check network connection
      const networkConnection = await this.utilities.getNetworkConnection();
      if (networkConnection === 0) {
        console.log('No network connection, enabling...');
        await this.utilities.setNetworkConnection(6);
      }

      // Check battery level
      const batteryInfo = await this.utilities.getBatteryInfo();
      if (batteryInfo.level < 0.2) {
        console.warn('Low battery level detected:', batteryInfo.level);
      }

      console.log('Test environment validation completed');
      return true;
      
    } catch (error) {
      console.error('Error validating test environment:', error);
      return false;
    }
  }

  /**
   * Set up test data
   */
  async setupTestData(): Promise<void> {
    console.log('Setting up test data...');
    
    try {
      // Clear app data if needed
      await this.resetAppState();
      
      // Set up any required test data
      // This could include setting clipboard content, local storage, etc.
      
      console.log('Test data setup completed');
    } catch (error) {
      console.log('Error setting up test data:', error);
    }
  }

  /**
   * Start test recording
   */
  async startTestRecording(): Promise<void> {
    console.log('Starting test recording...');
    
    try {
      await this.utilities.startRecordingScreen({
        videoSize: '1280x720',
        bitRate: 4000000,
        timeLimit: 300 // 5 minutes
      });
      console.log('Test recording started');
    } catch (error) {
      console.log('Error starting test recording:', error);
    }
  }

  /**
   * Stop test recording
   */
  async stopTestRecording(): Promise<string | null> {
    console.log('Stopping test recording...');
    
    try {
      const recordingPath = await this.utilities.stopRecordingScreen();
      console.log('Test recording stopped:', recordingPath);
      return recordingPath;
    } catch (error) {
      console.log('Error stopping test recording:', error);
      return null;
    }
  }
}
