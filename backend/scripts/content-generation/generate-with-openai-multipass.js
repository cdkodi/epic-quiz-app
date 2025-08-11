#!/usr/bin/env node

/**
 * Enhanced OpenAI Content Generation Script with Multi-Pass Support
 * 
 * Generates chapter summaries and quiz questions using thematic multi-pass approach
 * Usage: node generate-with-openai-multipass.js --input=structured_bala_kanda_sarga_2.json [--multipass]
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
    
    // Thematic pass configurations for different Sargas
    this.thematicPasses = {
      // Configuration for Sarga 2: Valmiki's encounter at Tamasa River
      2: [
        {
          name: "Narada's Departure & Sacred Journey",
          verseRange: [1, 10],
          focus: "characters, spiritual practices, teacher-disciple relationships",
          categories: ["characters", "culture"]
        },
        {
          name: "The Krauncha Birds Incident", 
          verseRange: [11, 20],
          focus: "key events, emotional response, spontaneous poetry creation",
          categories: ["events", "themes"]
        },
        {
          name: "Divine Intervention & Epic Commission",
          verseRange: [21, -1], // -1 means to end of content
          focus: "divine characters, epic creation mandate, cosmic purpose",
          categories: ["culture", "themes"]
        }
      ]
    };
  }

  async generateContent(inputFilename, useMultipass = false) {
    console.log(`🤖 Starting ${useMultipass ? 'Multi-Pass' : 'Standard'} OpenAI content generation...`);
    
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
    
    // Generate chapter summary (using representative verses from all sections)
    console.log('\\n📝 Generating comprehensive chapter summary...');
    const summary = await this.generateChapterSummary(scrapedData);
    await this.saveSummary(scrapedData, summary);
    
    // Generate quiz questions using appropriate method
    let allQuestions;
    if (useMultipass && this.thematicPasses[scrapedData.sarga]) {
      console.log('\\n🎯 Using multi-pass question generation...');
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
    const passes = this.thematicPasses[sarga];
    
    if (!passes) {
      console.log(`⚠️  No multi-pass configuration for Sarga ${sarga}, falling back to standard generation`);
      return await this.generateStandardQuestions(scrapedData);
    }
    
    console.log(`📋 Executing ${passes.length} thematic passes for Sarga ${sarga}`);
    
    let allQuestions = [];
    let passNumber = 1;
    
    for (const pass of passes) {
      console.log(`\\n🔄 Pass ${passNumber}: ${pass.name}`);
      
      // Extract verses for this pass
      const passVerses = this.extractVerseRange(scrapedData.verses, pass.verseRange);
      console.log(`   📖 Using verses ${pass.verseRange[0]}-${pass.verseRange[1] === -1 ? 'end' : pass.verseRange[1]} (${passVerses.length} verses)`);
      
      // Create pass-specific content structure
      const passContent = {
        ...scrapedData,
        verses: passVerses
      };
      
      // Generate questions for this pass
      const passQuestions = await this.generatePassQuestions(passContent, pass, passNumber);
      allQuestions = allQuestions.concat(passQuestions);
      
      console.log(`   ✅ Generated ${passQuestions.length} questions for ${pass.name}`);
      passNumber++;
      
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Remove potential duplicates and ensure quality
    const uniqueQuestions = this.deduplicateQuestions(allQuestions);
    console.log(`\\n📊 Multi-pass summary: ${allQuestions.length} total → ${uniqueQuestions.length} unique questions`);
    
    return uniqueQuestions;
  }

  extractVerseRange(verses, range) {
    const [start, end] = range;
    const endIndex = end === -1 ? verses.length : Math.min(end, verses.length);
    return verses.slice(start - 1, endIndex); // Convert to 0-based indexing
  }

  async generatePassQuestions(passContent, passConfig, passNumber) {
    const prompt = this.buildPassSpecificPrompt(passContent, passConfig, passNumber);
    let response;
    
    try {
      response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 1800,
        temperature: 0.2
      });
      
      const questions = JSON.parse(response);
      
      // Add pass metadata to questions
      return questions.map(q => ({
        ...q,
        pass_info: {
          pass_number: passNumber,
          pass_name: passConfig.name,
          verse_range: passConfig.verseRange
        }
      }));
      
    } catch (error) {
      console.error(`❌ Failed to generate questions for pass ${passNumber}:`, error.message);
      if (error.message.includes('JSON') && response) {
        const debugPath = path.join(__dirname, `debug_pass_${passNumber}_${Date.now()}.txt`);
        await fs.writeFile(debugPath, response, 'utf8');
        console.log(`🐛 Saved failed response to: ${debugPath}`);
      }
      // Return empty array instead of throwing to continue with other passes
      return [];
    }
  }

  buildPassSpecificPrompt(passContent, passConfig, passNumber) {
    // Clean and prepare verse content for this pass
    const cleanedVerses = passContent.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 10) // Use up to 10 verses per pass to manage tokens
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 150),
        translation: this.cleanTranslation(verse.translation).substring(0, 250)
      }));

    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit}\\nTranslation: ${verse.translation}`)
      .join('\\n\\n');

    return `Generate exactly 4 quiz questions from Valmiki Ramayana ${passContent.kanda} Sarga ${passContent.sarga} - ${passConfig.name}:

THEMATIC FOCUS: ${passConfig.focus}
TARGET CATEGORIES: Focus on ${passConfig.categories.join(' and ')} questions
VERSE RANGE: ${passConfig.verseRange[0]}-${passConfig.verseRange[1] === -1 ? 'end' : passConfig.verseRange[1]}

Content from this thematic section:
${versesText}

Generate questions with this distribution:
- 2 questions from primary categories: ${passConfig.categories.join(', ')}
- 2 questions covering other aspects of this section
- Difficulty levels: 1 easy, 2 medium, 1 hard

Return ONLY valid JSON array:

[
  {
    "category": "characters|events|themes|culture",
    "difficulty": "easy|medium|hard",
    "question_text": "Question focusing on the thematic section",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer_id": 0,
    "basic_explanation": "Educational explanation connecting to the theme",
    "original_quote": "Sanskrit quote from this section's verses",
    "quote_translation": "English translation of the Sanskrit quote",
    "tags": ["thematic", "tags"],
    "cross_epic_tags": ["universal", "themes"]
  }
]

QUALITY STANDARDS:
- Questions must be directly based on the provided verse content
- Sanskrit quotes must be from the actual verses in this section
- Focus on the specific themes and characters in this narrative section
- Ensure educational value for understanding this part of the story`;
  }

  deduplicateQuestions(questions) {
    const seen = new Set();
    const unique = [];
    
    for (const question of questions) {
      // Create a signature based on question text and category
      const signature = `${question.category}:${question.question_text.substring(0, 50)}`;
      
      if (!seen.has(signature)) {
        seen.add(signature);
        unique.push(question);
      }
    }
    
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
    // Use representative verses from different sections for comprehensive summary
    const totalVerses = scrapedData.verses.length;
    const sampleVerses = [
      ...scrapedData.verses.slice(0, 3), // Beginning
      ...scrapedData.verses.slice(Math.floor(totalVerses/3), Math.floor(totalVerses/3) + 3), // Middle
      ...scrapedData.verses.slice(-3) // End
    ].filter(verse => verse.sanskrit && verse.translation);

    const versesText = sampleVerses
      .map(verse => `Verse ${verse.number}:\\nSanskrit: ${verse.sanskrit.substring(0, 200)}\\nTranslation: ${verse.translation.substring(0, 300)}`)
      .join('\\n\\n');

    return `Based on the following representative Sanskrit verses and translations from ${scrapedData.kanda} Sarga ${scrapedData.sarga} of the Valmiki Ramayana:

${versesText}

Generate a comprehensive chapter summary with the following structure. Return ONLY valid JSON:

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

Content:
${versesText}

Return ONLY valid JSON array with the standard question format.`;
  }

  cleanTranslation(translation) {
    return translation
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim()
      .substring(0, 500);
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

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(arg => arg.startsWith('--input='));
  const multipassFlag = args.includes('--multipass');
  
  if (!inputArg) {
    console.error('❌ Usage: node generate-with-openai-multipass.js --input=structured_bala_kanda_sarga_2.json [--multipass]');
    console.error('   Add --multipass flag to use enhanced multi-pass generation');
    process.exit(1);
  }
  
  const inputFilename = inputArg.split('=')[1];
  
  const generator = new EnhancedOpenAIContentGenerator();
  
  try {
    const result = await generator.generateContent(inputFilename, multipassFlag);
    
    console.log('\\n📊 Generation Summary:');
    console.log(`- Epic: ${result.sourceData.epic_id}`);
    console.log(`- Kanda: ${result.sourceData.kanda}`);
    console.log(`- Sarga: ${result.sourceData.sarga}`);
    console.log(`- Source verses: ${result.sourceData.verses.length}`);
    console.log(`- Generated questions: ${result.questions.length}`);
    console.log(`- Summary title: ${result.summary.title}`);
    console.log(`- Key events: ${result.summary.key_events.length}`);
    console.log(`- Generation method: ${multipassFlag ? 'Multi-pass thematic' : 'Standard'}`);
    
    console.log('\\n✨ Content generation pipeline completed successfully!');
    console.log('📁 Check generated-content/summaries/ and generated-content/questions/ directories');
    
  } catch (error) {
    console.error('\\n❌ Content generation failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('💡 Set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = EnhancedOpenAIContentGenerator;

// Run if called directly
if (require.main === module) {
  main();
}