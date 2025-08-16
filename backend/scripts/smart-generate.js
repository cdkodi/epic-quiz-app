#!/usr/bin/env node

/**
 * Smart Content Generation Script
 * 
 * Foolproof script that always uses the correct multipass method and validates output.
 * Prevents the question count issues by enforcing proper generation methods.
 * 
 * Features:
 * - Always uses multipass method (no legacy option)
 * - Built-in question count validation
 * - Automatic re-generation on failure
 * - Progress reporting with question counts
 * - Prevents overwrites without confirmation
 * 
 * Usage:
 *   node smart-generate.js --sarga=11
 *   node smart-generate.js --sarga=13 --force-overwrite
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class SmartContentGenerator {
  constructor() {
    this.scrapedDir = path.join(__dirname, '../generated-content/scraped');
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
    this.contentGenerationDir = path.join(__dirname, 'content-generation');
    
    this.requiredQuestions = 10; // Minimum acceptable question count
    this.targetQuestions = 12;   // Ideal question count from multipass
  }

  /**
   * Main generation workflow
   */
  async generate(args) {
    const sargaArg = args.find(arg => arg.startsWith('--sarga='));
    const forceOverwrite = args.includes('--force-overwrite');
    const skipValidation = args.includes('--skip-validation');
    
    if (!sargaArg) {
      throw new Error('Must specify --sarga=N');
    }
    
    const sarga = parseInt(sargaArg.split('=')[1]);
    if (isNaN(sarga) || sarga < 1) {
      throw new Error('Sarga number must be a positive integer');
    }
    
    console.log(`🎯 Smart Content Generation for Sarga ${sarga}`);
    console.log(`   Force overwrite: ${forceOverwrite ? '✅' : '❌'}`);
    console.log(`   Skip validation: ${skipValidation ? '✅' : '❌'}`);
    
    // Step 1: Check for existing content
    const existing = await this.checkExistingContent(sarga);
    if (existing.hasContent && !forceOverwrite) {
      console.log(`\n⚠️  Sarga ${sarga} already has generated content:`);
      if (existing.questions) console.log(`   📝 Questions: ${existing.questionCount} (${existing.generator})`);
      if (existing.summary) console.log(`   📄 Summary: Available`);
      console.log(`\n💡 Use --force-overwrite to regenerate existing content`);
      return;
    }
    
    // Step 2: Validate scraped content exists
    const scrapedFile = `structured_bala_kanda_sarga_${sarga}.json`;
    const scrapedPath = path.join(this.scrapedDir, scrapedFile);
    
    try {
      await fs.access(scrapedPath);
      const scrapedData = JSON.parse(await fs.readFile(scrapedPath, 'utf8'));
      console.log(`\n📖 Found scraped content: ${scrapedData.verses?.length || 0} verses`);
    } catch (error) {
      throw new Error(`Scraped content missing for Sarga ${sarga}. Run: node scrape-valmiki-simple.js --kanda=bala_kanda --sarga=${sarga}`);
    }
    
    // Step 3: Generate content using multipass method
    console.log(`\n🤖 Generating content using enhanced multipass method...`);
    const generationResult = await this.runMultipassGeneration(sarga, scrapedFile);
    
    if (!generationResult.success) {
      throw new Error(`Generation failed: ${generationResult.error}`);
    }
    
    // Step 4: Validate generated content
    if (!skipValidation) {
      console.log(`\n🔍 Validating generated content...`);
      const validation = await this.validateGeneratedContent(sarga);
      
      if (!validation.valid) {
        console.log(`\n❌ Validation failed:`);
        validation.errors.forEach(error => console.log(`   ${error}`));
        
        // Attempt one retry for transient issues
        console.log(`\n🔄 Retrying generation once...`);
        const retryResult = await this.runMultipassGeneration(sarga, scrapedFile);
        
        if (!retryResult.success) {
          throw new Error(`Generation retry failed: ${retryResult.error}`);
        }
        
        // Re-validate
        const retryValidation = await this.validateGeneratedContent(sarga);
        if (!retryValidation.valid) {
          throw new Error(`Generation validation failed after retry. Manual intervention required.`);
        }
      }
      
      console.log(`\n✅ Validation passed:`);
      validation.results.forEach(result => console.log(`   ${result}`));
    }
    
    console.log(`\n🎉 Smart generation completed successfully!`);
    console.log(`   📁 Generated files ready for import`);
    console.log(`   📊 Use pre-flight-validator.js --validate-sarga=${sarga} to verify`);
  }

  /**
   * Check for existing generated content
   */
  async checkExistingContent(sarga) {
    const result = {
      hasContent: false,
      questions: false,
      summary: false,
      questionCount: 0,
      generator: 'unknown'
    };
    
    // Check questions file
    const questionsFile = `bala_kanda_sarga_${sarga}_questions.json`;
    const questionsPath = path.join(this.questionsDir, questionsFile);
    
    try {
      await fs.access(questionsPath);
      const questions = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
      result.questions = true;
      result.hasContent = true;
      result.questionCount = questions.questions?.length || 0;
      result.generator = questions.generator || 'unknown';
    } catch (error) {
      // File doesn't exist, which is fine
    }
    
    // Check summary file
    const summaryFile = `bala_kanda_sarga_${sarga}_summary.json`;
    const summaryPath = path.join(this.summariesDir, summaryFile);
    
    try {
      await fs.access(summaryPath);
      result.summary = true;
      result.hasContent = true;
    } catch (error) {
      // File doesn't exist, which is fine
    }
    
    return result;
  }

  /**
   * Run multipass generation with progress tracking
   */
  async runMultipassGeneration(sarga, scrapedFile) {
    const script = path.join(this.contentGenerationDir, 'generate-with-openai-multipass.js');
    
    return new Promise((resolve, reject) => {
      const process = spawn('node', [script, `--input=${scrapedFile}`, '--multipass'], {
        cwd: this.contentGenerationDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        // Forward real-time output
        console.log(text.replace(/\n$/, ''));
      });
      
      process.stderr.on('data', (data) => {
        const text = data.toString();
        error += text;
        console.error(text.replace(/\n$/, ''));
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: error || `Process exited with code ${code}` });
        }
      });
      
      process.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
    });
  }

  /**
   * Validate generated content meets requirements
   */
  async validateGeneratedContent(sarga) {
    const validation = {
      valid: true,
      errors: [],
      results: []
    };
    
    // Validate questions file
    const questionsFile = `bala_kanda_sarga_${sarga}_questions.json`;
    const questionsPath = path.join(this.questionsDir, questionsFile);
    
    try {
      const questions = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
      const questionCount = questions.questions?.length || 0;
      const generator = questions.generator || 'unknown';
      
      if (questionCount < this.requiredQuestions) {
        validation.valid = false;
        validation.errors.push(`Only ${questionCount} questions generated (minimum ${this.requiredQuestions} required)`);
      } else {
        validation.results.push(`📝 Questions: ${questionCount} (target: ${this.targetQuestions})`);
      }
      
      if (!generator.includes('multipass')) {
        validation.valid = false;
        validation.errors.push(`Wrong generator used: ${generator} (expected multipass method)`);
      } else {
        validation.results.push(`🤖 Generator: ${generator} ✅`);
      }
      
      // Validate question structure
      let validQuestions = 0;
      for (const q of questions.questions || []) {
        if (q.question_text && q.options && Array.isArray(q.options) && q.options.length >= 4) {
          validQuestions++;
        }
      }
      
      if (validQuestions !== questionCount) {
        validation.valid = false;
        validation.errors.push(`${questionCount - validQuestions} questions have invalid structure`);
      } else {
        validation.results.push(`📋 Question structure: All ${questionCount} questions valid`);
      }
      
    } catch (error) {
      validation.valid = false;
      validation.errors.push(`Questions file validation failed: ${error.message}`);
    }
    
    // Validate summary file
    const summaryFile = `bala_kanda_sarga_${sarga}_summary.json`;
    const summaryPath = path.join(this.summariesDir, summaryFile);
    
    try {
      const summary = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
      if (summary.title && summary.narrative_summary) {
        validation.results.push(`📄 Summary: Generated with title "${summary.title}"`);
      } else {
        validation.errors.push(`Summary file incomplete - missing title or narrative_summary`);
        validation.valid = false;
      }
    } catch (error) {
      validation.errors.push(`Summary file validation failed: ${error.message}`);
      validation.valid = false;
    }
    
    return validation;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`Smart Content Generation Script - Foolproof multipass content generation

Usage:
  node smart-generate.js --sarga=11
  node smart-generate.js --sarga=13 --force-overwrite
  node smart-generate.js --sarga=15 --skip-validation

Options:
  --sarga=N              Sarga number to generate content for
  --force-overwrite      Overwrite existing content without prompting
  --skip-validation      Skip post-generation validation (not recommended)
  --help                 Show this help message

Features:
  ✅ Always uses multipass method (prevents 4-question issue)
  ✅ Built-in validation ensures 10+ questions generated
  ✅ Automatic retry on generation failures  
  ✅ Progress reporting with question counts
  ✅ Prevents accidental overwrites
  
Examples:
  node smart-generate.js --sarga=11
  node smart-generate.js --sarga=13 --force-overwrite`);
    process.exit(0);
  }
  
  const generator = new SmartContentGenerator();
  
  try {
    await generator.generate(args);
  } catch (error) {
    console.error(`\n❌ Smart generation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { SmartContentGenerator };