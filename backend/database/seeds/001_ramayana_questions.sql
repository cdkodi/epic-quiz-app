-- Seed Data: Ramayana Questions
-- Created: 2025-08-06
-- Description: Initial set of Ramayana quiz questions for MVP testing

-- Verify Ramayana epic exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM epics WHERE id = 'ramayana') THEN
    RAISE EXCEPTION 'Ramayana epic not found. Please run initial migration first.';
  END IF;
END $$;

-- Insert Ramayana questions with educational content
-- ARCHITECTURAL DECISION: Including diverse question types and difficulties
-- WHY: Demonstrates the full range of our content model and educational approach

-- CHARACTERS category questions
INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation, original_quote, quote_translation, tags, cross_epic_tags) VALUES

('ramayana', 'characters', 'easy', 
 'Who is the main protagonist of the Ramayana?',
 '["Rama", "Krishna", "Arjuna", "Hanuman"]'::jsonb,
 0,
 'Rama is the seventh avatar of Vishnu and the central hero of the Ramayana epic.',
 'रामो विग्रहवान्धर्मः',
 'Rama is righteousness personified',
 ARRAY['rama', 'protagonist', 'avatar'],
 ARRAY['heroism', 'divine_incarnation', 'righteousness']),

('ramayana', 'characters', 'medium',
 'What is Hanuman''s most famous feat in the Ramayana?',
 '["Lifting a mountain", "Crossing the ocean to Lanka", "Defeating Ravana", "Building a bridge"]'::jsonb,
 1,
 'Hanuman''s leap across the ocean to Lanka to find Sita is one of the most celebrated acts of devotion and strength.',
 'हनुमान् समुद्रं लङ्घयति',
 'Hanuman leaps across the ocean',
 ARRAY['hanuman', 'lanka', 'leap', 'devotion'],
 ARRAY['loyalty', 'supernatural_strength', 'devotion']),

('ramayana', 'characters', 'hard',
 'Who among Rama''s brothers chose to accompany him in exile?',
 '["Bharata", "Lakshmana", "Shatrughna", "All three brothers"]'::jsonb,
 1,
 'Lakshmana voluntarily accompanied Rama and Sita into exile, demonstrating unwavering brotherly loyalty.',
 'लक्ष्मणो रामानुगतः',
 'Lakshmana followed Rama',
 ARRAY['lakshmana', 'exile', 'brotherhood'],
 ARRAY['loyalty', 'sacrifice', 'family_duty']);

-- EVENTS category questions  
INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation, original_quote, quote_translation, tags, cross_epic_tags) VALUES

('ramayana', 'events', 'easy',
 'How long was Rama''s exile period?',
 '["12 years", "14 years", "16 years", "18 years"]'::jsonb,
 1,
 'Rama was exiled for 14 years as decreed by King Dasharatha to fulfill Kaikeyi''s boon.',
 'चतुर्दश वर्षाणि वने वासः',
 'Fourteen years of dwelling in the forest',
 ARRAY['exile', 'dasharatha', 'kaikeyi'],
 ARRAY['duty', 'sacrifice', 'honor']),

('ramayana', 'events', 'medium',
 'What caused Sita to cross Lakshmana''s protective line?',
 '["A beautiful deer", "A crying child", "A beggar seeking alms", "Ravana in disguise"]'::jsonb,
 2,
 'Sita crossed the Lakshmana Rekha to give alms to what she thought was a holy beggar, but was actually Ravana in disguise.',
 'भिक्षार्थे लक्ष्मणरेखां सीता लङ्घयति',
 'Sita crosses Lakshmana''s line for the sake of charity',
 ARRAY['sita', 'lakshmana_rekha', 'ravana', 'disguise'],
 ARRAY['deception', 'charity', 'vulnerability']),

('ramayana', 'events', 'hard',
 'What was the final test Sita had to undergo after being rescued?',
 '["Trial by fire (Agni Pariksha)", "Trial by water", "Trial by combat", "Trial by meditation"]'::jsonb,
 0,
 'Sita underwent Agni Pariksha (trial by fire) to prove her purity after her captivity in Lanka.',
 'अग्निपरीक्षा सीतायाः',
 'Sita''s trial by fire',
 ARRAY['sita', 'agni_pariksha', 'purity', 'trial'],
 ARRAY['honor', 'social_expectations', 'gender_roles']);

-- THEMES category questions
INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation, original_quote, quote_translation, tags, cross_epic_tags) VALUES

('ramayana', 'themes', 'medium',
 'What is the central theme that Rama''s character represents?',
 '["Love", "Dharma (righteousness)", "Power", "Wisdom"]'::jsonb,
 1,
 'Rama is considered the ideal man (Purushottama) who always follows dharma despite personal cost.',
 'धर्मे च अर्थे च कामे च मोक्षे च भरतर्षभ',
 'In dharma, wealth, desire, and liberation, O best of Bharatas',
 ARRAY['dharma', 'righteousness', 'ideal_man'],
 ARRAY['moral_duty', 'righteousness', 'ethical_leadership']),

