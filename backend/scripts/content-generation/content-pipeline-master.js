#!/usr/bin/env node

/**
 * 🚀 CONTENT PIPELINE MASTER - Automated Content Generation Orchestrator
 * 
 * SAFE AUTOMATION WRAPPER for Epic Quiz App content generation pipeline
 * 
 * Key Features:
 * - ✅ Zero Risk: Calls existing scripts without modifications
 * - ✅ Full Backward Compatibility: Manual commands work exactly as before
 * - ✅ Stage Recovery: Resumes from failure points
 * - ✅ Batch Processing: Handles single sarga or multiple sargas
 * - ✅ Clear Fallback: Provides exact manual commands on failure
 * 
 * Usage:
 *   node content-pipeline-master.js --kanda=bala_kanda --sarga=21
 *   node content-pipeline-master.js --kanda=bala_kanda --sargas=21,22,23
 *   node content-pipeline-master.js --kanda=bala_kanda --sarga=21 --dry-run
 *   node content-pipeline-master.js --kanda=bala_kanda --sarga=21 --verbose
 * 
 * Author: Claude Code Automation
 * Date: 2025-08-14
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ContentPipelineMaster {
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
      kanda: null,
      sarga: null,
      sargas: [],
      dryRun: args.includes('--dry-run'),
      verbose: args.includes('--verbose'),
      skipCompleted: args.includes('--skip-completed') || true // Default to skip completed
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

    if (!config.kanda) {
      throw new Error('--kanda parameter is required (e.g., --kanda=bala_kanda)');
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

  async runScript(scriptName, args, description) {
    return new Promise((resolve, reject) => {
      console.log(`🔄 ${description}...`);
      console.log(`📝 Command: node ${scriptName} ${args.join(' ')}`);

      const child = spawn('node', [scriptName, ...args], {
        cwd: this.scriptsDir,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        if (this.verbose) {
          process.stdout.write(output);
        }
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        if (this.verbose) {
          process.stderr.write(output);
        }
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${description} completed successfully`);
          resolve({ stdout, stderr });
        } else {
          console.error(`❌ ${description} failed with exit code ${code}`);
          if (!this.verbose) {
            console.error('STDOUT:', stdout);
            console.error('STDERR:', stderr);
          }
          reject(new Error(`${description} failed`));
        }
      });

      child.on('error', (error) => {
        console.error(`❌ Failed to start ${description}:`, error.message);
        reject(error);
      });
    });
  }

  async processSarga(kanda, sarga, config) {
    console.log(`\n🎯 Processing ${kanda} sarga ${sarga}...`);

    const files = {
      scraped: path.join(this.scrapedDir, `structured_${kanda}_sarga_${sarga}.json`),
      summary: path.join(this.summariesDir, `${kanda}_sarga_${sarga}_summary.json`),
      questions: path.join(this.questionsDir, `${kanda}_sarga_${sarga}_questions.json`),
      hardQuestions: path.join(this.questionsDir, `${kanda}_sarga_${sarga}_hard_questions_addon.json`)
    };

    try {
      // Stage 1: Scraping
      if (config.skipCompleted && await this.checkFileExists(files.scraped)) {
        console.log(`⏭️  Skipping scraping - file already exists: ${files.scraped}`);
      } else {
        if (config.dryRun) {
          console.log(`🔍 DRY RUN: Would execute scraping for ${kanda} sarga ${sarga}`);
        } else {
          await this.runScript(
            'scrape-valmiki-simple.js',
            [`--kanda=${kanda}`, `--sarga=${sarga}`],
            `Scraping ${kanda} sarga ${sarga}`
          );

          if (!await this.checkFileExists(files.scraped)) {
            throw new Error(`Scraping completed but expected file not found: ${files.scraped}`);
          }
        }
      }

      // Stage 2: Standard Content Generation
      const standardFilesExist = await this.checkFileExists(files.summary) && await this.checkFileExists(files.questions);
      
      if (config.skipCompleted && standardFilesExist) {
        console.log(`⏭️  Skipping standard generation - files already exist`);
      } else {
        if (config.dryRun) {
          console.log(`🔍 DRY RUN: Would execute standard content generation for ${kanda} sarga ${sarga}`);
        } else {
          await this.runScript(
            'generate-with-openai-multipass.js',
            [`--input=structured_${kanda}_sarga_${sarga}.json`, '--multipass'],
            `Generating standard content for ${kanda} sarga ${sarga}`
          );

          if (!await this.checkFileExists(files.summary) || !await this.checkFileExists(files.questions)) {
            throw new Error(`Standard generation completed but expected files not found`);
          }
        }
      }

      // Stage 3: Hard Questions Generation
      if (config.skipCompleted && await this.checkFileExists(files.hardQuestions)) {
        console.log(`⏭️  Skipping hard questions - file already exists: ${files.hardQuestions}`);
      } else {
        if (config.dryRun) {
          console.log(`🔍 DRY RUN: Would execute hard questions generation for ${kanda} sarga ${sarga}`);
        } else {
          await this.runScript(
            'generate-hard-questions-addon.js',
            [`--input=structured_${kanda}_sarga_${sarga}.json`],
            `Generating hard questions for ${kanda} sarga ${sarga}`
          );

          if (!await this.checkFileExists(files.hardQuestions)) {
            throw new Error(`Hard questions generation completed but expected file not found: ${files.hardQuestions}`);
          }
        }
      }

      // Final Verification
      if (!config.dryRun) {
        console.log(`🔍 Verifying all files for ${kanda} sarga ${sarga}...`);
        const missingFiles = [];
        
        for (const [type, filePath] of Object.entries(files)) {
          if (!await this.checkFileExists(filePath)) {
            missingFiles.push(`${type}: ${filePath}`);
          }
        }

        if (missingFiles.length > 0) {
          throw new Error(`Missing files after completion:\n${missingFiles.join('\n')}`);
        }

        console.log(`✅ All files verified for ${kanda} sarga ${sarga}:`);
        console.log(`   📄 Scraped: ${files.scraped}`);
        console.log(`   📝 Summary: ${files.summary}`);
        console.log(`   ❓ Questions: ${files.questions}`);
        console.log(`   🧠 Hard Questions: ${files.hardQuestions}`);
      }

      return true;

    } catch (error) {
      console.error(`\n❌ PIPELINE FAILED for ${kanda} sarga ${sarga}:`);
      console.error(`   Error: ${error.message}`);
      console.error(`\n🔧 FALLBACK - Run these commands manually:`);
      console.error(`   cd backend/scripts/content-generation`);
      console.error(`   node scrape-valmiki-simple.js --kanda=${kanda} --sarga=${sarga}`);
      console.error(`   node generate-with-openai-multipass-clean.js --input=structured_${kanda}_sarga_${sarga}.json --multipass`);
      console.error(`   node generate-hard-questions-addon.js --input=structured_${kanda}_sarga_${sarga}.json`);
      
      throw error;
    }
  }

  async run() {
    console.log('🚀 CONTENT PIPELINE MASTER - Starting Automation');
    console.log('=' .repeat(60));

    try {
      const config = await this.parseArguments();
      this.verbose = config.verbose;

      console.log(`📋 Configuration:`);
      console.log(`   Kanda: ${config.kanda}`);
      console.log(`   Sargas: ${config.sargas.join(', ')}`);
      console.log(`   Dry Run: ${config.dryRun}`);
      console.log(`   Skip Completed: ${config.skipCompleted}`);
      console.log(`   Verbose: ${config.verbose}`);

      const startTime = Date.now();
      let successCount = 0;
      let failureCount = 0;

      for (const sarga of config.sargas) {
        try {
          await this.processSarga(config.kanda, sarga, config);
          successCount++;
        } catch (error) {
          failureCount++;
          if (config.sargas.length === 1) {
            // For single sarga, re-throw to exit with error
            throw error;
          } else {
            // For batch processing, continue with other sargas
            console.error(`Continuing with remaining sargas...\n`);
          }
        }
      }

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      console.log('\n🎉 PIPELINE COMPLETED');
      console.log('=' .repeat(60));
      console.log(`✅ Successful: ${successCount}/${config.sargas.length} sargas`);
      if (failureCount > 0) {
        console.log(`❌ Failed: ${failureCount}/${config.sargas.length} sargas`);
      }
      console.log(`⏱️  Total time: ${duration}s`);
      
      if (config.dryRun) {
        console.log(`\n💡 This was a dry run. To execute for real, remove the --dry-run flag.`);
      }

      if (failureCount > 0) {
        console.log(`\n⚠️  Some sargas failed. Check the logs above for manual commands.`);
        process.exit(1);
      }

    } catch (error) {
      console.error(`\n💥 PIPELINE MASTER FAILED: ${error.message}`);
      console.error(`\n🔧 For manual execution, run the individual commands as shown in the logs above.`);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const pipeline = new ContentPipelineMaster();
  pipeline.run();
}

module.exports = ContentPipelineMaster;