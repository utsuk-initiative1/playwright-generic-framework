require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const AI_API_KEY = process.env.AI_API_KEY || 'AIzaSyBerzidSE4DyaupAX707WYLMbQ4';
const AI_MODEL = process.env.AI_MODEL || 'gemini-pro';

console.log('🔧 Debug Info:');
console.log('AI_API_KEY:', AI_API_KEY ? 'Set' : 'Not set');
console.log('AI_MODEL:', AI_MODEL);

async function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    console.log('📤 Sending request to Gemini API...');
    console.log('Request data:', data.substring(0, 20));
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

    console.log('🌐 API URL:', `https://generativelanguage.googleapis.com${options.path}`);

    const req = https.request(options, (res) => {
      console.log('📥 Response status:', res.statusCode);
      console.log('📥 Response headers:', res.headers);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('📥 Full response:', responseData);
        try {
          const result = JSON.parse(responseData);
          console.log('🔍 Parsed result:', JSON.stringify(result, null, 2));
          
          const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
          console.log('📝 Generated text length:', generatedText.length);
          console.log('📝 Generated text preview:', generatedText.substring(0, 100));
          
          resolve(generatedText);
        } catch (error) {
          console.error('❌ Parse error:', error);
          reject(new Error('Failed to parse AI response'));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
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
  
  const fileName = `debug-generated-${new URL(baseUrl).hostname.replace(/\./g, '-')}.spec.ts`;
  fs.writeFileSync(path.join(dir, fileName), testCode, 'utf8');
  console.log(`✅ Test saved to sample-tests/${fileName}`);
  console.log(`📄 File size: ${testCode.length} characters`);
}

async function main() {
  const baseUrl = process.argv[2] || 'https://example.com';
  console.log(`🤖 Generating AI-powered Playwright tests for ${baseUrl}...`);

  const prompt = `
Generate a simple Playwright test in TypeScript for this website: ${baseUrl}

Create a basic test that:
1. Navigates to the website
2. Checks the page title
3. Verifies the page loads

Output only the TypeScript code, no explanations.

Example:
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('${baseUrl}'); await expect(page).toHaveTitle(/./);
});
`;

  try {
    const aiOutput = await callGeminiAPI(prompt);
    if (aiOutput.trim()) {
      saveTestFile(aiOutput, baseUrl);
      console.log('🎉 AI test generation completed!');
    } else {
      console.log('⚠️ No content generated from AI');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main(); 