/**
 * Content Generation Pipeline - Orchestrates the full content generation flow
 * Valmiki URL → Playwright Extract → OpenAI Generate → Google Sheets Import
 */

import { ValmikiScrapingService, ValmikiContent } from './ValmikiScrapingService';
import { LLMContentService, GeneratedQuizBatch } from './LLMContentService';
import { GoogleSheetsService } from './GoogleSheetsService';

export interface PipelineOptions {
  questionsPerChapter: number;
  maxCostPerRun: number; // Maximum cost in USD
  setupSheets: boolean; // Whether to setup sheet headers
}

export interface PipelineResult {
  success: boolean;
  totalChaptersProcessed: number;
  totalQuestionsGenerated: number;
  estimatedCost: number;
  actualCost?: number;
  errors: string[];
  batches: GeneratedQuizBatch[];
}

export class ContentGenerationPipeline {
  private scrapingService: ValmikiScrapingService;
  private llmService: LLMContentService;
  private sheetsService: GoogleSheetsService;

  constructor() {
    this.scrapingService = new ValmikiScrapingService();
    this.llmService = new LLMContentService();
    this.sheetsService = new GoogleSheetsService();
  }

  /**
   * Process a single chapter: Extract → Generate → Import
   */
  async processSingleChapter(
    kandaName: string, 
    sargaNumber: number, 
    options: Partial<PipelineOptions> = {}
  ): Promise<PipelineResult> {
    
    const opts: PipelineOptions = {
      questionsPerChapter: 5,
      maxCostPerRun: 5.0,
      setupSheets: false,
      ...options
    };

    const result: PipelineResult = {
      success: false,
      totalChaptersProcessed: 0,
      totalQuestionsGenerated: 0,
      estimatedCost: 0,
      errors: [],
      batches: []
    };

    try {
      console.log(`🚀 Starting content generation pipeline for ${kandaName} Sarga ${sargaNumber}`);

      // Step 1: Extract content
      console.log('📖 Step 1: Extracting content from Valmiki Ramayana...');
      const content = await this.scrapingService.extractChapterContent(kandaName, sargaNumber);
      
      if (!this.scrapingService.validateContent(content)) {
        throw new Error('Extracted content failed validation');
      }

      console.log(`✅ Content extracted: ${content.content.length} characters`);

      // Step 2: Estimate cost
      const estimatedCost = this.llmService.estimateGenerationCost(content, opts.questionsPerChapter);
      result.estimatedCost = estimatedCost;

      if (estimatedCost > opts.maxCostPerRun) {
        throw new Error(`Estimated cost $${estimatedCost.toFixed(4)} exceeds limit $${opts.maxCostPerRun}`);
      }

      console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}`);

      // Step 3: Generate questions
      console.log('🤖 Step 2: Generating quiz questions...');
      const batch = await this.llmService.generateQuizQuestions(content, opts.questionsPerChapter);
      
      if (batch.questions.length === 0) {
        throw new Error('No valid questions generated');
      }

      console.log(`✅ Generated ${batch.questions.length} questions`);
      result.batches.push(batch);

      // Step 4: Setup sheets if needed
      if (opts.setupSheets) {
        console.log('📋 Step 3a: Setting up Google Sheets...');
        await this.sheetsService.setupReviewSheet();
        await this.sheetsService.setupSummarySheet();
        await this.sheetsService.setupDataValidation();
      }

      // Step 5: Import to Google Sheets (both quiz and summary)
      console.log('📥 Step 3: Importing quiz questions and summary to Google Sheets...');
      await this.sheetsService.importCompleteContent(batch);

      console.log(`✅ Successfully imported to Google Sheets`);

      // Update result
      result.success = true;
      result.totalChaptersProcessed = 1;
      result.totalQuestionsGenerated = batch.questions.length;

      console.log('🎉 Pipeline completed successfully!');
      this.logPipelineResults(result);

    } catch (error) {
      console.error('❌ Pipeline failed:', error.message);
      result.errors.push(error.message);
      result.success = false;
    } finally {
      await this.scrapingService.close();
    }

    return result;
  }

  /**
   * Process multiple chapters in batch
   */
  async processBatchChapters(
    kandaName: string,
    startSarga: number,
    endSarga: number,
    options: Partial<PipelineOptions> = {}
  ): Promise<PipelineResult> {
    
    const opts: PipelineOptions = {
      questionsPerChapter: 5,
      maxCostPerRun: 10.0,
      setupSheets: false,
      ...options
    };

    const result: PipelineResult = {
      success: false,
      totalChaptersProcessed: 0,
      totalQuestionsGenerated: 0,
      estimatedCost: 0,
      errors: [],
      batches: []
    };

    try {
      console.log(`🚀 Starting batch pipeline: ${kandaName} Sargas ${startSarga}-${endSarga}`);

      // Step 1: Extract all content
      console.log('📚 Step 1: Extracting content from multiple chapters...');
      const contents = await this.scrapingService.extractBatchContent(kandaName, startSarga, endSarga);
      
      if (contents.length === 0) {
        throw new Error('No content extracted');
      }

      console.log(`✅ Extracted content from ${contents.length} chapters`);

      // Step 2: Estimate total cost
      let totalEstimatedCost = 0;
      for (const content of contents) {
        totalEstimatedCost += this.llmService.estimateGenerationCost(content, opts.questionsPerChapter);
      }

      result.estimatedCost = totalEstimatedCost;

      if (totalEstimatedCost > opts.maxCostPerRun) {
        throw new Error(`Total estimated cost $${totalEstimatedCost.toFixed(4)} exceeds limit $${opts.maxCostPerRun}`);
      }

      console.log(`💰 Total estimated cost: $${totalEstimatedCost.toFixed(4)}`);

      // Step 3: Generate questions for all chapters
      console.log('🤖 Step 2: Generating quiz questions for all chapters...');
      const batches = await this.llmService.generateBatchQuestions(contents, opts.questionsPerChapter);
      
      result.batches = batches;
      result.totalChaptersProcessed = batches.length;
      result.totalQuestionsGenerated = batches.reduce((sum, batch) => sum + batch.questions.length, 0);

      console.log(`✅ Generated ${result.totalQuestionsGenerated} questions from ${result.totalChaptersProcessed} chapters`);

      // Step 4: Setup sheets if needed
      if (opts.setupSheets) {
        console.log('📋 Step 3a: Setting up Google Sheets...');
        await this.sheetsService.setupReviewSheet();
        await this.sheetsService.setupSummarySheet();
        await this.sheetsService.setupDataValidation();
      }

      // Step 5: Import all to Google Sheets (both quiz and summaries)
      console.log('📥 Step 3: Importing all quiz questions and summaries to Google Sheets...');
      for (const batch of batches) {
        await this.sheetsService.importCompleteContent(batch);
        // Small delay between imports
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✅ Successfully imported all content to Google Sheets`);

