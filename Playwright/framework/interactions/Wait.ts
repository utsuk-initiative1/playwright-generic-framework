import { Page } from '@playwright/test';

export class Wait {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElementVisible(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'visible' });
  }

  async waitForElementHidden(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'hidden' });
  }

  async waitForElementAttached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'attached' });
  }

  async waitForElementDetached(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(selector, { ...waitOptions, state: 'detached' });
  }

  async waitForURL(pattern: string | RegExp, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForURL(pattern, waitOptions);
  }

  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForDOMContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }

  async waitForFunction(fn: Function, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(fn, { timeout });
  }

  async waitForResponse(urlPattern: string | RegExp, options: any = {}): Promise<any> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    return await this.page.waitForResponse(urlPattern, waitOptions);
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }
}