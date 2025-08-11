export interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  username: string;
  password: string;
  timeout: number;
  retries: number;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  screenshotOnFailure: boolean;
  videoRecording: boolean;
  traceRecording: boolean;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const environment = process.env.TEST_ENV || 'staging';
    
    const baseConfigs: Record<string, EnvironmentConfig> = {
      local: {
        baseURL: 'http://localhost:3000',
        apiURL: 'http://localhost:3001',
        username: process.env.TEST_USERNAME || 'testuser',
        password: process.env.TEST_PASSWORD || 'testpass',
        timeout: 30000,
        retries: 3,
        headless: false,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: true,
        traceRecording: true
      },
      staging: {
        baseURL: 'https://example.com',
        apiURL: 'https://api.example.com',
        username: process.env.STAGING_USERNAME || 'staginguser',
        password: process.env.STAGING_PASSWORD || 'stagingpass',
        timeout: 30000,
        retries: 2,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: false,
        traceRecording: false
      },
      production: {
        baseURL: 'https://example.com',
        apiURL: 'https://api.example.com',
        username: process.env.PROD_USERNAME || 'produser',
        password: process.env.PROD_PASSWORD || 'prodpass',
        timeout: 45000,
        retries: 1,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        screenshotOnFailure: true,
        videoRecording: false,
        traceRecording: false
      }
    };

    return baseConfigs[environment] || baseConfigs.staging;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getBaseURL(): string {
    return this.config.baseURL;
  }

  public getApiURL(): string {
    return this.config.apiURL;
  }

  public getCredentials(): { username: string; password: string } {
    return {
      username: this.config.username,
      password: this.config.password
    };
  }

  public getTimeout(): number {
    return this.config.timeout;
  }

  public getRetries(): number {
    return this.config.retries;
  }

  public isHeadless(): boolean {
    return this.config.headless;
  }

  public getViewport(): { width: number; height: number } {
    return this.config.viewport;
  }

  public getUserAgent(): string {
    return this.config.userAgent;
  }

  public shouldTakeScreenshots(): boolean {
    return this.config.screenshotOnFailure;
  }

  public shouldRecordVideo(): boolean {
    return this.config.videoRecording;
  }

  public shouldRecordTrace(): boolean {
    return this.config.traceRecording;
  }

  public updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();