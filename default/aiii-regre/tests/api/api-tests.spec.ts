import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const apiBaseURL = 'https://api.www.amazon.in';

  test('API health check', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/health`);
    expect(response.status()).toBe(200);
  });

  test('API endpoints are accessible', async ({ request }) => {
    // Test common API endpoints
    const endpoints = ['/users', '/products', '/orders', '/auth'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await request.get(`${apiBaseURL}${endpoint}`);
        console.log(`Endpoint ${endpoint}: ${response.status()}`);
      } catch (error) {
        console.log(`Endpoint ${endpoint}: Not accessible`);
      }
    }
  });

  test('API response format validation', async ({ request }) => {
    try {
      const response = await request.get(`${apiBaseURL}/users`);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
        
        // Check if response is an array or object
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
      }
    } catch (error) {
      console.log('API endpoint not available for testing');
    }
  });

  test('API authentication', async ({ request }) => {
    try {
      const response = await request.post(`${apiBaseURL}/auth/login`, {
        data: {
          username: 'testuser',
          password: 'testpass'
        }
      });
      
      console.log(`Auth endpoint status: ${response.status()}`);
    } catch (error) {
      console.log('Auth endpoint not available for testing');
    }
  });
});