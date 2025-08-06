# Epic Quiz API Documentation

## Overview

The Epic Quiz API implements a **hybrid content delivery architecture** designed for educational mobile applications. The API supports offline-first functionality through bulk download strategies while providing on-demand rich educational content.

## Key Architectural Patterns

### 1. **Bulk Download Strategy**
- **Primary Endpoint**: `GET /api/v1/quiz?epic={epicId}`
- **Purpose**: Single API call downloads complete quiz package for offline use
- **Performance Target**: <2 seconds for 10-question package
- **Mobile Optimization**: Includes all data needed for offline quiz experience

### 2. **Lazy Loading for Educational Content** 
- **Primary Endpoint**: `GET /api/v1/questions/:id/deep-dive`
- **Purpose**: On-demand loading of rich educational explanations
- **Performance Target**: <1 second response time
- **Educational Value**: Transforms quiz questions into learning opportunities

### 3. **RESTful Educational Hierarchy**
- **URL Structure**: Reflects educational content relationships
- **Epic-Centric**: `/api/v1/epics/ramayana/quiz` clearly shows content organization
- **Scalable**: Easy expansion to new literary works

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Currently supports anonymous sessions. Authentication will be added for user progress tracking and bookmarking features.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": { 
    "timestamp": "2025-08-06T05:59:50.340Z",
    "count": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Request validation failed",
  "timestamp": "2025-08-06T05:59:50.340Z",
  "path": "/api/v1/quiz",
  "method": "GET"
}
```

## API Endpoints

### **Epics Management**

#### GET /epics
Get all available epics

**Query Parameters:**
- `includeUnavailable` (boolean, optional): Include epics not yet ready for quizzes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ramayana",
      "title": "The Ramayana",
      "description": "Ancient Indian epic narrating the journey of Rama, Sita, and Hanuman",
      "language": "sanskrit",
      "culture": "hindu", 
      "time_period": "Ancient India (7th century BCE - 4th century CE)",
      "question_count": 25,
      "is_available": true,
      "difficulty_level": "beginner",
      "estimated_reading_time": "2-3 hours"
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2025-08-06T05:59:50.340Z"
  }
}
```

#### GET /epics/:epicId
Get detailed information about a specific epic

**Parameters:**
- `epicId` (string): Epic identifier (e.g., "ramayana", "mahabharata")

**Response:** Single epic object with same structure as above

#### GET /epics/:epicId/stats  
Get comprehensive statistics for an epic

**Response:**
```json
{
  "success": true,
  "data": {
    "epic": {
      "id": "ramayana",
      "title": "The Ramayana",
      "language": "sanskrit"
    },
    "statistics": {
      "total_questions": 25,
      "questions_by_category": {
        "characters": 8,
        "events": 7,
        "themes": 6,
        "culture": 4
      },
      "questions_by_difficulty": {
        "easy": 10,
        "medium": 10,
        "hard": 5
      },
      "avg_completion_rate": 78.5
    }
  }
}
```

#### GET /epics/trending
Get trending epics based on recent quiz activity

**Query Parameters:**
- `limit` (integer, default: 5): Maximum number of epics to return

#### GET /epics/search
Search epics by title, description, or culture

**Query Parameters:**
- `q` (string, required): Search query (min 2 characters)

### **Quiz Generation & Submission**

#### GET /quiz ⭐ **CRITICAL ENDPOINT**
Generate quiz package for bulk download

