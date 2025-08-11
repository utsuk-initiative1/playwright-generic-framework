import { Page, Locator } from '@playwright/test';

export class Dropdown {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select option by value
   */
  async selectByValue(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, value, selectOptions);
  }

  /**
   * Select option by label
   */
  async selectByLabel(selector: string, label: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, { label }, selectOptions);
  }

  /**
   * Select option by index
   */
  async selectByIndex(selector: string, index: number, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    
    // Get all options and select by index
    const options = await this.page.locator(`${selector} option`).all();
    if (options[index]) {
      const value = await options[index].getAttribute('value');
      await this.selectByValue(selector, value, selectOptions);
    } else {
      throw new Error(`Option at index ${index} not found`);
    }
  }

  /**
   * Select multiple options
   */
  async selectMultiple(selector: string, values: string[], options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, values, selectOptions);
  }

  /**
   * Get selected option
   */
  async getSelectedOption(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return select.value;
    });
  }

  /**
   * Get all options
   */
  async getAllOptions(selector: string): Promise<Array<{ value: string; label: string; selected: boolean }>> {
    const options = await this.page.locator(`${selector} option`).all();
    
    const result = [];
    for (const option of options) {
      const value = await option.getAttribute('value');
      const label = await option.textContent();
      const selected = await option.getAttribute('selected') !== null;
      
      result.push({
        value: value || '',
        label: label || '',
        selected
      });
    }
    
    return result;
  }

  /**
   * Check if option is selected
   */
  async isOptionSelected(selector: string, value: string): Promise<boolean> {
    const selectedValue = await this.getSelectedOption(selector);
    return selectedValue === value;
  }

  /**
   * Deselect all options
   */
  async deselectAll(selector: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000,
      force: false
    };

    const selectOptions = { ...defaultOptions, ...options };
    await this.page.selectOption(selector, [], selectOptions);
  }

  /**
   * Deselect specific option
   */
  async deselectOption(selector: string, value: string, options: any = {}): Promise<void> {
    const currentValues = await this.getSelectedValues(selector);
    const newValues = currentValues.filter(v => v !== value);
    await this.selectMultiple(selector, newValues, options);
  }

  /**
   * Get selected values (for multiple select)
   */
  async getSelectedValues(selector: string): Promise<string[]> {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map(option => option.value);
    });
  }

  /**
   * Wait for option to be available
   */
  async waitForOption(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };
    await this.page.waitForSelector(`${selector} option[value="${value}"]`, waitOptions);
  }

  /**
   * Check if dropdown is enabled
   */
  async isEnabled(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isEnabled();
  }

  /**
   * Check if dropdown is disabled
   */
  async isDisabled(selector: string): Promise<boolean> {
    return !(await this.isEnabled(selector));
  }

  /**
   * Get dropdown size (number of options)
   */
  async getSize(selector: string): Promise<number> {
    const options = await this.page.locator(`${selector} option`).all();
    return options.length;
  }

  /**
   * Select option and wait for change
   */
  async selectAndWaitForChange(selector: string, value: string, options: any = {}): Promise<void> {
    const defaultOptions = {
      timeout: 10000
    };

    const waitOptions = { ...defaultOptions, ...options };

    // Wait for the change event
    const changePromise = this.page.waitForFunction(
      (sel, val) => {
        const select = document.querySelector(sel) as HTMLSelectElement;
        return select && select.value === val;
      },
      selector,
      value,
      waitOptions
    );

    await this.selectByValue(selector, value);
    await changePromise;
  }

  /**
   * Select option and verify selection
   */
  async selectAndVerify(selector: string, value: string, options: any = {}): Promise<boolean> {
    await this.selectByValue(selector, value, options);
    return await this.isOptionSelected(selector, value);
  }

  /**
   * Get dropdown placeholder text
   */
  async getPlaceholder(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.getAttribute('placeholder') || '';
  }

  /**
   * Check if dropdown has specific option
   */
  async hasOption(selector: string, value: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(`${selector} option[value="${value}"]`, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select random option
   */
  async selectRandomOption(selector: string, options: any = {}): Promise<string> {
    const allOptions = await this.getAllOptions(selector);
    const availableOptions = allOptions.filter(option => !option.disabled);
    
    if (availableOptions.length === 0) {
      throw new Error('No available options found');
    }
    
    const randomIndex = Math.floor(Math.random() * availableOptions.length);
    const randomOption = availableOptions[randomIndex];
    
    await this.selectByValue(selector, randomOption.value, options);
    return randomOption.value;
  }
}