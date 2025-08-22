-- Migration 002: Add Progressive Sarga-Block Quiz System
-- Purpose: Replace random sarga selection with educationally structured blocks
-- Addresses: Educational narrative coherence and progressive difficulty

BEGIN;

-- Create quiz_blocks table for organizing sargas into educational sequences
CREATE TABLE quiz_blocks (
    id SERIAL PRIMARY KEY,
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id),
    block_name VARCHAR(100) NOT NULL, -- e.g., "Origins & Beginnings"
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    phase VARCHAR(50) NOT NULL, -- e.g., "foundational", "development", "mastery"
    
    -- Sarga range for this block
    start_sarga INTEGER NOT NULL,
    end_sarga INTEGER NOT NULL,
    kanda VARCHAR(50) NOT NULL, -- e.g., "bala_kanda"
    
    -- Educational metadata
    learning_objectives TEXT[],
    narrative_summary TEXT,
    key_themes TEXT[],
    cultural_elements TEXT[],
    
    -- Ordering and availability
    sequence_order INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    prerequisite_blocks INTEGER[], -- Array of block IDs that should be completed first
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_quiz_blocks_epic_difficulty ON quiz_blocks(epic_id, difficulty_level);
CREATE INDEX idx_quiz_blocks_sequence ON quiz_blocks(epic_id, sequence_order);
CREATE INDEX idx_quiz_blocks_sarga_range ON quiz_blocks(epic_id, kanda, start_sarga, end_sarga);

-- Add sarga_block_id to questions table
ALTER TABLE questions ADD COLUMN sarga_block_id INTEGER REFERENCES quiz_blocks(id);

-- Create index for block-based question queries
CREATE INDEX idx_questions_sarga_block ON questions(sarga_block_id);
CREATE INDEX idx_questions_epic_block_category ON questions(epic_id, sarga_block_id, category);

-- Insert Bala Kanda progressive blocks for Ramayana

-- EASY/FOUNDATIONAL BLOCKS
INSERT INTO quiz_blocks (
    epic_id, block_name, difficulty_level, phase, 
    start_sarga, end_sarga, kanda, sequence_order,
    learning_objectives, narrative_summary, key_themes, cultural_elements
) VALUES 
-- Easy Block 1: Origins & Divine Birth (Sargas 1-5)
('ramayana', 'Origins & Divine Birth', 'easy', 'foundational', 
 1, 5, 'bala_kanda', 1,
 ARRAY['Understanding the cosmic context', 'Meeting main characters', 'Grasping divine intervention concept'],
 'The epic begins with Narada''s visit to Valmiki, the conception of Ramayana, and the divine origins of Rama and his brothers.',
 ARRAY['divine birth', 'cosmic order', 'sage wisdom', 'brotherly bonds'],
 ARRAY['ashrama system', 'yajna rituals', 'guru-disciple tradition', 'Sanskrit poetry origins']
),

-- Easy Block 2: Royal Education & Early Adventures (Sargas 6-10) 
('ramayana', 'Royal Education & Early Adventures', 'easy', 'foundational',
 6, 10, 'bala_kanda', 2,
 ARRAY['Prince education system', 'Early heroic deeds', 'Teacher-student relationships'],
 'The princes receive their education and training. Early adventures and the development of their heroic qualities.',
 ARRAY['education', 'heroism', 'training', 'royal duties'],
 ARRAY['gurukula education', 'kshatriya dharma', 'archery skills', 'royal protocols']
),

-- Easy Block 3: Sage Vishvamitra Arrives (Sargas 11-15)
('ramayana', 'Sage Vishvamitra Arrives', 'easy', 'foundational',
 11, 15, 'bala_kanda', 3,
 ARRAY['Sage power and authority', 'Royal obligations to sages', 'Beginning of the quest'],
 'The great sage Vishvamitra arrives at Ayodhya and requests Rama''s help to protect his sacrifices from demons.',
 ARRAY['sage authority', 'royal duty', 'protection of dharma', 'first quest'],
 ARRAY['yajna protection', 'sage-king relationship', 'dharmic obligations', 'demon interference']
);

-- MEDIUM/DEVELOPMENT BLOCKS  
INSERT INTO quiz_blocks (
    epic_id, block_name, difficulty_level, phase,
    start_sarga, end_sarga, kanda, sequence_order,
    learning_objectives, narrative_summary, key_themes, cultural_elements
) VALUES
-- Medium Block 1: Forest Adventures & Demon Battles (Sargas 16-25)
('ramayana', 'Forest Adventures & Demon Battles', 'medium', 'development',
 16, 25, 'bala_kanda', 4,
 ARRAY['Understanding dharma in action', 'Complexity of good vs evil', 'Strategic thinking'],
 'Rama and Lakshmana journey with Vishvamitra, face their first demon encounters, and learn about cosmic battles.',
 ARRAY['good vs evil', 'courage in adversity', 'strategic warfare', 'divine weapons'],
 ARRAY['forest hermitages', 'demon mythology', 'weapon consecration', 'protective mantras']
),