**Query Parameters:**
- `epic` (string, required): Epic ID (e.g., "ramayana")
- `count` (integer, default: 10): Number of questions (5-20)
- `difficulty` (string, default: "mixed"): "easy", "medium", "hard", "mixed"
- `category` (string, default: "mixed"): "characters", "events", "themes", "culture", "mixed"

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz_id": "550e8400-e29b-41d4-a716-446655440000",
    "epic": {
      "id": "ramayana", 
      "title": "The Ramayana",
      "language": "sanskrit"
    },
    "questions": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "text": "Who is the main protagonist of the Ramayana?",
        "options": ["Rama", "Krishna", "Arjuna", "Hanuman"],
        "correct_answer_id": 0,
        "basic_explanation": "Rama is the seventh avatar of Vishnu and the central hero of the Ramayana epic.",
        "category": "characters"
      }
    ]
  },
  "meta": {
    "epic": {
      "id": "ramayana",
      "title": "The Ramayana", 
      "language": "sanskrit",
      "culture": "hindu"
    },
    "quiz_info": {
      "question_count": 10,
      "estimated_time_minutes": 15,
      "difficulty_requested": "mixed",
      "generated_at": "2025-08-06T05:59:50.340Z",
      "cache_duration_hours": 24
    },
    "categories_distribution": {
      "characters": 3,
      "events": 3,
      "themes": 2,
      "culture": 2
    }
  }
}
```

**Key Features:**
- **Complete Offline Data**: Includes all questions, options, and basic explanations
- **Balanced Selection**: Distributed across categories and difficulties  
- **Caching Optimization**: 24-hour cache headers for performance
- **Mobile-Friendly**: Optimized response size and structure

#### POST /quiz/submit
Submit quiz results and get comprehensive feedback

**Request Body:**
```json
{
  "quizId": "550e8400-e29b-41d4-a716-446655440000",
  "epicId": "ramayana",
  "answers": [
    {
      "question_id": "123e4567-e89b-12d3-a456-426614174000",
      "user_answer": 0,
      "time_spent": 45
    }
  ],
  "timeSpent": 450,
  "deviceType": "mobile",
  "appVersion": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz_id": "550e8400-e29b-41d4-a716-446655440000",
    "score": 80,
    "total_questions": 10,
    "correct_answers": 8,
    "percentage": 80,
    
    "feedback": {
      "message": "Great work! You're developing strong understanding.",
      "performance_level": "Good",
      "encouragement": "Great work! You're developing strong understanding.",
      "next_steps": [
        "Explore the 'Learn More' content for deeper understanding",
        "Try a more challenging difficulty level"
      ]
    },
    
    "progress": {
      "total_quizzes": 5,
      "average_score": 75,
      "category_strengths": {
        "characters": { "percentage": 85, "level": "strong" },
        "events": { "percentage": 70, "level": "developing" }
      },
      "mastery_level": "intermediate"
    },
    
    "time_analysis": {
      "total_seconds": 450,
      "average_per_question": 45,
      "efficiency_rating": "balanced"
    }
  }
}
```

**Educational Features:**
- **Personalized Feedback**: Performance-based encouragement and suggestions
- **Progress Tracking**: Category-level analytics and mastery assessment
- **Learning Guidance**: Specific next steps based on performance
- **Time Analysis**: Efficiency rating and pacing feedback

### **Educational Content**

#### GET /questions/:questionId/deep-dive ⭐ **CRITICAL ENDPOINT**
Get rich educational content for a specific question

**Parameters:**
- `questionId` (string): UUID of the question

**Response:**
```json
{
  "success": true,
  "data": {
    "question_id": "123e4567-e89b-12d3-a456-426614174000",
    "content": {
      "detailed_explanation": "Rama represents the ideal of dharmic kingship in Hindu tradition. As the seventh avatar of Vishnu, he embodies the perfect balance of power and righteousness...",
      "original_quote": "रामो विग्रहवान्धर्मः",
      "translation": "Rama is righteousness personified", 
      "cultural_context": "In Hindu philosophy, Rama's character demonstrates the complex relationship between personal desire and social duty...",
      "related_topics": ["dharma", "hindu_philosophy", "divine_incarnation"],
      "cross_epic_connections": [
        {
          "epicId": "mahabharata",
          "connection": "Both epics explore dharmic dilemmas",
          "similarThemes": ["duty", "righteousness", "sacrifice"]
        }
      ]
    },
    
    "learning_features": {
      "has_original_quote": true,
      "has_cultural_context": true,
      "cross_epic_connections_count": 1,
      "related_topics_count": 3,
      "estimated_reading_minutes": 3,
      "content_depth": "advanced"
    },
    
    "discovery": {
      "related_themes": ["dharma", "hindu_philosophy", "divine_incarnation"],
      "cross_epic_parallels": [
        {
          "epic": "mahabharata", 
          "connection_type": "Both epics explore dharmic dilemmas",
          "shared_themes": ["duty", "righteousness", "sacrifice"]
        }
      ],
      "explore_next": [
        "Explore similar themes in other epics",
        "Learn about related concepts and themes"
      ]
    }
  }
}
```

**Educational Value:**
- **Rich Context**: 2-3 paragraphs of scholarly explanation
- **Original Sources**: Sanskrit/Greek/Old English quotes with translations  
- **Cultural Understanding**: Historical and cultural background
- **Cross-Epic Discovery**: Thematic connections across literary traditions
- **Guided Learning**: Suggestions for further exploration

## Request Validation

### Epic ID Format
- **Pattern**: `^[a-z_]+$` (lowercase letters and underscores only)
- **Length**: 3-50 characters
- **Examples**: `"ramayana"`, `"mahabharata"`, `"iliad_odyssey"`

### Quiz Parameters
- **count**: Integer, 5-20 questions
- **difficulty**: "easy", "medium", "hard", "mixed"
- **category**: "characters", "events", "themes", "culture", "mixed"

### Question Answer Validation
- **user_answer**: Integer, 0-3 (multiple choice index)
- **time_spent**: Integer, 1-300 seconds per question
- **total_time**: Integer, 10-1800 seconds total

## Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created (quiz submission)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (epic not available)
- **404**: Not Found (epic or question not found)
- **500**: Internal Server Error

### Validation Errors
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "epic",
      "message": "Epic ID must contain only lowercase letters and underscores",
      "value": "RAMAYANA"
    }
  ],
  "timestamp": "2025-08-06T05:59:50.340Z"
}
```