('ramayana', 'themes', 'hard',
 'What does Hanuman''s character primarily symbolize?',
 '["Strength", "Devotion (Bhakti)", "Intelligence", "Courage"]'::jsonb,
 1,
 'Hanuman embodies perfect devotion (bhakti) and selfless service to the divine.',
 'राम काज किन्हे बिना मोहि कहाँ विश्राम',
 'Without accomplishing Rama''s work, where is rest for me?',
 ARRAY['hanuman', 'bhakti', 'devotion', 'service'],
 ARRAY['devotion', 'selfless_service', 'spiritual_dedication']);

-- CULTURE category questions
INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation, original_quote, quote_translation, tags, cross_epic_tags) VALUES

('ramayana', 'culture', 'medium',
 'What does the name "Ramayana" literally mean?',
 '["Story of Rama", "Journey of Rama", "Rama''s way/path", "Rama''s victory"]'::jsonb,
 2,
 'Ramayana means "Rama''s way" or "Rama''s journey," referring to both his physical and spiritual path.',
 'रामायणं महाकाव्यम्',
 'The Ramayana is a great epic poem',
 ARRAY['ramayana', 'etymology', 'meaning'],
 ARRAY['epic_literature', 'spiritual_journey', 'cultural_heritage']),

('ramayana', 'culture', 'hard',
 'Who is traditionally credited as the author of the Ramayana?',
 '["Vyasa", "Valmiki", "Kalidasa", "Tulsidas"]'::jsonb,
 1,
 'Sage Valmiki is revered as the Adi Kavi (first poet) and author of the original Sanskrit Ramayana.',
 'आदिकाविर्वाल्मीकिः',
 'Valmiki, the first poet',
 ARRAY['valmiki', 'author', 'adi_kavi'],
 ARRAY['literary_tradition', 'authorship', 'sanskrit_literature']);

-- Insert corresponding educational content for deep dives
INSERT INTO educational_content (question_id, detailed_explanation, cultural_context, historical_background, cross_epic_connections, related_topics) 
SELECT 
  q.id,
  CASE 
    WHEN q.question_text LIKE '%protagonist%' THEN 
      'Rama represents the ideal of dharmic kingship in Hindu tradition. As the seventh avatar of Vishnu, he embodies the perfect balance of power and righteousness. Unlike many heroic figures in world literature, Rama''s strength lies not just in his martial prowess but in his unwavering commitment to moral principles even when they cause personal suffering. His willingness to accept exile to honor his father''s word, and later to undergo the agni pariksha controversy, demonstrates the complex relationship between personal desire and social duty that forms the core of dharmic philosophy.'
    WHEN q.question_text LIKE '%Hanuman%' AND q.question_text LIKE '%feat%' THEN
      'Hanuman''s leap to Lanka is more than a physical feat—it represents the power of devotion to transcend natural limitations. In Hindu philosophy, this episode illustrates how bhakti (devotion) can grant supernatural abilities. The ocean itself, upon seeing Hanuman''s devotion to Rama, offered to help by asking the mountains to provide stepping stones. This cooperation between devotee, divine, and nature exemplifies the interconnectedness central to Vedantic thought. The leap also symbolizes the soul''s journey across the ocean of material existence (samsara) to reach the divine.'
    WHEN q.question_text LIKE '%exile%' AND q.question_text LIKE '%years%' THEN
      'The fourteen-year exile period reflects the ancient Indian concept of life stages (ashramas). Rama''s forest years represent the vanaprastha (forest dweller) stage, where one renounces worldly pleasures for spiritual growth. This wasn''t just punishment but a transformative journey that prepared him for ideal kingship. The specific number fourteen has astronomical significance in Vedic tradition, relating to lunar cycles and cosmic time. The exile narrative also explores the tension between personal happiness and social obligation, a theme that resonates across cultures and time periods.'
    ELSE 'Detailed cultural and philosophical analysis of this aspect of the Ramayana epic, exploring its significance in Hindu tradition and universal human themes.'
  END as detailed_explanation,
  'Ancient Indian cultural and social context' as cultural_context,
  'Historical background from ancient Indian literature' as historical_background,
  '[{"epicId": "mahabharata", "connection": "Both epics explore dharmic dilemmas", "similarThemes": ["duty", "righteousness", "sacrifice"]}]'::jsonb as cross_epic_connections,
  ARRAY['hindu_philosophy', 'dharma', 'ancient_literature'] as related_topics
FROM questions q 
WHERE q.epic_id = 'ramayana';

-- Update epic question count
UPDATE epics SET question_count = (
  SELECT COUNT(*) FROM questions WHERE epic_id = 'ramayana'
) WHERE id = 'ramayana';

-- Verification queries
SELECT 'Ramayana seed data inserted successfully' as status;
SELECT 
  category, 
  difficulty, 
  COUNT(*) as question_count 
FROM questions 
WHERE epic_id = 'ramayana' 
GROUP BY category, difficulty 
ORDER BY category, difficulty;