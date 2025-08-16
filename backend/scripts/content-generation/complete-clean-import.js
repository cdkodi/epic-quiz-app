#!/usr/bin/env node

/**
 * Complete Clean Import Script
 * 
 * Executes a complete clean import of all approved questions and summaries
 * from Google Sheets to Supabase with comprehensive tracking and duplicate prevention.
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class CompleteCleanImport {
  constructor() {
    this.reportsDir = path.join(__dirname, '../../import-reports');
    this.today = new Date().toISOString().split('T')[0];
  }

  async executeCompleteImport(batchName = null, dryRun = false) {
    const startTime = new Date();
    batchName = batchName || `sarga-1-4-clean-import-${this.today}`;
    
    console.log(`🚀 Starting complete clean import...`);
    console.log(`📋 Batch: ${batchName}`);
    console.log(`🔄 Mode: ${dryRun ? 'DRY RUN' : 'ACTUAL IMPORT'}`);
    console.log(`⏰ Start time: ${startTime.toISOString()}\n`);

    try {
      // Ensure reports directory exists
      await fs.mkdir(this.reportsDir, { recursive: true });

      // Phase 1: Initialize services
      console.log('🔧 Phase 1: Initializing services...');
      const services = await this.initializeServices();
      
      // Phase 2: Read all approved content from Google Sheets
      console.log('\n📊 Phase 2: Reading approved content from Google Sheets...');
      const sheetContent = await services.sheets.getAllApprovedContent();
      
      // Phase 3: Pre-import validation and analysis
      console.log('\n🔍 Phase 3: Pre-import validation...');
      await this.validateImportReadiness(sheetContent, services.supabase);
      
      if (dryRun) {
        console.log('\n🔍 DRY RUN - Showing what would be imported:');
        this.displayDryRunResults(sheetContent);
        return;
      }

      // Phase 4: Prepare import batch
      console.log('\n📦 Phase 4: Preparing import batch...');
      const importBatch = this.createImportBatch(batchName, sheetContent);
      
      // Phase 5: Execute clean import
      console.log('\n📥 Phase 5: Executing clean import...');
      const importResults = await services.supabase.executeCleanImport(importBatch);
      
      // Phase 6: Update Google Sheets with import status
      console.log('\n📝 Phase 6: Updating Google Sheets...');
      await this.updateGoogleSheetsStatus(services.sheets, importResults);
      
      // Phase 7: Generate comprehensive report
      console.log('\n📊 Phase 7: Generating import report...');
      const report = await this.generateImportReport(importBatch, importResults, startTime);
      
      // Phase 8: Verification
      console.log('\n✅ Phase 8: Verification...');
      await this.verifyImportSuccess(services.supabase, report);
      
      console.log('\n🎉 Complete clean import finished successfully!');
      this.displayFinalSummary(report);

    } catch (error) {
      console.error('\n❌ Complete clean import failed:', error.message);
      
      // Generate error report
      const errorReport = {
        error: error.message,
        timestamp: new Date().toISOString(),
        batchName,
        phase: 'unknown'
      };
      
      const errorPath = path.join(this.reportsDir, `error-report-${this.today}.json`);
      await fs.writeFile(errorPath, JSON.stringify(errorReport, null, 2));
      
      console.log(`📁 Error report saved: ${errorPath}`);
      throw error;
    }
  }

  async initializeServices() {
    console.log('   🔧 Loading Google Sheets service...');
    const { EnhancedGoogleSheetsService } = require('../../dist/services/EnhancedGoogleSheetsService.js');
    const sheets = new EnhancedGoogleSheetsService();
    
    console.log('   🔧 Loading Safe Supabase service...');
    const { SafeSupabaseService } = require('../../dist/services/SafeSupabaseService.js');
    const supabase = new SafeSupabaseService();
    
    // Test connections
    console.log('   🔗 Testing Supabase connection...');
    const supabaseTest = await supabase.testConnection();
    if (!supabaseTest.success) {
      throw new Error(`Supabase connection failed: ${supabaseTest.message}`);
    }
    
    console.log('   🔗 Adding import tracking columns to Google Sheets...');
    await sheets.addImportTrackingColumns();
    
    console.log('   ✅ Services initialized successfully');
    return { sheets, supabase };
  }

  async validateImportReadiness(sheetContent, supabase) {
    console.log(`   📊 Found: ${sheetContent.questions.length} questions, ${sheetContent.summaries.length} summaries`);
    
    if (sheetContent.questions.length === 0 && sheetContent.summaries.length === 0) {
      throw new Error('No approved content found in Google Sheets');
    }

    // Check for expected Sarga coverage
    const sargas = new Set();
    sheetContent.questions.forEach(q => {
      const sarga = this.extractSargaNumber(q.sargaInfo);
      if (sarga) sargas.add(sarga);
    });
    
    console.log(`   📈 Sarga coverage: ${Array.from(sargas).sort().join(', ')}`);
    
    const expectedSargas = ['1', '2', '3', '4'];
    const missingSargas = expectedSargas.filter(s => !sargas.has(s));
    
    if (missingSargas.length > 0) {
      console.log(`   ⚠️  Missing Sargas: ${missingSargas.join(', ')}`);
    }

    // Validate database is clean
    console.log('   🔍 Checking database state...');
    const stats = await supabase.getStats();
    
    if (stats.questions > 0) {
      console.log(`   ⚠️  Database contains ${stats.questions} existing questions`);
      console.log('   💡 Run cleanup script first: node run-cleanup.js');
    }

    console.log('   ✅ Import readiness validated');
  }

  displayDryRunResults(sheetContent) {
    console.log('\n📋 DRY RUN RESULTS');
    console.log('═══════════════════');
    
    console.log(`\n📝 Questions to import: ${sheetContent.questions.length}`);
    
    // Group by Sarga
    const questionsBySarga = {};
    sheetContent.questions.forEach(q => {
      const sarga = this.extractSargaNumber(q.sargaInfo) || 'Unknown';
      if (!questionsBySarga[sarga]) {
        questionsBySarga[sarga] = { count: 0, difficulties: {}, categories: {} };
      }
      questionsBySarga[sarga].count++;
      
      const diff = q.content.difficulty;
      const cat = q.content.category;
      questionsBySarga[sarga].difficulties[diff] = (questionsBySarga[sarga].difficulties[diff] || 0) + 1;
      questionsBySarga[sarga].categories[cat] = (questionsBySarga[sarga].categories[cat] || 0) + 1;
    });
    
    Object.entries(questionsBySarga).forEach(([sarga, data]) => {
      console.log(`\n   Sarga ${sarga}: ${data.count} questions`);
      console.log(`     Difficulties: ${JSON.stringify(data.difficulties)}`);
      console.log(`     Categories: ${JSON.stringify(data.categories)}`);
    });

    console.log(`\n📑 Summaries to import: ${sheetContent.summaries.length}`);
    sheetContent.summaries.forEach(s => {
      console.log(`   ${s.sheetSummaryId}: ${s.content.title}`);
    });
    
    console.log('\n🔄 To proceed with actual import, run without --dry-run flag');
  }

  createImportBatch(batchName, sheetContent) {
    const batchId = uuidv4();
    
    return {
      id: batchId,
      name: batchName,
      createdAt: new Date(),
      questions: sheetContent.questions,
      summaries: sheetContent.summaries
    };
  }

  async updateGoogleSheetsStatus(sheetsService, importResults) {
    try {
      const questionUpdates = importResults.questions.importedIds.map((supabaseId, index) => {
        const question = importResults.questions.importedIds[index];
        return {
          questionId: question,
          supabaseId,
          status: 'Imported',
          importDate: new Date().toISOString()
        };
      });

      const summaryUpdates = importResults.summaries.importedIds.map((supabaseId, index) => {
        const summary = importResults.summaries.importedIds[index];
        return {
          questionId: summary,
          supabaseId,
          status: 'Imported',
          importDate: new Date().toISOString()
        };
      });

      await sheetsService.markAsImported({
        questions: questionUpdates,
        summaries: summaryUpdates
      });

      console.log('   ✅ Google Sheets import status updated');

    } catch (error) {
      console.error('   ⚠️  Failed to update Google Sheets status:', error.message);
    }
  }

  async generateImportReport(batch, results, startTime) {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    const report = {
      batch: {
        id: batch.id,
        name: batch.name,
        createdAt: batch.createdAt.toISOString()
      },
      timing: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: duration
      },
      results: {
        questions: results.questions,
        summaries: results.summaries,
        overall: results.overall
      },
      statistics: {
        totalProcessed: batch.questions.length + batch.summaries.length,
        totalImported: results.overall.totalImported,
        totalFailed: results.overall.totalFailed,
        successRate: Math.round((results.overall.totalImported / (batch.questions.length + batch.summaries.length)) * 100)
      }
    };

    // Save report
    const reportPath = path.join(this.reportsDir, `import-report-${batch.id}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`   📁 Import report saved: ${reportPath}`);
    return report;
  }

  async verifyImportSuccess(supabase, report) {
    try {
      const stats = await supabase.getImportStats();
      
      console.log('   📊 Database verification:');
      console.log(`      Total questions: ${stats.totalQuestions}`);
      console.log(`      Total summaries: ${stats.totalSummaries}`);
      console.log(`      Import batches: ${stats.importBatches.length}`);
      
      const expectedTotal = report.statistics.totalImported;
      const actualTotal = stats.totalQuestions + stats.totalSummaries;
      
      if (actualTotal >= expectedTotal) {
        console.log('   ✅ Database verification successful');
      } else {
        console.log(`   ⚠️  Database verification warning: expected ${expectedTotal}, found ${actualTotal}`);
      }

    } catch (error) {
      console.error('   ⚠️  Database verification failed:', error.message);
    }
  }

  displayFinalSummary(report) {
    console.log('\n📊 IMPORT SUMMARY');
    console.log('═════════════════');
    console.log(`Batch: ${report.batch.name}`);
    console.log(`Duration: ${report.timing.durationSeconds} seconds`);
    console.log(`Success Rate: ${report.statistics.successRate}%`);
    console.log('');
    console.log(`📝 Questions: ${report.results.questions.imported} imported, ${report.results.questions.failed} failed`);
    console.log(`📑 Summaries: ${report.results.summaries.imported} imported, ${report.results.summaries.failed} failed`);
    console.log(`📊 Total: ${report.statistics.totalImported} imported, ${report.statistics.totalFailed} failed`);
    
    if (report.results.questions.errors.length > 0) {
      console.log(`\n⚠️  Question Errors:`);
      report.results.questions.errors.slice(0, 3).forEach(error => console.log(`   - ${error}`));
      if (report.results.questions.errors.length > 3) {
        console.log(`   ... and ${report.results.questions.errors.length - 3} more`);
      }
    }

    if (report.results.summaries.errors.length > 0) {
      console.log(`\n⚠️  Summary Errors:`);
      report.results.summaries.errors.slice(0, 3).forEach(error => console.log(`   - ${error}`));
      if (report.results.summaries.errors.length > 3) {
        console.log(`   ... and ${report.results.summaries.errors.length - 3} more`);
      }
    }
  }

  extractSargaNumber(sargaInfo) {
    const match = sargaInfo.match(/sarga_?(\d+)/i);
    return match ? match[1] : null;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const batchNameArg = args.find(arg => arg.startsWith('--batch-name='));
  const dryRunFlag = args.includes('--dry-run');
  
  const batchName = batchNameArg ? batchNameArg.split('=')[1] : null;
  
  const importer = new CompleteCleanImport();
  
  try {
    await importer.executeCompleteImport(batchName, dryRunFlag);
    
    if (!dryRunFlag) {
      console.log('\n🔄 Next steps:');
      console.log('   📱 Test mobile app connection');
      console.log('   🔍 Verify quiz generation includes all Sargas');
      console.log('   📊 Update progress documentation');
    }
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure database cleanup was completed');
    console.log('   2. Verify Google Sheets has approved content');
    console.log('   3. Check .env file configuration');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = CompleteCleanImport;

// Run if called directly
if (require.main === module) {
  main();
}