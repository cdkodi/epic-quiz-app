#!/usr/bin/env node

/**
 * Import summaries for Sargas 30-33
 * Using the same successful method as questions import
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

async function importSummaries() {
  console.log('📚 Starting summary import for Sargas 30-33...\n');
  
  const summariesDir = path.join(__dirname, '../generated-content/summaries');
  const sargas = [30, 31, 32, 33];
  
  for (const sarga of sargas) {
    try {
      const summaryFile = `bala_kanda_sarga_${sarga}_summary.json`;
      const summaryPath = path.join(summariesDir, summaryFile);
      const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
      
      console.log(`📖 Processing summary for Sarga ${sarga}: "${summaryData.title}"`);
      
      // Generate SQL for manual execution
      const sql = generateSummarySQL(summaryData);
      console.log(`✅ Generated SQL for Sarga ${sarga} summary`);
      
      // Output the SQL for manual execution
      console.log(`\n-- Summary for Sarga ${sarga}`);
      console.log(sql);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error processing Sarga ${sarga}:`, error.message);
    }
  }
}

function generateSummarySQL(data) {
  const escapeSingleQuotes = (str) => str.replace(/'/g, "''");
  
  return `INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', ${data.sarga}, '${escapeSingleQuotes(data.title)}',
    '${JSON.stringify(data.key_events)}'::jsonb,
    '${JSON.stringify(data.main_characters)}'::jsonb,
    '${JSON.stringify(data.themes)}'::jsonb,
    '${escapeSingleQuotes(data.cultural_significance)}',
    '${escapeSingleQuotes(data.narrative_summary)}',
    '${data.source_url}',
    NOW(), NOW()
);`;
}

importSummaries().catch(console.error);