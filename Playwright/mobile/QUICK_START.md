# Quick Start Guide - Mobile Automation

This guide will help you get started with mobile automation using Appium and your existing Playwright framework.

## 🚀 Quick Setup (5 minutes)

### 1. Run the Setup Script
```bash
cd Playwright
./mobile/setup-mobile.sh
```

This script will:
- ✅ Check system requirements
- ✅ Install Appium and drivers
- ✅ Set up project dependencies
- ✅ Create necessary directories
- ✅ Create environment configuration

### 2. Configure Your Environment
Edit the `.env` file created by the setup script:
```bash
# Update these paths with your actual app locations
ANDROID_APP_PATH=./apps/your-android-app.apk
IOS_APP_PATH=./apps/your-ios-app.app
```

### 3. Place Your Mobile Apps
```bash
# Copy your mobile apps to the apps directory
cp /path/to/your/app.apk Playwright/apps/
cp /path/to/your/app.app Playwright/apps/
```

### 4. Run Your First Test
```bash
# Android test
npm run mobile:android

# iOS test (macOS only)
npm run mobile:ios

# Both platforms
npm run mobile:parallel
```

## 📱 Platform Setup

### Android Setup
1. **Install Android Studio** or **Android SDK**
2. **Set ANDROID_HOME environment variable**:
   ```bash
   export ANDROID_HOME=/path/to/android/sdk
   ```
3. **Create Android Virtual Device (AVD)**:
   ```bash
   avdmanager create avd -n "Pixel_6_API_33" -k "system-images;android-33;google_apis;x86_64"
   ```

### iOS Setup (macOS only)
1. **Install Xcode** from App Store
2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Launch iOS Simulator**:
   ```bash
   open -a Simulator
   ```

## 🧪 Writing Your First Test

### 1. Create a Page Object
```typescript
// mobile/pages/MyAppPage.ts
import { BaseMobilePage } from '../core/BaseMobilePage';

export class MyAppPage extends BaseMobilePage {
  // Android locators
  private readonly androidButton = '~my_button, #my-button';
  
  // iOS locators
  private readonly iosButton = '-ios predicate string:type == "XCUIElementTypeButton" AND name == "My Button"';

  async clickMyButton(): Promise<void> {
    const locators = await this.getLocators();
    await this.clickElement(locators.button);
  }
}
```

### 2. Write a Test
```typescript
// mobile/tests/my-app.spec.ts
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { MyAppPage } from '../pages/MyAppPage';

describe('My App Tests', () => {
  it('should click button successfully', async () => {
    const page = new MyAppPage(driver);
    await page.clickMyButton();
    // Add your assertions here
  });
});
```

### 3. Run the Test
```bash
npm run mobile:android
```

## 🔧 Common Commands

### Test Execution
```bash
# Run Android tests
npm run mobile:android

# Run iOS tests
npm run mobile:ios

# Run tests on both platforms
npm run mobile:parallel

# Run specific test file
npx wdio run ./mobile/config/wdio.android.conf.ts --spec ./mobile/tests/my-test.spec.ts
```

### Appium Management
```bash
# Start Appium server
npm run appium:start

# Check Appium drivers
appium driver list

# Install additional drivers
appium driver install <driver-name>
```

### Device Management
```bash
# List Android devices
adb devices

# List iOS simulators
xcrun simctl list devices

# Launch iOS simulator
open -a Simulator
```

## 🎯 Example Test Scenarios

### Login Flow
```typescript
describe('Login Flow', () => {
  it('should login successfully', async () => {
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
describe('Gesture Tests', () => {
  it('should perform swipe gestures', async () => {
    const page = new MyAppPage(driver);
    
    await page.swipeUp();
    await page.swipeDown();
    await page.swipeLeft();
    await page.swipeRight();
  });
});
```

### Device Interaction
```typescript
describe('Device Tests', () => {
  it('should change orientation', async () => {
    const page = new MyAppPage(driver);
    
    await page.setOrientation('LANDSCAPE');
    const orientation = await page.getOrientation();
    expect(orientation).to.equal('LANDSCAPE');
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **"Device not found"**
   ```bash
   # Check Android devices
   adb devices
   
   # Check iOS simulators
   xcrun simctl list devices
   ```

2. **"App not installed"**
   - Verify app path in `.env` file
   - Check if app file exists in `apps/` directory

3. **"Permission denied"**
   - Enable `autoGrantPermissions` in Android capabilities
   - Handle permission dialogs in test setup

4. **"Appium server not running"**
   ```bash
   # Start Appium server
   appium
   ```

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run mobile:android
```

## 📚 Next Steps

1. **Read the full documentation**: `mobile/README.md`
2. **Explore the framework structure**: Check out the existing page objects and utilities
3. **Add your own tests**: Create page objects for your app's screens
4. **Set up CI/CD**: Integrate mobile tests into your existing pipeline
5. **Add visual testing**: Use screenshot and recording capabilities

## 🆘 Need Help?

- 📖 **Documentation**: `mobile/README.md`
- 🐛 **Issues**: Check the troubleshooting section
- 💡 **Examples**: Look at existing test files in `mobile/tests/`
- 🔧 **Setup**: Run `./mobile/setup-mobile.sh` for automated setup

---

**Happy Testing! 🎉**
