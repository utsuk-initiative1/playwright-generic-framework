# Mobile Automation with Appium

This directory contains the mobile automation framework that integrates Appium with your existing Playwright framework. It provides comprehensive mobile testing capabilities for both Android and iOS platforms.

## 🚀 Features

- **Cross-platform support**: Android and iOS automation
- **Page Object Model**: Consistent with your existing web framework
- **TypeScript support**: Full type safety and IntelliSense
- **Parallel execution**: Run tests on multiple devices simultaneously
- **Device management**: Comprehensive device utilities and setup
- **Gesture support**: Swipe, tap, long press, and more
- **Screenshot and recording**: Visual verification capabilities
- **Performance monitoring**: Device performance data collection
- **Network simulation**: Test different network conditions

## 📁 Directory Structure

```
mobile/
├── config/                 # WebDriverIO configurations
│   ├── wdio.android.conf.ts
│   ├── wdio.ios.conf.ts
│   └── wdio.parallel.conf.ts
├── core/                   # Base classes
│   └── BaseMobilePage.ts
├── pages/                  # Page Object Models
│   └── MobileLoginPage.ts
├── tests/                  # Test specifications
│   └── mobile-login.spec.ts
├── utils/                  # Utility classes
│   └── MobileUtilities.ts
├── setup/                  # Setup and teardown
│   └── mobile-setup.ts
└── README.md
```

## 🛠️ Prerequisites

### System Requirements

1. **Node.js** (v16 or higher)
2. **Java JDK** (v8 or higher)
3. **Android SDK** (for Android testing)
4. **Xcode** (for iOS testing, macOS only)
5. **Appium** (v2.x)

### Required Tools

#### Android Setup
```bash
# Install Android SDK
# Set ANDROID_HOME environment variable
export ANDROID_HOME=/path/to/android/sdk

# Install Android tools
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Create Android Virtual Device (AVD)
avdmanager create avd -n "Pixel_6_API_33" -k "system-images;android-33;google_apis;x86_64"
```

#### iOS Setup (macOS only)
```bash
# Install Xcode from App Store
# Install Xcode Command Line Tools
xcode-select --install

# Install iOS Simulator
xcrun simctl list devices
```

#### Appium Setup
```bash
# Install Appium globally
npm install -g appium

# Install Appium drivers
appium driver install uiautomator2
appium driver install xcuitest

# Verify installation
appium driver list
```

## 📦 Installation

1. **Install dependencies**:
```bash
cd Playwright
npm install
```

2. **Install Appium drivers**:
```bash
appium driver install uiautomator2
appium driver install xcuitest
```

3. **Set up environment variables**:
```bash
# Create .env file
cp env.example .env

# Add your app paths
ANDROID_APP_PATH=./apps/your-app.apk
IOS_APP_PATH=./apps/your-app.app
```

## 🏃‍♂️ Running Tests

### Android Tests
```bash
# Run Android tests
npm run mobile:android

# Run with specific app
ANDROID_APP_PATH=./apps/my-app.apk npm run mobile:android
```

### iOS Tests
```bash
# Run iOS tests
npm run mobile:ios

# Run with specific app
IOS_APP_PATH=./apps/my-app.app npm run mobile:ios
```

### Parallel Execution
```bash
# Run tests on both platforms simultaneously
npm run mobile:parallel
```

### All Mobile Tests
```bash
# Run all mobile tests sequentially
npm run mobile:test
```

## 🔧 Configuration

### Android Configuration
```typescript
// mobile/config/wdio.android.conf.ts
capabilities: [{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:platformVersion': '13.0',
  'appium:app': process.env.ANDROID_APP_PATH || './apps/app-debug.apk',
  'appium:autoGrantPermissions': true,
  'appium:noReset': false
}]
```

### iOS Configuration
```typescript
// mobile/config/wdio.ios.conf.ts
capabilities: [{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone Simulator',
  'appium:platformVersion': '16.0',
  'appium:app': process.env.IOS_APP_PATH || './apps/YourApp.app',
  'appium:autoAcceptAlerts': true
}]
```

## 📱 Page Object Model

### Base Mobile Page
```typescript
import { BaseMobilePage } from '../core/BaseMobilePage';

export class MyMobilePage extends BaseMobilePage {
  // Platform-specific locators
  private readonly androidElement = '~android_element';
  private readonly iosElement = '-ios predicate string:type == "XCUIElementTypeButton"';

  async performAction(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.element);
  }
}
```

### Platform-Specific Locators
```typescript
// Android locators
private readonly androidEmailInput = '~email_input, #email, [resource-id="email"]';

// iOS locators
private readonly iosEmailInput = '-ios predicate string:type == "XCUIElementTypeTextField" AND name == "email"';
```

