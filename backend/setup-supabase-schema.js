/**
 * Setup Supabase Schema using SQL execution
 * This script reads our schema file and executes it in Supabase
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function setupSchema() {
  try {
    console.log('🔧 Setting up Supabase schema for Epic Quiz App...');
    console.log('');

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
    }

    console.log(`   🔗 Connecting to: ${supabaseUrl}`);
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read the schema file
    const schemaPath = path.join(__dirname, 'database', 'supabase-schema.sql');
    console.log(`   📄 Reading schema from: ${schemaPath}`);
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log(`   📏 Schema size: ${(schemaSQL.length / 1024).toFixed(1)}KB`);
    console.log('');
    
    // Split SQL into individual statements
    // We need to execute them one by one since some operations require separate transactions
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`   📝 Executing ${statements.length} SQL statements...`);
    console.log('');
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements or comments
      if (!statement || statement.startsWith('--')) continue;
      
      try {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`);
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log(`      ⚠️  ${error.message}`);
          } else {
            console.log(`      ❌ Error: ${error.message}`);
            errors++;
          }
        } else {
          console.log(`      ✅ Success`);
          success++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (execError) {
        console.log(`      ❌ Execution error: ${execError.message}`);
        errors++;
      }
    }
    
    console.log('');
    console.log('📊 Schema Setup Results:');
    console.log(`   ✅ Successful statements: ${success}`);
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors}`);
    }
    console.log('');
    
    // Test the setup by checking if tables exist
    console.log('🧪 Testing schema setup...');
    
    const testTables = ['epics', 'questions', 'chapter_summaries'];
    
    for (const tableName of testTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table '${tableName}': ${error.message}`);
        } else {
          console.log(`   ✅ Table '${tableName}': Ready`);
        }
      } catch (tableError) {
        console.log(`   ❌ Table '${tableName}': ${tableError.message}`);
      }
    }
    
    console.log('');
    
    if (errors === 0) {
      console.log('🎉 Supabase schema setup completed successfully!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('   1. ✅ Database schema is ready');
      console.log('   2. 📥 Import Google Sheets content');
      console.log('   3. 🔗 Connect mobile app to Supabase');
      console.log('   4. 🚀 Deploy to app stores');
    } else {
      console.log('⚠️  Schema setup completed with some errors.');
      console.log('   Check the errors above - some may be expected (like "already exists")');
    }
    
    console.log('');
    console.log(`🔗 Supabase Dashboard: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv`);
    
  } catch (error) {
    console.error('❌ Schema setup failed:', error.message);
    
    if (error.message.includes('SUPABASE_URL')) {
      console.log('💡 Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env file');
    }
    if (error.message.includes('ENOENT')) {
      console.log('💡 Make sure the schema file exists at backend/database/supabase-schema.sql');
    }
  }
}

// Run the setup
setupSchema();