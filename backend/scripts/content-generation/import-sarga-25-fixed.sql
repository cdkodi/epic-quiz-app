-- Sarga 25 Import - Fixed Schema
-- Question 1
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 25, 'characters', 'easy',
    'Who is the demoness that Sage Vishvamitra narrates about in this section?',
    '["Sita","Tataka","Ahalya","Mandodari"]'::jsonb, 1,
    'Sage Vishvamitra narrates the story of Tataka, a demoness who was once a Yakshini but was cursed by Sage Agastya.',
    'अल्पवीर्या यदा यक्षी श्रूयते मुनिपुङ्गव | कथं नागसहस्रस्य धारयत्यबला बलम् || १-२५-२',
    'It is said that yaksha strength is trivial, and this is a yakshii, more so a female, how then this yakshii frail by her femineity can exert the strength of a thousand elephants?',
    '{"Tataka","demoness","Sage Vishvamitra"}', '{"character identification","narrative introduction"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm'
);

-- Question 2
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 25, 'culture', 'medium',
    'What extraordinary strength was given to Tataka by Brahma?',
    '["Strength of a hundred lions","Strength of a thousand elephants","Strength of a thousand horses","Strength of the wind"]'::jsonb, 1,
    'Brahma blessed Tataka with the strength of a thousand elephants, making her an extremely powerful being.',
    'ददौ नागसहस्रस्य बलं चास्याः पितामहः',
    'Forefather Brahma also gave the strength of a thousand elephants to her',
    '{"divine blessing","supernatural strength","Brahma"}', '{"divine powers","superhuman abilities"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm'
);

-- Question 3
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 25, 'characters', 'medium',
    'Who was Tataka husband?',
    '["Sunda","Ravana","Vali","Sugriva"]'::jsonb, 0,
    'Tataka was married to Sunda, the son of Jambha, making her a member of the demon clan through marriage.',
    'तां तु बालां विवर्धन्तीं रूपयौवनशालिनीम् | जंभपुत्राय सुन्दाय ददौ भार्यां यशस्विनीम् || १-२५-८',
    'When that bright girl is growing up into a youthful beauty her father Suketu gave her to Jambha s son Sunda as wife',
    '{"Tataka","Sunda","marriage","demon clan"}', '{"character relationships","family lineage"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm'
);

-- Question 4
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 25, 'themes', 'hard',
    'What does the narrative structure of Tataka story reveal about the relationship between divine blessings and cosmic balance?',
    '["Divine blessings are always permanent and unchangeable","Divine blessings can become curses when misused, maintaining cosmic balance","Divine blessings only apply to righteous beings","Divine blessings are meaningless in the face of human action"]'::jsonb, 1,
    'The story shows how Tataka divine blessing of strength from Brahma, when combined with her evil actions, necessitated divine intervention through curses to restore cosmic balance.',
    'सैषा शापकृतामर्षा ताटका क्रोधमूर्च्छिता | देशमुत्सादयत्येनमगस्त्याचरितं शुभम्',
    'Frenzied by the curse and convulsed in fury she that Tataka is thus vandalising this auspicious province',
    '{"cosmic balance","divine justice","blessing and curse"}', '{"universal principles","theological concepts"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm'
);

-- Question 5
INSERT INTO questions (
    epic_id, kanda, sarga, category, difficulty,
    question_text, options, correct_answer_id,
    basic_explanation, original_quote, quote_translation,
    tags, cross_epic_tags, source_reference
) VALUES (
    'ramayana', 'bala_kanda', 25, 'themes', 'easy',
    'What is Vishvamitra instructing Rama to do regarding Tataka?',
    '["Capture her","Transform her","Eliminate her","Negotiate with her"]'::jsonb, 2,
    'Sage Vishvamitra instructs Rama to eliminate Tataka for the welfare of cows and Brahmins, as she poses a threat to society.',
    'एनां राघवदुर्वृत्तां यक्षीं परमदारुणाम् | गोब्राह्मणहितार्थाय जहि दुष्टपराक्रमाम्',
    'She that highly atrocious one is with horrific behaviour and malefic valour, hence you shall eliminate this yakshii for the welfare of Brahmans and cows',
    '{"Rama","Tataka","elimination","duty"}', '{"royal duty","protection of society"}',
    'https://www.valmikiramayan.net/utf8/baala/sarga25/bala_5F25_frame.htm'
);