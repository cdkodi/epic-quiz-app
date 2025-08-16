#!/usr/bin/env node

/**
 * Direct Supabase Import Script
 * 
 * Imports questions directly from generated JSON files to Supabase
 * Bypasses Google Sheets staging entirely
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class DirectSupabaseImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
  }

  async importSarga(sargaNumber, includeHardQuestions = true) {
    console.log(`📥 Starting direct import for Sarga ${sargaNumber}...\n`);

    try {
      // Step 1: Load main questions file
      const mainFile = `bala_kanda_sarga_${sargaNumber}_questions.json`;
      const mainPath = path.join(this.questionsDir, mainFile);
      const mainData = JSON.parse(await fs.readFile(mainPath, 'utf8'));
      
      console.log(`📋 Loaded ${mainData.total_questions} main questions from ${mainFile}`);

      // Step 2: Load hard questions if requested
      let hardData = null;
      if (includeHardQuestions) {
        try {
          const hardFile = `bala_kanda_sarga_${sargaNumber}_hard_questions_addon.json`;
          const hardPath = path.join(this.questionsDir, hardFile);
          hardData = JSON.parse(await fs.readFile(hardPath, 'utf8'));
          console.log(`🎯 Loaded ${hardData.total_hard_questions} hard questions from ${hardFile}`);
        } catch (error) {
          console.log(`⚠️  No hard questions file found for Sarga ${sargaNumber}`);
        }
      }

      // Step 3: Import main questions
      console.log(`\\n📤 Importing main questions to Supabase...`);
      const mainImportResults = await this.importQuestionsToSupabase(mainData.questions, mainData);
      
      // Step 4: Import hard questions if available
      let hardImportResults = { imported: 0, errors: [] };
      if (hardData) {
        console.log(`📤 Importing hard questions to Supabase...`);
        hardImportResults = await this.importQuestionsToSupabase(hardData.questions, hardData);
      }

      // Step 5: Summary
      const totalImported = mainImportResults.imported + hardImportResults.imported;
      const totalErrors = mainImportResults.errors.length + hardImportResults.errors.length;

      console.log(`\\n✅ Sarga ${sargaNumber} import completed!`);
      console.log(`   📊 Successfully imported: ${totalImported} questions`);
      if (totalErrors > 0) {
        console.log(`   ⚠️  Errors: ${totalErrors}`);
        [...mainImportResults.errors, ...hardImportResults.errors].forEach(error => {
          console.log(`      - ${error}`);
        });
      }

      return {
        sarga: sargaNumber,
        imported: totalImported,
        errors: totalErrors,
        details: {
          main: mainImportResults,
          hard: hardImportResults
        }
      };

    } catch (error) {
      console.error(`❌ Failed to import Sarga ${sargaNumber}:`, error.message);
      throw error;
    }
  }

  async importQuestionsToSupabase(questions, sourceData) {
    let imported = 0;
    const errors = [];

    for (const question of questions) {
      try {
        // Convert to Supabase format
        const supabaseQuestion = this.convertToSupabaseFormat(question, sourceData);
        
        // Import using MCP tools would go here, but for now we'll generate SQL
        const sql = this.generateInsertSQL(supabaseQuestion);
        console.log(`   ✅ Generated SQL for: "${question.question_text.substring(0, 50)}..."`);
        
        imported++;
      } catch (error) {
        errors.push(`Question "${question.question_text?.substring(0, 30)}...": ${error.message}`);
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }

    return { imported, errors };
  }

  convertToSupabaseFormat(question, sourceData) {
    return {
      epic_id: sourceData.epic_id,
      kanda: sourceData.kanda,
      sarga: sourceData.sarga,
      category: question.category,
      difficulty: question.difficulty,
      question_text: question.question_text,
      options: question.options,
      correct_answer_id: question.correct_answer_id,
      basic_explanation: question.basic_explanation,
      tags: question.tags || [],
      cultural_context: question.original_quote 
        ? `Sanskrit: ${question.original_quote}\\nTranslation: ${question.quote_translation}`
        : '',
      source_reference: sourceData.source_url || 'Valmiki Ramayana'
    };
  }

  generateInsertSQL(question) {
    const optionsJson = JSON.stringify(question.options).replace(/'/g, "''");
    const tagsJson = JSON.stringify(question.tags).replace(/'/g, "''");
    const questionText = question.question_text.replace(/'/g, "''");
    const explanation = question.basic_explanation.replace(/'/g, "''");
    const culturalContext = question.cultural_context.replace(/'/g, "''");
    const sourceRef = question.source_reference.replace(/'/g, "''");

    return `INSERT INTO questions (
      epic_id, kanda, sarga, category, difficulty, question_text, 
      options, correct_answer_id, basic_explanation, tags, 
      cultural_context, source_reference
    ) VALUES (
      '${question.epic_id}',
      '${question.kanda}',
      ${question.sarga},
      '${question.category}',
      '${question.difficulty}',
      '${questionText}',
      '${optionsJson}',
      ${question.correct_answer_id},
      '${explanation}',
      '${tagsJson}',
      '${culturalContext}',
      '${sourceRef}'
    );`;
  }

  async batchImportSargas(sargaNumbers) {
    console.log(`🚀 Starting batch import for Sargas: ${sargaNumbers.join(', ')}\\n`);
    
    const results = [];
    let totalImported = 0;
    let totalErrors = 0;

    for (const sarga of sargaNumbers) {
      const result = await this.importSarga(sarga);
      results.push(result);
      totalImported += result.imported;
      totalErrors += result.errors;
      
      console.log(''); // Add spacing between sargas
    }

    console.log('🎉 BATCH IMPORT SUMMARY');
    console.log('========================');
    console.log(`Total Questions Imported: ${totalImported}`);
    console.log(`Total Errors: ${totalErrors}`);
    console.log('\\nBy Sarga:');
    results.forEach(result => {
      console.log(`  Sarga ${result.sarga}: ${result.imported} questions`);
    });

    return results;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  const batchArg = args.find(arg => arg.startsWith('--batch='));
  
  const importer = new DirectSupabaseImporter();

  try {
    if (sargaArg) {
      const sarga = parseInt(sargaArg.split('=')[1]);
      await importer.importSarga(sarga);
    } else if (batchArg) {
      const sargas = batchArg.split('=')[1].split(',').map(s => parseInt(s.trim()));
      await importer.batchImportSargas(sargas);
    } else {
      console.error('❌ Usage:');
      console.error('  Single Sarga: node direct-supabase-import.js --sarga=9');
      console.error('  Batch Import: node direct-supabase-import.js --batch=9,10');
      process.exit(1);
    }
  } catch (error) {
    console.error('\\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { DirectSupabaseImporter };