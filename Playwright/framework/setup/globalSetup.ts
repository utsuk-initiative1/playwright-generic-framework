import { FullConfig } from '@playwright/test';
import { ConfigManager } from '../config/ConfigManager';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  const configManager = new ConfigManager();
  
  // Validate required environment variables
  const requiredVars = [
    'TEST_USER_EMAIL',
    'TEST_USER_PASSWORD'
  ];
  
  const missingVars = configManager.validateRequiredEnvVars(requiredVars);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Warning: Missing required environment variables:', missingVars);
    console.warn('   Please check your .env file and ensure all required variables are set.');
  }
  
  // Log configuration summary
  const testConfig = configManager.getTestConfig();
  console.log('📋 Test Configuration:');
  console.log(`   Environment: ${testConfig.testEnv}`);
  console.log(`   Base URL: ${testConfig.baseUrl}`);
  console.log(`   API URL: ${testConfig.apiBaseUrl}`);
  console.log(`   Headless: ${testConfig.headless}`);
  console.log(`   Timeout: ${testConfig.timeout}ms`);
  console.log(`   Retries: ${testConfig.retries}`);
  console.log(`   Workers: ${testConfig.workers}`);
  
  // Check if running in CI
  if (configManager.isCI()) {
    console.log('🏗️  Running in CI environment');
  }
  
  // Validate authentication configuration
  try {
    const authConfig = configManager.getAuthConfig();
    console.log('✅ Authentication configuration validated');
    
    if (authConfig.adminUser.email && authConfig.adminUser.password) {
      console.log('   Admin user configured');
    }
    
    if (authConfig.premiumUser.email && authConfig.premiumUser.password) {
      console.log('   Premium user configured');
    }
    
  } catch (error) {
    console.error('❌ Authentication configuration error:', error);
    throw error;
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;
