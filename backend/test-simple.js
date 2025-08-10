/**
 * Simple test of content generation pipeline
 * Tests each component individually first
 */

require('dotenv').config();

async function testValmikiScraping() {
  console.log('📖 Testing Valmiki content scraping...');
  
  const { chromium } = require('playwright');
  
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const url = 'https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1_frame.htm';
    console.log(`   Visiting: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const content = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script, style');
      scripts.forEach(el => el.remove());
      
      const body = document.body;
      if (!body) return '';
      
      let text = body.innerText || body.textContent || '';
      text = text.replace(/\s+/g, ' ').trim();
      text = text.replace(/\n\s*\n/g, '\n');
      
      return text;
    });
    
    const title = await page.title();
    
    await page.close();
    await browser.close();
    
    console.log(`   ✅ Title: ${title}`);
    console.log(`   ✅ Content length: ${content.length} characters`);
    console.log(`   ✅ Content preview: ${content.substring(0, 200)}...`);
    
    if (content.length < 100) {
      throw new Error('Content too short - extraction may have failed');
    }
    
    return { title, content, url };
    
  } catch (error) {
    console.log(`   ❌ Scraping failed: ${error.message}`);
    throw error;
  }
}

async function testOpenAI(content) {
  console.log('🤖 Testing OpenAI quiz generation...');
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not found in environment');
  }
  
  const OpenAI = require('openai').default;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const prompt = `Generate exactly 2 high-quality educational quiz questions based on this Valmiki Ramayana content:

CHAPTER: Bala Kanda, Sarga 1
CONTENT: ${content.substring(0, 2000)}

REQUIREMENTS:
1. Create questions covering characters, events, or themes
2. Each question must have exactly 4 plausible options
3. Provide clear explanations
4. Focus on educational value

OUTPUT FORMAT:
{
  "questions": [
    {
      "epic_id": "ramayana",
      "category": "characters|events|themes|culture",
      "difficulty": "easy|medium|hard",
      "question_text": "Clear, educational question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_id": 0,
      "basic_explanation": "1-2 sentence explanation",
      "tags": ["tag1", "tag2"],
      "source_reference": "Bala Kanda, Sarga 1"
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in Valmiki Ramayana creating educational quiz questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const questions = JSON.parse(response);
    
    console.log(`   ✅ Generated ${questions.questions.length} questions`);
    questions.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.question_text}`);
      console.log(`      Answer: ${q.options[q.correct_answer_id]}`);
    });
    
    return questions;
    
  } catch (error) {
    console.log(`   ❌ LLM generation failed: ${error.message}`);
    throw error;
  }
}

async function testGoogleSheets(questions) {
  console.log('📋 Testing Google Sheets import...');
  
  const { google } = require('googleapis');
  
  try {
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    
    if (!sheetId) {
      throw new Error('CONTENT_REVIEW_SHEET_ID not found in environment');
    }
    
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Convert questions to rows
    const rows = questions.questions.map((q, index) => [
      `bala_1_${index + 1}`, // Question ID
      q.epic_id,
      'bala_sarga_1',
      q.category,
      q.difficulty,
      q.question_text,
      q.options[0] || '',
      q.options[1] || '',
      q.options[2] || '',
      q.options[3] || '',
      ['A', 'B', 'C', 'D'][q.correct_answer_id] || 'A',
      q.basic_explanation,
      q.tags.join(', '),
      q.cultural_context || '',
      q.source_reference,
      'Test Generated',
      'Automated test',
      new Date().toISOString()
    ]);
    
    // Add to sheet (append to existing data)
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:A'
    });

    const nextRow = (existingData.data.values?.length || 0) + 1;
    const range = `A${nextRow}:R${nextRow + rows.length - 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows
      }
    });
    
    console.log(`   ✅ Added ${rows.length} questions to sheet starting at row ${nextRow}`);
    console.log(`   🔗 View sheet: https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Sheets import failed: ${error.message}`);
    throw error;
  }
}

async function runCompleteTest() {
  try {
    console.log('🧪 Running complete content generation pipeline test...');
    console.log('');
    
    // Step 1: Extract content
    const scrapedData = await testValmikiScraping();
    console.log('');
    
    // Step 2: Generate questions
    const questions = await testOpenAI(scrapedData.content);
    console.log('');
    
    // Step 3: Import to sheets
    await testGoogleSheets(questions);
    console.log('');
    
    console.log('🎉 Complete pipeline test successful!');
    console.log('✅ Content extraction working');
    console.log('✅ LLM generation working');
    console.log('✅ Google Sheets import working');
    
  } catch (error) {
    console.error('❌ Pipeline test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runCompleteTest();