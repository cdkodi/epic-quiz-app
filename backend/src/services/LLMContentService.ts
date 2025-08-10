/**
 * LLM Content Service - Generate quiz content using OpenAI
 */

import OpenAI from 'openai';
import { ValmikiContent } from './ValmikiScrapingService';

export interface GeneratedQuizQuestion {
  epic_id: string;
  chapter_source?: string;
  category: 'characters' | 'events' | 'themes' | 'culture';
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[];
  correct_answer_id: number;
  basic_explanation: string;
  tags: string[];
  cultural_context?: string;
  source_reference: string;
}

export interface ChapterSummary {
  chapter: string;
  kanda: string;
  sarga: number;
  title: string;
  key_events: string;
  main_characters: string;
  themes: string;
  cultural_significance: string;
  narrative_summary: string;
  source_reference: string;
}

export interface GeneratedQuizBatch {
  questions: GeneratedQuizQuestion[];
  summary: ChapterSummary;
  source: ValmikiContent;
  generated_at: Date;
  total_questions: number;
}

export class LLMContentService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate quiz questions and chapter summary from Valmiki Ramayana content
   */
  async generateQuizQuestions(
    content: ValmikiContent, 
    questionCount: number = 5
  ): Promise<GeneratedQuizBatch> {
    
    const prompt = this.buildEnhancedGenerationPrompt(content, questionCount);
    
    try {
      console.log(`🤖 Generating ${questionCount} quiz questions for ${content.kandaName} Sarga ${content.sargaNumber}`);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      
      // Validate and process the generated questions
      const validatedQuestions = this.validateAndProcessQuestions(
        parsedResponse.questions, 
        content
      );

      // Process the chapter summary
      const summary = this.processSummary(parsedResponse.summary, content);

      return {
        questions: validatedQuestions,
        summary: summary,
        source: content,
        generated_at: new Date(),
        total_questions: validatedQuestions.length
      };

    } catch (error) {
      console.error('Failed to generate quiz questions:', error);
      throw new Error(`LLM generation failed: ${error.message}`);
    }
  }

  /**
   * Generate questions in batch for multiple chapters
   */
  async generateBatchQuestions(
    contents: ValmikiContent[],
    questionsPerChapter: number = 5
  ): Promise<GeneratedQuizBatch[]> {
    const results: GeneratedQuizBatch[] = [];
    
    console.log(`🚀 Batch generating questions for ${contents.length} chapters`);
    
    for (const content of contents) {
      try {
        const batch = await this.generateQuizQuestions(content, questionsPerChapter);
        results.push(batch);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to generate for ${content.kandaName} ${content.sargaNumber}:`, error.message);
      }
    }
    
    return results;
  }

  /**
   * Build enhanced prompt for both quiz questions and chapter summary
   */
  private buildEnhancedGenerationPrompt(content: ValmikiContent, questionCount: number): string {
    return `
Generate exactly ${questionCount} high-quality educational quiz questions AND a comprehensive chapter summary based on this Valmiki Ramayana content:

CHAPTER: ${content.kandaName} Kanda, Sarga ${content.sargaNumber}
TITLE: ${content.title}
CONTENT: ${content.content}

REQUIREMENTS:
1. Create diverse questions covering characters, events, themes, and cultural aspects
2. Include all difficulty levels (easy, medium, hard) 
3. Each question must have exactly 4 plausible options
4. Provide clear, educational explanations
5. Add relevant tags for categorization
6. Create a comprehensive chapter summary for deep-dive content generation
7. Focus on educational value and cultural accuracy

OUTPUT FORMAT (valid JSON):
{
  "questions": [
    {
      "epic_id": "ramayana",
      "chapter_source": "${content.kandaName}_sarga_${content.sargaNumber}",
      "category": "characters|events|themes|culture",
      "difficulty": "easy|medium|hard",
      "question_text": "Clear, educational question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_id": 0,
      "basic_explanation": "1-2 sentence explanation of why this is correct",
      "tags": ["tag1", "tag2", "tag3"],
      "cultural_context": "Brief cultural or historical significance",
      "source_reference": "${content.kandaName} Kanda, Sarga ${content.sargaNumber}"
    }
  ],
  "summary": {
    "chapter": "${content.kandaName} Kanda, Sarga ${content.sargaNumber}",
    "kanda": "${content.kandaName}",
    "sarga": ${content.sargaNumber},
    "title": "Chapter title or main theme",
    "key_events": "3-4 bullet points of main events in this chapter",
    "main_characters": "Key characters introduced or featured",
    "themes": "Philosophical and moral themes explored",
    "cultural_significance": "Cultural, religious, or historical importance",
    "narrative_summary": "2-3 paragraph comprehensive summary suitable for deep-dive explanations",
    "source_reference": "${content.kandaName} Kanda, Sarga ${content.sargaNumber}"
  }
}
`;
  }

  /**
   * Build the quiz generation prompt (legacy method - keeping for compatibility)
   */
  private buildQuizGenerationPrompt(content: ValmikiContent, questionCount: number): string {
    return `
Generate exactly ${questionCount} high-quality educational quiz questions based on this Valmiki Ramayana content:

CHAPTER: ${content.kandaName} Kanda, Sarga ${content.sargaNumber}
TITLE: ${content.title}
CONTENT: ${content.content}

REQUIREMENTS:
1. Create diverse questions covering characters, events, themes, and cultural aspects
2. Include all difficulty levels (easy, medium, hard) 
3. Each question must have exactly 4 plausible options
4. Provide clear, educational explanations
5. Add relevant tags for categorization
6. Focus on educational value and cultural accuracy
7. No Sanskrit verses needed - focus on content and meaning

OUTPUT FORMAT:
{
  "questions": [
    {
      "epic_id": "ramayana",
      "chapter_source": "${content.kandaName}_sarga_${content.sargaNumber}",
      "category": "characters|events|themes|culture",
      "difficulty": "easy|medium|hard",
      "question_text": "Clear, educational question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_id": 0,
      "basic_explanation": "1-2 sentence explanation of why this is correct",
      "tags": ["tag1", "tag2", "tag3"],
      "cultural_context": "Brief cultural or historical significance",
      "source_reference": "${content.kandaName} Kanda, Sarga ${content.sargaNumber}"
    }
  ]
}
`;
  }

  /**
   * Get the system prompt for quiz generation
   */
  private getSystemPrompt(): string {
    return `You are an expert in Valmiki Ramayana and Hindu epic literature, creating high-quality educational quiz questions for students learning about these classical texts.

Your role is to:
- Generate academically accurate questions that test understanding, not just memorization
- Create plausible incorrect options that represent common misconceptions
- Provide educational explanations that enhance learning
- Respect the cultural and religious significance of the content
- Focus on themes, character development, and narrative significance

Question categories:
- Characters: Focus on character traits, relationships, and development
- Events: Key plot points, consequences, and narrative structure
- Themes: Dharma, devotion, duty, moral lessons, universal themes
- Culture: Historical context, traditions, religious practices, symbolism

Always output valid JSON with exactly the specified number of questions.`;
  }

  /**
   * Validate and process generated questions
   */
  private validateAndProcessQuestions(
    questions: any[], 
    source: ValmikiContent
  ): GeneratedQuizQuestion[] {
    const validatedQuestions: GeneratedQuizQuestion[] = [];

    for (const q of questions) {
      try {
        // Basic validation
        if (!this.isValidQuestion(q)) {
          console.warn('Invalid question structure, skipping');
          continue;
        }

        // Process and clean the question
        const processedQuestion: GeneratedQuizQuestion = {
          epic_id: 'ramayana',
          chapter_source: `${source.kandaName}_sarga_${source.sargaNumber}`,
          category: q.category,
          difficulty: q.difficulty,
          question_text: q.question_text.trim(),
          options: q.options.map((opt: string) => opt.trim()),
          correct_answer_id: parseInt(q.correct_answer_id),
          basic_explanation: q.basic_explanation.trim(),
          tags: Array.isArray(q.tags) ? q.tags : [],
          cultural_context: q.cultural_context?.trim(),
          source_reference: q.source_reference || `${source.kandaName} Kanda, Sarga ${source.sargaNumber}`
        };

        validatedQuestions.push(processedQuestion);

      } catch (error) {
        console.warn('Error processing question:', error.message);
      }
    }

    return validatedQuestions;
  }

  /**
   * Process and validate chapter summary
   */
  private processSummary(summaryData: any, source: ValmikiContent): ChapterSummary {
    if (!summaryData) {
      throw new Error('No summary data provided');
    }

    return {
      chapter: summaryData.chapter || `${source.kandaName} Kanda, Sarga ${source.sargaNumber}`,
      kanda: summaryData.kanda || source.kandaName,
      sarga: summaryData.sarga || source.sargaNumber,
      title: summaryData.title || source.title || 'Chapter Summary',
      key_events: summaryData.key_events || 'No key events provided',
      main_characters: summaryData.main_characters || 'No characters specified',
      themes: summaryData.themes || 'No themes identified',
      cultural_significance: summaryData.cultural_significance || 'Cultural context not provided',
      narrative_summary: summaryData.narrative_summary || 'No narrative summary available',
      source_reference: summaryData.source_reference || `${source.kandaName} Kanda, Sarga ${source.sargaNumber}`
    };
  }

  /**
   * Validate question structure
   */
  private isValidQuestion(question: any): boolean {
    return (
      question &&
      typeof question.question_text === 'string' &&
      question.question_text.length > 10 &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((opt: any) => typeof opt === 'string' && opt.length > 0) &&
      typeof question.correct_answer_id === 'number' &&
      question.correct_answer_id >= 0 &&
      question.correct_answer_id <= 3 &&
      typeof question.basic_explanation === 'string' &&
      question.basic_explanation.length > 10 &&
      ['characters', 'events', 'themes', 'culture'].includes(question.category) &&
      ['easy', 'medium', 'hard'].includes(question.difficulty)
    );
  }

  /**
   * Estimate token usage for cost tracking
   */
  estimateTokenUsage(content: ValmikiContent, questionCount: number): number {
    // Rough estimation: prompt + content + expected response
    const promptTokens = 500;
    const contentTokens = Math.ceil(content.content.length / 4); // ~4 chars per token
    const responseTokens = questionCount * 200; // ~200 tokens per question
    
    return promptTokens + contentTokens + responseTokens;
  }

  /**
   * Get cost estimate for generation
   */
  estimateGenerationCost(content: ValmikiContent, questionCount: number): number {
    const tokens = this.estimateTokenUsage(content, questionCount);
    // GPT-4 Turbo pricing (approximate)
    const costPerToken = 0.00003; // $0.03 per 1K tokens
    return tokens * costPerToken;
  }
}