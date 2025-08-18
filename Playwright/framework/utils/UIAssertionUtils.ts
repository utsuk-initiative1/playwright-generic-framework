import { Page, Locator, expect } from '@playwright/test';
import { AssertionUtils, AssertionOptions } from './AssertionUtils';

export interface UIAssertionOptions extends AssertionOptions {
  exact?: boolean;
  caseSensitive?: boolean;
  trim?: boolean;
}

export interface VisualAssertionOptions extends UIAssertionOptions {
  threshold?: number;
  mask?: Locator[];
  ignoreRegions?: Array<{ x: number; y: number; width: number; height: number }>;
}

export class UIAssertionUtils extends AssertionUtils {
  /**
   * Assert element is present in DOM
   */
  async assertElementPresent(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toHaveCount(1, { timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be present in DOM: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element count
   */
  async assertElementCount(
    locator: Locator | string,
    expectedCount: number,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toHaveCount(expectedCount, { timeout });
    } catch (error) {
      const actualCount = await element.count();
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Element count mismatch for ${elementInfo}\nExpected: ${expectedCount}\nActual: ${actualCount}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is enabled
   */
  async assertElementEnabled(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeEnabled({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be enabled: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is disabled
   */
  async assertElementDisabled(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeDisabled({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be disabled: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element has specific attribute
   */
  async assertElementAttribute(
    locator: Locator | string,
    attribute: string,
    expectedValue: string | RegExp,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const actualValue = await element.getAttribute(attribute, { timeout });
      
      if (expectedValue instanceof RegExp) {
        expect(actualValue).toMatch(expectedValue);
      } else {
        expect(actualValue).toBe(expectedValue);
      }
    } catch (error) {
      const actualValue = await element.getAttribute(attribute, { timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Attribute "${attribute}" mismatch for ${elementInfo}\nExpected: "${expectedValue}"\nActual: "${actualValue}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element has specific CSS property
   */
  async assertElementCSSProperty(
    locator: Locator | string,
    property: string,
    expectedValue: string | RegExp,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const actualValue = await element.evaluate((el, prop) => 
        window.getComputedStyle(el).getPropertyValue(prop), property);
      
      if (expectedValue instanceof RegExp) {
        expect(actualValue).toMatch(expectedValue);
      } else {
        expect(actualValue).toBe(expectedValue);
      }
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `CSS property "${property}" mismatch for ${elementInfo}\nExpected: "${expectedValue}"\nActual: "${actualValue}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is focused
   */
  async assertElementFocused(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeFocused({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be focused: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is checked (for checkboxes/radio buttons)
   */
  async assertElementChecked(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeChecked({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be checked: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is not checked
   */
  async assertElementNotChecked(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).not.toBeChecked({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should not be checked: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element contains text (partial match)
   */
  async assertElementContainsText(
    locator: Locator | string,
    expectedText: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message, caseSensitive = false, trim = true } = options;

    try {
      const actualText = await element.textContent({ timeout });
      let processedActual = actualText || '';
      let processedExpected = expectedText;

      if (trim) {
        processedActual = processedActual.trim();
        processedExpected = processedExpected.trim();
      }

      if (!caseSensitive) {
        processedActual = processedActual.toLowerCase();
        processedExpected = processedExpected.toLowerCase();
      }

      expect(processedActual).toContain(processedExpected);
    } catch (error) {
      const actualText = await element.textContent({ timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Element should contain text "${expectedText}"\nElement: ${elementInfo}\nActual text: "${actualText}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element has exact text
   */
  async assertElementExactText(
    locator: Locator | string,
    expectedText: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message, caseSensitive = false, trim = true } = options;

    try {
      const actualText = await element.textContent({ timeout });
      let processedActual = actualText || '';
      let processedExpected = expectedText;

      if (trim) {
        processedActual = processedActual.trim();
        processedExpected = processedExpected.trim();
      }

      if (!caseSensitive) {
        processedActual = processedActual.toLowerCase();
        processedExpected = processedExpected.toLowerCase();
      }

      expect(processedActual).toBe(processedExpected);
    } catch (error) {
      const actualText = await element.textContent({ timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Element should have exact text "${expectedText}"\nElement: ${elementInfo}\nActual text: "${actualText}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element value (for input fields)
   */
  async assertElementValue(
    locator: Locator | string,
    expectedValue: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message, exact = true } = options;

    try {
      const actualValue = await element.inputValue({ timeout });
      
      if (exact) {
        expect(actualValue).toBe(expectedValue);
      } else {
        expect(actualValue).toContain(expectedValue);
      }
    } catch (error) {
      const actualValue = await element.inputValue({ timeout }).catch(() => 'N/A');
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Element value mismatch for ${elementInfo}\nExpected: "${expectedValue}"\nActual: "${actualValue}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is in viewport
   */
  async assertElementInViewport(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).toBeInViewport({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be in viewport: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is not in viewport
   */
  async assertElementNotInViewport(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      await expect(element).not.toBeInViewport({ timeout });
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should not be in viewport: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element dimensions
   */
  async assertElementDimensions(
    locator: Locator | string,
    expectedWidth: number,
    expectedHeight: number,
    tolerance: number = 5,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const boundingBox = await element.boundingBox({ timeout });
      
      if (!boundingBox) {
        throw new Error('Element has no bounding box');
      }

      const widthMatch = Math.abs(boundingBox.width - expectedWidth) <= tolerance;
      const heightMatch = Math.abs(boundingBox.height - expectedHeight) <= tolerance;

      if (!widthMatch || !heightMatch) {
        const elementInfo = await this.getElementInfo(element);
        const errorMessage = message || 
          `Element dimensions mismatch for ${elementInfo}\nExpected: ${expectedWidth}x${expectedHeight}\nActual: ${boundingBox.width}x${boundingBox.height}`;
        await this.assert(false, errorMessage, options);
      }
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Failed to get element dimensions: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element position
   */
  async assertElementPosition(
    locator: Locator | string,
    expectedX: number,
    expectedY: number,
    tolerance: number = 5,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const boundingBox = await element.boundingBox({ timeout });
      
      if (!boundingBox) {
        throw new Error('Element has no bounding box');
      }

      const xMatch = Math.abs(boundingBox.x - expectedX) <= tolerance;
      const yMatch = Math.abs(boundingBox.y - expectedY) <= tolerance;

      if (!xMatch || !yMatch) {
        const elementInfo = await this.getElementInfo(element);
        const errorMessage = message || 
          `Element position mismatch for ${elementInfo}\nExpected: (${expectedX}, ${expectedY})\nActual: (${boundingBox.x}, ${boundingBox.y})`;
        await this.assert(false, errorMessage, options);
      }
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Failed to get element position: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert form validation error
   */
  async assertFormValidationError(
    locator: Locator | string,
    expectedError: string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      // Check for validation error message
      const errorMessage = await element.evaluate((el) => {
        const input = el as HTMLInputElement;
        return input.validationMessage || '';
      }, { timeout });

      expect(errorMessage).toContain(expectedError);
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || 
        `Form validation error not found for ${elementInfo}\nExpected: "${expectedError}"`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert accessibility attributes
   */
  async assertAccessibility(
    locator: Locator | string,
    expectedAttributes: Record<string, string>,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      for (const [attribute, expectedValue] of Object.entries(expectedAttributes)) {
        const actualValue = await element.getAttribute(attribute, { timeout });
        
        if (actualValue !== expectedValue) {
          const elementInfo = await this.getElementInfo(element);
          const errorMessage = message || 
            `Accessibility attribute "${attribute}" mismatch for ${elementInfo}\nExpected: "${expectedValue}"\nActual: "${actualValue}"`;
          await this.assert(false, errorMessage, options);
        }
      }
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Failed to check accessibility attributes: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is empty
   */
  async assertElementEmpty(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const text = await element.textContent({ timeout });
      const isEmpty = !text || text.trim() === '';
      expect(isEmpty).toBe(true);
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should be empty: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert element is not empty
   */
  async assertElementNotEmpty(
    locator: Locator | string,
    options: UIAssertionOptions = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const { timeout = 10000, message } = options;

    try {
      const text = await element.textContent({ timeout });
      const isEmpty = !text || text.trim() === '';
      expect(isEmpty).toBe(false);
    } catch (error) {
      const elementInfo = await this.getElementInfo(element);
      const errorMessage = message || `Element should not be empty: ${elementInfo}`;
      await this.assert(false, errorMessage, options);
    }
  }
}
