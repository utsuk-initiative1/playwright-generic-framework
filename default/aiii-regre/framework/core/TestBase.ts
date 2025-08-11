import { test as base } from '@playwright/test';
import { BasePage } from './BasePage';

export const test = base.extend<{ basePage: BasePage }>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

export { expect } from '@playwright/test';