import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export interface MCPToolCall {
  tool: string;
  arguments: Record<string, any>;
}

export interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export class PlaywrightMCPClient {
  private client: Client;
  private isConnected: boolean = false;

  constructor() {
    this.client = new Client(
      {
        name: 'playwright-mcp-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  async connect(serverCommand: string[] = ['node', 'MCPServer.js']) {
    const transport = new StdioClientTransport(serverCommand);
    await this.client.connect(transport);
    this.isConnected = true;
    console.log('MCP Client connected to server');
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('MCP Client disconnected');
    }
  }

  async listTools() {
    if (!this.isConnected) {
      throw new Error('Client not connected');
    }

    const response = await this.client.request(
      {
        method: 'tools/list',
      },
      ListToolsRequestSchema
    );

    return response.tools;
  }

  async callTool(toolName: string, arguments_: Record<string, any>): Promise<MCPResponse> {
    if (!this.isConnected) {
      throw new Error('Client not connected');
    }

    const response = await this.client.request(
      {
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: arguments_,
        },
      },
      CallToolRequestSchema
    );

    return response;
  }

  // High-level methods for common operations
  async navigateToUrl(url: string) {
    return await this.callTool('navigate_to_url', { url });
  }

  async clickElement(selector?: string, text?: string, role?: string) {
    const args: Record<string, any> = {};
    if (selector) args.selector = selector;
    if (text) args.text = text;
    if (role) args.role = role;

    return await this.callTool('click_element', args);
  }

  async fillInput(value: string, selector?: string, label?: string) {
    const args: Record<string, any> = { value };
    if (selector) args.selector = selector;
    if (label) args.label = label;

    return await this.callTool('fill_input', args);
  }

  async getPageContent(includeAccessibility: boolean = true) {
    return await this.callTool('get_page_content', { includeAccessibility });
  }

  async waitForElement(selector?: string, text?: string, timeout?: number) {
    const args: Record<string, any> = {};
    if (selector) args.selector = selector;
    if (text) args.text = text;
    if (timeout) args.timeout = timeout;

    return await this.callTool('wait_for_element', args);
  }

  async takeScreenshot(name?: string, fullPage?: boolean) {
    const args: Record<string, any> = {};
    if (name) args.name = name;
    if (fullPage !== undefined) args.fullPage = fullPage;

    return await this.callTool('take_screenshot', args);
  }

  async executeTestScenario(scenario: string, expectedResult?: string) {
    const args: Record<string, any> = { scenario };
    if (expectedResult) args.expectedResult = expectedResult;

    return await this.callTool('execute_test_scenario', args);
  }

  // AI-powered test generation
  async generateTestFromDescription(description: string, context?: string) {
    // This would integrate with AI to generate test steps
    const prompt = `Generate Playwright test steps for: ${description}${context ? `\nContext: ${context}` : ''}`;
    
    // For now, return a structured response
    return {
      content: [
        {
          type: 'text',
          text: `Generated test steps for: ${description}`,
        },
      ],
    };
  }

  // Natural language test execution
  async executeNaturalLanguageTest(instruction: string) {
    // Parse natural language instruction and convert to MCP calls
    const steps = this.parseNaturalLanguageInstruction(instruction);
    const results = [];

    for (const step of steps) {
      const result = await this.callTool(step.tool, step.arguments);
      results.push({ step, result });
    }

    return results;
  }

  private parseNaturalLanguageInstruction(instruction: string): MCPToolCall[] {
    // This is a simplified parser - in reality, you'd use AI/NLP
    const steps: MCPToolCall[] = [];

    // Basic pattern matching for common instructions
    if (instruction.toLowerCase().includes('navigate to') || instruction.toLowerCase().includes('go to')) {
      const urlMatch = instruction.match(/(?:navigate to|go to)\s+(https?:\/\/[^\s]+)/i);
      if (urlMatch) {
        steps.push({
          tool: 'navigate_to_url',
          arguments: { url: urlMatch[1] },
        });
      }
    }

    if (instruction.toLowerCase().includes('click')) {
      const clickMatch = instruction.match(/click\s+(?:on\s+)?(.+)/i);
      if (clickMatch) {
        const target = clickMatch[1].trim();
        if (target.startsWith('#')) {
          steps.push({
            tool: 'click_element',
            arguments: { selector: target },
          });
        } else {
          steps.push({
            tool: 'click_element',
            arguments: { text: target },
          });
        }
      }
    }

    if (instruction.toLowerCase().includes('fill') || instruction.toLowerCase().includes('enter')) {
      const fillMatch = instruction.match(/(?:fill|enter)\s+(.+?)\s+(?:in|into)\s+(.+)/i);
      if (fillMatch) {
        steps.push({
          tool: 'fill_input',
          arguments: { value: fillMatch[1], label: fillMatch[2] },
        });
      }
    }

    return steps;
  }
}
