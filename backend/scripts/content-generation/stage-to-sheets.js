#!/usr/bin/env node

/**
 * Stage Generated Content to Google Sheets
 * 
 * Takes generated content from OpenAI and stages it in Google Sheets for review
 * Usage: node stage-to-sheets.js --summary=bala_kanda_sarga_2_summary.json --questions=bala_kanda_sarga_2_questions.json
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs').promises;
const path = require('path');
const { GoogleSheetsService } = require('../../dist/services/GoogleSheetsService.js');

class ContentStager {
  constructor() {
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
  }

  async stageContent(summaryFile, questionsFile) {
    console.log('📋 Starting Google Sheets content staging...');
    
    try {
      // Initialize Google Sheets service
      const sheetsService = new GoogleSheetsService();
      
      // Load generated content files
      console.log('📂 Loading generated content files...');
      const summaryPath = path.join(this.summariesDir, summaryFile);
      const questionsPath = path.join(this.questionsDir, questionsFile);
      
      const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
      const questionsData = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
      
      console.log(`✅ Loaded summary: ${summaryData.title}`);
      console.log(`✅ Loaded ${questionsData.questions.length} questions`);
      
      // Convert to format expected by GoogleSheetsService
      const convertedContent = this.convertToSheetsFormat(summaryData, questionsData);
      
      // Stage summary to Google Sheets
      console.log('\\n📥 Staging summary to Google Sheets...');
      await sheetsService.importChapterSummary(convertedContent.summary, convertedContent.generated_at);
      
      // Stage questions to Google Sheets
      console.log('📥 Staging quiz questions to Google Sheets...');
      await sheetsService.importQuizBatch(convertedContent.batch);
      
      console.log('\\n✅ Content successfully staged to Google Sheets!');
      
      // Get sheet statistics
      const stats = await sheetsService.getSheetStats();
      console.log('\\n📊 Google Sheets Statistics:');
      console.log(`   Total Questions: ${stats.totalQuestions}`);
      console.log(`   Needs Review: ${stats.needsReview}`);
      console.log(`   Approved: ${stats.approved}`);
      console.log(`   Rejected: ${stats.rejected}`);
      
      console.log('\\n🔗 Next Steps:');
      console.log('   1. Review content in Google Sheets');
      console.log('   2. Mark questions as "Approved" after review');
      console.log('   3. Run sheets-to-supabase sync process');
      console.log(`   📊 Sheet URL: https://docs.google.com/spreadsheets/d/${process.env.CONTENT_REVIEW_SHEET_ID}`);
      
      return {
        success: true,
        staged: {
          summary: 1,
          questions: questionsData.questions.length
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to stage content:', error.message);
      throw error;
    }
  }

  /**
   * Convert our generated content format to GoogleSheetsService expected format
   */
  convertToSheetsFormat(summaryData, questionsData) {
    // Convert summary format
    const summary = {
      chapter: `${summaryData.kanda}_sarga_${summaryData.sarga}`,
      kanda: summaryData.kanda,
      sarga: summaryData.sarga,
      title: summaryData.title,
      key_events: Array.isArray(summaryData.key_events) 
        ? summaryData.key_events.join('; ') 
        : summaryData.key_events,
      main_characters: Array.isArray(summaryData.main_characters)
        ? summaryData.main_characters.join('; ')
        : summaryData.main_characters,
      themes: Array.isArray(summaryData.themes)
        ? summaryData.themes.join('; ')
        : summaryData.themes,
      cultural_significance: summaryData.cultural_significance,
      narrative_summary: summaryData.narrative_summary,
      source_reference: summaryData.source_url || 'Valmiki Ramayana'
    };

    // Convert questions format
    const questions = questionsData.questions.map(q => ({
      epic_id: questionsData.epic_id,
      chapter_source: `${questionsData.kanda}_sarga_${questionsData.sarga}`,
      category: q.category,
      difficulty: q.difficulty,
      question_text: q.question_text,
      options: q.options,
      correct_answer_id: q.correct_answer_id,
      basic_explanation: q.basic_explanation,
      tags: q.tags || [],
      cultural_context: q.original_quote 
        ? `Sanskrit: ${q.original_quote}\\nTranslation: ${q.quote_translation}`
        : '',
      source_reference: questionsData.source_url || 'Valmiki Ramayana'
    }));

    // Create batch format
    const batch = {
      questions: questions,
      summary: summary,
      generated_at: new Date(questionsData.generation_date)
    };

    return {
      summary: summary,
      batch: batch,
      generated_at: new Date(questionsData.generation_date)
    };
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const summaryArg = args.find(arg => arg.startsWith('--summary='));
  const questionsArg = args.find(arg => arg.startsWith('--questions='));
  
  if (!summaryArg || !questionsArg) {
    console.error('❌ Usage: node stage-to-sheets.js --summary=summary_file.json --questions=questions_file.json');
    console.error('   Example: node stage-to-sheets.js --summary=bala_kanda_sarga_2_summary.json --questions=bala_kanda_sarga_2_questions.json');
    process.exit(1);
  }
  
  const summaryFile = summaryArg.split('=')[1];
  const questionsFile = questionsArg.split('=')[1];
  
  const stager = new ContentStager();
  
  try {
    const result = await stager.stageContent(summaryFile, questionsFile);
    
    console.log('\\n🎉 Content staging completed successfully!');
    console.log(`📊 Staged: ${result.staged.summary} summary + ${result.staged.questions} questions`);
    
  } catch (error) {
    console.error('\\n❌ Content staging failed:', error.message);
    
    if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
      console.error('💡 Make sure CONTENT_REVIEW_SHEET_ID is set in .env file');
    }
    if (error.message.includes('google-credentials.json')) {
      console.error('💡 Make sure google-credentials.json file exists and is properly configured');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = ContentStager;

// Run if called directly
if (require.main === module) {
  main();
}