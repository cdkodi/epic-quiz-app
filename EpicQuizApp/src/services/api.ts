/**
 * Epic Quiz App - API Service
 * Connects to our production-ready backend
 */

import { Epic, QuizPackage, QuizSubmission, QuizResult, DeepDiveContent, ApiResponse } from '../types/api';

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

  // Epic methods
  async getEpics(): Promise<ApiResponse<Epic[]>> {
    return this.request<Epic[]>('/epics');
  }

  async getEpicById(epicId: string): Promise<ApiResponse<Epic>> {
    return this.request<Epic>(`/epics/${epicId}`);
  }

  // Quiz methods
  async generateQuiz(epicId: string, count: number = 10): Promise<ApiResponse<QuizPackage>> {
    return this.request<QuizPackage>(`/quiz?epicId=${epicId}&count=${count}`);
  }

  async submitQuiz(submission: QuizSubmission): Promise<ApiResponse<QuizResult>> {
    return this.request<QuizResult>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  // Deep dive content
  async getDeepDiveContent(questionId: string): Promise<ApiResponse<DeepDiveContent>> {
    return this.request<DeepDiveContent>(`/questions/${questionId}/deep-dive`);
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;