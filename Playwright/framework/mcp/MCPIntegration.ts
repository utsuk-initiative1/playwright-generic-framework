import { Page, Browser } from '@playwright/test';
import { PlaywrightMCPClient } from './MCPClient.js';
import { AITestGenerator, TestScenario } from './AITestGenerator.js';

export interface MCPConfig {
  serverCommand?: string[];
  enableAI?: boolean;
  aiProvider?: 'openai' | 'claude' | 'gemini';
  aiApiKey?: string;
}

export class MCPIntegration {
  private mcpClient: PlaywrightMCPClient;
  private aiTestGenerator: AITestGenerator | null = null;
  private page: Page;
  private browser: Browser;
  private config: MCPConfig;

  constructor(page: Page, browser: Browser, config: MCPConfig = {}) {
    this.page = page;
    this.browser = browser;
    this.config = {
      enableAI: true,
      aiProvider: 'openai',
      ...config,
    };
    this.mcpClient = new PlaywrightMCPClient();
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing MCP Integration...');
    
    // Connect to MCP server
    await this.mcpClient.connect(this.config.serverCommand);
    
    // Initialize AI test generator if enabled
    if (this.config.enableAI) {
      this.aiTestGenerator = new AITestGenerator(this.page);
      await this.aiTestGenerator.initialize();
    }
    
    console.log('✅ MCP Integration initialized successfully');
  }

  // Natural Language Test Execution
  async executeNaturalLanguageTest(instruction: string): Promise<any> {
    console.log(`🤖 Executing natural language test: "${instruction}"`);
    
    const results = await this.mcpClient.executeNaturalLanguageTest(instruction);
    
    console.log('✅ Natural language test executed successfully');
    return results;
  }

  // AI-Powered Test Generation
  async generateTestsFromUserStory(userStory: string): Promise<TestScenario[]> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log(`🧠 Generating tests from user story: "${userStory}"`);
    
    const scenarios = await this.aiTestGenerator.generateTestFromUserStory(userStory);
    
    console.log(`✅ Generated ${scenarios.length} test scenarios`);
    return scenarios;
  }

  async generateTestsFromPageAnalysis(): Promise<TestScenario[]> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log('🔍 Analyzing page for test scenarios...');
    
    const scenarios = await this.aiTestGenerator.generateTestFromPageAnalysis();
    
    console.log(`✅ Generated ${scenarios.length} test scenarios from page analysis`);
    return scenarios;
  }

  async generateAccessibilityTests(): Promise<TestScenario[]> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log('♿ Generating accessibility tests...');
    
    const scenarios = await this.aiTestGenerator.generateAccessibilityTests();
    
    console.log(`✅ Generated ${scenarios.length} accessibility test scenarios`);
    return scenarios;
  }

  async generatePerformanceTests(): Promise<TestScenario[]> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log('⚡ Generating performance tests...');
    
    const scenarios = await this.aiTestGenerator.generatePerformanceTests();
    
    console.log(`✅ Generated ${scenarios.length} performance test scenarios`);
    return scenarios;
  }

  async generateVisualRegressionTests(): Promise<TestScenario[]> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log('📸 Generating visual regression tests...');
    
    const scenarios = await this.aiTestGenerator.generateVisualRegressionTests();
    
    console.log(`✅ Generated ${scenarios.length} visual regression test scenarios`);
    return scenarios;
  }

  // Execute AI-generated tests
  async executeAIGeneratedTest(scenario: TestScenario): Promise<boolean> {
    if (!this.aiTestGenerator) {
      throw new Error('AI test generator not initialized');
    }

    console.log(`🎯 Executing AI-generated test: "${scenario.name}"`);
    
    const success = await this.aiTestGenerator.executeAIGeneratedTest(scenario);
    
    if (success) {
      console.log('✅ AI-generated test executed successfully');
    } else {
      console.log('❌ AI-generated test failed');
    }
    
    return success;
  }

  // Direct MCP operations
  async navigateToUrl(url: string): Promise<any> {
    return await this.mcpClient.navigateToUrl(url);
  }

  async clickElement(selector?: string, text?: string, role?: string): Promise<any> {
    return await this.mcpClient.clickElement(selector, text, role);
  }

  async fillInput(value: string, selector?: string, label?: string): Promise<any> {
    return await this.mcpClient.fillInput(value, selector, label);
  }

  async getPageContent(includeAccessibility: boolean = true): Promise<any> {
    return await this.mcpClient.getPageContent(includeAccessibility);
  }

  async waitForElement(selector?: string, text?: string, timeout?: number): Promise<any> {
    return await this.mcpClient.waitForElement(selector, text, timeout);
  }

  async takeScreenshot(name?: string, fullPage?: boolean): Promise<any> {
    return await this.mcpClient.takeScreenshot(name, fullPage);
  }

  // Batch operations
  async executeTestSuite(scenarios: TestScenario[]): Promise<{ passed: number; failed: number; results: any[] }> {
    console.log(`🎬 Executing test suite with ${scenarios.length} scenarios`);
    
    const results = [];
    let passed = 0;
    let failed = 0;

    for (const scenario of scenarios) {
      try {
        const success = await this.executeAIGeneratedTest(scenario);
        results.push({ scenario: scenario.name, success, error: null });
        
        if (success) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        results.push({ scenario: scenario.name, success: false, error: error.message });
        failed++;
      }
    }

    console.log(`📊 Test suite completed: ${passed} passed, ${failed} failed`);
    return { passed, failed, results };
  }

  // Smart test generation based on page type
  async generateComprehensiveTestSuite(): Promise<TestScenario[]> {
    console.log('🎯 Generating comprehensive test suite...');
    
    const allScenarios: TestScenario[] = [];

    // Generate different types of tests
    const pageAnalysisTests = await this.generateTestsFromPageAnalysis();
    const accessibilityTests = await this.generateAccessibilityTests();
    const performanceTests = await this.generatePerformanceTests();
    const visualTests = await this.generateVisualRegressionTests();

    allScenarios.push(...pageAnalysisTests);
    allScenarios.push(...accessibilityTests);
    allScenarios.push(...performanceTests);
    allScenarios.push(...visualTests);

    console.log(`✅ Generated comprehensive test suite with ${allScenarios.length} scenarios`);
    return allScenarios;
  }

  // Interactive test generation
  async generateInteractiveTests(): Promise<TestScenario[]> {
    console.log('🎮 Generating interactive tests...');
    
    const scenarios: TestScenario[] = [];

    // Generate tests for common user interactions
    const commonInteractions = [
      'Click on all buttons',
      'Fill all form fields',
      'Navigate through all links',
      'Test all dropdowns',
      'Verify all images load',
    ];

    for (const interaction of commonInteractions) {
      scenarios.push({
        name: `Interactive Test: ${interaction}`,
        description: `Test ${interaction.toLowerCase()}`,
        steps: [
          {
            action: 'navigate',
            target: this.page.url(),
          },
          {
            action: 'interact',
            target: interaction,
          },
        ],
        expectedResult: `${interaction} works correctly`,
      });
    }

    return scenarios;
  }

  // Cleanup
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up MCP Integration...');
    
    if (this.aiTestGenerator) {
      await this.aiTestGenerator.cleanup();
    }
    
    await this.mcpClient.disconnect();
    
    console.log('✅ MCP Integration cleaned up successfully');
  }
}
