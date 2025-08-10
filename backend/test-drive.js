/**
 * Test script to verify Google Drive API access
 * Run with: node test-drive.js
 */

require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

async function testGoogleDriveAccess() {
  try {
    console.log('🔍 Testing Google Drive access...');
    
    // Check credentials
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Credentials file not found at: ${credentialsPath}`);
    }
    console.log('✅ Credentials file found');
    
    // Authenticate with Drive scope
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly'
      ],
    });
    
    const authClient = await auth.getClient();
    console.log('✅ Authentication successful');
    
    // Initialize Drive API
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    // Test Drive access by getting file info for your sheet
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    if (!sheetId) {
      console.log('⚠️  No CONTENT_REVIEW_SHEET_ID found');
      return;
    }
    
    console.log('📁 Testing Drive file access...');
    const fileInfo = await drive.files.get({
      fileId: sheetId,
      fields: 'id,name,owners,permissions,createdTime,modifiedTime'
    });
    
    console.log('✅ Drive access successful!');
    console.log('📄 File details:');
    console.log(`   Name: ${fileInfo.data.name}`);
    console.log(`   ID: ${fileInfo.data.id}`);
    console.log(`   Created: ${fileInfo.data.createdTime}`);
    console.log(`   Modified: ${fileInfo.data.modifiedTime}`);
    
    // Test listing permissions
    console.log('🔐 Checking permissions...');
    const permissions = await drive.permissions.list({
      fileId: sheetId,
      fields: 'permissions(id,type,role,emailAddress)'
    });
    
    console.log('✅ Permissions retrieved:');
    permissions.data.permissions.forEach((perm, index) => {
      console.log(`   ${index + 1}. ${perm.type} - ${perm.role} - ${perm.emailAddress || 'N/A'}`);
    });
    
    console.log('\n🎉 All Google Drive tests passed!');
    
  } catch (error) {
    console.error('❌ Google Drive test failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('💡 Drive API might not be enabled, or insufficient permissions');
    }
    if (error.message.includes('404')) {
      console.log('💡 File not found or no access to the file');
    }
  }
}

// Run the test
testGoogleDriveAccess();