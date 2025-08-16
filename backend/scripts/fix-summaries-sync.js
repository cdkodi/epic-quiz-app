#!/usr/bin/env node

/**
 * Fix Summaries Sync Script
 * 
 * 1. Fixes corrupted Google Sheets Summary tab
 * 2. Imports all missing chapter summaries to both Google Sheets and Supabase
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { GoogleSheetsService } = require('../dist/services/GoogleSheetsService.js');
const { SupabaseService } = require('../dist/services/SupabaseService.js');

class SummariesSyncFixer {
  constructor() {
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
    this.sheetsService = new GoogleSheetsService();
    this.supabaseService = new SupabaseService();
  }

  async fixSummariesSync() {
    console.log('🔧 Starting summaries sync fix process...\n');

    try {
      // Step 1: Fix Google Sheets Summary tab
      console.log('📋 Step 1: Fixing Google Sheets Summary tab...');
      await this.sheetsService.setupSummarySheet();
      console.log('✅ Summary sheet headers fixed\n');

      // Step 2: Get all summary files
      console.log('📂 Step 2: Loading all summary files...');
      const summaryFiles = await this.getAllSummaryFiles();
      console.log(`✅ Found ${summaryFiles.length} summary files\n`);

      // Step 3: Import summaries to Google Sheets
      console.log('📥 Step 3: Importing summaries to Google Sheets...');
      const sheetsImportResults = await this.importSummariesToSheets(summaryFiles);
      console.log(`✅ Imported ${sheetsImportResults.success} summaries to Google Sheets\n`);

      // Step 4: Import summaries to Supabase
      console.log('📥 Step 4: Importing summaries to Supabase...');
      const supabaseImportResults = await this.importSummariesToSupabase(summaryFiles);
      console.log(`✅ Imported ${supabaseImportResults.success} summaries to Supabase\n`);

      // Step 5: Verification
      console.log('🔍 Step 5: Verifying sync results...');
      await this.verifySyncResults();

      console.log('\n🎉 Summaries sync fix completed successfully!');

    } catch (error) {
      console.error('❌ Summaries sync fix failed:', error.message);
      throw error;
    }
  }

  async getAllSummaryFiles() {
    const files = await fs.readdir(this.summariesDir);
    const summaryFiles = files.filter(file => file.endsWith('_summary.json'));
    
    const summaries = [];
    for (const file of summaryFiles) {
      const filePath = path.join(this.summariesDir, file);
      const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
      summaries.push({
        filename: file,
        content: content
      });
    }

    // Sort by sarga for proper order
    summaries.sort((a, b) => a.content.sarga - b.content.sarga);
    return summaries;
  }

  async importSummariesToSheets(summaryFiles) {
    let successCount = 0;
    const errors = [];

    for (const summaryFile of summaryFiles) {
      try {
        const summary = this.convertToSheetsFormat(summaryFile.content);
        await this.sheetsService.importChapterSummary(summary, new Date());
        successCount++;
        console.log(`   ✅ Imported ${summaryFile.content.kanda} Sarga ${summaryFile.content.sarga}`);
      } catch (error) {
        errors.push(`${summaryFile.filename}: ${error.message}`);
        console.log(`   ❌ Failed ${summaryFile.filename}: ${error.message}`);
      }
    }

    return { success: successCount, errors };
  }

  async importSummariesToSupabase(summaryFiles) {
    let successCount = 0;
    const errors = [];

    for (const summaryFile of summaryFiles) {
      try {
        const summary = this.convertToSupabaseFormat(summaryFile.content);
        
        // Check if summary already exists
        const existing = await this.supabaseService.getChapterSummary(
          'ramayana', 
          summaryFile.content.kanda, 
          summaryFile.content.sarga
        );

        if (existing.success && existing.summary) {
          console.log(`   ⚠️  Skipping ${summaryFile.content.kanda} Sarga ${summaryFile.content.sarga} - already exists`);
          continue;
        }

        // Import new summary
        const result = await this.supabaseService.importChapterSummary(summary);
        if (result.success) {
          successCount++;
          console.log(`   ✅ Imported ${summaryFile.content.kanda} Sarga ${summaryFile.content.sarga}`);
        } else {
          errors.push(`${summaryFile.filename}: ${result.error}`);
          console.log(`   ❌ Failed ${summaryFile.filename}: ${result.error}`);
        }
      } catch (error) {
        errors.push(`${summaryFile.filename}: ${error.message}`);
        console.log(`   ❌ Failed ${summaryFile.filename}: ${error.message}`);
      }
    }

    return { success: successCount, errors };
  }

  convertToSheetsFormat(summaryData) {
    return {
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
  }

  convertToSupabaseFormat(summaryData) {
    return {
      epic_id: 'ramayana',
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
  }

  async verifySyncResults() {
    try {
      // Check Supabase summaries count
      const supabaseStats = await this.supabaseService.getStats();
      console.log(`   📊 Supabase: ${supabaseStats.summaries} chapter summaries`);

      // Check Google Sheets (basic verification)
      console.log('   📊 Google Sheets: Summary tab setup with proper headers');

      // Show Sarga distribution
      const stats = await this.getDetailedSummaryStats();
      console.log('   📈 Summary distribution by Sarga:');
      stats.forEach(stat => {
        console.log(`      ${stat.kanda} Sarga ${stat.sarga}: ${stat.title}`);
      });

    } catch (error) {
      console.error('   ⚠️  Verification failed:', error.message);
    }
  }

  async getDetailedSummaryStats() {
    // Get summaries from Supabase for verification
    try {
      const result = await this.supabaseService.executeQuery(`
        SELECT kanda, sarga, title
        FROM chapter_summaries 
        WHERE epic_id = 'ramayana'
        ORDER BY kanda, sarga
      `);
      
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to get summary stats:', error.message);
      return [];
    }
  }
}

// CLI Usage
async function main() {
  try {
    const fixer = new SummariesSyncFixer();
    await fixer.fixSummariesSync();
  } catch (error) {
    console.error('\n❌ Summaries sync fix failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}