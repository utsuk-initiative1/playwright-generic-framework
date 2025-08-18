import { test as base, Page, Browser, BrowserContext } from '@playwright/test';
import { LoginAuthPage } from '../pages/LoginAuthPage';
import { TestData } from './testData';
import { AuthFixtures } from './authFixtures';
import { AssertionFactory } from '../utils/AssertionFactory';

// Define the fixture types
export interface TestFixtures {
  page: Page;
  browser: Browser;
  context: BrowserContext;
  loginPage: LoginAuthPage;
  testData: TestData;
  auth: AuthFixtures;
  assertions: AssertionFactory;
}

// Extend the base test with our custom fixtures
export const test = base.extend<TestFixtures>({
  // Page fixture
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Browser fixture
  browser: async ({ browser }, use) => {
    await use(browser);
  },

  // Context fixture
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  // LoginAuthPage fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginAuthPage(page);
    await use(loginPage);
  },

  // TestData fixture
  testData: async ({}, use) => {
    const testData = new TestData();
    await use(testData);
  },

  // Auth fixtures
  auth: async ({ page, loginPage, testData }, use) => {
    const authFixtures = new AuthFixtures(page, loginPage, testData);
    await use(authFixtures);
  },

  // Assertion factory fixture
  assertions: async ({ page }, use) => {
    const assertionFactory = new AssertionFactory(page, {
      defaultTimeout: 10000,
      defaultSoft: false,
      screenshotOnFailure: true
    });
    await use(assertionFactory);
  },
});

export { expect } from '@playwright/test';
