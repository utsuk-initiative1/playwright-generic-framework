# Mobile Automation Framework

A comprehensive mobile automation framework built with Appium, WebDriverIO, and TypeScript. This framework provides robust testing capabilities for both Android and iOS mobile applications.

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
- **Comprehensive assertions**: Mobile-specific assertion utilities
- **Test reporting**: Allure reports with detailed test results
- **CI/CD integration**: Ready for continuous integration

## 📁 Enhanced Directory Structure

```
mobile/
├── config/                 # WebDriverIO configurations
│   ├── wdio.android.conf.ts
│   ├── wdio.ios.conf.ts
│   └── wdio.parallel.conf.ts
├── core/                   # Base classes
│   ├── BaseMobilePage.ts
│   └── MobileTestBase.ts
├── pages/                  # Page Object Models
│   ├── MobileLoginPage.ts
│   ├── MobileDashboardPage.ts
│   └── MobileProfilePage.ts
├── tests/                  # Test specifications
│   ├── mobile-login.spec.ts
│   ├── mobile-dashboard.spec.ts
│   └── mobile-profile.spec.ts
├── utils/                  # Utility classes
│   ├── MobileUtilities.ts
│   └── MobileAssertionUtils.ts
├── setup/                  # Setup and teardown
│   └── mobile-setup.ts
├── package.json            # Mobile-specific dependencies
├── tsconfig.json          # TypeScript configuration
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

1. **Navigate to mobile directory**:
```bash
cd Playwright/mobile
```

2. **Install dependencies**:
```bash
npm install
```

3. **Install Appium drivers**:
```bash
appium driver install uiautomator2
appium driver install xcuitest
```

4. **Set up environment variables**:
```bash
# Create .env file
cp ../env.example .env

# Update with your app paths
ANDROID_APP_PATH=./apps/your-android-app.apk
IOS_APP_PATH=./apps/your-ios-app.app
```

## 🧪 Running Tests

### Basic Test Execution

```bash
# Run Android tests
npm run mobile:android

# Run iOS tests (macOS only)
npm run mobile:ios

# Run tests in parallel
npm run mobile:parallel

# Run all tests
npm run mobile:test
```

### Specific Test Suites

```bash
# Run login tests
npm run mobile:login

# Run dashboard tests
npm run mobile:dashboard

# Run profile tests
npm run mobile:profile

# Run smoke tests
npm run mobile:smoke

# Run regression tests
npm run mobile:regression
```

### Development and Debugging

```bash
# Run in debug mode
npm run mobile:debug

# Watch mode for development
npm run mobile:dev

# Type checking
npm run mobile:type-check

# Linting
npm run mobile:lint
npm run mobile:lint:fix
```

## 📱 Framework Components

### Core Classes

#### MobileTestBase
Provides common setup and teardown functionality for mobile tests:
- App permissions handling
- Device state management
- Network condition simulation
- Performance monitoring
- Device interaction utilities

#### BaseMobilePage
Base class for all page objects with common mobile interactions:
- Element waiting and interaction
- Gesture support (swipe, tap, long press)
- Screenshot capabilities
- Device orientation management
- Keyboard handling

### Page Objects

#### MobileLoginPage
Comprehensive login functionality with platform-specific locators:
- Login with valid/invalid credentials
- Form validation
- Error message handling
- Biometric authentication support
- Permission handling

#### MobileDashboardPage
Dashboard functionality testing:
- Navigation verification
- Quick actions testing
- Bottom navigation
- Performance metrics
- Pull-to-refresh functionality

#### MobileProfilePage
Profile management testing:
- Profile information display
- Profile editing
- Image management
- Validation testing
- Navigation testing

### Utility Classes

#### MobileAssertionUtils
Comprehensive assertion utilities for mobile testing:
- Element visibility and state assertions
- Performance assertions
- Device state assertions
- Network and battery assertions
- Screenshot comparison

#### MobileUtilities
General mobile testing utilities:
- Device management
- Network simulation
- Performance monitoring
- Log collection
- App state management

## 🔧 Configuration

### WebDriverIO Configurations

#### Android Configuration (`wdio.android.conf.ts`)
- UiAutomator2 automation
- Android emulator setup
- Permission handling
- Timeout configurations

#### iOS Configuration (`wdio.ios.conf.ts`)
- XCUITest automation
- iOS simulator setup
- Alert handling
- WebDriverAgent configuration

#### Parallel Configuration (`wdio.parallel.conf.ts`)
- Multi-device testing
- Cross-platform execution
- Allure reporting
- Failure handling

### Environment Variables

```bash
# App paths
ANDROID_APP_PATH=./apps/your-android-app.apk
IOS_APP_PATH=./apps/your-ios-app.app

