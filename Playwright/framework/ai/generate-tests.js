require('dotenv').config();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const AI_PROVIDER = process.env.AI_PROVIDER || 'OPENAI';
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || (AI_PROVIDER === 'OPENAI' ? 'gpt-4' : 'gemini-pro');

async function fetchDOM(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content;
}

async function callAI(prompt) {
  if (AI_PROVIDER === 'OPENAI') {
    const openai = new OpenAI({ apiKey: AI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  } else if (AI_PROVIDER === 'GEMINI') {
    const gemini = new GoogleGenerativeAI(AI_API_KEY);
    const model = gemini.getGenerativeModel({ model: AI_MODEL });
    const result = await model.generateContent(prompt);
    return (await result.response).text();
  }
  throw new Error('Unsupported AI provider');
}

function saveTestFile(testCode, baseUrl) {
  const dir = path.resolve(__dirname, '../../sample-tests');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fileName = `ai-generated-${new URL(baseUrl).hostname.replace(/\./g, '-')}.spec.ts`;
  fs.writeFileSync(path.join(dir, fileName), testCode, 'utf8');
  console.log(`✅ Test saved to sample-tests/${fileName}`);
}

async function main() {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    console.error('Usage: node generate-tests.js <BASE_URL>');
    process.exit(1);
  }
  console.log(`🔍 Fetching DOM for ${baseUrl}...`);
  const dom = await fetchDOM(baseUrl);
  const $ = cheerio.load(dom);
  const structure = $('body').html().replace(/\s+/g, ' ').slice(0, 2000); // limit prompt size

  const prompt = `
You are an expert Playwright test developer.
Given the following web app structure (HTML body snippet) and base URL (${baseUrl}),
1. Suggest 3-5 common test scenarios (login, navigation, form validation, etc).
2. For each, generate a Playwright test in TypeScript using the project's BasePage and best practices.
3. Output only valid .spec.ts code, ready to be saved in /sample-tests/.

HTML snippet:
${structure}
`;

  console.log('🤖 Calling AI to generate tests...');
  const aiOutput = await callAI(prompt);

  saveTestFile(aiOutput, baseUrl);
}

main(); 