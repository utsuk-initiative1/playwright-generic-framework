import { expect, Page, Locator, Response } from '@playwright/test';
import { ConfigManager } from '../config/ConfigManager';

export interface AssertionOptions {
  timeout?: number;
  soft?: boolean;
  message?: string;
  screenshot?: boolean;
}

export interface ApiAssertionOptions extends AssertionOptions {
  statusCode?: number;
  contentType?: string;
  responseTime?: number;
}

export interface SchemaAssertionOptions extends AssertionOptions {
  strict?: boolean;
  ignoreFields?: string[];
  allowExtraFields?: boolean;
}

export class AssertionUtils {
  private page: Page;
  private config: ConfigManager;
  private softAssertions: Array<{ condition: boolean; message: string; timestamp: Date }> = [];

  constructor(page: Page) {
    this.page = page;
    this.config = new ConfigManager();
  }

  /**
   * Custom assertion with detailed error messages
   */
  async assert(
    condition: boolean | Promise<boolean>,
    message: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { soft = false, screenshot = true } = options;
    const actualCondition = await condition;

    if (!actualCondition) {
      const errorMessage = this.buildErrorMessage(message, options);
      
      if (screenshot) {
        await this.captureScreenshot('assertion-failed');
      }

      if (soft) {
        this.softAssertions.push({
          condition: false,
          message: errorMessage,
          timestamp: new Date()
        });
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Element visibility assertion with custom error details
   */
  async assertElementVisible(
    locator: Locator | string,
    options: AssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeVisible({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be visible: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Element not visible assertion
   */
  async assertElementNotVisible(
    locator: Locator | string,
    options: AssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).not.toBeVisible({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should not be visible: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Text content assertion with detailed comparison
   */
  async assertTextContent(
    locator: Locator | string,
    expectedText: string | RegExp,
    options: AssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const actualText = await element.textContent({ timeout });
      const trimmedActual = actualText?.trim() || '';
      
      if (expectedText instanceof RegExp) {
        expect(trimmedActual).toMatch(expectedText);
      } else {
        expect(trimmedActual).toBe(expectedText);
      }
    } catch (error) {
      const actualText = await element.textContent({ timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Text content mismatch for ${elementInfo}\nExpected: "${expectedText}"\nActual: "${actualText}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * URL assertion with detailed comparison
   */
  async assertUrl(
    expectedUrl: string | RegExp,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { timeout = 10000, message } = options;

    try {
      const currentUrl = this.page.url();
      
      if (expectedUrl instanceof RegExp) {
        expect(currentUrl).toMatch(expectedUrl);
      } else {
        expect(currentUrl).toBe(expectedUrl);
      }
    } catch (error) {
      const currentUrl = this.page.url();
      const errorMessage = message || 
        `URL mismatch\nExpected: "${expectedUrl}"\nActual: "${currentUrl}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Page title assertion
   */
  async assertPageTitle(
    expectedTitle: string | RegExp,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { timeout = 10000, message } = options;

    try {
      const actualTitle = await this.page.title();
      
      if (expectedTitle instanceof RegExp) {
        expect(actualTitle).toMatch(expectedTitle);
      } else {
        expect(actualTitle).toBe(expectedTitle);
      }
    } catch (error) {
      const actualTitle = await this.page.title();
      const errorMessage = message || 
        `Page title mismatch\nExpected: "${expectedTitle}"\nActual: "${actualTitle}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Form field assertion
   */
  async assertFormField(
    locator: Locator | string,
    expectedValue: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const actualValue = await element.inputValue({ timeout });
      expect(actualValue).toBe(expectedValue);
    } catch (error) {
      const actualValue = await element.inputValue({ timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Form field value mismatch for ${elementInfo}\nExpected: "${expectedValue}"\nActual: "${actualValue}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * API Response assertion
   */
  async assertApiResponse(
    response: Response,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const { 
      statusCode, 
      contentType, 
      responseTime, 
      message,
      soft = false 
    } = options;

    const assertions: Array<{ condition: boolean; message: string }> = [];

    // Status code assertion
    if (statusCode !== undefined) {
      assertions.push({
        condition: response.status() === statusCode,
        message: `Expected status code ${statusCode}, got ${response.status()}`
      });
    }

    // Content type assertion
    if (contentType !== undefined) {
      const actualContentType = response.headers()['content-type'] || '';
      assertions.push({
        condition: actualContentType.includes(contentType),
        message: `Expected content type to contain "${contentType}", got "${actualContentType}"`
      });
    }

    // Response time assertion
    if (responseTime !== undefined) {
      const actualResponseTime = response.request().timing()?.responseEnd || 0;
      assertions.push({
        condition: actualResponseTime <= responseTime,
        message: `Expected response time <= ${responseTime}ms, got ${actualResponseTime}ms`
      });
    }

    // Check all assertions
    const failedAssertions = assertions.filter(a => !a.condition);
    
    if (failedAssertions.length > 0) {
      const errorMessage = message || 
        `API Response assertion failed:\n${failedAssertions.map(a => `- ${a.message}`).join('\n')}`;
      
      if (soft) {
        this.softAssertions.push({
          condition: false,
          message: errorMessage,
          timestamp: new Date()
        });
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * JSON Schema assertion
   */
  async assertJsonSchema(
    data: any,
    schema: any,
    options: SchemaAssertionOptions = {}
  ): Promise<void> {
    const { strict = false, ignoreFields = [], allowExtraFields = true, message } = options;

    try {
      const validationResult = this.validateJsonSchema(data, schema, {
        strict,
        ignoreFields,
        allowExtraFields
      });

      if (!validationResult.isValid) {
        const errorMessage = message || 
          `JSON Schema validation failed:\n${validationResult.errors.join('\n')}`;
        await this.assert(false, errorMessage, options);
      }
    } catch (error) {
      const errorMessage = message || `JSON Schema validation error: ${error}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Array assertion utilities
   */
  async assertArrayLength(
    array: any[],
    expectedLength: number,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { message } = options;
    const actualLength = array.length;
    
    const errorMessage = message || 
      `Array length mismatch\nExpected: ${expectedLength}\nActual: ${actualLength}`;
    
    await this.assert(actualLength === expectedLength, errorMessage, options);
  }

  async assertArrayContains(
    array: any[],
    expectedItem: any,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { message } = options;
    const contains = array.includes(expectedItem);
    
    const errorMessage = message || 
      `Array should contain "${expectedItem}"\nArray contents: [${array.join(', ')}]`;
    
    await this.assert(contains, errorMessage, options);
  }

  /**
   * Date assertion utilities
   */
  async assertDateEquals(
    actualDate: Date | string,
    expectedDate: Date | string,
    toleranceMs: number = 1000,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { message } = options;
    
    const actual = new Date(actualDate).getTime();
    const expected = new Date(expectedDate).getTime();
    const difference = Math.abs(actual - expected);
    
    const errorMessage = message || 
      `Date mismatch\nExpected: ${new Date(expectedDate).toISOString()}\nActual: ${new Date(actualDate).toISOString()}\nDifference: ${difference}ms`;
    
    await this.assert(difference <= toleranceMs, errorMessage, options);
  }

  /**
   * File assertion utilities
   */
  async assertFileDownloaded(
    fileName: string | RegExp,
    options: AssertionOptions = {}
  ): Promise<void> {
    const { timeout = 30000, message } = options;

    try {
      const downloadPromise = this.page.waitForEvent('download', { timeout });
      const download = await downloadPromise;
      
      const actualFileName = download.suggestedFilename();
      
      if (fileName instanceof RegExp) {
        expect(actualFileName).toMatch(fileName);
      } else {
        expect(actualFileName).toBe(fileName);
      }
    } catch (error) {
      const errorMessage = message || 
        `File download assertion failed\nExpected: "${fileName}"\nError: ${error}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Soft assertion collection
   */
  async collectSoftAssertions(): Promise<void> {
    // This method can be called to collect soft assertions without throwing
    // The assertions are stored in this.softAssertions array
  }

  /**
   * Get all soft assertion failures
   */
  getSoftAssertionFailures(): Array<{ message: string; timestamp: Date }> {
    return this.softAssertions
      .filter(a => !a.condition)
      .map(a => ({ message: a.message, timestamp: a.timestamp }));
  }

  /**
   * Clear soft assertions
   */
  clearSoftAssertions(): void {
    this.softAssertions = [];
  }

  /**
   * Assert all soft assertions passed
   */
  async assertAllSoftAssertionsPassed(options: AssertionOptions = {}): Promise<void> {
    const failures = this.getSoftAssertionFailures();
    
    if (failures.length > 0) {
      const errorMessage = `Soft assertions failed:\n${failures.map(f => `- ${f.message}`).join('\n')}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Helper methods
   */
  private async getElementInfo(element: Locator): Promise<string> {
    try {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase());
      const id = await element.getAttribute('id');
      const className = await element.getAttribute('class');
      const text = await element.textContent();
      
      let info = `<${tagName}`;
      if (id) info += ` id="${id}"`;
      if (className) info += ` class="${className}"`;
      info += '>';
      
      if (text && text.trim()) {
        info += ` "${text.trim().substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
      }
      
      return info;
    } catch {
      return 'element';
    }
  }

  private buildErrorMessage(message: string, options: AssertionOptions): string {
    const { message: customMessage } = options;
    return customMessage || message;
  }

  private async captureScreenshot(name: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await this.page.screenshot({ 
        path: `test-results/screenshots/${name}-${timestamp}.png`,
        fullPage: true 
      });
    } catch (error) {
      console.warn('Failed to capture screenshot:', error);
    }
  }

  private validateJsonSchema(data: any, schema: any, options: {
    strict: boolean;
    ignoreFields: string[];
    allowExtraFields: boolean;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic schema validation implementation
    // In a real implementation, you might want to use a library like ajv
    
    if (typeof schema === 'object' && schema !== null) {
      for (const [key, expectedValue] of Object.entries(schema)) {
        if (options.ignoreFields.includes(key)) continue;
        
        if (!(key in data)) {
          if (options.strict) {
            errors.push(`Missing required field: ${key}`);
          }
          continue;
        }
        
        const actualValue = data[key];
        
        if (typeof expectedValue !== typeof actualValue) {
          errors.push(`Type mismatch for field "${key}": expected ${typeof expectedValue}, got ${typeof actualValue}`);
        }
      }
      
      if (options.strict && !options.allowExtraFields) {
        for (const key of Object.keys(data)) {
          if (!(key in schema) && !options.ignoreFields.includes(key)) {
            errors.push(`Unexpected field: ${key}`);
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