      result.success = true;

      console.log('🎉 Batch pipeline completed successfully!');
      this.logPipelineResults(result);

    } catch (error) {
      console.error('❌ Batch pipeline failed:', error.message);
      result.errors.push(error.message);
      result.success = false;
    } finally {
      await this.scrapingService.close();
    }

    return result;
  }

  /**
   * Quick test with a single URL (for validation)
   */
  async quickTest(url?: string): Promise<PipelineResult> {
    console.log('🧪 Running quick pipeline test...');

    // Default to Bala Kanda Sarga 1 if no URL provided
    return await this.processSingleChapter('baala', 1, {
      questionsPerChapter: 3,
      maxCostPerRun: 1.0,
      setupSheets: true
    });
  }

  /**
   * Get pipeline statistics
   */
  async getPipelineStats(): Promise<{
    sheetStats: any;
    kandaInfo: any[];
  }> {
    const sheetStats = await this.sheetsService.getSheetStats();
    
    const kandaInfo = [
      'baala', 'ayodhya', 'aranya', 'kishkindha', 
      'sundara', 'yuddha', 'uttara'
    ].map(kanda => ({
      name: kanda,
      ...this.scrapingService.getKandaMetadata(kanda)
    }));

    return {
      sheetStats,
      kandaInfo
    };
  }

  /**
   * Log pipeline results
   */
  private logPipelineResults(result: PipelineResult): void {
    console.log('\n📊 Pipeline Results Summary:');
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    console.log(`   Chapters Processed: ${result.totalChaptersProcessed}`);
    console.log(`   Questions Generated: ${result.totalQuestionsGenerated}`);
    console.log(`   Estimated Cost: $${result.estimatedCost.toFixed(4)}`);
    
    if (result.errors.length > 0) {
      console.log(`   Errors: ${result.errors.length}`);
      result.errors.forEach((error, i) => {
        console.log(`     ${i + 1}. ${error}`);
      });
    }
    
    console.log('');
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.scrapingService.close();
  }
}

// Export convenience functions
export async function generateFromSingleChapter(
  kandaName: string, 
  sargaNumber: number, 
  questionsPerChapter: number = 5
): Promise<PipelineResult> {
  const pipeline = new ContentGenerationPipeline();
  try {
    return await pipeline.processSingleChapter(kandaName, sargaNumber, {
      questionsPerChapter,
      maxCostPerRun: 5.0,
      setupSheets: false
    });
  } finally {
    await pipeline.cleanup();
  }
}

export async function runQuickTest(): Promise<PipelineResult> {
  const pipeline = new ContentGenerationPipeline();
  try {
    return await pipeline.quickTest();
  } finally {
    await pipeline.cleanup();
  }
}