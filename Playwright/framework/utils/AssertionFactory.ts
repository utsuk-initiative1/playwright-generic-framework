import { Page, Locator, Response } from '@playwright/test';
import { AssertionUtils, AssertionOptions } from './AssertionUtils';
import { ApiAssertionUtils, ApiAssertionOptions, ApiResponseSchema } from './ApiAssertionUtils';
import { UIAssertionUtils, UIAssertionOptions } from './UIAssertionUtils';

export interface AssertionFactoryOptions {
  defaultTimeout?: number;
  defaultSoft?: boolean;
  screenshotOnFailure?: boolean;
}

export class AssertionFactory {
  private page: Page;
  private baseAssertions: AssertionUtils;
  private apiAssertions: ApiAssertionUtils;
  private uiAssertions: UIAssertionUtils;
  private options: AssertionFactoryOptions;

  constructor(page: Page, options: AssertionFactoryOptions = {}) {
    this.page = page;
    this.options = {
      defaultTimeout: 10000,
      defaultSoft: false,
      screenshotOnFailure: true,
      ...options
    };

    this.baseAssertions = new AssertionUtils(page);
    this.apiAssertions = new ApiAssertionUtils(page);
    this.uiAssertions = new UIAssertionUtils(page);
  }

  /**
   * Get base assertion utilities
   */
  get base(): AssertionUtils {
    return this.baseAssertions;
  }

  /**
   * Get API assertion utilities
   */
  get api(): ApiAssertionUtils {
    return this.apiAssertions;
  }

  /**
   * Get UI assertion utilities
   */
  get ui(): UIAssertionUtils {
    return this.uiAssertions;
  }

  /**
   * Create a new assertion with default options
   */
  create(options: AssertionOptions = {}): AssertionUtils {
    const mergedOptions = {
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    };

    return new AssertionUtils(this.page);
  }

  /**
   * Create API assertion with default options
   */
  createApi(options: ApiAssertionOptions = {}): ApiAssertionUtils {
    const mergedOptions = {
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    };

    return new ApiAssertionUtils(this.page);
  }

  /**
   * Create UI assertion with default options
   */
  createUI(options: UIAssertionOptions = {}): UIAssertionUtils {
    const mergedOptions = {
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    };

    return new UIAssertionUtils(this.page);
  }

  /**
   * Quick assertion methods for common scenarios
   */

  /**
   * Quick element visibility assertion
   */
  async visible(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementVisible(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element not visible assertion
   */
  async notVisible(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementNotVisible(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick text content assertion
   */
  async text(
    locator: Locator | string,
    expectedText: string | RegExp,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertTextContent(locator, expectedText, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick URL assertion
   */
  async url(
    expectedUrl: string | RegExp,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertUrl(expectedUrl, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick page title assertion
   */
  async title(
    expectedTitle: string | RegExp,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertPageTitle(expectedTitle, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick form field assertion
   */
  async field(
    locator: Locator | string,
    expectedValue: string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertFormField(locator, expectedValue, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick API response assertion
   */
  async apiResponse(
    response: Response,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    await this.api.assertApiResponse(response, {
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element count assertion
   */
  async count(
    locator: Locator | string,
    expectedCount: number,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementCount(locator, expectedCount, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element enabled assertion
   */
  async enabled(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementEnabled(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element disabled assertion
   */
  async disabled(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementDisabled(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element checked assertion
   */
  async checked(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementChecked(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element not checked assertion
   */
  async notChecked(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementNotChecked(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element contains text assertion
   */
  async containsText(
    locator: Locator | string,
    expectedText: string,
    message?: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementContainsText(locator, expectedText, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element exact text assertion
   */
  async exactText(
    locator: Locator | string,
    expectedText: string,
    message?: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementExactText(locator, expectedText, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element value assertion
   */
  async value(
    locator: Locator | string,
    expectedValue: string,
    message?: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementValue(locator, expectedValue, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element attribute assertion
   */
  async attribute(
    locator: Locator | string,
    attribute: string,
    expectedValue: string | RegExp,
    message?: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementAttribute(locator, attribute, expectedValue, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element CSS property assertion
   */
  async css(
    locator: Locator | string,
    property: string,
    expectedValue: string | RegExp,
    message?: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementCSSProperty(locator, property, expectedValue, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element focused assertion
   */
  async focused(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementFocused(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element in viewport assertion
   */
  async inViewport(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementInViewport(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element not in viewport assertion
   */
  async notInViewport(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementNotInViewport(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element empty assertion
   */
  async empty(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementEmpty(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick element not empty assertion
   */
  async notEmpty(
    locator: Locator | string,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.ui.assertElementNotEmpty(locator, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick array length assertion
   */
  async arrayLength(
    array: any[],
    expectedLength: number,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertArrayLength(array, expectedLength, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick array contains assertion
   */
  async arrayContains(
    array: any[],
    expectedItem: any,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertArrayContains(array, expectedItem, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick date equals assertion
   */
  async dateEquals(
    actualDate: Date | string,
    expectedDate: Date | string,
    toleranceMs: number = 1000,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertDateEquals(actualDate, expectedDate, toleranceMs, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Quick file download assertion
   */
  async fileDownloaded(
    fileName: string | RegExp,
    message?: string,
    options: AssertionOptions = {}
  ): Promise<void> {
    await this.base.assertFileDownloaded(fileName, {
      message,
      timeout: this.options.defaultTimeout,
      soft: this.options.defaultSoft,
      screenshot: this.options.screenshotOnFailure,
      ...options
    });
  }

  /**
   * Get all soft assertion failures
   */
  getSoftAssertionFailures(): Array<{ message: string; timestamp: Date }> {
    return [
      ...this.baseAssertions.getSoftAssertionFailures(),
      ...this.apiAssertions.getSoftAssertionFailures(),
      ...this.uiAssertions.getSoftAssertionFailures()
    ];
  }

  /**
   * Clear all soft assertions
   */
  clearSoftAssertions(): void {
    this.baseAssertions.clearSoftAssertions();
    this.apiAssertions.clearSoftAssertions();
    this.uiAssertions.clearSoftAssertions();
  }

  /**
   * Assert all soft assertions passed
   */
  async assertAllSoftAssertionsPassed(options: AssertionOptions = {}): Promise<void> {
    const failures = this.getSoftAssertionFailures();
    
    if (failures.length > 0) {
      const errorMessage = `Soft assertions failed:\n${failures.map(f => `- ${f.message}`).join('\n')}`;
      await this.baseAssertions.assert(false, errorMessage, options);
    }
  }
}
