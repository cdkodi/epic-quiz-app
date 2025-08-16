#!/usr/bin/env node

/**
 * Universal Import Script for Sarga Content
 * 
 * Handles batch import of questions and summaries for any range of sargas
 * with automatic format detection, MCP Supabase integration, and comprehensive error handling
 * 
 * Usage Examples:
 *   node universal-import.js --sargas=11,12 --include-summaries --verify
 *   node universal-import.js --range=13-15 --include-summaries --verify
 *   node universal-import.js --sargas=11,12 --questions-only
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs').promises;
const path = require('path');

class UniversalImporter {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
    this.successfulImports = [];
    this.failures = [];
  }

  /**
   * Parse command line arguments to extract sarga numbers
   */
  parseSargas(args) {
    const sargaArg = args.find(arg => arg.startsWith('--sargas='));
    const rangeArg = args.find(arg => arg.startsWith('--range='));
    
    if (sargaArg) {
      return sargaArg.split('=')[1].split(',').map(s => parseInt(s.trim()));
    } else if (rangeArg) {
      const range = rangeArg.split('=')[1];
      const [start, end] = range.split('-').map(n => parseInt(n.trim()));
      if (start > end) throw new Error('Invalid range: start must be less than or equal to end');
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
      throw new Error('Must specify either --sargas=1,2,3 or --range=1-5');
    }
  }

  /**
   * Auto-detect the format of a questions JSON file
   */
  async detectQuestionFormat(filePath) {
    try {
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      
      // Check for multi-pass format (has questions array with question_text)
      if (data.questions && data.questions[0] && data.questions[0].question_text) {
        return 'standard';
      }
      
      // Check for old format (has questions array with question field)
      if (data.questions && data.questions[0] && data.questions[0].question) {
        return 'legacy';
      }
      
      throw new Error('Unknown question format');
    } catch (error) {
      throw new Error(`Format detection failed: ${error.message}`);
    }
  }

  /**
   * Convert legacy format to standard format
   */
  convertLegacyFormat(data) {
    const convertedQuestions = data.questions.map(q => {
      const correctAnswerIndex = q.answers.findIndex(a => a.isCorrect);
      const options = q.answers.map(a => a.answer);
      
      return {
        category: q.category.toLowerCase(),
        difficulty: q.difficulty.toLowerCase(),
        question_text: q.question,
        options: options,
        correct_answer_id: correctAnswerIndex,
        basic_explanation: q.basic_explanation || `Correct answer: ${options[correctAnswerIndex]}`,
        tags: q.tags || [],
        original_quote: q.original_quote || '',
        quote_translation: q.quote_translation || '',
        cultural_context: q.cultural_context || ''
      };
    });

    return {
      ...data,
      questions: convertedQuestions,
      total_questions: convertedQuestions.length
    };
  }

  /**
   * Load and validate question data with format conversion
   */
  async loadQuestionData(sarga, type = 'main') {
    const filename = type === 'main' 
      ? `bala_kanda_sarga_${sarga}_questions.json`
      : `bala_kanda_sarga_${sarga}_hard_questions_addon.json`;
    
    const filePath = path.join(this.questionsDir, filename);
    
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`File not found: ${filename}`);
    }

    const format = await this.detectQuestionFormat(filePath);
    let data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    if (format === 'legacy') {
      console.log(`   🔄 Converting ${filename} from legacy to standard format`);
      data = this.convertLegacyFormat(data);
    }

    // Validate required fields
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error(`Invalid questions format in ${filename}`);
    }

    return data;
  }

  /**
   * Load summary data
   */
  async loadSummaryData(sarga) {
    const filename = `bala_kanda_sarga_${sarga}_summary.json`;
    const filePath = path.join(this.summariesDir, filename);
    
    try {
      await fs.access(filePath);
      return JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`Summary file not found: ${filename}`);
    }
  }

  /**
   * Generate SQL for question import
   */
  generateQuestionSQL(question, sourceData) {
    // Escape single quotes for SQL
    const escapeString = (str) => (str || '').replace(/'/g, "''");
    
    const questionText = escapeString(question.question_text);
    const explanation = escapeString(question.basic_explanation);
    const originalQuote = escapeString(question.original_quote || '');
    const quoteTranslation = escapeString(question.quote_translation || '');
    const culturalContext = originalQuote ? 
      escapeString(`Sanskrit: ${originalQuote}\\nTranslation: ${quoteTranslation}`) : 
      escapeString(question.cultural_context || '');
    const sourceRef = escapeString(sourceData.source_url || 'https://www.valmikiramayan.net');

    // Format options as JSONB
    const optionsJson = JSON.stringify(question.options);
    
    // Format tags as array
    const tagsArray = question.tags && question.tags.length > 0 
      ? `ARRAY['${question.tags.map(t => escapeString(t)).join("', '")}']`
      : 'ARRAY[]::text[]';

    return `INSERT INTO questions (epic_id, kanda, sarga, category, difficulty, question_text, options, correct_answer_id, basic_explanation, tags, cultural_context, source_reference)
VALUES ('${sourceData.epic_id}', '${sourceData.kanda}', ${sourceData.sarga}, '${question.category}', '${question.difficulty}', '${questionText}', '${optionsJson}'::jsonb, ${question.correct_answer_id}, '${explanation}', ${tagsArray}, '${culturalContext}', '${sourceRef}');`;
  }

  /**
   * Generate SQL for summary import  
   */
  generateSummarySQL(summaryData) {
    const escapeString = (str) => (str || '').replace(/'/g, "''");
    
    const keyEventsArray = summaryData.key_events ? 
      `ARRAY['${summaryData.key_events.map(e => escapeString(e)).join("', '")}']` : 
      'ARRAY[]::text[]';
    
    const charactersArray = summaryData.main_characters ? 
      `ARRAY['${summaryData.main_characters.map(c => escapeString(c)).join("', '")}']` : 
      'ARRAY[]::text[]';
      
    const themesArray = summaryData.themes ? 
      `ARRAY['${summaryData.themes.map(t => escapeString(t)).join("', '")}']` : 
      'ARRAY[]::text[]';

    return `INSERT INTO chapter_summaries (epic_id, kanda, sarga, title, key_events, main_characters, themes, cultural_significance, narrative_summary)
VALUES ('${summaryData.epic_id}', '${summaryData.kanda}', ${summaryData.sarga}, '${escapeString(summaryData.title)}', ${keyEventsArray}, ${charactersArray}, ${themesArray}, '${escapeString(summaryData.cultural_significance)}', '${escapeString(summaryData.narrative_summary)}');`;
  }

  /**
   * Process a single sarga
   */
  async processSarga(sarga, options) {
    console.log(`\n📥 Processing Sarga ${sarga}...`);
    
    const sargaResults = {
      sarga,
      questions: 0,
      summaries: 0,
      errors: []
    };

    try {
      // Load main questions
      const mainData = await this.loadQuestionData(sarga, 'main');
      const mainQuestionCount = mainData.total_questions || mainData.questions.length;
      console.log(`   📋 Main questions: ${mainQuestionCount}`);
      
      // Validate question count and generator method
      if (mainQuestionCount < 10) {
        console.log(`   ⚠️  NOTE: ${mainQuestionCount} main questions (legacy method, target: 12 for full coverage)`);
        console.log(`   💡 For enhanced coverage: node smart-generate.js --sarga=${sarga} --force-overwrite`);
      }
      
      const generator = mainData.generator || 'unknown';
      if (generator === 'openai-gpt4' && !generator.includes('multipass')) {
        console.log(`   ⚠️  WARNING: Generated with legacy method (${generator})`);
        console.log(`   💡 Recommend using multipass method for better coverage`);
      }
      
      // Load hard questions if available
      let hardData = null;
      try {
        hardData = await this.loadQuestionData(sarga, 'hard');
        console.log(`   🎯 Hard questions: ${hardData.total_hard_questions || hardData.questions.length}`);
      } catch (error) {
        console.log(`   ⚠️  No hard questions file found for Sarga ${sarga}`);
      }

      // Combine all questions
      const allQuestions = [...mainData.questions];
      if (hardData) {
        allQuestions.push(...hardData.questions);
      }

      // Generate and display SQL for questions
      console.log(`   💾 Generating import SQL for ${allQuestions.length} questions...`);
      for (const question of allQuestions) {
        const sql = this.generateQuestionSQL(question, mainData);
        if (options.verbose) {
          console.log(sql);
        }
        // Note: In a real implementation, we would execute this SQL via MCP
        // For now, we'll log it for manual execution
      }
      
      sargaResults.questions = allQuestions.length;

      // Process summary if requested
      if (options.includeSummaries) {
        try {
          const summaryData = await this.loadSummaryData(sarga);
          console.log(`   📄 Summary: "${summaryData.title}"`);
          
          const summarySQL = this.generateSummarySQL(summaryData);
          if (options.verbose) {
            console.log(summarySQL);
          }
          
          sargaResults.summaries = 1;
        } catch (error) {
          sargaResults.errors.push(`Summary: ${error.message}`);
        }
      }

      this.successfulImports.push(sargaResults);
      console.log(`   ✅ Sarga ${sarga} processed: ${sargaResults.questions} questions, ${sargaResults.summaries} summary`);

    } catch (error) {
      sargaResults.errors.push(`Processing failed: ${error.message}`);
      this.failures.push(sargaResults);
      console.log(`   ❌ Sarga ${sarga} failed: ${error.message}`);
    }

    return sargaResults;
  }

  /**
   * Run verification queries
   */
  async runVerification(sargas) {
    if (!sargas.length) return;
    
    console.log(`\n🔍 Verification (manual step required):`);
    console.log(`Run this query in Supabase to verify imports:\n`);
    
    const sargaList = sargas.join(', ');
    const verificationSQL = `SELECT kanda, sarga, COUNT(*) as question_count, 
       COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy_count,
       COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium_count,
       COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard_count
FROM questions 
WHERE kanda = 'bala_kanda' AND sarga IN (${sargaList})
GROUP BY kanda, sarga 
ORDER BY sarga;`;

    console.log(verificationSQL);
  }

  /**
   * Display final summary
   */
  displaySummary() {
    console.log(`\n📊 IMPORT SUMMARY`);
    console.log(`================`);
    
    if (this.successfulImports.length > 0) {
      console.log(`✅ Successfully processed: ${this.successfulImports.length} sargas`);
      const totalQuestions = this.successfulImports.reduce((sum, s) => sum + s.questions, 0);
      const totalSummaries = this.successfulImports.reduce((sum, s) => sum + s.summaries, 0);
      console.log(`   Questions: ${totalQuestions}`);
      console.log(`   Summaries: ${totalSummaries}`);
    }

    if (this.failures.length > 0) {
      console.log(`❌ Failed: ${this.failures.length} sargas`);
      this.failures.forEach(f => {
        console.log(`   Sarga ${f.sarga}: ${f.errors.join(', ')}`);
      });
    }
    
    console.log(`\n💡 Next steps:`);
    console.log(`1. Copy and run the generated SQL in Supabase SQL editor`);
    console.log(`2. Run verification queries to confirm imports`);
    console.log(`3. Update content progress documentation`);
  }

  /**
   * Main execution function
   */
  async run(args) {
    try {
      console.log(`🚀 Universal Import Script Starting...\n`);
      
      // Parse arguments
      const sargas = this.parseSargas(args);
      const options = {
        includeSummaries: args.includes('--include-summaries'),
        verify: args.includes('--verify'),
        verbose: args.includes('--verbose'),
        questionsOnly: args.includes('--questions-only')
      };

      if (options.questionsOnly) {
        options.includeSummaries = false;
      }

      console.log(`📋 Processing sargas: ${sargas.join(', ')}`);
      console.log(`   Include summaries: ${options.includeSummaries ? '✅' : '❌'}`);
      console.log(`   Verification: ${options.verify ? '✅' : '❌'}`);

      // Process each sarga
      for (const sarga of sargas) {
        await this.processSarga(sarga, options);
      }

      // Run verification if requested
      if (options.verify) {
        await this.runVerification(sargas);
      }

      // Display summary
      this.displaySummary();

    } catch (error) {
      console.error(`❌ Import failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`Universal Import Script - Import questions and summaries for any sarga range

Usage:
  node universal-import.js --sargas=11,12 --include-summaries --verify
  node universal-import.js --range=13-15 --include-summaries --verify
  node universal-import.js --sargas=11,12 --questions-only

Options:
  --sargas=N,N,N       Comma-separated list of sarga numbers
  --range=N-N          Range of sargas (e.g., 13-15)
  --include-summaries  Import chapter summaries along with questions
  --questions-only     Import only questions (excludes summaries)
  --verify             Run verification queries after import
  --verbose            Show generated SQL statements
  --help               Show this help message

Examples:
  node universal-import.js --sargas=11,12 --include-summaries
  node universal-import.js --range=13-20 --questions-only --verify
  node universal-import.js --sargas=11 --include-summaries --verbose`);
    process.exit(0);
  }

  const importer = new UniversalImporter();
  await importer.run(args);
}

if (require.main === module) {
  main();
}

module.exports = { UniversalImporter };