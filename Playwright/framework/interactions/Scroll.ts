import { Page } from '@playwright/test';

export class Scroll {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToElement(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.locator(selector).scrollIntoViewIfNeeded(scrollOptions);
  }

  async scrollToTop(options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((opts) => {
      window.scrollTo({ top: 0, behavior: opts.behavior });
    }, scrollOptions);
  }

  async scrollToBottom(options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((opts) => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: opts.behavior });
    }, scrollOptions);
  }

  async scrollBy(x: number, y: number, options: any = {}): Promise<void> {
    const defaultOptions = { behavior: 'smooth' };
    const scrollOptions = { ...defaultOptions, ...options };
    await this.page.evaluate((coords, opts) => {
      window.scrollBy({ left: coords.x, top: coords.y, behavior: opts.behavior });
    }, { x, y }, scrollOptions);
  }

  async getScrollPosition(): Promise<{ x: number; y: number }> {
    return await this.page.evaluate(() => {
      return {
        x: window.pageXOffset || window.scrollX,
        y: window.pageYOffset || window.scrollY
      };
    });
  }

  async isElementInViewport(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }
}