-- Medium Block 2: Legendary Weapons & Divine Powers (Sargas 26-35)
('ramayana', 'Legendary Weapons & Divine Powers', 'medium', 'development', 
 26, 35, 'bala_kanda', 5,
 ARRAY['Divine weapon systems', 'Power and responsibility', 'Supernatural elements'],
 'Vishvamitra grants Rama and Lakshmana divine weapons and teaches them their proper use and cosmic significance.',
 ARRAY['divine weapons', 'supernatural powers', 'responsibility', 'cosmic warfare'],
 ARRAY['weapon mantras', 'celestial armory', 'divine inheritance', 'power ethics']
),

-- Medium Block 3: Journey to Mithila & Meeting Sita (Sargas 36-50)
('ramayana', 'Journey to Mithila & Meeting Sita', 'medium', 'development',
 36, 50, 'bala_kanda', 6,
 ARRAY['Love and destiny', 'Royal ceremonies', 'Inter-kingdom relations'],
 'The journey to Mithila, first meeting with Sita, and the buildup to the bow-breaking ceremony that will determine her marriage.',
 ARRAY['destined love', 'royal ceremonies', 'divine trials', 'kingdom alliances'],
 ARRAY['swayamvara tradition', 'marriage customs', 'royal hospitality', 'divine signs']
);

-- HARD/MASTERY BLOCKS
INSERT INTO quiz_blocks (
    epic_id, block_name, difficulty_level, phase,
    start_sarga, end_sarga, kanda, sequence_order, 
    learning_objectives, narrative_summary, key_themes, cultural_elements
) VALUES
-- Hard Block 1: The Impossible Bow & Divine Marriage (Sargas 51-65)
('ramayana', 'The Impossible Bow & Divine Marriage', 'hard', 'mastery',
 51, 65, 'bala_kanda', 7,
 ARRAY['Symbolic meaning of divine trials', 'Marriage as cosmic union', 'Manifestation of destiny'],
 'Rama breaks Shiva''s bow, wins Sita''s hand, and their marriage represents the union of divine principles.',
 ARRAY['divine trials', 'cosmic marriage', 'destiny fulfillment', 'symbolic actions'],
 ARRAY['Shiva worship', 'marriage symbolism', 'cosmic principles', 'divine weapons heritage']
),

-- Hard Block 2: Parashurama''s Challenge & Spiritual Tests (Sargas 66-77)
('ramayana', 'Parashurama''s Challenge & Spiritual Tests', 'hard', 'mastery',
 66, 77, 'bala_kanda', 8,
 ARRAY['Complex moral challenges', 'Avatar interactions', 'Spiritual hierarchy'],
 'The encounter with Parashurama tests Rama''s spiritual authority and establishes his cosmic role among avatars.',
 ARRAY['avatar relationships', 'spiritual authority', 'cosmic hierarchy', 'moral complexity'],
 ARRAY['avatar philosophy', 'spiritual weapons', 'cosmic order', 'divine succession']
);

-- Update existing questions with block assignments based on their sarga numbers
UPDATE questions 
SET sarga_block_id = (
    SELECT qb.id 
    FROM quiz_blocks qb 
    WHERE qb.epic_id = questions.epic_id 
    AND qb.kanda = questions.kanda
    AND questions.sarga BETWEEN qb.start_sarga AND qb.end_sarga
    LIMIT 1
)
WHERE epic_id = 'ramayana' AND kanda = 'bala_kanda';

-- Add constraint to ensure questions are properly assigned to blocks
ALTER TABLE questions ADD CONSTRAINT questions_valid_block_assignment
CHECK (
    sarga_block_id IS NULL OR 
    EXISTS (
        SELECT 1 FROM quiz_blocks qb 
        WHERE qb.id = questions.sarga_block_id 
        AND qb.epic_id = questions.epic_id
        AND qb.kanda = questions.kanda
        AND questions.sarga BETWEEN qb.start_sarga AND qb.end_sarga
    )
);

-- Create view for easy block-based quiz generation
CREATE VIEW quiz_blocks_with_question_counts AS
SELECT 
    qb.*,
    COUNT(q.id) as total_questions,
    COUNT(q.id) FILTER (WHERE q.category = 'characters') as character_questions,
    COUNT(q.id) FILTER (WHERE q.category = 'events') as event_questions,
    COUNT(q.id) FILTER (WHERE q.category = 'themes') as theme_questions,
    COUNT(q.id) FILTER (WHERE q.category = 'culture') as culture_questions,
    COUNT(q.id) FILTER (WHERE q.difficulty = 'easy') as easy_questions,
    COUNT(q.id) FILTER (WHERE q.difficulty = 'medium') as medium_questions,
    COUNT(q.id) FILTER (WHERE q.difficulty = 'hard') as hard_questions
FROM quiz_blocks qb
LEFT JOIN questions q ON qb.id = q.sarga_block_id
GROUP BY qb.id, qb.epic_id, qb.block_name, qb.difficulty_level, qb.phase, 
         qb.start_sarga, qb.end_sarga, qb.kanda, qb.sequence_order, 
         qb.learning_objectives, qb.narrative_summary, qb.key_themes, 
         qb.cultural_elements, qb.is_available, qb.prerequisite_blocks,
         qb.created_at, qb.updated_at;

COMMIT;