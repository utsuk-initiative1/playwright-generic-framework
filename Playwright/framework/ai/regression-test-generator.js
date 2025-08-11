require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const PROMPTS = require('./prompts');

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = 'gemini-1.5-flash';

console.log('🔧 Regression Test Generator');
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
          
          if (result.error) {
            console.error('❌ API Error:', result.error.message);
            reject(new Error(result.error.message));
            return;
          }
          
          const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
          console.log('📝 Generated text length:', generatedText.length);
          
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

function saveTestFile(content, baseUrl, testType = 'regression') {
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
  const header = `/**\n * AI Generated Regression Test Suite\n * Generated for: ${baseUrl}\n * Generated on: ${new Date().toISOString()}\n * Test Type: regression\n *\n * This file contains automated tests generated using Gemini AI.\n * Please review and customize selectors based on your actual website structure.\n */\n\n`;
  fs.writeFileSync(filePath, header + cleanContent);
  console.log(`✅ Regression tests saved to: ${filePath}`);
  return filePath;
}

async function main() {
  const baseUrl = process.argv[2] || 'https://work.mercor.com/';
  console.log(`🤖 Generating comprehensive regression test suite for ${baseUrl}...`);

  const prompt = PROMPTS.REGRESSION_TEST(baseUrl);

  try {
    console.log('📡 Calling Gemini API for regression test generation...');
    const aiOutput = await callGeminiAPI(prompt);
    if (aiOutput.trim()) {
      saveTestFile(aiOutput, baseUrl, 'regression');
      console.log('🎉 Regression test suite generation completed!');
      console.log('📋 Next steps:');
      console.log('1. Review the generated tests in sample-tests/regression/');
      console.log('2. Update selectors based on actual website structure');
      console.log('3. Run tests: npx playwright test sample-tests/regression/');
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