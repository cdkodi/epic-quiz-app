-- Seed Data: Ramayana Bala Kanda Sarga 2 Questions
-- Created: 2025-08-11
-- Description: Questions for Bala Kanda Sarga 2 - Narada's arrival and introduction of Rama's story

-- Verify Ramayana epic exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM epics WHERE id = 'ramayana') THEN
    RAISE EXCEPTION 'Ramayana epic not found. Please run initial migration first.';
  END IF;
END $$;

-- Insert Bala Kanda Sarga 2 questions
-- CONTEXT: In Sarga 2, Sage Narada arrives at Valmiki's ashram and begins to tell the story of Rama
-- This sarga establishes the frame narrative and introduces key concepts

-- CHARACTERS category questions for Sarga 2
INSERT INTO questions (epic_id, kanda, sarga, category, difficulty, question_text, options, correct_answer_id, basic_explanation, original_quote, quote_translation, tags, cross_epic_tags) VALUES

('ramayana', 'bala_kanda', 2, 'characters', 'easy', 
 'Which sage arrives at Valmiki''s ashram to tell the story of Rama?',
 '["Bharadvaja", "Narada", "Vishwamitra", "Vasishta"]'::jsonb,
 1,
 'Sage Narada, the divine sage and messenger of the gods, arrives to narrate Rama''s story to Valmiki.',
 'नारदो भगवान्ऋषिः',
 'The divine sage Narada',
 ARRAY['narada', 'sage', 'divine_messenger'],
 ARRAY['divine_wisdom', 'storytelling', 'spiritual_guidance']),

('ramayana', 'bala_kanda', 2, 'characters', 'medium',
 'What is Narada''s primary role in Hindu tradition?',
 '["Warrior sage", "Divine messenger and storyteller", "Forest hermit", "Royal advisor"]'::jsonb,
 1,
 'Narada is known as Devarishi (divine sage) who travels between worlds as a messenger and storyteller.',
 'देवर्षिर्नारदो नाम',
 'The divine sage named Narada',
 ARRAY['narada', 'devarishi', 'messenger'],
 ARRAY['divine_communication', 'cosmic_knowledge', 'spiritual_teaching']),

-- EVENTS category questions for Sarga 2
('ramayana', 'bala_kanda', 2, 'events', 'easy',
 'What does Narada come to tell Valmiki?',
 '["About a great war", "The story of Rama", "About future events", "Royal genealogies"]'::jsonb,
 1,
 'Narada arrives specifically to narrate the complete story of Rama to the sage Valmiki.',
 'रामकथामुत्तमाम्',
 'The excellent story of Rama',
 ARRAY['rama_story', 'narration', 'divine_tale'],
 ARRAY['epic_narrative', 'spiritual_instruction', 'moral_teaching']),

('ramayana', 'bala_kanda', 2, 'events', 'medium',
 'Why is Narada''s arrival at Valmiki''s ashram significant?',
 '["It starts the frame narrative", "It establishes divine sanction for the epic", "It connects cosmic and earthly realms", "All of the above"]'::jsonb,
 3,
 'Narada''s arrival establishes the divine origin of the Ramayana story and creates the narrative framework.',
 'दिव्यकथा प्रवर्तते',
 'The divine story begins',
 ARRAY['frame_narrative', 'divine_origin', 'epic_beginning'],
 ARRAY['narrative_structure', 'divine_authorization', 'spiritual_legitimacy']),

-- THEMES category questions for Sarga 2  
('ramayana', 'bala_kanda', 2, 'themes', 'medium',
 'What does Narada''s role as storyteller represent in the epic?',
 '["Entertainment value", "Divine knowledge transmission", "Historical documentation", "Poetic creativity"]'::jsonb,
 1,
 'Narada represents the tradition of divine knowledge being transmitted through storytelling and oral tradition.',
 'ब्रह्मविद्या प्रचारकः',
 'Propagator of divine knowledge',
 ARRAY['divine_knowledge', 'oral_tradition', 'spiritual_transmission'],
 ARRAY['wisdom_tradition', 'cultural_preservation', 'spiritual_education']),

('ramayana', 'bala_kanda', 2, 'themes', 'hard',
 'The concept of a sage receiving a story from a divine messenger reflects which Hindu philosophical principle?',
 '["Maya (illusion)", "Shruti (divine revelation)", "Karma (action)", "Moksha (liberation)"]'::jsonb,
 1,
 'This reflects the principle of Shruti - knowledge received through divine revelation rather than human reasoning.',
 'श्रुतिर्ब्रह्मविदां प्रमाणम्',
 'Shruti is the authority for those who know Brahman',
 ARRAY['shruti', 'divine_revelation', 'spiritual_authority'],
 ARRAY['vedic_tradition', 'divine_knowledge', 'scriptural_authority']),

-- CULTURE category questions for Sarga 2
('ramayana', 'bala_kanda', 2, 'culture', 'medium',
 'The tradition of a divine sage narrating stories reflects which aspect of ancient Indian culture?',
 '["Literary entertainment", "Guru-disciple tradition", "Royal patronage", "Commercial storytelling"]'::jsonb,
 1,
 'This reflects the guru-shishya (teacher-student) tradition where knowledge is transmitted through direct instruction.',
 'गुरुशिष्यपरम्परा',
 'The guru-disciple tradition',
 ARRAY['guru_shishya', 'knowledge_transmission', 'oral_tradition'],
 ARRAY['educational_tradition', 'spiritual_instruction', 'cultural_continuity']),

