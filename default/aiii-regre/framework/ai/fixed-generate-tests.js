require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const PROMPTS = require('./prompts');

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = 'gemini-1.5-flash'; // Updated model name

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
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          if (result.error) {
            console.error('❌ API Error:', result.error.message);
            reject(new Error(result.error.message));
            return;
          }
          
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

function saveTestFile(content, baseUrl, testType = 'basic') {
  const domain = new URL(baseUrl).hostname.replace(/\./g, '-');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `${testType}-${domain}-${timestamp}.spec.ts`;
  
  // Create directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', '..', 'sample-tests', testType);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filePath = path.join(outputDir, fileName);
  
  // Clean up the content - remove markdown formatting and extract only TypeScript code
  let cleanContent = content;
  cleanContent = cleanContent.replace(/```typescript\n?/g, '');
  cleanContent = cleanContent.replace(/```\n?/g, '');
  cleanContent = cleanContent.replace(/^#.*$/gm, '');
  cleanContent = cleanContent.replace(/^##.*$/gm, '');
  if (!cleanContent.includes('import { test, expect }')) {
    cleanContent = `import { test, expect } from '@playwright/test';\n\n${cleanContent}`;
  }
  const header = `/**\n * AI Generated Basic Test Suite\n * Generated for: ${baseUrl}\n * Generated on: ${new Date().toISOString()}\n * Test Type: basic\n *\n * This file contains automated tests generated using Gemini AI.\n * Please review and customize selectors based on your actual website structure.\n */\n\n`;
  fs.writeFileSync(filePath, header + cleanContent);
  console.log(`✅ Basic tests saved to: ${filePath}`);
  return filePath;
}

async function main() {
  const baseUrl = process.argv[2] || 'https://work.mercor.com/';
  console.log(`🤖 Generating AI-powered Playwright tests for ${baseUrl}...`);

  const prompt = PROMPTS.BASIC_TEST(baseUrl);

  try {
    const aiOutput = await callGeminiAPI(prompt);
    if (aiOutput.trim()) {
      saveTestFile(aiOutput, baseUrl, 'basic');
      console.log('🎉 AI test generation completed!');
    } else {
      console.log('⚠️ No content generated from AI');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
} 