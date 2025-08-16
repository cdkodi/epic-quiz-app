-- Clean Supabase & Implement Complete Tracking System
-- This script cleans existing quiz data and adds comprehensive import tracking

-- ==============================================
-- PHASE 1: DATABASE CLEANUP
-- ==============================================

-- Clean slate - Remove all existing quiz data (but preserve user data)
-- Order matters due to foreign key constraints

DELETE FROM user_bookmarks WHERE question_id IN (SELECT id FROM questions WHERE epic_id = 'ramayana');
DELETE FROM educational_content WHERE question_id IN (SELECT id FROM questions WHERE epic_id = 'ramayana');
DELETE FROM questions WHERE epic_id = 'ramayana';
DELETE FROM chapter_summaries WHERE epic_id = 'ramayana';

-- Reset question count in epics table
UPDATE epics SET question_count = 0 WHERE id = 'ramayana';

-- ==============================================
-- PHASE 2: IMPORT TRACKING TABLES
-- ==============================================

-- Track question imports from Google Sheets
CREATE TABLE IF NOT EXISTS question_import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sheet_question_id TEXT NOT NULL UNIQUE, -- Question ID from Google Sheets
    supabase_question_id UUID NOT NULL, -- Will reference questions(id) after insert
    sarga_info TEXT NOT NULL, -- e.g., "bala_kanda_sarga_2"
    import_batch_id UUID NOT NULL,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'imported',
    
    -- Add constraint after questions table is populated
    CONSTRAINT valid_status CHECK (status IN ('imported', 'failed', 'rollback'))
);

-- Track summary imports from Google Sheets  
CREATE TABLE IF NOT EXISTS summary_import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sheet_summary_id TEXT NOT NULL UNIQUE, -- Chapter ID from Google Sheets
    supabase_summary_id UUID NOT NULL, -- Will reference chapter_summaries(id) after insert
    sarga_info TEXT NOT NULL, -- e.g., "bala_kanda_sarga_2"
    import_batch_id UUID NOT NULL,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'imported',
    
    CONSTRAINT valid_summary_status CHECK (status IN ('imported', 'failed', 'rollback'))
);

-- ==============================================
-- PHASE 3: ENHANCE EXISTING TABLES
-- ==============================================

-- Add source tracking columns to questions table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'sheet_question_id') THEN
        ALTER TABLE questions ADD COLUMN sheet_question_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'import_batch_id') THEN
        ALTER TABLE questions ADD COLUMN import_batch_id UUID;
    END IF;
END $$;

-- Add source tracking columns to chapter_summaries table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter_summaries' AND column_name = 'sheet_summary_id') THEN
        ALTER TABLE chapter_summaries ADD COLUMN sheet_summary_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapter_summaries' AND column_name = 'import_batch_id') THEN
        ALTER TABLE chapter_summaries ADD COLUMN import_batch_id UUID;
    END IF;
END $$;

-- ==============================================
-- PHASE 4: DUPLICATE PREVENTION CONSTRAINTS
-- ==============================================

