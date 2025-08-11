import { Page, Locator } from '@playwright/test';

export class Click {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      retries: 3,
      force: false,
      noWaitAfter: false
    };

    const clickOptions = { ...defaultOptions, ...options };

    for (let i = 0; i < clickOptions.retries; i++) {
      try {
        await this.page.click(selector, clickOptions);
        return;
      } catch (error) {
        if (i === clickOptions.retries - 1) {
          throw error;
        }
        console.log(`Click attempt ${i + 1} failed, retrying...`);
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Click element by text
   */
  async clickByText(text: string, options: any = {}): Promise<void> {
    const selector = `text=${text}`;
    await this.clickElement(selector, options);
  }

  /**
   * Click element by role
   */
  async clickByRole(role: string, options: any = {}): Promise<void> {
    const selector = `[role="${role}"]`;
    await this.clickElement(selector, options);
  }

  /**
   * Click element by data attribute
   */
  async clickByDataAttribute(attribute: string, value: string, options: any = {}): Promise<void> {
    const selector = `[data-${attribute}="${value}"]`;
    await this.clickElement(selector, options);
  }

  /**
   * Double click element
   */
  async doubleClick(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.dblclick(selector, clickOptions);
  }

  /**
   * Right click element
   */
  async rightClick(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.click(selector, { ...clickOptions, button: 'right' });
  }

  /**
   * Click element with keyboard
   */
  async clickWithKeyboard(selector: string): Promise<void> {
    await this.page.focus(selector);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Click element and wait for navigation
   */
  async clickAndWaitForNavigation(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000
    };

    const navOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForLoadState(navOptions.waitUntil, { timeout: navOptions.timeout }),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for specific URL
   */
  async clickAndWaitForURL(selector: string, expectedURL: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 30000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForURL(expectedURL, waitOptions),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for selector to appear
   */
  async clickAndWaitForSelector(selector: string, waitForSelector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await Promise.all([
      this.page.waitForSelector(waitForSelector, waitOptions),
      this.clickElement(selector)
    ]);
  }

  /**
   * Click element and wait for selector to disappear
   */
  async clickAndWaitForSelectorToDisappear(selector: string, waitForSelector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    await this.clickElement(selector);
    await this.page.waitForSelector(waitForSelector, { ...waitOptions, state: 'hidden' });
  }

  /**
   * Click element with coordinates
   */
  async clickAtCoordinates(selector: string, x: number, y: number, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const clickOptions = { ...defaultOptions, ...options };
    await this.page.click(selector, { ...clickOptions, position: { x, y } });
  }

  /**
   * Click element in center
   */
  async clickInCenter(selector: string, options: any = {}): Promise<void> {
    await this.clickElement(selector, { ...options, position: { x: 0.5, y: 0.5 } });
  }

  /**
   * Click element and verify it's clicked
   */
  async clickAndVerify(selector: string, verificationSelector: string, options: any = {}): Promise<boolean> {
    await this.clickElement(selector, options);
    
    try {
      await this.page.waitForSelector(verificationSelector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click multiple elements
   */
  async clickMultiple(selectors: string[], options: any = {}): Promise<void> {
    for (const selector of selectors) {
      await this.clickElement(selector, options);
      await this.page.waitForTimeout(100); // Small delay between clicks
    }
  }

  /**
   * Click element if visible
   */
  async clickIfVisible(selector: string, options: any = {}): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      const isVisible = await element.isVisible();
      
      if (isVisible) {
        await this.clickElement(selector, options);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Click element and wait for response
   */
  async clickAndWaitForResponse(selector: string, urlPattern: string, options: any = {}): Promise<any> {
    const defaultOptions = {
      timeout: 30000
    };

    const waitOptions = { ...defaultOptions, ...options };

    const responsePromise = this.page.waitForResponse(urlPattern, waitOptions);
    await this.clickElement(selector);
    
    return await responsePromise;
  }
}