## 🎯 Test Examples

### Basic Login Test
```typescript
describe('Mobile Login Tests', () => {
  it('should successfully login', async () => {
    const loginPage = new MobileLoginPage(driver);
    
    await loginPage.navigateToLogin();
    await loginPage.login('user@example.com', 'password');
    
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).to.be.true;
  });
});
```

### Gesture Testing
```typescript
it('should handle swipe gestures', async () => {
  const page = new MyMobilePage(driver);
  
  await page.swipeUp();
  await page.swipeDown();
  await page.swipeLeft();
  await page.swipeRight();
});
```

### Device Interaction
```typescript
it('should change device orientation', async () => {
  const page = new MyMobilePage(driver);
  
  await page.setOrientation('LANDSCAPE');
  const orientation = await page.getOrientation();
  expect(orientation).to.equal('LANDSCAPE');
});
```

## 🛠️ Utilities

### Mobile Utilities
```typescript
import { MobileUtilities } from '../utils/MobileUtilities';

const utilities = new MobileUtilities(driver);

// Device management
await utilities.installApp('./apps/my-app.apk');
await utilities.launchApp('com.example.app');

// Network simulation
await utilities.setNetworkConnection(0); // No network
await utilities.setNetworkConnection(6); // All networks

// Device control
await utilities.lock();
await utilities.unlock();
await utilities.shake();
```

### Setup and Teardown
```typescript
import { MobileSetup } from '../setup/mobile-setup';

const setup = new MobileSetup(driver);

// Initialize environment
await setup.initialize();

// Validate environment
const isValid = await setup.validateEnvironment();

// Cleanup
await setup.cleanup();
```

## 📊 Reporting

### Screenshots
```typescript
// Take screenshot
const screenshotPath = await page.takeScreenshot('test_name');
```

### Screen Recording
```typescript
// Start recording
await setup.startTestRecording();

// Stop recording
const recordingPath = await setup.stopTestRecording();
```

### Device Logs
```typescript
// Get device logs
const logs = await utilities.getDeviceLogs('syslog');
```

## 🔍 Debugging

### Appium Inspector
```bash
# Start Appium with inspector
appium --base-path /wd/hub

# Open Appium Inspector in browser
# http://localhost:4723/inspector
```

### Device Logs
```bash
# Android logs
adb logcat

# iOS logs
xcrun simctl spawn booted log stream
```

### WebDriverIO Debug Mode
```typescript
// Enable debug logging
logLevel: 'debug'
```

## 🚨 Troubleshooting

### Common Issues

1. **Device not found**:
   - Check device connection: `adb devices` or `xcrun simctl list devices`
   - Verify device name in capabilities

2. **App not installed**:
   - Check app path in capabilities
   - Verify app bundle ID

3. **Permission issues**:
   - Enable `autoGrantPermissions` for Android
   - Handle permission dialogs in setup

4. **Network issues**:
   - Check device network connection
   - Verify Appium server is running

### Environment Variables
```bash
# Required environment variables
ANDROID_HOME=/path/to/android/sdk
ANDROID_APP_PATH=./apps/your-app.apk
IOS_APP_PATH=./apps/your-app.app
```

## 📈 Best Practices

1. **Use Page Object Model**: Keep locators and actions in page classes
2. **Platform-specific locators**: Handle Android and iOS differences
3. **Wait strategies**: Use explicit waits for better reliability
4. **Error handling**: Implement proper error handling and recovery
5. **Test data management**: Use fixtures for test data
6. **Parallel execution**: Run tests on multiple devices for efficiency
7. **Visual verification**: Use screenshots and recordings for validation

## 🔗 Integration with Existing Framework

The mobile automation framework integrates seamlessly with your existing Playwright framework:

- **Shared utilities**: Common testing utilities
- **Consistent patterns**: Same Page Object Model approach
- **Unified reporting**: Combined test reports
- **CI/CD integration**: Same pipeline structure

## 📚 Additional Resources

- [Appium Documentation](http://appium.io/docs/en/about-appium/intro/)
- [WebDriverIO Documentation](https://webdriver.io/docs/)
- [Android Testing Guide](https://developer.android.com/guide/topics/testing)
- [iOS Testing Guide](https://developer.apple.com/documentation/xctest)

## 🤝 Contributing

1. Follow the existing code patterns
2. Add platform-specific locators
3. Include proper error handling
4. Add comprehensive tests
5. Update documentation

## 📄 License

This mobile automation framework is part of the Utsuk Initiative Playwright Framework and follows the same MIT license.
