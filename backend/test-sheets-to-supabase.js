/**
 * Test script to import data from Google Sheets to Supabase
 * Tests the complete flow: Sheets → Supabase via MCP tools
 */

require('dotenv').config();
const { GoogleSheetsService } = require('./dist/services/GoogleSheetsService.js');
const { SupabaseService } = require('./dist/services/SupabaseService.js');

async function testSheetsToSupabaseFlow() {
  try {
    console.log('🚀 Testing Google Sheets → Supabase import flow\n');

    // Step 1: Initialize services
    console.log('🔧 Step 1: Initializing services...');
    
    const sheetsService = new GoogleSheetsService();
    const supabaseService = new SupabaseService();
    
    console.log('   ✅ Services initialized\n');

    // Step 2: Test Supabase connection
    console.log('🔧 Step 2: Testing Supabase connection...');
    
    const supabaseTest = await supabaseService.testConnection();
    if (!supabaseTest.success) {
      throw new Error(`Supabase connection failed: ${supabaseTest.message}`);
    }
    
    console.log(`   ✅ ${supabaseTest.message}\n`);

    // Step 3: Get approved questions from Google Sheets
    console.log('📋 Step 3: Reading approved questions from Google Sheets...');
    
    const approvedQuestions = await sheetsService.getApprovedQuestions();
    console.log(`   📊 Found ${approvedQuestions.length} approved questions\n`);
    
    if (approvedQuestions.length === 0) {
      console.log('⚠️  No approved questions found in Google Sheets');
      console.log('   Make sure some questions are marked as "Approved" in the Status column\n');
      return;
    }

    // Show sample of questions found
    console.log('📄 Sample questions found:');
    approvedQuestions.slice(0, 3).forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.category}/${q.difficulty}] ${q.question_text.substring(0, 60)}...`);
    });
    console.log('');

    // Step 4: Import questions to Supabase
    console.log('📥 Step 4: Importing questions to Supabase...');
    
    const importResult = await supabaseService.importQuizQuestions(approvedQuestions);
    
    console.log(`   📊 Import results:`);
    console.log(`      ✅ Successfully imported: ${importResult.imported} questions`);
    
    if (importResult.errors.length > 0) {
      console.log(`      ⚠️  Errors: ${importResult.errors.length}`);
      importResult.errors.slice(0, 3).forEach(error => {
        console.log(`         - ${error}`);
      });
      if (importResult.errors.length > 3) {
        console.log(`         ... and ${importResult.errors.length - 3} more`);
      }
    }
    console.log('');

    // Step 5: Verify imported data
    console.log('🔍 Step 5: Verifying imported data...');
    
    const quizQuestions = await supabaseService.getQuizQuestions('ramayana', 5);
    if (quizQuestions.success) {
      console.log(`   ✅ Successfully retrieved ${quizQuestions.questions.length} questions from Supabase`);
      
      if (quizQuestions.questions.length > 0) {
        console.log('📄 Sample questions from Supabase:');
        quizQuestions.questions.slice(0, 2).forEach((q, i) => {
          console.log(`   ${i + 1}. [${q.category}/${q.difficulty}] ${q.question_text.substring(0, 60)}...`);
          console.log(`      Options: ${q.options.length} | Correct: ${q.correct_answer_id} | Tags: ${q.tags.length}`);
        });
      }
    } else {
      console.log(`   ⚠️  Failed to retrieve questions: ${quizQuestions.error}`);
    }
    console.log('');

    // Step 6: Get database statistics
    console.log('📊 Step 6: Database statistics...');
    
    const stats = await supabaseService.getStats();
    console.log(`   📈 Current database contents:`);
    console.log(`      Epics: ${stats.epics}`);
    console.log(`      Questions: ${stats.questions}`);
    console.log(`      Chapter Summaries: ${stats.summaries}`);
    console.log('');

    // Success summary
    console.log('🎉 Google Sheets → Supabase import test completed successfully!\n');
    
    console.log('📋 Summary:');
    console.log(`   ✅ Found ${approvedQuestions.length} approved questions in Google Sheets`);
    console.log(`   ✅ Successfully imported ${importResult.imported} questions to Supabase`);
    console.log(`   ✅ Database now contains ${stats.questions} total questions`);
    
    if (importResult.errors.length > 0) {
      console.log(`   ⚠️  ${importResult.errors.length} questions had import errors`);
    }
    
    console.log('\n🔗 Next steps:');
    console.log('   📱 Test mobile app connection to Supabase');
    console.log('   🔄 Set up automated sync process');
    console.log(`   📊 Review data at: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv`);

  } catch (error) {
    console.error('\n❌ Sheets → Supabase import test failed:', error.message);
    
    if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
      console.log('💡 Make sure CONTENT_REVIEW_SHEET_ID is set in .env file');
    }
    if (error.message.includes('SUPABASE_URL')) {
      console.log('💡 Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env file');
    }
    if (error.message.includes('google-credentials.json')) {
      console.log('💡 Make sure google-credentials.json file exists');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Verify .env file contains all required variables');
    console.log('   2. Check Google Sheets has "Approved" questions');
    console.log('   3. Verify Supabase schema is properly set up');
    console.log('   4. Check that Google Sheets is shared with service account');
  }
}

// Run the test
testSheetsToSupabaseFlow();