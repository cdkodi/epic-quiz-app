/**
 * Google Sheets Service - Import generated quiz content for human review
 */

import { google } from 'googleapis';
import { GeneratedQuizBatch, GeneratedQuizQuestion, ChapterSummary } from './LLMContentService';
import { ValmikiContent } from './ValmikiScrapingService';

export interface SheetsRow {
  questionId: string;
  epic: string;
  kanda: string;
  sarga: string;
  chapterSource: string;
  category: string;
  difficulty: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  basicExplanation: string;
  tags: string;
  culturalContext: string;
  sourceReference: string;
  status: string;
  reviewerNotes: string;
  generatedDate: string;
}

export interface SummaryRow {
  chapterId: string;
  kanda: string;
  sarga: number;
  title: string;
  keyEvents: string;
  mainCharacters: string;
  themes: string;
  culturalSignificance: string;
  narrativeSummary: string;
  sourceReference: string;
  status: string;
  reviewerNotes: string;
  generatedDate: string;
}

export class GoogleSheetsService {
  protected sheets: any;
  protected sheetId: string;
  protected readonly QUIZ_TAB_ID = 0; // First tab (gid=0)
  protected readonly SUMMARY_TAB_ID = 157495304; // Summary tab (gid=157495304)

  constructor() {
    if (!process.env.CONTENT_REVIEW_SHEET_ID) {
      throw new Error('CONTENT_REVIEW_SHEET_ID not found in environment variables');
    }
    
    this.sheetId = process.env.CONTENT_REVIEW_SHEET_ID;
    this.initializeGoogleSheets();
  }

