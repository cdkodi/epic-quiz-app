#!/usr/bin/env node

/**
 * Stage Hard Questions Add-On to Google Sheets
 * 
 * Appends hard difficulty questions to existing Google Sheets content
 * Usage: node stage-hard-questions-to-sheets.js --addon=bala_kanda_sarga_2_hard_questions_addon.json
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import the GoogleSheetsService from compiled dist
const { GoogleSheetsService } = require('../../dist/services/GoogleSheetsService.js');

class HardQuestionsSheetsStager {
  constructor() {
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.sheetsService = new GoogleSheetsService();
  }

  async stageHardQuestionsToSheets(addonFilename) {
    console.log('📋 Starting hard questions staging to Google Sheets...');
    
    // Load the hard questions addon
    const addonPath = path.join(this.questionsDir, addonFilename);
    const rawContent = await fs.readFile(addonPath, 'utf8');
    const addonData = JSON.parse(rawContent);
    
    console.log(`🎯 Loaded ${addonData.total_hard_questions} hard questions for ${addonData.kanda} Sarga ${addonData.sarga}`);
    
    // Format questions for Google Sheets
    const formattedQuestions = this.formatQuestionsForSheets(addonData);
    
    // Add questions to existing sheet using the correct method
    console.log('📤 Appending hard questions to Google Sheets...');
    const result = await this.sheetsService.importQuizBatch(formattedQuestions);
    
    console.log('✅ Hard questions successfully staged to Google Sheets!');
    
    // Display staging summary
    await this.displayStagingSummary(addonData, result);
    
    return result;
  }

  formatQuestionsForSheets(addonData) {
    // Match the exact format expected by GoogleSheetsService
    const questions = addonData.questions.map(question => ({
      epic_id: addonData.epic_id,
      chapter_source: `${addonData.kanda}_sarga_${addonData.sarga}`,
      category: question.category,
      difficulty: question.difficulty,
      question_text: question.question_text,
      options: question.options,
      correct_answer_id: question.correct_answer_id,
      basic_explanation: question.basic_explanation,
      tags: question.tags || [],
      cultural_context: question.original_quote 
        ? `Sanskrit: ${question.original_quote}\nTranslation: ${question.quote_translation}`
        : '',
      source_reference: addonData.source_url || 'Valmiki Ramayana'
    }));
    
    // Create batch format that GoogleSheetsService expects
    return {
      questions: questions,
      summary: null, // No summary for addon
      generated_at: new Date(addonData.generation_date)
    };
  }

  async displayStagingSummary(addonData, result) {
    console.log('\n📊 Hard Questions Staging Summary:');
    console.log(`- Epic: ${addonData.epic_id}`);
    console.log(`- Kanda: ${addonData.kanda}`);
    console.log(`- Sarga: ${addonData.sarga}`);
    console.log(`- Hard questions added: ${addonData.total_hard_questions}`);
    console.log(`- Generation method: ${addonData.generator}`);
    console.log(`- Themes covered: ${addonData.questions.length}`);
    
    // Get updated sheet statistics
    try {
      const stats = await this.sheetsService.getSheetStatistics();
      console.log('\n📈 Updated Google Sheets Statistics:');
      console.log(`   Total Questions: ${stats.totalQuestions}`);
      console.log(`   Needs Review: ${stats.needsReview}`);
      console.log(`   Approved: ${stats.approved}`);
      console.log(`   Rejected: ${stats.rejected}`);
      console.log(`   Hard Difficulty: ${stats.hardQuestions || 'N/A'}`);
    } catch (error) {
      console.log('ℹ️  Could not fetch updated statistics');
    }
    
    console.log('\n🔍 Next Steps:');
    console.log('1. Review the hard questions in Google Sheets');
    console.log('2. Verify advanced difficulty and scholarly accuracy');
    console.log('3. Mark questions as "Approved" when ready');
    console.log('4. Run sync to Supabase for approved content');
    
    const sheetsUrl = process.env.CONTENT_REVIEW_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1dh8a4NVHkXcTHfOFESXUxd3xToBnBP01S2nGhp7fvVQ';
    console.log(`\n🔗 Google Sheets URL: ${sheetsUrl}`);
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const addonArg = args.find(arg => arg.startsWith('--addon='));
  
  if (!addonArg) {
    console.error('❌ Usage: node stage-hard-questions-to-sheets.js --addon=bala_kanda_sarga_2_hard_questions_addon.json');
    console.error('   Appends hard difficulty questions to existing Google Sheets content');
    process.exit(1);
  }
  
  const addonFilename = addonArg.split('=')[1];
  
  const stager = new HardQuestionsSheetsStager();
  
  try {
    await stager.stageHardQuestionsToSheets(addonFilename);
    
  } catch (error) {
    console.error('\n❌ Hard questions staging failed:', error.message);
    
    if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
      console.error('💡 Make sure CONTENT_REVIEW_SHEET_ID is set in your .env file');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = HardQuestionsSheetsStager;

// Run if called directly
if (require.main === module) {
  main();
}