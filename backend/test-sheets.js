/**
 * Test script to verify Google Sheets API access
 * Run with: node test-sheets.js
 */

require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testGoogleSheetsAccess() {
  try {
    console.log('🔍 Testing Google Sheets access...');
    
    // Check if credentials file exists
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Credentials file not found at: ${credentialsPath}`);
    }
    console.log('✅ Credentials file found');
    
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log('✅ Credentials loaded');
    
    // Authenticate
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const authClient = await auth.getClient();
    console.log('✅ Authentication successful');
    
    // Initialize Sheets API
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    // Test with a sheet ID (you'll need to provide this)
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    if (!sheetId) {
      console.log('⚠️  No CONTENT_REVIEW_SHEET_ID found in .env');
      console.log('Please add your Google Sheet ID to .env file:');
      console.log('CONTENT_REVIEW_SHEET_ID=your_sheet_id_here');
      return;
    }
    
    // Test reading sheet metadata
    console.log('📋 Testing sheet access...');
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    console.log('✅ Sheet access successful!');
    console.log('📊 Sheet details:');
    console.log(`   Title: ${sheetInfo.data.properties.title}`);
    console.log(`   Sheets: ${sheetInfo.data.sheets.map(s => s.properties.title).join(', ')}`);
    
    // Test writing to sheet
    console.log('✏️  Testing write access...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1:B1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['Test Time', new Date().toISOString()]],
      },
    });
    
    console.log('✅ Write test successful!');
    
    // Test reading back the data
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:B1',
    });
    
    console.log('✅ Read test successful!');
    console.log('📖 Read back:', readResult.data.values);
    
    console.log('\n🎉 All Google Sheets tests passed! Ready to proceed with content generation.');
    
  } catch (error) {
    console.error('❌ Google Sheets test failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('💡 Make sure you\'ve shared the sheet with your service account email');
    }
    if (error.message.includes('404')) {
      console.log('💡 Check that your CONTENT_REVIEW_SHEET_ID is correct');
    }
  }
}

// Run the test
testGoogleSheetsAccess();