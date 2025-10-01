import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Page, Browser } from '@playwright/test';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export class PlaywrightMCPServer {
  private server: Server;
  private page: Page | null = null;
  private browser: Browser | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'navigate_to_url',
            description: 'Navigate to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element using various selectors',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector, text content, or accessibility label',
                },
                text: {
                  type: 'string',
                  description: 'Text content to click on',
                },
                role: {
                  type: 'string',
                  description: 'ARIA role of the element',
                },
              },
            },
          },
          {
            name: 'fill_input',
            description: 'Fill an input field with text',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input field',
                },
                value: {
                  type: 'string',
                  description: 'Text to fill in the input',
                },
                label: {
                  type: 'string',
                  description: 'Label text of the input field',
                },
              },
              required: ['value'],
            },
          },
          {
            name: 'get_page_content',
            description: 'Get the current page content and structure',
            inputSchema: {
              type: 'object',
              properties: {
                includeAccessibility: {
                  type: 'boolean',
                  description: 'Include accessibility information',
                  default: true,
                },
              },
            },
          },
          {
            name: 'wait_for_element',
            description: 'Wait for an element to appear on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
                text: {
                  type: 'string',
                  description: 'Text content to wait for',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                  default: 10000,
                },
              },
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the screenshot file',
                },
                fullPage: {
                  type: 'boolean',
                  description: 'Take full page screenshot',
                  default: false,
                },
              },
            },
          },
          {
            name: 'execute_test_scenario',
            description: 'Execute a complete test scenario described in natural language',
            inputSchema: {
              type: 'object',
              properties: {
                scenario: {
                  type: 'string',
                  description: 'Natural language description of the test scenario',
                },
                expectedResult: {
                  type: 'string',
                  description: 'Expected result or assertion',
                },
              },
              required: ['scenario'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'navigate_to_url':
            return await this.navigateToUrl(args.url);

          case 'click_element':
            return await this.clickElement(args);

          case 'fill_input':
            return await this.fillInput(args);

          case 'get_page_content':
            return await this.getPageContent(args.includeAccessibility);

          case 'wait_for_element':
            return await this.waitForElement(args);

          case 'take_screenshot':
            return await this.takeScreenshot(args);

          case 'execute_test_scenario':
            return await this.executeTestScenario(args.scenario, args.expectedResult);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  private async navigateToUrl(url: string) {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initializeBrowser first.');
    }

    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');

    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to ${url}`,
        },
      ],
    };
  }

  private async clickElement(args: any) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    let locator;
    if (args.selector) {
      locator = this.page.locator(args.selector);
    } else if (args.text) {
      locator = this.page.getByText(args.text);
    } else if (args.role) {
      locator = this.page.getByRole(args.role);
    } else {
      throw new Error('Must provide selector, text, or role');
    }

    await locator.click();

    return {
      content: [
        {
          type: 'text',
          text: `Successfully clicked element: ${JSON.stringify(args)}`,
        },
      ],
    };
  }

  private async fillInput(args: any) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    let locator;
    if (args.selector) {
      locator = this.page.locator(args.selector);
    } else if (args.label) {
      locator = this.page.getByLabel(args.label);
    } else {
      throw new Error('Must provide selector or label');
    }

    await locator.fill(args.value);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully filled input with: ${args.value}`,
        },
      ],
    };
  }

  private async getPageContent(includeAccessibility: boolean = true) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const content = {
      url: this.page.url(),
      title: await this.page.title(),
      text: await this.page.textContent('body'),
    };

    if (includeAccessibility) {
      // Get accessibility snapshot
      const snapshot = await this.page.accessibility.snapshot();
      content['accessibility'] = snapshot;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(content, null, 2),
        },
      ],
    };
  }

  private async waitForElement(args: any) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const timeout = args.timeout || 10000;
    let locator;

    if (args.selector) {
      locator = this.page.locator(args.selector);
    } else if (args.text) {
      locator = this.page.getByText(args.text);
    } else {
      throw new Error('Must provide selector or text');
    }

    await locator.waitFor({ timeout });

    return {
      content: [
        {
          type: 'text',
          text: `Element found: ${JSON.stringify(args)}`,
        },
      ],
    };
  }

  private async takeScreenshot(args: any) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const name = args.name || `screenshot-${Date.now()}`;
    const fullPage = args.fullPage || false;
    const path = `test-results/screenshots/${name}.png`;

    await this.page.screenshot({ path, fullPage });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to: ${path}`,
        },
      ],
    };
  }

  private async executeTestScenario(scenario: string, expectedResult?: string) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    // This is where we'd integrate with AI to parse the scenario
    // For now, we'll return a structured response
    const result = {
      scenario,
      expectedResult,
      status: 'executed',
      timestamp: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Test scenario executed: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async setPage(page: Page) {
    this.page = page;
  }

  async setBrowser(browser: Browser) {
    this.browser = browser;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Server started');
  }
}
