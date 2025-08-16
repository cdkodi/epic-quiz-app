#!/usr/bin/env node

/**
 * MCP Direct Import Script
 * 
 * Uses the verified working SQL format for importing questions to Supabase
 * via MCP apply_migration. This script uses the exact format that worked
 * for the successful imports of sargas 1-37.
 * 
 * Usage: node mcp-direct-import.js --sarga=40
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');

class MCPDirectImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
  }

  escapeSQL(str) {
    if (!str) return '';
    return str.replace(/'/g, "''");
  }

  async loadQuestions(sarga) {
    const questionsPath = path.join(this.questionsDir, `bala_kanda_sarga_${sarga}_questions.json`);
    const questionsData = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
    return questionsData.questions;
  }

  async loadHardQuestions(sarga) {
    try {
      const hardQuestionsPath = path.join(this.questionsDir, `bala_kanda_sarga_${sarga}_hard_questions_addon.json`);
      const hardQuestionsData = JSON.parse(await fs.readFile(hardQuestionsPath, 'utf8'));
      return hardQuestionsData.questions;
    } catch (error) {
      console.log(`⚠️  No hard questions found for sarga ${sarga}`);
      return [];
    }
  }

  async loadSummary(sarga) {
    try {
      const summaryPath = path.join(this.summariesDir, `bala_kanda_sarga_${sarga}_summary.json`);
      return JSON.parse(await fs.readFile(summaryPath, 'utf8'));
    } catch (error) {
      console.log(`⚠️  No summary found for sarga ${sarga}`);
      return null;
    }
  }

  generateQuestionSQL(sarga, question) {
    const questionText = this.escapeSQL(question.question_text);
    const optionsJson = JSON.stringify(question.options).replace(/'/g, "''");
    const explanation = this.escapeSQL(question.basic_explanation);
    const originalQuote = this.escapeSQL(question.original_quote || '');
    const quoteTranslation = this.escapeSQL(question.quote_translation || '');
    
    // Format tags as PostgreSQL arrays
    const tagsArray = question.tags && question.tags.length > 0 
      ? `ARRAY['${question.tags.map(t => this.escapeSQL(t)).join("', '")}']`
      : 'ARRAY[]::text[]';
    
    const crossEpicTagsArray = question.cross_epic_tags && question.cross_epic_tags.length > 0
      ? `ARRAY['${question.cross_epic_tags.map(t => this.escapeSQL(t)).join("', '")}']`
      : 'ARRAY[]::text[]';

    return `INSERT INTO questions (
  epic_id, kanda, sarga, category, difficulty, question_text, options, 
  correct_answer_id, basic_explanation, original_quote, quote_translation,
  tags, cross_epic_tags, source_reference
) VALUES (
  'ramayana', 'bala_kanda', ${sarga}, '${question.category}', '${question.difficulty}', 
  '${questionText}',
  '${optionsJson}'::jsonb,
  ${question.correct_answer_id},
  '${explanation}',
  '${originalQuote}',
  '${quoteTranslation}',
  ${tagsArray},
  ${crossEpicTagsArray},
  'https://www.valmikiramayan.net/utf8/baala/sarga${sarga}/bala_${sarga}_frame.htm'
);`;
  }

  generateSummarySQL(sarga, summary) {
    if (!summary) return null;

    const title = this.escapeSQL(summary.title);
    const keyEvents = JSON.stringify(summary.key_events || []).replace(/'/g, "''");
    const mainCharacters = JSON.stringify(summary.main_characters || []).replace(/'/g, "''");
    const themes = JSON.stringify(summary.themes || []).replace(/'/g, "''");
    const culturalSignificance = this.escapeSQL(summary.cultural_significance || '');
    const narrativeSummary = this.escapeSQL(summary.narrative_summary || '');

    return `INSERT INTO chapter_summaries (
  epic_id, kanda, sarga, title, key_events, main_characters, themes,
  cultural_significance, narrative_summary, source_reference
) VALUES (
  'ramayana', 'bala_kanda', ${sarga}, '${title}',
  '${keyEvents}'::jsonb,
  '${mainCharacters}'::jsonb,
  '${themes}'::jsonb,
  '${culturalSignificance}',
  '${narrativeSummary}',
  'https://www.valmikiramayan.net/utf8/baala/sarga${sarga}/bala_${sarga}_frame.htm'
);`;
  }

  async generateSargaSQL(sarga) {
    console.log(`📝 Generating SQL for Sarga ${sarga}...`);
    
    const questions = await this.loadQuestions(sarga);
    const hardQuestions = await this.loadHardQuestions(sarga);
    const summary = await this.loadSummary(sarga);
    
    let sql = `-- Import for Sarga ${sarga}\n-- Generated: ${new Date().toISOString()}\n\n`;
    
    // Add summary if exists
    if (summary) {
      sql += `-- Summary for Sarga ${sarga}\n`;
      sql += this.generateSummarySQL(sarga, summary) + '\n\n';
    }
    
    // Add standard questions
    sql += `-- Standard Questions for Sarga ${sarga} (${questions.length} questions)\n`;
    questions.forEach((question, index) => {
      sql += this.generateQuestionSQL(sarga, question) + '\n';
    });
    
    // Add hard questions
    if (hardQuestions.length > 0) {
      sql += `\n-- Hard Questions for Sarga ${sarga} (${hardQuestions.length} questions)\n`;
      hardQuestions.forEach((question, index) => {
        sql += this.generateQuestionSQL(sarga, question) + '\n';
      });
    }
    
    const totalQuestions = questions.length + hardQuestions.length;
    console.log(`✅ Generated SQL for Sarga ${sarga}: ${totalQuestions} questions, ${summary ? 1 : 0} summaries`);
    
    return sql;
  }

  async exportSargaSQL(sarga) {
    try {
      const sql = await this.generateSargaSQL(sarga);
      const outputPath = path.join(__dirname, '../../generated-content/sql', `sarga_${sarga}_import.sql`);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      await fs.writeFile(outputPath, sql);
      
      console.log(`💾 SQL saved to: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Error generating SQL for Sarga ${sarga}:`, error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!sargaArg) {
    console.error('❌ Usage: node mcp-direct-import.js --sarga=40');
    process.exit(1);
  }
  
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  console.log('🎯 MCP Direct Import SQL Generator');
  console.log('='.repeat(50));
  console.log(`📋 Target: Sarga ${sarga}`);
  
  const importer = new MCPDirectImporter();
  const sqlPath = await importer.exportSargaSQL(sarga);
  
  console.log('\n✨ SQL generation completed!');
  console.log(`💡 Next step: Use MCP Supabase apply_migration with: ${sqlPath}`);
  console.log('📋 Or run: mcp__supabase__apply_migration with the generated SQL content');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MCPDirectImporter;