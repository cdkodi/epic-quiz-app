/**
 * Simple Supabase connection test
 */

require('dotenv').config();

async function testSupabase() {
  try {
    console.log('🔧 Testing Supabase connection...');
    console.log('');

    // Import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
    }
    
    console.log(`   🔗 URL: ${supabaseUrl}`);
    console.log(`   🔑 Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');
    
    // Create client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Basic connection by querying system tables
    console.log('📡 Step 1: Testing basic connection...');
    
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (error) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        return;
      }
      
      console.log('   ✅ Successfully connected to Supabase!');
      console.log(`   📋 Found ${data.length} public tables`);
      
      if (data.length > 0) {
        console.log('   📊 Available tables:');
        data.forEach(table => {
          console.log(`      - ${table.table_name}`);
        });
      }
      
    } catch (connectionError) {
      console.log(`   ❌ Connection error: ${connectionError.message}`);
      return;
    }
    
    console.log('');
    
    // Test 2: Check if our Epic Quiz tables exist
    console.log('🔍 Step 2: Checking Epic Quiz tables...');
    
    const expectedTables = ['epics', 'questions', 'educational_content'];
    const foundTables = [];
    const missingTables = [];
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          foundTables.push(tableName);
          console.log(`   ✅ Table '${tableName}' exists`);
        } else {
          missingTables.push(tableName);
          console.log(`   ❌ Table '${tableName}' missing: ${error.message}`);
        }
      } catch (tableError) {
        missingTables.push(tableName);
        console.log(`   ❌ Table '${tableName}' error: ${tableError.message}`);
      }
    }
    
    console.log('');
    
    if (missingTables.length > 0) {
      console.log('🛠️  Setup Required:');
      console.log('   To complete setup, run this SQL in your Supabase SQL Editor:');
      console.log('');
      console.log('   1. Go to: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv/sql/new');
      console.log('   2. Copy and paste the contents of: backend/database/schema.sql');
      console.log('   3. Click "Run" to create all tables');
      console.log('   4. Then run this test again');
      console.log('');
      return;
    }
    
    // Test 3: Try basic operations
    console.log('🧪 Step 3: Testing database operations...');
    
    try {
      // Test epics table
      const { data: epicsData, error: epicsError } = await supabase
        .from('epics')
        .select('*')
        .limit(5);
      
      if (epicsError) {
        console.log(`   ⚠️  Epics query failed: ${epicsError.message}`);
      } else {
        console.log(`   ✅ Epics table: ${epicsData.length} records`);
      }
      
      // Test questions table  
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .limit(5);
      
      if (questionsError) {
        console.log(`   ⚠️  Questions query failed: ${questionsError.message}`);
      } else {
        console.log(`   ✅ Questions table: ${questionsData.length} records`);
      }
      
    } catch (operationsError) {
      console.log(`   ❌ Operations test failed: ${operationsError.message}`);
    }
    
    console.log('');
    
    // Success!
    console.log('🎉 Supabase setup verification complete!');
    console.log('');
    console.log('📋 Next steps:');
    if (missingTables.length === 0) {
      console.log('   ✅ Database ready for content import');
      console.log('   📥 Ready to sync Google Sheets → Supabase');
      console.log('   🔗 Ready to connect mobile app');
    }
    console.log('');
    console.log(`🔗 Supabase Dashboard: ${supabaseUrl.replace('/rest/v1', '')}`);
    console.log(`📊 SQL Editor: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv/sql/new`);
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    
    if (error.message.includes('SUPABASE_URL')) {
      console.log('💡 Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env file');
    }
  }
}

// Run the test
testSupabase();