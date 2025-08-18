import { Response, expect } from '@playwright/test';
import { AssertionUtils, ApiAssertionOptions } from './AssertionUtils';

export interface ApiResponseSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, any>;
  required?: string[];
  items?: any;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enum?: any[];
}

export interface ApiTestData {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  expectedStatus: number;
  expectedSchema?: ApiResponseSchema;
  expectedHeaders?: Record<string, string>;
  maxResponseTime?: number;
}

export class ApiAssertionUtils extends AssertionUtils {
  /**
   * Comprehensive API response assertion
   */
  async assertApiResponse(
    response: Response,
    options: ApiAssertionOptions & {
      expectedSchema?: ApiResponseSchema;
      expectedHeaders?: Record<string, string>;
      validateJson?: boolean;
    } = {}
  ): Promise<void> {
    const {
      statusCode,
      contentType,
      responseTime,
      expectedSchema,
      expectedHeaders,
      validateJson = true,
      message,
      soft = false
    } = options;

    const assertions: Array<{ condition: boolean; message: string }> = [];

    // Status code assertion
    if (statusCode !== undefined) {
      assertions.push({
        condition: response.status() === statusCode,
        message: `Expected status code ${statusCode}, got ${response.status()}`
      });
    }

    // Content type assertion
    if (contentType !== undefined) {
      const actualContentType = response.headers()['content-type'] || '';
      assertions.push({
        condition: actualContentType.includes(contentType),
        message: `Expected content type to contain "${contentType}", got "${actualContentType}"`
      });
    }

    // Response time assertion
    if (responseTime !== undefined) {
      const actualResponseTime = response.request().timing()?.responseEnd || 0;
      assertions.push({
        condition: actualResponseTime <= responseTime,
        message: `Expected response time <= ${responseTime}ms, got ${actualResponseTime}ms`
      });
    }

    // Headers assertion
    if (expectedHeaders) {
      for (const [headerName, expectedValue] of Object.entries(expectedHeaders)) {
        const actualValue = response.headers()[headerName.toLowerCase()];
        assertions.push({
          condition: actualValue === expectedValue,
          message: `Expected header "${headerName}" to be "${expectedValue}", got "${actualValue}"`
        });
      }
    }

    // JSON validation
    if (validateJson && contentType?.includes('application/json')) {
      try {
        const jsonData = await response.json();
        assertions.push({
          condition: typeof jsonData === 'object',
          message: 'Response should be valid JSON object'
        });

        // Schema validation
        if (expectedSchema) {
          const schemaValidation = this.validateApiSchema(jsonData, expectedSchema);
          if (!schemaValidation.isValid) {
            assertions.push({
              condition: false,
              message: `Schema validation failed: ${schemaValidation.errors.join(', ')}`
            });
          }
        }
      } catch (error) {
        assertions.push({
          condition: false,
          message: `Failed to parse JSON response: ${error}`
        });
      }
    }

    // Check all assertions
    const failedAssertions = assertions.filter(a => !a.condition);
    
    if (failedAssertions.length > 0) {
      const errorMessage = message || 
        `API Response assertion failed:\n${failedAssertions.map(a => `- ${a.message}`).join('\n')}`;
      
      if (soft) {
        // Add to soft assertions
        this.softAssertions.push({
          condition: false,
          message: errorMessage,
          timestamp: new Date()
        });
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Assert API endpoint availability
   */
  async assertEndpointAvailable(
    url: string,
    method: string = 'GET',
    options: ApiAssertionOptions = {}
  ): Promise<Response> {
    const { timeout = 30000, statusCode = 200 } = options;

    try {
      const response = await this.page.request.get(url, { timeout });
      await this.assertApiResponse(response, { statusCode, ...options });
      return response;
    } catch (error) {
      const errorMessage = `Endpoint ${method} ${url} is not available: ${error}`;
      await this.assert(false, errorMessage, options);
      throw error;
    }
  }

  /**
   * Assert API response contains specific data
   */
  async assertResponseContains(
    response: Response,
    expectedData: Record<string, any>,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    try {
      const responseData = await response.json();
      
      for (const [key, expectedValue] of Object.entries(expectedData)) {
        const actualValue = this.getNestedValue(responseData, key);
        
        if (actualValue !== expectedValue) {
          const errorMessage = `Response should contain ${key}: "${expectedValue}", got: "${actualValue}"`;
          await this.assert(false, errorMessage, options);
        }
      }
    } catch (error) {
      const errorMessage = `Failed to validate response data: ${error}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert API response array length
   */
  async assertResponseArrayLength(
    response: Response,
    expectedLength: number,
    arrayPath: string = 'data',
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    try {
      const responseData = await response.json();
      const array = this.getNestedValue(responseData, arrayPath);
      
      if (!Array.isArray(array)) {
        const errorMessage = `Response should contain array at path "${arrayPath}"`;
        await this.assert(false, errorMessage, options);
        return;
      }
      
      if (array.length !== expectedLength) {
        const errorMessage = `Expected array length ${expectedLength}, got ${array.length}`;
        await this.assert(false, errorMessage, options);
      }
    } catch (error) {
      const errorMessage = `Failed to validate array length: ${error}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert API response contains specific error
   */
  async assertApiError(
    response: Response,
    expectedError: {
      code?: string | number;
      message?: string;
      statusCode?: number;
    },
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const assertions: Array<{ condition: boolean; message: string }> = [];

    // Status code assertion
    if (expectedError.statusCode) {
      assertions.push({
        condition: response.status() === expectedError.statusCode,
        message: `Expected error status code ${expectedError.statusCode}, got ${response.status()}`
      });
    }

    // Error response validation
    try {
      const errorData = await response.json();
      
      if (expectedError.code) {
        const actualCode = errorData.code || errorData.error?.code;
        assertions.push({
          condition: actualCode === expectedError.code,
          message: `Expected error code "${expectedError.code}", got "${actualCode}"`
        });
      }

      if (expectedError.message) {
        const actualMessage = errorData.message || errorData.error?.message;
        assertions.push({
          condition: actualMessage?.includes(expectedError.message),
          message: `Expected error message to contain "${expectedError.message}", got "${actualMessage}"`
        });
      }
    } catch (error) {
      assertions.push({
        condition: false,
        message: `Failed to parse error response: ${error}`
      });
    }

    // Check assertions
    const failedAssertions = assertions.filter(a => !a.condition);
    
    if (failedAssertions.length > 0) {
      const errorMessage = `API Error assertion failed:\n${failedAssertions.map(a => `- ${a.message}`).join('\n')}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Assert API response performance
   */
  async assertResponsePerformance(
    response: Response,
    maxResponseTime: number,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const timing = response.request().timing();
    const responseTime = timing?.responseEnd || 0;
    
    const errorMessage = `Response time ${responseTime}ms exceeds maximum ${maxResponseTime}ms`;
    await this.assert(responseTime <= maxResponseTime, errorMessage, options);
  }

  /**
   * Assert API response size
   */
  async assertResponseSize(
    response: Response,
    maxSizeBytes: number,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const contentLength = response.headers()['content-length'];
    const size = contentLength ? parseInt(contentLength) : 0;
    
    const errorMessage = `Response size ${size} bytes exceeds maximum ${maxSizeBytes} bytes`;
    await this.assert(size <= maxSizeBytes, errorMessage, options);
  }

  /**
   * Assert API response caching headers
   */
  async assertCachingHeaders(
    response: Response,
    expectedCacheControl?: string,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const cacheControl = response.headers()['cache-control'];
    
    if (expectedCacheControl) {
      const errorMessage = `Expected cache-control "${expectedCacheControl}", got "${cacheControl}"`;
      await this.assert(cacheControl === expectedCacheControl, errorMessage, options);
    } else {
      // Just check that cache-control header exists
      const errorMessage = 'Response should have cache-control header';
      await this.assert(!!cacheControl, errorMessage, options);
    }
  }

  /**
   * Assert API response security headers
   */
  async assertSecurityHeaders(
    response: Response,
    options: ApiAssertionOptions = {}
  ): Promise<void> {
    const headers = response.headers();
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    const missingHeaders = securityHeaders.filter(header => !headers[header]);
    
    if (missingHeaders.length > 0) {
      const errorMessage = `Missing security headers: ${missingHeaders.join(', ')}`;
      await this.assert(false, errorMessage, options);
    }
  }

  /**
   * Helper methods
   */
  private validateApiSchema(data: any, schema: ApiResponseSchema): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (schema.type === 'object' && schema.properties) {
      for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
        const value = data[propertyName];
        
        if (schema.required?.includes(propertyName) && value === undefined) {
          errors.push(`Missing required property: ${propertyName}`);
          continue;
        }

        if (value !== undefined) {
          const propertyValidation = this.validateApiSchema(value, propertySchema);
          errors.push(...propertyValidation.errors.map(e => `${propertyName}.${e}`));
        }
      }
    } else if (schema.type === 'array' && schema.items) {
      if (!Array.isArray(data)) {
        errors.push('Expected array type');
      } else {
        for (let i = 0; i < data.length; i++) {
          const itemValidation = this.validateApiSchema(data[i], schema.items);
          errors.push(...itemValidation.errors.map(e => `[${i}].${e}`));
        }
      }
    } else if (schema.type === 'string') {
      if (typeof data !== 'string') {
        errors.push('Expected string type');
      } else {
        if (schema.minLength && data.length < schema.minLength) {
          errors.push(`String length ${data.length} is less than minimum ${schema.minLength}`);
        }
        if (schema.maxLength && data.length > schema.maxLength) {
          errors.push(`String length ${data.length} is greater than maximum ${schema.maxLength}`);
        }
        if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
          errors.push(`String does not match pattern: ${schema.pattern}`);
        }
        if (schema.enum && !schema.enum.includes(data)) {
          errors.push(`String value "${data}" is not in enum: [${schema.enum.join(', ')}]`);
        }
      }
    } else if (schema.type === 'number') {
      if (typeof data !== 'number') {
        errors.push('Expected number type');
      } else {
        if (schema.minimum !== undefined && data < schema.minimum) {
          errors.push(`Number ${data} is less than minimum ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && data > schema.maximum) {
          errors.push(`Number ${data} is greater than maximum ${schema.maximum}`);
        }
      }
    } else if (schema.type === 'boolean') {
      if (typeof data !== 'boolean') {
        errors.push('Expected boolean type');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
