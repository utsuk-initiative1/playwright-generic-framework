import { Page, Browser, BrowserContext } from '@playwright/test';

export class WindowHandler {
  private page: Page;
  private browser: Browser;
  private context: BrowserContext;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.page = page;
    this.browser = browser;
    this.context = context;
  }

  async getAllPages(): Promise<Page[]> {
    return this.context.pages();
  }

  async getPageByIndex(index: number): Promise<Page | null> {
    const pages = await this.getAllPages();
    return pages[index] || null;
  }

  async getPageByTitle(title: string): Promise<Page | null> {
    const pages = await this.getAllPages();
    
    for (const page of pages) {
      const pageTitle = await page.title();
      if (pageTitle === title) {
        return page;
      }
    }
    
    return null;
  }

  async switchToPageByIndex(index: number): Promise<Page> {
    const page = await this.getPageByIndex(index);
    if (!page) {
      throw new Error(`Page at index ${index} not found`);
    }
    
    await page.bringToFront();
    return page;
  }

  async switchToPageByTitle(title: string): Promise<Page> {
    const page = await this.getPageByTitle(title);
    if (!page) {
      throw new Error(`Page with title "${title}" not found`);
    }
    
    await page.bringToFront();
    return page;
  }

  async openNewPage(url?: string): Promise<Page> {
    const newPage = await this.context.newPage();
    
    if (url) {
      await newPage.goto(url);
    }
    
    return newPage;
  }

  async closePage(page: Page): Promise<void> {
    await page.close();
  }

  async closeCurrentPage(): Promise<void> {
    await this.page.close();
  }

  async getPageCount(): Promise<number> {
    const pages = await this.getAllPages();
    return pages.length;
  }

  async waitForNewPage(options: any = {}): Promise<Page> {
    const defaultOptions = { timeout: 30000 };
    const waitOptions = { ...defaultOptions, ...options };
    return await this.context.waitForEvent('page', waitOptions);
  }
}