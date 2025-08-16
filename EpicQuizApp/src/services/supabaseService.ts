/**
 * Supabase Service for Epic Quiz App
 * Handles real-time data fetching from Supabase for quiz questions and content
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuizPackage, Question, Epic, DeepDiveContent } from '../types/api';

// Supabase configuration
const SUPABASE_URL = 'https://ccfpbksllmvzxllwyqyv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZnBia3NsbG12enhsbHd5cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTM2NzUsImV4cCI6MjA3MDM2OTY3NX0.3tc1DD-LGOOU2uSzGzC_HYYu-G7EIBW8UjHawUJz6aw';

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

export interface DatabaseEpic {
  id: string;
  title: string;
  description: string;
  language: string;
  culture: string;
  time_period: string;
  question_count: number;
  is_available: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time: string;
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

class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Test connection to Supabase
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
   * Get all available epics
   */
  async getEpics(): Promise<Epic[]> {
    try {
      const { data, error } = await this.supabase
        .from('epics')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching epics:', error);
        return [];
      }

      // Convert database format to app format
      return data.map((dbEpic: DatabaseEpic): Epic => ({
        id: dbEpic.id,
        title: dbEpic.title,
        description: dbEpic.description || '',
        language: dbEpic.language || '',
        culture: dbEpic.culture || '',
        // Database fields
        question_count: dbEpic.question_count || 0,
        is_available: dbEpic.is_available || false,
        difficulty_level: dbEpic.difficulty_level,
        estimated_reading_time: dbEpic.estimated_reading_time,
        // Legacy aliases
        totalQuestions: dbEpic.question_count || 0,
        difficulty: dbEpic.difficulty_level,
        estimatedTime: dbEpic.estimated_reading_time || '',
        isAvailable: dbEpic.is_available || false,
        coverImage: '🕉️', // Use emoji for now
      }));
    } catch (error) {
      console.error('Error in getEpics:', error);
      return [];
    }
  }

  /**
   * Get quiz package for a specific epic
   * Implements the bulk download strategy for offline-first experience
   */
  async getQuizPackage(epicId: string, questionCount: number = 10): Promise<QuizPackage | null> {
    try {
      console.log(`Fetching ${questionCount} questions for epic: ${epicId}`);

      // Get random questions for the epic with balanced distribution
      const { data: questions, error: questionsError } = await this.supabase
        .from('questions')
        .select('*')
        .eq('epic_id', epicId)
        .order('created_at', { ascending: false })
        .limit(questionCount);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return null;
      }

      if (!questions || questions.length === 0) {
        console.warn('No questions found for epic:', epicId);
        return null;
      }

      // Get epic info
      const { data: epic, error: epicError } = await this.supabase
        .from('epics')
        .select('*')
        .eq('id', epicId)
        .single();

      if (epicError) {
        console.error('Error fetching epic:', epicError);
        return null;
      }

      // Convert database questions to app format
      const formattedQuestions: Question[] = questions.map((dbQ: DatabaseQuestion): Question => ({
        id: dbQ.id,
        epicId: dbQ.epic_id,
        category: dbQ.category,
        difficulty: dbQ.difficulty,
        questionText: dbQ.question_text,
        text: dbQ.question_text, // Legacy alias
        options: dbQ.options,
        correctAnswerId: dbQ.correct_answer_id,
        explanation: dbQ.basic_explanation,
        tags: dbQ.tags,
        culturalContext: dbQ.cultural_context,
        sourceReference: dbQ.source_reference,
      }));

      const quizPackage: QuizPackage = {
        id: `${epicId}_${Date.now()}`,
        epicId: epicId,
        epicTitle: epic.title,
        questions: formattedQuestions,
        totalQuestions: formattedQuestions.length,
        downloadedAt: new Date().toISOString(),
        metadata: {
          language: epic.language,
          culture: epic.culture,
          difficulty: epic.difficulty_level,
          estimatedTime: epic.estimated_reading_time,
        }
      };

      console.log(`Successfully prepared quiz package with ${formattedQuestions.length} questions`);
      return quizPackage;

    } catch (error) {
      console.error('Error in getQuizPackage:', error);
      return null;
    }
  }

  /**
   * Get deep dive content for a specific question
   */
  async getDeepDiveContent(questionId: string): Promise<DeepDiveContent | null> {
    try {
      // First get the question details
      const { data: question, error: questionError } = await this.supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionError) {
        console.error('Error fetching question:', questionError);
        return null;
      }

      // Try to get educational content (rich deep-dive content)
      const { data: educationalContent } = await this.supabase
        .from('educational_content')
        .select('*')
        .eq('question_id', questionId)
        .single();

      // Get related chapter summary if available
      let chapterSummary: DatabaseSummary | null = null;
      if (question.source_reference && question.source_reference.includes('Sarga')) {
        // Extract kanda and sarga from source reference
        const kandaMatch = question.source_reference.match(/(\w+)\s+Kanda/i);
        const sargaMatch = question.source_reference.match(/Sarga\s+(\d+)/i);
        
        if (kandaMatch && sargaMatch) {
          const { data } = await this.supabase
            .from('chapter_summaries')
            .select('*')
            .eq('kanda', kandaMatch[1].toLowerCase())
            .eq('sarga', parseInt(sargaMatch[1]))
            .single();
          
          chapterSummary = data;
        }
      }

      const deepDive: DeepDiveContent = {
        questionId: questionId,
        detailedExplanation: educationalContent?.detailed_explanation || question.basic_explanation,
        historicalBackground: educationalContent?.historical_background || '',
        culturalSignificance: question.cultural_context || '',
        scholarlyNotes: educationalContent?.scholarly_notes || '',
        crossEpicConnections: educationalContent?.cross_epic_connections || [],
        relatedTopics: educationalContent?.related_topics || [],
        recommendedReading: educationalContent?.recommended_reading || [],
        chapterSummary: chapterSummary ? {
          title: chapterSummary.title,
          keyEvents: chapterSummary.key_events,
          mainCharacters: chapterSummary.main_characters,
          themes: chapterSummary.themes,
          narrativeSummary: chapterSummary.narrative_summary,
        } : undefined,
      };

      return deepDive;
    } catch (error) {
      console.error('Error in getDeepDiveContent:', error);
      return null;
    }
  }

  /**
   * Get database statistics (useful for debugging)
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
      return { epics: 0, questions: 0, summaries: 0 };
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;