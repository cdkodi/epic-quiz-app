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
      ],
      3: [
        {
          name: "Yogic Epistemology and Omniscient Narration",
          verseRange: [1, 12],
          focus: "yogic perception, divine insight methodology, omniscient narrative authority",
          complexity: "Analyze how yogic vision establishes narrative authority in Sanskrit epic tradition"
        },
        {
          name: "Purushartha Integration in Epic Literature",
          verseRange: [13, 24], 
          focus: "dharma-artha-kama synthesis, literary framework, ethical instruction through narrative",
          complexity: "Examine how the Ramayana integrates the four human goals into comprehensive literature"
        },
        {
          name: "Literary Metaphysics and Cosmic Scope",
          verseRange: [25, -1],
          focus: "epic as cosmic reflection, universal appeal theory, literature as dharmic instrument",
          complexity: "Evaluate the metaphysical foundations of epic literature in Hindu thought"
        }
      ],
      4: [
        {
          name: "Sacred Mathematics and Cosmic Structure",
          verseRange: [1, 10],
          focus: "24,000 verses, Gayatri correspondence, numerical symbolism, mantric literature",
          complexity: "Analyze the significance of numerical harmony between epic structure and Vedic sacred mathematics"
        },
        {
          name: "Guru-Parampara and Knowledge Transmission",
          verseRange: [11, 20],
          focus: "traditional pedagogy, consciousness preparation, holistic education, cultural preservation",
          complexity: "Examine the epistemological framework of sacred knowledge transmission in Vedic tradition"
        },
        {
          name: "Performance Theory and Narrative Recognition",
          verseRange: [21, -1],
          focus: "dramatic irony, recognition themes, epic as lived experience, audience consciousness",
          complexity: "Evaluate the relationship between epic performance and existential recognition in Sanskrit drama theory"
        }
      ],
      5: [
        {
          name: "Urbanistic Philosophy and Divine Architecture",
          verseRange: [1, 7],
          focus: "city planning, divine proportions, architectural harmony, cosmic order reflection",
          complexity: "Analyze how Ayodhya's urban design reflects Hindu cosmological principles and dharmic governance"
        },
        {
          name: "Royal Prosperity and Dharmic Economics",
          verseRange: [8, 14],
          focus: "prosperity theory, righteous wealth, economic dharma, royal responsibility",
          complexity: "Examine the relationship between spiritual governance and material prosperity in ancient Indian political thought"
        },
        {
          name: "Cultural Values and Civilizational Ideals",
          verseRange: [15, -1],
          focus: "cultural refinement, educational excellence, spiritual sophistication, ideal society",
          complexity: "Evaluate Ayodhya as the manifestation of Vedic civilizational ideals and cultural synthesis"
        }
      ],
      6: [
        {
          name: "Dharmic Governance and Truth-Based Administration",
          verseRange: [1, 8],
          focus: "satya-based rule, dharmic administration, truth as governing principle, moral authority",
          complexity: "Analyze the philosophical foundations of dharmic kingship and truth-based governance in Hindu political theory"
        },
        {
          name: "Societal Harmony and Spiritual Prosperity",
          verseRange: [9, 16],
          focus: "social virtue, spiritual wealth, collective dharma, harmonious society",
          complexity: "Examine the integration of individual virtue and collective prosperity in ideal Vedic society"
        },
        {
          name: "Ideal Society and Absence of Vice",
          verseRange: [17, -1],
          focus: "nastika absence, cultural purity, educational completeness, spiritual uniformity",
          complexity: "Evaluate the concept of ideal society through the lens of spiritual and intellectual completeness in ancient Indian thought"
        }
      ],
      7: [
        {
          name: "Administrative Philosophy and Ideal Ministers",
          verseRange: [1, 6],
          focus: "ministerial qualities, administrative virtue, political wisdom, royal counsel",
          complexity: "Analyze the philosophical foundations of ideal ministerial qualities and their role in righteous governance according to Dharmashastra principles"
        },
        {
          name: "Brahmanical Authority and Religious Governance",
          verseRange: [7, 12],
          focus: "ritual authority, Vedic scholarship, spiritual guidance, brahmarishi role",
          complexity: "Examine the integration of spiritual and temporal authority in ancient Indian political thought through the dual ministry system"
        },
        {
          name: "Intelligence Networks and Statecraft Epistemology",
          verseRange: [13, -1],
          focus: "omniscient administration, intelligence systems, truthfulness, knowledge networks",
          complexity: "Evaluate the epistemological framework of ancient Indian statecraft and the role of comprehensive knowledge in dharmic governance"
        }
      ],
      8: [
        {
          name: "Royal Dharma and Dynastic Continuity",
          verseRange: [1, 7],
          focus: "sonless grief, dynastic obligation, royal responsibility, dharmic succession",
          complexity: "Analyze the concept of royal dharma and the tension between personal desire and dynastic responsibility in ancient Indian kingship"
        },
        {
          name: "Vedic Ritual Theory and Divine Intervention",
          verseRange: [8, 14],
          focus: "Ashvamedha significance, yajna philosophy, divine-human transaction, cosmic ritual",
          complexity: "Examine the theoretical foundations of Vedic ritual efficacy and the concept of divine intervention through sacrificial performance"
        },
        {
          name: "Collective Decision-Making and Royal Protocol",
          verseRange: [15, -1],
          focus: "ministerial consultation, consensus building, collective wisdom, advisory systems",
          complexity: "Evaluate the balance between royal authority and collective decision-making in ancient Indian political philosophy"
        }
      ],
      9: [
        {
          name: "Celibacy and Spiritual Power in Vedic Tradition",
          verseRange: [1, 4],
          focus: "brahmacharya philosophy, spiritual energy conservation, sage lineage",
          complexity: "Analyze the relationship between celibacy and spiritual power in Vedic tradition, and how Rishyasringa's celibacy enables his rainmaking abilities"
        },
        {
          name: "Divine Justice and Ecological Dharma",
          verseRange: [5, 8],
          focus: "cosmic justice, environmental retribution, dharmic violation consequences",
          complexity: "Examine the concept of divine retribution through natural disasters and the connection between royal dharma and ecological balance"
        },
        {
          name: "Brahmanical Authority and Royal Counsel",
          verseRange: [9, -1],
          focus: "priestly guidance, purification rituals, brahmanical supremacy in crisis",
          complexity: "Evaluate the role of Brahmanical authority in royal decision-making and the concept of ritual purification for dharmic violations"
        }
      ],
      10: [
        {
          name: "Strategic Ethics and Dharmic Deception",
          verseRange: [1, 9],
          focus: "moral ambiguity, necessary deception, ends justifying means",
          complexity: "Analyze the ethical paradox of using deception to bring a sage for dharmic purposes and the concept of 'necessary evil' in ancient Indian ethics"
        },
        {
          name: "Feminine Agency and Seduction as Dharmic Tool",
          verseRange: [10, 18],
          focus: "women's role in dharmic restoration, seduction ethics, feminine power",
          complexity: "Examine the complex portrayal of feminine agency in dharmic contexts and the use of seduction as a tool for cosmic balance"
        },
        {
          name: "Marriage Politics and Spiritual-Temporal Alliance",
          verseRange: [19, -1],
          focus: "royal marriage strategy, spiritual-political union, dynastic dharma",
          complexity: "Evaluate the concept of strategic marriage alliances between spiritual and temporal powers in ancient Indian political philosophy"
        }
      ],
      11: [
        {
          name: "Ritual Authority and Progeny Philosophy",
          verseRange: [1, 5],
          focus: "Vedic ritual efficacy, spiritual lineage, dharmic succession, sage authority",
          complexity: "Analyze the epistemological framework of Vedic ritual authority and its role in securing divine progeny for royal lineages"
        },
        {
          name: "Inter-Kingdom Dharmic Cooperation",
          verseRange: [6, 10],
          focus: "royal diplomacy, dharmic alliances, mutual benefit, spiritual governance",
          complexity: "Examine the concept of dharmic cooperation between kingdoms and the role of spiritual authority in inter-royal negotiations"
        },
        {
          name: "Feminine Spiritual Authority and Royal Reception",
          verseRange: [11, -1],
          focus: "Shanta's role, sage wives, feminine wisdom, spiritual companionship",
          complexity: "Evaluate the significance of feminine spiritual authority and the concept of spiritual partnership in sage marriages within Hindu dharmic traditions"
        }
      ],
      12: [
        {
          name: "Ashvamedha Yajna Philosophy and Ritual Authority",
          verseRange: [1, 3],
          focus: "Vedic sacrifice theory, royal ritual authority, cosmic renewal through sacrifice",
          complexity: "Analyze the philosophical foundations of Ashvamedha Yajna as cosmic renewal and royal legitimacy in Vedic tradition"
        },
        {
          name: "Seasonal Symbolism and Dharmic Timing",
          verseRange: [4, 6],
          focus: "spring season significance, temporal dharma, cyclical renewal, auspicious timing",
          complexity: "Examine the relationship between seasonal cycles and dharmic action in ancient Indian ritual philosophy"
        },
        {
          name: "Collective Wisdom and Ministerial Authority",
          verseRange: [7, -1],
          focus: "collective decision-making, sage counsel, administrative dharma, wisdom integration",
          complexity: "Evaluate the epistemological framework of collective wisdom and the integration of spiritual and temporal authority in royal decision-making"
        }
      ],
      13: [
        {
          name: "Royal-Priestly Authority and Sacred Hierarchy",
          verseRange: [1, 8],
          focus: "guru-disciple relationship, spiritual authority, Brahmanical guidance in royal dharma",
          complexity: "Analyze the epistemological framework of spiritual-temporal authority relationship in Vedic royal administration"
        },
        {
          name: "Ritual Preparation Philosophy and Collective Dharma",
          verseRange: [9, 16],
          focus: "community participation, ritual logistics, dharmic hospitality, sacred preparation methodology",
          complexity: "Examine the integration of individual and collective dharma through comprehensive ritual preparation in ancient Indian society"
        },
        {
          name: "International Diplomacy and Sacred Unity",
          verseRange: [17, -1],
          focus: "inter-kingdom relations, sacred assembly, diplomatic protocol, unified spiritual purpose",
          complexity: "Evaluate the philosophical foundations of dharmic diplomacy and the role of sacred rituals in inter-kingdom harmony"
        }
      ],
      14: [
        {
          name: "Ashvamedha Philosophy and Cosmic Renewal Theory",
          verseRange: [1, 15],
          focus: "ritual completion, horse sacrifice symbolism, cosmic order restoration, royal sovereignty validation",
          complexity: "Analyze the metaphysical foundations of Ashvamedha Yajna as cosmic renewal mechanism and the philosophical relationship between royal ritual and universal dharma"
        },
        {
          name: "Vedic Ritual Authority and Brahmanical Epistemology",
          verseRange: [16, 30],
          focus: "Rishyasringa's spiritual authority, Vedic knowledge transmission, ritual precision, sacred expertise",
          complexity: "Examine the epistemological framework of Vedic ritual authority and the role of accomplished sages in maintaining cosmic order through precise ceremonial practice"
        },
        {
          name: "Royal Generosity Philosophy and Dharmic Wealth Distribution",
          verseRange: [31, -1],
          focus: "dana philosophy, royal charity, spiritual economics, wealth redistribution dharma",
          complexity: "Evaluate the philosophical foundations of dana (charitable giving) in Hindu royal dharma and the relationship between material prosperity and spiritual advancement"
        }
      ],
      15: [
        {
          name: "Character Authority and Power Rituals",
          verseRange: [1, 7],
          focus: "character development, authority dynamics, the power of rituals and vedic hymns",
          complexity: "Analyze the character dynamics and authority structures within the context of The Divine Intervention for the Birth of Rama"
        },
        {
          name: "Cultural Context and Divine Intervention",
          verseRange: [8, 14],
          focus: "cultural significance, dharmic implications, ritual, dharma, vedic",
          complexity: "Examine the cultural and dharmic significance within ancient Indian philosophical traditions"
        },
        {
          name: "Thematic Integration and Concept Dharma",
          verseRange: [15, -1],
          focus: "thematic synthesis, universal principles, divine intervention in human affairs, the concept ",
          complexity: "Evaluate the integration of thematic elements and universal principles in Hindu philosophical thought"
        }
      ],
      17: [
        {
          name: "Divine Cosmological Hierarchy and Creative Mandate",
          verseRange: [1, 8],
          focus: "Brahma's cosmic authority, hierarchical creation, divine council dynamics, cosmic strategy",
          complexity: "Analyze the metaphysical framework of divine hierarchy and the epistemological basis of cosmic creation mandate in Hindu cosmology"
        },
        {
          name: "Theological Genetics and Divine Parentage Theory",
          verseRange: [9, 16],
          focus: "divine procreation philosophy, celestial lineage, divine qualities transmission, spiritual genetics",
          complexity: "Examine the philosophical foundations of divine parentage and the transmission of divine qualities through celestial procreation in Vedic literature"
        },
        {
          name: "Cosmic Purpose and Dharmic Army Creation",
          verseRange: [17, -1],
          focus: "cosmic balance restoration, dharmic army philosophy, divine intervention theory, universal harmony",
          complexity: "Evaluate the theological concept of divine army creation for cosmic balance and the role of celestial beings in dharmic restoration"
        }
      ],
      18: [
        {
          name: "Ritual Completion Philosophy and Divine Satisfaction Theory",
          verseRange: [1, 6],
          focus: "yajna completion metaphysics, divine-human transaction, ritual efficacy theory, cosmic reciprocity",
          complexity: "Analyze the philosophical foundations of ritual completion and the metaphysical relationship between divine satisfaction and cosmic order in Vedic tradition"
        },
        {
          name: "Royal Dharma and Anticipatory Spirituality",
          verseRange: [7, 12],
          focus: "royal spiritual preparation, anticipatory consciousness, divine progeny philosophy, dharmic succession",
          complexity: "Examine the epistemological framework of anticipatory spirituality and the preparation of royal consciousness for divine progeny in Hindu dharmic tradition"
        },
        {
          name: "Cosmic Timing and Divine Birth Philosophy",
          verseRange: [13, -1],
          focus: "auspicious timing theory, cosmic alignment, divine incarnation timing, universal anticipation",
          complexity: "Evaluate the theological concepts of cosmic timing and universal anticipation in the context of divine incarnations and their role in dharmic cycles"
        }
      ]
    };
  }

  /**
   * Check if a sarga has configuration, auto-generate if missing
   */
  async ensureConfiguration(sarga) {
    if (this.hardQuestionThemes[sarga]) {
      return true; // Configuration exists
    }

    console.log(`⚠️  No hard question themes configured for Sarga ${sarga}`);
    console.log(`🔧 Attempting to auto-generate configuration...`);

    try {
      // Load Smart Config Manager
      const { SmartConfigManager } = require('../../smart-config-manager.js');
      const configManager = new SmartConfigManager();

      // Auto-generate and add configuration
      console.log(`   🤖 Analyzing content for Sarga ${sarga}...`);
      const analysis = await configManager.analyzeContent(sarga);
      
      console.log(`   📝 Adding configuration to hard questions addon...`);
      await configManager.addConfiguration(sarga, analysis.suggested_configuration);
      
      // Reload the updated configuration
      delete require.cache[require.resolve('./generate-hard-questions-addon.js')];
      const updatedModule = require('./generate-hard-questions-addon.js');
      this.hardQuestionThemes = new updatedModule().hardQuestionThemes;
      
      console.log(`   ✅ Auto-generated configuration for Sarga ${sarga}`);
      return true;
      
    } catch (error) {
      console.log(`   ❌ Auto-generation failed: ${error.message}`);
      console.log(`   🔄 Falling back to generic themes...`);
      
      // Generate generic fallback themes
      this.hardQuestionThemes[sarga] = this.generateGenericThemes(sarga);
      console.log(`   ✅ Using generic themes for Sarga ${sarga}`);
      return true;
    }
  }

  /**
   * Generate generic themes as fallback
   */
  generateGenericThemes(sarga) {
    return [
      {
        name: "Character Authority and Spiritual Dynamics",
        verseRange: [1, 8],
        focus: "character development, authority structures, spiritual principles, divine guidance",
        complexity: `Analyze the character dynamics and spiritual authority within the context of Sarga ${sarga}`
      },
      {
        name: "Cultural Context and Dharmic Significance",
        verseRange: [9, 16],
        focus: "cultural traditions, dharmic practice, ritual significance, philosophical implications",
        complexity: "Examine the cultural and dharmic significance within ancient Indian philosophical traditions"
      },
      {
        name: "Thematic Integration and Universal Principles",
        verseRange: [17, -1],
        focus: "thematic synthesis, universal principles, narrative significance, cosmic order",
        complexity: "Evaluate the integration of thematic elements and universal principles in Hindu philosophical thought"
      }
    ];
  }

  /**
   * Process multiple Sargas in batch
   */
  async generateBatchHardQuestions(sargaNumbers) {
    console.log(`🎯 Starting Batch Hard Questions generation for Sargas ${sargaNumbers.join(', ')}...`);
    
    const results = [];
    
    for (const sarga of sargaNumbers) {
      console.log(`\n📚 Processing Sarga ${sarga}...`);
      
      try {
        // Ensure configuration exists (auto-generate if needed)
        await this.ensureConfiguration(sarga);
        
        // Generate hard questions for this sarga
        const inputFilename = `structured_bala_kanda_sarga_${sarga}.json`;
        const hardQuestions = await this.generateHardQuestions(inputFilename);
        
        results.push({
          sarga,
          questions: hardQuestions,
          status: 'success'
        });
        
        console.log(`✅ Sarga ${sarga} completed: ${hardQuestions.length} hard questions`);
        
      } catch (error) {
        console.error(`❌ Sarga ${sarga} failed: ${error.message}`);
        results.push({
          sarga,
          questions: [],
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Summary
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');
    
    console.log(`\n📊 Batch Hard Questions Summary:`);
    console.log(`   ✅ Successful: ${successful.length} Sargas`);
    console.log(`   ❌ Failed: ${failed.length} Sargas`);
    console.log(`   📝 Total Questions: ${successful.reduce((sum, r) => sum + r.questions.length, 0)}`);
    
    if (failed.length > 0) {
      console.log(`\n❌ Failed Sargas:`);
      failed.forEach(r => console.log(`   Sarga ${r.sarga}: ${r.error}`));
    }
    
    return results;
  }

  async generateHardQuestions(inputFilename) {
    console.log('🎯 Starting Hard Questions Add-On generation...');
    
    // Load scraped content
    const inputPath = path.join(this.inputDir, inputFilename);
    const rawContent = await fs.readFile(inputPath, 'utf8');
    const scrapedData = JSON.parse(rawContent);
    
    console.log(`📖 Loaded content: ${scrapedData.epic_id} ${scrapedData.kanda} Sarga ${scrapedData.sarga}`);
    
    const sarga = scrapedData.sarga;
    
    // Ensure configuration exists (auto-generate if needed)
    await this.ensureConfiguration(sarga);
    
    const themes = this.hardQuestionThemes[sarga];
    
    if (!themes) {
      throw new Error(`Failed to generate or load themes for Sarga ${sarga}`);
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
  const sargasArg = args.find(arg => arg.startsWith('--sargas='));
  
  const generator = new HardQuestionsAddon();
  
  try {
    if (sargasArg) {
      // Batch processing mode
      const sargaNumbers = sargasArg.split('=')[1].split(',').map(s => parseInt(s.trim()));
      console.log(`🚀 Batch mode: Processing Sargas ${sargaNumbers.join(', ')}`);
      
      const results = await generator.generateBatchHardQuestions(sargaNumbers);
      
      console.log('\n📊 Batch Hard Questions Summary:');
      const successful = results.filter(r => r.status === 'success');
      console.log(`- Processed Sargas: ${sargaNumbers.join(', ')}`);
      console.log(`- Successful: ${successful.length}/${sargaNumbers.length}`);
      console.log(`- Total hard questions: ${successful.reduce((sum, r) => sum + r.questions.length, 0)}`);
      console.log(`- Auto-configuration: ✅ Enabled`);
      
      console.log('\n✨ Batch hard questions generation completed!');
      console.log('📁 Check generated-content/questions/ for the addon files');
      
    } else if (inputArg) {
      // Single file mode  
      const inputFilename = inputArg.split('=')[1];
      const hardQuestions = await generator.generateHardQuestions(inputFilename);
      
      console.log('\n📊 Hard Questions Add-On Summary:');
      console.log(`- Generated questions: ${hardQuestions.length}`);
      console.log(`- Difficulty level: hard`);
      console.log(`- Themes covered: ${hardQuestions.length}`);
      console.log(`- Auto-configuration: ✅ Enabled`);
      
      console.log('\n✨ Hard questions add-on completed successfully!');
      console.log('📁 Check generated-content/questions/ for the addon file');
      
    } else {
      console.error('❌ Usage:');
      console.error('   Single Sarga: node generate-hard-questions-addon.js --input=structured_bala_kanda_sarga_2.json');
      console.error('   Batch Sargas: node generate-hard-questions-addon.js --sargas=19,20');
      console.error('');
      console.error('Features:');
      console.error('   ✅ Auto-configuration: Automatically generates themes for missing Sargas');
      console.error('   ✅ Batch processing: Process multiple Sargas in one command');
      console.error('   ✅ Fallback themes: Uses generic themes if content analysis fails');
      process.exit(1);
    }
    
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