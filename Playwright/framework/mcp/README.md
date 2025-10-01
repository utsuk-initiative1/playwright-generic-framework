# 🤖 MCP Integration for Playwright Framework

## Overview

This module provides Model Context Protocol (MCP) integration for the Playwright automation framework, enabling AI-powered test generation and execution through natural language instructions.

## Features

### 🧠 AI-Powered Test Generation
- **Natural Language Test Creation**: Create tests using plain English descriptions
- **User Story Parsing**: Convert user stories into executable test scenarios
- **Page Analysis**: Automatically generate tests by analyzing page content
- **Smart Test Discovery**: AI identifies testable elements and interactions

### 🎯 Advanced Automation
- **Context-Aware Testing**: AI understands page context and user intent
- **Self-Healing Tests**: Automatically adapt to UI changes
- **Intelligent Element Detection**: Find elements even when selectors change
- **Dynamic Test Adaptation**: Tests adjust to different environments

### 🔧 MCP Tools
- **Navigation**: Navigate to URLs with context awareness
- **Element Interaction**: Click, fill, and interact with elements intelligently
- **Content Analysis**: Get page content with accessibility information
- **Screenshot Capture**: Take screenshots with AI context
- **Test Execution**: Execute complete test scenarios from natural language

## Installation

```bash
# Install MCP dependencies
cd framework/mcp
npm install

# Install MCP SDK globally
npm install -g @modelcontextprotocol/sdk
```

## Quick Start

### 1. Basic MCP Integration

```typescript
import { MCPIntegration } from './framework/mcp/MCPIntegration.js';
import { chromium } from '@playwright/test';

async function example() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const mcp = new MCPIntegration(page, browser);
  await mcp.initialize();
  
  // Execute natural language test
  await mcp.executeNaturalLanguageTest('Navigate to Google and search for Playwright');
  
  await mcp.cleanup();
  await browser.close();
}
```

### 2. AI Test Generation

```typescript
// Generate tests from user story
const scenarios = await mcp.generateTestsFromUserStory(
  'As a user, I want to login to the application so that I can access my dashboard'
);

// Generate tests from page analysis
const pageTests = await mcp.generateTestsFromPageAnalysis();

// Generate accessibility tests
const a11yTests = await mcp.generateAccessibilityTests();
```

### 3. Comprehensive Test Suite

```typescript
// Generate and execute comprehensive test suite
const testSuite = await mcp.generateComprehensiveTestSuite();
const results = await mcp.executeTestSuite(testSuite);

console.log(`Tests passed: ${results.passed}, failed: ${results.failed}`);
```

## Configuration

### Environment Variables

```bash
# AI Provider Configuration
export AI_PROVIDER=openai  # or claude, gemini
export AI_API_KEY=your_api_key_here
export AI_MODEL=gpt-4  # or claude-3, gemini-pro

# MCP Server Configuration
export MCP_SERVER_COMMAND="node MCPServer.js"
```

### MCP Configuration

```typescript
const config: MCPConfig = {
  enableAI: true,
  aiProvider: 'openai',
  aiApiKey: process.env.OPENAI_API_KEY,
  serverCommand: ['node', 'MCPServer.js']
};

const mcp = new MCPIntegration(page, browser, config);
```

## Available MCP Tools

### Navigation
- `navigate_to_url(url)` - Navigate to a specific URL
- `wait_for_page_load()` - Wait for page to fully load

### Element Interaction
- `click_element(selector|text|role)` - Click on elements
- `fill_input(value, selector|label)` - Fill input fields
- `wait_for_element(selector|text, timeout)` - Wait for elements

### Content Analysis
- `get_page_content(includeAccessibility)` - Get page content and structure
- `analyze_accessibility()` - Analyze accessibility issues
- `get_performance_metrics()` - Get performance data

### Visual Testing
- `take_screenshot(name, fullPage)` - Capture screenshots
- `compare_with_baseline()` - Compare with baseline images

### Test Execution
- `execute_test_scenario(scenario, expectedResult)` - Execute test scenarios
- `generate_test_steps(description)` - Generate test steps from description

## AI Test Generation Examples

### 1. User Story to Test

```typescript
const userStory = `
As a customer, I want to add items to my shopping cart
so that I can purchase them later.

Acceptance Criteria:
- I can search for products
- I can add products to cart
- I can view cart contents
- I can remove items from cart
`;

const scenarios = await mcp.generateTestsFromUserStory(userStory);
```

### 2. Natural Language Test Execution

```typescript
// Execute tests using natural language
await mcp.executeNaturalLanguageTest('Go to the login page and enter invalid credentials');
await mcp.executeNaturalLanguageTest('Click on the search button and verify results appear');
await mcp.executeNaturalLanguageTest('Fill out the contact form and submit it');
```

### 3. Page Analysis and Test Generation

```typescript
// Analyze current page and generate tests
const pageTests = await mcp.generateTestsFromPageAnalysis();

// Generate specific test types
const a11yTests = await mcp.generateAccessibilityTests();
const perfTests = await mcp.generatePerformanceTests();
const visualTests = await mcp.generateVisualRegressionTests();
```

## Advanced Features

### Self-Healing Tests

```typescript
// AI automatically adapts to UI changes
await mcp.executeNaturalLanguageTest('Click on the submit button');
// If button selector changes, AI finds it by text or other attributes
```

### Context-Aware Testing

```typescript
// AI understands page context
await mcp.executeNaturalLanguageTest('Fill out the registration form');
// AI knows which fields are required and validates accordingly
```

### Dynamic Test Adaptation

```typescript
// Tests adapt to different environments
const stagingTests = await mcp.generateTestsFromPageAnalysis();
// AI adjusts selectors and expectations for staging environment
```

## Integration with Existing Framework

### CLI Integration

```bash
# Add MCP features to CLI
playwright-framework --enable-mcp --ai-provider openai

# Generate tests with AI
playwright-framework --generate-tests --user-story "Login functionality"
```

### Test Runner Integration

```typescript
// Integrate with existing test runner
import { MCPIntegration } from './framework/mcp/MCPIntegration.js';

test('AI-generated test', async ({ page, browser }) => {
  const mcp = new MCPIntegration(page, browser);
  await mcp.initialize();
  
  const scenarios = await mcp.generateTestsFromUserStory('Login test');
  const success = await mcp.executeAIGeneratedTest(scenarios[0]);
  
  expect(success).toBe(true);
  
  await mcp.cleanup();
});
```

## Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   ```bash
   # Check if MCP server is running
   node MCPServer.js
   ```

2. **AI API Key Not Found**
   ```bash
   # Set environment variable
   export AI_API_KEY=your_key_here
   ```

3. **Element Not Found**
   ```typescript
   // AI will try multiple strategies
   await mcp.clickElement(undefined, 'Submit Button'); // Try by text
   await mcp.clickElement('#submit-btn'); // Try by selector
   ```

### Debug Mode

```typescript
const mcp = new MCPIntegration(page, browser, {
  enableAI: true,
  debug: true  // Enable debug logging
});
```

## Performance Considerations

- **AI API Calls**: Each AI operation makes API calls - consider rate limits
- **Test Generation**: Large pages may take longer to analyze
- **Memory Usage**: AI models require additional memory
- **Caching**: Consider caching generated tests for reuse

## Future Enhancements

- **Multi-Model Support**: Support for multiple AI providers
- **Test Optimization**: AI-powered test optimization
- **Smart Retry Logic**: AI-driven retry strategies
- **Test Maintenance**: AI-powered test maintenance and updates
- **Collaborative Testing**: AI-assisted team testing workflows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add MCP functionality
4. Write tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
