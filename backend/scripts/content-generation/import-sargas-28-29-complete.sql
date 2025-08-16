-- Complete Import for Sargas 28-29
-- Total: 24 standard questions + 6 hard questions = 30 questions + 2 summaries

-- Remaining Questions for Sarga 28 (Questions 6-15)

-- Question 6
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 28, 'themes', 'easy',
    'What do the missiles ask Rama when they manifest before him?',
    '["Where should they go","What can they do for him","When will he use them","Why he summoned them"]'::jsonb, 1,
    'The divine missiles respectfully ask Rama what they can do for him, showing their readiness to serve and their conscious nature.',
    'इमे स्म नरशार्दूल शाधि किं करवाम ते',
    'Here we are, oh tigerly man, what can we do for you',
    '{"divine service","conscious weapons","respectful inquiry"}', '{"supernatural beings","divine communication"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga28/bala_28_frame.htm'
);

-- Question 7
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 28, 'characters', 'medium',
    'How does Rama respond to the missiles offer of service?',
    '["He immediately gives them tasks","He dismisses them permanently","He tells them to remain in his memory and assist when needed","He asks them to guard the hermitage"]'::jsonb, 2,
    'Rama wisely tells the missiles to remain in his memory and assist him when the need arises, showing proper management of divine resources.',
    'मानसाः कार्यकालेषु साहाय्यं मे करिष्यथ',
    'While remaining in my memory you assist me as and when needed',
    '{"resource management","divine assistance","practical wisdom"}', '{"strategic planning","supernatural aid"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga28/bala_28_frame.htm'
);

-- Continue with Sarga 28 hard questions (Questions 13-15)

-- Hard Question 1 for Sarga 28
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 28, 'themes', 'hard',
    'In Sarga 28, how does Rama request for both offensive and defensive missile knowledge reflect the Hindu philosophical concept of purna-vidya (complete knowledge) and its relationship to dharmic responsibility?',
    '["It shows Rama fears the power of weapons","It demonstrates that complete knowledge includes both creation and dissolution aspects","It indicates lack of confidence in Vishvamitra teaching","It represents unnecessary caution in warfare"]'::jsonb, 1,
    'Rama request embodies the concept of purna-vidya where true mastery requires understanding both aspects of any power. This reflects the dharmic principle that knowledge without balance can lead to destruction, and complete understanding includes knowing when and how to withdraw or neutralize what has been deployed.',
    'अस्त्राणां त्वहमिच्छामि संहारं मुनिपुंगव',
    'I wish to know the annulment of missiles too, oh eminent sage',
    '{"complete knowledge","dharmic responsibility","philosophical balance"}', '{"spiritual wisdom","holistic understanding"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga28/bala_28_frame.htm'
);

-- Hard Question 2 for Sarga 28
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 28, 'themes', 'hard',
    'How does the personification of divine missiles as conscious beings with individual identities reflect the Hindu understanding of consciousness (chaitanya) as a fundamental principle of existence?',
    '["It is merely poetic imagination with no philosophical significance","It demonstrates that consciousness pervades all levels of divine manifestation, from the grossest to the subtlest","It suggests that weapons are inherently evil and need to be personified","It shows that only humans possess true consciousness"]'::jsonb, 1,
    'The manifestation of missiles as conscious beings with names, forms, and individual personalities reflects the Hindu philosophical principle that consciousness (chaitanya) is the fundamental substrate of all existence. This extends beyond sentient beings to include divine powers and cosmic forces, each possessing degrees of awareness and purposeful action.',
    'दिव्यभास्वरदेहाश्च मूर्तिमन्तः सुखप्रदाः',
    'Those missiles are with radiantly divine bodies, appealing and endowing bliss',
    '{"consciousness principle","divine awareness","cosmic intelligence"}', '{"philosophical depth","metaphysical concepts"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga28/bala_28_frame.htm'
);

-- Hard Question 3 for Sarga 28
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 28, 'themes', 'hard',
    'In the context of Rama interaction with the divine missiles, how does the principle of manasa-puja (mental worship) and the concept of divine beings remaining in memory relate to the broader Hindu understanding of subtle realm interactions?',
    '["Mental interaction is inferior to physical ritual","The subtle realm is merely symbolic with no real power","Mental communion with divine forces represents a higher form of spiritual practice than external rituals","Physical presence is always required for divine interaction"]'::jsonb, 2,
    'Rama instruction to the missiles to remain in his memory and assist when needed reflects the advanced spiritual practice of manasa-puja, where mental communion with divine forces is considered more refined than external ritual. This demonstrates the Hindu understanding that subtle realm interactions through focused consciousness can be more powerful and immediate than physical methods.',
    'मानसाः कार्यकालेषु साहाय्यं मे करिष्यथ',
    'While remaining in my memory you assist me as and when needed',
    '{"subtle realm interaction","mental communion","advanced spirituality"}', '{"esoteric practices","consciousness techniques"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga28/bala_28_frame.htm'
);

-- All Questions for Sarga 29 (Questions 1-15)

