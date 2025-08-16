#!/usr/bin/env node

/**
 * Smart Configuration Manager for Hard Questions
 * 
 * Automatically manages hard question theme configurations with:
 * - Auto-detection of missing configurations
 * - Template generation based on content analysis
 * - Fallback to generic themes when specific ones are missing
 * - Configuration validation and testing
 * 
 * Usage:
 *   node smart-config-manager.js --check-sarga=11
 *   node smart-config-manager.js --generate-template=11 --analyze-content
 *   node smart-config-manager.js --add-config=11 --interactive
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs').promises;
const path = require('path');

class SmartConfigManager {
  constructor() {
    this.configFilePath = path.join(__dirname, 'content-generation/generate-hard-questions-addon.js');
    this.scrapedDir = path.join(__dirname, '../generated-content/scraped');
    this.summariesDir = path.join(__dirname, '../generated-content/summaries');
    
    // Generic fallback themes that can be adapted to any sarga
    this.genericThemes = {
      philosophical: {
        name: "Philosophical Foundations and Spiritual Authority",
        focus: "spiritual principles, dharmic concepts, philosophical frameworks, divine authority",
        complexity: "Analyze the philosophical foundations and their role in spiritual development according to Hindu tradition"
      },
      cultural: {
        name: "Cultural Context and Dharmic Practice", 
        focus: "cultural traditions, ritual significance, social dharma, traditional practices",
        complexity: "Examine the cultural significance and dharmic implications within ancient Indian society"
      },
      thematic: {
        name: "Narrative Themes and Universal Principles",
        focus: "thematic elements, universal principles, narrative significance, symbolic meaning",
        complexity: "Evaluate the thematic significance and universal principles embedded in the narrative"
      }
    };
  }

  /**
   * Check if a sarga has hard question configuration
   */
  async checkSargaConfig(sarga) {
    try {
      const configContent = await fs.readFile(this.configFilePath, 'utf8');
      const regex = new RegExp(`${sarga}:\\s*\\[`, 'g');
      return regex.test(configContent);
    } catch (error) {
      throw new Error(`Failed to read configuration file: ${error.message}`);
    }
  }

  /**
   * Load and analyze sarga content to suggest themes
   */
  async analyzeContent(sarga) {
    console.log(`🔍 Analyzing content for Sarga ${sarga}...`);
    
    const analysis = {
      sarga,
      verses: 0,
      characters: [],
      themes: [],
      cultural_elements: [],
      suggested_configuration: []
    };

    try {
      // Load scraped content
      const scrapedFile = `structured_bala_kanda_sarga_${sarga}.json`;
      const scrapedPath = path.join(this.scrapedDir, scrapedFile);
      const scrapedData = JSON.parse(await fs.readFile(scrapedPath, 'utf8'));
      
      analysis.verses = scrapedData.verses ? scrapedData.verses.length : 0;
      
      // Load summary for thematic analysis
      const summaryFile = `bala_kanda_sarga_${sarga}_summary.json`;
      const summaryPath = path.join(this.summariesDir, summaryFile);
      const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
      
      analysis.themes = summaryData.themes || [];
      analysis.characters = summaryData.main_characters || [];
      
      // Extract cultural elements from summary
      if (summaryData.cultural_significance) {
        analysis.cultural_elements = this.extractCulturalElements(summaryData.cultural_significance);
      }
      
      // Generate suggested configuration
      analysis.suggested_configuration = this.generateSuggestedConfig(analysis, summaryData);
      
      console.log(`   📊 Found ${analysis.verses} verses, ${analysis.themes.length} themes`);
      console.log(`   👥 Main characters: ${analysis.characters.slice(0, 2).join(', ')}`);
      console.log(`   🎯 Themes: ${analysis.themes.slice(0, 2).join(', ')}`);
      
    } catch (error) {
      console.log(`   ⚠️  Content analysis failed: ${error.message}`);
      console.log(`   🔄 Will use generic themes as fallback`);
      
      // Generate fallback configuration
      analysis.suggested_configuration = this.generateFallbackConfig(sarga);
    }

    return analysis;
  }

  /**
   * Extract cultural elements from cultural significance text
   */
  extractCulturalElements(text) {
    const elements = [];
    const keywords = ['ritual', 'dharma', 'vedic', 'sacrifice', 'yajna', 'spiritual', 'divine', 'sacred', 'traditional', 'ancient'];
    
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        elements.push(keyword);
      }
    });
    
    return elements;
  }

  /**
   * Generate suggested configuration based on content analysis
   */
  generateSuggestedConfig(analysis, summaryData) {
    const config = [];
    const verseCount = analysis.verses;
    const themes = analysis.themes;
    
    // Divide verses into 3 thematic sections
    const sectionSize = Math.ceil(verseCount / 3);
    
    // Theme 1: Character/Authority focus
    if (analysis.characters.length > 0) {
      config.push({
        name: `Character Authority and ${this.extractMainConcept(themes[0] || 'Spiritual Leadership')}`,
        verseRange: [1, Math.min(sectionSize, verseCount)],
        focus: `character development, authority dynamics, ${this.generateFocusFromThemes(themes.slice(0, 1))}`,
        complexity: `Analyze the character dynamics and authority structures within the context of ${summaryData.title || 'this narrative'}`
      });
    }

    // Theme 2: Cultural/Dharmic focus
    if (analysis.cultural_elements.length > 0) {
      config.push({
        name: `Cultural Context and ${this.extractMainConcept(themes[1] || 'Dharmic Practice')}`,
        verseRange: [sectionSize + 1, Math.min(sectionSize * 2, verseCount)],
        focus: `cultural significance, dharmic implications, ${analysis.cultural_elements.slice(0, 3).join(', ')}`,
        complexity: `Examine the cultural and dharmic significance within ancient Indian philosophical traditions`
      });
    }

    // Theme 3: Thematic/Universal focus  
    if (themes.length > 0) {
      config.push({
        name: `Thematic Integration and ${this.extractMainConcept(themes[themes.length - 1] || 'Universal Principles')}`,
        verseRange: [sectionSize * 2 + 1, -1],
        focus: `thematic synthesis, universal principles, ${this.generateFocusFromThemes(themes.slice(-2))}`,
        complexity: `Evaluate the integration of thematic elements and universal principles in Hindu philosophical thought`
      });
    }

    // Ensure we have at least 3 themes
    while (config.length < 3) {
      const fallbackTheme = Object.values(this.genericThemes)[config.length];
      config.push({
        ...fallbackTheme,
        verseRange: [1, -1] // Cover all verses as fallback
      });
    }

    return config.slice(0, 3); // Limit to 3 themes
  }

  /**
   * Generate fallback configuration using generic themes
   */
  generateFallbackConfig(sarga) {
    const themes = Object.values(this.genericThemes);
    return themes.map((theme, index) => ({
      ...theme,
      verseRange: index === 2 ? [1, -1] : [1, 10] // Last theme covers all verses
    }));
  }

  /**
   * Extract main concept from theme text
   */
  extractMainConcept(themeText) {
    if (!themeText) return 'Spiritual Authority';
    
    // Extract key concepts
    const concepts = themeText.split(/[,\s]+/)
      .filter(word => word.length > 3)
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return concepts || 'Spiritual Authority';
  }

  /**
   * Generate focus text from themes
   */
  generateFocusFromThemes(themes) {
    if (!themes || themes.length === 0) return 'spiritual development';
    
    return themes
      .map(theme => theme.toLowerCase().replace(/[^\w\s]/g, ''))
      .join(', ')
      .slice(0, 50);
  }

  /**
   * Add configuration to the hard questions file
   */
  async addConfiguration(sarga, config) {
    console.log(`📝 Adding configuration for Sarga ${sarga}...`);
    
    try {
      let content = await fs.readFile(this.configFilePath, 'utf8');
      
      // Find the end of the hardQuestionThemes object
      const endPattern = /(\s+}\s*]\s*}\s*;\s*)/;
      const match = content.match(endPattern);
      
      if (!match) {
        throw new Error('Could not find insertion point in configuration file');
      }

      // Generate configuration text
      const configText = this.formatConfigurationText(sarga, config);
      
      // Insert before the closing brace
      const insertionPoint = match.index;
      const newContent = content.slice(0, insertionPoint) + 
        ',\n' + configText + '\n' + 
        content.slice(insertionPoint);

      // Write back to file
      await fs.writeFile(this.configFilePath, newContent);
      console.log(`   ✅ Configuration added successfully`);
      
    } catch (error) {
      throw new Error(`Failed to add configuration: ${error.message}`);
    }
  }

  /**
   * Format configuration as JavaScript object text
   */
  formatConfigurationText(sarga, config) {
    const themes = config.map(theme => `        {
          name: "${theme.name}",
          verseRange: [${theme.verseRange[0]}, ${theme.verseRange[1]}],
          focus: "${theme.focus}",
          complexity: "${theme.complexity}"
        }`).join(',\n');

    return `      ${sarga}: [
${themes}
      ]`;
  }

  /**
   * Test configuration by attempting to generate questions
   */
  async testConfiguration(sarga) {
    console.log(`🧪 Testing configuration for Sarga ${sarga}...`);
    
    try {
      const { spawn } = require('child_process');
      const testProcess = spawn('node', [
        'content-generation/generate-hard-questions-addon.js',
        `--input=structured_bala_kanda_sarga_${sarga}.json`
      ], { 
        cwd: path.dirname(this.configFilePath),
        stdio: 'pipe'
      });

      return new Promise((resolve, reject) => {
        let output = '';
        let error = '';

        testProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        testProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        testProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`   ✅ Configuration test passed`);
            resolve(true);
          } else {
            console.log(`   ❌ Configuration test failed: ${error}`);
            reject(new Error(`Test failed: ${error}`));
          }
        });
      });
      
    } catch (error) {
      throw new Error(`Configuration test failed: ${error.message}`);
    }
  }

  /**
   * Interactive configuration setup
   */
  async interactiveSetup(sarga) {
    console.log(`🎯 Interactive setup for Sarga ${sarga}\n`);
    
    // Check if already configured
    const hasConfig = await this.checkSargaConfig(sarga);
    if (hasConfig) {
      console.log(`✅ Sarga ${sarga} already has configuration`);
      return;
    }

    // Analyze content
    const analysis = await this.analyzeContent(sarga);
    
    console.log(`\n📋 Suggested configuration for Sarga ${sarga}:`);
    analysis.suggested_configuration.forEach((theme, index) => {
      console.log(`\n${index + 1}. ${theme.name}`);
      console.log(`   Verses: ${theme.verseRange[0]}-${theme.verseRange[1] === -1 ? 'end' : theme.verseRange[1]}`);
      console.log(`   Focus: ${theme.focus}`);
      console.log(`   Complexity: ${theme.complexity}`);
    });

    // Add configuration
    await this.addConfiguration(sarga, analysis.suggested_configuration);
    
    // Test configuration
    try {
      await this.testConfiguration(sarga);
      console.log(`\n🎉 Sarga ${sarga} configuration setup complete!`);
    } catch (error) {
      console.log(`\n⚠️  Configuration added but test failed: ${error.message}`);
      console.log(`   You may need to manually adjust the configuration`);
    }
  }

  /**
   * Main execution function
   */
  async run(args) {
    try {
      const checkArg = args.find(arg => arg.startsWith('--check-sarga='));
      const generateArg = args.find(arg => arg.startsWith('--generate-template='));
      const addConfigArg = args.find(arg => arg.startsWith('--add-config='));
      const interactive = args.includes('--interactive');

      if (checkArg) {
        const sarga = parseInt(checkArg.split('=')[1]);
        const hasConfig = await this.checkSargaConfig(sarga);
        console.log(`Sarga ${sarga} configuration: ${hasConfig ? '✅ Found' : '❌ Missing'}`);
        return;
      }

      if (generateArg) {
        const sarga = parseInt(generateArg.split('=')[1]);
        const analysis = await this.analyzeContent(sarga);
        
        console.log(`\n📋 Generated configuration template for Sarga ${sarga}:`);
        console.log(this.formatConfigurationText(sarga, analysis.suggested_configuration));
        return;
      }

      if (addConfigArg) {
        const sarga = parseInt(addConfigArg.split('=')[1]);
        if (interactive) {
          await this.interactiveSetup(sarga);
        } else {
          const analysis = await this.analyzeContent(sarga);
          await this.addConfiguration(sarga, analysis.suggested_configuration);
          console.log(`✅ Configuration added for Sarga ${sarga}`);
        }
        return;
      }

      // Show help if no valid args
      this.showHelp();

    } catch (error) {
      console.error(`❌ Configuration management failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`Smart Configuration Manager - Manage hard question themes

Usage:
  node smart-config-manager.js --check-sarga=11
  node smart-config-manager.js --generate-template=11 --analyze-content  
  node smart-config-manager.js --add-config=11 --interactive

Options:
  --check-sarga=N         Check if sarga N has configuration
  --generate-template=N   Generate configuration template for sarga N
  --add-config=N         Add configuration for sarga N  
  --interactive          Use interactive setup mode
  --analyze-content      Perform content analysis for suggestions

Examples:
  node smart-config-manager.js --check-sarga=13
  node smart-config-manager.js --add-config=13 --interactive
  node smart-config-manager.js --generate-template=13`);
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    const manager = new SmartConfigManager();
    manager.showHelp();
    process.exit(0);
  }

  const manager = new SmartConfigManager();
  await manager.run(args);
}

if (require.main === module) {
  main();
}

module.exports = { SmartConfigManager };