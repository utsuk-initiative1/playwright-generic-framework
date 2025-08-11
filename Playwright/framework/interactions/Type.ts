import { Page } from '@playwright/test';

export class Type {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async typeText(selector: string, text: string, options: any = {}): Promise<void> {
    const defaultOptions = { delay: 0, timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    await this.page.fill(selector, text, typeOptions);
  }

  async typeTextWithDelay(selector: string, text: string, delay: number = 100, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    await this.page.type(selector, text, { ...typeOptions, delay });
  }

  async clearAndType(selector: string, text: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const typeOptions = { ...defaultOptions, ...options };
    
    await this.page.fill(selector, '', typeOptions);
    await this.page.fill(selector, text, typeOptions);
  }

  async typeAndPress(selector: string, text: string, key: string, options: any = {}): Promise<void> {
    await this.typeText(selector, text, options);
    await this.page.press(selector, key);
  }

  async typeAndPressEnter(selector: string, text: string, options: any = {}): Promise<void> {
    await this.typeAndPress(selector, text, 'Enter', options);
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async clearInput(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = { timeout: 10000, force: false };
    const clearOptions = { ...defaultOptions, ...options };
    await this.page.fill(selector, '', clearOptions);
  }
}