## Performance & Caching

### Cache Headers
- **Quiz Packages**: `Cache-Control: public, max-age=3600` (1 hour)
- **Deep Dive Content**: `Cache-Control: public, max-age=86400` (24 hours)
- **Epic Lists**: `Cache-Control: public, max-age=3600` (1 hour)

### Performance Targets
- **Quiz Generation**: <2 seconds for 10-question package
- **Deep Dive Content**: <1 second response time
- **Epic Listing**: <500ms response time

### Mobile Optimization
- **Compact Responses**: Minimal payload size for mobile bandwidth
- **Efficient JSON**: Structured for direct mobile app consumption
- **Offline Support**: Complete data in single requests where possible

## Database Integration

### Connection Pooling
- **Pool Size**: 20 connections maximum
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 2 seconds

### Query Optimization
- **Balanced Selection**: Uses window functions for fair question distribution
- **Indexed Queries**: All common query patterns are indexed
- **Full-Text Search**: GIN indexes for content search capabilities

## Development & Testing

### Health Check
```bash
GET /health
```

Returns database connection status and server information.

### API Documentation
```bash
GET /api/v1
```

Returns complete API endpoint documentation and architecture information.

### Example Usage

#### Complete Quiz Flow
```bash
# 1. Get available epics
curl http://localhost:3000/api/v1/epics

# 2. Generate quiz package 
curl "http://localhost:3000/api/v1/quiz?epic=ramayana&count=5"

# 3. Submit quiz results
curl -X POST http://localhost:3000/api/v1/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"quizId":"...","epicId":"ramayana","answers":[...],"timeSpent":300}'

# 4. Get deep educational content
curl http://localhost:3000/api/v1/questions/123e4567-e89b-12d3-a456-426614174000/deep-dive
```

## Future Enhancements

### Authentication System
- JWT-based authentication for user accounts
- User progress tracking across sessions
- Bookmark and note-taking features

### Advanced Features
- Cross-epic theme analysis endpoints
- Adaptive question difficulty based on performance
- Social features (sharing achievements, comparing progress)
- Multi-language content support

### Analytics & Monitoring
- Detailed usage analytics endpoints
- Performance monitoring and alerting
- Content effectiveness tracking

This API provides a solid foundation for the Epic Quiz mobile application, supporting both immediate MVP requirements and future expansion to a comprehensive educational platform across multiple literary traditions.