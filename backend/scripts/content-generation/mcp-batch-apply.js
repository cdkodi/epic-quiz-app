#!/usr/bin/env node

/**
 * MCP Batch Apply Script
 * 
 * Reads generated SQL files and applies them via MCP apply_migration in batches
 * to avoid size limits and ensure reliability.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');

class MCPBatchApplier {
  constructor() {
    this.projectId = 'ccfpbksllmvzxllwyqyv';
  }

  async readSQLFile(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  splitIntoQuestions(sql) {
    // Split by INSERT INTO questions statements
    const questionPattern = /INSERT INTO questions \(/g;
    const parts = sql.split(questionPattern);
    
    // Skip the first part (summary and comments)
    const questions = parts.slice(1).map((part, index) => {
      // Add back the INSERT INTO questions ( prefix
      return 'INSERT INTO questions (' + part;
    });
    
    return questions;
  }

  async applySQLBatch(sql, batchName) {
    console.log(`📝 Applying batch: ${batchName}`);
    
    try {
      // Since we can't directly call MCP tools from Node.js, we'll write the SQL
      // and provide instructions for manual execution
      const outputPath = path.join(__dirname, '../../generated-content/sql', `${batchName}.sql`);
      await fs.writeFile(outputPath, sql);
      
      console.log(`💾 SQL batch saved to: ${outputPath}`);
      console.log(`📋 Apply this batch using: mcp__supabase__apply_migration`);
      console.log(`🔧 Migration name: ${batchName}`);
      console.log(`📄 SQL content ready for MCP application`);
      
      return outputPath;
    } catch (error) {
      console.error(`❌ Error applying batch ${batchName}:`, error);
      throw error;
    }
  }

  async processSargaSQL(sarga) {
    console.log(`🎯 Processing Sarga ${sarga} SQL...`);
    
    const sqlPath = path.join(__dirname, '../../generated-content/sql', `sarga_${sarga}_import.sql`);
    const sql = await this.readSQLFile(sqlPath);
    
    // Split into manageable chunks
    const questions = this.splitIntoQuestions(sql);
    console.log(`📊 Found ${questions.length} questions to import`);
    
    // Create batches of 5 questions each
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const batchName = `sarga_${sarga}_questions_batch_${Math.floor(i / batchSize) + 1}`;
      const batchSQL = batch.join('\n');
      
      batches.push({ name: batchName, sql: batchSQL });
    }
    
    // Save all batches
    const batchPaths = [];
    for (const batch of batches) {
      const path = await this.applySQLBatch(batch.sql, batch.name);
      batchPaths.push(path);
    }
    
    console.log(`✅ Created ${batches.length} batches for Sarga ${sarga}`);
    return batchPaths;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!sargaArg) {
    console.error('❌ Usage: node mcp-batch-apply.js --sarga=40');
    process.exit(1);
  }
  
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  console.log('🚀 MCP Batch Apply Script');
  console.log('='.repeat(50));
  console.log(`📋 Target: Sarga ${sarga}`);
  
  const applier = new MCPBatchApplier();
  const batchPaths = await applier.processSargaSQL(sarga);
  
  console.log('\n✨ Batch processing completed!');
  console.log('📋 Next steps:');
  console.log('1. Apply each batch using mcp__supabase__apply_migration');
  console.log('2. Use the generated SQL files as migration content');
  console.log(`3. Verify final count: SELECT COUNT(*) FROM questions WHERE sarga = ${sarga}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MCPBatchApplier;