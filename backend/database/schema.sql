-- Epic Quiz App Database Schema
-- PostgreSQL 14+ with UUID and JSONB support

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search performance

-- ==============================================
-- EPIC MANAGEMENT TABLES
-- ==============================================

-- Epics: Master table for literary works (Ramayana, Mahabharata, etc.)
-- ARCHITECTURAL DECISION: Using VARCHAR(50) for epic_id instead of UUID
-- WHY: Human-readable identifiers like "ramayana", "mahabharata" make API endpoints cleaner
-- and easier to work with. UUIDs would be opaque and less meaningful in URLs.
CREATE TABLE epics (
    id VARCHAR(50) PRIMARY KEY CHECK (id ~ '^[a-z_]+$'), -- Enforce lowercase with underscores
    title VARCHAR(200) NOT NULL,
    description TEXT,
    language VARCHAR(50), -- sanskrit, greek, old_english, etc.
    culture VARCHAR(50),  -- hindu, greek, anglo_saxon, etc.
    time_period VARCHAR(100), -- "Ancient India (7th century BCE - 4th century CE)"
    question_count INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT false,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_reading_time VARCHAR(50), -- "2-3 hours"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- QUESTION AND CONTENT TABLES
-- ==============================================

-- Questions: Core quiz questions with basic explanations
-- ARCHITECTURAL DECISION: Storing options as JSONB array instead of separate table
-- WHY: Multiple choice questions always have exactly 4 options, and they're always
-- retrieved together. JSONB provides atomic operations and better performance than JOINs.
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Question categorization
    category VARCHAR(50) NOT NULL CHECK (category IN ('characters', 'events', 'themes', 'culture')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    
    -- Question content
    question_text TEXT NOT NULL,
    options JSONB NOT NULL CHECK (jsonb_array_length(options) = 4), -- Exactly 4 options
    correct_answer_id INTEGER NOT NULL CHECK (correct_answer_id BETWEEN 0 AND 3),
    
    -- Basic explanation (cached with question for offline use)
    basic_explanation TEXT NOT NULL,
    
    -- Original language content (Sanskrit quotes, Greek text, etc.)
    original_quote TEXT,
    original_language VARCHAR(50),
    quote_translation TEXT,
    
    -- Tagging and cross-referencing
    tags TEXT[] DEFAULT '{}', -- Specific to this epic
    cross_epic_tags TEXT[] DEFAULT '{}', -- Universal themes like "heroism", "sacrifice"
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure options is valid JSON array
    CONSTRAINT valid_options CHECK (jsonb_typeof(options) = 'array')
);

-- Educational Content: Rich content loaded on-demand for deep dives
-- ARCHITECTURAL DECISION: Separate table from questions for performance
-- WHY: This content is large and only loaded when user requests "Learn More".
-- Keeping it separate prevents bloating the main questions table and enables
-- efficient bulk quiz package downloads without heavy content.
CREATE TABLE educational_content (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    
    -- Rich educational content
    detailed_explanation TEXT NOT NULL,
    cultural_context TEXT,
    historical_background TEXT,
    scholarly_notes TEXT,
    
    -- Cross-epic connections stored as structured JSON
    -- ARCHITECTURAL DECISION: Using JSONB for cross-epic connections
    -- WHY: These connections are complex, nested data that would require multiple
    -- tables to normalize. JSONB allows flexible structure while maintaining queryability.
    cross_epic_connections JSONB DEFAULT '[]'::jsonb,
    
    -- Related topics and themes
    related_topics TEXT[] DEFAULT '{}',
    recommended_reading TEXT[],
    
    -- Content metadata
    content_version INTEGER DEFAULT 1, -- For content updates tracking
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Validate cross_epic_connections structure
    CONSTRAINT valid_connections CHECK (jsonb_typeof(cross_epic_connections) = 'array')
);

-- ==============================================
-- USER MANAGEMENT AND PROGRESS TRACKING
-- ==============================================

-- Users: Basic user information
-- ARCHITECTURAL DECISION: Simple user model focusing on progress tracking
-- WHY: This is an educational app, not a social platform. We need minimal
-- user data to track learning progress while respecting privacy.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Optional user identification (anonymous users supported)
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    
    -- User preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_settings JSONB DEFAULT '{"quiz_reminders": true, "achievement_alerts": true}'::jsonb,
    
    -- Account status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Progress: Epic-specific learning progress
-- ARCHITECTURAL DECISION: Separate table per epic-user combination
-- WHY: Allows for detailed tracking of progress across different epics
-- and enables easy expansion when new epics are added.
CREATE TABLE user_progress (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Overall progress metrics
    quizzes_completed INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    
    -- Category-specific scores stored as JSONB
    -- ARCHITECTURAL DECISION: JSONB for category scores instead of normalized table
    -- WHY: Categories are fixed (characters, events, themes, culture) and always
    -- accessed together. JSONB provides better performance and simpler queries.
    category_scores JSONB DEFAULT '{
        "characters": {"correct": 0, "total": 0},
        "events": {"correct": 0, "total": 0},
        "themes": {"correct": 0, "total": 0},
        "culture": {"correct": 0, "total": 0}
    }'::jsonb,
    
    -- Completion tracking
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    mastery_level VARCHAR(20) DEFAULT 'beginner' CHECK (mastery_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Timestamps
    last_quiz_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, epic_id)
);

