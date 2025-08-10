# API Services and Data Flow Documentation

## Overview

The Epic Quiz App implements a hybrid architecture combining Supabase as the primary data source with a Node.js backend for additional services and fallback capabilities.

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Google Sheets │    │   Supabase DB    │    │  React Native   │
│  (Content Review)│───▶│   (PostgreSQL)   │◀───│   Mobile App    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Backend API    │    │  AsyncStorage   │
                       │  (Node.js/Express)│    │ (Offline Cache) │
                       └──────────────────┘    └─────────────────┘
```

## Mobile App Services Layer

### 1. Supabase Service (`src/services/supabaseService.ts`)

Primary service for direct database communication.

#### Key Methods

```typescript
class SupabaseService {
  // Connection Management
  async testConnection(): Promise<{success: boolean, message: string}>
  
  // Epic Management
  async getEpics(): Promise<Epic[]>
  
  // Quiz Generation
  async getQuizPackage(epicId: string, questionCount?: number): Promise<QuizPackage | null>
  
  // Educational Content
  async getDeepDiveContent(questionId: string): Promise<DeepDiveContent | null>
  
  // Chapter Summaries
  async getChapterSummaries(epicId: string): Promise<ChapterSummary[]>
}
```

#### Data Transformations

The service handles format conversion between database schema and mobile app expectations:

```typescript
// Database → Mobile App transformation
const transformQuestionToMobile = (dbQuestion: any) => ({
  id: dbQuestion.id,
  questionText: dbQuestion.question_text,
  options: dbQuestion.options,
  correctAnswerId: dbQuestion.correct_answer_id,
  explanation: dbQuestion.basic_explanation,
  category: dbQuestion.category,
  difficulty: dbQuestion.difficulty,
});
```

### 2. API Service (`src/services/api.ts`)

Hybrid service implementing the fallback pattern: Supabase primary → Backend API fallback.

#### Core Pattern

```typescript
async getEpics(): Promise<ApiResponse<Epic[]>> {
  try {
    // Try Supabase first
    console.log('🔍 Fetching epics from Supabase...');
    const epics = await supabaseService.getEpics();
    return { success: true, data: epics };
  } catch (error) {
    // Fallback to backend API
    console.log('📡 Falling back to backend API...');
    return this.request<Epic[]>('/epics');
  }
}
```

#### Error Handling Strategy

```typescript
private async handleSupabaseError(error: any, fallbackMethod: () => Promise<any>) {
  console.warn('Supabase error:', error.message);
  
  if (this.isNetworkError(error)) {
    // Try offline cache first
    return this.tryOfflineCache();
  }
  
  // Otherwise use backend fallback
  return fallbackMethod();
}
```

### 3. Offline Storage Service (`src/services/offlineStorageService.ts`)

Manages local caching for offline-first experience.

#### Cache Strategy

```typescript
class OfflineStorageService {
  // Quiz package caching with 24-hour expiry
  async storeQuizPackage(quizPackage: QuizPackage): Promise<boolean>
  async getQuizPackage(epicId: string): Promise<QuizPackage | null>
  
  // Epic list caching
  async cacheEpics(epics: Epic[]): Promise<boolean>
  async getCachedEpics(): Promise<Epic[] | null>
  
  // Cache validation
  async isCacheValid(maxAgeHours: number = 24): Promise<boolean>
  
  // Cache management
  async clearCache(): Promise<boolean>
  async getCacheStats(): Promise<CacheStats>
}
```

## Data Flow Patterns

### 1. Epic Library Screen Flow

```
User opens app
     ↓
Check cached epics → Valid? → Display cached epics
     ↓                ↓
Fetch from Supabase   Update cache in background
     ↓
Display fresh epics + Update cache
```

### 2. Quiz Generation Flow

```
User selects epic → Generate quiz request
     ↓
Check cached quiz package → Valid? → Use cached version
     ↓                        ↓
Fetch from Supabase → Transform data → Cache package
     ↓
Return quiz package to UI
```

### 3. Deep Dive Content Flow

```
User taps "Learn More"
     ↓
Check question ID → Fetch educational content
     ↓
Get chapter summaries → Combine content
     ↓
