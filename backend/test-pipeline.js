/**
 * Test the complete content generation pipeline
 * Run with: node test-pipeline.js
 */

require('dotenv').config();

async function testPipeline() {
  try {
    console.log('🚀 Testing complete content generation pipeline...');
    console.log('');

    // Import the pipeline (using dynamic import for ES modules)
    const { runQuickTest } = await import('./src/services/ContentGenerationPipeline.js');
    
    // Run the test
    const result = await runQuickTest();
    
    console.log('');
    console.log('🎉 Pipeline test completed!');
    console.log('');
    console.log('📊 Final Results:');
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    console.log(`   Chapters: ${result.totalChaptersProcessed}`);
    console.log(`   Questions: ${result.totalQuestionsGenerated}`);
    console.log(`   Cost: $${result.estimatedCost.toFixed(4)}`);
    
    if (result.errors.length > 0) {
      console.log(`   Errors: ${result.errors.join(', ')}`);
    }
    
    if (result.success) {
      console.log('');
      console.log('🔗 Check your Google Sheet for the generated questions!');
      console.log(`   Sheet ID: ${process.env.CONTENT_REVIEW_SHEET_ID}`);
      console.log(`   URL: https://docs.google.com/spreadsheets/d/${process.env.CONTENT_REVIEW_SHEET_ID}/edit`);
    }

  } catch (error) {
    console.error('❌ Pipeline test failed:', error.message);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      console.log('💡 Make sure your OpenAI API key is set in .env file');
    }
    if (error.message.includes('CONTENT_REVIEW_SHEET_ID')) {
      console.log('💡 Make sure your Google Sheet ID is set in .env file');
    }
    if (error.message.includes('google-credentials')) {
      console.log('💡 Make sure your google-credentials.json file is in the backend directory');
    }
  }
}

// Run the test
testPipeline();