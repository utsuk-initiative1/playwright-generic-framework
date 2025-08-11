require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Simple HTTP request without heavy dependencies
const https = require('https');

const AI_API_KEY = process.env.AI_API_KEY || 'AIzaSyBerzidSE4DyaupAX707WYLMbQ4';
const AI_MODEL = process.env.AI_MODEL || 'gemini-pro';

async function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(generatedText);
        } catch (error) {
          reject(new Error('Failed to parse AI response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function saveTestFile(testCode, baseUrl) {
  const dir = path.resolve(__dirname, '../../sample-tests');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const fileName = `ai-generated-${new URL(baseUrl).hostname.replace(/\./g, '-')}.spec.ts`;
  fs.writeFileSync(path.join(dir, fileName), testCode, 'utf8');
  console.log(`✅ Test saved to sample-tests/${fileName}`);
}

async function main() {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    console.error('Usage: node simple-generate-tests.js <BASE_URL>');
    process.exit(1);
  }

  console.log(`🤖 Generating AI-powered Playwright tests for ${baseUrl}...`);

  const prompt = `
You are an expert Playwright test developer. Generate3comprehensive Playwright test scenarios in TypeScript for this website: ${baseUrl}

Include tests for:
1. Page loading and title verification2avigation and user interactions
3 Form validation (if forms exist)
4. Responsive design testing
5. Common user journeys

Output only valid TypeScript code that can be saved as a .spec.ts file. Use modern Playwright syntax with async/await.

Example structure:
import { test, expect } from '@playwright/test';

test.describe('AI Generated Tests for ${baseUrl}', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(${baseUrl}');
    await expect(page).toHaveTitle(/./);
  });
  
  // Add more tests here...
});
`;

  try {
    console.log('📡Calling Gemini API...');
    const aiOutput = await callGeminiAPI(prompt);
    saveTestFile(aiOutput, baseUrl);
    console.log('🎉 AI test generation completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main(); 