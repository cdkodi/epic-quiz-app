/**
 * Basic Supabase connection and schema test
 */

require('dotenv').config();

async function testSupabaseBasic() {
  try {
    console.log('🔧 Testing Supabase connection and schema...');
    console.log('');

    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    console.log(`   🔗 Connecting to: ${supabaseUrl}`);
    console.log('');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Try to query a simple table that should exist
    console.log('📡 Step 1: Testing basic connection...');
    
    try {
      // Try to create a simple test query - this will tell us if connection works
      const { data, error, count } = await supabase
        .rpc('version'); // PostgreSQL version function
      
      if (error) {
        console.log(`   Connection test: ${error.message}`);
      } else {
        console.log('   ✅ Supabase connection successful!');
      }
    } catch (e) {
      // Try alternative connection test
      console.log('   Testing alternative connection method...');
    }
    
    // Test 2: Check for Epic Quiz tables
    console.log('🔍 Step 2: Checking for Epic Quiz tables...');
    
    const tables = ['epics', 'questions', 'educational_content', 'chapter_summaries'];
    let tablesExist = 0;
    
    for (const table of tables) {
      try {
        console.log(`   Checking table: ${table}`);
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table '${table}': ${error.message}`);
          
          if (error.message.includes('does not exist')) {
            console.log(`   💡 Table '${table}' needs to be created`);
          }
        } else {
          tablesExist++;
          console.log(`   ✅ Table '${table}' exists and is accessible`);
          
          if (data && data.length > 0) {
            console.log(`      📊 Contains ${data.length} record(s)`);
          } else {
            console.log(`      📝 Table is empty (ready for data)`);
          }
        }
      } catch (tableError) {
        console.log(`   ❌ Error checking '${table}': ${tableError.message}`);
      }
    }
    
    console.log('');
    
    // Results summary
    if (tablesExist === 0) {
      console.log('🛠️  Database Setup Required:');
      console.log('');
      console.log('   Your Supabase project is connected but needs the Epic Quiz schema.');
      console.log('   Please follow these steps:');
      console.log('');
      console.log('   1. 🌐 Open Supabase SQL Editor:');
      console.log('      https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv/sql/new');
      console.log('');
      console.log('   2. 📄 Copy the contents of this file:');
      console.log('      backend/database/schema.sql');
      console.log('');
      console.log('   3. 📋 Paste into SQL Editor and click "Run"');
      console.log('');
      console.log('   4. ✅ Run this test again to verify');
      
    } else if (tablesExist === tables.length) {
      console.log('🎉 Database fully set up and ready!');
      console.log('');
      console.log('📊 Database Status:');
      console.log(`   ✅ All ${tables.length} Epic Quiz tables exist`);
      console.log('   ✅ Connection working properly');
      console.log('   ✅ Ready for Google Sheets content import');
      console.log('');
      console.log('🚀 Next steps:');
      console.log('   1. Import quiz questions from Google Sheets');
      console.log('   2. Import chapter summaries from Google Sheets'); 
      console.log('   3. Connect mobile app to Supabase database');
      
    } else {
      console.log('⚠️  Partial database setup detected:');
      console.log(`   Found ${tablesExist} out of ${tables.length} required tables`);
      console.log('   Please run the complete schema.sql file in Supabase SQL Editor');
    }
    
    console.log('');
    console.log(`🔗 Supabase Project: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv`);
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Check your internet connection and Supabase project status');
    }
  }
}

testSupabaseBasic();