-- Prevent duplicate questions from same sheet source
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_question_source') THEN
        ALTER TABLE questions ADD CONSTRAINT unique_question_source 
        UNIQUE (epic_id, sheet_question_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- Prevent duplicate summaries from same sheet source
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_summary_source') THEN
        ALTER TABLE chapter_summaries ADD CONSTRAINT unique_summary_source 
        UNIQUE (epic_id, sheet_summary_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- Add unique constraint on sheet_question_id to prevent duplicates
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_sheet_question_id') THEN
        ALTER TABLE questions ADD CONSTRAINT unique_sheet_question_id 
        UNIQUE (sheet_question_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- Add unique constraint on sheet_summary_id to prevent duplicates  
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_sheet_summary_id') THEN
        ALTER TABLE chapter_summaries ADD CONSTRAINT unique_sheet_summary_id 
        UNIQUE (sheet_summary_id) 
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- ==============================================
-- PHASE 5: INDEXES FOR PERFORMANCE
-- ==============================================

-- Index for import tracking lookups
CREATE INDEX IF NOT EXISTS idx_question_import_logs_sheet_id ON question_import_logs(sheet_question_id);
CREATE INDEX IF NOT EXISTS idx_question_import_logs_batch_id ON question_import_logs(import_batch_id);
CREATE INDEX IF NOT EXISTS idx_summary_import_logs_sheet_id ON summary_import_logs(sheet_summary_id);
CREATE INDEX IF NOT EXISTS idx_summary_import_logs_batch_id ON summary_import_logs(import_batch_id);

-- Index for questions source tracking
CREATE INDEX IF NOT EXISTS idx_questions_sheet_id ON questions(sheet_question_id) WHERE sheet_question_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_import_batch ON questions(import_batch_id) WHERE import_batch_id IS NOT NULL;

-- Index for summaries source tracking
CREATE INDEX IF NOT EXISTS idx_summaries_sheet_id ON chapter_summaries(sheet_summary_id) WHERE sheet_summary_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_summaries_import_batch ON chapter_summaries(import_batch_id) WHERE import_batch_id IS NOT NULL;

-- ==============================================
-- PHASE 6: ADD FOREIGN KEY CONSTRAINTS
-- ==============================================

-- Add foreign key constraints to import logs tables
-- (These will be validated after the import process)
DO $$ 
BEGIN 
    -- We'll add the FK constraints after import to avoid issues during bulk insert
    -- ALTER TABLE question_import_logs ADD CONSTRAINT fk_question_import_logs_question 
    -- FOREIGN KEY (supabase_question_id) REFERENCES questions(id) ON DELETE CASCADE;
    
    -- ALTER TABLE summary_import_logs ADD CONSTRAINT fk_summary_import_logs_summary 
    -- FOREIGN KEY (supabase_summary_id) REFERENCES chapter_summaries(id) ON DELETE CASCADE;
    
    -- For now, we'll just comment these and add them after successful import
    NULL;
END $$;

-- ==============================================
-- PHASE 7: UTILITY VIEWS FOR MONITORING
-- ==============================================

-- View to monitor import status
CREATE OR REPLACE VIEW import_status AS
SELECT 
    'questions' as content_type,
    qil.sarga_info,
    COUNT(*) as imported_count,
    qil.import_batch_id,
    MIN(qil.import_date) as import_time,
    qil.status
FROM question_import_logs qil
GROUP BY qil.sarga_info, qil.import_batch_id, qil.status

UNION ALL

SELECT 
    'summaries' as content_type,
    sil.sarga_info,
    COUNT(*) as imported_count,
    sil.import_batch_id,
    MIN(sil.import_date) as import_time,
    sil.status
FROM summary_import_logs sil
GROUP BY sil.sarga_info, sil.import_batch_id, sil.status

ORDER BY content_type, sarga_info;

-- View to check for potential duplicates
CREATE OR REPLACE VIEW duplicate_check AS
SELECT 
    'questions' as table_type,
    q.question_text,
    q.epic_id,
    COUNT(*) as duplicate_count,
    ARRAY_AGG(q.id) as question_ids
FROM questions q
GROUP BY q.question_text, q.epic_id
HAVING COUNT(*) > 1

UNION ALL

SELECT 
    'summaries' as table_type,
    cs.title,
    cs.epic_id,
    COUNT(*) as duplicate_count,
    ARRAY_AGG(cs.id) as summary_ids
FROM chapter_summaries cs
GROUP BY cs.title, cs.epic_id
HAVING COUNT(*) > 1;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check that cleanup was successful
SELECT 'questions' as table_name, COUNT(*) as remaining_count FROM questions WHERE epic_id = 'ramayana'
UNION ALL
SELECT 'chapter_summaries', COUNT(*) FROM chapter_summaries WHERE epic_id = 'ramayana'
UNION ALL  
SELECT 'educational_content', COUNT(*) FROM educational_content WHERE question_id IN (SELECT id FROM questions WHERE epic_id = 'ramayana');

-- Verify new tracking tables exist
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN ('question_import_logs', 'summary_import_logs')
ORDER BY table_name, ordinal_position;

-- Verify new columns were added
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN ('questions', 'chapter_summaries') 
AND column_name IN ('sheet_question_id', 'sheet_summary_id', 'import_batch_id')
ORDER BY table_name, column_name;

COMMIT;