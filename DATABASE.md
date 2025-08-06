# Epic Quiz App - Database Documentation

## Overview

This document provides comprehensive documentation of the PostgreSQL database design for the Epic Quiz App, including architectural decisions, schema details, and operational procedures.

## Architectural Decisions

### 1. PostgreSQL + JSONB Hybrid Design

**Decision**: Use PostgreSQL with strategic JSONB fields instead of pure NoSQL or pure relational approach.

**Rationale**:
- **ACID Compliance**: Educational progress data requires consistency and reliability
- **JSONB Performance**: Fully indexable and queryable JSON storage for flexible data
- **Query Power**: Complex relational queries with JSON flexibility where needed
- **API Efficiency**: Direct JSON responses without object-relational mapping overhead
- **Future Flexibility**: Easy schema evolution without migration complexity

### 2. Two-Tier Content Strategy

**Decision**: Separate lightweight quiz data from heavy educational content.

**Schema Impact**:
```sql
questions                # Lightweight: question text, options, basic explanation
    ↓
educational_content     # Heavy: detailed explanations, cultural context, cross-epic connections
```

**Benefits**:
- **Mobile Performance**: Bulk quiz downloads stay small and fast
- **Hybrid Delivery**: Supports offline-first mobile app architecture
- **Network Efficiency**: Basic content cached, rich content streamed on-demand
- **Different Caching**: Separate cache strategies for different content types

### 3. Human-Readable Epic Identifiers

**Decision**: Use meaningful VARCHAR(50) IDs like "ramayana" instead of UUIDs.

**Schema**:
```sql
CREATE TABLE epics (
    id VARCHAR(50) PRIMARY KEY CHECK (id ~ '^[a-z_]+$'), -- enforced pattern
    ...
);
```

**Benefits**:
- **Clean APIs**: `/api/v1/epics/ramayana/quiz` vs `/api/v1/epics/uuid/quiz`
- **Debugging**: Easier to trace issues in logs and queries
- **URL Friendly**: Human-readable URLs for potential web interface
- **Data Integrity**: Constraint ensures consistent naming pattern

### 4. Custom Migration System

**Decision**: File-based SQL migrations without ORM framework.

**Implementation**:
```
backend/database/migrations/
├── 001_initial_schema.sql
├── 002_add_indexes.sql
└── ...
```

**Advantages**:
- **PostgreSQL Features**: Full access to JSONB, arrays, triggers, views
- **Performance**: Direct SQL without ORM abstraction overhead
- **Precision**: Exact control over queries and optimizations
- **Simplicity**: Educational app doesn't need complex ORM features

## Database Schema

### Core Tables