-- Quiz Sessions: Individual quiz attempts for analytics
-- ARCHITECTURAL DECISION: Storing detailed session data for learning analytics
-- WHY: Understanding user behavior patterns helps improve educational effectiveness
-- and enables features like adaptive learning and personalized recommendations.
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Allow anonymous sessions
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    
    -- Session details
    questions_answered JSONB NOT NULL, -- Array of {question_id, user_answer, is_correct, time_spent}
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- Total time in seconds
    
    -- Session metadata
    device_type VARCHAR(50), -- mobile, tablet, web
    app_version VARCHAR(20),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Validate questions_answered structure
    CONSTRAINT valid_session_data CHECK (jsonb_typeof(questions_answered) = 'array')
);

-- User Bookmarks: Saved explanations for later review
-- ARCHITECTURAL DECISION: Simple many-to-many relationship table
-- WHY: Bookmarks are simple references. No need for complex structure,
-- and this pattern is easily understood and maintainable.
CREATE TABLE user_bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT, -- User's personal notes about the bookmark
    
    PRIMARY KEY (user_id, question_id)
);

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Epic questions lookup (most common query pattern)
CREATE INDEX idx_questions_epic_category ON questions(epic_id, category);
CREATE INDEX idx_questions_epic_difficulty ON questions(epic_id, difficulty);

-- Cross-epic theme analysis indexes
CREATE INDEX idx_questions_cross_epic_tags ON questions USING GIN (cross_epic_tags);
CREATE INDEX idx_questions_tags ON questions USING GIN (tags);

-- User progress queries
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_updated_at ON user_progress(updated_at);

-- Quiz session analytics
CREATE INDEX idx_quiz_sessions_epic_user ON quiz_sessions(epic_id, user_id);
CREATE INDEX idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);

-- Full-text search on question content
CREATE INDEX idx_questions_fts ON questions USING GIN (to_tsvector('english', question_text));
CREATE INDEX idx_educational_content_fts ON educational_content USING GIN (
    to_tsvector('english', detailed_explanation || ' ' || cultural_context)
);

-- ==============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_epics_updated_at BEFORE UPDATE ON epics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON educational_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update epic question count when questions are added/removed
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

-- Trigger to automatically maintain question counts
CREATE TRIGGER update_question_count_trigger
    AFTER INSERT OR DELETE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_epic_question_count();

-- ==============================================
-- VIEWS FOR COMMON QUERIES
-- ==============================================

-- Complete question data with educational content (for admin/content management)
CREATE VIEW complete_questions AS
SELECT 
    q.*,
    ec.detailed_explanation,
    ec.cultural_context,
    ec.cross_epic_connections,
    ec.related_topics,
    e.title as epic_title,
    e.language as epic_language
FROM questions q
LEFT JOIN educational_content ec ON q.id = ec.question_id
JOIN epics e ON q.epic_id = e.id;

-- User progress summary across all epics
CREATE VIEW user_progress_summary AS
SELECT 
    up.user_id,
    u.username,
    COUNT(up.epic_id) as epics_started,
    SUM(up.quizzes_completed) as total_quizzes,
    SUM(up.total_questions_answered) as total_questions,
    ROUND(AVG(up.completion_percentage), 2) as avg_completion,
    MAX(up.last_quiz_at) as last_activity
FROM user_progress up
JOIN users u ON up.user_id = u.id
WHERE up.quizzes_completed > 0
GROUP BY up.user_id, u.username;