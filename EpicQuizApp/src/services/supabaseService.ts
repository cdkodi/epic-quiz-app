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
  async getQuizPackage(
    epicId: string, 
    questionCount: number = 10, 
    options?: {
      difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
      category?: 'characters' | 'events' | 'themes' | 'culture' | 'mixed';
    }
  ): Promise<QuizPackage | null> {
    try {
      console.log(`Fetching ${questionCount} questions for epic: ${epicId}`, options);

      // Build query with difficulty and category filters
      let query = this.supabase
        .from('questions')
        .select('*')
        .eq('epic_id', epicId);

      // Apply difficulty filter
      if (options?.difficulty && options.difficulty !== 'mixed') {
        query = query.eq('difficulty', options.difficulty);
        console.log(`🎯 Filtering by difficulty: ${options.difficulty}`);
      }

      // Apply category filter  
      if (options?.category && options.category !== 'mixed') {
        query = query.eq('category', options.category);
        console.log(`📚 Filtering by category: ${options.category}`);
      }

      // Get questions with filters applied
      const { data: questions, error: questionsError } = await query
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
      
      // Use direct kanda and sarga fields from questions table (optimized approach)
      if (question.kanda && question.sarga) {
        console.log(`📚 Looking for chapter: ${question.kanda}, sarga ${question.sarga}`);
        
        const { data } = await this.supabase
          .from('chapter_summaries')
          .select('*')
          .eq('kanda', question.kanda)
          .eq('sarga', question.sarga)
          .single();
        
        if (data) {
          console.log(`✅ Found chapter summary: ${data.title}`);
          chapterSummary = data;
        } else {
          console.log(`❌ No chapter summary found for ${question.kanda}, sarga ${question.sarga}`);
        }
      } else if (question.source_reference && question.source_reference.includes('sarga')) {
        // Fallback: URL parsing only when direct fields are missing
        console.log(`⚠️ Missing kanda/sarga fields, falling back to URL parsing: ${question.source_reference}`);
        
        const urlKandaMatch = question.source_reference.match(/\/(baala|ayodhya|aranya|kishkindha|sundara|yuddha)\//i);
        const urlSargaMatch = question.source_reference.match(/sarga(\d+)/i);
        
        if (urlKandaMatch && urlSargaMatch) {
          // Map URL kanda names to database kanda names
          const kandaMapping: Record<string, string> = {
            'baala': 'bala_kanda',
            'ayodhya': 'ayodhya_kanda', 
            'aranya': 'aranya_kanda',
            'kishkindha': 'kishkindha_kanda',
            'sundara': 'sundara_kanda',
            'yuddha': 'yuddha_kanda'
          };
          
          const kandaName = kandaMapping[urlKandaMatch[1].toLowerCase()];
          const sargaNumber = parseInt(urlSargaMatch[1]);
          
          console.log(`📚 Fallback lookup: ${kandaName}, sarga ${sargaNumber}`);
          
          const { data } = await this.supabase
            .from('chapter_summaries')
            .select('*')
            .eq('kanda', kandaName)
            .eq('sarga', sargaNumber)
            .single();
          
          chapterSummary = data;
        }
      }

      // Only use authentic database content
      const deepDive: DeepDiveContent = {
        questionId: questionId,
        detailedExplanation: educationalContent?.detailed_explanation || question.basic_explanation,
        historicalBackground: educationalContent?.historical_background || '',
        culturalSignificance: question.cultural_context || educationalContent?.cultural_significance || '',
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