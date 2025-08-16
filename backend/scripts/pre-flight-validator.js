#!/usr/bin/env node

/**
 * Pre-Flight Validation Script
 * 
 * Comprehensive validation before content generation or import to prevent
 * common issues and ensure all prerequisites are met
 * 
 * Features:
 * - Environment validation (API keys, credentials)
 * - File structure validation
 * - Configuration completeness checks
 * - Database connectivity validation
 * - Content generation prerequisites
 * 
 * Usage:
 *   node pre-flight-validator.js --check-environment
 *   node pre-flight-validator.js --validate-sarga=11 --full-check
 *   node pre-flight-validator.js --check-import-ready --sargas=11,12
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs').promises;
const path = require('path');

class PreFlightValidator {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      critical: []
    };
    
    this.requiredDirs = [
      '../generated-content/scraped',
      '../generated-content/questions', 
      '../generated-content/summaries',
      'content-generation'
    ];
    
    this.requiredScripts = [
      'content-generation/scrape-valmiki-simple.js',
      'content-generation/generate-with-openai.js',
      'content-generation/generate-hard-questions-addon.js',
      'universal-import.js',
      'mcp-universal-import.js',
      'smart-config-manager.js'
    ];
  }

  /**
   * Add result to appropriate category
   */
  addResult(category, test, message, details = null) {
    const result = { test, message, details };
    this.results[category].push(result);
    
    const icons = {
      passed: '✅',
      failed: '❌', 
      warnings: '⚠️',
      critical: '🔥'
    };
    
    console.log(`${icons[category]} ${test}: ${message}`);
    if (details) {
      console.log(`   ${details}`);
    }
  }

  /**
   * Validate environment variables
   */
  async validateEnvironment() {
    console.log(`🔍 Validating environment configuration...`);
    
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'SUPABASE_URL', 
      'SUPABASE_ANON_KEY'
    ];
    
    const optionalEnvVars = [
      'GOOGLE_SHEETS_CREDENTIALS_PATH',
      'CONTENT_REVIEW_SHEET_ID'
    ];

    // Check required variables
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        const maskedValue = process.env[envVar].slice(0, 10) + '***';
        this.addResult('passed', `Environment Variable`, `${envVar} found`, `Value: ${maskedValue}`);
      } else {
        this.addResult('critical', `Environment Variable`, `${envVar} missing`, 'Required for content generation');
      }
    }

    // Check optional variables
    for (const envVar of optionalEnvVars) {
      if (process.env[envVar]) {
        this.addResult('passed', `Optional Environment`, `${envVar} found`);
      } else {
        this.addResult('warnings', `Optional Environment`, `${envVar} missing`, 'Only needed for Google Sheets integration');
      }
    }

    // Validate OpenAI API key format
    if (process.env.OPENAI_API_KEY) {
      if (process.env.OPENAI_API_KEY.startsWith('sk-proj-') || process.env.OPENAI_API_KEY.startsWith('sk-')) {
        this.addResult('passed', 'OpenAI Key Format', 'Valid format detected');
      } else {
        this.addResult('failed', 'OpenAI Key Format', 'Invalid format - should start with sk-');
      }
    }

    // Validate Supabase URL format
    if (process.env.SUPABASE_URL) {
      if (process.env.SUPABASE_URL.includes('supabase.co') && process.env.SUPABASE_URL.startsWith('https://')) {
        this.addResult('passed', 'Supabase URL Format', 'Valid format detected');
      } else {
        this.addResult('failed', 'Supabase URL Format', 'Invalid format - should be https://[project].supabase.co');
      }
    }
  }

  /**
   * Validate directory structure
   */
  async validateDirectories() {
    console.log(`\n📁 Validating directory structure...`);
    
    for (const dir of this.requiredDirs) {
      const dirPath = path.join(__dirname, dir);
      try {
        const stats = await fs.stat(dirPath);
        if (stats.isDirectory()) {
          this.addResult('passed', 'Directory Structure', `${dir} exists`);
        } else {
          this.addResult('failed', 'Directory Structure', `${dir} is not a directory`);
        }
      } catch (error) {
        this.addResult('critical', 'Directory Structure', `${dir} missing`, 'Required directory not found');
      }
    }
  }

  /**
   * Validate required scripts exist and are executable
   */
  async validateScripts() {
    console.log(`\n📜 Validating required scripts...`);
    
    for (const script of this.requiredScripts) {
      const scriptPath = path.join(__dirname, script);
      try {
        const stats = await fs.stat(scriptPath);
        if (stats.isFile()) {
          // Check if file is readable
          await fs.access(scriptPath, fs.constants.R_OK);
          this.addResult('passed', 'Script Availability', `${script} exists and readable`);
        } else {
          this.addResult('failed', 'Script Availability', `${script} is not a file`);
        }
      } catch (error) {
        this.addResult('critical', 'Script Availability', `${script} missing or not accessible`);
      }
    }
  }

  /**
   * Validate specific sarga readiness with question count enforcement
   */
  async validateSargaReadiness(sarga, checkType = 'generation') {
    console.log(`\n🎯 Validating Sarga ${sarga} readiness for ${checkType}...`);
    
    if (checkType === 'generation' || checkType === 'full') {
      // Check if scraped content exists
      const scrapedFile = `structured_bala_kanda_sarga_${sarga}.json`;
      const scrapedPath = path.join(__dirname, '../generated-content/scraped', scrapedFile);
      
      try {
        await fs.access(scrapedPath);
        const content = JSON.parse(await fs.readFile(scrapedPath, 'utf8'));
        if (content.verses && content.verses.length > 0) {
          this.addResult('passed', `Sarga ${sarga} Content`, `Scraped content available (${content.verses.length} verses)`);
        } else {
          this.addResult('failed', `Sarga ${sarga} Content`, 'Scraped content has no verses');
        }
      } catch (error) {
        this.addResult('failed', `Sarga ${sarga} Content`, 'Scraped content missing', 'Run scraping first');
      }
    }

    if (checkType === 'import' || checkType === 'full') {
      // Check if generated questions exist
      const questionsFile = `bala_kanda_sarga_${sarga}_questions.json`;
      const questionsPath = path.join(__dirname, '../generated-content/questions', questionsFile);
      
      try {
        await fs.access(questionsPath);
        const questions = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
        if (questions.questions && questions.questions.length > 0) {
          // Validate question count and generator method
          const questionCount = questions.questions.length;
          const generator = questions.generator || 'unknown';
          
          if (questionCount < 10) {
            this.addResult('warnings', `Sarga ${sarga} Question Count`, `Only ${questionCount} main questions (target: 12 main questions)`, 
              'Legacy generation method - consider using multipass for full coverage');
          } else {
            this.addResult('passed', `Sarga ${sarga} Questions`, `Generated questions available (${questionCount})`);
          }
          
          // Check generator method
          if (generator === 'openai-gpt4' && !generator.includes('multipass')) {
            this.addResult('warnings', `Sarga ${sarga} Generator Method`, 'Generated with legacy method (openai-gpt4)', 
              'Consider regenerating with multipass method for better coverage');
          } else if (generator.includes('multipass')) {
            this.addResult('passed', `Sarga ${sarga} Generator Method`, 'Generated with enhanced multipass method');
          }
        } else {
          this.addResult('failed', `Sarga ${sarga} Questions`, 'Generated questions file has no questions');
        }
      } catch (error) {
        this.addResult('failed', `Sarga ${sarga} Questions`, 'Generated questions missing', 'Run generation first');
      }

      // Check if hard questions exist
      const hardFile = `bala_kanda_sarga_${sarga}_hard_questions_addon.json`;
      const hardPath = path.join(__dirname, '../generated-content/questions', hardFile);
      
      try {
        await fs.access(hardPath);
        const hardQuestions = JSON.parse(await fs.readFile(hardPath, 'utf8'));
        if (hardQuestions.questions && hardQuestions.questions.length > 0) {
          this.addResult('passed', `Sarga ${sarga} Hard Questions`, `Hard questions available (${hardQuestions.questions.length})`);
        } else {
          this.addResult('warnings', `Sarga ${sarga} Hard Questions`, 'Hard questions file has no questions');
        }
      } catch (error) {
        this.addResult('warnings', `Sarga ${sarga} Hard Questions`, 'Hard questions missing', 'Optional but recommended');
      }

      // Check if summary exists
      const summaryFile = `bala_kanda_sarga_${sarga}_summary.json`;
      const summaryPath = path.join(__dirname, '../generated-content/summaries', summaryFile);
      
      try {
        await fs.access(summaryPath);
        const summary = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
        if (summary.title && summary.narrative_summary) {
          this.addResult('passed', `Sarga ${sarga} Summary`, `Chapter summary available`);
        } else {
          this.addResult('failed', `Sarga ${sarga} Summary`, 'Summary file incomplete');
        }
      } catch (error) {
        this.addResult('warnings', `Sarga ${sarga} Summary`, 'Chapter summary missing', 'Optional for questions-only import');
      }
    }
  }

  /**
   * Check hard questions configuration
   */
  async validateHardQuestionsConfig(sarga) {
    console.log(`\n🧠 Validating hard questions configuration for Sarga ${sarga}...`);
    
    const configPath = path.join(__dirname, 'content-generation/generate-hard-questions-addon.js');
    
    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      const regex = new RegExp(`${sarga}:\\s*\\[`, 'g');
      
      if (regex.test(configContent)) {
        this.addResult('passed', `Sarga ${sarga} Configuration`, 'Hard questions themes configured');
      } else {
        this.addResult('warnings', `Sarga ${sarga} Configuration`, 'Hard questions themes not configured', 'Use smart-config-manager.js to add');
      }
    } catch (error) {
      this.addResult('failed', 'Configuration File', 'Cannot read hard questions configuration file');
    }
  }

  /**
   * Test database connectivity (simulated)
   */
  async validateDatabaseConnectivity() {
    console.log(`\n🗄️  Validating database connectivity...`);
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      this.addResult('critical', 'Database Config', 'Supabase credentials missing');
      return;
    }

    // In a real implementation, we would test actual connectivity
    // For now, we'll validate the configuration format
    const projectIdMatch = process.env.SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (projectIdMatch) {
      this.addResult('passed', 'Database Config', `Project ID detected: ${projectIdMatch[1]}`);
    } else {
      this.addResult('failed', 'Database Config', 'Cannot extract project ID from Supabase URL');
    }

    // Check key format
    if (process.env.SUPABASE_ANON_KEY.length > 100) {
      this.addResult('passed', 'Database Authentication', 'Supabase key format appears valid');
    } else {
      this.addResult('failed', 'Database Authentication', 'Supabase key appears too short');
    }
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.critical.length > 0) {
      recommendations.push('🔥 CRITICAL: Fix critical issues before proceeding:');
      this.results.critical.forEach(issue => {
        recommendations.push(`   - ${issue.message}`);
        if (issue.details) recommendations.push(`     ${issue.details}`);
      });
      recommendations.push('');
    }

    if (this.results.failed.length > 0) {
      recommendations.push('❌ REQUIRED: Fix these issues:');
      this.results.failed.forEach(issue => {
        recommendations.push(`   - ${issue.test}: ${issue.message}`);
        if (issue.details) recommendations.push(`     Solution: ${issue.details}`);
      });
      recommendations.push('');
    }

    if (this.results.warnings.length > 0) {
      recommendations.push('⚠️  RECOMMENDED: Address these warnings:');
      this.results.warnings.forEach(issue => {
        recommendations.push(`   - ${issue.test}: ${issue.message}`);
        if (issue.details) recommendations.push(`     Note: ${issue.details}`);
      });
      recommendations.push('');
    }

    return recommendations;
  }

  /**
   * Display comprehensive summary
   */
  displaySummary() {
    console.log(`\n📊 PRE-FLIGHT VALIDATION SUMMARY`);
    console.log(`==============================`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
    console.log(`🔥 Critical: ${this.results.critical.length}`);
    
    const recommendations = this.generateRecommendations();
    if (recommendations.length > 0) {
      console.log(`\n📋 RECOMMENDATIONS:`);
      recommendations.forEach(rec => console.log(rec));
    }

    // Overall status
    if (this.results.critical.length > 0) {
      console.log(`\n🚨 OVERALL STATUS: CRITICAL ISSUES - Cannot proceed`);
      return false;
    } else if (this.results.failed.length > 0) {
      console.log(`\n⚠️  OVERALL STATUS: ISSUES FOUND - Fix required before proceeding`);
      return false;
    } else if (this.results.warnings.length > 0) {
      console.log(`\n✅ OVERALL STATUS: READY with warnings - Can proceed with caution`);
      return true;
    } else {
      console.log(`\n🎉 OVERALL STATUS: ALL SYSTEMS GO - Ready to proceed`);
      return true;
    }
  }

  /**
   * Main execution function
   */
  async run(args) {
    const checkEnvironment = args.includes('--check-environment');
    const validateSargaArg = args.find(arg => arg.startsWith('--validate-sarga='));
    const checkImportReady = args.includes('--check-import-ready');
    const sargasArg = args.find(arg => arg.startsWith('--sargas='));
    const fullCheck = args.includes('--full-check');

    console.log(`🚀 Pre-Flight Validation Starting...\n`);

    // Always check environment and basic structure
    await this.validateEnvironment();
    await this.validateDirectories();
    await this.validateScripts();
    await this.validateDatabaseConnectivity();

    // Specific sarga validation
    if (validateSargaArg) {
      const sarga = parseInt(validateSargaArg.split('=')[1]);
      const checkType = fullCheck ? 'full' : 'generation';
      await this.validateSargaReadiness(sarga, checkType);
      await this.validateHardQuestionsConfig(sarga);
    }

    // Import readiness check for multiple sargas
    if (checkImportReady && sargasArg) {
      const sargas = sargasArg.split('=')[1].split(',').map(s => parseInt(s.trim()));
      for (const sarga of sargas) {
        await this.validateSargaReadiness(sarga, 'import');
        await this.validateHardQuestionsConfig(sarga);
      }
    }

    return this.displaySummary();
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`Pre-Flight Validation Script - Comprehensive validation before content operations

Usage:
  node pre-flight-validator.js --check-environment
  node pre-flight-validator.js --validate-sarga=11 --full-check
  node pre-flight-validator.js --check-import-ready --sargas=11,12

Options:
  --check-environment     Validate environment variables and basic setup
  --validate-sarga=N      Validate specific sarga readiness
  --check-import-ready    Check if sargas are ready for import
  --sargas=N,N,N         Specify sargas for import readiness check
  --full-check           Comprehensive validation (generation + import readiness)
  --help                 Show this help message

Examples:
  node pre-flight-validator.js --check-environment
  node pre-flight-validator.js --validate-sarga=11 --full-check
  node pre-flight-validator.js --check-import-ready --sargas=11,12,13`);
    process.exit(0);
  }

  const validator = new PreFlightValidator();
  const success = await validator.run(args);
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { PreFlightValidator };