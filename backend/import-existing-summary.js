/**
 * Import the existing summary data from Google Sheets to Supabase
 * Handles the current format where data is in row 1
 */

require('dotenv').config();
const { SupabaseService } = require('./dist/services/SupabaseService.js');
const { google } = require('googleapis');

async function importExistingSummary() {
  try {
    console.log('📚 Importing existing chapter summary to Supabase...\n');

    // Initialize services
    const supabaseService = new SupabaseService();
    
    // Initialize Google Sheets API
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.CONTENT_REVIEW_SHEET_ID;

    // Get the data from Summary sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'Summary'!A1:M1`
    });

    const row = response.data.values?.[0];
    if (!row || row.length < 10) {
      console.log('❌ No valid summary data found in Summary sheet');
      return;
    }

    console.log('📋 Found summary data for:', row[3] || 'Unknown Title');
    console.log('   Kanda:', row[1]);
    console.log('   Sarga:', row[2]);
    console.log('');

    // Convert to ChapterSummary format
    const chapterSummary = {
      kanda: row[1] || 'bala',
      sarga: parseInt(row[2]) || 1,
      title: row[3] || 'Chapter Summary',
      key_events: row[4] || '',
      main_characters: row[5] || '',
      themes: row[6] || '',
      cultural_significance: row[7] || '',
      narrative_summary: row[8] || '',
      source_reference: row[9] || 'Valmiki Ramayana'
    };

    console.log('📥 Importing to Supabase...');
    
    // Import to Supabase
    const importResult = await supabaseService.importChapterSummaries([chapterSummary]);
    
    console.log('📊 Import results:');
    console.log(`   ✅ Successfully imported: ${importResult.imported} summary`);
    
    if (importResult.errors.length > 0) {
      console.log(`   ⚠️  Errors: ${importResult.errors.length}`);
      importResult.errors.forEach(error => {
        console.log(`      - ${error}`);
      });
    }
    console.log('');

    // Verify the import
    console.log('🔍 Verifying import...');
    const verification = await supabaseService.getChapterSummary(chapterSummary.kanda, chapterSummary.sarga);
    
    if (verification.success && verification.summary) {
      console.log('✅ Summary successfully imported and verified!');
      console.log(`   Title: ${verification.summary.title}`);
      console.log(`   Key Events: ${verification.summary.key_events.substring(0, 100)}...`);
      console.log(`   Themes: ${verification.summary.themes}`);
    } else {
      console.log(`❌ Verification failed: ${verification.error}`);
    }
    console.log('');

    // Final database stats
    const stats = await supabaseService.getStats();
    console.log('📊 Updated database statistics:');
    console.log(`   Epics: ${stats.epics}`);
    console.log(`   Questions: ${stats.questions}`);  
    console.log(`   Chapter Summaries: ${stats.summaries}`);
    console.log('');

    console.log('🎉 Chapter summary import completed!\n');
    
    console.log('🔗 Next steps:');
    console.log('   1. Review the imported summary in Supabase dashboard');
    console.log('   2. Add more chapter summaries to Google Sheets');
    console.log('   3. Test mobile app deep-dive content feature');
    console.log(`   📊 Supabase Dashboard: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv`);

  } catch (error) {
    console.error('❌ Summary import failed:', error.message);
  }
}

importExistingSummary();