('ramayana', 'bala_kanda', 2, 'culture', 'hard',
 'What does the frame narrative structure (story within a story) achieve in Sanskrit literature?',
 '["Complex plotting", "Multiple perspectives and divine authority", "Extended length", "Poetic beauty"]'::jsonb,
 1,
 'Frame narratives provide multiple levels of meaning and establish divine or authoritative sources for the stories.',
 'कथान्तर्गतकथा पद्धतिः',
 'The method of story within story',
 ARRAY['frame_narrative', 'narrative_structure', 'literary_technique'],
 ARRAY['sanskrit_literature', 'narrative_authority', 'storytelling_tradition']);

-- Insert corresponding educational content for Sarga 2 questions
INSERT INTO educational_content (question_id, detailed_explanation, cultural_context, historical_background, cross_epic_connections, related_topics) 
SELECT 
  q.id,
  CASE 
    WHEN q.question_text LIKE '%Narada%' AND q.question_text LIKE '%arrives%' THEN 
      'Narada''s arrival represents a crucial literary device in Sanskrit epics - the divine authorization of the narrative. In ancient Indian tradition, great stories required divine sanction to be considered authoritative. Narada, as Devarishi (divine sage), bridges the gap between divine realm and human world. His omniscience allows him to narrate past, present, and future events with complete authority. This establishes the Ramayana not just as entertainment, but as dharmic instruction with cosmic significance. The tradition recognizes Narada as the original source, making Valmiki the composer rather than creator of the story.'
    WHEN q.question_text LIKE '%divine messenger%' THEN
      'Narada''s role as divine messenger reflects the ancient Indian understanding of knowledge transmission. Unlike Western traditions that emphasize individual discovery, Sanskrit tradition values received wisdom (shruti) transmitted through proper channels. Narada embodies this principle - he doesn''t create knowledge but transmits cosmic truths. His travels between all three worlds (earth, heaven, underworld) make him the perfect intermediary. This concept appears across Hindu literature, where divine messengers ensure that cosmic order and dharmic principles are communicated to human realm when needed.'
    WHEN q.question_text LIKE '%story of Rama%' THEN
      'The specific mention of "Rama''s story" establishes the epic''s central focus while creating anticipation. In Sanskrit literary theory, the opening (mukha) of an epic should clearly establish the hero, theme, and purpose. Narada''s announcement serves this function while adding divine gravitas. The term "Rama-katha" (story of Rama) becomes a sacred designation, suggesting this is not ordinary biography but spiritual instruction. This framing influences how audiences receive the narrative - not as historical chronicle but as dharmic guidance through the perfect example of Rama''s life.'
    ELSE 'Detailed cultural and philosophical analysis exploring the significance of this element in Bala Kanda Sarga 2, its role in establishing the epic''s authority and spiritual framework.'
  END as detailed_explanation,
  'Ancient Indian guru-disciple tradition and the concept of divine knowledge transmission' as cultural_context,
  'Reflects the oral tradition of Sanskrit literature and the principle of authoritative sources (pramana) in Hindu epistemology' as historical_background,
  '[{"epicId": "mahabharata", "connection": "Both epics use frame narratives with divine/sage narrators", "similarThemes": ["divine_authority", "spiritual_instruction", "dharmic_guidance"]}]'::jsonb as cross_epic_connections,
  ARRAY['shruti_tradition', 'frame_narrative', 'divine_authority', 'guru_shishya_parampara'] as related_topics
FROM questions q 
WHERE q.epic_id = 'ramayana' AND q.kanda = 'bala_kanda' AND q.sarga = 2;

-- Update epic question count to include Sarga 2 questions
UPDATE epics 
SET question_count = (SELECT COUNT(*) FROM questions WHERE epic_id = 'ramayana')
WHERE id = 'ramayana';

-- Insert chapter summary for Bala Kanda Sarga 2
INSERT INTO chapter_summaries (epic_id, kanda, sarga, title, key_events, main_characters, themes, cultural_significance, narrative_summary, source_reference) VALUES
('ramayana', 'bala_kanda', 2, 'Narada''s Arrival and Introduction of Rama''s Story',
 'Sage Narada arrives at Valmiki''s ashram; Narada begins to narrate the story of Rama; Establishment of the frame narrative structure',
 'Narada (divine sage and storyteller); Valmiki (the recipient and future composer); Rama (the hero whose story will be told)',
 'Divine knowledge transmission; The authority of shruti (revealed knowledge); The guru-disciple tradition; Frame narrative as literary device',
 'Establishes the divine origin and authority of the Ramayana; Reflects ancient Indian epistemology that values received wisdom; Demonstrates the guru-shishya tradition of knowledge transmission',
 'In this sarga, the divine sage Narada arrives at the peaceful ashram of Valmiki. Narada, known as the messenger of gods and the bearer of cosmic knowledge, comes with a specific purpose - to narrate the complete story of Rama. This establishes the crucial frame narrative that gives divine sanction to the epic. Through Narada''s omniscient perspective, the audience understands that they are about to hear not just a story, but authoritative spiritual instruction. The sarga sets up the transmission of divine knowledge through the traditional guru-disciple relationship, with Narada as the divine teacher and Valmiki as the devoted student who will later compose this knowledge into poetry.',
 'Valmiki Ramayana, Bala Kanda, Sarga 2');

COMMIT;