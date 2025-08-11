import { Page, Locator } from '@playwright/test';

export class Elements {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Find element by selector
   */
  async findElement(selector: string, options: any = {}): Promise<Locator> {
    const defaultOptions = {
      timeout: 10000
    };

    const findOptions = { ...defaultOptions, ...options };
    return this.page.locator(selector, findOptions);
  }

  /**
   * Find element by text
   */
  async findElementByText(text: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`text=${text}`, options);
  }

  /**
   * Find element by role
   */
  async findElementByRole(role: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[role="${role}"]`, options);
  }

  /**
   * Find element by data attribute
   */
  async findElementByDataAttribute(attribute: string, value: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[data-${attribute}="${value}"]`, options);
  }

  /**
   * Find element by ID
   */
  async findElementById(id: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`#${id}`, options);
  }

  /**
   * Find element by class name
   */
  async findElementByClassName(className: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`.${className}`, options);
  }

  /**
   * Find element by name attribute
   */
  async findElementByName(name: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[name="${name}"]`, options);
  }

  /**
   * Find element by placeholder
   */
  async findElementByPlaceholder(placeholder: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[placeholder="${placeholder}"]`, options);
  }

  /**
   * Find element by title
   */
  async findElementByTitle(title: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[title="${title}"]`, options);
  }

  /**
   * Find element by alt text
   */
  async findElementByAltText(altText: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`[alt="${altText}"]`, options);
  }

  /**
   * Find element by partial text
   */
  async findElementByPartialText(partialText: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`text=*${partialText}*`, options);
  }

  /**
   * Find element by CSS selector
   */
  async findElementByCSS(cssSelector: string, options: any = {}): Promise<Locator> {
    return await this.findElement(cssSelector, options);
  }

  /**
   * Find element by XPath
   */
  async findElementByXPath(xpath: string, options: any = {}): Promise<Locator> {
    return await this.findElement(`xpath=${xpath}`, options);
  }

  /**
   * Find multiple elements
   */
  async findElements(selector: string, options: any = {}): Promise<Locator[]> {
    const defaultOptions = {
      timeout: 10000
    };

    const findOptions = { ...defaultOptions, ...options };
    const locator = this.page.locator(selector, findOptions);
    return await locator.all();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'visible' });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'hidden' });
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForElementAttached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'attached' });
  }

  /**
   * Wait for element to be detached from DOM
   */
  async waitForElementDetached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'detached' });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string, options: any = {}): Promise<boolean> {
    try {
      const defaultOptions = {
        timeout: 5000
      };

      const checkOptions = { ...defaultOptions, ...options };
      await this.page.waitForSelector(selector, checkOptions);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible(options);
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isEnabled(options);
    } catch {
      return false;
    }
  }

  /**
   * Check if element is disabled
   */
  async isElementDisabled(selector: string, options: any = {}): Promise<boolean> {
    return !(await this.isElementEnabled(selector, options));
  }

  /**
   * Get element text
   */
  async getElementText(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent(options) || '';
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(selector: string, attribute: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute, options) || '';
  }

  /**
   * Get element value
   */
  async getElementValue(selector: string, options: any = {}): Promise<string> {
    return await this.getElementAttribute(selector, 'value', options);
  }

  /**
   * Get element inner HTML
   */
  async getElementInnerHTML(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.innerHTML(options);
  }

  /**
   * Get element outer HTML
   */
  async getElementOuterHTML(selector: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.outerHTML(options);
  }

  /**
   * Get element bounding box
   */
  async getElementBoundingBox(selector: string, options: any = {}): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const element = this.page.locator(selector);
    return await element.boundingBox(options);
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string, options: any = {}): Promise<number> {
    const elements = await this.findElements(selector, options);
    return elements.length;
  }

  /**
   * Focus element
   */
  async focusElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.focus(options);
  }

  /**
   * Blur element
   */
  async blurElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.blur(options);
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string, options: any = {}): Promise<void> {
    const element = this.page.locator(selector);
    await element.hover(options);
  }

  /**
   * Get element computed style
   */
  async getElementComputedStyle(selector: string, property: string, options: any = {}): Promise<string> {
    const element = this.page.locator(selector);
    return await element.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property, options);
  }

  /**
   * Check if element has class
   */
  async hasClass(selector: string, className: string, options: any = {}): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.evaluate((el, cls) => {
      return el.classList.contains(cls);
    }, className, options);
  }

  /**
   * Get element classes
   */
  async getElementClasses(selector: string, options: any = {}): Promise<string[]> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      return Array.from(el.classList);
    }, options);
  }

  /**
   * Validate element properties
   */
  async validateElement(selector: string, properties: any, options: any = {}): Promise<boolean> {
    const element = this.page.locator(selector);
    
    for (const [property, expectedValue] of Object.entries(properties)) {
      const actualValue = await element.evaluate((el, prop) => {
        return el[prop];
      }, property, options);
      
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    
    return true;
  }
}