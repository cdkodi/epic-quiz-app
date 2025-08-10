/**
 * Test Supabase connection and database operations
 */

require('dotenv').config();

async function testSupabaseConnection() {
  try {
    console.log('🔧 Testing Supabase connection...');
    console.log('');

    // Import the Supabase service (using dynamic import for ES modules)
    const { SupabaseService } = await import('./src/services/SupabaseService.js');
    
    const supabaseService = new SupabaseService();
    
    // Test 1: Basic connection
    console.log('📡 Step 1: Testing database connection...');
    const connectionTest = await supabaseService.testConnection();
    
    if (!connectionTest.success) {
      throw new Error(connectionTest.message);
    }
    
    console.log(`   ✅ ${connectionTest.message}`);
    console.log('');
    
    // Test 2: Initialize schema
    console.log('🔧 Step 2: Initializing database schema...');
    const schemaTest = await supabaseService.initializeSchema();
    
    if (!schemaTest.success) {
      console.log(`   ⚠️  ${schemaTest.message}`);
      console.log('');
      console.log('💡 To fix this:');
      console.log('   1. Go to your Supabase project dashboard');
      console.log('   2. Open the SQL Editor');
      console.log('   3. Run the contents of backend/database/schema.sql');
      console.log('   4. Then run this test again');
      return;
    }
    
    console.log(`   ✅ ${schemaTest.message}`);
    console.log('');
    
    // Test 3: Get current stats
    console.log('📊 Step 3: Getting database statistics...');
    const stats = await supabaseService.getStats();
    
    console.log(`   📚 Epics: ${stats.epics}`);
    console.log(`   ❓ Questions: ${stats.questions}`);
    console.log(`   📖 Summaries: ${stats.summaries}`);
    console.log('');
    
    // Test 4: Try to get quiz questions (should be empty initially)
    console.log('🧪 Step 4: Testing quiz retrieval...');
    const quizTest = await supabaseService.getQuizQuestions('ramayana', 5);
    
    if (quizTest.success) {
      console.log(`   ✅ Quiz retrieval working (found ${quizTest.questions.length} questions)`);
      if (quizTest.questions.length === 0) {
        console.log('   📝 No questions in database yet - ready for import from Google Sheets!');
      }
    } else {
      console.log(`   ⚠️  Quiz retrieval failed: ${quizTest.error}`);
    }
    
    console.log('');
    
    // Success summary
    console.log('🎉 Supabase connection test successful!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. ✅ Supabase is connected and ready');
    console.log('   2. 📥 Import Google Sheets content to database');
    console.log('   3. 🔗 Connect mobile app to Supabase API');
    console.log('   4. 🚀 Deploy to app stores');
    console.log('');
    console.log(`🔗 Your Supabase Dashboard: ${process.env.SUPABASE_URL}`);
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    
    if (error.message.includes('SUPABASE_URL')) {
      console.log('💡 Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env file');
    }
    if (error.message.includes('fetch')) {
      console.log('💡 Check your internet connection and Supabase project status');
    }
  }
}

// Run the test
testSupabaseConnection();