  private async initializeGoogleSheets() {
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json';
    
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  /**
   * Setup the sheet with proper headers and formatting
   */
  async setupReviewSheet(): Promise<void> {
    try {
      console.log('📋 Setting up content review sheet headers...');

      // Define headers - now includes Kanda and Sarga columns for proper attribution
      const headers = [
        'Question ID', 'Epic', 'Kanda', 'Sarga', 'Chapter Source', 'Category', 'Difficulty',
        'Question Text', 'Option A', 'Option B', 'Option C', 'Option D',
        'Correct Answer', 'Basic Explanation', 'Tags', 'Cultural Context',
        'Source Reference', 'Status', 'Reviewer Notes', 'Generated Date'
      ];

      // Clear existing content and add headers
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.sheetId,
        range: 'A:Z'
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: 'A1:T1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });

      // Format headers (bold, frozen row)
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 18
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }
                  }
                },
                fields: 'userEnteredFormat(textFormat,backgroundColor)'
              }
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: 0,
                  gridProperties: {
                    frozenRowCount: 1
                  }
                },
                fields: 'gridProperties.frozenRowCount'
              }
            }
          ]
        }
      });

      console.log('✅ Sheet setup complete with headers and formatting');

    } catch (error) {
      console.error('Failed to setup review sheet:', error);
      throw error;
    }
  }

  /**
   * Setup the summary sheet with proper headers and formatting
   */
  async setupSummarySheet(): Promise<void> {
    try {
      console.log('📋 Setting up summary sheet headers...');

      // Define headers for summary sheet
      const summaryHeaders = [
        'Chapter ID', 'Kanda', 'Sarga', 'Title', 'Key Events', 
        'Main Characters', 'Themes', 'Cultural Significance', 
        'Narrative Summary', 'Source Reference', 'Status', 
        'Reviewer Notes', 'Generated Date'
      ];

      // Clear existing content and add headers to Summary sheet
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.sheetId,
        range: `'Summary'!A:Z`
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: `'Summary'!A1:M1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [summaryHeaders]
        }
      });

      // Format summary sheet headers (bold, frozen row)
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: this.SUMMARY_TAB_ID,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 13
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }
                  }
                },
                fields: 'userEnteredFormat(textFormat,backgroundColor)'
              }
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: this.SUMMARY_TAB_ID,
                  gridProperties: {
                    frozenRowCount: 1
                  }
                },
                fields: 'gridProperties.frozenRowCount'
              }
            }
          ]
        }
      });

      console.log('✅ Summary sheet setup complete with headers and formatting');

    } catch (error) {
      console.error('Failed to setup summary sheet:', error);
      throw error;
    }
  }

  /**
   * Import generated quiz content to Google Sheets
   */
  async importQuizBatch(batch: GeneratedQuizBatch): Promise<void> {
    try {
      console.log(`📥 Importing ${batch.questions.length} questions to Google Sheets`);

      const rows = this.convertQuestionsToRows(batch.questions, batch.generated_at);
      
      // Get current row count to append new data
      const existingData = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A:A'
      });

      const nextRow = (existingData.data.values?.length || 0) + 1;
      const range = `A${nextRow}:T${nextRow + rows.length - 1}`;

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: rows.map(row => this.rowToArray(row))
        }
      });

      console.log(`✅ Successfully imported ${rows.length} questions starting at row ${nextRow}`);

    } catch (error) {
      console.error('Failed to import quiz batch:', error);
      throw error;
    }
  }

  /**
   * Import multiple batches at once
   */
  async importMultipleBatches(batches: GeneratedQuizBatch[]): Promise<void> {
    console.log(`📥 Importing ${batches.length} batches to Google Sheets`);

    for (const batch of batches) {
      await this.importQuizBatch(batch);
      
      // Small delay between imports
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ All batches imported successfully');
  }

  /**
   * Import chapter summary to Google Sheets Summary tab
   */
  async importChapterSummary(summary: ChapterSummary, generatedAt: Date): Promise<void> {
    try {
      console.log(`📥 Importing chapter summary for ${summary.chapter}`);

      const summaryRow = this.convertSummaryToRow(summary, generatedAt);

      // Get current row count in Summary sheet
      const existingData = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `'Summary'!A:A`
      });

      const nextRow = (existingData.data.values?.length || 0) + 1;
      const range = `'Summary'!A${nextRow}:M${nextRow}`;

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [this.summaryRowToArray(summaryRow)]
        }
      });

      console.log(`✅ Successfully imported summary to row ${nextRow}`);

    } catch (error) {
      console.error('Failed to import chapter summary:', error);
      throw error;
    }
  }

  /**
   * Import both quiz questions and summary in one operation
   */
  async importCompleteContent(batch: GeneratedQuizBatch): Promise<void> {
    try {
      console.log(`📥 Importing complete content: ${batch.questions.length} questions + summary`);

      // Import quiz questions to main sheet
      await this.importQuizBatch(batch);

      // Import summary to summary sheet
      await this.importChapterSummary(batch.summary, batch.generated_at);

      console.log(`✅ Successfully imported complete content for ${batch.summary.chapter}`);

    } catch (error) {
      console.error('Failed to import complete content:', error);
      throw error;
    }
  }

  /**
   * Get approved questions from the sheet
   */
  async getApprovedQuestions(): Promise<GeneratedQuizQuestion[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A2:T1000' // Skip header row - now includes Kanda and Sarga columns
      });

      const rows = response.data.values || [];
      const approvedQuestions: GeneratedQuizQuestion[] = [];

      for (const row of rows) {
        if (row[17] === 'Approved') { // Status column (moved due to Kanda/Sarga columns)
          const question = this.rowToQuestion(row);
          if (question) {
            approvedQuestions.push(question);
          }
        }
      }

      console.log(`📊 Found ${approvedQuestions.length} approved questions`);
      return approvedQuestions;

    } catch (error) {
      console.error('Failed to get approved questions:', error);
      throw error;
    }
  }

  /**
   * Convert questions to sheet rows
   */
  private convertQuestionsToRows(questions: GeneratedQuizQuestion[], generatedDate: Date): SheetsRow[] {
    return questions.map((q, index) => ({
      questionId: `${q.chapter_source}_${index + 1}`,
      epic: q.epic_id,
      kanda: q.kanda || '',
      sarga: q.sarga?.toString() || '',
      chapterSource: q.chapter_source || '',
      category: q.category,
      difficulty: q.difficulty,
      questionText: q.question_text,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctAnswer: ['A', 'B', 'C', 'D'][q.correct_answer_id] || 'A',
      basicExplanation: q.basic_explanation,
      tags: q.tags.join(', '),
      culturalContext: q.cultural_context || '',
      sourceReference: q.source_reference,
      status: 'Needs Review',
      reviewerNotes: '',
      generatedDate: generatedDate.toISOString()
    }));
  }

  /**
   * Convert summary to sheet row
   */
  private convertSummaryToRow(summary: ChapterSummary, generatedAt: Date): SummaryRow {
    return {
      chapterId: `${summary.kanda}_sarga_${summary.sarga}`,
      kanda: summary.kanda,
      sarga: summary.sarga,
      title: summary.title,
      keyEvents: summary.key_events,
      mainCharacters: summary.main_characters,
      themes: summary.themes,
      culturalSignificance: summary.cultural_significance,
      narrativeSummary: summary.narrative_summary,
      sourceReference: summary.source_reference,
      status: 'Generated',
      reviewerNotes: '',
      generatedDate: generatedAt.toISOString()
    };
  }

  /**
   * Convert row object to array for sheets API
   */
  private rowToArray(row: SheetsRow): string[] {
    return [
      row.questionId,
      row.epic,
      row.kanda,
      row.sarga,
      row.chapterSource,
      row.category,
      row.difficulty,
      row.questionText,
      row.optionA,
      row.optionB,
      row.optionC,
      row.optionD,
      row.correctAnswer,
      row.basicExplanation,
      row.tags,
      row.culturalContext,
      row.sourceReference,
      row.status,
      row.reviewerNotes,
      row.generatedDate
    ];
  }

  /**
   * Convert summary row object to array for sheets API
   */
  private summaryRowToArray(row: SummaryRow): string[] {
    return [
      row.chapterId,
      row.kanda,
      row.sarga.toString(),
      row.title,
      row.keyEvents,
      row.mainCharacters,
      row.themes,
      row.culturalSignificance,
      row.narrativeSummary,
      row.sourceReference,
      row.status,
      row.reviewerNotes,
      row.generatedDate
    ];
  }

  /**
   * Convert sheet row back to question object
   */
  protected rowToQuestion(row: string[]): GeneratedQuizQuestion | null {
    try {
      const correctAnswerMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

      return {
        epic_id: row[1] || 'ramayana',
        kanda: row[2] || null,
        sarga: row[3] ? parseInt(row[3]) : null,
        chapter_source: row[4] || '',
        category: row[5] as any,
        difficulty: row[6] as any,
        question_text: row[7] || '',
        options: [row[8], row[9], row[10], row[11]].filter(Boolean),
        correct_answer_id: correctAnswerMap[row[12]] || 0,
        basic_explanation: row[13] || '',
        tags: row[14] ? row[14].split(', ').map(t => t.trim()) : [],
        cultural_context: row[15] || '',
        source_reference: row[16] || ''
      };
    } catch (error) {
      console.error('Error converting row to question:', error);
      return null;
    }
  }

  /**
   * Add data validation and formatting to the sheet
   */
  async setupDataValidation(): Promise<void> {
    try {
      console.log('📋 Setting up data validation...');

      const requests = [
        // Status column dropdown
        {
          setDataValidation: {
            range: {
              sheetId: 0,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 15, // Status column
              endColumnIndex: 16
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'Needs Review' },
                  { userEnteredValue: 'In Review' },
                  { userEnteredValue: 'Approved' },
                  { userEnteredValue: 'Rejected' },
                  { userEnteredValue: 'Needs Revision' }
                ]
              },
              showCustomUi: true
            }
          }
        },
        // Category column dropdown
        {
          setDataValidation: {
            range: {
              sheetId: 0,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 3, // Category column
              endColumnIndex: 4
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'characters' },
                  { userEnteredValue: 'events' },
                  { userEnteredValue: 'themes' },
                  { userEnteredValue: 'culture' }
                ]
              },
              showCustomUi: true
            }
          }
        }
      ];

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        requestBody: { requests }
      });

      console.log('✅ Data validation setup complete');

    } catch (error) {
      console.error('Failed to setup data validation:', error);
    }
  }

  /**
   * Get sheet statistics
   */
  async getSheetStats(): Promise<{
    totalQuestions: number;
    needsReview: number;
    approved: number;
    rejected: number;
  }> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A2:T1000' // Updated range to include kanda/sarga columns
      });

      const rows = response.data.values || [];
      let totalQuestions = 0;
      const stats = {
        totalQuestions: 0,
        needsReview: 0,
        approved: 0,
        rejected: 0
      };

      for (const row of rows) {
        // Skip empty rows
        if (row.length === 0 || !row[0]) continue;
        
        totalQuestions++;
        
        const status = row[17]; // Status column (updated from 15 to 17 due to kanda/sarga columns)
        if (status === 'Needs Review') stats.needsReview++;
        else if (status === 'Approved') stats.approved++;
        else if (status === 'Rejected') stats.rejected++;
      }

      stats.totalQuestions = totalQuestions;
      return stats;

    } catch (error) {
      console.error('Failed to get sheet stats:', error);
      return { totalQuestions: 0, needsReview: 0, approved: 0, rejected: 0 };
    }
  }
}