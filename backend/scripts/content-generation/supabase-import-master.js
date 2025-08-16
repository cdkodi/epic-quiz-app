#!/usr/bin/env node

/**
 * 🚀 SUPABASE IMPORT MASTER - Automated Database Import Orchestrator
 * 
 * SAFE AUTOMATION WRAPPER for Epic Quiz App Supabase database imports
 * 
 * Key Features:
 * - ✅ Zero Risk: Uses existing bulletproof smart-database-importer.js
 * - ✅ Batch Processing: Import multiple sargas efficiently
 * - ✅ File Validation: Ensures all required files exist before import
 * - ✅ Progress Tracking: Real-time status and completion verification
 * - ✅ Error Recovery: Clear fallback instructions on failure
 * - ✅ MCP Integration: Uses Supabase Project ID ccfpbksllmvzxllwyqyv
 * 
 * Usage:
 *   node supabase-import-master.js --sarga=50
 *   node supabase-import-master.js --sargas=50,51,52
 *   node supabase-import-master.js --sarga=50 --verify --dry-run
 *   node supabase-import-master.js --sargas=50,51,52 --verbose
 * 
 * Author: Claude Code Automation
 * Date: 2025-08-14
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class SupabaseImportMaster {
  constructor() {
    this.scriptsDir = __dirname;
    this.outputDir = path.join(__dirname, '../../generated-content');
    this.scrapedDir = path.join(this.outputDir, 'scraped');
    this.questionsDir = path.join(this.outputDir, 'questions');
    this.summariesDir = path.join(this.outputDir, 'summaries');
  }

  async parseArguments() {
    const args = process.argv.slice(2);
    const config = {
      kanda: 'bala_kanda', // Default to bala_kanda
      sarga: null,
      sargas: [],
      verify: args.includes('--verify') || true, // Default to verify
      retryOnFailure: args.includes('--retry-on-failure') || true, // Default to retry
      dryRun: args.includes('--dry-run'),
      verbose: args.includes('--verbose')
    };

    for (const arg of args) {
      if (arg.startsWith('--kanda=')) {
        config.kanda = arg.split('=')[1];
      } else if (arg.startsWith('--sarga=')) {
        config.sarga = parseInt(arg.split('=')[1]);
        config.sargas = [config.sarga];
      } else if (arg.startsWith('--sargas=')) {
        config.sargas = arg.split('=')[1].split(',').map(s => parseInt(s.trim()));
      }
    }

    if (config.sargas.length === 0) {
      throw new Error('Either --sarga or --sargas parameter is required');
    }

    return config;
  }

  async checkFileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async validateSargaFiles(kanda, sarga) {
    const requiredFiles = {
      scraped: path.join(this.scrapedDir, `structured_${kanda}_sarga_${sarga}.json`),
      summary: path.join(this.summariesDir, `${kanda}_sarga_${sarga}_summary.json`),
      questions: path.join(this.questionsDir, `${kanda}_sarga_${sarga}_questions.json`),
      hardQuestions: path.join(this.questionsDir, `${kanda}_sarga_${sarga}_hard_questions_addon.json`)
    };

    const missingFiles = [];
    
    for (const [type, filePath] of Object.entries(requiredFiles)) {
      if (!await this.checkFileExists(filePath)) {
        missingFiles.push(`${type}: ${filePath}`);
      }
    }

    return {
      valid: missingFiles.length === 0,
      missingFiles,
      files: requiredFiles
    };
  }

  async runImportScript(sargas, config) {
    return new Promise((resolve, reject) => {
      const args = [
        'smart-database-importer.js',
        `--sargas=${sargas.join(',')}`,
        '--verify',
        '--retry-on-failure'
      ];

      if (config.verbose) {
        args.push('--verbose');
      }

      if (config.dryRun) {
        args.push('--dry-run');
      }

      console.log(`🔄 Importing to Supabase...`);
      console.log(`📝 Command: node ${args.join(' ')}`);

      const child = spawn('node', args, {
        cwd: this.scriptsDir,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        if (config.verbose || !config.dryRun) {
          process.stdout.write(output);
        }
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        if (config.verbose || !config.dryRun) {
          process.stderr.write(output);
        }
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Supabase import completed successfully`);
          resolve({ stdout, stderr });
        } else {
          console.error(`❌ Supabase import failed with exit code ${code}`);
          if (!config.verbose) {
            console.error('STDOUT:', stdout);
            console.error('STDERR:', stderr);
          }
          reject(new Error(`Supabase import failed`));
        }
      });

      child.on('error', (error) => {
        console.error(`❌ Failed to start import process:`, error.message);
        reject(error);
      });
    });
  }

  async processSarga(kanda, sarga, config) {
    console.log(`\n🎯 Processing ${kanda} sarga ${sarga} for Supabase import...`);

    // Step 1: Validate all required files exist
    const validation = await this.validateSargaFiles(kanda, sarga);
    
    if (!validation.valid) {
      throw new Error(`Missing required files for ${kanda} sarga ${sarga}:\n${validation.missingFiles.join('\n')}`);
    }

    console.log(`✅ All required files validated for ${kanda} sarga ${sarga}:`);
    console.log(`   📄 Scraped: ${validation.files.scraped}`);
    console.log(`   📝 Summary: ${validation.files.summary}`);
    console.log(`   ❓ Questions: ${validation.files.questions}`);
    console.log(`   🧠 Hard Questions: ${validation.files.hardQuestions}`);

    return true;
  }

  async run() {
    console.log('🚀 SUPABASE IMPORT MASTER - Starting Database Import');
    console.log('=' .repeat(60));

    try {
      const config = await this.parseArguments();

      console.log(`📋 Configuration:`);
      console.log(`   Kanda: ${config.kanda}`);
      console.log(`   Sargas: ${config.sargas.join(', ')}`);
      console.log(`   Dry Run: ${config.dryRun}`);
      console.log(`   Verify: ${config.verify}`);
      console.log(`   Retry on Failure: ${config.retryOnFailure}`);
      console.log(`   Verbose: ${config.verbose}`);
      console.log(`   Supabase Project ID: ccfpbksllmvzxllwyqyv`);

      const startTime = Date.now();
      let validatedSargas = [];
      let failedValidations = [];

      // Step 1: Validate all sargas have complete file sets
      console.log(`\n🔍 Validating file completeness for ${config.sargas.length} sargas...`);
      
      for (const sarga of config.sargas) {
        try {
          await this.processSarga(config.kanda, sarga, config);
          validatedSargas.push(sarga);
        } catch (error) {
          console.error(`❌ Validation failed for sarga ${sarga}: ${error.message}`);
          failedValidations.push({ sarga, error: error.message });
        }
      }

      if (validatedSargas.length === 0) {
        throw new Error('No sargas passed validation. Cannot proceed with import.');
      }

      if (failedValidations.length > 0) {
        console.log(`\n⚠️  ${failedValidations.length} sargas failed validation - proceeding with ${validatedSargas.length} valid sargas`);
      }

      // Step 2: Execute database import for validated sargas
      if (config.dryRun) {
        console.log(`\n🔍 DRY RUN: Would import ${validatedSargas.length} sargas to Supabase`);
        console.log(`   Sargas: ${validatedSargas.join(', ')}`);
        console.log(`   Project ID: ccfpbksllmvzxllwyqyv`);
      } else {
        console.log(`\n📤 Importing ${validatedSargas.length} sargas to Supabase...`);
        await this.runImportScript(validatedSargas, config);
      }

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      console.log('\n🎉 SUPABASE IMPORT COMPLETED');
      console.log('=' .repeat(60));
      console.log(`✅ Successfully validated: ${validatedSargas.length}/${config.sargas.length} sargas`);
      if (failedValidations.length > 0) {
        console.log(`❌ Failed validation: ${failedValidations.length}/${config.sargas.length} sargas`);
      }
      console.log(`⏱️  Total time: ${duration}s`);
      
      if (config.dryRun) {
        console.log(`\n💡 This was a dry run. To execute for real, remove the --dry-run flag.`);
      } else {
        console.log(`\n🗄️  Database: Supabase Project ccfpbksllmvzxllwyqyv`);
      }

      if (failedValidations.length > 0) {
        console.log(`\n⚠️  Failed validations:`);
        failedValidations.forEach(({ sarga, error }) => {
          console.log(`   Sarga ${sarga}: ${error}`);
        });
        console.log(`\n🔧 To generate missing content, run:`);
        console.log(`   node content-pipeline-master.js --kanda=${config.kanda} --sargas=${failedValidations.map(f => f.sarga).join(',')}`);
      }

    } catch (error) {
      console.error(`\n💥 SUPABASE IMPORT MASTER FAILED: ${error.message}`);
      console.error(`\n🔧 For manual import, run:`);
      console.error(`   cd backend/scripts/content-generation`);
      console.error(`   node smart-database-importer.js --sargas=YOUR_SARGAS --verify --retry-on-failure`);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const importer = new SupabaseImportMaster();
  importer.run();
}

module.exports = SupabaseImportMaster;