# Device UDIDs
ANDROID_UDID_1=emulator-5554
ANDROID_UDID_2=emulator-5556
IOS_UDID_1=simulator-1
IOS_UDID_2=simulator-2

# Appium settings
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
```

## 📊 Test Reporting

### Allure Reports

```bash
# Generate and open reports
npm run mobile:report

# Serve reports locally
npm run mobile:report:serve
```

### Screenshots

Screenshots are automatically captured:
- On test failures
- On explicit screenshot calls
- For visual regression testing

## 🚀 Advanced Features

### Parallel Testing

Run tests across multiple devices simultaneously:
```bash
npm run mobile:parallel
```

### Network Simulation

Test app behavior under different network conditions:
```typescript
await testBase.setNetworkConditions({
  offline: false,
  latency: 1000,
  downloadThroughput: 1000000,
  uploadThroughput: 1000000
});
```

### Performance Testing

Monitor app performance during tests:
```typescript
const metrics = await testBase.getPerformanceMetrics();
expect(metrics.loadTime).to.be.lessThan(5000);
```

### Device Interaction

Test device-specific features:
```typescript
// Rotate device
await testBase.rotateDevice('LANDSCAPE');

// Lock/unlock device
await testBase.lockDevice();
await testBase.unlockDevice();

// Shake device
await testBase.shakeDevice();
```

## 🔍 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { MobileTestBase } from '../core/MobileTestBase';
import { MobileLoginPage } from '../pages/MobileLoginPage';

describe('Mobile Login Tests', () => {
  let testBase: MobileTestBase;
  let loginPage: MobileLoginPage;

  before(async () => {
    testBase = new MobileTestBase(driver);
    loginPage = new MobileLoginPage(driver);
    await testBase.setup();
  });

  after(async () => {
    await testBase.teardown();
  });

  it('should login successfully', async () => {
    await loginPage.navigateToLogin();
    await loginPage.login('test@example.com', 'password123');
    
    const isLoggedIn = await loginPage.verifyLoginSuccess();
    expect(isLoggedIn).to.be.true;
  });
});
```

### Using Assertions

```typescript
import { MobileAssertionUtils } from '../utils/MobileAssertionUtils';

const assertions = new MobileAssertionUtils(driver);

// Element assertions
await assertions.assertElementVisible('~login_button');
await assertions.assertElementText('~welcome_text', 'Welcome');

// Performance assertions
await assertions.assertPageLoadTime(5000);

// Device assertions
await assertions.assertDeviceOrientation('PORTRAIT');
await assertions.assertNetworkConnected();
```

## 🛠️ Troubleshooting

### Common Issues

1. **Appium not starting**: Check if Appium is installed and drivers are available
2. **Device not found**: Verify device UDID and connection
3. **Element not found**: Check locator strategy and element availability
4. **Permission issues**: Ensure app permissions are properly handled

### Debug Mode

Run tests in debug mode for detailed logging:
```bash
npm run mobile:debug
```

### Logs

Check logs in the `logs/` directory:
- `appium.log`: Appium server logs
- Test execution logs in console

## 🤝 Contributing

1. Follow the existing code structure
2. Add appropriate tests for new features
3. Update documentation
4. Ensure all tests pass
5. Follow TypeScript best practices

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information
