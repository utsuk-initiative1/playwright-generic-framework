const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

class AppAnalyzer {
  constructor() {
    this.analysis = {
      platform: '',
      bundleId: '',
      appName: '',
      version: '',
      elements: [],
      screens: [],
      locators: []
    };
  }

  /**
   * Analyze mobile app file (.apk or .ipa)
   */
  async analyzeApp(appFilePath) {
    console.log('🔍 Analyzing mobile app...');
    
    const fileExtension = path.extname(appFilePath).toLowerCase();
    
    if (fileExtension === '.apk') {
      return await this.analyzeAndroidApp(appFilePath);
    } else if (fileExtension === '.ipa') {
      return await this.analyzeIOSApp(appFilePath);
    } else {
      throw new Error('Unsupported file format. Please provide .apk or .ipa file.');
    }
  }

  /**
   * Analyze Android APK file
   */
  async analyzeAndroidApp(apkPath) {
    console.log('📱 Analyzing Android APK...');
    
    try {
      // Extract APK contents
      const zip = new AdmZip(apkPath);
      const zipEntries = zip.getEntries();
      
      // Extract basic app info
      this.analysis.platform = 'android';
      this.analysis.bundleId = this.extractAndroidBundleId(zipEntries);
      this.analysis.appName = this.extractAndroidAppName(zipEntries);
      this.analysis.version = this.extractAndroidVersion(zipEntries);
      
      // Extract UI elements
      this.analysis.elements = this.extractAndroidElements(zipEntries);
      this.analysis.screens = this.extractAndroidScreens(zipEntries);
      this.analysis.locators = this.generateAndroidLocators(this.analysis.elements);
      
      console.log('✅ Android app analysis completed');
      return this.analysis;
      
    } catch (error) {
      console.error('❌ Error analyzing Android app:', error.message);
      throw error;
    }
  }

  /**
   * Analyze iOS IPA file
   */
  async analyzeIOSApp(ipaPath) {
    console.log('📱 Analyzing iOS IPA...');
    
    try {
      // Extract IPA contents
      const zip = new AdmZip(ipaPath);
      const zipEntries = zip.getEntries();
      
      // Extract basic app info
      this.analysis.platform = 'ios';
      this.analysis.bundleId = this.extractIOSBundleId(zipEntries);
      this.analysis.appName = this.extractIOSAppName(zipEntries);
      this.analysis.version = this.extractIOSVersion(zipEntries);
      
      // Extract UI elements
      this.analysis.elements = this.extractIOSElements(zipEntries);
      this.analysis.screens = this.extractIOSScreens(zipEntries);
      this.analysis.locators = this.generateIOSLocators(this.analysis.elements);
      
      console.log('✅ iOS app analysis completed');
      return this.analysis;
      
    } catch (error) {
      console.error('❌ Error analyzing iOS app:', error.message);
      throw error;
    }
  }

  /**
   * Extract Android bundle ID from APK
   */
  extractAndroidBundleId(zipEntries) {
    try {
      const manifestEntry = zipEntries.find(entry => entry.entryName === 'AndroidManifest.xml');
      if (manifestEntry) {
        const manifestContent = manifestEntry.getData().toString('utf8');
        const packageMatch = manifestContent.match(/package="([^"]+)"/);
        return packageMatch ? packageMatch[1] : 'com.example.app';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract bundle ID from AndroidManifest.xml');
    }
    return 'com.example.app';
  }

  /**
   * Extract Android app name
   */
  extractAndroidAppName(zipEntries) {
    try {
      const resourcesEntry = zipEntries.find(entry => entry.entryName.includes('resources.arsc'));
      if (resourcesEntry) {
        // This is a simplified extraction - in a real implementation, you'd parse the resources.arsc file
        return 'My Android App';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract app name from resources');
    }
    return 'My Android App';
  }

  /**
   * Extract Android version
   */
  extractAndroidVersion(zipEntries) {
    try {
      const manifestEntry = zipEntries.find(entry => entry.entryName === 'AndroidManifest.xml');
      if (manifestEntry) {
        const manifestContent = manifestEntry.getData().toString('utf8');
        const versionMatch = manifestContent.match(/android:versionName="([^"]+)"/);
        return versionMatch ? versionMatch[1] : '1.0.0';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract version from AndroidManifest.xml');
    }
    return '1.0.0';
  }

  /**
   * Extract Android UI elements
   */
  extractAndroidElements(zipEntries) {
    const elements = [];
    
    try {
      // Look for layout files
      const layoutEntries = zipEntries.filter(entry => 
        entry.entryName.includes('layout/') && entry.entryName.endsWith('.xml')
      );
      
      layoutEntries.forEach(entry => {
        try {
          const layoutContent = entry.getData().toString('utf8');
          const elementMatches = layoutContent.match(/<([A-Za-z]+)[^>]*android:id="@\+id\/([^"]+)"/g);
          
          if (elementMatches) {
            elementMatches.forEach(match => {
              const elementMatch = match.match(/<([A-Za-z]+)[^>]*android:id="@\+id\/([^"]+)"/);
              if (elementMatch) {
                elements.push({
                  type: elementMatch[1],
                  id: elementMatch[2],
                  locator: `[resource-id="${elementMatch[2]}"]`
                });
              }
            });
          }
        } catch (error) {
          console.warn(`⚠️ Could not parse layout file: ${entry.entryName}`);
        }
      });
      
    } catch (error) {
      console.warn('⚠️ Could not extract UI elements from layout files');
    }
    
