#!/usr/bin/env node

/**
 * Valmiki Ramayana Playwright Scraper
 * 
 * Extracts Sanskrit verses, translations, and content from valmikiramayan.net
 * Usage: node scrape-valmiki-playwright.js --kanda=bala_kanda --sarga=2
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class ValmikiRamayanaScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.outputDir = path.join(__dirname, '../../generated-content/scraped');
  }

  async initialize() {
    console.log('🚀 Initializing Playwright browser...');
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Set user agent to be respectful
    await this.page.setUserAgent('Epic Quiz App Content Generator - Educational Use');
    
    console.log('✅ Browser initialized successfully');
  }

  async scrapeSarga(kanda, sargaNumber) {
    const url = this.buildUrl(kanda, sargaNumber);
    console.log(`📖 Scraping ${url}...`);

    try {
      // Navigate to the page
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for content to load
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Extract content based on the website structure
      const content = await this.extractContent(kanda, sargaNumber, url);
      
      // Save structured content
      await this.saveContent(content);
      
      console.log('✅ Successfully scraped and saved content');
      return content;

    } catch (error) {
      console.error('❌ Scraping failed:', error.message);
      throw error;
    }
  }

  buildUrl(kanda, sargaNumber) {
    // URL pattern: https://www.valmikiramayan.net/utf8/baala/sarga2/bala_2_frame.htm
    const kandaMap = {
      'bala_kanda': 'baala',
      'ayodhya_kanda': 'ayodhya',
      'aranya_kanda': 'aranya',
      'kishkindha_kanda': 'kishkindha',
      'sundara_kanda': 'sundara',
      'yuddha_kanda': 'yuddha',
      'uttara_kanda': 'uttara'
    };
    
    const urlKanda = kandaMap[kanda] || kanda;
    return `https://www.valmikiramayan.net/utf8/${urlKanda}/sarga${sargaNumber}/${urlKanda}_${sargaNumber}_frame.htm`;
  }

  async extractContent(kanda, sargaNumber, url) {
    console.log('🔍 Extracting content from page...');
    
    // Get page title
    const title = await this.page.title();
    
    // Extract main content - this will need to be adjusted based on actual website structure
    const contentData = await this.page.evaluate(() => {
      const verses = [];
      
      // Try to find Sanskrit text and translations
      // This selector will need to be adjusted based on the actual HTML structure
      const contentElements = document.querySelectorAll('table tr, p, div');
      
      let verseNumber = 0;
      let currentSanskrit = '';
      let currentTranslation = '';
      
      contentElements.forEach((element, index) => {
        const text = element.textContent?.trim();
        if (!text) return;
        
        // Look for Sanskrit text (contains Devanagari characters)
        if (/[\u0900-\u097F]/.test(text)) {
          if (currentSanskrit) {
            // Save previous verse if we have one
            verses.push({
              number: verseNumber,
              sanskrit: currentSanskrit,
              translation: currentTranslation,
              raw_html: element.outerHTML
            });
            verseNumber++;
          }
          currentSanskrit = text;
          currentTranslation = ''; // Reset translation
        } else if (text.length > 20 && !text.includes('©') && !text.includes('www.')) {
          // Likely translation text
          if (currentSanskrit && !currentTranslation) {
            currentTranslation = text;
          }
        }
      });
      
      // Add the last verse
      if (currentSanskrit) {
        verses.push({
          number: verseNumber,
          sanskrit: currentSanskrit,
          translation: currentTranslation,
          raw_html: ''
        });
      }
      
      // Also get the full page content for analysis
      const fullContent = document.body.innerHTML;
      
      return {
        verses,
        fullContent,
        pageTitle: document.title,
        extractedElements: contentElements.length
      };
    });

    // Structure the extracted content
    const structuredContent = {
      epic_id: 'ramayana',
      kanda: kanda,
      sarga: sargaNumber,
      title: this.generateTitle(kanda, sargaNumber),
      verses: contentData.verses,
      source_url: url,
      extraction_date: new Date().toISOString(),
      page_title: contentData.pageTitle,
      extraction_metadata: {
        total_elements_found: contentData.extractedElements,
        verses_extracted: contentData.verses.length,
        scraping_method: 'playwright',
        success: contentData.verses.length > 0
      },
      raw_html: contentData.fullContent.substring(0, 5000) // First 5k chars for reference
    };

    console.log(`✅ Extracted ${structuredContent.verses.length} verses`);
    return structuredContent;
  }

  generateTitle(kanda, sargaNumber) {
    const kandaTitles = {
      'bala_kanda': 'The Beginning',
      'ayodhya_kanda': 'The Royal Court',
      'aranya_kanda': 'Forest Life',
      'kishkindha_kanda': 'The Monkey Kingdom',
      'sundara_kanda': 'The Beautiful',
      'yuddha_kanda': 'The War',
      'uttara_kanda': 'The Final Chapter'
    };
    
    return `${kandaTitles[kanda] || kanda} - Sarga ${sargaNumber}`;
  }

  async saveContent(content) {
    const filename = `${content.kanda}_sarga_${content.sarga}.json`;
    const filepath = path.join(this.outputDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`💾 Saved to: ${filepath}`);
    
    // Also save a structured version for easier processing
    const structuredFilename = `structured_${filename}`;
    const structuredFilepath = path.join(this.outputDir, structuredFilename);
    
    await fs.writeFile(structuredFilepath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`💾 Structured content saved to: ${structuredFilepath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const kandaArg = args.find(arg => arg.startsWith('--kanda='));
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!kandaArg || !sargaArg) {
    console.error('❌ Usage: node scrape-valmiki-playwright.js --kanda=bala_kanda --sarga=2');
    process.exit(1);
  }
  
  const kanda = kandaArg.split('=')[1];
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  const scraper = new ValmikiRamayanaScraper();
  
  try {
    await scraper.initialize();
    const content = await scraper.scrapeSarga(kanda, sarga);
    
    console.log('\n📊 Scraping Summary:');
    console.log(`- Epic: ${content.epic_id}`);
    console.log(`- Kanda: ${content.kanda}`);
    console.log(`- Sarga: ${content.sarga}`);
    console.log(`- Verses extracted: ${content.verses.length}`);
    console.log(`- Source: ${content.source_url}`);
    
    if (content.verses.length === 0) {
      console.warn('⚠️  Warning: No verses extracted. Check website structure or selectors.');
    }
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  } finally {
    await scraper.cleanup();
  }
}

// Export for use in other scripts
module.exports = ValmikiRamayanaScraper;

// Run if called directly
if (require.main === module) {
  main();
}