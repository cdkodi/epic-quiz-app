/**
 * Supabase Database Service
 * Handles all database operations for the Epic Quiz App
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ChapterSummary, GeneratedQuizQuestion } from './LLMContentService';

export interface DatabaseQuestion {
  id: string;
  epic_id: string;
  category: 'characters' | 'events' | 'themes' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[];
  correct_answer_id: number;
  basic_explanation: string;
  tags: string[];
  cultural_context?: string;
  source_reference: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSummary {
  id: string;
  epic_id: string;
  kanda: string;
  sarga: number;
  title: string;
  key_events: string;
  main_characters: string;
  themes: string;
  cultural_significance: string;
  narrative_summary: string;
  source_reference: string;
  created_at: string;
  updated_at: string;
}

export class SupabaseService {
  protected supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await this.supabase
        .from('epics')
        .select('count')
        .limit(1);

      if (error) {
        return { 
          success: false, 
          message: `Connection failed: ${error.message}` 
        };
      }

      return { 
        success: true, 
        message: 'Successfully connected to Supabase!' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection error: ${error.message}` 
      };
    }
  }

  /**
   * Initialize database schema
   */
  async initializeSchema(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔧 Initializing Epic Quiz database schema...');

      // Check if epics table exists
      const { data: epicsTable } = await this.supabase
        .from('epics')
        .select('id')
        .limit(1);

      if (!epicsTable) {
        return {
          success: false,
          message: 'Database schema not found. Please run the schema.sql file in Supabase SQL Editor first.'
        };
      }

      // Initialize Ramayana epic if it doesn't exist
      const { data: ramayanaEpic } = await this.supabase
        .from('epics')
        .select('id')
        .eq('id', 'ramayana')
        .single();

      if (!ramayanaEpic) {
        const { error } = await this.supabase
          .from('epics')
          .insert({
            id: 'ramayana',
            title: 'The Ramayana',
            description: 'An ancient Sanskrit epic that tells the story of Rama, his wife Sita, and his loyal brother Lakshmana.',
            language: 'Sanskrit',
            culture: 'Hindu',
            time_period: 'Ancient India (7th century BCE - 4th century CE)',
            is_available: true,
            difficulty_level: 'intermediate',
            estimated_reading_time: '2-3 hours'
          });

        if (error) {
          throw error;
        }

        console.log('✅ Ramayana epic initialized');
      }

      return {
        success: true,
        message: 'Database schema initialized successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: `Schema initialization failed: ${error.message}`
      };
    }
  }

  /**
   * Import quiz questions from Google Sheets content
   */
  async importQuizQuestions(questions: GeneratedQuizQuestion[]): Promise<{
    success: boolean;
    imported: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let imported = 0;

    console.log(`📥 Importing ${questions.length} quiz questions to Supabase...`);

    for (const question of questions) {
      try {
        const dbQuestion = {
          epic_id: question.epic_id || 'ramayana',
          category: question.category,
          difficulty: question.difficulty,
          question_text: question.question_text,
          options: question.options,
          correct_answer_id: question.correct_answer_id,
          basic_explanation: question.basic_explanation,
          tags: question.tags || [],
          cultural_context: question.cultural_context,
          source_reference: question.source_reference
        };

        const { error } = await this.supabase
          .from('questions')
          .insert(dbQuestion);

        if (error) {
          errors.push(`Question "${question.question_text.substring(0, 50)}...": ${error.message}`);
        } else {
          imported++;
        }

      } catch (error) {
        errors.push(`Question "${question.question_text.substring(0, 50)}...": ${error.message}`);
      }
    }

    console.log(`✅ Successfully imported ${imported} questions`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} errors occurred`);
    }

    return {
      success: imported > 0,
      imported,
      errors
    };
  }

  /**
   * Import chapter summaries
   */
  async importChapterSummaries(summaries: ChapterSummary[]): Promise<{
    success: boolean;
    imported: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let imported = 0;

    console.log(`📥 Importing ${summaries.length} chapter summaries to Supabase...`);

    for (const summary of summaries) {
      try {
        const dbSummary = {
          epic_id: 'ramayana',
          kanda: summary.kanda,
          sarga: summary.sarga,
          title: summary.title,
          key_events: summary.key_events,
          main_characters: summary.main_characters,
          themes: summary.themes,
          cultural_significance: summary.cultural_significance,
          narrative_summary: summary.narrative_summary,
          source_reference: summary.source_reference
        };

        const { error } = await this.supabase
          .from('chapter_summaries')
          .insert(dbSummary);

        if (error) {
          errors.push(`Summary "${summary.title}": ${error.message}`);
        } else {
          imported++;
        }

      } catch (error) {
        errors.push(`Summary "${summary.title}": ${error.message}`);
      }
    }

    console.log(`✅ Successfully imported ${imported} summaries`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} errors occurred`);
    }

    return {
      success: imported > 0,
      imported,
      errors
    };
  }

  /**
   * Get quiz questions for mobile app
   */
  async getQuizQuestions(epicId: string, count: number = 10): Promise<{
    success: boolean;
    questions: DatabaseQuestion[];
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('questions')
        .select('*')
        .eq('epic_id', epicId)
        .limit(count);

      if (error) {
        return {
          success: false,
          questions: [],
          error: error.message
        };
      }

      return {
        success: true,
        questions: data || []
      };

    } catch (error) {
      return {
        success: false,
        questions: [],
        error: error.message
      };
    }
  }

  /**
   * Get chapter summary for deep-dive content
   */
  async getChapterSummary(kanda: string, sarga: number): Promise<{
    success: boolean;
    summary: DatabaseSummary | null;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('chapter_summaries')
        .select('*')
        .eq('kanda', kanda)
        .eq('sarga', sarga)
        .single();

      if (error) {
        return {
          success: false,
          summary: null,
          error: error.message
        };
      }

      return {
        success: true,
        summary: data
      };

    } catch (error) {
      return {
        success: false,
        summary: null,
        error: error.message
      };
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    epics: number;
    questions: number;
    summaries: number;
  }> {
    try {
      const [epicsCount, questionsCount, summariesCount] = await Promise.all([
        this.supabase.from('epics').select('*', { count: 'exact', head: true }),
        this.supabase.from('questions').select('*', { count: 'exact', head: true }),
        this.supabase.from('chapter_summaries').select('*', { count: 'exact', head: true })
      ]);

      return {
        epics: epicsCount.count || 0,
        questions: questionsCount.count || 0,
        summaries: summariesCount.count || 0
      };

    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        epics: 0,
        questions: 0,
        summaries: 0
      };
    }
  }
}