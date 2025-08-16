#!/usr/bin/env node

/**
 * Batch Valmiki Ramayana Web Scraper for 2-Sarga Cost Optimization
 * 
 * Uses Node.js built-in fetch to extract content for multiple Sargas in sequence
 * Usage: node scrape-valmiki-batch.js --sargas=17,18
 * Usage: node scrape-valmiki-batch.js --sargas=19,20  
 */

const fs = require('fs').promises;
const path = require('path');

class BatchValmikiScraper {
  constructor() {
    this.outputDir = path.join(__dirname, '../../generated-content/scraped');
    this.userAgent = 'Epic Quiz App Content Generator - Educational Use Only';
  }

  async scrapeBatchSargas(kanda, sargaNumbers) {
    console.log(`🚀 Starting batch Valmiki Ramayana content extraction...`);
    console.log(`📚 Target: ${kanda.toUpperCase()} - Sargas ${sargaNumbers.join(', ')}`);
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    const results = [];
    
    for (const sargaNumber of sargaNumbers) {
      console.log(`\n📖 Processing Sarga ${sargaNumber}...`);
      try {
        const content = await this.scrapeSarga(kanda, sargaNumber);
        results.push(content);
        console.log(`✅ Sarga ${sargaNumber} scraped successfully`);
        
        // Small delay between requests to be respectful
        if (sargaNumbers.indexOf(sargaNumber) < sargaNumbers.length - 1) {
          console.log('⏳ Waiting 2 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to scrape Sarga ${sargaNumber}:`, error.message);
        throw error;
      }
    }
    
    console.log(`\n🎉 Batch scraping completed successfully!`);
    console.log(`📊 Scraped ${results.length} Sargas`);
    
    return results;
  }

  async scrapeSarga(kanda, sargaNumber) {
    const url = this.buildUrl(kanda, sargaNumber);
    console.log(`📖 Scraping ${url}...`);

    try {
      // Fetch the main HTML content
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let html = await response.text();
      console.log(`✅ Successfully fetched HTML (${html.length} characters)`);

      // Check if this is a frameset page and get the actual content
      if (html.includes('<frameset') || html.includes('<frame')) {
        console.log('🔄 Detected frameset, fetching actual content...');
        const contentUrl = await this.extractFrameContentUrl(html, url);
        if (contentUrl) {
          console.log(`📖 Fetching frame content from: ${contentUrl}`);
          const contentResponse = await fetch(contentUrl, {
            headers: {
              'User-Agent': this.userAgent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive'
            }
          });
          
          if (contentResponse.ok) {
            html = await contentResponse.text();
            console.log(`✅ Successfully fetched frame content (${html.length} characters)`);
          }
        }
      }

      // Parse and extract content
      const content = await this.extractContent(html, kanda, sargaNumber, url);
      
      // Save structured content
      await this.saveContent(content);
      
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
    // Correct pattern: use 'bala' for filename, not 'baala'
    const fileKanda = kanda === 'bala_kanda' ? 'bala' : urlKanda;
    return `https://www.valmikiramayan.net/utf8/${urlKanda}/sarga${sargaNumber}/${fileKanda}_${sargaNumber}_frame.htm`;
  }

  async extractFrameContentUrl(html, baseUrl) {
    // Extract the frame source URL from HTML
    const frameMatch = html.match(/<frame[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (frameMatch) {
      const frameSrc = frameMatch[1];
      
      // If it's a relative URL, make it absolute
      if (frameSrc.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        return `${urlObj.protocol}//${urlObj.host}${frameSrc}`;
      } else if (frameSrc.startsWith('./') || !frameSrc.includes('://')) {
        const baseDir = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
        return `${baseDir}/${frameSrc}`;
      } else {
        return frameSrc;
      }
    }
    return null;
  }

  async extractContent(html, kanda, sargaNumber, sourceUrl) {
    console.log('🔍 Extracting content from HTML...');
    
    const verses = [];
    let title = '';
    
    // Extract title from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/&[^;]+;/g, ' ').trim();
    }

    // Simple HTML parsing approach - remove comments and script tags
    let cleanHtml = html.replace(/<!--.*?-->/gs, '');
    cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleanHtml = cleanHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Split into lines and look for Sanskrit and translation patterns
    const lines = cleanHtml.split(/\r?\n/);
    
    let currentVerse = {
      number: 0,
      sanskrit: '',
      translation: '',
      transliteration: ''
    };

    let verseCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Remove HTML tags but preserve content
      line = line.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').trim();
      
      if (!line || line.length < 3) continue;
      
      // Skip navigation, copyright, and website elements
      if (line.includes('www.') || 
          line.includes('copyright') || 
          line.includes('©') ||
          line.includes('Click') ||
          line.includes('Next') ||
          line.includes('Previous') ||
          line.includes('Home') ||
          line.includes('Index') ||
          line.toLowerCase().includes('menu')) {
        continue;
      }

      // Check if line contains Sanskrit (Devanagari characters)
      const hasSanskrit = /[\u0900-\u097F]/.test(line);
      
      // Check if line contains verse numbers (1., 2., etc.)
      const verseNumberMatch = line.match(/^(\d+)[\.\s]/);
      
      if (verseNumberMatch) {
        // Save previous verse if we have content
        if (currentVerse.sanskrit || currentVerse.translation) {
          verses.push({...currentVerse});
          verseCount++;
        }
        
        // Start new verse
        currentVerse = {
          number: parseInt(verseNumberMatch[1]),
          sanskrit: '',
          translation: '',
          transliteration: ''
        };
        
        // Remove verse number from line
        line = line.replace(/^\d+[\.\s]*/, '').trim();
      }

      if (hasSanskrit && line.length > 10) {
        // This looks like Sanskrit content
        if (currentVerse.sanskrit) {
          currentVerse.sanskrit += ' ' + line;
        } else {
          currentVerse.sanskrit = line;
        }
      } else if (line.length > 15 && 
                 !line.match(/^[0-9\s\.\-]+$/) && 
                 !hasSanskrit) {
        // This looks like translation text
        if (currentVerse.translation) {
          currentVerse.translation += ' ' + line;
        } else {
          currentVerse.translation = line;
        }
      }
    }

    // Add the last verse
    if (currentVerse.sanskrit || currentVerse.translation) {
      verses.push(currentVerse);
      verseCount++;
    }

    // Clean up verses - remove duplicates and incomplete ones
    const cleanedVerses = verses
      .filter(verse => verse.sanskrit && verse.translation)
      .map((verse, index) => ({
        ...verse,
        number: verse.number || (index + 1),
        sanskrit: verse.sanskrit.trim(),
        translation: verse.translation.trim(),
        transliteration: this.generateTransliteration(verse.sanskrit)
      }));

    console.log(`✅ Extracted ${cleanedVerses.length} verses`);
    
    // Show sample verses for verification
    if (cleanedVerses.length > 0) {
      console.log('\n📝 Sample extracted verses:');
      cleanedVerses.slice(0, 2).forEach(verse => {
        console.log(`Verse ${verse.number}:`);
        console.log(`  Sanskrit: ${verse.sanskrit.substring(0, 80)}...`);
        console.log(`  Translation: ${verse.translation.substring(0, 80)}...`);
      });
    }
    
    const content = {
      epic_id: 'ramayana',
      kanda: kanda,
      sarga: sargaNumber,
      title: title || `Valmiki Ramayana - ${kanda.charAt(0).toUpperCase() + kanda.slice(1).replace('_', ' ')} - Sarga ${sargaNumber}`,
      verses: cleanedVerses,
      source_url: sourceUrl,
      extraction_date: new Date().toISOString()
    };
    
    return content;
  }

  cleanHtml(html) {
    // Remove comments, scripts, and style tags
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  containsDevanagari(text) {
    // Check for Devanagari Unicode range (U+0900-U+097F)
    return /[\u0900-\u097F]/.test(text);
  }

  generateTransliteration(sanskritText) {
    // Basic transliteration - this is a simplified version
    // In a production system, you'd use a proper Sanskrit transliteration library
    return sanskritText.replace(/[\u0900-\u097F]/g, '').trim() || '[Transliteration needed]';
  }

  async saveContent(content) {
    // Save raw content
    const rawFilename = `${content.kanda}_sarga_${content.sarga}.json`;
    const rawPath = path.join(this.outputDir, rawFilename);
    await fs.writeFile(rawPath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`💾 Raw content saved to: ${rawPath}`);

    // Save AI-ready structured content
    const structuredFilename = `structured_${content.kanda}_sarga_${content.sarga}.json`;
    const structuredPath = path.join(this.outputDir, structuredFilename);
    await fs.writeFile(structuredPath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`💾 AI-ready content saved to: ${structuredPath}`);

    return {
      rawPath,
      structuredPath
    };
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const sargasArg = args.find(arg => arg.startsWith('--sargas='));
  const kandaArg = args.find(arg => arg.startsWith('--kanda='));
  
  if (!sargasArg || !kandaArg) {
    console.error('❌ Usage: node scrape-valmiki-batch.js --kanda=bala_kanda --sargas=17,18');
    console.error('   Example: node scrape-valmiki-batch.js --kanda=bala_kanda --sargas=19,20');
    process.exit(1);
  }
  
  const kanda = kandaArg.split('=')[1];
  const sargasStr = sargasArg.split('=')[1];
  const sargaNumbers = sargasStr.split(',').map(s => parseInt(s.trim()));
  
  if (sargaNumbers.length !== 2) {
    console.error('❌ Batch scraper expects exactly 2 Sarga numbers');
    console.error('   Example: --sargas=17,18');
    process.exit(1);
  }
  
  if (sargaNumbers.some(isNaN)) {
    console.error('❌ Invalid Sarga numbers provided');
    process.exit(1);
  }
  
  const scraper = new BatchValmikiScraper();
  
  try {
    const results = await scraper.scrapeBatchSargas(kanda, sargaNumbers);
    
    console.log('\n📊 Batch Extraction Summary:');
    results.forEach(result => {
      console.log(`- Epic: ${result.epic_id}`);
      console.log(`- Kanda: ${result.kanda}`);
      console.log(`- Sarga: ${result.sarga}`);
      console.log(`- Verses extracted: ${result.verses.length}`);
      console.log(`- Source: ${result.source_url}`);
      console.log(`- Extraction date: ${result.extraction_date}`);
      console.log('---');
    });
    
    console.log('✨ Batch extraction pipeline completed successfully!');
    console.log('📁 Files saved to: /Users/cdkm2/epic-quiz-app/backend/generated-content/scraped');
    
  } catch (error) {
    console.error('\n❌ Batch extraction failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = BatchValmikiScraper;

// Run if called directly
if (require.main === module) {
  main();
}