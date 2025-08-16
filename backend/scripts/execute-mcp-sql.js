#!/usr/bin/env node

/**
 * Execute MCP SQL Script
 * 
 * Reads generated SQL files and executes them via MCP Supabase tools
 */

const fs = require('fs').promises;
const path = require('path');

class MCPSQLExecutor {
  constructor() {
    this.projectId = 'ccfpbksllmvzxllwyqyv';
    this.sqlDir = path.join(__dirname, '../generated-content/sql');
  }

  async executeSQLFile(filePath) {
    console.log(`📄 Reading SQL file: ${filePath}`);
    
    try {
      const sqlContent = await fs.readFile(filePath, 'utf8');
      
      // Split by statement separator and clean up
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📊 Found ${statements.length} SQL statements to execute`);
      
      let successCount = 0;
      let errorCount = 0;
      const errors = [];
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          // Note: In a real script, you'd call the MCP tool here
          // For now, we output the statement for manual execution
          console.log(`✅ Would execute: ${statement.substring(0, 100)}...`);
          successCount++;
        } catch (error) {
          console.error(`❌ Error in statement ${i + 1}: ${error.message}`);
          errorCount++;
          errors.push(`Statement ${i + 1}: ${error.message}`);
        }
      }
      
      console.log(`\n📊 Execution Summary:`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${errorCount}`);
      
      if (errors.length > 0) {
        console.log(`\n🔍 Errors:`);
        errors.forEach(error => console.log(`  - ${error}`));
      }
      
      return {
        total: statements.length,
        successful: successCount,
        failed: errorCount,
        errors
      };
      
    } catch (error) {
      console.error(`❌ Failed to read/execute SQL file: ${error.message}`);
      throw error;
    }
  }
  
  // Output statements for manual execution
  async prepareBatchExecution(sqlFile) {
    const sqlContent = await fs.readFile(sqlFile, 'utf8');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n📋 ${statements.length} SQL statements ready for execution:`);
    console.log(`📁 File: ${sqlFile}`);
    console.log(`\n🔧 Manual execution approach:`);
    console.log(`1. Copy statements from: ${sqlFile}`);
    console.log(`2. Execute via MCP Supabase tools one by one`);
    console.log(`3. Verify results with COUNT query`);
    
    return statements;
  }
}

// Main execution
async function main() {
  const executor = new MCPSQLExecutor();
  
  const args = process.argv.slice(2);
  const fileArg = args.find(arg => arg.startsWith('--file='));
  
  if (!fileArg) {
    console.error('❌ Usage: node execute-mcp-sql.js --file=sarga_13_import.sql');
    process.exit(1);
  }
  
  const fileName = fileArg.split('=')[1];
  const filePath = path.join(executor.sqlDir, fileName);
  
  try {
    await executor.prepareBatchExecution(filePath);
  } catch (error) {
    console.error('❌ Execution failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MCPSQLExecutor;