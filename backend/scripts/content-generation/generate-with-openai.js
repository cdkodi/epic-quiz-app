#!/usr/bin/env node

/**
 * ⚠️ DEPRECATED SCRIPT - DO NOT USE ⚠️
 * 
 * This script only generates 4 questions and is DEPRECATED.
 * 
 * ✅ USE THIS INSTEAD:
 * node generate-with-openai-multipass.js --input=structured_bala_kanda_sarga_X.json --multipass
 * 
 * The multipass script generates 12+ questions for complete coverage.
 * 
 * ❌ LEGACY: OpenAI Content Generation Script for Valmiki Ramayana (DEPRECATED)
 * ❌ PROBLEM: Only generates 4 questions instead of required 12+
 * ❌ Usage: DO NOT USE - node generate-with-openai.js --input=structured_bala_kanda_sarga_2.json
 */

console.error(`
🚨 ERROR: DEPRECATED SCRIPT USAGE DETECTED 🚨

This script (generate-with-openai.js) is DEPRECATED and only produces 4 questions.

✅ USE THIS INSTEAD:
node generate-with-openai-multipass.js --input=structured_bala_kanda_sarga_X.json --multipass

This will generate 12+ questions for complete content coverage.

Exiting to prevent low-quality content generation...
`);

process.exit(1);

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class OpenAIContentGenerator {
  constructor() {
    this.inputDir = path.join(__dirname, '../../generated-content/scraped');
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  async generateContent(inputFilename) {
    console.log('🤖 Starting OpenAI content generation...');
    
    // Ensure output directories exist
    await Promise.all([
      fs.mkdir(this.summariesDir, { recursive: true }),
      fs.mkdir(this.questionsDir, { recursive: true })
    ]);
    
    // Load scraped content
    const inputPath = path.join(this.inputDir, inputFilename);
    const rawContent = await fs.readFile(inputPath, 'utf8');
    const scrapedData = JSON.parse(rawContent);
    
    console.log(`📖 Loaded content: ${scrapedData.epic_id} ${scrapedData.kanda} Sarga ${scrapedData.sarga}`);
    console.log(`📊 Processing ${scrapedData.verses.length} verses`);
    
    // Generate chapter summary
    console.log('\n📝 Generating chapter summary...');
    const summary = await this.generateChapterSummary(scrapedData);
    await this.saveSummary(scrapedData, summary);
    
    // Generate quiz questions
    console.log('\n🎯 Generating quiz questions...');
    const questions = await this.generateQuizQuestions(scrapedData);
    await this.saveQuestions(scrapedData, questions);
    
    console.log('\n✅ Content generation completed successfully!');
    
    return {
      summary: summary,
      questions: questions,
      sourceData: scrapedData
    };
  }

  async generateChapterSummary(scrapedData) {
    const prompt = this.buildSummaryPrompt(scrapedData);
    
    try {
      const response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 1000,
        temperature: 0.3
      });
      
      const summary = JSON.parse(response);
      console.log('✅ Chapter summary generated successfully');
      return summary;
      
    } catch (error) {
      console.error('❌ Failed to generate chapter summary:', error.message);
      throw error;
    }
  }

  buildSummaryPrompt(scrapedData) {
    const versesText = scrapedData.verses
      .slice(0, 10) // Use first 10 verses to avoid token limits
      .map(verse => `Verse ${verse.number}:\nSanskrit: ${verse.sanskrit.substring(0, 200)}\nTranslation: ${verse.translation.substring(0, 300)}`)
      .join('\n\n');

    return `Based on the following Sanskrit verses and translations from ${scrapedData.kanda} Sarga ${scrapedData.sarga} of the Valmiki Ramayana:

${versesText}

Generate a comprehensive chapter summary with the following structure. Return ONLY valid JSON in exactly this format:

{
  "title": "Descriptive title for this Sarga",
  "key_events": [
    "Event 1 description",
    "Event 2 description", 
    "Event 3 description"
  ],
  "main_characters": [
    "Character name with brief description"
  ],
  "themes": [
    "Theme 1",
    "Theme 2"
  ],
  "cultural_significance": "Paragraph explaining religious, philosophical, or cultural importance",
  "narrative_summary": "2-3 paragraph prose summary of the complete story"
}

Requirements:
- Maintain cultural sensitivity and accuracy to Hindu traditions
- Use proper Sanskrit terms with brief explanations where needed
- Connect to the broader Ramayana narrative arc
- Focus on the spiritual and literary significance
- Be educational and engaging for modern readers`;
  }

  async generateQuizQuestions(scrapedData) {
    const prompt = this.buildQuestionsPrompt(scrapedData);
    let response;
    
    try {
      response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 1800, // Increased to allow full JSON completion
        temperature: 0.2
      });
      
      console.log('📝 Raw OpenAI response:', response.substring(0, 500) + '...');
      
      const questions = JSON.parse(response);
      console.log(`✅ Generated ${questions.length} quiz questions`);
      return questions;
      
    } catch (error) {
      console.error('❌ Failed to generate quiz questions:', error.message);
      if (error.message.includes('JSON') && response) {
        console.log('📝 Full OpenAI response that failed to parse:', response);
        // Save the failed response for debugging
        const debugPath = path.join(__dirname, `debug_response_${Date.now()}.txt`);
        await fs.writeFile(debugPath, response, 'utf8');
        console.log(`🐛 Saved failed response to: ${debugPath}`);
      }
      throw error;
    }
  }

  buildQuestionsPrompt(scrapedData) {
    // Clean and prepare verse content - remove HTML artifacts
    const cleanedVerses = scrapedData.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 8) // Use first 8 verses to manage token limits
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 150),
        translation: this.cleanTranslation(verse.translation).substring(0, 250)
      }));

    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\nSanskrit: ${verse.sanskrit}\nTranslation: ${verse.translation}`)
      .join('\n\n');

    return `Generate exactly 4 quiz questions from Valmiki Ramayana ${scrapedData.kanda} Sarga ${scrapedData.sarga}:

- 1 CHARACTERS question (easy)
- 1 EVENTS question (medium)  
- 1 THEMES question (medium)
- 1 CULTURE question (hard)

Content:
${versesText}

Return ONLY valid JSON array:

[
  {
    "category": "characters|events|themes|culture",
    "difficulty": "easy|medium|hard",
    "question_text": "Question about the content matching the specified difficulty",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer_id": 0,
    "basic_explanation": "Educational explanation of the answer",
    "original_quote": "Sanskrit quote from the verses",
    "quote_translation": "English translation of the Sanskrit quote",
    "tags": ["relevant", "tags"],
    "cross_epic_tags": ["universal", "themes"]
  }
]

QUALITY STANDARDS:
- Factually accurate to source material
- Culturally respectful and authentic
- Educationally valuable for learning about Hindu philosophy and literature
- Questions test understanding, not just memorization
- Sanskrit quotes must be from the actual provided verses
- Translations must be accurate and contextually appropriate`;
  }

  cleanTranslation(translation) {
    // Remove HTML artifacts and clean up translation text
    return translation
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500); // Limit length to avoid token issues
  }

  async callOpenAI(prompt, options = {}) {
    const requestBody = {
      model: options.model || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Sanskrit scholar and educator specializing in the Valmiki Ramayana. You create culturally accurate, educationally valuable content that respects Hindu traditions and helps modern learners understand classical literature."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: options.max_tokens || 2000,
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
      generator: 'openai-gpt4',
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
      generator: 'openai-gpt4',
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
  const inputArg = args.find(arg => arg.startsWith('--input='));
  
  if (!inputArg) {
    console.error('❌ Usage: node generate-with-openai.js --input=structured_bala_kanda_sarga_2.json');
    console.error('   Make sure OPENAI_API_KEY environment variable is set');
    process.exit(1);
  }
  
  const inputFilename = inputArg.split('=')[1];
  
  const generator = new OpenAIContentGenerator();
  
  try {
    const result = await generator.generateContent(inputFilename);
    
    console.log('\n📊 Generation Summary:');
    console.log(`- Epic: ${result.sourceData.epic_id}`);
    console.log(`- Kanda: ${result.sourceData.kanda}`);
    console.log(`- Sarga: ${result.sourceData.sarga}`);
    console.log(`- Source verses: ${result.sourceData.verses.length}`);
    console.log(`- Generated questions: ${result.questions.length}`);
    console.log(`- Summary title: ${result.summary.title}`);
    console.log(`- Key events: ${result.summary.key_events.length}`);
    
    console.log('\n✨ Content generation pipeline completed successfully!');
    console.log('📁 Check generated-content/summaries/ and generated-content/questions/ directories');
    
  } catch (error) {
    console.error('\n❌ Content generation failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('💡 Set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = OpenAIContentGenerator;

// Run if called directly
if (require.main === module) {
  main();
}