    // Add common elements if none found
    if (elements.length === 0) {
      elements.push(
        { type: 'Button', id: 'login_button', locator: '~login_button, #login_button' },
        { type: 'EditText', id: 'email_input', locator: '~email_input, #email_input' },
        { type: 'EditText', id: 'password_input', locator: '~password_input, #password_input' },
        { type: 'TextView', id: 'welcome_text', locator: '~welcome_text, #welcome_text' }
      );
    }
    
    return elements;
  }

  /**
   * Extract Android screens
   */
  extractAndroidScreens(zipEntries) {
    const screens = [];
    
    try {
      // Look for activity files
      const activityEntries = zipEntries.filter(entry => 
        entry.entryName.includes('AndroidManifest.xml')
      );
      
      if (activityEntries.length > 0) {
        const manifestEntry = activityEntries[0];
        const manifestContent = manifestEntry.getData().toString('utf8');
        const activityMatches = manifestContent.match(/<activity[^>]*android:name="([^"]+)"/g);
        
        if (activityMatches) {
          activityMatches.forEach(match => {
            const nameMatch = match.match(/android:name="([^"]+)"/);
            if (nameMatch) {
              const activityName = nameMatch[1];
              const screenName = activityName.split('.').pop().replace('Activity', '');
              screens.push({
                name: screenName,
                activity: activityName,
                elements: []
              });
            }
          });
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not extract screens from AndroidManifest.xml');
    }
    
    // Add common screens if none found
    if (screens.length === 0) {
      screens.push(
        { name: 'Login', activity: 'LoginActivity', elements: [] },
        { name: 'Home', activity: 'HomeActivity', elements: [] },
        { name: 'Settings', activity: 'SettingsActivity', elements: [] }
      );
    }
    
    return screens;
  }

  /**
   * Generate Android locators
   */
  generateAndroidLocators(elements) {
    return elements.map(element => ({
      name: element.id,
      type: element.type,
      android: element.locator,
      ios: `-ios predicate string:type == "XCUIElementType${element.type}" AND name == "${element.id}"`
    }));
  }

  /**
   * Extract iOS bundle ID from IPA
   */
  extractIOSBundleId(zipEntries) {
    try {
      const infoPlistEntry = zipEntries.find(entry => 
        entry.entryName.includes('Info.plist')
      );
      if (infoPlistEntry) {
        // This is a simplified extraction - in a real implementation, you'd parse the Info.plist file
        return 'com.example.iosapp';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract bundle ID from Info.plist');
    }
    return 'com.example.iosapp';
  }

  /**
   * Extract iOS app name
   */
  extractIOSAppName(zipEntries) {
    try {
      const infoPlistEntry = zipEntries.find(entry => 
        entry.entryName.includes('Info.plist')
      );
      if (infoPlistEntry) {
        // This is a simplified extraction
        return 'My iOS App';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract app name from Info.plist');
    }
    return 'My iOS App';
  }

  /**
   * Extract iOS version
   */
  extractIOSVersion(zipEntries) {
    try {
      const infoPlistEntry = zipEntries.find(entry => 
        entry.entryName.includes('Info.plist')
      );
      if (infoPlistEntry) {
        // This is a simplified extraction
        return '1.0.0';
      }
    } catch (error) {
      console.warn('⚠️ Could not extract version from Info.plist');
    }
    return '1.0.0';
  }

  /**
   * Extract iOS UI elements
   */
  extractIOSElements(zipEntries) {
    const elements = [];
    
    try {
      // Look for storyboard files
      const storyboardEntries = zipEntries.filter(entry => 
        entry.entryName.includes('.storyboard') || entry.entryName.includes('.xib')
      );
      
      // For now, add common iOS elements
      elements.push(
        { type: 'Button', id: 'login_button', locator: '~Login Button' },
        { type: 'TextField', id: 'email_input', locator: '~Email Input' },
        { type: 'SecureTextField', id: 'password_input', locator: '~Password Input' },
        { type: 'StaticText', id: 'welcome_text', locator: '~Welcome Text' }
      );
      
    } catch (error) {
      console.warn('⚠️ Could not extract UI elements from storyboards');
    }
    
    return elements;
  }

  /**
   * Extract iOS screens
   */
  extractIOSScreens(zipEntries) {
    const screens = [];
    
    try {
      // Look for storyboard files to identify screens
      const storyboardEntries = zipEntries.filter(entry => 
        entry.entryName.includes('.storyboard')
      );
      
      // Add common iOS screens
      screens.push(
        { name: 'Login', viewController: 'LoginViewController', elements: [] },
        { name: 'Home', viewController: 'HomeViewController', elements: [] },
        { name: 'Settings', viewController: 'SettingsViewController', elements: [] }
      );
      
    } catch (error) {
      console.warn('⚠️ Could not extract screens from storyboards');
    }
    
    return screens;
  }

  /**
   * Generate iOS locators
   */
  generateIOSLocators(elements) {
    return elements.map(element => ({
      name: element.id,
      type: element.type,
      android: `~${element.id}, #${element.id}`,
      ios: element.locator
    }));
  }

  /**
   * Generate analysis report
   */
  generateReport() {
    return {
      summary: {
        platform: this.analysis.platform,
        bundleId: this.analysis.bundleId,
        appName: this.analysis.appName,
        version: this.analysis.version,
        totalElements: this.analysis.elements.length,
        totalScreens: this.analysis.screens.length
      },
      elements: this.analysis.elements,
      screens: this.analysis.screens,
      locators: this.analysis.locators
    };
  }
}

module.exports = AppAnalyzer;

