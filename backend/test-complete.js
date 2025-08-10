/**
 * Complete pipeline test with frame handling
 */

require('dotenv').config();

async function testCompleteWithFrames() {
  const { chromium } = require('playwright');
  const OpenAI = require('openai').default;
  const { google } = require('googleapis');
  
  console.log('🚀 Running complete pipeline test with frame handling...');
  console.log('');
  
  try {
    // Step 1: Extract content with frame handling
    console.log('📖 Step 1: Extracting content from Valmiki Ramayana...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const url = 'https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1_frame.htm';
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const frames = page.frames();
    let content = '';
    let title = '';
    
    for (const frame of frames) {
      try {
        const frameContent = await frame.evaluate(() => {
          const body = document.body;
          if (!body) return '';
          
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach(el => el.remove());
          
          let text = body.innerText || body.textContent || '';
          text = text.replace(/\s+/g, ' ').trim();
          
          return text;
        });
        
        if (frameContent.length > 1000) {
          content = frameContent.substring(0, 10000); // Limit for LLM
          title = await frame.title() || 'Bala Kanda Sarga 1';
          break;
        }
      } catch (error) {
        console.log(`   Frame error: ${error.message}`);
      }
    }
    
    await browser.close();
    
    if (!content || content.length < 500) {
      throw new Error('Failed to extract sufficient content');
    }
    
    console.log(`   ✅ Extracted ${content.length} characters`);
    console.log(`   ✅ Title: ${title}`);
    console.log('');
    
    // Step 2: Generate quiz questions
    console.log('🤖 Step 2: Generating quiz questions with OpenAI...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = `Generate exactly 5 high-quality educational quiz questions based on this Valmiki Ramayana content:

CHAPTER: Bala Kanda, Sarga 1
TITLE: ${title}
CONTENT: ${content}

REQUIREMENTS:
1. Create diverse questions covering characters, events, themes, and cultural aspects
2. Include different difficulty levels (easy, medium, hard)
3. Each question must have exactly 4 plausible options
4. Provide clear, educational explanations
5. Add relevant tags for categorization
6. Focus on educational value and cultural accuracy

OUTPUT FORMAT:
{
  "questions": [
    {
      "epic_id": "ramayana",
      "chapter_source": "bala_sarga_1",
      "category": "characters",
      "difficulty": "easy",
      "question_text": "Clear, educational question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_id": 0,
      "basic_explanation": "1-2 sentence explanation of why this is correct",
      "tags": ["tag1", "tag2", "tag3"],
      "cultural_context": "Brief cultural or historical significance",
      "source_reference": "Bala Kanda, Sarga 1"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in Valmiki Ramayana and Hindu epic literature, creating high-quality educational quiz questions. Focus on testing understanding rather than memorization, and ensure cultural sensitivity. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const questions = JSON.parse(response);
    
    console.log(`   ✅ Generated ${questions.questions.length} questions`);
    questions.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.difficulty}] ${q.question_text.substring(0, 60)}...`);
    });
    console.log('');
    
    // Step 3: Import to Google Sheets
    console.log('📋 Step 3: Importing to Google Sheets...');
    
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    if (!sheetId) {
      throw new Error('CONTENT_REVIEW_SHEET_ID not found in environment');
    }
    
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, set up headers if sheet is empty
    try {
      const existingData = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A1:R1'
      });
      
      if (!existingData.data.values || existingData.data.values.length === 0) {
        console.log('   📋 Setting up sheet headers...');
        const headers = [
          'Question ID', 'Epic', 'Chapter Source', 'Category', 'Difficulty',
          'Question Text', 'Option A', 'Option B', 'Option C', 'Option D',
          'Correct Answer', 'Basic Explanation', 'Tags', 'Cultural Context',
          'Source Reference', 'Status', 'Reviewer Notes', 'Generated Date'
        ];
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: 'A1:R1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers]
          }
        });
      }
    } catch (error) {
      console.log('   ⚠️ Could not check/set headers:', error.message);
    }
    
    // Convert questions to rows
    const rows = questions.questions.map((q, index) => [
      `bala_1_${index + 1}`, // Question ID
      q.epic_id,
      q.chapter_source,
      q.category,
      q.difficulty,
      q.question_text,
      q.options[0] || '',
      q.options[1] || '',
      q.options[2] || '',
      q.options[3] || '',
      ['A', 'B', 'C', 'D'][q.correct_answer_id] || 'A',
      q.basic_explanation,
      (q.tags || []).join(', '),
      q.cultural_context || '',
      q.source_reference,
      'Generated',
      '',
      new Date().toISOString()
    ]);
    
    // Find next empty row
    const allData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:A'
    });
    
    const nextRow = (allData.data.values?.length || 0) + 1;
    const range = `A${nextRow}:R${nextRow + rows.length - 1}`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows
      }
    });
    
    console.log(`   ✅ Added ${rows.length} questions starting at row ${nextRow}`);
    console.log(`   🔗 View sheet: https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
    console.log('');
    
    // Success summary
    console.log('🎉 Complete pipeline test successful!');
    console.log('');
    console.log('📊 Results Summary:');
    console.log(`   ✅ Content extracted: ${content.length} characters`);
    console.log(`   ✅ Questions generated: ${questions.questions.length}`);
    console.log(`   ✅ Imported to Google Sheets: Row ${nextRow}-${nextRow + rows.length - 1}`);
    console.log('');
    console.log('🔄 Ready for production content generation!');
    console.log('   - Frame-based extraction working');
    console.log('   - OpenAI generation working');
    console.log('   - Google Sheets integration working');
    
  } catch (error) {
    console.error('❌ Pipeline test failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.log('💡 Make sure your OpenAI API key is correctly set in .env');
    }
    if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
      console.log('💡 Make sure your Google Sheet ID is set in .env');
    }
    if (error.message.includes('google-credentials')) {
      console.log('💡 Make sure your google-credentials.json file is properly configured');
    }
  }
}

testCompleteWithFrames();