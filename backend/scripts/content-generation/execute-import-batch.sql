-- Execute imports for Sargas 30-33 batch
-- First batch: Sargas 30-31

-- Summary for Sarga 30
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', 30, 'The Defeat of Demons and Completion of the Yajna',
    '["Rama and Lakshmana, aware of the time and place, ask Sage Vishvamitra about the exact moment the demons are expected to disrupt the ritual.", "As the ritual proceeds according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons.", "Rama and Lakshmana successfully protect the ritual from the demons, leading to the successful completion of the yajna."]'::jsonb,
    '["Rama and Lakshmana: The royal princes and protectors of the ritual, who successfully defeat the demons.", "Sage Vishvamitra: The sage conducting the ritual, who guides Rama and Lakshmana."]'::jsonb,
    '["Duty and Dharma: Rama and Lakshmana fulfill their duty as protectors, demonstrating the importance of dharma in Hindu philosophy.", "Triumph of Good over Evil: The successful completion of the ritual despite the demons'' attempts to disrupt it symbolizes the victory of good over evil."]'::jsonb,
    'This Sarga is significant as it showcases the importance of duty or ''dharma'' in Hindu philosophy. The princes, Rama and Lakshmana, fulfill their duty as protectors, demonstrating their commitment to righteousness. The successful completion of the yajna, despite the demons'' attempts to disrupt it, symbolizes the victory of good over evil, a recurring theme in Hindu mythology. The Sarga also highlights the power of rituals and the importance of maintaining their sanctity.',
    'In this Sarga, Rama and Lakshmana, the royal princes, are entrusted with the duty of protecting Sage Vishvamitra''s ritual from the demons. Aware of the time and place, they ask the sage about the exact moment the demons are expected to disrupt the ritual. As the ritual proceed according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons. However, Rama and Lakshmana, prepared for this, successfully protect the ritual from the demons. Their victory leads to the successful completion of the yajna, much to the delight of Sage Vishvamitra and the other sages present. The Sarga ends with Vishvamitra expressing his gratitude to Rama and Lakshmana for their valiant efforts.',
    'https://www.valmikiramayan.net/utf8/baala/sarga30/bala_30_frame.htm',
    NOW(), NOW()
);

-- Summary for Sarga 31
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', 31, 'Vishvamitra''s Journey to Mithila',
    '["Rama and Lakshmana spend the night rejoicing after achieving their objectives", "Vishvamitra, Rama, and Lakshmana set out for Mithila after completing their morning rituals", "Vishvamitra tells Rama and Lakshmana about the auspicious bow of Shiva in Mithila and their journey towards the north begins"]'::jsonb,
    '["Rama and Lakshmana - The brave and virtuous princes of Ayodhya who are accompanying Sage Vishvamitra", "Vishvamitra - A revered sage with immense spiritual power, who is leading Rama and Lakshmana to Mithila"]'::jsonb,
    '["Duty and Dharma - The adherence to one''s responsibilities and moral duties", "Divine Destiny - The unfolding of divine plans through human actions"]'::jsonb,
    'This Sarga is significant in Hindu traditions as it sets the stage for the meeting of Rama and Sita, a divine union central to the Ramayana. It also introduces the auspicious bow of Shiva, a symbol of divine power and authority. The journey to Mithila signifies the transition from the forest life to the royal court, highlighting the duality of life in ancient Hindu society. The rituals performed by the characters underscore the importance of discipline and spiritual practices in Hinduism.',
    'In this Sarga, Rama and Lakshmana, having fulfilled their duties, spend the night in joy and satisfaction. As dawn breaks, they perform their morning rituals and prepare for the journey ahead. Sage Vishvamitra, their mentor and guide, leads them towards Mithila, the kingdom of King Janaka. He speaks of the auspicious bow of Shiva that is worshipped in Mithila, sparking curiosity and anticipation in the princes. This bow, a symbol of divine power, is beyond the reach of gods, demons, and humans alike, adding an element of challenge and adventure to their journey. As they set out towards the north, a hundred carts of followers accompany them, reflecting the respect and reverence Vishvamitra commands. Thus, the stage is set for the next chapter of their journey, filled with promise and divine destiny.',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm',
    NOW(), NOW()
);