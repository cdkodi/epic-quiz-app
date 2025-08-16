#!/usr/bin/env node

/**
 * Batch Import Script for Sargas 9-10
 * 
 * Efficiently imports all questions from Sargas 9 and 10 to Supabase
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class BatchImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
  }

  async importAllSargas() {
    console.log('🚀 Starting batch import for Sargas 9-10...\n');

    const sargasToImport = [9, 10];
    let totalImported = 0;

    for (const sarga of sargasToImport) {
      console.log(`📥 Processing Sarga ${sarga}...`);
      
      // Load main questions
      const mainFile = `bala_kanda_sarga_${sarga}_questions.json`;
      const mainPath = path.join(this.questionsDir, mainFile);
      const mainData = JSON.parse(await fs.readFile(mainPath, 'utf8'));
      
      // Load hard questions
      const hardFile = `bala_kanda_sarga_${sarga}_hard_questions_addon.json`;
      const hardPath = path.join(this.questionsDir, hardFile);
      const hardData = JSON.parse(await fs.readFile(hardPath, 'utf8'));
      
      console.log(`   📋 Main questions: ${mainData.total_questions}`);
      console.log(`   🎯 Hard questions: ${hardData.total_hard_questions}`);
      
      // Generate and display SQL for all questions
      const allQuestions = [...mainData.questions, ...hardData.questions];
      const sql = this.generateBatchInsertSQL(allQuestions, mainData);
      
      console.log(`\\n📤 Generated batch insert SQL for Sarga ${sarga}:`);
      console.log(sql);
      console.log(`\\n   ✅ Ready to import ${allQuestions.length} questions for Sarga ${sarga}\\n`);
      
      totalImported += allQuestions.length;
    }

    console.log(`🎉 Batch SQL generation completed!`);
    console.log(`📊 Total questions ready for import: ${totalImported}`);
    console.log(`\\n💡 Next step: Copy and run the SQL statements above in Supabase SQL editor`);
  }

  generateBatchInsertSQL(questions, sourceData) {
    const insertStatements = questions.map(question => {
      return this.generateSingleInsertSQL(question, sourceData);
    });

    return insertStatements.join('\\n\\n');
  }

  generateSingleInsertSQL(question, sourceData) {
    // Escape single quotes for SQL
    const questionText = question.question_text.replace(/'/g, "''");
    const explanation = question.basic_explanation.replace(/'/g, "''");
    const originalQuote = (question.original_quote || '').replace(/'/g, "''");
    const quoteTranslation = (question.quote_translation || '').replace(/'/g, "''");
    const culturalContext = originalQuote ? 
      `Sanskrit: ${originalQuote}\\nTranslation: ${quoteTranslation}`.replace(/'/g, "''") : '';
    const sourceRef = (sourceData.source_url || 'Valmiki Ramayana').replace(/'/g, "''");

    // Format options as JSONB
    const optionsJson = JSON.stringify(question.options);
    
    // Format tags as array
    const tagsArray = question.tags && question.tags.length > 0 
      ? `ARRAY['${question.tags.join("', '")}']`
      : 'NULL';

    return `INSERT INTO questions (
  epic_id, kanda, sarga, category, difficulty, question_text, 
  options, correct_answer_id, basic_explanation, tags, 
  original_quote, quote_translation, cultural_context, source_reference
) VALUES (
  '${sourceData.epic_id}',
  '${sourceData.kanda}',
  ${sourceData.sarga},
  '${question.category}',
  '${question.difficulty}',
  '${questionText}',
  '${optionsJson}'::jsonb,
  ${question.correct_answer_id},
  '${explanation}',
  ${tagsArray},
  '${originalQuote}',
  '${quoteTranslation}',
  '${culturalContext}',
  '${sourceRef}'
);`;
  }
}

// Run the batch import
async function main() {
  try {
    const importer = new BatchImporter();
    await importer.importAllSargas();
  } catch (error) {
    console.error('❌ Batch import failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}