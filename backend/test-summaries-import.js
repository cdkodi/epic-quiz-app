/**
 * Test script to import chapter summaries from Google Sheets to Supabase
 */

require('dotenv').config();
const { GoogleSheetsService } = require('./dist/services/GoogleSheetsService.js');
const { SupabaseService } = require('./dist/services/SupabaseService.js');

async function testSummariesImport() {
  try {
    console.log('📚 Testing Chapter Summaries Import Flow\n');

    // Step 1: Initialize services
    console.log('🔧 Step 1: Initializing services...');
    
    const sheetsService = new GoogleSheetsService();
    const supabaseService = new SupabaseService();
    
    console.log('   ✅ Services initialized\n');

    // Step 2: Read summaries from Google Sheets Summary tab
    console.log('📋 Step 2: Reading chapter summaries from Google Sheets...');
    
    try {
      // First, let's check what's in the Summary sheet
      const response = await sheetsService.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CONTENT_REVIEW_SHEET_ID,
        range: `'Summary'!A:M`
      });

      const rows = response.data.values || [];
      console.log(`   📊 Found ${rows.length} total rows in Summary sheet`);
      
      if (rows.length <= 1) {
        console.log('   ⚠️  No summary data found (only headers or empty sheet)');
        console.log('   💡 Make sure chapter summaries are added to the Summary tab\n');
        return;
      }

      // Show the headers
      if (rows.length > 0) {
        console.log('   📋 Summary sheet structure:');
        const headers = rows[0];
        headers.forEach((header, i) => {
          console.log(`      ${i + 1}. ${header}`);
        });
        console.log('');
      }

      // Show sample data rows
      console.log('📄 Sample summary data:');
      const dataRows = rows.slice(1, 4); // Skip header, take first 3 data rows
      dataRows.forEach((row, i) => {
        if (row.length >= 4) {
          console.log(`   ${i + 1}. [${row[1]}] Sarga ${row[2]}: ${(row[3] || '').substring(0, 50)}...`);
        } else {
          console.log(`   ${i + 1}. Incomplete row: ${row.join(' | ')}`);
        }
      });
      console.log('');

      // Convert to ChapterSummary format for import
      console.log('🔄 Step 3: Converting summaries for Supabase import...');
      
      const summaries = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 9) { // Minimum required fields
          const summary = {
            kanda: row[1] || 'bala',
            sarga: parseInt(row[2]) || i,
            title: row[3] || `Chapter ${i}`,
            key_events: row[4] || '',
            main_characters: row[5] || '',
            themes: row[6] || '',
            cultural_significance: row[7] || '',
            narrative_summary: row[8] || '',
            source_reference: row[9] || 'Valmiki Ramayana'
          };
          summaries.push(summary);
        }
      }
      
      console.log(`   ✅ Converted ${summaries.length} summaries for import\n`);

      // Step 4: Import to Supabase
      console.log('📥 Step 4: Importing summaries to Supabase...');
      
      const importResult = await supabaseService.importChapterSummaries(summaries);
      
      console.log(`   📊 Import results:`);
      console.log(`      ✅ Successfully imported: ${importResult.imported} summaries`);
      
      if (importResult.errors.length > 0) {
        console.log(`      ⚠️  Errors: ${importResult.errors.length}`);
        importResult.errors.slice(0, 3).forEach(error => {
          console.log(`         - ${error}`);
        });
      }
      console.log('');

      // Step 5: Verify import
      console.log('🔍 Step 5: Verifying imported summaries...');
      
      if (summaries.length > 0) {
        const firstSummary = summaries[0];
        const verification = await supabaseService.getChapterSummary(firstSummary.kanda, firstSummary.sarga);
        
        if (verification.success && verification.summary) {
          console.log(`   ✅ Successfully verified summary: ${verification.summary.title}`);
          console.log(`      Kanda: ${verification.summary.kanda}, Sarga: ${verification.summary.sarga}`);
        } else {
          console.log(`   ⚠️  Verification failed: ${verification.error}`);
        }
      }
      console.log('');

      // Final stats
      const stats = await supabaseService.getStats();
      console.log('📊 Final database statistics:');
      console.log(`   Epics: ${stats.epics}`);
      console.log(`   Questions: ${stats.questions}`);
      console.log(`   Chapter Summaries: ${stats.summaries}`);
      console.log('');

      console.log('🎉 Chapter summaries import test completed!\n');

    } catch (sheetsError) {
      console.log(`   ❌ Error reading from Google Sheets: ${sheetsError.message}`);
      
      if (sheetsError.message.includes('Unable to parse range')) {
        console.log('   💡 The Summary sheet may not exist. Check sheet tabs in Google Sheets.');
      }
    }

  } catch (error) {
    console.error('\n❌ Summaries import test failed:', error.message);
  }
}

// Run the test
testSummariesImport();