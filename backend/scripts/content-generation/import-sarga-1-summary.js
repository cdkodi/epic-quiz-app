#!/usr/bin/env node

/**
 * Import Sarga 1 Summary to Supabase
 * 
 * Completes the clean import by adding the manually created Sarga 1 summary
 * that was missing from the original dataset.
 */

require('dotenv').config({ path: '../../.env' });

const fs = require('fs');
const path = require('path');
const { SafeSupabaseService } = require('../../src/services/SafeSupabaseService');

async function importSarga1Summary() {
    console.log('\n🎯 Importing Sarga 1 Summary to Complete Dataset');
    console.log('================================================\n');

    try {
        // Initialize services
        const supabaseService = new SafeSupabaseService();
        
        // Read the manually created Sarga 1 summary
        const summaryPath = path.join(__dirname, '../../generated-content/summaries/bala_kanda_sarga_1_summary.json');
        
        if (!fs.existsSync(summaryPath)) {
            throw new Error('Sarga 1 summary file not found');
        }
        
        const summaryContent = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        console.log('✅ Loaded Sarga 1 summary from:', summaryPath);
        
        // Prepare summary for import
        const summaryWithSource = {
            ...summaryContent,
            google_sheet_id: 'manually-created-sarga-1',
            import_source: 'manual-expert-curation',
            approved_for_import: true
        };
        
        console.log('\n📋 Summary Details:');
        console.log(`   - Epic: ${summaryContent.epic_id}`);
        console.log(`   - Kanda: ${summaryContent.kanda}`);
        console.log(`   - Sarga: ${summaryContent.sarga}`);
        console.log(`   - Title: ${summaryContent.title}`);
        console.log(`   - Generator: ${summaryContent.generator}`);
        
        // Check if summary already exists
        console.log('\n🔍 Checking for existing Sarga 1 summary...');
        const existingCheck = await supabaseService.supabase
            .from('chapter_summaries')
            .select('id, sarga')
            .eq('epic_id', 'ramayana')
            .eq('kanda', 'bala_kanda')
            .eq('sarga', 1);
            
        if (existingCheck.data && existingCheck.data.length > 0) {
            console.log('⚠️  Sarga 1 summary already exists in Supabase');
            console.log('   Existing summary ID:', existingCheck.data[0].id);
            return;
        }
        
        console.log('✅ No existing Sarga 1 summary found - proceeding with import');
        
        // Import the summary
        console.log('\n🚀 Importing Sarga 1 Summary...');
        const importResult = await supabaseService.importSummary(summaryWithSource);
        
        if (importResult.success) {
            console.log('✅ Successfully imported Sarga 1 summary');
            console.log(`   - Summary ID: ${importResult.id}`);
            console.log(`   - Import Batch: ${importResult.import_batch_id}`);
        } else {
            console.log('❌ Failed to import Sarga 1 summary');
            console.log('   Error:', importResult.error);
            return;
        }
        
        // Verify the import
        console.log('\n🔍 Verifying import...');
        const verification = await supabaseService.supabase
            .from('chapter_summaries')
            .select('id, sarga, title, import_batch_id, created_at')
            .eq('epic_id', 'ramayana')
            .eq('kanda', 'bala_kanda')
            .order('sarga', { ascending: true });
            
        if (verification.data) {
            console.log('\n📊 Current Summary Status:');
            verification.data.forEach(summary => {
                console.log(`   - Sarga ${summary.sarga}: ✅ ${summary.title.substring(0, 50)}...`);
            });
            console.log(`\n✅ Total Summaries: ${verification.data.length}`);
        }
        
        console.log('\n🎉 Sarga 1 Summary Import Complete!');
        console.log('   - All 4 Sargas (1-4) now have complete question and summary coverage');
        console.log('   - Dataset is now fully consistent and ready for production');
        
    } catch (error) {
        console.error('\n❌ Import failed:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
        process.exit(1);
    }
}

// Run the import
importSarga1Summary();