/**
 * Valmiki Ramayana Content Scraping Service
 * Extracts content from valmikiramayan.net for quiz generation
 */

import { chromium, Browser, Page } from 'playwright';

export interface ValmikiContent {
  kandaName: string;
  sargaNumber: number;
  url: string;
  title: string;
  content: string;
  verses: ValmikiVerse[];
  extractedAt: Date;
}

export interface ValmikiVerse {
  number: number;
  sanskrit?: string;
  translation: string;
}

export class ValmikiScrapingService {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Extract content from a specific Valmiki Ramayana chapter
   */
  async extractChapterContent(kandaName: string, sargaNumber: number): Promise<ValmikiContent> {
    await this.init();
    
    const url = this.buildChapterUrl(kandaName, sargaNumber);
    const page = await this.browser!.newPage();
    
    try {
      console.log(`📖 Extracting content from: ${url}`);
      
      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Extract the main content
      const content = await page.evaluate(() => {
        // Remove scripts and style elements
        const scripts = (document as any).querySelectorAll('script, style');
        scripts.forEach((el: any) => el.remove());

        // Get the main content area
        const body = (document as any).body;
        if (!body) return '';

        // Extract text content and clean it up
        let text = body.innerText || body.textContent || '';
        
        // Clean up the text
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/\n\s*\n/g, '\n');
        
        return text;
      });

      // Extract structured verses if possible
      const verses = await this.extractVerses(page);

      // Get page title
      const title = await page.title();

      await page.close();

      return {
        kandaName,
        sargaNumber,
        url,
        title,
        content: content.substring(0, 10000), // Limit content length for LLM
        verses,
        extractedAt: new Date()
      };

    } catch (error) {
      await page.close();
      throw new Error(`Failed to extract content from ${url}: ${error.message}`);
    }
  }

  /**
   * Extract multiple chapters in batch
   */
  async extractBatchContent(kandaName: string, startSarga: number, endSarga: number): Promise<ValmikiContent[]> {
    const results: ValmikiContent[] = [];
    
    console.log(`📚 Batch extracting ${kandaName} Kanda, Sargas ${startSarga}-${endSarga}`);
    
    for (let sarga = startSarga; sarga <= endSarga; sarga++) {
      try {
        const content = await this.extractChapterContent(kandaName, sarga);
        results.push(content);
        
        // Small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`⚠️  Failed to extract ${kandaName} Sarga ${sarga}: ${error.message}`);
      }
    }
    
    return results;
  }

  /**
   * Build URL for a specific chapter
   */
  private buildChapterUrl(kandaName: string, sargaNumber: number): string {
    // URL pattern: https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1_frame.htm
    const sargaStr = sargaNumber.toString();
    return `https://www.valmikiramayan.net/utf8/${kandaName}/sarga${sargaStr}/${kandaName}_${sargaStr}_frame.htm`;
  }

  /**
   * Extract verses from the page (if structured content is available)
   */
  private async extractVerses(page: Page): Promise<ValmikiVerse[]> {
    try {
      const verses = await page.evaluate(() => {
        const verses: any[] = [];
        
        // Look for verse patterns in the text
        // This is a basic implementation - might need refinement based on actual site structure
        const textContent = (document as any).body.innerText || '';
        const lines = textContent.split('\n');
        
        let verseNumber = 1;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.length > 20 && trimmed.length < 200) {
            // Likely a verse or translation
            verses.push({
              number: verseNumber++,
              translation: trimmed
            });
          }
        }
        
        return verses.slice(0, 20); // Limit verses per chapter
      });

      return verses;
    } catch (error) {
      console.warn('Could not extract verses structure:', error.message);
      return [];
    }
  }

  /**
   * Validate that extracted content looks valid
   */
  validateContent(content: ValmikiContent): boolean {
    return (
      content.content.length > 100 && 
      content.title.length > 0 &&
      !content.content.includes('404') &&
      !content.content.includes('Error')
    );
  }

  /**
   * Get metadata for a Kanda (estimated chapter count, etc.)
   */
  getKandaMetadata(kandaName: string): { totalSargas: number; description: string } {
    const kandaInfo: Record<string, { totalSargas: number; description: string }> = {
      'baala': { 
        totalSargas: 77, 
        description: 'Childhood of Rama - Birth, education, marriage to Sita' 
      },
      'ayodhya': { 
        totalSargas: 119, 
        description: 'Exile begins - Rama\'s banishment and departure to forest' 
      },
      'aranya': { 
        totalSargas: 75, 
        description: 'Forest period - Life in exile and Sita\'s abduction' 
      },
      'kishkindha': { 
        totalSargas: 67, 
        description: 'Alliance with Hanuman and Sugriva' 
      },
      'sundara': { 
        totalSargas: 68, 
        description: 'Hanuman\'s journey to Lanka' 
      },
      'yuddha': { 
        totalSargas: 131, 
        description: 'The great war and rescue of Sita' 
      },
      'uttara': { 
        totalSargas: 111, 
        description: 'Return to Ayodhya and later events' 
      }
    };

    return kandaInfo[kandaName] || { 
      totalSargas: 0, 
      description: 'Unknown Kanda' 
    };
  }
}