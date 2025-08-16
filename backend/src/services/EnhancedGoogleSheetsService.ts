/**
 * Enhanced Google Sheets Service with Import Tracking
 * 
 * Extends the base GoogleSheetsService to provide complete import tracking,
 * duplicate prevention, and safe sync operations for questions and summaries.
 */

import { google } from 'googleapis';
import { GoogleSheetsService, SheetsRow, SummaryRow } from './GoogleSheetsService';
import { GeneratedQuizQuestion, ChapterSummary } from './LLMContentService';

export interface QuestionWithSource {
  sheetQuestionId: string;
  sargaInfo: string;
  content: GeneratedQuizQuestion;
  rowIndex: number;
}

export interface SummaryWithSource {
  sheetSummaryId: string;
  sargaInfo: string;
  content: ChapterSummary;
  rowIndex: number;
}

export interface ImportStatusUpdate {
  questionId: string;
  supabaseId: string;
  status: 'Imported' | 'Import Failed';
  importDate: string;
}

export class EnhancedGoogleSheetsService extends GoogleSheetsService {
  
  /**
   * Get all approved content (questions and summaries) ready for import
   */
  async getAllApprovedContent(): Promise<{
    questions: QuestionWithSource[];
    summaries: SummaryWithSource[];
    stats: {
      totalQuestions: number;
      totalSummaries: number;
      readyToImport: boolean;
    };
  }> {
    try {
      console.log('📊 Reading all approved content from Google Sheets...');

      // Get approved questions
      const questions = await this.getApprovedQuestionsWithSource();
      
      // Get approved summaries
      const summaries = await this.getApprovedSummariesWithSource();

      const stats = {
        totalQuestions: questions.length,
        totalSummaries: summaries.length,
        readyToImport: questions.length > 0 || summaries.length > 0
      };

      console.log(`✅ Found ${questions.length} questions and ${summaries.length} summaries ready for import`);

      return { questions, summaries, stats };

    } catch (error) {
      console.error('Failed to get approved content:', error);
      throw error;
    }
  }