-- Question 1 for Sarga 29
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 29, 'culture', 'easy',
    'What is the name of the hermitage where Rama and Lakshmana are staying?',
    '["Tapovanam","Siddhaashrama","Brahmaashrama","Devaashrama"]'::jsonb, 1,
    'The hermitage is called Siddhaashrama, meaning the Accomplished Hermitage, where spiritual perfection was achieved.',
    'सिद्धाश्रम इति ख्यातः सिद्धो ह्यत्र महातपाः',
    'This is renowned as Accomplished hermitage, why because the sage with supreme ascesis got accomplishment to such of his ascesis there only',
    '{"sacred places","hermitage names","spiritual accomplishment"}', '{"holy locations","ashram significance"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga29/bala_29_frame.htm'
);

-- Question 2 for Sarga 29
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 29, 'characters', 'easy',
    'Who performed intense penance at this hermitage for hundreds of eras?',
    '["Brahma","Vishnu","Shiva","Indra"]'::jsonb, 1,
    'Vishnu, who is worshipped by gods, performed intense penance and yoga practice at this location for hundreds of eras.',
    'इह राम महाबाहो विष्णुर्देवनमस्कृतः | वर्षाणि सुबहूनीह तथा युगशतानि च',
    'Here, oh dextrous Rama, he who is worshipped by gods and who has got outstanding ascesis that Vishnu resided here in the pursuit of practising ascesis and yoga for good many years, likewise for a hundred eras',
    '{"Vishnu","divine penance","spiritual practice"}', '{"divine asceticism","sacred history"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga29/bala_29_frame.htm'
);

-- Hard Questions for Sarga 29 (Questions 13-15)

-- Hard Question 1 for Sarga 29
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 29, 'themes', 'hard',
    'In the context of Sarga 29 narrative about Siddhaashrama, how does the cyclical nature of divine incarnations performing penance at the same location reflect the Hindu concept of sacred geography and spiritual continuity across cosmic cycles?',
    '["Sacred places lose their power over time and need renewal","Each incarnation creates entirely new spiritual energy at different locations","Sacred geography maintains eternal spiritual potency, with divine beings repeatedly choosing the same locations for spiritual practice across different cosmic cycles","Physical location has no significance in spiritual practice"]'::jsonb, 2,
    'The narrative demonstrates that sacred geography possesses eternal spiritual potency that transcends individual cosmic cycles. Vishnu choice to perform penance at this location, followed by his later incarnation as Vamana also using the same space, illustrates how certain geographical points maintain their spiritual significance across different yugas and incarnations, serving as consistent focal points for divine activity.',
    'एष पूर्वाश्रमो राम वामनस्य महात्मनः | सिद्धाश्रम इति ख्यातः',
    'This is the erstwhile hermitage of great-souled Vaamana renowned as Accomplished hermitage',
    '{"sacred geography","cosmic cycles","spiritual continuity"}', '{"eternal significance","divine locations"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga29/bala_29_frame.htm'
);

-- Hard Question 2 for Sarga 29
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 29, 'themes', 'hard',
    'How does King Bali character as described in Sarga 29 embody the complex relationship between dharmic excellence and cosmic imbalance in Hindu thought, particularly regarding the principle that even virtuous excess can necessitate divine intervention?',
    '["Bali is portrayed as purely evil requiring destruction","Bali represents perfect virtue that needs no correction","Bali embodies the principle that even virtuous qualities, when excessive, can disrupt cosmic balance and require divine moderation","Bali character is irrelevant to cosmic order"]'::jsonb, 2,
    'King Bali exemplifies the Hindu philosophical principle that even positive qualities, when excessive, can create cosmic imbalance. His extraordinary generosity and ritual perfection, while virtuous, led to a disruption of the natural cosmic hierarchy. This necessitated divine intervention not to punish evil, but to restore balance, demonstrating that dharma sometimes requires limiting even virtuous excess for the greater cosmic good.',
    'बलिर्वैरोचनिर्विष्णो यजते यज्ञमुत्तमम्',
    'Bali the son of Virochana is conducting an unsurpassed Vedic ritual',
    '{"cosmic balance","virtuous excess","divine intervention"}', '{"dharmic complexity","philosophical nuance"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga29/bala_29_frame.htm'
);

-- Hard Question 3 for Sarga 29
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 29, 'themes', 'hard',
    'In the narrative structure of Sarga 29, how does Vishvamitra strategic placement of the Vamana-Bali story at this specific moment in Rama journey function as both historical exposition and prophetic guidance for Rama own dharmic mission?',
    '["The story is merely historical information with no contemporary relevance","The story serves only to explain the hermitage significance","The story functions as both historical context and a coded message about Rama need to intervene in cosmic imbalances through incarnational duty","The story is unrelated to Rama current situation"]'::jsonb, 2,
    'Vishvamitra narrative serves a dual function: while explaining the hermitage sacred history, it also provides Rama with a paradigm for his own mission. The story of Vamana intervention to restore cosmic balance when virtuous but excessive power disrupted natural order serves as a template for Rama understanding of his incarnational duty to intervene in dharmic imbalances, suggesting that divine intervention is sometimes necessary even in complex moral situations.',
    'विश्वामित्रो महातेजा व्याख्यातुमुपचक्रमे',
    'That highly resplendent sage Vishvamitra started to narrate about that forest',
    '{"prophetic guidance","incarnational duty","narrative strategy"}', '{"teaching methodology","divine instruction"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga29/bala_29_frame.htm'
);