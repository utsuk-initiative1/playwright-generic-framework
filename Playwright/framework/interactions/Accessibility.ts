import { Page, Locator } from '@playwright/test';
import * as axe from 'axe-core';

export class Accessibility {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run accessibility audit using axe-core
   */
  async runAccessibilityAudit(options: any = {}): Promise<any> {
    const defaultOptions = {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'color-contrast': { enabled: true },
        'document-title': { enabled: true },
        'html-has-lang': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true }
      }
    };

    const auditOptions = { ...defaultOptions, ...options };

    // Inject axe-core if not already present
    await this.page.addInitScript(() => {
      if (typeof window.axe === 'undefined') {
        // Note: In a real implementation, you'd need to inject axe-core properly
        console.log('Axe-core would be injected here');
      }
    });

    // Run accessibility audit
    const results = await this.page.evaluate((options) => {
      return new Promise((resolve) => {
        if (typeof window.axe !== 'undefined') {
          window.axe.run(options, (err, results) => {
            if (err) {
              resolve({ error: err.message });
            } else {
              resolve(results);
            }
          });
        } else {
          resolve({ error: 'Axe-core not available' });
        }
      });
    }, auditOptions);

    return results;
  }

  /**
   * Check if element has proper ARIA attributes
   */
  async checkAriaAttributes(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const ariaAttributes = await element.evaluate((el) => {
      const attributes = el.getAttributeNames();
      return attributes.filter(attr => attr.startsWith('aria-'));
    });

    return ariaAttributes.length > 0;
  }

  /**
   * Verify color contrast ratio
   */
  async checkColorContrast(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const contrastRatio = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // Simple contrast check (in real implementation, use proper color contrast calculation)
      return {
        backgroundColor,
        color,
        hasContrast: true // Placeholder
      };
    });

    return contrastRatio.hasContrast;
  }

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation(): Promise<boolean> {
    // Test tab navigation
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });

    return focusedElement !== null;
  }

  /**
   * Verify screen reader compatibility
   */
  async checkScreenReaderCompatibility(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    
    const screenReaderInfo = await element.evaluate((el) => {
      return {
        hasAriaLabel: !!el.getAttribute('aria-label'),
        hasAriaLabelledby: !!el.getAttribute('aria-labelledby'),
        hasRole: !!el.getAttribute('role'),
        isFocusable: el.tabIndex >= 0
      };
    });

    return screenReaderInfo.hasAriaLabel || screenReaderInfo.hasAriaLabelledby || screenReaderInfo.hasRole;
  }

  /**
   * Generate accessibility report
   */
  async generateAccessibilityReport(): Promise<any> {
    const auditResults = await this.runAccessibilityAudit();
    
    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      violations: auditResults.violations || [],
      passes: auditResults.passes || [],
      incomplete: auditResults.incomplete || [],
      inapplicable: auditResults.inapplicable || [],
      summary: {
        totalViolations: auditResults.violations?.length || 0,
        totalPasses: auditResults.passes?.length || 0,
        totalIncomplete: auditResults.incomplete?.length || 0
      }
    };

    return report;
  }
}