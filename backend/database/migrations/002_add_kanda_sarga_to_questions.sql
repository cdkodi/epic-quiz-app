-- Migration: Add Kanda-Sarga tracking to questions table
-- Created: 2025-08-11
-- Description: Add kanda and sarga columns to questions table for granular content organization

-- Add kanda and sarga columns to questions table
ALTER TABLE questions 
ADD COLUMN kanda VARCHAR(50),
ADD COLUMN sarga INTEGER;

-- Create index for efficient kanda-sarga queries
CREATE INDEX idx_questions_kanda_sarga ON questions (epic_id, kanda, sarga);

-- Update existing questions to set kanda and sarga
-- All existing questions will be attributed to Bala Kanda, Sarga 1
UPDATE questions 
SET kanda = 'bala_kanda', sarga = 1 
WHERE epic_id = 'ramayana';

-- Add constraint to ensure kanda and sarga are provided for new questions
ALTER TABLE questions 
ADD CONSTRAINT questions_kanda_sarga_required 
CHECK (kanda IS NOT NULL AND sarga IS NOT NULL);

-- Create view for Kanda-Sarga progress tracking
CREATE OR REPLACE VIEW sarga_progress AS
SELECT 
    epic_id,
    kanda,
    sarga,
    COUNT(*) as total_questions,
    COUNT(*) FILTER (WHERE category = 'characters') as character_questions,
    COUNT(*) FILTER (WHERE category = 'events') as event_questions,
    COUNT(*) FILTER (WHERE category = 'themes') as theme_questions,
    COUNT(*) FILTER (WHERE category = 'culture') as culture_questions,
    COUNT(*) FILTER (WHERE difficulty = 'easy') as easy_questions,
    COUNT(*) FILTER (WHERE difficulty = 'medium') as medium_questions,
    COUNT(*) FILTER (WHERE difficulty = 'hard') as hard_questions
FROM questions 
GROUP BY epic_id, kanda, sarga
ORDER BY epic_id, kanda, sarga;