#### epics
```sql
CREATE TABLE epics (
    id VARCHAR(50) PRIMARY KEY,           -- human-readable: "ramayana", "mahabharata"
    title VARCHAR(200) NOT NULL,          -- display name: "The Ramayana"
    description TEXT,                     -- epic overview
    language VARCHAR(50),                 -- "sanskrit", "greek", "old_english"
    culture VARCHAR(50),                  -- "hindu", "greek", "anglo_saxon"
    time_period VARCHAR(100),             -- "Ancient India (7th century BCE - 4th century CE)"
    question_count INTEGER DEFAULT 0,     -- automatically maintained by triggers
    is_available BOOLEAN DEFAULT false,   -- content readiness flag
    difficulty_level VARCHAR(20),         -- "beginner", "intermediate", "advanced"
    estimated_reading_time VARCHAR(50),   -- "2-3 hours"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### questions
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Categorization
    category VARCHAR(50) NOT NULL CHECK (category IN ('characters', 'events', 'themes', 'culture')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    
    -- Question content (lightweight for mobile caching)
    question_text TEXT NOT NULL,
    options JSONB NOT NULL CHECK (jsonb_array_length(options) = 4), -- exactly 4 options
    correct_answer_id INTEGER NOT NULL CHECK (correct_answer_id BETWEEN 0 AND 3),
    basic_explanation TEXT NOT NULL,      -- cached with question for offline use
    
    -- Original language content
    original_quote TEXT,                  -- Sanskrit/Greek/Old English text
    original_language VARCHAR(50),
    quote_translation TEXT,
    
    -- Tagging for connections
    tags TEXT[] DEFAULT '{}',             -- epic-specific tags
    cross_epic_tags TEXT[] DEFAULT '{}',  -- universal themes: "heroism", "sacrifice"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### educational_content
```sql
CREATE TABLE educational_content (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    
    -- Rich educational content (loaded on-demand)
    detailed_explanation TEXT NOT NULL,      -- 2-3 paragraphs of scholarly content
    cultural_context TEXT,                   -- historical and cultural background
    historical_background TEXT,
    scholarly_notes TEXT,
    
    -- Cross-epic connections as structured JSON
    cross_epic_connections JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"epicId": "mahabharata", "connection": "Both explore dharmic dilemmas", "similarThemes": ["duty", "righteousness"]}]
    
    related_topics TEXT[] DEFAULT '{}',      -- related concepts and themes
    recommended_reading TEXT[],              -- scholarly sources
    
    -- Content versioning
    content_version INTEGER DEFAULT 1,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE,             -- optional for anonymous users
    email VARCHAR(255) UNIQUE,               -- optional for anonymous users
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_settings JSONB DEFAULT '{"quiz_reminders": true, "achievement_alerts": true}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### user_progress
```sql
CREATE TABLE user_progress (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Progress metrics
    quizzes_completed INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    
    -- Category-specific performance stored as JSONB
    category_scores JSONB DEFAULT '{
        "characters": {"correct": 0, "total": 0},
        "events": {"correct": 0, "total": 0},
        "themes": {"correct": 0, "total": 0},
        "culture": {"correct": 0, "total": 0}
    }'::jsonb,
    
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    mastery_level VARCHAR(20) DEFAULT 'beginner',
    last_quiz_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, epic_id)
);
```

#### quiz_sessions
```sql
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- anonymous sessions allowed
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Session data stored as structured JSON
    questions_answered JSONB NOT NULL,        -- [{"question_id": "uuid", "user_answer": 2, "is_correct": true, "time_spent": 15}]
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_spent INTEGER NOT NULL,              -- total seconds
    
    -- Analytics metadata
    device_type VARCHAR(50),                  -- "mobile", "tablet", "web"
    app_version VARCHAR(20),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### user_bookmarks
```sql
CREATE TABLE user_bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,                               -- user's personal notes
    PRIMARY KEY (user_id, question_id)
);
```

## Performance Optimizations

### Indexes

#### Primary Performance Indexes
```sql
-- Epic questions lookup (most common query)
CREATE INDEX idx_questions_epic_category ON questions(epic_id, category);
CREATE INDEX idx_questions_epic_difficulty ON questions(epic_id, difficulty);

-- Cross-epic theme analysis
CREATE INDEX idx_questions_cross_epic_tags ON questions USING GIN (cross_epic_tags);
CREATE INDEX idx_questions_tags ON questions USING GIN (tags);

-- User progress queries
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_updated_at ON user_progress(updated_at);

-- Analytics and session tracking
CREATE INDEX idx_quiz_sessions_epic_user ON quiz_sessions(epic_id, user_id);
CREATE INDEX idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);
```

#### Full-Text Search Indexes
```sql
-- Question content search
CREATE INDEX idx_questions_fts ON questions USING GIN (to_tsvector('english', question_text));

-- Educational content search
CREATE INDEX idx_educational_content_fts ON educational_content USING GIN (
    to_tsvector('english', detailed_explanation || ' ' || cultural_context)
);
```

### Database Triggers

#### Automatic Timestamp Updates
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applied to relevant tables
CREATE TRIGGER update_epics_updated_at BEFORE UPDATE ON epics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Question Count Maintenance
```sql
CREATE OR REPLACE FUNCTION update_epic_question_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE epics SET question_count = question_count + 1 WHERE id = NEW.epic_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE epics SET question_count = question_count - 1 WHERE id = OLD.epic_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_question_count_trigger
    AFTER INSERT OR DELETE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_epic_question_count();
