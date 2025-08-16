-- Import summaries for Sargas 30-33
-- Execute in Supabase SQL Editor

-- Summary for Sarga 30
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', 30, 'The Defeat of Demons and Completion of the Yajna',
    '["Rama and Lakshmana, aware of the time and place, ask Sage Vishvamitra about the exact moment the demons are expected to disrupt the ritual.","As the ritual proceeds according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons.","Rama and Lakshmana successfully protect the ritual from the demons, leading to the successful completion of the yajna."]'::jsonb,
    '["Rama and Lakshmana: The royal princes and protectors of the ritual, who successfully defeat the demons.","Sage Vishvamitra: The sage conducting the ritual, who guides Rama and Lakshmana."]'::jsonb,
    '["Duty and Dharma: Rama and Lakshmana fulfill their duty as protectors, demonstrating the importance of dharma in Hindu philosophy.","Triumph of Good over Evil: The successful completion of the ritual despite the demons' attempts to disrupt it symbolizes the victory of good over evil."]'::jsonb,
    'This Sarga is significant as it showcases the importance of duty or ''dharma'' in Hindu philosophy. The princes, Rama and Lakshmana, fulfill their duty as protectors, demonstrating their commitment to righteousness. The successful completion of the yajna, despite the demons'' attempts to disrupt it, symbolizes the victory of good over evil, a recurring theme in Hindu mythology. The Sarga also highlights the power of rituals and the importance of maintaining their sanctity.',
    'In this Sarga, Rama and Lakshmana, the royal princes, are entrusted with the duty of protecting Sage Vishvamitra''s ritual from the demons. Aware of the time and place, they ask the sage about the exact moment the demons are expected to disrupt the ritual. As the ritual proceeds according to the hymns and rules, a frightening sound is heard in the sky, indicating the arrival of the demons. However, Rama and Lakshmana, prepared for this, successfully protect the ritual from the demons. Their victory leads to the successful completion of the yajna, much to the delight of Sage Vishvamitra and the other sages present. The Sarga ends with Vishvamitra expressing his gratitude to Rama and Lakshmana for their valiant efforts.',
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
    'ramayana', 'bala_kanda', 31, 'Vishwamitra''s Journey to Mithila',
    '["Rama and Lakshmana spend the night rejoicing after achieving their objectives","Vishwamitra, Rama, and Lakshmana set out for Mithila after completing their morning rituals","Vishwamitra tells Rama and Lakshmana about the auspicious bow of Shiva in Mithila and their journey towards the north begins"]'::jsonb,
    '["Rama and Lakshmana - The brave and virtuous princes of Ayodhya who are accompanying Sage Vishwamitra","Vishwamitra - A revered sage with immense spiritual power, who is leading Rama and Lakshmana to Mithila"]'::jsonb,
    '["Duty and Dharma - The adherence to one's responsibilities and moral duties","Divine Destiny - The unfolding of divine plans through human actions"]'::jsonb,
    'This Sarga is significant in Hindu traditions as it sets the stage for the meeting of Rama and Sita, a divine union central to the Ramayana. It also introduces the auspicious bow of Shiva, a symbol of divine power and authority. The journey to Mithila signifies the transition from the forest life to the royal court, highlighting the duality of life in ancient Hindu society. The rituals performed by the characters underscore the importance of discipline and spiritual practices in Hinduism.',
    'In this Sarga, Rama and Lakshmana, having fulfilled their duties, spend the night in joy and satisfaction. As dawn breaks, they perform their morning rituals and prepare for the journey ahead. Sage Vishvamitra, their mentor and guide, leads them towards Mithila, the kingdom of King Janaka. He speaks of the auspicious bow of Shiva that is worshipped in Mithila, sparking curiosity and anticipation in the princes. This bow, a symbol of divine power, is beyond the reach of gods, demons, and humans alike, adding an element of challenge and adventure to their journey. As they set out towards the north, a hundred carts of followers accompany them, reflecting the respect and reverence Vishvamitra commands. Thus, the stage is set for the next chapter of their journey, filled with promise and divine destiny.',
    'https://www.valmikiramayan.net/utf8/baala/sarga31/bala_31_frame.htm',
    NOW(), NOW()
);

