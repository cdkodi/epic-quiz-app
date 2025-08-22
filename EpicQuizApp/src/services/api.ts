/**
 * Epic Quiz App - API Service
 * Integrated service that connects to Supabase for real-time data
 * with fallback to backend API for additional functionality
 */

import { Epic, QuizPackage, QuizSubmission, QuizResult, DeepDiveContent, ApiResponse } from '../types/api';
import { supabaseService } from './supabaseService';

// Configuration - Updated for mobile device compatibility
const getApiBaseUrl = () => {
  if (__DEV__) {
    // For development, we'll skip the backend for now since it has connection issues
    // The app will use the fallback to Supabase directly
    return null; // This will trigger immediate fallback
  } else {
    return 'https://your-production-domain.com/api/v1'; // Production backend
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Skip API call if no backend URL is configured (development fallback)
    if (!API_BASE_URL) {
      throw new Error('Backend API not available in development mode');
    }

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

  // Quiz methods - Now powered by Supabase with progressive block system
  async generateQuiz(
    epicId: string, 
    count: number = 10,
    options?: {
      difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
      category?: 'characters' | 'events' | 'themes' | 'culture' | 'mixed';
      blockId?: number;
    }
  ): Promise<ApiResponse<QuizPackage>> {
    try {
      console.log(`🎯 Generating quiz for ${epicId} with ${count} questions...`, options);
      
      if (!API_BASE_URL) {
        console.log('⚡ Development mode: Skipping backend API, using Supabase directly');
        throw new Error('Development mode - using fallback');
      }
      
      // Use new progressive block system via backend API
      const params = new URLSearchParams({
        epicId,
        count: count.toString(),
        ...(options?.difficulty && { difficulty: options.difficulty }),
        ...(options?.category && { category: options.category }),
        ...(options?.blockId && { blockId: options.blockId.toString() })
      });
      
      const response = await this.request<QuizPackage>(`/quiz?${params}`);
      
      if (response.success) {
        console.log(`✅ Successfully generated quiz with ${response.data.questions.length} questions`);
        if (response.data.block_info) {
          console.log(`📚 Using progressive block: ${response.data.block_info.name}`);
        }
      }
      
      return response;
    } catch (error) {
      console.log('📡 Using Supabase fallback with progressive block simulation...');
      try {
        // For now, simulate progressive blocks by using basic Supabase service
        // In the future, we can enhance supabaseService to support blocks directly
        const quizPackage = await supabaseService.getQuizPackage(epicId, count, {
          difficulty: options?.difficulty,
          category: options?.category
        });
        if (quizPackage) {
          // Add simulated block info for UI consistency
          const simulatedBlockInfo = this.getSimulatedBlockInfo(options?.difficulty || 'mixed');
          
          return {
            success: true,
            data: {
              ...quizPackage,
              block_info: simulatedBlockInfo
            },
          };
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      return {
        success: false,
        error: 'Quiz generation failed',
        message: 'Unable to generate quiz. Please check your connection and try again.',
      };
    }
  }

  // Progressive Block System Methods
  async getAvailableBlocks(epicId: string, difficulty?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({
      ...(difficulty && { difficulty })
    });
    
    return this.request<any[]>(`/quiz/blocks/${epicId}?${params}`);
  }

  async getRecommendedBlock(epicId: string, difficulty: string = 'easy'): Promise<ApiResponse<any>> {
    return this.request<any>(`/quiz/blocks/${epicId}/recommended?difficulty=${difficulty}`);
  }

  async generateBlockQuiz(blockId: number, count: number = 10): Promise<ApiResponse<QuizPackage>> {
    return this.request<QuizPackage>(`/quiz/block/${blockId}?count=${count}`);
  }

  // Helper method to simulate block info when backend is unavailable
  private getSimulatedBlockInfo(difficulty: string): any {
    const blockSimulations = {
      easy: {
        id: 1,
        name: 'Origins & Divine Birth',
        difficulty: 'easy',
        sarga_range: '1-5',
        learning_objectives: ['Understanding the cosmic context', 'Meeting main characters', 'Grasping divine intervention concept']
      },
      medium: {
        id: 4,
        name: 'Forest Adventures & Demon Battles', 
        difficulty: 'medium',
        sarga_range: '16-25',
        learning_objectives: ['Understanding dharma in action', 'Complexity of good vs evil', 'Strategic thinking']
      },
      hard: {
        id: 7,
        name: 'The Impossible Bow & Divine Marriage',
        difficulty: 'hard', 
        sarga_range: '51-65',
        learning_objectives: ['Symbolic meaning of divine trials', 'Marriage as cosmic union', 'Manifestation of destiny']
      }
    };

    return blockSimulations[difficulty as keyof typeof blockSimulations] || blockSimulations.easy;
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