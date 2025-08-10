/**
 * Epic Quiz App - API Service
 * Integrated service that connects to Supabase for real-time data
 * with fallback to backend API for additional functionality
 */

import { Epic, QuizPackage, QuizSubmission, QuizResult, DeepDiveContent, ApiResponse } from '../types/api';
import { supabaseService } from './supabaseService';

// Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'  // Development backend
  : 'https://your-production-domain.com/api/v1';  // Production backend

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          message: errorData.message || 'Request failed',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: 'Network error',
        message: 'Unable to connect to server. Please check your connection.',
      };
    }
  }

  // Epic methods - Now powered by Supabase
  async getEpics(): Promise<ApiResponse<Epic[]>> {
    try {
      console.log('🔍 Fetching epics from Supabase...');
      const epics = await supabaseService.getEpics();
      
      return {
        success: true,
        data: epics,
      };
    } catch (error) {
      console.error('Error fetching epics from Supabase:', error);
      
      // Fallback to backend API
      console.log('📡 Falling back to backend API...');
      return this.request<Epic[]>('/epics');
    }
  }

  async getEpicById(epicId: string): Promise<ApiResponse<Epic>> {
    try {
      const epics = await supabaseService.getEpics();
      const epic = epics.find(e => e.id === epicId);
      
      if (epic) {
        return {
          success: true,
          data: epic,
        };
      } else {
        return {
          success: false,
          error: 'Epic not found',
          message: `Epic with id ${epicId} not found`,
        };
      }
    } catch (error) {
      console.error('Error fetching epic from Supabase:', error);
      
      // Fallback to backend API
      return this.request<Epic>(`/epics/${epicId}`);
    }
  }

  // Quiz methods - Now powered by Supabase with offline-first approach
  async generateQuiz(epicId: string, count: number = 10): Promise<ApiResponse<QuizPackage>> {
    try {
      console.log(`🎯 Generating quiz for ${epicId} with ${count} questions...`);
      const quizPackage = await supabaseService.getQuizPackage(epicId, count);
      
      if (quizPackage) {
        console.log(`✅ Successfully generated quiz with ${quizPackage.questions.length} questions`);
        return {
          success: true,
          data: quizPackage,
        };
      } else {
        return {
          success: false,
          error: 'No questions available',
          message: `No quiz questions found for epic ${epicId}`,
        };
      }
    } catch (error) {
      console.error('Error generating quiz from Supabase:', error);
      
      // Fallback to backend API
      console.log('📡 Falling back to backend API for quiz generation...');
      return this.request<QuizPackage>(`/quiz?epicId=${epicId}&count=${count}`);
    }
  }

  async submitQuiz(submission: QuizSubmission): Promise<ApiResponse<QuizResult>> {
    return this.request<QuizResult>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  // Deep dive content - Now powered by Supabase with chapter summaries
  async getDeepDiveContent(questionId: string): Promise<ApiResponse<DeepDiveContent>> {
    try {
      console.log(`📚 Fetching deep dive content for question: ${questionId}`);
      const deepDive = await supabaseService.getDeepDiveContent(questionId);
      
      if (deepDive) {
        return {
          success: true,
          data: deepDive,
        };
      } else {
        return {
          success: false,
          error: 'Content not found',
          message: `Deep dive content not found for question ${questionId}`,
        };
      }
    } catch (error) {
      console.error('Error fetching deep dive from Supabase:', error);
      
      // Fallback to backend API
      console.log('📡 Falling back to backend API for deep dive...');
      return this.request<DeepDiveContent>(`/questions/${questionId}/deep-dive`);
    }
  }

  // Health check - Now includes Supabase connectivity
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string; supabase?: { connected: boolean; stats?: any }; backend?: any }>> {
    try {
      // Check Supabase connection and get stats
      const [supabaseTest, stats] = await Promise.all([
        supabaseService.testConnection(),
        supabaseService.getStats()
      ]);

      // Also try backend API health check
      let backendHealth;
      try {
        backendHealth = await this.request<{ status: string; timestamp: string }>('/health');
      } catch (error) {
        console.log('Backend API not available, continuing with Supabase only');
      }

      return {
        success: true,
        data: {
          status: supabaseTest.success ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          supabase: {
            connected: supabaseTest.success,
            stats: supabaseTest.success ? stats : undefined
          },
          backend: backendHealth?.success ? backendHealth.data : { available: false }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Health check failed',
        message: 'Unable to determine system health'
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;