-- Summary for Sarga 32
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', 32, 'The Legend of King Kusha and His Descendants',
    '["The birth of four sons to King Kusha and his wife, a princess of Vidarbha, who were named Kushamba, Kushanabha, Adhurta, and Vasu.","The establishment of cities by each of Kusha's sons, with Kushamba founding Kaushambi and Kushanabha establishing Mahodaya.","The birth of a hundred daughters to Kushanabha through the celestial maiden Ghritaachi, who were later disfigured by the wind-god Vayu."]'::jsonb,
    '["King Kusha: A great ascetic and ruler, known for his unflinching adherence to dharma (righteousness) and respect for the virtuous.","Kushamba and Kushanabha: Sons of Kusha, who followed in their father's footsteps and became great rulers themselves.","The Hundred Daughters of Kushanabha: Born of celestial maiden Ghritaachi, they were known for their beauty and grace, but were later disfigured by Vayu, the wind-god."]'::jsonb,
    '["The importance of dharma (righteousness) and the consequences of its violation","The power of asceticism and the divine boons it can bestow","The interplay between the human and divine realms"]'::jsonb,
    'This Sarga is significant as it illustrates the Hindu concept of dharma and the consequences of its violation. The disfigurement of Kushanabha''s daughters by Vayu is a stark reminder of the repercussions of disrespecting divine entities. Furthermore, the narrative underscores the importance of asceticism, a key aspect of Hindu spirituality, as a means to attain divine boons. The establishment of cities by Kusha''s sons also reflects the cultural importance of urban development in ancient India.',
    'In this Sarga, Sage Vishvamitra narrates the legend of King Kusha, a great ascetic, who was blessed with four sons through his wife, a princess of Vidarbha. Each of these sons, Kushamba, Kushanabha, Adhurta, and Vasu, grew up to be virtuous rulers, establishing their own cities and continuing their father''s legacy. Kushamba founded the city of Kaushambi, while Kushanabha established Mahodaya. Kushanabha was further blessed with a hundred daughters through the celestial maiden Ghritaachi. These daughters were known for their beauty and grace. However, they were later disfigured by Vayu, the wind-god, as a consequence of their disrespect towards him. This event left King Kushanabha deeply perturbed, highlighting the importance of respecting divine entities and adhering to dharma.',
    'https://www.valmikiramayan.net/utf8/baala/sarga32/bala_32_frame.htm',
    NOW(), NOW()
);

-- Summary for Sarga 33
INSERT INTO chapter_summaries (
    epic_id, kanda, sarga, title, 
    key_events, main_characters, themes, 
    cultural_significance, narrative_summary,
    source_reference, created_at, updated_at
) VALUES (
    'ramayana', 'bala_kanda', 33, 'Kushanaabha''s Daughters and the Air God',
    '["Kushanaabha's hundred daughters report the mischief of the all-pervasive Air-god, who desired to dishonor them.","Kushanaabha arranges for his daughters' marriage with the saintly Brahmadatta.","Somada, a celestial female, serves a sage practicing asceticism and earns his favor."]'::jsonb,
    '["Kushanaabha - A wise and scholarly king who is the father of a hundred daughters.","Air-god - An all-pervasive deity who attempts to dishonor Kushanaabha's daughters.","Brahmadatta - A saintly king to whom Kushanaabha's daughters are married.","Somada - A celestial female who serves a sage and earns his favor."]'::jsonb,
    '["The power of Dharma (righteousness) and its role in protecting the virtuous.","The importance of asceticism and service in earning divine favor."]'::jsonb,
    'This Sarga emphasizes the Hindu values of Dharma (righteousness), asceticism, and service. The story of Kushanaabha''s daughters and the Air-god underscores the protective power of Dharma, even against divine beings. Furthermore, the narrative of Somada serving the sage highlights the importance of selfless service and asceticism in earning divine favor. These themes are central to Hindu philosophy and culture, emphasizing the importance of moral conduct and spiritual discipline.',
    'In this Sarga, the hundred daughters of the scholarly king Kushanaabha report the mischief of the all-pervasive Air-god, who, resorting to an improper approach, desired to dishonor them. However, the Air-god is unable to overlook the virtuous conduct of the girls, demonstrating the protective power of Dharma. Pleased at their behavior, Kushanaabha arranges for their marriage with the saintly king Brahmadatta.

Meanwhile, a celestial female named Somada serves a sage practicing asceticism. Through her dedicated service, she earns the sage''s favor. This narrative underscores the importance of selfless service and asceticism in Hindu philosophy. The Sarga ends with Kushanaabha sending his daughters, now married to Brahmadatta, along with a group of religious teachers, demonstrating the importance of spiritual guidance in life''s journey.',
    'https://www.valmikiramayan.net/utf8/baala/sarga33/bala_33_frame.htm',
    NOW(), NOW()
);