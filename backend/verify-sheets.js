const { GoogleSheetsService } = require('./dist/services/GoogleSheetsService.js');
require('dotenv').config();

async function findHardQuestions() {
  try {
    const service = new GoogleSheetsService();
    const sheets = service.sheets;
    const spreadsheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    
    // Get all data from Sheet1
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A1:Z50',
    });
    
    const rows = response.data.values;
    console.log(`📊 Total rows in sheet: ${rows.length}`);
    
    // Find hard difficulty questions
    let hardQuestions = [];
    
    rows.forEach((row, index) => {
      if (row[4] && row[4].toLowerCase() === 'hard') { // Column 4 is difficulty
        hardQuestions.push({
          rowNum: index + 1,
          id: row[0],
          epic: row[1], 
          source: row[2],
          category: row[3],
          difficulty: row[4],
          questionText: (row[5] || '').substring(0, 80) + '...',
          hasOptions: row[6] && row[7] && row[8] && row[9],
          correctAnswer: row[10],
          hasExplanation: row[11] ? true : false,
          hasQuote: row[12] ? true : false,
          hasTranslation: row[13] ? true : false,
          status: row[18] || 'Unknown'
        });
      }
    });
    
    console.log(`\n🎯 Found ${hardQuestions.length} hard difficulty questions:`);
    
    hardQuestions.forEach((q, index) => {
      console.log(`\nHard Question ${index + 1} (Row ${q.rowNum}):`);
      console.log(`  ID: ${q.id}`);
      console.log(`  Source: ${q.source}`); 
      console.log(`  Category: ${q.category}`);
      console.log(`  Status: ${q.status}`);
      console.log(`  Question: ${q.questionText}`);
      
      // Check completeness
      const issues = [];
      if (!q.hasOptions) issues.push('Missing options');
      if (!q.correctAnswer) issues.push('Missing correct answer');
      if (!q.hasExplanation) issues.push('Missing explanation');
      if (!q.hasQuote) issues.push('Missing Sanskrit quote');
      if (!q.hasTranslation) issues.push('Missing translation');
      
      if (issues.length === 0) {
        console.log(`  ✅ All required data present`);
      } else {
        console.log(`  ⚠️  Issues: ${issues.join(', ')}`);
      }
    });
    
    // Also check the most recent rows for Sarga 2 questions
    console.log('\n📋 Last 5 rows to check for recent additions:');
    const recentRows = rows.slice(-5);
    recentRows.forEach((row, index) => {
      const actualRowNum = rows.length - 5 + index + 1;
      const source = row[2] || '';
      const difficulty = row[4] || '';
      if (source.includes('sarga_2')) {
        console.log(`  Row ${actualRowNum}: ${source} - ${difficulty}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findHardQuestions();