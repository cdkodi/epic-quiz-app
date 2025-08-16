#!/usr/bin/env node

/**
 * Batch OpenAI Content Generation Script for 2-Sarga Cost Optimization
 * 
 * Generates chapter summaries and quiz questions for 2 Sargas in a single API call
 * Usage: node generate-batch-multipass.js --sargas=17,18 --multipass
 * Cost: $1 for 2 Sargas (50% reduction from $2)
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class BatchOpenAIContentGenerator {
  constructor() {
    this.inputDir = path.join(__dirname, '../../generated-content/scraped');
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  async generateBatchContent(sargaNumbers, useMultipass = false) {
    console.log(`🤖 Starting Batch OpenAI content generation for Sargas ${sargaNumbers.join(', ')}...`);
    console.log(`💰 Cost Optimization: Single API call for 2 Sargas ($1 instead of $2)`);
    
    // Ensure output directories exist
    await Promise.all([
      fs.mkdir(this.summariesDir, { recursive: true }),
      fs.mkdir(this.questionsDir, { recursive: true })
    ]);
    
    // Load content for both Sargas
    const sargaContents = [];
    for (const sargaNumber of sargaNumbers) {
      const inputFilename = `structured_bala_kanda_sarga_${sargaNumber}.json`;
      const inputPath = path.join(this.inputDir, inputFilename);
      
      try {
        const rawContent = await fs.readFile(inputPath, 'utf8');
        const scrapedData = JSON.parse(rawContent);
        sargaContents.push(scrapedData);
        console.log(`📖 Loaded Sarga ${sargaNumber}: ${scrapedData.verses.length} verses`);
      } catch (error) {
        throw new Error(`Failed to load Sarga ${sargaNumber}: ${error.message}`);
      }
    }
    
    // Generate batch content using single API call
    console.log('\\n🎯 Generating batch content with single OpenAI API call...');
    const batchResults = await this.generateBatchContentFromAPI(sargaContents);
    
    // Save individual results
    for (let i = 0; i < sargaNumbers.length; i++) {
      const sargaNumber = sargaNumbers[i];
      const result = batchResults[i];
      const scrapedData = sargaContents[i];
      
      console.log(`\\n💾 Saving content for Sarga ${sargaNumber}...`);
      
      // Save summary
      await this.saveSummary(scrapedData, result.summary);
      
      // Save questions  
      await this.saveQuestions(scrapedData, result.questions);
      
      console.log(`✅ Sarga ${sargaNumber} content saved successfully`);
    }
    
    console.log('\\n🎉 Batch content generation completed successfully!');
    
    return batchResults;
  }

  async generateBatchContentFromAPI(sargaContents) {
    const prompt = this.buildBatchPrompt(sargaContents);
    
    try {
      const response = await this.callOpenAI(prompt, {
        model: "gpt-4-turbo",
        max_tokens: 4000, // Max supported by gpt-4-turbo
        temperature: 0.3
      });
      
      console.log('📝 Parsing batch response from OpenAI...');
      console.log('🔍 Raw response length:', response.length);
      console.log('🔍 Response preview:', response.substring(0, 500));
      
      let batchResults;
      try {
        batchResults = JSON.parse(response);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('🔍 Error position:', parseError.message.match(/position (\d+)/)?.[1]);
        if (parseError.message.includes('position')) {
          const pos = parseInt(parseError.message.match(/position (\d+)/)?.[1] || '0');
          console.error('🔍 Context around error:', response.substring(Math.max(0, pos - 100), pos + 100));
        }
        throw parseError;
      }
      
      // Validate batch results
      if (!batchResults.batch_results || !Array.isArray(batchResults.batch_results)) {
        throw new Error('Invalid batch response format');
      }
      
      if (batchResults.batch_results.length !== sargaContents.length) {
        throw new Error(`Expected ${sargaContents.length} results, got ${batchResults.batch_results.length}`);
      }
      
      // Validate each Sarga result
      batchResults.batch_results.forEach((result, index) => {
        const expectedSarga = sargaContents[index].sarga;
        if (result.sarga !== expectedSarga) {
          throw new Error(`Sarga mismatch: expected ${expectedSarga}, got ${result.sarga}`);
        }
        
        if (!result.summary || !result.questions || !Array.isArray(result.questions)) {
          throw new Error(`Invalid content structure for Sarga ${result.sarga}`);
        }
        
        if (result.questions.length < 10) {
          throw new Error(`Insufficient questions for Sarga ${result.sarga}: got ${result.questions.length}, minimum 10 required`);
        }
      });
      
      console.log(`✅ Batch validation successful: ${batchResults.batch_results.length} Sargas processed`);
      
      return batchResults.batch_results;
      
    } catch (error) {
      console.error('❌ Batch generation failed:', error.message);
      
      // Fallback: try individual generation
      console.log('🔄 Falling back to individual generation...');
      const fallbackResults = [];
      
      for (const sargaContent of sargaContents) {
        console.log(`🔄 Generating individual content for Sarga ${sargaContent.sarga}...`);
        const summary = await this.generateIndividualSummary(sargaContent);
        const questions = await this.generateIndividualQuestions(sargaContent);
        
        fallbackResults.push({
          sarga: sargaContent.sarga,
          summary: summary,
          questions: questions
        });
      }
      
      console.log('✅ Fallback generation completed');
      return fallbackResults;
    }
  }

  buildBatchPrompt(sargaContents) {
    let prompt = `Generate comprehensive content for ${sargaContents.length} Sargas from the Valmiki Ramayana in a single response.\n\n`;
    
    // Add content for each Sarga
    sargaContents.forEach((sargaContent, index) => {
      prompt += `SARGA ${sargaContent.sarga} CONTENT:\n`;
      prompt += `Title: ${sargaContent.title}\n`;
      prompt += `Verses (${sargaContent.verses.length} total):\n`;
      
      // Include first 8 verses from each Sarga to manage token limits
      const selectedVerses = sargaContent.verses.slice(0, 5);
      selectedVerses.forEach(verse => {
        prompt += `Verse ${verse.number}: ${verse.sanskrit.substring(0, 150)} | ${verse.translation.substring(0, 200)}\n`;
      });
      
      prompt += '\n';
    });
    
    prompt += `Generate content following this EXACT JSON structure:\n\n`;
    prompt += `{\n`;
    prompt += `  "batch_results": [\n`;
    
    sargaContents.forEach((sargaContent, index) => {
      prompt += `    {\n`;
      prompt += `      "sarga": ${sargaContent.sarga},\n`;
      prompt += `      "summary": {\n`;
      prompt += `        "title": "Descriptive title for Sarga ${sargaContent.sarga}",\n`;
      prompt += `        "key_events": [\n`;
      prompt += `          "Event 1 description",\n`;
      prompt += `          "Event 2 description",\n`;
      prompt += `          "Event 3 description"\n`;
      prompt += `        ],\n`;
      prompt += `        "main_characters": [\n`;
      prompt += `          "Character name with description"\n`;
      prompt += `        ],\n`;
      prompt += `        "themes": [\n`;
      prompt += `          "Theme 1",\n`;
      prompt += `          "Theme 2"\n`;
      prompt += `        ],\n`;
      prompt += `        "cultural_significance": "Paragraph explaining religious/cultural importance",\n`;
      prompt += `        "narrative_summary": "2-3 paragraph story summary"\n`;
      prompt += `      },\n`;
      prompt += `      "questions": [\n`;
      prompt += `        {\n`;
      prompt += `          "category": "characters|events|themes|culture",\n`;
      prompt += `          "difficulty": "easy|medium|hard",\n`;
      prompt += `          "question_text": "Educational question about the content",\n`;
      prompt += `          "options": ["Option A", "Option B", "Option C", "Option D"],\n`;
      prompt += `          "correct_answer_id": 0,\n`;
      prompt += `          "basic_explanation": "Educational explanation of the answer",\n`;
      prompt += `          "original_quote": "Sanskrit quote from verses",\n`;
      prompt += `          "quote_translation": "English translation of quote",\n`;
      prompt += `          "tags": ["relevant", "tags"],\n`;
      prompt += `          "cross_epic_tags": ["universal", "themes"]\n`;
      prompt += `        }\n`;
      prompt += `      ]\n`;
      prompt += `    }${index < sargaContents.length - 1 ? ',' : ''}\n`;
    });
    
    prompt += `  ]\n`;
    prompt += `}\n\n`;
    
    prompt += `CRITICAL REQUIREMENTS:\n`;
    prompt += `⚠️  MUST generate exactly 12 questions per Sarga (total ${sargaContents.length * 12} questions)\n`;
    prompt += `⚠️  Each "questions" array MUST contain exactly 12 question objects\n`;
    prompt += `- Maintain cultural authenticity and scholarly accuracy\n`;
    prompt += `- Include authentic Sanskrit quotes from provided verses\n`;
    prompt += `- Balance difficulty: easy (3), medium (6), hard (3) per Sarga\n`;
    prompt += `- Categories: characters, events, themes, culture\n`;
    prompt += `- Educational value: test understanding, not memorization\n`;
    prompt += `- Return ONLY the JSON structure above - no extra text\n`;
    
    return prompt;
  }

  async generateIndividualSummary(scrapedData) {
    const prompt = this.buildSummaryPrompt(scrapedData);
    
    const response = await this.callOpenAI(prompt, {
      model: "gpt-4",
      max_tokens: 1000,
      temperature: 0.3
    });
    
    return JSON.parse(response);
  }

  async generateIndividualQuestions(scrapedData) {
    const prompt = this.buildQuestionsPrompt(scrapedData);
    
    const response = await this.callOpenAI(prompt, {
      model: "gpt-4",
      max_tokens: 2000,
      temperature: 0.2
    });
    
    return JSON.parse(response);
  }

  buildSummaryPrompt(scrapedData) {
    const versesText = scrapedData.verses
      .slice(0, 8)
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit.substring(0, 200)}\\nTranslation: ${verse.translation.substring(0, 300)}`)
      .join('\\n\\n');

    return `Based on the following Sanskrit verses from ${scrapedData.kanda} Sarga ${scrapedData.sarga}:\n\n${versesText}\n\nGenerate a comprehensive summary. Return ONLY valid JSON:\n\n{\n  "title": "Descriptive title",\n  "key_events": ["Event 1", "Event 2", "Event 3"],\n  "main_characters": ["Character descriptions"],\n  "themes": ["Theme 1", "Theme 2"],\n  "cultural_significance": "Cultural importance paragraph",\n  "narrative_summary": "Complete story summary"\n}`;
  }

  buildQuestionsPrompt(scrapedData) {
    const versesText = scrapedData.verses
      .slice(0, 8)
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit.substring(0, 150)}\\nTranslation: ${verse.translation.substring(0, 250)}`)
      .join('\\n\\n');

    return `Generate exactly 12 quiz questions from ${scrapedData.kanda} Sarga ${scrapedData.sarga}:\n\n${versesText}\n\nReturn ONLY valid JSON array of 12 questions with this structure:\n\n[{\n  "category": "characters|events|themes|culture",\n  "difficulty": "easy|medium|hard",\n  "question_text": "Educational question",\n  "options": ["A", "B", "C", "D"],\n  "correct_answer_id": 0,\n  "basic_explanation": "Answer explanation",\n  "original_quote": "Sanskrit quote",\n  "quote_translation": "English translation",\n  "tags": ["tags"],\n  "cross_epic_tags": ["themes"]\n}]`;
  }

  async callOpenAI(prompt, options = {}) {
    const requestBody = {
      model: options.model || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Sanskrit scholar specializing in the Valmiki Ramayana. Generate culturally accurate, educationally valuable content that respects Hindu traditions."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: options.max_tokens || 3000,
      temperature: options.temperature || 0.2
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    
    if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return responseData.choices[0].message.content.trim();
  }

  async saveSummary(scrapedData, summary) {
    const filename = `${scrapedData.kanda}_sarga_${scrapedData.sarga}_summary.json`;
    const filepath = path.join(this.summariesDir, filename);
    
    const summaryData = {
      epic_id: scrapedData.epic_id,
      kanda: scrapedData.kanda,
      sarga: scrapedData.sarga,
      source_url: scrapedData.source_url,
      generation_date: new Date().toISOString(),
      generator: 'openai-gpt4-batch',
      ...summary
    };
    
    await fs.writeFile(filepath, JSON.stringify(summaryData, null, 2), 'utf8');
    console.log(`💾 Summary saved to: ${filepath}`);
    return filepath;
  }

  async saveQuestions(scrapedData, questions) {
    const filename = `${scrapedData.kanda}_sarga_${scrapedData.sarga}_questions.json`;
    const filepath = path.join(this.questionsDir, filename);
    
    const questionsData = {
      epic_id: scrapedData.epic_id,
      kanda: scrapedData.kanda,
      sarga: scrapedData.sarga,
      source_url: scrapedData.source_url,
      generation_date: new Date().toISOString(),
      generator: 'openai-gpt4-batch',
      total_questions: questions.length,
      questions: questions
    };
    
    await fs.writeFile(filepath, JSON.stringify(questionsData, null, 2), 'utf8');
    console.log(`💾 Questions saved to: ${filepath}`);
    return filepath;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const sargasArg = args.find(arg => arg.startsWith('--sargas='));
  const multipassFlag = args.includes('--multipass');
  
  if (!sargasArg) {
    console.error('❌ Usage: node generate-batch-multipass.js --sargas=17,18 --multipass');
    console.error('   Example: node generate-batch-multipass.js --sargas=19,20');
    process.exit(1);
  }
  
  const sargasStr = sargasArg.split('=')[1];
  const sargaNumbers = sargasStr.split(',').map(s => parseInt(s.trim()));
  
  if (sargaNumbers.length !== 2) {
    console.error('❌ Batch generator expects exactly 2 Sarga numbers');
    console.error('   Example: --sargas=17,18');
    process.exit(1);
  }
  
  if (sargaNumbers.some(isNaN)) {
    console.error('❌ Invalid Sarga numbers provided');
    process.exit(1);
  }
  
  const generator = new BatchOpenAIContentGenerator();
  
  try {
    const results = await generator.generateBatchContent(sargaNumbers, multipassFlag);
    
    console.log('\\n📊 Batch Generation Summary:');
    results.forEach(result => {
      console.log(`- Sarga: ${result.sarga}`);
      console.log(`- Summary title: ${result.summary.title}`);
      console.log(`- Questions generated: ${result.questions.length}`);
      console.log(`- Key events: ${result.summary.key_events.length}`);
    });
    
    console.log('\\n💰 Cost Optimization Achieved: $1 for 2 Sargas (50% savings)');
    console.log('✨ Batch content generation pipeline completed successfully!');
    console.log('📁 Check generated-content/summaries/ and generated-content/questions/ directories');
    
  } catch (error) {
    console.error('\\n❌ Batch content generation failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('💡 Set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = BatchOpenAIContentGenerator;

// Run if called directly
if (require.main === module) {
  main();
}