#!/usr/bin/env node

/**
 * Import Enhanced Sargas 34-37 Content to Supabase
 * 
 * This script imports the enhanced content (12 questions + summaries) for sargas 34-37
 * using the successful MCP Supabase approach.
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class EnhancedContentImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
    this.projectId = process.env.SUPABASE_PROJECT_ID || 'ccfpbksllmvzxllwyqyv';
  }

  async loadContent(sarga) {
    console.log(`📖 Loading enhanced content for Sarga ${sarga}...`);
    
    // Load questions
    const questionsPath = path.join(this.questionsDir, `bala_kanda_sarga_${sarga}_questions.json`);
    const questionsData = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
    
    // Load summary
    const summaryPath = path.join(this.summariesDir, `bala_kanda_sarga_${sarga}_summary.json`);
    const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
    
    console.log(`✅ Loaded ${questionsData.total_questions} questions and 1 summary for Sarga ${sarga}`);
    return { questions: questionsData.questions, summary: summaryData };
  }

  generateSummarySQL(sarga, summary) {
    const title = summary.title.replace(/'/g, "''");
    const keyEvents = Array.isArray(summary.key_events) 
      ? summary.key_events.join('; ').replace(/'/g, "''")
      : summary.key_events.replace(/'/g, "''");
    const mainCharacters = Array.isArray(summary.main_characters)
      ? summary.main_characters.join('; ').replace(/'/g, "''")
      : summary.main_characters.replace(/'/g, "''");
    const themes = Array.isArray(summary.themes)
      ? summary.themes.join('; ').replace(/'/g, "''")
      : summary.themes.replace(/'/g, "''");
    const culturalSig = summary.cultural_significance.replace(/'/g, "''");
    const narrativeSummary = summary.narrative_summary.replace(/'/g, "''");

    return `INSERT INTO chapter_summaries (epic_id, kanda, sarga, title, key_events, main_characters, themes, cultural_significance, narrative_summary) VALUES ('ramayana', 'bala_kanda', ${sarga}, '${title}', '${keyEvents}', '${mainCharacters}', '${themes}', '${culturalSig}', '${narrativeSummary}');`;
  }

  generateQuestionsSQL(sarga, questions) {
    const sqlStatements = [];
    
    questions.forEach((question, index) => {
      const questionText = question.question_text.replace(/'/g, "''");
      const options = JSON.stringify(question.options).replace(/'/g, "''");
      const explanation = question.basic_explanation.replace(/'/g, "''");
      const tags = question.tags ? `{"${question.tags.join('", "')}"` : '{}';
      const originalQuote = question.original_quote ? question.original_quote.replace(/'/g, "''") : '';
      const quoteTranslation = question.quote_translation ? question.quote_translation.replace(/'/g, "''") : '';
      const culturalContext = question.cross_epic_tags ? `${question.cross_epic_tags.join(', ')} context` : 'Enhanced multipass generation context';
      
      sqlStatements.push(`INSERT INTO questions (epic_id, kanda, sarga, category, difficulty, question_text, options, correct_answer_id, basic_explanation, tags, original_quote, quote_translation, cultural_context, source_reference) VALUES ('ramayana', 'bala_kanda', ${sarga}, '${question.category}', '${question.difficulty}', '${questionText}', '${options}', ${question.correct_answer_id}, '${explanation}', '${tags}', '${originalQuote}', '${quoteTranslation}', '${culturalContext}', 'https://www.valmikiramayan.net/utf8/baala/sarga${sarga}/bala_${sarga}_frame.htm');`);
    });
    
    return sqlStatements;
  }

  async generateImportSQL() {
    console.log('🚀 Generating enhanced import SQL for Sargas 34-37...');
    
    let fullSQL = '-- Enhanced Import for Sargas 34-37 with 12 questions each\n\n';
    
    for (let sarga = 34; sarga <= 37; sarga++) {
      console.log(`\n📝 Processing Sarga ${sarga}...`);
      
      const { questions, summary } = await this.loadContent(sarga);
      
      // Add summary
      fullSQL += `-- Sarga ${sarga} Summary\n`;
      fullSQL += this.generateSummarySQL(sarga, summary) + '\n\n';
      
      // Add questions
      fullSQL += `-- Sarga ${sarga} Questions (${questions.length} total)\n`;
      const questionSQL = this.generateQuestionsSQL(sarga, questions);
      fullSQL += questionSQL.join('\n') + '\n\n';
      
      console.log(`✅ Generated SQL for Sarga ${sarga}: 1 summary + ${questions.length} questions`);
    }
    
    return fullSQL;
  }

  async exportSQL() {
    try {
      const sql = await this.generateImportSQL();
      const outputPath = path.join(__dirname, '../generated-content/sql/enhanced-sargas-34-37-import.sql');
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      await fs.writeFile(outputPath, sql);
      
      console.log(`\n💾 Enhanced import SQL saved to: ${outputPath}`);
      console.log('📊 Summary:');
      console.log('- Sargas 34-37: 4 summaries + 48 questions total');
      console.log('- Ready for MCP Supabase import');
      
      return outputPath;
    } catch (error) {
      console.error('❌ Error generating enhanced import SQL:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 Enhanced Content Import Generator for Sargas 34-37');
  console.log('='.repeat(60));
  
  const importer = new EnhancedContentImporter();
  await importer.exportSQL();
  
  console.log('\n✨ Enhanced content ready for import!');
  console.log('💡 Next step: Use MCP Supabase apply_migration with the generated SQL file');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = EnhancedContentImporter;