#!/usr/bin/env node

/**
 * Fixed MCP Import Script - handles category constraint properly
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');

class FixedMCPImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
  }

  async importSarga(sarga) {
    console.log(`🎯 Fixed MCP Import for Sarga ${sarga}`);
    
    // Load standard questions
    const questionsFile = path.join(this.questionsDir, `bala_kanda_sarga_${sarga}_questions.json`);
    const standardQuestions = JSON.parse(await fs.readFile(questionsFile, 'utf8'));
    
    // Load hard questions
    const hardQuestionsFile = path.join(this.questionsDir, `bala_kanda_sarga_${sarga}_hard_questions_addon.json`);
    const hardQuestions = JSON.parse(await fs.readFile(hardQuestionsFile, 'utf8'));
    
    // Load summary
    const summaryFile = path.join(this.summariesDir, `bala_kanda_sarga_${sarga}_summary.json`);
    const summary = JSON.parse(await fs.readFile(summaryFile, 'utf8'));
    
    // Generate fixed SQL
    const sql = this.generateFixedSQL(sarga, standardQuestions, hardQuestions, summary);
    
    console.log(`✅ Generated fixed SQL for Sarga ${sarga}: ${standardQuestions.questions.length + hardQuestions.questions.length} questions, 1 summary`);
    
    return sql;
  }

  generateFixedSQL(sarga, standardQuestions, hardQuestions, summary) {
    const allQuestions = [
      ...standardQuestions.questions,
      ...hardQuestions.questions
    ];

    let sql = `-- Fixed Import for Sarga ${sarga}\\n`;
    sql += `-- Generated: ${new Date().toISOString()}\\n\\n`;

    // Summary
    sql += `-- Summary for Sarga ${sarga}\\n`;
    sql += `INSERT INTO chapter_summaries (\\n`;
    sql += `  epic_id, kanda, sarga, title, key_events, main_characters, themes,\\n`;
    sql += `  cultural_significance, narrative_summary, source_reference\\n`;
    sql += `) VALUES (\\n`;
    sql += `  'ramayana', 'bala_kanda', ${sarga}, ${this.escapeSql(summary.title)},\\n`;
    sql += `  '[]'::jsonb,\\n`;
    sql += `  '[]'::jsonb,\\n`;
    sql += `  '[]'::jsonb,\\n`;
    sql += `  ${this.escapeSql(summary.cultural_significance || 'Cultural significance of this sarga.')},\\n`;
    sql += `  ${this.escapeSql(summary.summary || '')},\\n`;
    sql += `  ${this.escapeSql(summary.source_reference || standardQuestions.source_url)}\\n`;
    sql += `);\\n\\n`;

    // Questions with fixed categories
    sql += `-- Questions for Sarga ${sarga} (${allQuestions.length} questions)\\n`;
    
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      
      // Fix category - use only the first category if multiple
      let category = q.category || 'themes';
      if (category.includes('|')) {
        category = category.split('|')[0]; // Take first category
      }
      if (category.includes(',')) {
        category = category.split(',')[0].trim(); // Take first category
      }
      if (category.includes(' ')) {
        category = category.split(' ')[0]; // Take first word
      }
      
      // Ensure it's one of the allowed values
      const allowedCategories = ['characters', 'events', 'themes', 'culture'];
      if (!allowedCategories.includes(category)) {
        category = 'themes'; // Default fallback
      }

      sql += `INSERT INTO questions (\\n`;
      sql += `  epic_id, kanda, sarga, category, difficulty, question_text, options, \\n`;
      sql += `  correct_answer_id, basic_explanation, original_quote, quote_translation,\\n`;
      sql += `  tags, cross_epic_tags, source_reference\\n`;
      sql += `) VALUES (\\n`;
      sql += `  'ramayana', 'bala_kanda', ${sarga}, '${category}', '${q.difficulty}', \\n`;
      sql += `  ${this.escapeSql(q.question_text || q.question)},\\n`;
      
      // Handle options array
      const options = q.options || (q.answers ? q.answers.map(a => a.answer) : []);
      sql += `  '${JSON.stringify(options)}'::jsonb,\\n`;
      sql += `  ${q.correct_answer_id !== undefined ? q.correct_answer_id : 0},\\n`;
      sql += `  ${this.escapeSql(q.basic_explanation)},\\n`;
      sql += `  ${this.escapeSql(q.original_quote)},\\n`;
      sql += `  ${this.escapeSql(q.quote_translation)},\\n`;
      
      // Handle tags arrays
      const tags = q.tags || [];
      const crossEpicTags = q.cross_epic_tags || [];
      sql += `  ARRAY[${tags.map(t => `'${this.escapeSqlString(t)}'`).join(', ')}],\\n`;
      sql += `  ARRAY[${crossEpicTags.map(t => `'${this.escapeSqlString(t)}'`).join(', ')}],\\n`;
      sql += `  ${this.escapeSql(standardQuestions.source_url)}\\n`;
      sql += `);\\n`;
      
      if (i < allQuestions.length - 1) {
        sql += `\\n`;
      }
    }

    return sql;
  }

  escapeSql(str) {
    if (!str) return "''";
    return `'${this.escapeSqlString(str)}'`;
  }

  escapeSqlString(str) {
    if (!str) return '';
    return str.toString().replace(/'/g, "''");
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!sargaArg) {
    console.error('❌ Usage: node mcp-fixed-import.js --sarga=42');
    process.exit(1);
  }
  
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  try {
    const importer = new FixedMCPImporter();
    const sql = await importer.importSarga(sarga);
    
    // Save SQL
    const sqlFile = path.join(__dirname, '../../generated-content/sql', `sarga_${sarga}_fixed_import.sql`);
    await fs.writeFile(sqlFile, sql, 'utf8');
    console.log(`💾 Fixed SQL saved to: ${sqlFile}`);
    
    console.log(`\\n✨ Fixed import SQL generated!`);
    console.log(`📋 Next step: Use MCP Supabase apply_migration with the generated SQL`);
    
  } catch (error) {
    console.error('❌ Fixed import failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { FixedMCPImporter };