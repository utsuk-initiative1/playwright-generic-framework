import { Page } from '@playwright/test';

export class BasePageObject {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }
}