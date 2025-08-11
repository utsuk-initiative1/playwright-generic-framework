import { Page, Browser, BrowserContext } from '@playwright/test';

export class BrowserActions {
  private page: Page;
  private browser: Browser;
  private context: BrowserContext;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.page = page;
    this.browser = browser;
    this.context = context;
  }

  /**
   * Navigate to URL with retry logic
   */
  async navigateTo(url: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000,
      retries: 3
    };

    const navOptions = { ...defaultOptions, ...options };

    for (let i = 0; i < navOptions.retries; i++) {
      try {
        await this.page.goto(url, navOptions);
        return;
      } catch (error) {
        if (i === navOptions.retries - 1) {
          throw error;
        }
        console.log(`Navigation attempt ${i + 1} failed, retrying...`);
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Refresh page with cache control
   */
  async refreshPage(clearCache: boolean = false): Promise<void> {
    if (clearCache) {
      await this.context.clearCookies();
      await this.page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
    }
    
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Set user agent
   */
  async setUserAgent(userAgent: string): Promise<void> {
    await this.page.setExtraHTTPHeaders({
      'User-Agent': userAgent
    });
  }

  /**
   * Add cookies
   */
  async addCookies(cookies: Array<{ name: string; value: string; domain?: string; path?: string }>): Promise<void> {
    await this.context.addCookies(cookies);
  }

  /**
   * Get all cookies
   */
  async getCookies(): Promise<any[]> {
    return await this.context.cookies();
  }

  /**
   * Clear all cookies
   */
  async clearCookies(): Promise<void> {
    await this.context.clearCookies();
  }

  /**
   * Set geolocation
   */
  async setGeolocation(latitude: number, longitude: number): Promise<void> {
    await this.context.setGeolocation({ latitude, longitude });
  }

  /**
   * Set permissions
   */
  async setPermissions(permissions: string[]): Promise<void> {
    await this.context.grantPermissions(permissions);
  }

  /**
   * Add route handler
   */
  async addRouteHandler(urlPattern: string, handler: Function): Promise<void> {
    await this.page.route(urlPattern, handler);
  }

  /**
   * Remove route handler
   */
  async removeRouteHandler(urlPattern: string): Promise<void> {
    await this.page.unroute(urlPattern);
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content loaded
   */
  async waitForDOMContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get page URL
   */
  async getPageURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(path?: string): Promise<Buffer> {
    if (path) {
      return await this.page.screenshot({ path });
    }
    return await this.page.screenshot();
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    return await this.page.content();
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Wait for function to return truthy value
   */
  async waitForFunction(fn: Function, timeout: number = 30000): Promise<void> {
    await this.page.waitForFunction(fn, { timeout });
  }
}