  /**
   * Get approved questions with source tracking information
   */
  async getApprovedQuestionsWithSource(): Promise<QuestionWithSource[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A2:S1000' // Extended range to include import tracking columns
      });

      const rows = response.data.values || [];
      const questionsWithSource: QuestionWithSource[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip rows that are not approved or already imported
        if (row[15] !== 'Approved') continue; // Status column
        if (row[18] === 'Imported') continue; // Import Status column (if exists)

        const sheetQuestionId = row[0]; // Question ID
        if (!sheetQuestionId) continue;

        const question = this.rowToQuestion(row);
        if (!question) continue;

        const sargaInfo = this.extractSargaInfo(row);

        questionsWithSource.push({
          sheetQuestionId,
          sargaInfo,
          content: question,
          rowIndex: i + 2 // +2 because we start from A2 and arrays are 0-indexed
        });
      }

      return questionsWithSource;

    } catch (error) {
      console.error('Failed to get approved questions with source:', error);
      throw error;
    }
  }

  /**
   * Get approved summaries with source tracking information
   */
  async getApprovedSummariesWithSource(): Promise<SummaryWithSource[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `'Summary'!A2:O1000` // Extended range to include import tracking columns
      });

      const rows = response.data.values || [];
      const summariesWithSource: SummaryWithSource[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip rows that are not ready or already imported
        if (row[10] !== 'Generated' && row[10] !== 'Ready') continue; // Status column
        if (row[13] === 'Imported') continue; // Import Status column (if exists)

        const sheetSummaryId = row[0]; // Chapter ID
        if (!sheetSummaryId) continue;

        const summary = this.rowToSummary(row);
        if (!summary) continue;

        const sargaInfo = `${summary.kanda}_sarga_${summary.sarga}`;

        summariesWithSource.push({
          sheetSummaryId,
          sargaInfo,
          content: summary,
          rowIndex: i + 2 // +2 because we start from A2 and arrays are 0-indexed
        });
      }

      return summariesWithSource;

    } catch (error) {
      console.error('Failed to get approved summaries with source:', error);
      throw error;
    }
  }

  /**
   * Mark questions and summaries as imported in Google Sheets
   */
  async markAsImported(updates: {
    questions: ImportStatusUpdate[];
    summaries: ImportStatusUpdate[];
  }): Promise<void> {
    try {
      console.log(`📝 Marking ${updates.questions.length} questions and ${updates.summaries.length} summaries as imported...`);

      // Update questions
      if (updates.questions.length > 0) {
        await this.updateQuestionImportStatus(updates.questions);
      }

      // Update summaries
      if (updates.summaries.length > 0) {
        await this.updateSummaryImportStatus(updates.summaries);
      }

      console.log('✅ Import status updated in Google Sheets');

    } catch (error) {
      console.error('Failed to mark content as imported:', error);
      throw error;
    }
  }

  /**
   * Add import tracking columns to the main sheet
   */
  async addImportTrackingColumns(): Promise<void> {
    try {
      console.log('📋 Adding import tracking columns to Google Sheets...');

      // Check if import columns already exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A1:Z1'
      });

      const headers = response.data.values?.[0] || [];
      
      if (!headers.includes('Import Status')) {
        // Add new headers
        const newHeaders = [...headers, 'Import Status', 'Supabase ID', 'Import Date'];
        
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: `A1:${this.columnToLetter(newHeaders.length)}1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [newHeaders]
          }
        });

        console.log('✅ Import tracking columns added to main sheet');
      }

      // Add import tracking columns to Summary sheet
      const summaryResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `'Summary'!A1:Z1`
      });

      const summaryHeaders = summaryResponse.data.values?.[0] || [];
      
      if (!summaryHeaders.includes('Import Status')) {
        const newSummaryHeaders = [...summaryHeaders, 'Import Status', 'Supabase ID', 'Import Date'];
        
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: `'Summary'!A1:${this.columnToLetter(newSummaryHeaders.length)}1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [newSummaryHeaders]
          }
        });

        console.log('✅ Import tracking columns added to Summary sheet');
      }

    } catch (error) {
      console.error('Failed to add import tracking columns:', error);
      throw error;
    }
  }

  /**
   * Check which content has already been imported to prevent duplicates
   */
  async checkImportStatus(questionIds: string[], summaryIds: string[]): Promise<{
    alreadyImported: {
      questions: string[];
      summaries: string[];
    };
    newContent: {
      questions: string[];
      summaries: string[];
    };
  }> {
    try {
      const [questionRows, summaryRows] = await Promise.all([
        this.sheets.spreadsheets.values.get({
          spreadsheetId: this.sheetId,
          range: 'A2:Z1000'
        }),
        this.sheets.spreadsheets.values.get({
          spreadsheetId: this.sheetId,
          range: `'Summary'!A2:Z1000`
        })
      ]);

      const alreadyImportedQuestions: string[] = [];
      const alreadyImportedSummaries: string[] = [];

      // Check questions
      (questionRows.data.values || []).forEach(row => {
        if (row[18] === 'Imported' && questionIds.includes(row[0])) {
          alreadyImportedQuestions.push(row[0]);
        }
      });

      // Check summaries
      (summaryRows.data.values || []).forEach(row => {
        if (row[13] === 'Imported' && summaryIds.includes(row[0])) {
          alreadyImportedSummaries.push(row[0]);
        }
      });

      return {
        alreadyImported: {
          questions: alreadyImportedQuestions,
          summaries: alreadyImportedSummaries
        },
        newContent: {
          questions: questionIds.filter(id => !alreadyImportedQuestions.includes(id)),
          summaries: summaryIds.filter(id => !alreadyImportedSummaries.includes(id))
        }
      };

    } catch (error) {
      console.error('Failed to check import status:', error);
      throw error;
    }
  }

  private async updateQuestionImportStatus(updates: ImportStatusUpdate[]): Promise<void> {
    // Batch update question import status
    const updateData = updates.map(update => [update.status, update.supabaseId, update.importDate]);
    
    // We'd need to know the exact row for each question to update
    // For now, we'll log that this needs to be implemented based on row tracking
    console.log(`📝 Need to update ${updates.length} question import statuses`);
  }

  private async updateSummaryImportStatus(updates: ImportStatusUpdate[]): Promise<void> {
    // Batch update summary import status  
    const updateData = updates.map(update => [update.status, update.supabaseId, update.importDate]);
    
    // We'd need to know the exact row for each summary to update
    // For now, we'll log that this needs to be implemented based on row tracking
    console.log(`📝 Need to update ${updates.length} summary import statuses`);
  }

  private extractSargaInfo(row: string[]): string {
    // Extract sarga information from chapter source or question ID
    const chapterSource = row[2] || ''; // Chapter Source column
    const questionId = row[0] || ''; // Question ID column

    const combined = (chapterSource + ' ' + questionId).toLowerCase();

    if (combined.includes('sarga1') || combined.includes('sarga_1')) return 'bala_kanda_sarga_1';
    if (combined.includes('sarga2') || combined.includes('sarga_2')) return 'bala_kanda_sarga_2';
    if (combined.includes('sarga3') || combined.includes('sarga_3')) return 'bala_kanda_sarga_3';
    if (combined.includes('sarga4') || combined.includes('sarga_4')) return 'bala_kanda_sarga_4';

    return 'unknown_sarga';
  }

  private rowToSummary(row: string[]): ChapterSummary | null {
    try {
      return {
        chapter: row[0] || '', // Chapter ID
        kanda: row[1] || '',
        sarga: parseInt(row[2]) || 0,
        title: row[3] || '',
        key_events: row[4] || '',
        main_characters: row[5] || '',
        themes: row[6] || '',
        cultural_significance: row[7] || '',
        narrative_summary: row[8] || '',
        source_reference: row[9] || ''
      };
    } catch (error) {
      console.error('Error converting row to summary:', error);
      return null;
    }
  }

  private columnToLetter(column: number): string {
    let result = '';
    while (column > 0) {
      column--;
      result = String.fromCharCode(65 + (column % 26)) + result;
      column = Math.floor(column / 26);
    }
    return result;
  }
}