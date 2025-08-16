/**
 * Safe Supabase Service with Import Tracking
 * 
 * Extends the base SupabaseService to provide safe import operations
 * with comprehensive tracking, duplicate prevention, and rollback capabilities.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService, DatabaseQuestion, DatabaseSummary } from './SupabaseService';
import { QuestionWithSource, SummaryWithSource } from './EnhancedGoogleSheetsService';
import { v4 as uuidv4 } from 'uuid';

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  failed: number;
  errors: string[];
  importedIds: string[];
  batchId: string;
}

export interface ImportBatch {
  id: string;
  name: string;
  createdAt: Date;
  questions: QuestionWithSource[];
  summaries: SummaryWithSource[];
}

export interface ImportLog {
  id: string;
  sheetId: string;
  supabaseId: string;
  sargaInfo: string;
  batchId: string;
  importDate: Date;
  status: 'imported' | 'failed' | 'rollback';
}

export class SafeSupabaseService extends SupabaseService {
  
  /**
   * Execute complete clean import of questions and summaries with full tracking
   */
  async executeCleanImport(batch: ImportBatch): Promise<{
    questions: ImportResult;
    summaries: ImportResult;
    overall: {
      success: boolean;
      totalImported: number;
      totalFailed: number;
    };
  }> {
    console.log(`📥 Executing clean import for batch: ${batch.name}`);

    try {
      // Check for any existing duplicates before import
      await this.validateNoDuplicates(batch);

      // Import questions with tracking
      console.log(`📝 Importing ${batch.questions.length} questions...`);
      const questionsResult = await this.safeImportQuestions(batch.questions, batch.id);

      // Import summaries with tracking
      console.log(`📑 Importing ${batch.summaries.length} summaries...`);
      const summariesResult = await this.safeImportSummaries(batch.summaries, batch.id);

      const overall = {
        success: questionsResult.success && summariesResult.success,
        totalImported: questionsResult.imported + summariesResult.imported,
        totalFailed: questionsResult.failed + summariesResult.failed
      };

      console.log(`✅ Clean import completed: ${overall.totalImported} items imported, ${overall.totalFailed} failed`);

      return {
        questions: questionsResult,
        summaries: summariesResult,
        overall
      };

    } catch (error) {
      console.error('Clean import failed:', error);
      
      // Attempt rollback
      console.log('🔄 Attempting rollback...');
      await this.rollbackBatch(batch.id);
      
      throw error;
    }
  }

  /**
   * Safely import questions with duplicate prevention and tracking
   */
  async safeImportQuestions(questions: QuestionWithSource[], batchId: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      importedIds: [],
      batchId
    };

    console.log(`📝 Starting safe import of ${questions.length} questions...`);

    for (const questionWithSource of questions) {
      try {
        // Check if this question already exists
        const existing = await this.checkQuestionExists(questionWithSource.sheetQuestionId);
        if (existing) {
          result.skipped++;
          console.log(`⏭️  Skipped duplicate question: ${questionWithSource.sheetQuestionId}`);
          continue;
        }

        // Prepare question data
        const questionData = {
          epic_id: questionWithSource.content.epic_id || 'ramayana',
          category: questionWithSource.content.category,
          difficulty: questionWithSource.content.difficulty,
          question_text: questionWithSource.content.question_text,
          options: questionWithSource.content.options,
          correct_answer_id: questionWithSource.content.correct_answer_id,
          basic_explanation: questionWithSource.content.basic_explanation,
          original_quote: questionWithSource.content.source_reference?.includes('sanskrit') 
            ? this.extractSanskritQuote(questionWithSource.content) : null,
          quote_translation: questionWithSource.content.basic_explanation?.includes('translation') 
            ? this.extractTranslation(questionWithSource.content) : null,
          tags: questionWithSource.content.tags || [],
          cross_epic_tags: this.extractCrossEpicTags(questionWithSource.content),
          cultural_context: questionWithSource.content.cultural_context,
          source_reference: questionWithSource.content.source_reference,
          sheet_question_id: questionWithSource.sheetQuestionId,
          import_batch_id: batchId
        };

        // Insert question
        const { data, error } = await this.supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push(`Question "${questionWithSource.sheetQuestionId}": ${error.message}`);
          continue;
        }

        // Log import
        await this.logQuestionImport({
          id: uuidv4(),
          sheetId: questionWithSource.sheetQuestionId,
          supabaseId: data.id,
          sargaInfo: questionWithSource.sargaInfo,
          batchId,
          importDate: new Date(),
          status: 'imported'
        });

        result.imported++;
        result.importedIds.push(data.id);

        console.log(`✅ Imported question: ${questionWithSource.sheetQuestionId} -> ${data.id}`);

      } catch (error) {
        result.failed++;
        result.errors.push(`Question "${questionWithSource.sheetQuestionId}": ${error.message}`);
        console.error(`❌ Failed to import question ${questionWithSource.sheetQuestionId}:`, error.message);
      }
    }

    result.success = result.failed === 0;
    console.log(`📊 Questions import complete: ${result.imported} imported, ${result.skipped} skipped, ${result.failed} failed`);

    return result;
  }

  /**
   * Safely import summaries with duplicate prevention and tracking
   */
  async safeImportSummaries(summaries: SummaryWithSource[], batchId: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      importedIds: [],
      batchId
    };

    console.log(`📑 Starting safe import of ${summaries.length} summaries...`);

    for (const summaryWithSource of summaries) {
      try {
        // Check if this summary already exists
        const existing = await this.checkSummaryExists(summaryWithSource.sheetSummaryId);
        if (existing) {
          result.skipped++;
          console.log(`⏭️  Skipped duplicate summary: ${summaryWithSource.sheetSummaryId}`);
          continue;
        }

        // Prepare summary data
        const summaryData = {
          epic_id: 'ramayana',
          kanda: summaryWithSource.content.kanda,
          sarga: summaryWithSource.content.sarga,
          title: summaryWithSource.content.title,
          key_events: summaryWithSource.content.key_events,
          main_characters: summaryWithSource.content.main_characters,
          themes: summaryWithSource.content.themes,
          cultural_significance: summaryWithSource.content.cultural_significance,
          narrative_summary: summaryWithSource.content.narrative_summary,
          source_reference: summaryWithSource.content.source_reference,
          sheet_summary_id: summaryWithSource.sheetSummaryId,
          import_batch_id: batchId
        };

        // Insert summary
        const { data, error } = await this.supabase
          .from('chapter_summaries')
          .insert(summaryData)
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push(`Summary "${summaryWithSource.sheetSummaryId}": ${error.message}`);
          continue;
        }

        // Log import
        await this.logSummaryImport({
          id: uuidv4(),
          sheetId: summaryWithSource.sheetSummaryId,
          supabaseId: data.id,
          sargaInfo: summaryWithSource.sargaInfo,
          batchId,
          importDate: new Date(),
          status: 'imported'
        });

        result.imported++;
        result.importedIds.push(data.id);

        console.log(`✅ Imported summary: ${summaryWithSource.sheetSummaryId} -> ${data.id}`);

      } catch (error) {
        result.failed++;
        result.errors.push(`Summary "${summaryWithSource.sheetSummaryId}": ${error.message}`);
        console.error(`❌ Failed to import summary ${summaryWithSource.sheetSummaryId}:`, error.message);
      }
    }

    result.success = result.failed === 0;
    console.log(`📊 Summaries import complete: ${result.imported} imported, ${result.skipped} skipped, ${result.failed} failed`);

    return result;
  }

  /**
   * Validate no duplicate content exists before import
   */
  async validateNoDuplicates(batch: ImportBatch): Promise<void> {
    console.log('🔍 Validating no duplicate content exists...');

    const questionSheetIds = batch.questions.map(q => q.sheetQuestionId);
    const summarySheetIds = batch.summaries.map(s => s.sheetSummaryId);

    // Check for existing questions
    const { data: existingQuestions } = await this.supabase
      .from('questions')
      .select('sheet_question_id')
      .in('sheet_question_id', questionSheetIds);

    // Check for existing summaries
    const { data: existingSummaries } = await this.supabase
      .from('chapter_summaries')
      .select('sheet_summary_id')
      .in('sheet_summary_id', summarySheetIds);

    const duplicateQuestions = existingQuestions?.map(q => q.sheet_question_id) || [];
    const duplicateSummaries = existingSummaries?.map(s => s.sheet_summary_id) || [];

    if (duplicateQuestions.length > 0 || duplicateSummaries.length > 0) {
      throw new Error(
        `Duplicate content found: ${duplicateQuestions.length} questions, ${duplicateSummaries.length} summaries. ` +
        `Run cleanup first or remove duplicates.`
      );
    }

    console.log('✅ No duplicates found - safe to proceed');
  }

  /**
   * Check if a question already exists
   */
  async checkQuestionExists(sheetQuestionId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('questions')
      .select('id')
      .eq('sheet_question_id', sheetQuestionId)
      .single();

    return !!data;
  }

  /**
   * Check if a summary already exists
   */
  async checkSummaryExists(sheetSummaryId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('chapter_summaries')
      .select('id')
      .eq('sheet_summary_id', sheetSummaryId)
      .single();

    return !!data;
  }

  /**
   * Log question import for audit trail
   */
  async logQuestionImport(log: ImportLog): Promise<void> {
    const { error } = await this.supabase
      .from('question_import_logs')
      .insert({
        sheet_question_id: log.sheetId,
        supabase_question_id: log.supabaseId,
        sarga_info: log.sargaInfo,
        import_batch_id: log.batchId,
        import_date: log.importDate.toISOString(),
        status: log.status
      });

    if (error) {
      console.error('Failed to log question import:', error);
    }
  }

  /**
   * Log summary import for audit trail
   */
  async logSummaryImport(log: ImportLog): Promise<void> {
    const { error } = await this.supabase
      .from('summary_import_logs')
      .insert({
        sheet_summary_id: log.sheetId,
        supabase_summary_id: log.supabaseId,
        sarga_info: log.sargaInfo,
        import_batch_id: log.batchId,
        import_date: log.importDate.toISOString(),
        status: log.status
      });

    if (error) {
      console.error('Failed to log summary import:', error);
    }
  }

  /**
   * Rollback a complete import batch
   */
  async rollbackBatch(batchId: string): Promise<void> {
    console.log(`🔄 Rolling back import batch: ${batchId}`);

    try {
      // Delete questions from this batch
      const { error: questionsError } = await this.supabase
        .from('questions')
        .delete()
        .eq('import_batch_id', batchId);

      // Delete summaries from this batch
      const { error: summariesError } = await this.supabase
        .from('chapter_summaries')
        .delete()
        .eq('import_batch_id', batchId);

      // Update import logs to show rollback
      await Promise.all([
        this.supabase
          .from('question_import_logs')
          .update({ status: 'rollback' })
          .eq('import_batch_id', batchId),
        this.supabase
          .from('summary_import_logs')
          .update({ status: 'rollback' })
          .eq('import_batch_id', batchId)
      ]);

      if (questionsError || summariesError) {
        console.error('Rollback errors:', { questionsError, summariesError });
      } else {
        console.log('✅ Rollback completed successfully');
      }

    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }

  /**
   * Get import statistics and audit information
   */
  async getImportStats(): Promise<{
    totalQuestions: number;
    totalSummaries: number;
    importBatches: Array<{
      batchId: string;
      questionCount: number;
      summaryCount: number;
      importDate: string;
    }>;
  }> {
    try {
      const [questionsCount, summariesCount, questionLogs, summaryLogs] = await Promise.all([
        this.supabase.from('questions').select('*', { count: 'exact', head: true }),
        this.supabase.from('chapter_summaries').select('*', { count: 'exact', head: true }),
        this.supabase.from('question_import_logs').select('import_batch_id, import_date').eq('status', 'imported'),
        this.supabase.from('summary_import_logs').select('import_batch_id, import_date').eq('status', 'imported')
      ]);

      // Group by batch ID
      const batches = new Map();
      
      questionLogs.data?.forEach(log => {
        if (!batches.has(log.import_batch_id)) {
          batches.set(log.import_batch_id, { questionCount: 0, summaryCount: 0, importDate: log.import_date });
        }
        batches.get(log.import_batch_id).questionCount++;
      });

      summaryLogs.data?.forEach(log => {
        if (!batches.has(log.import_batch_id)) {
          batches.set(log.import_batch_id, { questionCount: 0, summaryCount: 0, importDate: log.import_date });
        }
        batches.get(log.import_batch_id).summaryCount++;
      });

      const importBatches = Array.from(batches.entries()).map(([batchId, data]) => ({
        batchId,
        questionCount: data.questionCount,
        summaryCount: data.summaryCount,
        importDate: data.importDate
      }));

      return {
        totalQuestions: questionsCount.count || 0,
        totalSummaries: summariesCount.count || 0,
        importBatches
      };

    } catch (error) {
      console.error('Failed to get import stats:', error);
      return {
        totalQuestions: 0,
        totalSummaries: 0,
        importBatches: []
      };
    }
  }

  private extractSanskritQuote(question: any): string | null {
    // Extract Sanskrit quote from source reference or tags
    const sources = [question.source_reference, ...(question.tags || [])].join(' ');
    
    // Look for Devanagari characters
    const sanskritMatch = sources.match(/[\u0900-\u097F\s]+/);
    return sanskritMatch ? sanskritMatch[0].trim() : null;
  }

  private extractTranslation(question: any): string | null {
    // Extract translation from explanation
    const explanation = question.basic_explanation || '';
    
    // Look for translation patterns
    const translationMatch = explanation.match(/translation[:\s]+([^.]+)/i);
    return translationMatch ? translationMatch[1].trim() : null;
  }

  private extractCrossEpicTags(question: any): string[] {
    // Extract universal themes that apply across epics
    const universalThemes = [
      'heroism', 'sacrifice', 'duty', 'honor', 'loyalty', 'wisdom', 
      'divine_intervention', 'moral_dilemma', 'spiritual_journey'
    ];

    const questionText = (question.question_text + ' ' + question.basic_explanation).toLowerCase();
    return universalThemes.filter(theme => questionText.includes(theme.replace('_', ' ')));
  }
}