Display rich educational experience
```

## Backend Services Integration

### Google Sheets Import Pipeline

```typescript
// Backend service for content management
class GoogleSheetsService {
  async importQuizBatch(): Promise<ImportResult>
  async importChapterSummaries(): Promise<ImportResult>
  async getApprovedContent(): Promise<ContentItem[]>
}
```

### Supabase Integration Service

```typescript
// Backend Supabase client
class SupabaseService {
  async insertQuestion(question: QuestionData): Promise<InsertResult>
  async insertChapterSummary(summary: SummaryData): Promise<InsertResult>
  async updateEpicStats(epicId: string): Promise<void>
}
```

## Performance Optimization

### Database Query Optimization

```sql
-- Optimized quiz generation query
SELECT q.*, e.title as epic_title 
FROM questions q
JOIN epics e ON q.epic_id = e.id
WHERE q.epic_id = $1 
  AND e.is_available = true
ORDER BY q.created_at DESC
LIMIT $2;
```

### Mobile App Optimizations

1. **Bulk Loading**: Single API call for complete quiz packages
2. **Smart Caching**: 24-hour cache with background refresh
3. **Connection Pooling**: Supabase client reuse
4. **Error Recovery**: Graceful fallback to cached content

### Performance Metrics

| Operation | Target | Achieved | Method |
|-----------|---------|----------|---------|
| Epic Loading | < 1s | ~171ms | Direct Supabase query |
| Quiz Generation | < 2s | ~200ms | Bulk package creation |
| Question Display | Instant | Instant | Local cache |
| Deep Dive | < 1s | ~400ms | On-demand loading |

## Error Handling Patterns

### Network Error Recovery

```typescript
async handleNetworkError(error: NetworkError): Promise<Recovery> {
  // 1. Try cached data
  const cached = await this.getFromCache();
  if (cached) return cached;
  
  // 2. Try backend API
  const fallback = await this.tryBackendAPI();
  if (fallback) return fallback;
  
  // 3. Show offline message
  return this.showOfflineState();
}
```

### Data Validation

```typescript
// Validate quiz package integrity
const validateQuizPackage = (package: any): boolean => {
  return (
    package?.questions?.length > 0 &&
    package.questions.every(q => 
      q.questionText && 
      q.options?.length === 4 && 
      typeof q.correctAnswerId === 'number'
    )
  );
};
```

## Security Considerations

### Data Protection

1. **Row Level Security**: Configured in Supabase
2. **API Key Management**: Environment variables only
3. **Input Sanitization**: All user inputs validated
4. **Error Messages**: No sensitive data exposed

### Authentication Strategy

```typescript
// Anonymous access with optional user accounts
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY, // Read-only access
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: false // Mobile handles persistence
    }
  }
};
```

## Testing Strategy

### Service Testing

```javascript
// Test complete data flow
describe('API Services Integration', () => {
  test('Epic loading with Supabase fallback', async () => {
    // Test Supabase primary path
    const epics = await apiService.getEpics();
    expect(epics.success).toBe(true);
    expect(epics.data.length).toBeGreaterThan(0);
  });
  
  test('Quiz generation with caching', async () => {
    const quiz = await apiService.generateQuiz('ramayana', 10);
    expect(quiz.data.questions).toHaveLength(10);
    
    // Verify caching worked
    const cached = await offlineStorageService.getQuizPackage('ramayana');
    expect(cached).not.toBeNull();
  });
});
```

### Performance Testing

```javascript
// Test response times
test('Performance requirements met', async () => {
  const startTime = Date.now();
  const epics = await apiService.getEpics();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(1000); // < 1s target
  expect(epics.success).toBe(true);
});
```

## Deployment Configuration

### Environment Variables

```env
# Mobile App (.env)
SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=epic_quiz_db
GOOGLE_SHEETS_CREDENTIALS_PATH=./google-credentials.json
CONTENT_REVIEW_SHEET_ID=1dh8a4NVHkXcTHfOFESXUxd3xToBnBP01S2nGhp7fvVQ
```

### Production Considerations

1. **Connection Limits**: Supabase connection pooling
2. **Rate Limiting**: Implement client-side throttling
3. **Monitoring**: Log performance metrics
4. **Fallback Strategy**: Backend API always available
5. **Cache Strategy**: Intelligent pre-fetching

## Future Enhancements

### Planned Improvements

1. **Real-time Updates**: Supabase subscriptions for live content
2. **Advanced Caching**: Intelligent pre-fetching based on user behavior
3. **Offline Sync**: Background synchronization when online
4. **Analytics Integration**: User progress tracking in Supabase
5. **Multi-Epic Support**: Cross-epic content connections

### Scalability Roadmap

1. **CDN Integration**: Static content delivery
2. **Redis Caching**: Backend performance optimization
3. **Load Balancing**: Multiple backend instances
4. **Database Sharding**: Epic-based partitioning

---

*This documentation covers the complete API services architecture enabling the Epic Quiz App's production-ready educational experience.*