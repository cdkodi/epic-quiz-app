#!/usr/bin/env node

/**
 * Validate Import Success Script
 * 
 * Tests that the imported content is accessible and functional
 * for the mobile app and API.
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class ImportValidator {
  constructor() {
    this.reportPath = path.join(__dirname, '../../import-reports/validation-report.json');
  }

  async validateImportSuccess() {
    console.log('🔍 Validating import success...\n');

    try {
      // Initialize Supabase service
      const { SafeSupabaseService } = require('../../dist/services/SafeSupabaseService.js');
      const supabase = new SafeSupabaseService();

      // Test 1: Database connection
      console.log('🔗 Test 1: Database connection...');
      const connectionTest = await supabase.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Database connection failed: ${connectionTest.message}`);
      }
      console.log('   ✅ Database connection successful\n');

      // Test 2: Import statistics
      console.log('📊 Test 2: Import statistics...');
      const stats = await supabase.getImportStats();
      console.log(`   📝 Total questions: ${stats.totalQuestions}`);
      console.log(`   📑 Total summaries: ${stats.totalSummaries}`);
      console.log(`   📦 Import batches: ${stats.importBatches.length}`);
      console.log('   ✅ Statistics retrieved successfully\n');

      // Test 3: Question retrieval
      console.log('❓ Test 3: Question retrieval...');
      const questionsResult = await supabase.getQuizQuestions('ramayana', 10);
      if (!questionsResult.success) {
        throw new Error(`Question retrieval failed: ${questionsResult.error}`);
      }
      console.log(`   📝 Retrieved ${questionsResult.questions.length} questions`);
      
      if (questionsResult.questions.length > 0) {
        const sample = questionsResult.questions[0];
        console.log(`   📋 Sample question: "${sample.question_text.substring(0, 60)}..."`);
        console.log(`   🏷️  Category: ${sample.category}, Difficulty: ${sample.difficulty}`);
        console.log(`   📊 Options: ${sample.options.length}, Correct: ${sample.correct_answer_id}`);
        console.log(`   🏷️  Tags: ${sample.tags.length}, Source: ${sample.sheet_question_id || 'N/A'}`);
      }
      console.log('   ✅ Question retrieval successful\n');

      // Test 4: Summary retrieval
      console.log('📑 Test 4: Summary retrieval...');
      const summaryResult = await supabase.getChapterSummary('bala_kanda', 2);
      if (summaryResult.success && summaryResult.summary) {
        console.log(`   📖 Summary title: "${summaryResult.summary.title}"`);
        console.log(`   📋 Key events: ${summaryResult.summary.key_events.substring(0, 80)}...`);
        console.log(`   👥 Characters: ${summaryResult.summary.main_characters.substring(0, 60)}...`);
        console.log('   ✅ Summary retrieval successful\n');
      } else {
        console.log('   ⚠️  No summary found for Sarga 2\n');
      }

      // Test 5: Sarga distribution analysis
      console.log('📊 Test 5: Sarga distribution analysis...');
      const allQuestions = await supabase.getQuizQuestions('ramayana', 100);
      if (allQuestions.success) {
        const distribution = this.analyzeSargaDistribution(allQuestions.questions);
        console.log('   📈 Questions by Sarga:');
        Object.entries(distribution.bySarga).forEach(([sarga, count]) => {
          console.log(`      ${sarga}: ${count} questions`);
        });
        console.log('   📊 Difficulty distribution:');
        Object.entries(distribution.byDifficulty).forEach(([difficulty, count]) => {
          console.log(`      ${difficulty}: ${count} questions`);
        });
        console.log('   ✅ Distribution analysis completed\n');
      }

      // Generate validation report
      const report = {
        validationDate: new Date().toISOString(),
        status: 'SUCCESS',
        tests: {
          databaseConnection: true,
          importStats: stats,
          questionRetrieval: questionsResult.questions.length,
          summaryRetrieval: summaryResult.success,
          distribution: allQuestions.success ? this.analyzeSargaDistribution(allQuestions.questions) : null
        },
        recommendations: this.generateRecommendations(stats, questionsResult, summaryResult)
      };

      // Save report
      await fs.writeFile(this.reportPath, JSON.stringify(report, null, 2));
      console.log(`📁 Validation report saved: ${this.reportPath}`);

      // Display final summary
      this.displayValidationSummary(report);

      console.log('\n🎉 Import validation completed successfully!');
      return report;

    } catch (error) {
      console.error('\n❌ Import validation failed:', error.message);
      
      const errorReport = {
        validationDate: new Date().toISOString(),
        status: 'FAILED',
        error: error.message,
        tests: {
          databaseConnection: false
        }
      };

      await fs.writeFile(this.reportPath, JSON.stringify(errorReport, null, 2));
      throw error;
    }
  }

  analyzeSargaDistribution(questions) {
    const distribution = {
      bySarga: {},
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
      byCategory: { characters: 0, events: 0, themes: 0, culture: 0 }
    };

    questions.forEach(q => {
      // Extract Sarga from sheet_question_id or source_reference
      const sarga = this.extractSargaInfo(q);
      
      distribution.bySarga[sarga] = (distribution.bySarga[sarga] || 0) + 1;
      distribution.byDifficulty[q.difficulty]++;
      distribution.byCategory[q.category]++;
    });

    return distribution;
  }

  extractSargaInfo(question) {
    const sources = [
      question.sheet_question_id || '',
      question.source_reference || ''
    ].join(' ').toLowerCase();

    if (sources.includes('sarga_1') || sources.includes('bala_1')) return 'Sarga 1';
    if (sources.includes('sarga_2')) return 'Sarga 2';
    if (sources.includes('sarga_3')) return 'Sarga 3';
    if (sources.includes('sarga_4')) return 'Sarga 4';
    
    return 'Other';
  }

  generateRecommendations(stats, questionsResult, summaryResult) {
    const recommendations = [];

    if (stats.totalQuestions < 40) {
      recommendations.push('Consider adding more questions for comprehensive coverage');
    }

    if (stats.totalSummaries < 4) {
      recommendations.push('Missing summaries for some Sargas - check import process');
    }

    if (questionsResult.questions.length === 0) {
      recommendations.push('No questions retrievable - check database setup');
    }

    if (!summaryResult.success) {
      recommendations.push('Summary retrieval failed - verify summary import');
    }

    if (recommendations.length === 0) {
      recommendations.push('All tests passed - system ready for production');
    }

    return recommendations;
  }

  displayValidationSummary(report) {
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('═════════════════════');
    console.log(`Status: ${report.status}`);
    console.log(`Questions Available: ${report.tests.questionRetrieval}`);
    console.log(`Summaries Available: ${report.tests.summaryRetrieval ? 'YES' : 'NO'}`);
    console.log(`Total Database Questions: ${report.tests.importStats.totalQuestions}`);
    console.log(`Total Database Summaries: ${report.tests.importStats.totalSummaries}`);
    
    if (report.tests.distribution) {
      console.log('\nContent Distribution:');
      Object.entries(report.tests.distribution.bySarga).forEach(([sarga, count]) => {
        console.log(`  ${sarga}: ${count} questions`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
  }
}

// CLI Usage
async function main() {
  const validator = new ImportValidator();
  
  try {
    await validator.validateImportSuccess();
    
    console.log('\n🔄 Next steps:');
    console.log('   📱 Test mobile app connection');
    console.log('   🎮 Test quiz generation in mobile app');
    console.log('   📖 Test deep-dive content loading');
    console.log('   📊 Update progress documentation');
    
  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Supabase connection settings');
    console.log('   2. Verify import completed successfully');
    console.log('   3. Check .env file configuration');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = ImportValidator;

// Run if called directly
if (require.main === module) {
  main();
}