```

## Business Logic Implementation

### Service Architecture

#### EpicService (`src/services/EpicService.ts`)
- **Epic Management**: CRUD operations for literary works
- **Availability Control**: Business rules for epic publication
- **Statistics**: Question counts, completion rates, trending analysis
- **Search**: Full-text search across epic content

#### QuizService (`src/services/QuizService.ts`)
- **Quiz Generation**: Implements bulk download strategy with balanced question selection
- **Deep Dive Content**: Lazy loading of educational content
- **Progress Tracking**: Score calculation and category-specific progress updates
- **Session Management**: Anonymous and registered user session handling

### Key Business Rules

#### Epic Availability
```typescript
// Epic becomes available only when it has sufficient content
async updateEpicAvailability(epicId: string, isAvailable: boolean) {
    if (isAvailable) {
        const questionCount = await this.getQuestionCount(epicId);
        if (questionCount < 10) {
            throw new Error('Epic must have at least 10 questions to be made available');
        }
    }
    // ... update logic
}
```

#### Balanced Question Selection
```sql
-- Questions distributed across categories and difficulties
WITH balanced_questions AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY category, difficulty ORDER BY RANDOM()) as rn
    FROM questions 
    WHERE epic_id = $1
)
SELECT * FROM balanced_questions 
WHERE rn <= CEIL($2::float / (4 * 3)) -- 4 categories × 3 difficulties
ORDER BY RANDOM()
LIMIT $2
```

## Migration System

### Migration Files
- **Location**: `backend/database/migrations/`
- **Naming**: `001_description.sql`, `002_description.sql`, etc.
- **Execution**: Automatic on server startup via `database.runMigrations()`

### Migration Tracking
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Migration Structure
```sql
-- Migration 001: Initial Epic Quiz Database Schema
-- Created: 2025-08-06
-- Description: Creates the complete database schema for Epic Quiz App

\i '../schema.sql'  -- Include main schema

-- Insert initial data
INSERT INTO epics (id, title, description, ...) VALUES (...);

-- Verification
SELECT 'Migration 001 completed successfully' as status;
```

## Operational Procedures

### Database Setup

1. **Prerequisites**: PostgreSQL 14+ installed and running
2. **Database Creation**: `CREATE DATABASE epic_quiz_db;`
3. **Environment Configuration**: Copy `.env.example` to `.env` and configure
4. **Automatic Setup**: Migrations run automatically on server startup

### Development Workflow

1. **Schema Changes**: Create new migration file in `migrations/`
2. **Testing**: Restart server to apply migrations
3. **Data Population**: Use seed files in `seeds/` directory
4. **Verification**: Check `/health` endpoint for database status

### Backup and Restore

```bash
# Backup
pg_dump -h localhost -U postgres epic_quiz_db > backup.sql

# Restore
psql -h localhost -U postgres -c "CREATE DATABASE epic_quiz_db_restore;"
psql -h localhost -U postgres epic_quiz_db_restore < backup.sql
```

## Sample Data

### Ramayana Content
- **Location**: `backend/database/seeds/001_ramayana_questions.sql`
- **Content**: 8 sample questions across all categories and difficulties
- **Features**: Demonstrates original Sanskrit quotes, cross-epic tagging, educational content

### Content Structure Example
```sql
-- Question with rich educational content
INSERT INTO questions (...) VALUES (
    'ramayana', 'characters', 'easy',
    'Who is the main protagonist of the Ramayana?',
    '["Rama", "Krishna", "Arjuna", "Hanuman"]'::jsonb,
    0,
    'Rama is the seventh avatar of Vishnu and the central hero of the Ramayana epic.',
    'रामो विग्रहवान्धर्मः',  -- Original Sanskrit
    'Rama is righteousness personified',
    ARRAY['rama', 'protagonist', 'avatar'],
    ARRAY['heroism', 'divine_incarnation', 'righteousness']
);
```

This database design provides a robust foundation for the Epic Quiz App, supporting both the immediate MVP requirements and future expansion to multiple literary traditions while maintaining high performance and educational value.