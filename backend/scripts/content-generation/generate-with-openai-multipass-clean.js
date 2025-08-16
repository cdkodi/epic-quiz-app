#!/usr/bin/env node

/**
 * Enhanced OpenAI Content Generation Script with Generic Template Multi-Pass Support
 * 
 * Generates chapter summaries and quiz questions using generic thematic template approach
 * Usage: node generate-with-openai-multipass-clean.js --input=structured_bala_kanda_sarga_42.json [--multipass]
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class EnhancedOpenAIContentGenerator {
  constructor() {
    this.inputDir = path.join(__dirname, '../../generated-content/scraped');
    this.summariesDir = path.join(__dirname, '../../generated-content/summaries');
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  // Generate generic thematic passes for any sarga - no manual configuration needed!
  generateGenericPasses(sarga, totalVerses) {
    const third = Math.ceil(totalVerses / 3);
    const twoThirds = Math.ceil((totalVerses * 2) / 3);
    
    console.log(`📊 Sarga ${sarga}: Dividing ${totalVerses} verses into 3 passes: 1-${third}, ${third + 1}-${twoThirds}, ${twoThirds + 1}-end`);
    
    return [
      {
        name: "Characters & Setting",
        verseRange: [1, third],
        focus: "main characters, their relationships, setting and context",
        categories: ["characters", "culture"]
      },
      {
        name: "Events & Actions", 
        verseRange: [third + 1, twoThirds],
        focus: "key events, actions taken, plot developments",
        categories: ["events", "themes"]
      },
      {
        name: "Themes & Philosophy",
        verseRange: [twoThirds + 1, -1],
        focus: "deeper themes, philosophical insights, spiritual significance",
        categories: ["themes", "culture"]
      }
    ];
  }

  async generateContent(inputFilename, useMultipass = false) {
    console.log(`🤖 Starting ${useMultipass ? 'Generic Template Multi-Pass' : 'Standard'} OpenAI content generation...`);
    
    const inputPath = path.join(this.inputDir, inputFilename);
    
    let scrapedData;
    try {
      const fileContent = await fs.readFile(inputPath, 'utf8');
      scrapedData = JSON.parse(fileContent);
      console.log(`📖 Loaded scraped data: ${scrapedData.verses.length} verses from ${scrapedData.kanda} Sarga ${scrapedData.sarga}`);
    } catch (error) {
      console.error(`❌ Failed to load input file ${inputPath}:`, error.message);
      throw error;
    }
    
    // Generate comprehensive chapter summary
    console.log('\\n📝 Generating comprehensive chapter summary...');
    const summary = await this.generateChapterSummary(scrapedData);
    await this.saveSummary(scrapedData, summary);
    
    // Generate quiz questions using generic template multipass method
    let allQuestions;
    if (useMultipass) {
      console.log('\\n🎯 Using generic template multi-pass question generation...');
      allQuestions = await this.generateMultiPassQuestions(scrapedData);
    } else {
      console.log('\\n🎯 Using standard question generation...');
      allQuestions = await this.generateStandardQuestions(scrapedData);
    }
    
    await this.saveQuestions(scrapedData, allQuestions);
    
    console.log('\\n✅ Content generation completed successfully!');
    
    return {
      summary: summary,
      questions: allQuestions,
      sourceData: scrapedData
    };
  }

  async generateMultiPassQuestions(scrapedData) {
    const sarga = scrapedData.sarga;
    
    // Generate generic template passes for this sarga
    const totalVerses = scrapedData.verses.length;
    const passes = this.generateGenericPasses(sarga, totalVerses);
    
    console.log(`📋 Using generic template: Executing ${passes.length} thematic passes for Sarga ${sarga}`);
    
    let allQuestions = [];
    let passNumber = 1;
    
    for (const pass of passes) {
      console.log(`\\n🔄 Pass ${passNumber}: ${pass.name}`);
      
      // Extract verses for this pass
      let passVerses;
      if (pass.verseRange[1] === -1) {
        // From start to end
        passVerses = scrapedData.verses.slice(pass.verseRange[0] - 1);
      } else {
        // Specific range
        passVerses = scrapedData.verses.slice(pass.verseRange[0] - 1, pass.verseRange[1]);
      }
      
      console.log(`   📄 Processing verses ${pass.verseRange[0]} to ${pass.verseRange[1] === -1 ? 'end' : pass.verseRange[1]} (${passVerses.length} verses)`);
      
      // Create pass-specific content structure
      const passContent = {
        ...scrapedData,
        verses: passVerses
      };
      
      // Generate questions for this pass
      const passQuestions = await this.generatePassQuestions(passContent, pass, passNumber);
      allQuestions = allQuestions.concat(passQuestions);
      
      console.log(`   ✅ Generated ${passQuestions.length} questions for pass ${passNumber}`);
      passNumber++;
    }
    
    // Remove duplicates and ensure balance
    const unique = this.removeDuplicateQuestions(allQuestions);
    console.log(`\\n🔍 Final question set: ${unique.length} unique questions (removed ${allQuestions.length - unique.length} duplicates)`);
    
    return unique;
  }

  // Standard generation method (fallback)
  async generateStandardQuestions(scrapedData) {
    const prompt = this.buildQuestionsPrompt(scrapedData);
    let response;
    
    try {
      response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 1800,
        temperature: 0.2
      });
      
      const questions = JSON.parse(response);
      console.log(`✅ Generated ${questions.length} quiz questions (standard method)`);
      return questions;
      
    } catch (error) {
      console.error('❌ Failed to generate quiz questions:', error.message);
      throw error;
    }
  }

  async generateChapterSummary(scrapedData) {
    const prompt = this.buildSummaryPrompt(scrapedData);
    let response;
    
    try {
      response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 1500,
        temperature: 0.3
      });
      
      const summary = JSON.parse(response);
      console.log(`✅ Generated chapter summary: ${summary.title}`);
      return summary;
      
    } catch (error) {
      console.error('❌ Failed to generate chapter summary:', error.message);
      throw error;
    }
  }

  async generatePassQuestions(scrapedData, passConfig, passNumber) {
    const prompt = this.buildPassQuestionsPrompt(scrapedData, passConfig, passNumber);
    let response;
    
    try {
      response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 2500,
        temperature: 0.25
      });
      
      const questions = JSON.parse(response);
      
      // Add pass metadata to each question
      const questionsWithPassInfo = questions.map(q => ({
        ...q,
        pass_info: {
          pass_number: passNumber,
          pass_name: passConfig.name,
          verse_range: passConfig.verseRange,
        }
      }));
      
      return questionsWithPassInfo;
      
    } catch (error) {
      console.error(`❌ Failed to generate questions for pass ${passNumber}:`, error.message);
      throw error;
    }
  }

  buildPassQuestionsPrompt(scrapedData, passConfig, passNumber) {
    // Filter and clean verses for this pass
    const cleanedVerses = scrapedData.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 12) // Limit verses for prompt efficiency
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 150),
        translation: this.cleanTranslation(verse.translation).substring(0, 250)
      }));
    
    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit}\\nTranslation: ${verse.translation}`)
      .join('\\n\\n');
    
    return `Generate exactly 4 high-quality quiz questions for Pass ${passNumber}: "${passConfig.name}" from Valmiki Ramayana ${scrapedData.kanda} Sarga ${scrapedData.sarga}.

PASS FOCUS: ${passConfig.focus}
TARGET CATEGORIES: ${passConfig.categories.join(', ')}

Generate exactly 4 questions with this distribution:
- 1 easy question from primary category
- 1 medium question from secondary category  
- 1 medium question combining both categories
- 1 hard question with deep analysis

TEXT TO ANALYZE:
${versesText}

REQUIREMENTS:
- Each question must have exactly 4 multiple choice options
- Include correct_answer_id (0-3)
- Provide basic_explanation for each question
- Include original Sanskrit quote with English translation
- Add relevant tags array
- Use NEW format with "category", "question_text", "options", "correct_answer_id"

RESPONSE FORMAT (JSON):
[
  {
    "category": "characters",
    "difficulty": "easy",
    "question_text": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer_id": 0,
    "basic_explanation": "...",
    "original_quote": "Sanskrit text",
    "quote_translation": "English translation",
    "tags": ["tag1", "tag2"],
    "cross_epic_tags": ["theme1", "theme2"]
  }
]`;
  }

  buildQuestionsPrompt(scrapedData) {
    // Standard question generation (legacy method)
    const cleanedVerses = scrapedData.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 8)
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 150),
        translation: this.cleanTranslation(verse.translation).substring(0, 250)
      }));
    
    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit}\\nTranslation: ${verse.translation}`)
      .join('\\n\\n');
    
    return `Generate exactly 4 quiz questions from Valmiki Ramayana ${scrapedData.kanda} Sarga ${scrapedData.sarga}:
- 1 CHARACTERS question (easy)
- 1 EVENTS question (easy)  
- 1 THEMES question (medium)
- 1 CULTURE question (medium)

Text: ${versesText}

Response format (JSON):
[
  {
    "question": "...",
    "type": "CHARACTERS",
    "difficulty": "easy",
    "answers": [
      {"answer": "...", "isCorrect": true},
      {"answer": "...", "isCorrect": false}
    ]
  }
]`;
  }

  buildSummaryPrompt(scrapedData) {
    const cleanedVerses = scrapedData.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 6) // Reduced from 15 to 6 for token limit
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 100), // Reduced from 200 to 100
        translation: this.cleanTranslation(verse.translation).substring(0, 150) // Limit to 150 chars
      }));
    
    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit}\\nTranslation: ${verse.translation}`)
      .join('\\n\\n');
    
    return `Generate a comprehensive summary for Valmiki Ramayana ${scrapedData.kanda} Sarga ${scrapedData.sarga}:

${versesText}

Response format (JSON):
{
  "title": "Brief descriptive title",
  "summary": "2-3 paragraph summary covering key events and themes",
  "key_characters": ["character1", "character2"],
  "main_themes": ["theme1", "theme2"], 
  "cultural_significance": "1-2 sentences on cultural/spiritual importance"
}`;
  }

  cleanTranslation(text) {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\\[.*?\\]/g, '') // Remove bracketed content
      .replace(/Valmiki Ramayana.*?sarga/gi, '') // Remove header repetition
      .replace(/Book I.*?chapter/gi, '') // Remove book references
      .replace(/Verse Locator.*$/gi, '') // Remove verse locator
      .replace(/\\n+/g, ' ') // Replace newlines with spaces
      .replace(/\\s+/g, ' ') // Replace multiple spaces with single
      .split(' ').slice(0, 30).join(' ') // Limit to first 30 words
      .trim();
  }

  removeDuplicateQuestions(questions) {
    const seen = new Set();
    const unique = [];
    
    for (const question of questions) {
      const key = (question.question_text || question.question || '').toLowerCase().trim();
      if (!seen.has(key) && key.length > 10) {
        seen.add(key);
        unique.push(question);
      }
    }
    
    return unique;
  }

  async callOpenAI(prompt, options = {}) {
    const requestBody = {
      model: options.model || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in Sanskrit literature, Hindu philosophy, and educational content creation. Generate accurate, culturally sensitive quiz questions and summaries."
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
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
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
      generator: 'openai-gpt4-multipass',
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
      generator: 'openai-gpt4-multipass',
      total_questions: questions.length,
      questions: questions
    };
    
    await fs.writeFile(filepath, JSON.stringify(questionsData, null, 2), 'utf8');
    console.log(`💾 Questions saved to: ${filepath}`);
    return filepath;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(arg => arg.startsWith('--input='));
  const useMultipass = args.includes('--multipass');
  
  if (!inputArg) {
    console.error('❌ Usage: node generate-with-openai-multipass-clean.js --input=structured_bala_kanda_sarga_42.json [--multipass]');
    process.exit(1);
  }
  
  const inputFilename = inputArg.split('=')[1];
  
  try {
    const generator = new EnhancedOpenAIContentGenerator();
    const result = await generator.generateContent(inputFilename, useMultipass);
    
    console.log('\\n🎉 Generation completed successfully!');
    console.log(`📄 Summary: ${result.summary.title}`);
    console.log(`❓ Questions: ${result.questions.length} generated`);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { EnhancedOpenAIContentGenerator };