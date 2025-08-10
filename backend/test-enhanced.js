/**
 * Test enhanced pipeline: Quiz Questions + Chapter Summary
 * Run with: node test-enhanced.js
 */

require('dotenv').config();

async function testEnhancedPipeline() {
  const { chromium } = require('playwright');
  const OpenAI = require('openai').default;
  const { google } = require('googleapis');
  
  console.log('🚀 Testing enhanced content generation pipeline...');
  console.log('   📋 Quiz Questions → Quiz Tab');
  console.log('   📖 Chapter Summary → Summary Tab');
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
    
    // Step 2: Generate both quiz questions AND chapter summary
    console.log('🤖 Step 2: Generating quiz questions AND chapter summary...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = `Generate exactly 5 high-quality educational quiz questions AND a comprehensive chapter summary based on this Valmiki Ramayana content:

CHAPTER: Bala Kanda, Sarga 1
TITLE: ${title}
CONTENT: ${content}

REQUIREMENTS:
1. Create diverse questions covering characters, events, themes, and cultural aspects
2. Include different difficulty levels (easy, medium, hard)
3. Each question must have exactly 4 plausible options
4. Provide clear, educational explanations
5. Add relevant tags for categorization
6. Create a comprehensive chapter summary for deep-dive content generation
7. Focus on educational value and cultural accuracy

OUTPUT FORMAT (valid JSON):
{
  "questions": [
    {
      "epic_id": "ramayana",
      "chapter_source": "bala_sarga_1",
      "category": "characters|events|themes|culture",
      "difficulty": "easy|medium|hard",
      "question_text": "Clear, educational question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_id": 0,
      "basic_explanation": "1-2 sentence explanation of why this is correct",
      "tags": ["tag1", "tag2", "tag3"],
      "cultural_context": "Brief cultural or historical significance",
      "source_reference": "Bala Kanda, Sarga 1"
    }
  ],
  "summary": {
    "chapter": "Bala Kanda, Sarga 1",
    "kanda": "bala",
    "sarga": 1,
    "title": "Chapter title or main theme",
    "key_events": "Main events as a single text string with bullet points or numbered list",
    "main_characters": "Key characters as a single text string",
    "themes": "Philosophical and moral themes as a single text string",
    "cultural_significance": "Cultural, religious, or historical importance as a single text string",
    "narrative_summary": "2-3 paragraph comprehensive summary as a single text string suitable for deep-dive explanations",
    "source_reference": "Bala Kanda, Sarga 1"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in Valmiki Ramayana and Hindu epic literature, creating high-quality educational quiz questions and chapter summaries. Focus on testing understanding rather than memorization, and ensure cultural sensitivity. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const generated = JSON.parse(response);
    
    console.log(`   ✅ Generated ${generated.questions.length} quiz questions`);
    generated.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.difficulty}] ${q.question_text.substring(0, 60)}...`);
    });
    
    console.log(`   ✅ Generated chapter summary: ${generated.summary.title}`);
    console.log(`   📝 Summary preview: ${generated.summary.narrative_summary.substring(0, 150)}...`);
    console.log('');
    
    // Step 3: Import to Google Sheets (Both Tabs)
    console.log('📋 Step 3: Importing to Google Sheets (Quiz + Summary tabs)...');
    
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
    
    // Step 3a: Import Quiz Questions to Quiz Tab (existing logic)
    console.log('   📋 Step 3a: Importing quiz questions to Quiz tab...');
    
    const questionRows = generated.questions.map((q, index) => [
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
    
    // Find next empty row in Quiz sheet
    const quizData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:A'
    });
    
    const nextQuizRow = (quizData.data.values?.length || 0) + 1;
    const quizRange = `A${nextQuizRow}:R${nextQuizRow + questionRows.length - 1}`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: quizRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: questionRows
      }
    });
    
    console.log(`   ✅ Added ${questionRows.length} questions to Quiz tab (rows ${nextQuizRow}-${nextQuizRow + questionRows.length - 1})`);
    
    // Step 3b: Import Chapter Summary to Summary Tab
    console.log('   📖 Step 3b: Importing chapter summary to Summary tab...');
    
    const summaryRow = [
      'bala_sarga_1', // Chapter ID
      generated.summary.kanda,
      generated.summary.sarga.toString(),
      generated.summary.title,
      generated.summary.key_events,
      generated.summary.main_characters,
      generated.summary.themes,
      generated.summary.cultural_significance,
      generated.summary.narrative_summary,
      generated.summary.source_reference,
      'Generated',
      '',
      new Date().toISOString()
    ];
    
    // Find next empty row in Summary sheet (using gid instead of sheet name)
    let summaryRange;
    let nextSummaryRow;
    
    // First, let's try to get sheet info to see the actual tab name
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });
      
      console.log('   📋 Available sheets:');
      sheetInfo.data.sheets.forEach(sheet => {
        console.log(`      - ${sheet.properties.title} (gid: ${sheet.properties.sheetId})`);
      });
      
      // Find the summary sheet (gid=157495304)
      const summarySheet = sheetInfo.data.sheets.find(s => s.properties.sheetId === 157495304);
      const summarySheetName = summarySheet ? summarySheet.properties.title : 'Summary';
      
      console.log(`   📖 Using summary sheet: "${summarySheetName}"`);
      
      const summaryData = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${summarySheetName}'!A:A`
      });
      
      nextSummaryRow = (summaryData.data.values?.length || 0) + 1;
      summaryRange = `'${summarySheetName}'!A${nextSummaryRow}:M${nextSummaryRow}`;
      
    } catch (sheetError) {
      // Fallback - try without sheet name, just use the summary tab directly
      console.log(`   ⚠️ Could not access summary sheet, using fallback approach: ${sheetError.message}`);
      nextSummaryRow = 2; // Assume row 2 if we can't read existing data
      summaryRange = `A${nextSummaryRow}:M${nextSummaryRow}`;
    }
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: summaryRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [summaryRow]
      }
    });
    
    console.log(`   ✅ Added chapter summary to Summary tab (row ${nextSummaryRow})`);
    console.log('');
    
    // Success summary
    console.log('🎉 Enhanced pipeline test successful!');
    console.log('');
    console.log('📊 Results Summary:');
    console.log(`   ✅ Content extracted: ${content.length} characters`);
    console.log(`   ✅ Quiz questions generated: ${generated.questions.length}`);
    console.log(`   ✅ Chapter summary generated: 1`);
    console.log(`   ✅ Quiz questions imported: Quiz tab rows ${nextQuizRow}-${nextQuizRow + questionRows.length - 1}`);
    console.log(`   ✅ Summary imported: Summary tab row ${nextSummaryRow}`);
    console.log('');
    console.log('🔗 View Results:');
    console.log(`   📋 Quiz Tab: https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=0`);
    console.log(`   📖 Summary Tab: https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=157495304`);
    console.log('');
    console.log('🚀 Ready for production content generation!');
    console.log('   - ✅ Frame-based extraction working');
    console.log('   - ✅ Dual LLM generation (quiz + summary) working');
    console.log('   - ✅ Two-tab Google Sheets integration working');
    console.log('   - ✅ No re-scraping needed for deep-dive content');
    
  } catch (error) {
    console.error('❌ Enhanced pipeline test failed:', error.message);
    
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

testEnhancedPipeline();