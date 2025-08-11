#!/usr/bin/env node

/**
 * Simple Valmiki Ramayana Web Scraper
 * 
 * Uses Node.js built-in fetch and basic HTML parsing to extract content
 * Usage: node scrape-valmiki-simple.js --kanda=bala_kanda --sarga=2
 */

const fs = require('fs').promises;
const path = require('path');

class SimpleValmikiScraper {
  constructor() {
    this.outputDir = path.join(__dirname, '../../generated-content/scraped');
    this.userAgent = 'Epic Quiz App Content Generator - Educational Use Only';
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
    // Correct pattern: use 'bala' for filename, not 'baala'
    const fileKanda = kanda === 'bala_kanda' ? 'bala' : urlKanda;
    return `https://www.valmikiramayan.net/utf8/${urlKanda}/sarga${sargaNumber}/${fileKanda}_${sargaNumber}_frame.htm`;
  }

  async extractFrameContentUrl(html, baseUrl) {
    // Extract the frame source URL from HTML
    const frameMatch = html.match(/<frame[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (frameMatch && frameMatch[1]) {
      const frameSrc = frameMatch[1];
      
      // Handle relative URLs
      if (frameSrc.startsWith('http')) {
        return frameSrc;
      } else {
        // Construct absolute URL
        const baseUrlParts = baseUrl.split('/');
        baseUrlParts.pop(); // Remove the filename
        return baseUrlParts.join('/') + '/' + frameSrc;
      }
    }
    
    console.warn('⚠️  Could not extract frame content URL');
    return null;
  }

  async extractContent(html, kanda, sargaNumber, url) {
    console.log('🔍 Extracting content from HTML...');
    
    const verses = [];
    let title = '';
    
    // Extract title from HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/&[^;]+;/g, ' ').trim();
    }

    // Simple HTML parsing approach
    // Remove HTML comments and script tags
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
    let inTableCell = false;
    
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

    // Structure the extracted content
    const structuredContent = {
      epic_id: 'ramayana',
      kanda: kanda,
      sarga: sargaNumber,
      title: title || this.generateTitle(kanda, sargaNumber),
      verses: cleanedVerses,
      source_url: url,
      extraction_date: new Date().toISOString(),
      extraction_metadata: {
        total_verses_extracted: cleanedVerses.length,
        scraping_method: 'simple_node_fetch',
        html_length: html.length,
        success: cleanedVerses.length > 0
      },
      raw_html_sample: html.substring(0, 3000) // First 3k chars for debugging
    };

    console.log(`✅ Extracted ${structuredContent.verses.length} verses`);
    
    // Log first few verses for verification
    if (structuredContent.verses.length > 0) {
      console.log('\n📝 Sample extracted verses:');
      structuredContent.verses.slice(0, 2).forEach(verse => {
        console.log(`Verse ${verse.number}:`);
        console.log(`  Sanskrit: ${verse.sanskrit.substring(0, 100)}...`);
        console.log(`  Translation: ${verse.translation.substring(0, 100)}...`);
      });
    }

    return structuredContent;
  }

  generateTransliteration(sanskritText) {
    // Basic transliteration - this is a simplified version
    // In a production system, you'd use a proper Sanskrit transliteration library
    return sanskritText.replace(/[\u0900-\u097F]/g, '').trim() || '[Transliteration needed]';
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
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    const filename = `${content.kanda}_sarga_${content.sarga}.json`;
    const filepath = path.join(this.outputDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`💾 Raw content saved to: ${filepath}`);
    
    // Also save a structured version optimized for processing
    const structuredFilename = `structured_${filename}`;
    const structuredFilepath = path.join(this.outputDir, structuredFilename);
    
    // Create a cleaner version for AI processing
    const aiProcessingVersion = {
      epic_id: content.epic_id,
      kanda: content.kanda,
      sarga: content.sarga,
      title: content.title,
      verses: content.verses.map(verse => ({
        number: verse.number,
        sanskrit: verse.sanskrit,
        translation: verse.translation
      })),
      source_url: content.source_url,
      total_verses: content.verses.length
    };
    
    await fs.writeFile(structuredFilepath, JSON.stringify(aiProcessingVersion, null, 2), 'utf8');
    console.log(`💾 AI-ready content saved to: ${structuredFilepath}`);
    
    return {
      raw_file: filepath,
      structured_file: structuredFilepath
    };
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const kandaArg = args.find(arg => arg.startsWith('--kanda='));
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  
  if (!kandaArg || !sargaArg) {
    console.error('❌ Usage: node scrape-valmiki-simple.js --kanda=bala_kanda --sarga=2');
    console.error('   Available kandas: bala_kanda, ayodhya_kanda, aranya_kanda, etc.');
    process.exit(1);
  }
  
  const kanda = kandaArg.split('=')[1];
  const sarga = parseInt(sargaArg.split('=')[1]);
  
  if (!sarga || sarga < 1) {
    console.error('❌ Invalid sarga number. Must be a positive integer.');
    process.exit(1);
  }
  
  const scraper = new SimpleValmikiScraper();
  
  try {
    console.log('🚀 Starting Valmiki Ramayana content extraction...');
    console.log(`📚 Target: ${kanda.toUpperCase()} - Sarga ${sarga}`);
    
    const content = await scraper.scrapeSarga(kanda, sarga);
    
    console.log('\n📊 Extraction Summary:');
    console.log(`- Epic: ${content.epic_id}`);
    console.log(`- Kanda: ${content.kanda}`);
    console.log(`- Sarga: ${content.sarga}`);
    console.log(`- Title: ${content.title}`);
    console.log(`- Verses extracted: ${content.verses.length}`);
    console.log(`- Source: ${content.source_url}`);
    console.log(`- Extraction date: ${content.extraction_date}`);
    
    if (content.verses.length === 0) {
      console.warn('\n⚠️  WARNING: No verses extracted!');
      console.warn('   This could indicate:');
      console.warn('   - Website structure has changed');
      console.warn('   - Content is not available for this Sarga');
      console.warn('   - Network issues or access restrictions');
      console.warn('   - Parsing logic needs adjustment');
    } else {
      console.log('\n✅ Extraction completed successfully!');
      console.log(`📁 Files saved to: ${scraper.outputDir}`);
    }
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error('   Check network connection and website availability');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = SimpleValmikiScraper;

// Run if called directly
if (require.main === module) {
  main();
}