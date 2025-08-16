#!/usr/bin/env node

/**
 * MCP Batch Import Script
 * 
 * Uses MCP Supabase tools to import questions from JSON files
 */

const fs = require('fs').promises;
const path = require('path');

class MCPBatchImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
  }

  async importSarga(sargaNumber) {
    console.log(`📥 Starting MCP batch import for Sarga ${sargaNumber}...`);

    try {
      // Load main questions
      const mainFile = `bala_kanda_sarga_${sargaNumber}_questions.json`;
      const mainPath = path.join(this.questionsDir, mainFile);
      const mainData = JSON.parse(await fs.readFile(mainPath, 'utf8'));
      
      console.log(`📋 Loaded ${mainData.total_questions} main questions`);

      // Load hard questions addon
      let hardData = null;
      try {
        const hardFile = `bala_kanda_sarga_${sargaNumber}_hard_questions_addon.json`;
        const hardPath = path.join(this.questionsDir, hardFile);
        hardData = JSON.parse(await fs.readFile(hardPath, 'utf8'));
        console.log(`🎯 Loaded ${hardData.total_hard_questions} hard questions`);
      } catch (error) {
        console.log(`⚠️  No hard questions file found for Sarga ${sargaNumber}`);
      }

      // Generate import SQL for all questions
      const allQuestions = [...mainData.questions];
      if (hardData) {
        allQuestions.push(...hardData.questions);
      }

      console.log(`💾 Generating import SQL for ${allQuestions.length} questions...`);

      // Generate SQL statements
      const sqlStatements = allQuestions.map(question => this.generateInsertSQL(question, mainData));
      
      // Output SQL for manual execution
      const outputFile = path.join(__dirname, `../generated-content/sql/sarga_${sargaNumber}_import.sql`);
      
      // Ensure sql directory exists
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      
      const sqlContent = sqlStatements.join(';\n\n') + ';';
      await fs.writeFile(outputFile, sqlContent);
      
      console.log(`📄 SQL export saved to: ${outputFile}`);
      console.log(`✅ Generated ${sqlStatements.length} INSERT statements`);
      
      return {
        sarga: sargaNumber,
        questionsGenerated: allQuestions.length,
        sqlFile: outputFile
      };

    } catch (error) {
      console.error(`❌ Error importing Sarga ${sargaNumber}:`, error.message);
      throw error;
    }
  }

  generateInsertSQL(question, sourceData) {
    // Escape single quotes in strings
    const escapeString = (str) => str ? str.replace(/'/g, "''") : '';
    
    const questionText = escapeString(question.question_text);
    const explanation = escapeString(question.basic_explanation);
    const culturalContext = question.original_quote 
      ? escapeString(`Sanskrit: ${question.original_quote}\nTranslation: ${question.quote_translation}`)
      : '';
    const sourceRef = escapeString(sourceData.source_url || 'Valmiki Ramayana');

    // Convert arrays to proper format
    const optionsJson = JSON.stringify(question.options);
    const tagsArray = question.tags ? question.tags.map(tag => `'${escapeString(tag)}'`).join(', ') : '';

    return `INSERT INTO questions (
  epic_id, kanda, sarga, category, difficulty, question_text, 
  options, correct_answer_id, basic_explanation, tags, 
  cultural_context, source_reference
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
  ARRAY[${tagsArray}],
  '${culturalContext}',
  '${sourceRef}'
)`;
  }
}

// Main execution
async function main() {
  const importer = new MCPBatchImporter();
  
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!sargaArg) {
    console.error('❌ Usage: node mcp-batch-import.js --sarga=13');
    process.exit(1);
  }
  
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  try {
    const result = await importer.importSarga(sarga);
    console.log(`\n🎉 Batch import SQL generation completed!`);
    console.log(`📊 Sarga ${result.sarga}: ${result.questionsGenerated} questions`);
    console.log(`📁 SQL file: ${result.sqlFile}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Review the generated SQL file`);
    console.log(`2. Execute the SQL in Supabase or via MCP tools`);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MCPBatchImporter;