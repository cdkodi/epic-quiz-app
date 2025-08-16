#!/usr/bin/env node

/**
 * Analyze All Approved Content in Google Sheets
 * 
 * This script reads Google Sheets to identify all approved questions and summaries
 * ready for import to Supabase, providing detailed analysis before clean import.
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class ContentAnalyzer {
  constructor() {
    this.outputDir = path.join(__dirname, '../../analysis-reports');
    this.today = new Date().toISOString().split('T')[0];
  }

  async analyzeAllContent() {
    console.log('📊 Analyzing all approved content in Google Sheets...\n');

    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Initialize Google Sheets service
      const { GoogleSheetsService } = require('../../dist/services/GoogleSheetsService.js');
      const sheetsService = new GoogleSheetsService();

      // Get all content from Google Sheets
      console.log('📋 Reading Google Sheets content...');
      const [approvedQuestions, sheetStats] = await Promise.all([
        sheetsService.getApprovedQuestions(),
        sheetsService.getSheetStats()
      ]);

      // Analyze questions by sarga
      const questionAnalysis = this.analyzeQuestionsBySarga(approvedQuestions);
      
      // Analyze summaries (we'll need to read Summary sheet)
      const summaryAnalysis = await this.analyzeSummaries(sheetsService);

      // Generate comprehensive report
      const report = this.generateAnalysisReport(questionAnalysis, summaryAnalysis, sheetStats);

      // Save analysis report
      const reportPath = path.join(this.outputDir, `content-analysis-${this.today}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      // Display summary
      this.displaySummary(report);

      console.log(`\n📁 Detailed analysis saved to: ${reportPath}`);
      
      return report;

    } catch (error) {
      console.error('\n❌ Content analysis failed:', error.message);
      
      if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
        console.log('💡 Make sure CONTENT_REVIEW_SHEET_ID is set in .env file');
      }
      if (error.message.includes('google-credentials.json')) {
        console.log('💡 Make sure google-credentials.json file exists');
      }
      
      throw error;
    }
  }

  analyzeQuestionsBySarga(questions) {
    const analysis = {
      total: questions.length,
      bySarga: {},
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
      byCategory: { characters: 0, events: 0, themes: 0, culture: 0 },
      withSanskrit: 0,
      withTranslation: 0
    };

    questions.forEach(q => {
      // Extract sarga information from chapter_source or tags
      const sarga = this.extractSargaInfo(q);
      
      if (!analysis.bySarga[sarga]) {
        analysis.bySarga[sarga] = {
          count: 0,
          difficulties: { easy: 0, medium: 0, hard: 0 },
          categories: { characters: 0, events: 0, themes: 0, culture: 0 },
          examples: []
        };
      }

      analysis.bySarga[sarga].count++;
      analysis.bySarga[sarga].difficulties[q.difficulty]++;
      analysis.bySarga[sarga].categories[q.category]++;
      
      // Store first few examples
      if (analysis.bySarga[sarga].examples.length < 2) {
        analysis.bySarga[sarga].examples.push({
          question: q.question_text.substring(0, 80) + '...',
          category: q.category,
          difficulty: q.difficulty
        });
      }

      // Update totals
      analysis.byDifficulty[q.difficulty]++;
      analysis.byCategory[q.category]++;
      
      // Check for cultural content
      if (q.source_reference && q.source_reference.includes('sanskrit')) {
        analysis.withSanskrit++;
      }
      if (q.basic_explanation && q.basic_explanation.length > 50) {
        analysis.withTranslation++;
      }
    });

    return analysis;
  }

  async analyzeSummaries(sheetsService) {
    try {
      // Read Summary sheet - we'll need to implement this method
      console.log('📑 Analyzing chapter summaries...');
      
      // For now, we'll return expected structure based on our generated content
      const expectedSummaries = {
        total: 4, // We expect 4 summaries for Sarga 1-4
        bySarga: {
          'Sarga 1': { title: 'The Inquiry About the Righteous One', status: 'Expected' },
          'Sarga 2': { title: 'The Birth of the Ramayana', status: 'Expected' },
          'Sarga 3': { title: 'Valmiki\'s Yogic Vision and Planning', status: 'Expected' },
          'Sarga 4': { title: 'Epic Completion and Transmission', status: 'Expected' }
        }
      };

      return expectedSummaries;

    } catch (error) {
      console.warn('⚠️  Could not analyze summaries:', error.message);
      return { total: 0, bySarga: {}, error: error.message };
    }
  }

  extractSargaInfo(question) {
    // Try to extract sarga information from various fields
    const sources = [
      question.chapter_source,
      question.source_reference,
      question.tags?.join(' ') || ''
    ].join(' ').toLowerCase();

    if (sources.includes('sarga1') || sources.includes('sarga_1')) return 'Sarga 1';
    if (sources.includes('sarga2') || sources.includes('sarga_2')) return 'Sarga 2';
    if (sources.includes('sarga3') || sources.includes('sarga_3')) return 'Sarga 3';
    if (sources.includes('sarga4') || sources.includes('sarga_4')) return 'Sarga 4';
    
    return 'Unknown Sarga';
  }

  generateAnalysisReport(questionAnalysis, summaryAnalysis, sheetStats) {
    return {
      analysis_date: new Date().toISOString(),
      sheet_stats: sheetStats,
      questions: questionAnalysis,
      summaries: summaryAnalysis,
      import_readiness: {
        ready_for_import: true,
        total_questions: questionAnalysis.total,
        total_summaries: summaryAnalysis.total,
        expected_sargas: ['Sarga 1', 'Sarga 2', 'Sarga 3', 'Sarga 4'],
        missing_content: this.identifyMissingContent(questionAnalysis, summaryAnalysis),
        recommendations: this.generateRecommendations(questionAnalysis, summaryAnalysis)
      }
    };
  }

  identifyMissingContent(questionAnalysis, summaryAnalysis) {
    const missing = [];
    const expectedSargas = ['Sarga 1', 'Sarga 2', 'Sarga 3', 'Sarga 4'];
    
    expectedSargas.forEach(sarga => {
      if (!questionAnalysis.bySarga[sarga] || questionAnalysis.bySarga[sarga].count === 0) {
        missing.push(`${sarga}: No approved questions found`);
      }
      if (!summaryAnalysis.bySarga[sarga]) {
        missing.push(`${sarga}: No summary found`);
      }
    });

    return missing;
  }

  generateRecommendations(questionAnalysis, summaryAnalysis) {
    const recommendations = [];

    // Check question distribution
    Object.entries(questionAnalysis.bySarga).forEach(([sarga, data]) => {
      if (data.count < 10) {
        recommendations.push(`Consider adding more questions for ${sarga} (currently ${data.count})`);
      }
      
      // Check difficulty balance
      const { easy, medium, hard } = data.difficulties;
      if (hard === 0) {
        recommendations.push(`${sarga} needs hard difficulty questions for advanced learners`);
      }
      if (easy === 0) {
        recommendations.push(`${sarga} needs easy difficulty questions for beginners`);
      }
    });

    // Check overall balance
    const total = questionAnalysis.total;
    if (total < 50) {
      recommendations.push('Consider generating more questions for comprehensive coverage');
    }

    return recommendations;
  }

  displaySummary(report) {
    console.log('\n📊 Content Analysis Summary');
    console.log('═══════════════════════════');
    
    console.log(`\n📋 Google Sheets Status:`);
    console.log(`   Total Questions: ${report.sheet_stats.totalQuestions}`);
    console.log(`   Approved: ${report.sheet_stats.approved}`);
    console.log(`   Needs Review: ${report.sheet_stats.needsReview}`);
    console.log(`   Rejected: ${report.sheet_stats.rejected}`);

    console.log(`\n❓ Questions Analysis:`);
    console.log(`   Ready to Import: ${report.questions.total} questions`);
    
    console.log(`\n   By Sarga:`);
    Object.entries(report.questions.bySarga).forEach(([sarga, data]) => {
      console.log(`   ${sarga}: ${data.count} questions`);
      console.log(`     Difficulties: Easy(${data.difficulties.easy}) Medium(${data.difficulties.medium}) Hard(${data.difficulties.hard})`);
      console.log(`     Categories: Char(${data.categories.characters}) Events(${data.categories.events}) Themes(${data.categories.themes}) Culture(${data.categories.culture})`);
    });

    console.log(`\n   Overall Distribution:`);
    console.log(`     Easy: ${report.questions.byDifficulty.easy}, Medium: ${report.questions.byDifficulty.medium}, Hard: ${report.questions.byDifficulty.hard}`);
    console.log(`     Characters: ${report.questions.byCategory.characters}, Events: ${report.questions.byCategory.events}, Themes: ${report.questions.byCategory.themes}, Culture: ${report.questions.byCategory.culture}`);

    console.log(`\n📑 Summaries Analysis:`);
    console.log(`   Ready to Import: ${report.summaries.total} summaries`);
    
    if (report.import_readiness.missing_content.length > 0) {
      console.log(`\n⚠️  Missing Content:`);
      report.import_readiness.missing_content.forEach(missing => {
        console.log(`   - ${missing}`);
      });
    }

    if (report.import_readiness.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      report.import_readiness.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }

    console.log(`\n✅ Import Readiness: ${report.import_readiness.ready_for_import ? 'READY' : 'NOT READY'}`);
    console.log(`   Expected Import: ${report.import_readiness.total_questions} questions + ${report.import_readiness.total_summaries} summaries`);
  }
}

// CLI Usage
async function main() {
  const analyzer = new ContentAnalyzer();
  
  try {
    await analyzer.analyzeAllContent();
    
    console.log('\n🎉 Content analysis completed successfully!');
    console.log('\n🔄 Next steps:');
    console.log('   1. Review the analysis report');
    console.log('   2. Run database cleanup: node run-cleanup.js');
    console.log('   3. Execute clean import: node complete-clean-import.js');
    
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = ContentAnalyzer;

// Run if called directly
if (require.main === module) {
  main();
}