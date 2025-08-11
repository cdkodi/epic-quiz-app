#!/usr/bin/env node

/**
 * Hard Questions Add-On Script for Existing Sarga Content
 * 
 * Generates targeted hard difficulty questions to supplement existing content
 * Usage: node generate-hard-questions-addon.js --input=structured_bala_kanda_sarga_2.json
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class HardQuestionsAddon {
  constructor() {
    this.inputDir = path.join(__dirname, '../../generated-content/scraped');
    this.questionsDir = path.join(__dirname, '../../generated-content/questions');
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    // Hard question focus areas for Sarga 2
    this.hardQuestionThemes = {
      2: [
        {
          name: "Philosophical Foundations of Sanskrit Poetry",
          verseRange: [1, 10],
          focus: "guru-disciple transmission, spiritual authority, sacred knowledge",
          complexity: "Analyze the epistemological framework of traditional knowledge transmission"
        },
        {
          name: "Aesthetic Theory and Divine Inspiration", 
          verseRange: [11, 20],
          focus: "rasa theory, spontaneous creation, emotion as catalyst for art",
          complexity: "Examine the transformation of personal grief into universal artistic expression"
        },
        {
          name: "Cosmic Creation and Literary Genesis",
          verseRange: [21, -1],
          focus: "Brahma's creative principle, divine mandate, epic as dharmic instrument",
          complexity: "Evaluate the parallel between cosmic creation and poetic creation in Hindu thought"
        }
      ]
    };
  }

  async generateHardQuestions(inputFilename) {
    console.log('🎯 Starting Hard Questions Add-On generation...');
    
    // Load scraped content
    const inputPath = path.join(this.inputDir, inputFilename);
    const rawContent = await fs.readFile(inputPath, 'utf8');
    const scrapedData = JSON.parse(rawContent);
    
    console.log(`📖 Loaded content: ${scrapedData.epic_id} ${scrapedData.kanda} Sarga ${scrapedData.sarga}`);
    
    const sarga = scrapedData.sarga;
    const themes = this.hardQuestionThemes[sarga];
    
    if (!themes) {
      throw new Error(`No hard question themes configured for Sarga ${sarga}`);
    }
    
    console.log(`🧠 Generating ${themes.length} hard difficulty questions...`);
    
    let hardQuestions = [];
    let themeNumber = 1;
    
    for (const theme of themes) {
      console.log(`\n🔥 Theme ${themeNumber}: ${theme.name}`);
      
      // Extract verses for this theme
      const themeVerses = this.extractVerseRange(scrapedData.verses, theme.verseRange);
      console.log(`   📖 Using verses ${theme.verseRange[0]}-${theme.verseRange[1] === -1 ? 'end' : theme.verseRange[1]} (${themeVerses.length} verses)`);
      
      // Create theme-specific content structure
      const themeContent = {
        ...scrapedData,
        verses: themeVerses
      };
      
      // Generate hard question for this theme
      const hardQuestion = await this.generateThemeHardQuestion(themeContent, theme, themeNumber);
      if (hardQuestion) {
        hardQuestions.push(hardQuestion);
        console.log(`   ✅ Generated hard question: ${theme.name}`);
      }
      
      themeNumber++;
      
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`\n📊 Generated ${hardQuestions.length} hard questions`);
    
    // Save as addon file
    await this.saveHardQuestionsAddon(scrapedData, hardQuestions);
    
    return hardQuestions;
  }

  extractVerseRange(verses, range) {
    const [start, end] = range;
    const endIndex = end === -1 ? verses.length : Math.min(end, verses.length);
    return verses.slice(start - 1, endIndex); // Convert to 0-based indexing
  }

  async generateThemeHardQuestion(themeContent, theme, themeNumber) {
    const prompt = this.buildHardQuestionPrompt(themeContent, theme, themeNumber);
    
    try {
      const response = await this.callOpenAI(prompt, {
        model: "gpt-4",
        max_tokens: 800,
        temperature: 0.1 // Lower temperature for more focused, scholarly responses
      });
      
      const question = JSON.parse(response);
      
      // Add theme metadata
      return {
        ...question,
        theme_info: {
          theme_number: themeNumber,
          theme_name: theme.name,
          verse_range: theme.verseRange,
          complexity_focus: theme.complexity
        }
      };
      
    } catch (error) {
      console.error(`❌ Failed to generate hard question for theme ${themeNumber}:`, error.message);
      return null;
    }
  }

  buildHardQuestionPrompt(themeContent, theme, themeNumber) {
    // Use representative verses from the theme section
    const cleanedVerses = themeContent.verses
      .filter(verse => verse.sanskrit && verse.translation)
      .slice(0, 6) // Use up to 6 verses for deeper context
      .map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit.substring(0, 200),
        translation: this.cleanTranslation(verse.translation).substring(0, 300)
      }));

    const versesText = cleanedVerses
      .map(verse => `Verse ${verse.number}:\nSanskrit: ${verse.sanskrit}\nTranslation: ${verse.translation}`)
      .join('\n\n');

    return `Generate exactly 1 HARD difficulty quiz question from Valmiki Ramayana ${themeContent.kanda} Sarga ${themeContent.sarga}.

THEMATIC FOCUS: ${theme.name}
COMPLEXITY REQUIREMENT: ${theme.complexity}
CONTENT FOCUS: ${theme.focus}

Content from this thematic section:
${versesText}

Create a HARD question that requires:
- Advanced understanding of Hindu philosophy and Sanskrit literary theory
- Cross-textual analysis or comparative interpretation
- Complex synthesis of multiple concepts
- Deep cultural and spiritual insight

Return ONLY valid JSON object:

{
  "category": "themes|culture|characters|events",
  "difficulty": "hard",
  "question_text": "Complex analytical question requiring deep scholarly understanding",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer_id": 0,
  "basic_explanation": "Comprehensive explanation connecting multiple concepts and providing scholarly context",
  "original_quote": "Sanskrit quote that supports the complex analysis",
  "quote_translation": "English translation of the Sanskrit quote",
  "tags": ["advanced", "philosophical", "scholarly"],
  "cross_epic_tags": ["sanskrit_poetics", "hindu_philosophy", "aesthetic_theory"]
}

QUALITY STANDARDS FOR HARD QUESTIONS:
- Question should challenge advanced students of Hindu studies
- Explanation should provide educational value beyond basic comprehension
- Must connect to broader themes in Sanskrit literature or Hindu philosophy
- Sanskrit quote should be integral to the complex concept being tested
- Avoid questions that can be answered through simple recall`;
  }

  cleanTranslation(translation) {
    return translation
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500);
  }

  async callOpenAI(prompt, options = {}) {
    const requestBody = {
      model: options.model || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a distinguished Sanskrit scholar and expert in Hindu philosophy, specializing in advanced analysis of the Valmiki Ramayana. You create intellectually rigorous questions that test deep understanding of classical Indian literature, aesthetic theory, and spiritual concepts."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: options.max_tokens || 1000,
      temperature: options.temperature || 0.1
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

  async saveHardQuestionsAddon(scrapedData, hardQuestions) {
    const filename = `${scrapedData.kanda}_sarga_${scrapedData.sarga}_hard_questions_addon.json`;
    const filepath = path.join(this.questionsDir, filename);
    
    const addonData = {
      epic_id: scrapedData.epic_id,
      kanda: scrapedData.kanda,
      sarga: scrapedData.sarga,
      source_url: scrapedData.source_url,
      generation_date: new Date().toISOString(),
      generator: 'openai-gpt4-hard-addon',
      addon_type: 'hard_difficulty_supplement',
      total_hard_questions: hardQuestions.length,
      questions: hardQuestions
    };
    
    await fs.writeFile(filepath, JSON.stringify(addonData, null, 2), 'utf8');
    console.log(`💾 Hard questions addon saved to: ${filepath}`);
    return filepath;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(arg => arg.startsWith('--input='));
  
  if (!inputArg) {
    console.error('❌ Usage: node generate-hard-questions-addon.js --input=structured_bala_kanda_sarga_2.json');
    console.error('   Generates hard difficulty questions to supplement existing content');
    process.exit(1);
  }
  
  const inputFilename = inputArg.split('=')[1];
  
  const generator = new HardQuestionsAddon();
  
  try {
    const hardQuestions = await generator.generateHardQuestions(inputFilename);
    
    console.log('\n📊 Hard Questions Add-On Summary:');
    console.log(`- Generated questions: ${hardQuestions.length}`);
    console.log(`- Difficulty level: hard`);
    console.log(`- Themes covered: ${hardQuestions.length}`);
    console.log(`- Ready for Google Sheets staging`);
    
    console.log('\n✨ Hard questions add-on completed successfully!');
    console.log('📁 Check generated-content/questions/ for the addon file');
    console.log('🔄 Next: Use stage-hard-questions-to-sheets.js to append to Google Sheets');
    
  } catch (error) {
    console.error('\n❌ Hard questions generation failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('💡 Set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
    }
    
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = HardQuestionsAddon;

// Run if called directly
if (require.main === module) {
  main();
}