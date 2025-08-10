/**
 * Test scraping with frame handling
 */

require('dotenv').config();
const { chromium } = require('playwright');

async function testFrameScraping() {
  console.log('🔍 Testing frame-based content extraction...');
  
  const browser = await chromium.launch({ headless: false }); // Set to false to debug
  const page = await browser.newPage();
  
  try {
    const url = 'https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1_frame.htm';
    console.log(`   Visiting: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Check if page uses frames
    const frames = page.frames();
    console.log(`   Found ${frames.length} frames`);
    
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      console.log(`   Frame ${i}: ${frame.url()}`);
      
      try {
        const content = await frame.evaluate(() => {
          const body = document.body;
          if (!body) return '';
          
          // Remove scripts and styles
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach(el => el.remove());
          
          let text = body.innerText || body.textContent || '';
          text = text.replace(/\s+/g, ' ').trim();
          
          return text;
        });
        
        console.log(`   Frame ${i} content length: ${content.length}`);
        if (content.length > 200) {
          console.log(`   Frame ${i} preview: ${content.substring(0, 300)}...`);
          
          // This is likely the main content frame
          await browser.close();
          return { content, frameUrl: frame.url() };
        }
        
      } catch (error) {
        console.log(`   Frame ${i} error: ${error.message}`);
      }
    }
    
    // If no frame content found, try the main page
    const mainContent = await page.evaluate(() => {
      const body = document.body;
      if (!body) return '';
      
      let text = body.innerText || body.textContent || '';
      return text;
    });
    
    console.log(`   Main page content: ${mainContent}`);
    
    await browser.close();
    return { content: mainContent, frameUrl: url };
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function testDirectContent() {
  console.log('🔍 Testing direct content access...');
  
  // Try accessing the content frame directly
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Look for the actual content URL pattern
    const possibleUrls = [
      'https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1_unicode.html',
      'https://www.valmikiramayan.net/utf8/baala/sarga1/bala_1.html',
      'https://www.valmikiramayan.net/utf8/baala/sarga1/baala_1.htm',
      'https://www.valmikiramayan.net/baala/sarga1/baala_1.htm'
    ];
    
    for (const url of possibleUrls) {
      try {
        console.log(`   Trying: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(2000);
        
        const content = await page.evaluate(() => {
          const body = document.body;
          if (!body) return '';
          
          // Remove scripts and styles
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach(el => el.remove());
          
          let text = body.innerText || body.textContent || '';
          text = text.replace(/\s+/g, ' ').trim();
          
          return text;
        });
        
        console.log(`   Content length: ${content.length}`);
        
        if (content.length > 200 && !content.includes('404') && !content.includes('not found')) {
          console.log(`   ✅ Found content at: ${url}`);
          console.log(`   Preview: ${content.substring(0, 500)}...`);
          
          await browser.close();
          return { content, url };
        }
        
      } catch (error) {
        console.log(`   ❌ ${url} failed: ${error.message}`);
      }
    }
    
    await browser.close();
    throw new Error('No valid content URLs found');
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function runFrameTest() {
  try {
    console.log('🧪 Testing Valmiki Ramayana content extraction...');
    console.log('');
    
    // First try frame-based approach
    try {
      const frameResult = await testFrameScraping();
      console.log('✅ Frame-based extraction successful');
      return frameResult;
    } catch (error) {
      console.log('⚠️ Frame-based extraction failed, trying direct access...');
    }
    
    // Try direct content access
    const directResult = await testDirectContent();
    console.log('✅ Direct content access successful');
    return directResult;
    
  } catch (error) {
    console.error('❌ All extraction methods failed:', error.message);
  }
}

runFrameTest();