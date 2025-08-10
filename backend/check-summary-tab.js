/**
 * Check what's in the Summary tab and show expected format
 */

require('dotenv').config();
const { google } = require('googleapis');

async function checkSummaryTab() {
  try {
    console.log('📋 Checking Summary tab in Google Sheets...\n');

    // Initialize Google Sheets API
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;

    // Check what's in the Summary tab
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'Summary'!A:M`
    });

    const rows = response.data.values || [];
    console.log(`📊 Summary tab contains ${rows.length} rows total\n`);

    if (rows.length > 0) {
      console.log('📋 Current headers in Summary tab:');
      const headers = rows[0];
      headers.forEach((header, i) => {
        console.log(`   ${i + 1}. ${header}`);
      });
      console.log('');
    }

    if (rows.length > 1) {
      console.log('📄 Sample data rows:');
      rows.slice(1, 4).forEach((row, i) => {
        console.log(`   Row ${i + 2}: ${row.slice(0, 4).join(' | ')}...`);
      });
      console.log('');
    } else {
      console.log('ℹ️  No data rows found - only headers exist\n');
    }

    // Show expected format
    console.log('📝 Expected Summary sheet format:');
    console.log('   Headers should be:');
    const expectedHeaders = [
      'Chapter ID', 'Kanda', 'Sarga', 'Title', 'Key Events', 
      'Main Characters', 'Themes', 'Cultural Significance', 
      'Narrative Summary', 'Source Reference', 'Status', 
      'Reviewer Notes', 'Generated Date'
    ];
    expectedHeaders.forEach((header, i) => {
      console.log(`   ${String(i + 1).padStart(2)}. ${header}`);
    });
    console.log('');

    console.log('📋 Example data row:');
    console.log('   Chapter ID: bala_sarga_1');
    console.log('   Kanda: bala');
    console.log('   Sarga: 1');
    console.log('   Title: The Question of Narada');
    console.log('   Key Events: Narada visits Valmiki, discusses ideal person qualities...');
    console.log('   Main Characters: Valmiki, Narada, Rama (mentioned)');
    console.log('   Themes: Virtue, righteousness, ideal leadership');
    console.log('   Cultural Significance: Establishes the moral framework...');
    console.log('   Narrative Summary: The opening chapter introduces...');
    console.log('   Source Reference: Valmiki Ramayana, Bala Kanda');
    console.log('   Status: Generated');
    console.log('   Reviewer Notes: (empty)');
    console.log('   Generated Date: 2025-08-10T...');
    console.log('');

    if (rows.length <= 1) {
      console.log('🚀 Next steps:');
      console.log('   1. Add chapter summaries data to the Summary tab');
      console.log('   2. Use the headers and format shown above');
      console.log('   3. Set Status to "Generated" or "Approved"');
      console.log('   4. Run the test again to import summaries to Supabase');
    } else {
      console.log('🚀 Ready to test import with existing data!');
    }

  } catch (error) {
    console.error('❌ Error checking Summary tab:', error.message);
  }
}

checkSummaryTab();